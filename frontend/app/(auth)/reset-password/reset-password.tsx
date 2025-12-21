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
import { useForm } from "react-hook-form";

import { resetPasswordSchema } from "@/validations/zod";
import { resetPasswordAction } from "@/actions/auth";
import { passwordRules } from "@/constants/passwordValidations";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

// New Field components
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
  });

  const [state, action, pending] = useActionState<ActionServer>(
    resetPasswordAction,
    { errorMessage: {} }
  );

  const passwordTrackinput = form.watch("password");
  const [showicon, setShowicon] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const isPasswordEmpty = passwordTrackinput === "";

  useEffect(() => {
    if (isPasswordEmpty) {
      setShowicon(false);
      setSeePassword(false);
    }
  }, [isPasswordEmpty]);

  const togglePassword = () => {
    setShowicon(!showicon);
    setSeePassword(!seePassword);
  };

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
        <form
          action={action}
          className="space-y-4"
          onSubmit={form.handleSubmit(() => {})}
        >
          {/* PASSWORD FIELD */}
          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={seePassword ? "text" : "password"}
                {...form.register("password")}
                placeholder="Enter new password"
                disabled={pending}
                aria-invalid={!!form.formState.errors.password}
              />
              {!isPasswordEmpty &&
                (seePassword ? (
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
                ))}
            </div>

            <FieldDescription>
              Your password must satisfy all the rules below.
            </FieldDescription>

            {passwordRules.map((rule) => (
              <p
                key={rule.message}
                className={cn(
                  "flex items-center gap-1 text-sm",
                  rule.test(passwordTrackinput)
                    ? "text-green-600"
                    : state.errorMessage?.password
                    ? "text-red-600"
                    : ""
                )}
              >
                {rule.test(passwordTrackinput) ? (
                  <Check size={12} />
                ) : (
                  <Circle size={12} />
                )}
                {rule.message}
              </p>
            ))}

            {form.formState.errors.password?.message && (
              <FieldError>{form.formState.errors.password.message}</FieldError>
            )}
          </Field>

          {/* CONFIRM PASSWORD FIELD */}
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...form.register("confirmPassword")}
              disabled={pending}
              aria-invalid={!!form.formState.errors.confirmPassword}
            />
            <FieldDescription>
              Retype your password to confirm.
            </FieldDescription>
            {form.formState.errors.confirmPassword?.message && (
              <FieldError>
                {form.formState.errors.confirmPassword.message}
              </FieldError>
            )}
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
