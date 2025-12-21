import Link from "next/link";
import { getUserProfile } from "@/actions/auth";

import { Button } from "@/components/ui/button";
import AvatarSec from "@/components/avtar/avtar";

export default async function AV() {
  const userData = await getUserProfile();

  // If userData is false or null, handle as not signed in/unverified
  if (!userData) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/sign-in">
          <Button variant="ghost">Sign in</Button>
        </Link>
        <Link href="/about">
          <Button className="shadow-sm">Get Started</Button>
        </Link>
      </div>
    );
  }

  // Now TypeScript knows userData is the object with user and profile
  const profileData = userData.profile || {
    full_name: userData.user.user_metadata?.full_name,
    email: userData.user.email,
    avatar_url: userData.user.user_metadata?.picture,
    is_verified: true,
  };

  return <AvatarSec user={userData.user} profile={profileData} />;
}
