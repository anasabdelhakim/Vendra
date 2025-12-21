import { createClient as createNewClient } from "@supabase/supabase-js";

export const createAdminClient = () =>
  createNewClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
