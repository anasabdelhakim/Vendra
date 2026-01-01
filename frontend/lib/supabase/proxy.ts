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
    {
      cookies: {
        getAll: () =>
          request.cookies
            .getAll()
            .map((c) => ({ name: c.name, value: c.value })),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // 1️⃣ Get JWT claims
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;

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

  // 4️⃣ Fetch profile to get is_verified
  const supabaseAdmin = createAdminClient();
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("is_verified")
    .eq("id", claims.sub)
    .single();

  const isVerified = profile?.is_verified ?? false;
  console.log("Verified:", isVerified);

  if (!profile || profileError) {
    // User doesn’t exist → clear session cookies
    supabaseResponse.cookies.delete("sb-access-token");
    supabaseResponse.cookies.delete("sb-refresh-token");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 5️⃣ Protect normal routes
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isVerified
  ) {
    return NextResponse.redirect(new URL("/verify-email", request.url));
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
