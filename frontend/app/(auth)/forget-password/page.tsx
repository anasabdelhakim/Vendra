import ForgetPasswordPreview from "./forget-password";

export default function Page() {
  return (
    <div className="flex flex-col gap-5 min-h-svh w-full items-center justify-center p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Forget Password page</h1>
      <div className="w-full max-w-sm">
        <ForgetPasswordPreview />
      </div>
    </div>
  );
}
