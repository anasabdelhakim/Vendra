import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export const createSupaBaseServerClient = async () => {
  const cookieStore = await cookies(); // ✅ Await because it's a Promise in this context

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        // Only name and value exist on RequestCookie
        return cookieStore.getAll().map((c) => ({
          name: c.name,
          value: c.value,
          options: undefined, // no extra options available from RequestCookie
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options); // options can be undefined
          } catch {
            console.warn(
              "Supabase setAll called outside a mutable cookie context (e.g., read-only Server Component)."
            );
          }
        });
      },
    },
  });
};
