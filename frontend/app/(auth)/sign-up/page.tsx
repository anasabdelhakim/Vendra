import { SignUpForm } from "./sign-up";

export default function Page() {
  return (
    <div className="flex flex-col gap-5 min-h-svh w-full items-center justify-center p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Sign Up page</h1>
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
