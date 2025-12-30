"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

import { forgetPasswordSchema } from "@/validations/zod";
import { forgetPassword } from "@/actions/auth";

// Field components
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type ActionServer = {
  success: boolean;
  errorMessage?: {
    username?: string[];
    server?: string[];
  };
};

export default function ForgetPasswordPreview() {
  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { username: "" },
    mode: "onTouched",
  });

  const [state, action, pending] = useActionState<ActionServer>(
    forgetPassword,
    { success: false, errorMessage: {} }
  );

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-6">
          {/* EMAIL FIELD */}
          <Field>
            <FieldLabel htmlFor="username">Email</FieldLabel>

            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="username"
                    type="email"
                    placeholder="johndoe@mail.com"
                    autoComplete="email"
                    disabled={pending}
                    {...field}
                  />

                  <FieldError>
                    {fieldState.error?.message ||
                      state.errorMessage?.username?.[0]}
                  </FieldError>
                </>
              )}
            />

            <FieldDescription>
              We’ll send you a reset link if this email exists.
            </FieldDescription>
          </Field>

          {/* SERVER-ONLY ERROR */}
          {state.errorMessage?.server && (
            <p className="text-destructive text-sm">
              {state.errorMessage.server}
            </p>
          )}

          {/* SUCCESS MESSAGE */}
          {state.success && (
            <p className="text-green-500 text-sm">
              Check your email to reset your password.
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader className="size-5 animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
