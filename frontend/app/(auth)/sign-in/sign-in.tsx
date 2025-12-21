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
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader } from "lucide-react";

import { loginFormSchema } from "@/validations/zod";
import { LoginAccount, signInWithGoogle } from "@/actions/auth";

// New Field components
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
        <form
          action={action}
          className="space-y-4"
          onSubmit={form.handleSubmit(() => {})}
        >
          {/* USERNAME FIELD */}
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              type="email"
              placeholder="Enter your Email"
              autoFocus
              disabled={pending}
              {...form.register("username")}
              onKeyDown={handelFocusNext("password")}
            />
            <FieldError>
              {state.errorMessage?.username?.[0] ||
                form.formState.errors.username?.message}
            </FieldError>
          </Field>

          {/* PASSWORD FIELD */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={seePassword ? "text" : "password"}
                placeholder="Enter your password"
                disabled={pending}
                {...form.register("password")}
                aria-invalid={!!form.formState.errors.password}
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
              {state.errorMessage?.password?.[0] ||
                form.formState.errors.password?.message}
            </FieldError>
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
