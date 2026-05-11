import { supabase } from "../lib/supabase.js";

const SESSION_STORAGE_KEY = "hidden_riviera_session_id";

export function getSessionId() {
  const existing = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const fallbackId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const sessionId =
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : fallbackId;

  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

function flattenStops(itinerary) {
  return (itinerary?.days || []).flatMap((day) => day.stops || []);
}

function toScore(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export async function logRecommendation({ vibes, duration, companion, itinerary }) {
  try {
    const sessionId = getSessionId();

    const results = flattenStops(itinerary)
      .filter((stop) => stop.id)
      .filter((stop) => stop.type !== "transit" && stop.id !== "depart-nice")
      .map((stop, index) => ({
        place_id: stop.id,
        rank: index + 1,
        final_score: toScore(stop.finalScore),
        favorability_score: toScore(stop.favorabilityScore ?? stop.favorability_score),
        why: String(stop.why ?? stop.recommendationReason ?? "Recommended by Hidden Riviera.").slice(
          0,
          500
        ),
        live_scores: toObject(stop.liveScores),
        anti_overtourism_scores: toObject(stop.antiOvertourism),
      }));

    if (!results.length) return;

    const { error } = await supabase.functions.invoke("log-recommendation", {
      body: {
        session_id: sessionId,
        vibes,
        duration,
        companion,
        results: results.slice(0, 20),
      },
    });

    if (error) throw error;
  } catch (error) {
    // Logging is analytics only; recommendation rendering must never depend on it.
    console.error("Failed to log recommendation:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
    });
  }
}
