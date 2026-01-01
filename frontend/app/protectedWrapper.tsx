import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

interface ProtectedWrapperProps {
  children: React.ReactNode;
  pathname: string; // pass current pathname
  searchParams?: URLSearchParams; // optional for reset-password token
}

export default async function ProtectedWrapper({
  children,
  pathname,
  searchParams,
}: ProtectedWrapperProps) {
  const supabaseAdmin = createAdminClient();

  // ==============================
  // RESET PASSWORD PAGE
  // ==============================
  if (pathname.startsWith("/reset-password")) {
    const token = searchParams?.get("token");
    if (!token) redirect("/sign-in");

    const { data: session } = await supabaseAdmin
      .from("email_verification_sessions")
      .select("*")
      .eq("token", token)
      .eq("is_password_reset", true)
      .eq("used", false)
      .maybeSingle();

    if (!session) redirect("/sign-in");

    // ✅ Let the reset-password page render
    return <>{children}</>;
  }

  // ==============================
  // HEAVY CHECK FOR OTHER PAGES
  // ==============================
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/sign-in");

  if (!profile.is_verified) redirect("/verify-email");

  return <>{children}</>;
}
