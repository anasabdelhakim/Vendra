"use client";

import { useTransition } from "react";
import { LogOut, User, Settings } from "lucide-react";

import { LogoutAccount } from "@/actions/auth";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const AvatarSec = ({ user, profile }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
          <Avatar>
            <AvatarImage
              src={profile?.avatar_url || user.user_metadata?.picture}
            />
            <AvatarFallback>
              {profile?.full_name?.[0] ?? user.email?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={profile?.avatar_url || user.user_metadata?.picture}
            />
            <AvatarFallback>
              {profile?.full_name?.[0] ?? user.email?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <p className="font-medium">{profile?.full_name ?? "Unnamed"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          {/* Profile Actions */}
          <Button variant="ghost" className="justify-start gap-2">
            <User className="h-4 w-4" /> View Profile
          </Button>

          <Button variant="ghost" className="justify-start gap-2">
            <Settings className="h-4 w-4" /> Account Settings
          </Button>

          <div className="border-t border-muted my-2" />

          {/* Logout */}
          <Button
            variant="ghost"
            className="justify-start gap-2 text-red-600"
            disabled={isPending}
            onClick={() => startTransition(() => LogoutAccount())}
          >
            <LogOut className="h-4 w-4" />
            {isPending ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AvatarSec;
