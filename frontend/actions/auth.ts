"use server";

import { createSupaBaseServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  formSchemas,
  loginFormSchema,
  resetPasswordSchema,
} from "@/validations/zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import crypto from "crypto";
import { resend } from "@/lib/resend";
import VerificationEmail from "@/lib/emails/verification-email";
import ResetPasswordEmail from "@/lib/emails/reset-password-email";

// ============================
// OTP GENERATION
// ============================
function generateSecureOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function generateEmailOTP(
  email: string,
  isPasswordReset = false,
  userId?: string
) {
  const supabase = createAdminClient();
  const normalizedEmail = email.toLowerCase();

  // Delete old unused sessions
  await supabase
    .from("email_verification_sessions")
    .delete()
    .eq("email", normalizedEmail)
    .eq("is_password_reset", isPasswordReset)
    .eq("used", false);

  let token: string;
  let otp: string;
  const expiresAt = new Date(
    Date.now() + (isPasswordReset ? 15 : 5) * 60 * 1000
  );

  if (isPasswordReset) {
    token = crypto.randomBytes(32).toString("hex");
  } else {
    otp = generateSecureOtp();
    token = crypto.createHash("sha256").update(otp).digest("hex");
  }

  console.log("otp token send:  " + token);

  const { error, data } = await supabase
    .from("email_verification_sessions")
    .insert({
      user_id: userId || null,
      email: normalizedEmail,
      token,
      is_password_reset: isPasswordReset,
      expires_at: expiresAt,
      used: false,
    });
  if (error) console.log("INSERT ERROR:", error);
  if (data) console.log("INSERT  data", data);

  return isPasswordReset ? token : otp!;
}

// ============================
// VERIFY OTP
// ============================
export async function verifyEmailOTP(
  email: string,
  code: string,
  isPasswordReset = false
) {
  if (!code) throw new Error("Code missing");

  const supabase = createAdminClient();
  const normalizedEmail = email.toLowerCase();
  const tokenToCheck = isPasswordReset
    ? code
    : crypto.createHash("sha256").update(code).digest("hex");
  console.log("otp token recive:  " + tokenToCheck);
  const { data: session } = await supabase
    .from("email_verification_sessions")
    .select("*")
    .eq("email", normalizedEmail)
    .eq("token", tokenToCheck)
    .eq("is_password_reset", isPasswordReset)
    .eq("used", false)
    .single();

  if (!session) throw new Error("Invalid or expired code");

  await supabase
    .from("email_verification_sessions")
    .update({ used: true })
    .eq("id", session.id);

  if (!isPasswordReset) {
    await supabase
      .from("profiles")
      .update({ is_verified: true })
      .eq("email", normalizedEmail);
  }

  return session;
}

// ============================
// SEND EMAIL
// ============================
export async function sendVerificationEmail(
  email: string,
  code: string,
  isPasswordReset = false
) {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: isPasswordReset ? "Reset your password" : "Verify your email",
    react: isPasswordReset
      ? ResetPasswordEmail({ accessToken: code })
      : VerificationEmail({ otp: code }),
  });
}

// ============================
// SIGNUP
// ============================
export const SignUpAccount = async (_: unknown, formData: FormData) => {
  const value = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
   
  };
  console.log("FORM DATA:", {
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  const parsed = formSchemas.safeParse(value);
  console.log("PARSED:", parsed);
  if (!parsed.success)
    return { success: false, errorMessage: parsed.error.flatten().fieldErrors };

  const { username, password } = parsed.data;
  const { auth } = await createSupaBaseServerClient();
  const { data: signUpData, error } = await auth.signUp({
    email: username,
    password,
  });
  if (error)
    return { success: false, errorMessage: { server: [error.message] } };
  console.log("SIGNUP DATA:", signUpData);
  const otp = await generateEmailOTP(username, false, signUpData.user?.id);
  console.log("GENERATED OTP:", otp);
  await sendVerificationEmail(username, otp);

  const cookiesStore = await cookies();
  cookiesStore.set("verify_email", username, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
  });
  cookiesStore.set("showVerifyEmailToast", "1", { path: "/", httpOnly: false });

  redirect("/verify-email");
};

// ============================
// GOOGLE SIGN-IN
// ============================
export async function signInWithGoogle() {
  const { auth } = await createSupaBaseServerClient();
  const { data, error } = await auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.SITE_URL}/callback`,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) throw new Error(error.message);
  redirect(data.url);
}

// ============================
// LOGIN
// ============================
export async function LogoutAccount() {
  const { auth } = await createSupaBaseServerClient();
  await auth.signOut();
  redirect("/");
}

export const LoginAccount = async (_: unknown, formData: FormData) => {
  const value = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };
  const parsed = loginFormSchema.safeParse(value);
  if (!parsed.success)
    return { success: false, errorMessage: parsed.error.flatten().fieldErrors };

  const { username, password } = parsed.data;
  const { auth } = await createSupaBaseServerClient();
  const { data, error } = await auth.signInWithPassword({
    email: username,
    password,
  });
  if (error)
    return { success: false, errorMessage: { server: [error.message] } };

  const supabaseAdmin = createAdminClient();
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_verified")
    .eq("id", data.user?.id)
    .single();

  if (!profile?.is_verified)
    return {
      success: false,
      errorMessage: { server: ["Account not verified."] },
    };

  redirect("/");
};

// ============================
// GET PROFILE
// ============================
export async function getUserProfile() {
  const supabase = await createSupaBaseServerClient();

  // 1️⃣ Try fetching claims
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  const claims = data.claims;

  // 2️⃣ Fetch profile from DB
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", claims.sub)
    .single();

  if (profileError) return null;

  return {
    user: claims,
    profile: {
      full_name: profile.full_name || claims.email,
      email: profile.email || claims.email,
      avatar_url: profile.avatar_url,
      is_verified: profile.is_verified,
    },
  };
}

// ============================
// FORGET PASSWORD
// ============================
export async function forgetPassword(_: unknown, formData: FormData) {
  const email = (formData.get("username") as string).toLowerCase();
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return {
      success: false,
      errorMessage: {
        username: [error.message],
      },
    };
  }

  const user = data.users.find((u) => u.email === email);

  if (!user) {
    return {
      success: false,
      errorMessage: {
        username: ["Email not registered"],
      },
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_verified")
    .eq("id", user.id)
    .single();

  if (!profile?.is_verified) {
    return {
      success: false,
      errorMessage: {
        server: ["Account not verified."],
      },
    };
  }

  // ✅ Generate password reset token
  const token = await generateEmailOTP(email, true, user.id);

  // ✅ Build reset link
  const resetLink = `${process.env.SITE_URL}/reset-password?token=${token}`;

  // ✅ Send reset email
  await sendVerificationEmail(email, resetLink, true);

  return { success: true };
}


// ============================
// OTP VERIFY
// ============================
export async function verifyOtpAction(_: unknown, formData: FormData) {
  const cookiesStore = await cookies();
  const email = cookiesStore.get("verify_email")?.value;
  const otp = formData.get("otp") as string;

  if (!email || !otp)
    return {
      success: false,
      errorMessage: {
        email: !email ? "No email" : undefined,
        otp: !otp ? "No OTP" : undefined,
      },
    };

  try {
    await verifyEmailOTP(email, otp);
    cookiesStore.delete("verify_email");
  } catch (err) {
    return {
      success: false,
      errorMessage: { otp: (err as Error).message || "Invalid or expired OTP" },
    };
  }

  redirect("/");
}

// ============================
// RESET PASSWORD
// ============================

export const resetPasswordAction = async (_: unknown, formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const token = formData.get("token") as string;

  // Validate passwords
  const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
  if (!parsed.success)
    return { success: false, errorMessage: parsed.error.flatten().fieldErrors };

  if (!token)
    return {
      success: false,
      errorMessage: { server: ["Reset link expired or missing token"] },
    };

  const supabase = createAdminClient();

  // Find the session in DB
  const { data: session } = await supabase
    .from("email_verification_sessions")
    .select("*")
    .eq("token", token)
    .eq("is_password_reset", true)
    .eq("used", false)
    .maybeSingle();

  if (!session)
    return {
      success: false,
      errorMessage: { server: ["Invalid or expired reset link"] },
    };

  // Mark the session as used
  await supabase
    .from("email_verification_sessions")
    .update({ used: true })
    .eq("id", session.id);

  // Update user password
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    session.user_id,
    { password }
  );
  if (updateError)
    return { success: false, errorMessage: { server: [updateError.message] } };

  return { success: true };
};

// ============================
// RESEND OTP
// ============================
export async function resendOtpAction() {
  const cookiesStore = await cookies();
  const email = cookiesStore.get("verify_email")?.value;

  if (!email)
    return {
      success: false,
      errorMessage: { email: "No email found", otp: "Cannot generate OTP" },
    };

  const supabase = createAdminClient();

  // ✅ Get the user ID from auth.users
  const { data: users, error: listError } =
    await supabase.auth.admin.listUsers();
  if (listError)
    return {
      success: false,
      errorMessage: { server: listError.message },
    };

  const user = users.users.find((u) => u.email === email);
  if (!user)
    return {
      success: false,
      errorMessage: { email: "User not found" },
    };

  const otp = await generateEmailOTP(email, false, user.id);
  await sendVerificationEmail(email, otp, false);

  return { success: true };
}
