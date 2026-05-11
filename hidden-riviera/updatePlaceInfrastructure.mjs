import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geoapifyKey = process.env.GEOAPIFY_API_KEY;

const GEOAPIFY_RADIUS_METERS = 1000;
const GEOAPIFY_LIMIT = 120;
const API_DELAY_MS = 500;
const GEOAPIFY_CATEGORY_GROUPS = [
  {
    id: "catering",
    categories: ["catering", "catering.restaurant", "catering.cafe", "catering.bar"],
  },
  {
    id: "commercial",
    categories: ["commercial", "commercial.marketplace", "commercial.food_and_drink", "shop", "craft"],
  },
  {
    id: "transport",
    categories: [
      "public_transport",
      "public_transport.platform",
      "public_transport.stop_position",
      "railway",
      "railway.station",
      "railway.halt",
    ],
  },
  {
    id: "parking",
    categories: ["parking", "parking.cars"],
  },
  {
    id: "toilets",
    categories: ["service.toilet", "amenity.toilets"],
  },
  {
    id: "culture",
    categories: ["tourism", "tourism.attraction", "tourism.sights", "heritage", "entertainment.museum"],
  },
  {
    id: "nature",
    categories: ["natural", "beach", "national_park", "leisure.park"],
  },
];

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Lipsesc SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY în .env");
}

if (!geoapifyKey) {
  console.warn("GEOAPIFY_API_KEY is missing. Existing infrastructure scores will be preserved.");
} else {
  console.log("GEOAPIFY_API_KEY loaded. Geoapify POI enrichment enabled.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function softClamp(value, min, max) {
  return clamp(value, min, max);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function textForPlace(place) {
  return [
    place.name,
    place.id,
    place.description,
    place.type,
    ...(Array.isArray(place.tags) ? place.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function countCapped(count, pointsPerItem, maxPoints) {
  return Math.min(count * pointsPerItem, maxPoints);
}

function bucketBonus(count, buckets) {
  for (const bucket of buckets) {
    if (count <= bucket.max) return bucket.points;
  }

  return buckets.at(-1)?.points ?? 0;
}

function parkingCapacityBonus(count) {
  return bucketBonus(count, [
    { max: 0, points: 0 },
    { max: 3, points: 5 },
    { max: 10, points: 10 },
    { max: Infinity, points: 13 },
  ]);
}

function foodCapacityBonus(count) {
  return bucketBonus(count, [
    { max: 0, points: 0 },
    { max: 3, points: 3 },
    { max: 15, points: 6 },
    { max: Infinity, points: 8 },
  ]);
}

function getPlaceProfile(place) {
  const text = textForPlace(place);
  const type = place.type || "";

  return {
    isTransit:
      type === "transit" ||
      place.id === "depart-nice" ||
      includesAny(text, ["départ from nice", "depart from nice"]),
    isFamousPerchedVillage: includesAny(text, ["èze", "eze", "gourdon", "peillon"]),
    isUrbanCoastalTown: includesAny(text, ["villefranche"]),
    isAntibesRamparts: includesAny(text, ["antibes ramparts"]),
    isSmallChapel: includesAny(text, ["chapel", "chapelle"]),
    isRestaurantArtDestination:
      includesAny(text, ["la colombe", "restaurant", "art-world restaurant"]) &&
      includesAny(text, ["art", "culture", "collection"]),
    isHistoricVillage:
      type === "village" || includesAny(text, ["village", "medieval", "perched", "eagle-nest"]),
    isUrbanOrCulture:
      ["food", "culture"].includes(type) ||
      includesAny(text, ["market", "museum", "chapel", "workshop", "nice", "antibes"]),
    isSmallVillage:
      type === "village" ||
      includesAny(text, ["village", "perched", "eagle-nest", "medieval", "stone lanes"]),
    isBeach: type === "beach" || includesAny(text, ["beach", "plage", "swim", "cove"]),
    isNature:
      type === "nature" ||
      includesAny(text, ["trail", "hike", "gorge", "canyon", "plateau", "lake", "col"]),
    isAdventure:
      type === "adventure" ||
      includesAny(text, ["canyoning", "via ferrata", "paragliding", "rappel"]),
    isRefuge: includesAny(text, ["refuge", "mountain refuge", "gite", "guesthouse"]),
    isFoodLocal:
      type === "food" ||
      includesAny(text, [
        "auberge",
        "restaurant",
        "market",
        "olive",
        "vineyard",
        "wine",
        "moulin",
        "domaine",
        "farm",
        "producer",
      ]),
    hasNamedLocalBusinessSignal: includesAny(text, [
      "domaine",
      "moulin",
      "auberge",
      "market",
      "workshop",
      "bastide",
      "colombe",
    ]),
    isSpecialAccess:
      includesAny(text, [
        "steep",
        "hidden",
        "secret",
        "cliff",
        "canyon",
        "refuge",
        "narrow",
        "silence",
        "quietest",
      ]),
  };
}

function getPlaceCategory(place, profile = getPlaceProfile(place)) {
  if (profile.isTransit) return "transit";
  if (profile.isRestaurantArtDestination) return "urban";
  if (profile.isUrbanCoastalTown) return "urban";
  if (profile.isAntibesRamparts) return "urban";
  if (profile.isAdventure || profile.isRefuge || includesAny(textForPlace(place), ["canyon"])) {
    return "sensitive_adventure";
  }
  if (profile.isNature) return "nature";
  if (profile.isBeach) return "beach";
  if (profile.isSmallVillage) return "village";
  if (profile.isUrbanOrCulture || profile.isFoodLocal) return "urban";
  return "generic";
}

function getFeatureSearchText(feature) {
  const categories = feature?.properties?.categories || [];
  const categoryText = Array.isArray(categories) ? categories.join(" ") : String(categories);
  const raw = feature?.properties?.datasource?.raw || {};
  const rawText = Object.entries(raw)
    .filter(([, value]) => typeof value === "string" || typeof value === "number")
    .map(([key, value]) => `${key} ${key}=${value}`)
    .join(" ");
  const name = feature?.properties?.name || "";
  return `${categoryText} ${name} ${rawText}`.toLowerCase();
}

function getFeatureCategories(feature) {
  const categories = feature?.properties?.categories || [];
  return Array.isArray(categories) ? categories.map((category) => String(category).toLowerCase()) : [];
}

function getFeatureRaw(feature) {
  return feature?.properties?.datasource?.raw || {};
}

function hasExactCategory(feature, categoriesToMatch) {
  const categories = new Set(getFeatureCategories(feature));
  return categoriesToMatch.some((category) => categories.has(category));
}

function rawEquals(raw, key, value) {
  return String(raw?.[key] || "").toLowerCase() === value;
}

function isTruePublicToilet(feature) {
  const raw = getFeatureRaw(feature);
  return (
    hasExactCategory(feature, ["service.toilet", "amenity.toilets"]) ||
    rawEquals(raw, "amenity", "toilets") ||
    rawEquals(raw, "service", "toilet")
  );
}

function hasCategory(feature, words) {
  return includesAny(getFeatureSearchText(feature), words);
}

function countPoiSignals(feature) {
  const text = getFeatureSearchText(feature);
  const sourceGroups = new Set(feature.__queryGroups || []);

  return {
    parking:
      sourceGroups.has("parking") ||
      includesAny(text, ["parking", "parking.cars", "amenity=parking"]),
    transport:
      sourceGroups.has("transport") ||
      includesAny(text, [
        "public_transport",
        "public_transport.platform",
        "public_transport.station",
        "public_transport.stop_position",
        "railway",
        "railway.station",
        "railway.halt",
        "bus",
        "bus_stop",
        "amenity.bus_station",
        "amenity=bus_station",
        "tram",
        "train",
        "station",
      ]),
    toilets: sourceGroups.has("toilets") || isTruePublicToilet(feature),
    food:
      sourceGroups.has("catering") ||
      includesAny(text, [
        "catering",
        "catering.restaurant",
        "catering.cafe",
        "catering.bar",
        "commercial.food",
        "commercial.food_and_drink",
        "amenity=restaurant",
        "amenity=cafe",
        "amenity=bar",
        "restaurant",
        "cafe",
        "bar",
        "food",
      ]),
    culture:
      sourceGroups.has("culture") ||
      includesAny(text, [
        "tourism",
        "tourism.attraction",
        "tourism.museum",
        "tourism.sights",
        "entertainment.museum",
        "heritage",
        "building.historic",
        "museum",
        "culture",
        "attraction",
      ]),
    localCommerce:
      sourceGroups.has("commercial") ||
      includesAny(text, [
        "commercial",
        "commercial.marketplace",
        "commercial.food_and_drink",
        "shop",
        "craft",
        "winery",
        "vineyard",
        "farm",
        "tourism.winery",
        "market",
        "marketplace",
      ]),
  };
}

function summarizePois(features = []) {
  const metrics = {
    parking: 0,
    transport: 0,
    toilets: 0,
    restaurants: 0,
    cafes: 0,
    food: 0,
    tourism: 0,
    culture: 0,
    shops: 0,
    localFood: 0,
    craft: 0,
    market: 0,
    vineyard: 0,
    localCommerce: 0,
    localProducers: 0,
    sensitiveNature: 0,
    total: features.length,
  };

  for (const feature of features) {
    const signals = countPoiSignals(feature);

    if (signals.parking) metrics.parking += 1;
    if (signals.transport) metrics.transport += 1;
    if (signals.toilets) metrics.toilets += 1;
    if (signals.food) {
      metrics.food += 1;
      metrics.localFood += 1;
    }
    if (signals.culture) {
      metrics.culture += 1;
      metrics.tourism += 1;
    }
    if (signals.localCommerce) metrics.localCommerce += 1;

    if (hasCategory(feature, ["restaurant", "amenity=restaurant", "catering.restaurant"])) {
      metrics.restaurants += 1;
    }
    if (hasCategory(feature, ["cafe", "coffee", "amenity=cafe", "catering.cafe"])) {
      metrics.cafes += 1;
    }
    if (hasCategory(feature, ["commercial", "shop"])) {
      metrics.shops += 1;
    }
    if (hasCategory(feature, ["craft", "artisan"])) metrics.craft += 1;
    if (hasCategory(feature, ["market"])) metrics.market += 1;
    if (hasCategory(feature, ["winery", "vineyard"])) metrics.vineyard += 1;
    if (hasCategory(feature, ["winery", "vineyard", "farm", "market", "olive", "producer"])) {
      metrics.localProducers += 1;
    }
    if (hasCategory(feature, ["protected", "reserve", "natural", "beach", "cliff", "cave"])) {
      metrics.sensitiveNature += 1;
    }
  }

  return metrics;
}

function getUsefulSignalsCount(metrics) {
  return [metrics.parking, metrics.toilets, metrics.food, metrics.transport, metrics.culture, metrics.localCommerce]
    .filter((count) => count > 0).length;
}

function limitScoreChange(existing, next, maxDelta = 15) {
  if (typeof existing !== "number" || !Number.isFinite(existing)) return next;
  return clamp(next, existing - maxDelta, existing + maxDelta);
}

function limitMediumConfidenceChanges(place, scores) {
  return {
    capacity_score: limitScoreChange(place.capacity_score, scores.capacity_score, 10),
    local_benefit_score: limitScoreChange(
      place.local_benefit_score,
      scores.local_benefit_score,
      10
    ),
    fragility_score: limitScoreChange(place.fragility_score, scores.fragility_score, 10),
  };
}

function hasUsefulPoiData(metrics) {
  return getUsefulSignalsCount(metrics) > 0;
}

function getInfrastructureConfidence(poiResult, usefulSignalsCount) {
  if (poiResult.fallbackReason) return "low";
  if (usefulSignalsCount >= 2) return "high";
  if (usefulSignalsCount === 1) return "medium";
  return "low";
}

function getFeatureDedupeKey(feature) {
  const properties = feature?.properties || {};
  const raw = properties.datasource?.raw || {};
  const coordinates = feature?.geometry?.coordinates || [];
  const lon = typeof coordinates[0] === "number" ? coordinates[0].toFixed(5) : "";
  const lat = typeof coordinates[1] === "number" ? coordinates[1].toFixed(5) : "";
  const name = String(properties.name || raw.name || "").toLowerCase().trim();

  return (
    properties.place_id ||
    properties.osm_id ||
    raw.osm_id ||
    raw.way_id ||
    raw.node_id ||
    `${lat}:${lon}:${name}`
  );
}

function mergeFeatureGroups(existingFeature, nextGroupId) {
  const groups = new Set(existingFeature.__queryGroups || []);
  groups.add(nextGroupId);
  existingFeature.__queryGroups = [...groups];
  return existingFeature;
}

async function fetchGeoapifyGroup(place, group) {
  const url = new URL("https://api.geoapify.com/v2/places");
  url.searchParams.set("categories", group.categories.join(","));
  url.searchParams.set(
    "filter",
    `circle:${place.lng},${place.lat},${GEOAPIFY_RADIUS_METERS}`
  );
  url.searchParams.set("bias", `proximity:${place.lng},${place.lat}`);
  url.searchParams.set("limit", String(GEOAPIFY_LIMIT));
  url.searchParams.set("apiKey", geoapifyKey);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        groupId: group.id,
        apiStatus: response.status === 429 ? "rate_limited" : "failed",
        features: [],
        fallbackReason: `Geoapify Places error: ${response.status}`,
      };
    }

    const json = await response.json();
    const features = Array.isArray(json.features) ? json.features : [];
    return {
      groupId: group.id,
      apiStatus: features.length ? "ok" : "zero_features",
      features: features.map((feature) => ({
        ...feature,
        __queryGroups: [group.id],
      })),
      fallbackReason: features.length ? null : "Geoapify returned zero features",
    };
  } catch (error) {
    return {
      groupId: group.id,
      apiStatus: "failed",
      features: [],
      fallbackReason: `Geoapify request failed: ${error.message}`,
    };
  }
}

async function fetchGeoapifyPois(place) {
  if (!geoapifyKey) {
    return {
      apiStatus: "missing_key",
      features: [],
      groupCounts: {},
      fallbackReason: "GEOAPIFY_API_KEY missing",
    };
  }

  const groupResults = await Promise.all(
    GEOAPIFY_CATEGORY_GROUPS.map((group) => fetchGeoapifyGroup(place, group))
  );
  const mergedByKey = new Map();
  const groupCounts = Object.fromEntries(groupResults.map((result) => [result.groupId, result.features.length]));
  const failedResults = groupResults.filter((result) => result.apiStatus === "failed");
  const rateLimitedResults = groupResults.filter((result) => result.apiStatus === "rate_limited");

  for (const result of groupResults) {
    for (const feature of result.features) {
      const key = getFeatureDedupeKey(feature);
      if (mergedByKey.has(key)) {
        mergeFeatureGroups(mergedByKey.get(key), result.groupId);
      } else {
        mergedByKey.set(key, feature);
      }
    }
  }

  const features = [...mergedByKey.values()];
  const apiStatus = features.length
    ? failedResults.length || rateLimitedResults.length
      ? "partial"
      : "ok"
    : rateLimitedResults.length
      ? "rate_limited"
      : failedResults.length === groupResults.length
        ? "failed"
        : "zero_features";
  const fallbackReason = features.length
    ? null
    : apiStatus === "rate_limited"
      ? "Geoapify rate limited all useful category queries"
      : apiStatus === "failed"
        ? "Geoapify failed all useful category queries"
        : "Geoapify returned zero features";

  return {
    apiStatus,
    features,
    groupCounts,
    fallbackReason,
  };
}

function scoreCapacity(place, metrics) {
  const profile = getPlaceProfile(place);
  const category = getPlaceCategory(place, profile);
  const priors = {
    urban: 58,
    village: 42,
    beach: 36,
    nature: 28,
    sensitive_adventure: 24,
    transit: 38,
    generic: 40,
  };

  let score = priors[category];

  // Capacity starts from place type, then receives modest infrastructure bonuses.
  // Food helps comfort, but cannot by itself make a fragile place high-capacity.
  score += parkingCapacityBonus(metrics.parking);
  score += countCapped(metrics.transport, 5, 18);
  score += countCapped(metrics.toilets, 5, 12);
  score += foodCapacityBonus(metrics.food);
  score += countCapped(metrics.total, 0.35, 8);

  if (profile.isFoodLocal) score += 3;
  if (profile.isSmallVillage) score -= 5;
  if (profile.isBeach) score -= 4;
  if (profile.isNature) score -= 6;
  if (profile.isAdventure || profile.isRefuge) score -= 7;
  if (profile.isSpecialAccess) score -= 5;
  if ((place.crowd_score ?? 2) >= 3) score -= 4;
  if (profile.isUrbanCoastalTown && metrics.food >= 8 && metrics.transport >= 4) score += 10;
  if (profile.isFamousPerchedVillage) score -= 8;
  if (profile.isTransit) score -= 8;

  const hasStrongNonTransportSupport =
    metrics.parking >= 4 || metrics.food >= 8 || metrics.culture >= 5 || metrics.localCommerce >= 4;
  if (metrics.parking === 0 && metrics.transport <= 1 && !hasStrongNonTransportSupport) {
    score = Math.min(score, 48);
  }
  if (metrics.parking === 0 && metrics.transport === 0 && metrics.toilets === 0) {
    score = Math.min(score, hasStrongNonTransportSupport ? 52 : 40);
  }
  if (metrics.parking < 2 && metrics.transport < 3) score = Math.min(score, 78);
  if (metrics.parking < 3 && metrics.transport < 4) score = Math.min(score, 85);
  if (place.type === "village" && metrics.transport <= 25 && metrics.parking <= 2) {
    score = Math.min(score, 60);
  }
  if (profile.isFamousPerchedVillage) score = Math.min(score, 55);

  const ranges = {
    urban: [45, metrics.parking >= 3 || metrics.transport >= 4 ? 92 : 85],
    village: [28, 72],
    beach: [24, 68],
    nature: [15, 58],
    sensitive_adventure: [12, 55],
    transit: [25, 55],
    generic: [25, 75],
  };
  const [min, max] = ranges[category];

  return softClamp(score, min, max);
}

function scoreLocalBenefit(place, metrics) {
  const profile = getPlaceProfile(place);
  const category = getPlaceCategory(place, profile);
  const priors = {
    urban: profile.isFoodLocal ? 68 : 58,
    village: 58,
    beach: 38,
    nature: 34,
    sensitive_adventure: 36,
    transit: 28,
    generic: 45,
  };

  let score = priors[category];

  // Local benefit is strongest for actual commerce/producer/culture nodes.
  // Generic tourism signals help, but are intentionally light to avoid 100s.
  score += countCapped(metrics.restaurants, 3, 12);
  score += countCapped(metrics.cafes, 2, 8);
  score += countCapped(metrics.shops, 3, 12);
  score += countCapped(metrics.localProducers, 5, 18);
  score += countCapped(metrics.culture, 3, 12);
  score += countCapped(metrics.tourism, 1, 6);

  if (profile.isFoodLocal) score += 6;
  if (profile.hasNamedLocalBusinessSignal && !profile.isTransit) score += 10;
  if (profile.isSmallVillage) score += 4;
  if (profile.isUrbanOrCulture) score += 3;
  if (profile.isNature && !profile.isFoodLocal) score -= 8;
  if (profile.isBeach && !profile.isFoodLocal) score -= 6;
  if ((profile.isAdventure || profile.isRefuge) && metrics.food < 2) score -= 6;
  if (profile.isUrbanCoastalTown && metrics.food >= 8) score += 8;
  if (profile.isTransit) score -= 18;

  const clearLocalBusiness =
    profile.isFoodLocal ||
    profile.hasNamedLocalBusinessSignal ||
    metrics.localProducers >= 2 ||
    metrics.shops >= 4 ||
    metrics.food >= 6;

  if (profile.hasNamedLocalBusinessSignal && !profile.isTransit) score = Math.min(score, 96);
  if (profile.isTransit) score = Math.min(score, 30);
  if (!clearLocalBusiness && category === "village") score = Math.min(score, 78);
  if (!clearLocalBusiness && ["beach", "nature", "sensitive_adventure"].includes(category)) {
    score = Math.min(score, 62);
  }
  if (!clearLocalBusiness) score = Math.min(score, 84);

  const ranges = {
    urban: [45, clearLocalBusiness ? 96 : 84],
    village: [45, clearLocalBusiness ? 88 : 78],
    beach: [25, clearLocalBusiness ? 78 : 62],
    nature: [25, clearLocalBusiness ? 72 : 58],
    sensitive_adventure: [25, clearLocalBusiness ? 76 : 60],
    transit: [0, 30],
    generic: [30, clearLocalBusiness ? 85 : 70],
  };
  const [min, max] = ranges[category];

  return softClamp(score, min, max);
}

function scoreFragility(place, metrics, capacityScore) {
  const profile = getPlaceProfile(place);
  const category = getPlaceCategory(place, profile);
  const priors = {
    urban: 48,
    village: 68,
    beach: 76,
    nature: 78,
    sensitive_adventure: 84,
    transit: 45,
    generic: 58,
  };

  let score = priors[category];

  // Fragility follows type ranges, then shifts with low capacity, crowding,
  // sensitive natural signals, and missing basic visitor infrastructure.
  score += (50 - capacityScore) * 0.18;
  score += ((place.crowd_score ?? 2) - 2) * 5;
  score += countCapped(metrics.sensitiveNature, 2.5, 10);

  if (profile.isSpecialAccess) score += 6;
  if (metrics.parking === 0) score += 4;
  if (metrics.toilets === 0) score += 3;
  if (metrics.transport === 0) score += 3;
  if (capacityScore >= 65) score -= 5;
  if (capacityScore >= 80) score -= 5;
  if (profile.isUrbanOrCulture && capacityScore >= 60) score -= 6;
  if (profile.isFoodLocal && capacityScore >= 55) score -= 3;
  if (profile.isFamousPerchedVillage) score += 8;
  if (profile.isUrbanCoastalTown && capacityScore >= 70) score -= 8;
  if (profile.isAntibesRamparts) score -= 10;
  if (profile.isRestaurantArtDestination) score -= 12;
  if (
    place.type === "culture" &&
    profile.isUrbanOrCulture &&
    !profile.isSmallChapel &&
    !profile.isHistoricVillage &&
    !profile.isNature
  ) {
    score = Math.min(score, 80);
  }

  const extremeSensitive =
    category === "sensitive_adventure" &&
    capacityScore <= 25 &&
    (place.crowd_score ?? 2) >= 3 &&
    metrics.toilets === 0;

  const isRobustUrbanInfrastructure =
    category === "urban" &&
    capacityScore >= 75 &&
    (metrics.parking >= 4 || metrics.transport >= 4) &&
    (metrics.food >= 8 || metrics.culture >= 6 || metrics.localCommerce >= 4);
  const urbanFragilityMin = isRobustUrbanInfrastructure
    ? 35
    : place.type === "culture" || metrics.culture > 0
      ? 45
      : place.type === "food" || profile.isFoodLocal
        ? 40
        : 35;

  const ranges = {
    urban: [urbanFragilityMin, profile.isRestaurantArtDestination ? 70 : 65],
    village: [60, 85],
    beach: [70, 90],
    nature: [70, 90],
    sensitive_adventure: [80, extremeSensitive ? 100 : 95],
    transit: [25, 55],
    generic: [45, 75],
  };
  const [min, max] = ranges[category];

  return softClamp(score, min, max);
}

function calculateScores(place, metrics) {
  const capacity_score = scoreCapacity(place, metrics);
  const local_benefit_score = scoreLocalBenefit(place, metrics);
  const fragility_score = scoreFragility(place, metrics, capacity_score);

  return {
    capacity_score,
    local_benefit_score,
    fragility_score,
  };
}

async function updateOnePlace(place) {
  if (getPlaceProfile(place).isTransit) {
    console.log(
      `Skipped infrastructure update for ${place.name}: transit/logistics place is not a recommendation destination.`
    );
    return;
  }

  const poiResult = await fetchGeoapifyPois(place);
  let metrics = summarizePois(poiResult.features);
  const usefulSignalsCount = getUsefulSignalsCount(metrics);
  let infrastructureConfidence = getInfrastructureConfidence(poiResult, usefulSignalsCount);

  if (poiResult.fallbackReason || !hasUsefulPoiData(metrics)) {
    infrastructureConfidence = "low";
    console.log(
      `Geoapify unreliable for ${place.name}: ${poiResult.fallbackReason || "Geoapify returned no usable POI features"}`
    );
  }

  console.log(
    `POI status for ${place.name}: apiStatus=${poiResult.apiStatus}, featuresCount=${poiResult.features.length}, usefulSignalsCount=${usefulSignalsCount}, parking=${metrics.parking}, toilets=${metrics.toilets}, food=${metrics.food}, transport=${metrics.transport}, culture=${metrics.culture}, localCommerce=${metrics.localCommerce}, confidence=${infrastructureConfidence}, existingCapacity=${place.capacity_score}, existingLocalBenefit=${place.local_benefit_score}, existingFragility=${place.fragility_score}`
  );

  if (infrastructureConfidence === "low") {
    const reason =
      poiResult.features.length > 0 && usefulSignalsCount === 0
        ? "POIs returned but no useful scoring signals."
        : "no reliable POI data.";
    console.log(`Skipped infrastructure update for ${place.name}: ${reason}`);
    return;
  }

  const calculatedScores = calculateScores(place, metrics);
  const scores =
    infrastructureConfidence === "medium"
      ? limitMediumConfidenceChanges(place, calculatedScores)
      : calculatedScores;

  const { error } = await supabase
    .from("places")
    .update(scores)
    .eq("id", place.id);

  if (error) {
    throw error;
  }

  console.log(
    `Updated ${place.name}: type=${place.type}, capacity=${scores.capacity_score}, localBenefit=${scores.local_benefit_score}, fragility=${scores.fragility_score}, rawCapacity=${calculatedScores.capacity_score}, rawLocalBenefit=${calculatedScores.local_benefit_score}, rawFragility=${calculatedScores.fragility_score}, apiStatus=${poiResult.apiStatus}, featuresCount=${poiResult.features.length}, usefulSignalsCount=${usefulSignalsCount}, parking=${metrics.parking}, toilets=${metrics.toilets}, food=${metrics.food}, transport=${metrics.transport}, culture=${metrics.culture}, localCommerce=${metrics.localCommerce}, confidence=${infrastructureConfidence}, existingCapacity=${place.capacity_score}, existingLocalBenefit=${place.local_benefit_score}, existingFragility=${place.fragility_score}`
  );
}

async function main() {
  const { data: places, error } = await supabase
    .from("places")
    .select(`
      id,
      name,
      description,
      type,
      tags,
      crowd_level,
      crowd_score,
      lat,
      lng,
      fragility_score,
      capacity_score,
      local_benefit_score,
      substitute_for,
      best_season,
      active
    `)
    .eq("active", true)
    .not("lat", "is", null)
    .not("lng", "is", null);

  if (error) {
    throw error;
  }

  console.log(`Found ${places.length} active places with coordinates.`);

  for (const place of places) {
    try {
      await updateOnePlace(place);
    } catch (error) {
      console.error(`Failed to update ${place.name}:`, error.message);
    }

    await delay(API_DELAY_MS);
  }

  console.log("Infrastructure score update complete.");
}

main();
