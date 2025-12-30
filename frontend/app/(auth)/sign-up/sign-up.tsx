"use client";

import { useActionState, useState, useEffect } from "react";
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
import Link from "next/link";

import { formSchemas } from "@/validations/zod";
import { SignUpAccount } from "@/actions/auth";
import { passwordRules } from "@/constants/passwordValidations";
import { cn } from "@/lib/utils";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";

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
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
     
    },
   
  });

  const [state, action, pending] = useActionState<ServerActionReturn>(
    SignUpAccount,
    { errorMessage: {} }
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
      if (e.key === "Enter") {
        form.setFocus(focusNext);
      }
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
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    required
                    id="username"
                    type="email"
                    placeholder="Enter your Email"
                    autoFocus
                    disabled={pending}
                    {...field}
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
          {/* ----------------- PASSWORD ----------------- */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => {
                const errorMessage =
                  fieldState.error?.message ||
                  state.errorMessage?.password?.[0];
                return (
                  <>
                    <div className="relative">
                      <Input
                        required
                        id="password"
                        type={seePassword ? "text" : "password"}
                        placeholder="Enter your password"
                        disabled={pending}
                        {...field}
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

                    {/* Show error message if exists, else show description */}
                    {errorMessage ? (
                      <FieldError>{errorMessage}</FieldError>
                    ) : (
                      <FieldDescription>
                        Password must satisfy all rules below.
                      </FieldDescription>
                    )}

                    {/* Password Strength Bar */}
                    <div className="flex gap-2 items-center mt-2">
                      <div className="w-[95%] flex gap-1">
                        {[25, 50, 75, 100].map((limit, idx) => (
                          <div
                            key={idx}
                            className="h-2 rounded-lg flex-1 transition-all duration-300"
                            style={{
                              backgroundColor:
                                passwordStrength >= limit
                                  ? [
                                      "#FF4D4F",
                                      "#FAAD14",
                                      "#40A9FF",
                                      "#52C41A",
                                    ][idx]
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
                            : errorMessage
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
                  </>
                );
              }}
            />
          </Field>

          {/* ----------------- CONFIRM PASSWORD ----------------- */}
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    required
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    disabled={pending}
                    {...field}
                  />
                  <FieldError>
                    {fieldState.error?.message ||
                      state.errorMessage?.confirmPassword?.[0]}
                  </FieldError>
                </>
              )}
            />
          </Field>
          {/* ----------------- SUBMIT ----------------- */}
          <Button
            type="submit"
            className="w-full py-5 text-white"
            disabled={pending}
          >
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
