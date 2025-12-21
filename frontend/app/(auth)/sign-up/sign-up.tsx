"use client";

import { useActionState, useState } from "react";
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
import { useForm, Controller } from "react-hook-form"; // ✅ Controller imported
import { z } from "zod";
import Link from "next/link";

import { formSchemas } from "@/validations/zod";
import { SignUpAccount } from "@/actions/auth";
import { passwordRules } from "@/constants/passwordValidations";
import { cn } from "@/lib/utils";

// shadcn Field components
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type ServerActionReturn = {
  success: boolean;
  errorMessage?: {
    username?: string[];
    password?: string[];
    confirmPassword?: string[];
    server?: string[];
  };
};

export function SignUpForm() {
  const form = useForm<z.infer<typeof formSchemas>>({
    resolver: zodResolver(formSchemas),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const [state, action, pending] = useActionState<ServerActionReturn>(
    SignUpAccount,
    {
      errorMessage: {},
    }
  );

  const [seePassword, setSeePassword] = useState(false);

  const passwordTrackinput = form.watch("password");
  const isPasswordEmpty = passwordTrackinput === "";

  const handletogglePaasword = () => setSeePassword(!seePassword);

  const passwordStatus = passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(passwordTrackinput),
  }));

  const passwordStrength =
    (passwordStatus.filter((rule) => rule.passed).length /
      passwordRules.length) *
    100;

  const handelFocusNext =
    (focusNext: "username" | "password" | "confirmPassword") =>
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") form.setFocus(focusNext);
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up to your account</CardTitle>
        <CardDescription>
          Create a new account by entering fields below
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-4">
          {/* ----------------- USERNAME ----------------- */}
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Controller
              control={form.control} // ✅ Changed from form.register
              name="username"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="username"
                    type="email"
                    placeholder="Enter your Email"
                    autoFocus
                    disabled={pending}
                    {...field} // ✅ Controlled input
                    onKeyDown={handelFocusNext("password")}
                  />
                  <FieldError>
                    {fieldState.error?.message ||
                      state.errorMessage?.username?.[0]}
                  </FieldError>
                </>
              )}
            />
          </Field>

          {/* ----------------- PASSWORD ----------------- */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Controller
              control={form.control} // ✅ Changed from form.register
              name="password"
              render={({ field, fieldState }) => (
                <>
                  <div className="relative">
                    <Input
                      id="password"
                      type={seePassword ? "text" : "password"}
                      placeholder="Enter your password"
                      disabled={pending}
                      {...field} // ✅ Controlled input
                      onKeyDown={handelFocusNext("confirmPassword")}
                    />
                    {!isPasswordEmpty &&
                      (seePassword ? (
                        <Eye
                          size={20}
                          onClick={handletogglePaasword}
                          className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                        />
                      ) : (
                        <EyeOff
                          size={20}
                          onClick={handletogglePaasword}
                          className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                        />
                      ))}
                  </div>

                  <FieldDescription>
                    Password must satisfy all rules below.
                  </FieldDescription>

                  {/* Password Strength Bar */}
                  <div className="flex gap-2 items-center mt-2">
                    <div className="w-[95%] flex gap-1">
                      {[
                        { limit: 25, color: "#FF4D4F" },
                        { limit: 50, color: "#FAAD14" },
                        { limit: 75, color: "#40A9FF" },
                        { limit: 100, color: "#52C41A" },
                      ].map((segment, idx) => (
                        <div
                          key={idx}
                          className="h-2 rounded-lg flex-1 transition-all duration-300"
                          style={{
                            backgroundColor:
                              passwordStrength >= segment.limit
                                ? segment.color
                                : "#E5E7EB",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm w-15 h-5 text-right flex items-center justify-end">
                      {passwordStrength === 100
                        ? "Strong"
                        : passwordStrength >= 75
                        ? "Good"
                        : passwordStrength >= 50
                        ? "Medium"
                        : passwordStrength > 0
                        ? "Weak"
                        : ""}
                    </span>
                  </div>

                  {/* Password Rules */}
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

                  <FieldError>
                    {fieldState.error?.message ||
                      state.errorMessage?.password?.[0]}
                  </FieldError>
                </>
              )}
            />
          </Field>

          {/* ----------------- CONFIRM PASSWORD ----------------- */}
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Controller
              control={form.control} // ✅ Changed from form.register
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    disabled={pending}
                    {...field} // ✅ Controlled input
                  />
                  <FieldError>
                    {fieldState.error?.message ||
                      state.errorMessage?.confirmPassword?.[0]}
                  </FieldError>
                </>
              )}
            />
          </Field>

          {/* ----------------- SERVER ERROR ----------------- */}
          {state.errorMessage?.server && (
            <p className="text-destructive text-sm">
              {state.errorMessage.server[0]}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Checkbox id="terms" className="border-3" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>

          <Button type="submit" className="w-full py-5 text-white" disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader className="size-5 animate-spin" /> Signing up...
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </CardContent>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold">
          Login
        </Link>
      </div>
    </Card>
  );
}
