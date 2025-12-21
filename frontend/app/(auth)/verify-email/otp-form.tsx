"use client";

import { useActionState, useState, useEffect, startTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { otpFormSchema } from "@/validations/zod";
import { verifyOtpAction, resendOtpAction } from "@/actions/auth";
import { showVerifyEmailToast } from "@/components/showVerifyEmailToast";

type ActionServer = {
  success: boolean;
  errorMessage?: {
    otp?: string;
    email?: string;
  };
};

export default function OTPForm() {
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  const [state, action, pending] = useActionState<ActionServer>(
    verifyOtpAction,
    {
      success: false,
      errorMessage: {},
    }
  );

  const [resendState, resendAction, resendPending] =
    useActionState<ActionServer>(resendOtpAction, {
      success: false,
      errorMessage: {},
    });

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const showToast = Cookies.get("showVerifyEmailToast");
    if (showToast) {
      showVerifyEmailToast();
      Cookies.remove("showVerifyEmailToast");
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verify OTP</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your email.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-6">
          <Controller
            name="otp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                <Input
                  id="otp"
                  type="text"
                  autoFocus
                  maxLength={6}
                  placeholder="Enter OTP"
                  {...field}
                />
                <FieldError>
                  {fieldState.error?.message || state.errorMessage?.otp}
                </FieldError>
              </Field>
            )}
          />

          {state.errorMessage?.email && (
            <p className="text-red-500">{state.errorMessage.email}</p>
          )}
          {state.success && (
            <p className="text-green-500 text-center">OTP Verified!</p>
          )}
          {resendState.success && (
            <p className="text-green-500 text-center">
              A new code has been sent to your email.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader className="text-muted-foreground size-5 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              disabled={resendPending}
              onClick={() =>
                startTransition(() => {
                  resendAction();
                  setTimeLeft(300); // Reset OTP timer
                })
              }
            >
              {resendPending ? "Resending..." : "Resend Code"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              OTP expires in:{" "}
              {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}
              :{(timeLeft % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
