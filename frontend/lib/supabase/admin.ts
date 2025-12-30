import { createClient as createNewClient } from "@supabase/supabase-js";

export const createAdminClient = () =>
  createNewClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
