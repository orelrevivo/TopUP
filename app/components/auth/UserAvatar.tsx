"use client";

import { useAuth } from "~/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useStore } from "@nanostores/react";
import { profileStore } from "~/lib/stores/profile";

export function UserAvatar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const profile = useStore(profileStore);

  if (!user) return null;

  const handleClick = async () => {
    await logout();
    router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      title={`Logged in as ${user.email}`}
      className="w-8 h-8 rounded-full overflow-hidden bg-accent-500 text-white flex items-center justify-center text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer"
    >
      {profile.avatar ? (
        <img
          src={profile.avatar}
          alt={profile.username || "User"}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="sync"
        />
      ) : (
        (user.displayName ?? user.email).charAt(0).toUpperCase()
      )}
    </button>
  );
}
