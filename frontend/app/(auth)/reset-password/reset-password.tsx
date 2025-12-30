"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Check, Circle, Eye, EyeOff, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { resetPasswordSchema } from "@/validations/zod";
import { resetPasswordAction } from "@/actions/auth";
import { passwordRules } from "@/constants/passwordValidations";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";

type ActionServer = {
  success: boolean;
  errorMessage?: {
    password?: string[];
    confirmPassword?: string[];
    server?: string[];
  };
};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const [state, action, pending] = useActionState<ActionServer>(
    resetPasswordAction,
    { errorMessage: {} }
  );

  const passwordValue = form.watch("password");
  const [seePassword, setSeePassword] = useState(false);

  const togglePassword = () => setSeePassword((prev) => !prev);

  useEffect(() => {
    if (!passwordValue) setSeePassword(false);
  }, [passwordValue]);

  if (state.success) {
    return (
      <Card className="max-w-sm mx-auto text-center">
        <CardHeader>
          <CardTitle>Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been reset successfully. You can now{" "}
            <a href="/sign-in" className="text-blue-600 underline">
              log in
            </a>{" "}
            with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Check className="mx-auto text-green-600" size={40} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter a new password to reset your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-4">
          {/* PASSWORD FIELD */}
          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <Controller
              name="password"
              control={form.control}
              rules={{ required: "Password is required" }}
              render={({ field, fieldState }) => (
                <div className="relative">
                  <Input
                    {...field}
                    id="password"
                    type={seePassword ? "text" : "password"}
                    placeholder="Enter new password"
                    disabled={pending}
                    aria-invalid={!!fieldState.error}
                  />
                  {field.value && (
                    seePassword ? (
                      <EyeOff
                        size={20}
                        onClick={togglePassword}
                        className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                      />
                    ) : (
                      <Eye
                        size={20}
                        onClick={togglePassword}
                        className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                      />
                    )
                  )}
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </div>
              )}
            />
            <FieldDescription>Your password must satisfy all rules below.</FieldDescription>
            {passwordRules.map((rule) => (
              <p
                key={rule.message}
                className={cn(
                  "flex items-center gap-1 text-sm",
                  rule.test(passwordValue)
                    ? "text-green-600"
                    : state.errorMessage?.password
                    ? "text-red-600"
                    : ""
                )}
              >
                {rule.test(passwordValue) ? <Check size={12} /> : <Circle size={12} />}
                {rule.message}
              </p>
            ))}
          </Field>

          {/* CONFIRM PASSWORD FIELD */}
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Controller
              name="confirmPassword"
              control={form.control}
              rules={{ required: "Please confirm your password" }}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    disabled={pending}
                    aria-invalid={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
            <FieldDescription>Retype your password to confirm.</FieldDescription>
          </Field>

          {/* SERVER ERRORS */}
          {state.errorMessage?.server && (
            <p className="text-destructive">{state.errorMessage.server[0]}</p>
          )}

          {/* BUTTON */}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader className="size-5 animate-spin" /> Saving...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>

          {/* hidden token */}
          <input type="hidden" name="token" value={token || ""} />
        </form>
      </CardContent>
    </Card>
  );
}
