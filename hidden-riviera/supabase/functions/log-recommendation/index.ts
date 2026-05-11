import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_BODY_BYTES = 40_000;
const ALLOWED_VIBES = new Set(["mountain", "village", "beach", "food", "adventure", "culture"]);
const ALLOWED_DURATIONS = new Set(["half", "full", "weekend"]);
const ALLOWED_COMPANIONS = new Set(["solo", "couple", "friends", "family"]);

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const productionOrigin = Deno.env.get("ALLOWED_ORIGIN");

function getCorsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = new Set([
    "https://hiddenriviera.netlify.app",
    "http://localhost:5173",
    "http://localhost:5174",
    productionOrigin,
  ].filter(Boolean));
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };

  if (allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function isAllowedOrigin(request: Request) {
  return Boolean(getCorsHeaders(request)["Access-Control-Allow-Origin"]);
}

function jsonResponse(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(request),
      "Content-Type": "application/json",
    },
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoundedString(value: unknown, maxLength: number) {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

function isNumberInRange(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function validatePayload(payload: unknown) {
  if (!isPlainObject(payload)) return "Payload must be a JSON object.";

  const { session_id, vibes, duration, companion, results } = payload;

  if (!isBoundedString(session_id, 100)) return "session_id must be a string up to 100 chars.";
  if (!Array.isArray(vibes) || vibes.length > 6) return "vibes must be an array with max 6 values.";
  if (!vibes.every((vibe) => typeof vibe === "string" && ALLOWED_VIBES.has(vibe))) {
    return "vibes contains an invalid value.";
  }
  if (typeof duration !== "string" || !ALLOWED_DURATIONS.has(duration)) {
    return "duration is invalid.";
  }
  if (typeof companion !== "string" || !ALLOWED_COMPANIONS.has(companion)) {
    return "companion is invalid.";
  }
  if (!Array.isArray(results) || results.length < 1 || results.length > 20) {
    return "results must contain 1 to 20 items.";
  }

  for (const result of results) {
    if (!isPlainObject(result)) return "Each result must be an object.";
    if (!isBoundedString(result.place_id, 100)) return "place_id must be a string up to 100 chars.";
    if (!Number.isInteger(result.rank) || result.rank < 1 || result.rank > 20) {
      return "rank must be an integer between 1 and 20.";
    }
    if (!isNumberInRange(result.final_score, 0, 1000)) {
      return "final_score must be a number between 0 and 1000.";
    }
    if (!isNumberInRange(result.favorability_score, 0, 1000)) {
      return "favorability_score must be a number between 0 and 1000.";
    }
    if (!isBoundedString(result.why, 500)) return "why must be a string up to 500 chars.";
    if (!isPlainObject(result.live_scores)) return "live_scores must be an object.";
    if (!isPlainObject(result.anti_overtourism_scores)) {
      return "anti_overtourism_scores must be an object.";
    }
  }

  return null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    if (!isAllowedOrigin(request)) {
      return new Response("Forbidden origin.", {
        status: 403,
        headers: getCorsHeaders(request),
      });
    }

    return new Response("ok", { headers: getCorsHeaders(request) });
  }

  if (request.method !== "POST") {
    return jsonResponse(request, { error: "Method not allowed." }, 405);
  }

  if (!isAllowedOrigin(request)) {
    return jsonResponse(request, { error: "Forbidden origin." }, 403);
  }

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    return jsonResponse(request, { error: "Logging service is not configured." }, 500);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return jsonResponse(request, { error: "Payload too large." }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse(request, { error: "Invalid JSON body." }, 400);
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return jsonResponse(request, { error: validationError }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const { data: requestRow, error: requestError } = await supabase
      .from("recommendation_requests")
      .insert({
        session_id: payload.session_id,
        vibes: payload.vibes,
        duration: payload.duration,
        companion: payload.companion,
      })
      .select("id")
      .single();

    if (requestError) throw requestError;

    const rows = (payload.results as Record<string, unknown>[]).map((result) => ({
      request_id: requestRow.id,
      place_id: result.place_id,
      rank: result.rank,
      final_score: result.final_score,
      favorability_score: result.favorability_score,
      why: result.why,
      live_scores: result.live_scores,
      anti_overtourism_scores: result.anti_overtourism_scores,
    }));

    const { error: resultsError } = await supabase
      .from("recommendation_results")
      .insert(rows);

    if (resultsError) throw resultsError;

    return jsonResponse(request, { ok: true, request_id: requestRow.id });
  } catch (error) {
    console.error("Failed to write recommendation log.", error);
    return jsonResponse(request, { error: "Failed to log recommendation." }, 500);
  }
});
