import { LoginForm } from "./sign-in";

export default function Page() {
  return (
    <div className="flex flex-col gap-5 min-h-svh w-full items-center justify-center p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Login page</h1>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
