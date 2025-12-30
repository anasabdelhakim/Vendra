import HomeListening from "@/components/home";
import AV from "./(auth)/profile-info/page";
import Image from "next/image";
import { ArrowRight } from "lucide-react"; // optional icon library

export default function HomePage() {
  return (
    <>
      <header className="flex items-center justify-between border-b border-border dark:border-border px-6 py-4 bg-background dark:bg-background h-18">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Image src="/logo.webp" alt="Logo" width={50} height={50} priority />

          {/* Marketplace title with arrow */}
          <div className="flex items-center">
            <div className="flex flex-col items-center leading-none">
              {/* Vendra title */}
              <span className="text-primary text-3xl font-bold">Vendra</span>

              {/* Marketplace subtitle with arrow */}
              <span className="text-muted-foreground text-sm flex items-center">
                <span>Marketplace</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </span>
            </div>
          </div>
        </div>

        {/* Profile / Avatar */}
        <AV />
      </header>

      {/* Main content */}
      <main className="px-6 py-4 bg-background">
        <HomeListening />
      </main>
    </>
  );
}
