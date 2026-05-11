import { PLACES, parseDurationMinutes, getPreferredMoment } from "./itineraryData.js";

const crowdScoreMap = {
  none: 0,
  "very low": 1,
  low: 2,
  medium: 3,
};

export const PLACES_DB = PLACES.map((place) => ({
  id: place.id,
  name: place.name,
  description: place.desc,
  image_url: place.img,
  image_storage: place.imageStorage || "local",
  image_origin: place.imageOrigin || "ai_generated",
  type: place.type,
  crowd_level: place.crowd,
  crowd_score: crowdScoreMap[place.crowd] ?? 2,
  tags: place.tags,
  companions: place.companions,
  duration_fit: place.durationFit,
  base_duration_minutes: parseDurationMinutes(place.dur),
  preferred_moment: getPreferredMoment(place),
  base_score: place.score,
  active: place.active !== false,
}));