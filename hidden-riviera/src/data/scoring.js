export function parseDurationMinutes(dur = "") {
  const text = dur.toLowerCase();

  if (text.includes("evening")) return 180;

  const hourMatch = text.match(/(\d+(\.\d+)?)\s*h/);
  const minMatch = text.match(/(\d+)\s*min/);

  let mins = 0;

  if (hourMatch) mins += Math.round(parseFloat(hourMatch[1]) * 60);
  if (minMatch) mins += parseInt(minMatch[1], 10);
  if (!mins) mins = 60;

  return mins;
}

function getLiveScores(place) {
  return place.liveScores || {
    traffic: 50,
    pollution: 50,
    seasonal: 50,
    weather: 50,
    overtourism: 50,
  };
}

function getAntiOvertourism(place) {
  return place.antiOvertourism || {
    fragility: 50,
    capacity: 50,
    localBenefit: 50,
  };
}

export function getRecommendationReason(place) {
  const live = getLiveScores(place);
  const anti = getAntiOvertourism(place);
  const reasons = [];

  if (live.pollution >= 65) reasons.push("good air quality");
  if (anti.localBenefit >= 65) reasons.push("strong local benefit");
  if (live.overtourism >= 65) reasons.push("lower overtourism pressure");
  if (live.traffic >= 65) reasons.push("low traffic");
  if (live.weather >= 65) reasons.push("good weather");
  if (live.seasonal >= 65) reasons.push("good seasonal fit");
  if (anti.capacity >= 65) reasons.push("healthy visitor capacity");
  if (anti.fragility <= 40) reasons.push("lower place fragility");

  const selected = reasons.slice(0, 3);

  if (!selected.length) {
    selected.push("balanced live conditions", "moderate visitor pressure");
  }

  return `Recommended today: ${selected.join(", ")}.`;
}

export function getRecommendationSignals(place) {
  const live = getLiveScores(place);
  const anti = getAntiOvertourism(place);
  const signals = [];

  if (live.pollution >= 65) signals.push("good air quality");
  if (anti.localBenefit >= 65) signals.push("strong local benefit");
  if (live.overtourism >= 65) signals.push("lower overtourism pressure");
  if (live.weather >= 65) signals.push("good weather");
  if (live.traffic >= 65) signals.push("low traffic");
  if (anti.capacity >= 65) signals.push("solid visitor capacity");
  if (anti.fragility <= 45) signals.push("lower fragility risk");
  if (live.seasonal >= 65) signals.push("good seasonal fit");

  if (!signals.length) {
    return ["balanced live conditions", "moderate visitor pressure"];
  }

  return signals.slice(0, 3);
}

export function scorePlace(place, vibes, duration, companion) {
  let score = place.score || 0;

  const vibeMatches = vibes.filter((vibe) => place.tags.includes(vibe)).length;
  score += vibeMatches * 30;

  if (place.durationFit.includes(duration)) score += 12;
  else score -= 18;

  if (place.companions.includes(companion)) score += 18;
  else score -= 22;

  if (companion === "couple") {
    if (["village", "culture", "food", "beach"].includes(place.type)) score += 10;
    if (place.name.toLowerCase().includes("sunset")) score += 8;
  }

  if (companion === "friends") {
    if (["adventure", "beach", "food"].includes(place.type)) score += 10;
  }

  if (companion === "family") {
    if (place.type === "adventure") score -= 14;
    if (["village", "culture", "food", "beach"].includes(place.type)) score += 8;
  }

  if (companion === "solo") {
    if (["nature", "culture", "village"].includes(place.type)) score += 10;
  }

  if (duration === "half") {
    const baseDuration = parseDurationMinutes(place.dur);
    if (baseDuration >= 120) score -= 8;
  }

  if (place.crowd === "very low") score += 8;
  if (place.crowd === "low") score += 4;
  if (place.crowd === "medium") score -= 4;

  if (place.active === false) score -= 9999;

  const live = getLiveScores(place);

  // liveScores nudge finalScore with weighted live-context points; overtourism
  // carries the largest live weight, so it can move a place more in ranking.
  score += live.traffic * 0.20;
  score += live.pollution * 0.15;
  score += live.seasonal * 0.25;
  score += live.weather * 0.10;
  score += live.overtourism * 0.35;

  const anti = getAntiOvertourism(place);

  // antiOvertourism adjusts finalScore toward responsible choices: higher
  // capacity and local benefit help, while fragile places are penalized.
  score += anti.capacity * 0.20;
  score += anti.localBenefit * 0.20;
  score -= anti.fragility * 0.25;

  console.log(place.name, {
    finalScore: score,
    anti: place.antiOvertourism,
    live: place.liveScores,
  });

  return score;
}
