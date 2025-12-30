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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader } from "lucide-react";

import { loginFormSchema } from "@/validations/zod";
import { LoginAccount, signInWithGoogle } from "@/actions/auth";

// New Field components
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

type ServerActionReturn = {
  success: boolean;
  errorMessage?: {
    username?: string[];
    password?: string[];
    server?: string[];
  };
};

export function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const [state, action, pending] = useActionState<ServerActionReturn>(
    LoginAccount,
    { errorMessage: {} }
  );

  const [seePassword, setSeePassword] = useState(false);

  const isPasswordEmpty = form.watch("password") === "";

  useEffect(() => {
    if (isPasswordEmpty) setSeePassword(false);
  }, [isPasswordEmpty]);

  const handletogglePaasword = () => setSeePassword(!seePassword);

  const handelFocusNext =
    (focusNext: "username" | "password") => (e: React.KeyboardEvent) => {
      if (e.key === "Enter") form.setFocus(focusNext);
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-4">
          {/* USERNAME FIELD */}
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

          {/* PASSWORD FIELD */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <>
                  <div className="relative">
                    <Input
                    required
                      id="password"
                      type={seePassword ? "text" : "password"}
                      placeholder="Enter your password"
                      disabled={pending}
                      {...field}
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

                  <FieldError>
                    {fieldState.error?.message ||
                      state.errorMessage?.password?.[0]}
                  </FieldError>
                </>
              )}
            />
          </Field>

          {/* SERVER ERROR */}
          {state.errorMessage?.server && (
            <p className="text-destructive">{state.errorMessage.server[0]}</p>
          )}

          {/* FORGOT PASSWORD LINK */}
          <Link
            href="/forget-password"
            className="inline-block w-full text-right text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </Link>

          {/* LOGIN BUTTON */}
          <Button type="submit" className="w-full py-5" disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader className="text-muted-foreground size-5 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          {/* GOOGLE LOGIN */}
          <Button
            type="button"
            variant="outline"
            className="w-full py-5"
            onClick={() => signInWithGoogle()}
          >
            <Image
              src="/icons8-google-logo.svg"
              alt="google"
              width={20}
              height={20}
            />{" "}
            Login with Google
          </Button>
        </form>
      </CardContent>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold">
          Sign up
        </Link>
      </div>
    </Card>
  );
}
