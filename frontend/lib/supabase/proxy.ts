import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "./admin";

const protectedRoutes = ["/about"];
const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/forget-password",
  "/reset-password",
];

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    { cookies: request.cookies }
  );

  const pathname = request.nextUrl.pathname;

  // 1️⃣ Get JWT claims
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims || null;

  // 2️⃣ Handle non-authenticated users
  if (!claims) {
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return supabaseResponse;
  }

  // 3️⃣ Already authenticated users trying to access auth routes
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4️⃣ Lightweight check if user exists
  const supabaseAdmin = createAdminClient();
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
    claims.sub
  );
  if (!userData.user) {
    // User doesn’t exist → clear session cookies
    supabaseResponse.cookies.delete("sb-access-token");
    supabaseResponse.cookies.delete("sb-refresh-token");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const isVerified = claims?.is_verified;

  // 5️⃣ Protect normal routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isVerified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
  }

  // 6️⃣ Reset-password page (DB call required)
  if (pathname.startsWith("/reset-password")) {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.redirect(new URL("/sign-in", request.url));

    const { data: tokenSession } = await supabaseAdmin
      .from("email_verification_sessions")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .eq("is_password_reset", true)
      .maybeSingle();

    if (!tokenSession) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return supabaseResponse;
}
