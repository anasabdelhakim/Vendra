import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function showVerifyEmailToast() {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Verification email sent!</p>
        <p>Please check your inbox to activate your account.</p>

        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => {
              window.open("https://outlook.live.com/mail/0/inbox", "_blank");
              toast.dismiss(t.id);
            }}
            variant="outline"
          >
            Open Outlook
          </Button>

          <Button
            onClick={() => {
              window.open("https://mail.google.com", "_blank");
              toast.dismiss(t.id);
            }}
            variant="destructive"
          >
            Gmail
          </Button>
        </div>
      </div>
    ),
    {
      duration: 10000,
      position: "top-center",
    }
  );
}
