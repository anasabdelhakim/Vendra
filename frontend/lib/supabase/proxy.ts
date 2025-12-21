import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// List of routes that require authentication
const protectedRoutes = ["about"];
const AuthRoutes = [
  "/sign-in",
  "/sign-up",
  "/forget-password",
  "/reset-password",
];

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  // 1️⃣ Get authenticated claims (replace getUser)
  const { data: claimsData, error } = await supabase.auth.getClaims();
  if (error) console.error("getClaims error:", error);

  const claims = claimsData?.claims || null;
  const isAuth = !!claims;
  // -------------------------------
  // 2️⃣ Protect general routes
  // -------------------------------
  if (pathname.startsWith("/verify-email") && !isAuth) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (AuthRoutes.some((route) => pathname.startsWith(route)) && isAuth) {
    // Already logged in → redirect to homepage
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Fetch profile to check verification
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("id", claims?.sub) // use claims.sub as user ID
      .single();

    if (!profile?.is_verified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
    if (profile?.is_verified) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // -------------------------------
  // 3️⃣ Password reset page
  // -------------------------------
  if (pathname.startsWith("/reset-password")) {
    const cookiesStore = request.cookies;
    const cookieEmail = cookiesStore.get("reset_email")?.value;
    const cookieToken = cookiesStore.get("reset_token")?.value;

    if (!cookieEmail || !cookieToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const { data: tokenSession } = await supabase
      .from("email_verification_sessions")
      .select("*")
      .eq("token", cookieToken)
      .eq("used", false)
      .eq("email", cookieEmail)
      .eq("is_password_reset", true)
      .single();

    if (!tokenSession) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return supabaseResponse;
}
