"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { formSchemas } from "@/validations/zod";
import { forgetPassword } from "@/actions/auth";
import { useActionState } from "react";

// Field components from shadcn Field API
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type ActionServer = {
  success: boolean;
  errorMessage: {
    username: string;
    server?: string[];
  };
};

export default function ForgetPasswordPreview() {
  const form = useForm<z.infer<typeof formSchemas>>({
    resolver: zodResolver(formSchemas),
    defaultValues: { username: "" },
  });

  const [state, action, pending] = useActionState<ActionServer>(
    forgetPassword,
    { errorMessage: {} }
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
        <form
          action={action}
          className="space-y-8"
          onSubmit={form.handleSubmit(() => {})}
        >
          {/* Email Field */}
          <Field>
            <FieldLabel htmlFor="username">Email</FieldLabel>

            <Input
              id="username"
              type="email"
              placeholder="johndoe@mail.com"
              autoComplete="email"
              {...form.register("username")}
              aria-invalid={!!form.formState.errors.username}
            />

            {/* optional helper text */}
            <FieldDescription>
              We’ll send you a reset link if this email exists.
            </FieldDescription>

            {/* error from Zod validation */}
            {form.formState.errors.username?.message && (
              <FieldError>
                {form.formState.errors.username.message}
              </FieldError>
            )}

            {/* error from server action */}
            {state.errorMessage.username && (
              <FieldError>{state.errorMessage.username}</FieldError>
            )}
          </Field>

          {/* server errors not tied to a field */}
          {state.errorMessage.server && (
            <p className="text-destructive">{state.errorMessage.server}</p>
          )}

          {/* success message */}
          {state.success && !state.errorMessage.username && (
            <p className="text-green-500">
              Check your email to reset your password
            </p>
          )}

          {/* submit button */}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader className="text-muted-foreground size-5 animate-spin" />
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
