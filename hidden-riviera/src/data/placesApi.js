import { supabase } from "../lib/supabase.js";

export async function fetchPlaces() {
  const { data, error } = await supabase
    .from("places")
    .select(`
      *,
      place_live_context (
        traffic_score,
        pollution_score,
        seasonal_score,
        weather_score,
        overtourism_score,
        source_summary,
        updated_at
      )
    `)
    .eq("active", true);

  if (error) {
    throw error;
  }

  console.log(data);

  return data || [];
}