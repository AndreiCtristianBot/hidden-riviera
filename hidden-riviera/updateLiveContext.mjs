import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tomtomKey = process.env.TOMTOM_API_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Lipsesc SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY în .env");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function average(values) {
  const valid = values.filter((v) => typeof v === "number" && Number.isFinite(v));
  if (!valid.length) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

function scoreWeather({ precipitationAvg, windAvg }) {
  let score = 100;

  if (precipitationAvg > 0.2) score -= 20;
  if (precipitationAvg > 1) score -= 35;
  if (precipitationAvg > 3) score -= 55;

  if (windAvg > 25) score -= 15;
  if (windAvg > 40) score -= 30;
  if (windAvg > 55) score -= 50;

  return clamp(score);
}

function scorePollution({ pm25Avg, pm10Avg, europeanAqiAvg }) {
  if (typeof europeanAqiAvg === "number") {
    return clamp(100 - europeanAqiAvg);
  }

  let score = 100;

  if (pm25Avg > 10) score -= 15;
  if (pm25Avg > 20) score -= 30;
  if (pm25Avg > 35) score -= 50;

  if (pm10Avg > 20) score -= 10;
  if (pm10Avg > 40) score -= 25;
  if (pm10Avg > 70) score -= 45;

  return clamp(score);
}

function scoreTraffic(flowSegmentData) {
  if (!flowSegmentData) return 50;

  const currentSpeed = flowSegmentData.currentSpeed;
  const freeFlowSpeed = flowSegmentData.freeFlowSpeed;
  const currentTravelTime = flowSegmentData.currentTravelTime;
  const freeFlowTravelTime = flowSegmentData.freeFlowTravelTime;

  if (
    typeof currentSpeed === "number" &&
    typeof freeFlowSpeed === "number" &&
    freeFlowSpeed > 0
  ) {
    return clamp((currentSpeed / freeFlowSpeed) * 100);
  }

  if (
    typeof currentTravelTime === "number" &&
    typeof freeFlowTravelTime === "number" &&
    currentTravelTime > 0
  ) {
    return clamp((freeFlowTravelTime / currentTravelTime) * 100);
  }

  return 50;
}

function fallbackTraffic(reason) {
  return {
    traffic_score: 50,
    raw: {
      fallback: true,
      reason,
    },
  };
}

function getSeasonalScore(place) {
  const month = new Date().getMonth() + 1;

  const currentSeason =
    month >= 3 && month <= 5
      ? "spring"
      : month >= 6 && month <= 8
        ? "summer"
        : month >= 9 && month <= 11
          ? "autumn"
          : "winter";

  const bestSeason = place.best_season || [];

  if (!bestSeason.length) return 50;
  if (bestSeason.includes(currentSeason)) return 90;

  return 55;
}

function getOvertourismScore(place) {
  const crowdPenalty = (place.crowd_score ?? 2) * 12;
  const fragilityPenalty = (place.fragility_score ?? 50) * 0.35;
  const capacityBonus = (place.capacity_score ?? 50) * 0.35;

  return clamp(100 - crowdPenalty - fragilityPenalty + capacityBonus);
}

async function fetchWeather(lat, lng) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lng);
  url.searchParams.set("hourly", "precipitation,wind_speed_10m");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo Weather error: ${response.status}`);
  }

  const json = await response.json();

  const precipitationAvg = average(json.hourly?.precipitation || []) ?? 0;
  const windAvg = average(json.hourly?.wind_speed_10m || []) ?? 0;

  return {
    weather_score: scoreWeather({ precipitationAvg, windAvg }),
    raw: {
      precipitationAvg,
      windAvg,
    },
  };
}

async function fetchAirQuality(lat, lng) {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lng);
  url.searchParams.set("hourly", "pm10,pm2_5,european_aqi");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo Air Quality error: ${response.status}`);
  }

  const json = await response.json();

  const pm25Avg = average(json.hourly?.pm2_5 || []);
  const pm10Avg = average(json.hourly?.pm10 || []);
  const europeanAqiAvg = average(json.hourly?.european_aqi || []);

  return {
    pollution_score: scorePollution({ pm25Avg, pm10Avg, europeanAqiAvg }),
    raw: {
      pm25Avg,
      pm10Avg,
      europeanAqiAvg,
    },
  };
}

async function fetchTomTomTraffic(lat, lng) {
  if (!tomtomKey) {
    return fallbackTraffic("TOMTOM_API_KEY missing");
  }

  const url = new URL(
    `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json`
  );
  url.searchParams.set("point", `${lat},${lng}`);
  url.searchParams.set("unit", "KMPH");
  url.searchParams.set("key", tomtomKey);

  try {
    const response = await fetch(url);

    if (response.status === 400) {
      return fallbackTraffic("TomTom Traffic error: 400");
    }

    if (!response.ok) {
      return fallbackTraffic(`TomTom Traffic error: ${response.status}`);
    }

    const json = await response.json();
    const flow = json.flowSegmentData;

    return {
      traffic_score: scoreTraffic(flow),
      raw: flow || json,
    };
  } catch (error) {
    return fallbackTraffic(`TomTom Traffic request failed: ${error.message}`);
  }
}

async function updateOnePlace(place) {
  if (place.lat == null || place.lng == null) {
    console.log(`Skipping ${place.name}: missing lat/lng`);
    return;
  }

  const lat = String(place.lat);
  const lng = String(place.lng);

  try {
    const [weather, air, traffic] = await Promise.all([
      fetchWeather(lat, lng),
      fetchAirQuality(lat, lng),
      fetchTomTomTraffic(lat, lng),
    ]);

    const seasonal_score = getSeasonalScore(place);
    const overtourism_score = getOvertourismScore(place);

    const payload = {
      place_id: place.id,
      traffic_score: traffic.traffic_score,
      pollution_score: air.pollution_score,
      seasonal_score,
      weather_score: weather.weather_score,
      overtourism_score,
      source_summary: {
        weather: {
          source: "open-meteo",
          ...weather.raw,
        },
        air_quality: {
          source: "open-meteo-air-quality",
          ...air.raw,
        },
        traffic: {
          source: tomtomKey ? "tomtom-traffic-flow" : "default",
          ...traffic.raw,
        },
        calculation_version: "live-context-v1",
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("place_live_context")
      .upsert(payload, { onConflict: "place_id" });

    if (error) throw error;

    console.log(
      `Updated ${place.name}: traffic=${payload.traffic_score}, pollution=${payload.pollution_score}, weather=${payload.weather_score}, seasonal=${payload.seasonal_score}, overtourism=${payload.overtourism_score}`
    );
  } catch (error) {
    console.error(`Failed to update ${place.name}:`, error.message);
  }
}

async function main() {
  const { data: places, error } = await supabase
    .from("places")
    .select(`
      id,
      name,
      lat,
      lng,
      crowd_score,
      fragility_score,
      capacity_score,
      best_season,
      active
    `)
    .eq("active", true);

  if (error) {
    throw error;
  }

  console.log(`Found ${places.length} active places.`);

  for (const place of places) {
    await updateOnePlace(place);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log("Live context update complete.");
}

main();
