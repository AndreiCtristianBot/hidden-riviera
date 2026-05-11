import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PLACES_DB } from "./src/data/placesSeed.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Lipsesc SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY în environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function seedPlaces() {
  const { data, error } = await supabase
    .from("places")
    .upsert(PLACES_DB, { onConflict: "id" })
    .select("id, name");

  if (error) {
    console.error("Eroare la seed:", error);
    process.exit(1);
  }

  console.log(`Seed reușit. Au fost inserate/actualizate ${data.length} locuri.`);
  console.table(data);
}

seedPlaces();