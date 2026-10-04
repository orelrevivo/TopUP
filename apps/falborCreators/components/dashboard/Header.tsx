"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sparkles } from "lucide-react";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">Status:</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Listening for Livestreams
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Auto-Clip Active</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-zinc-200">{user?.displayName || "Stream Creator"}</p>
          <p className="text-[10px] text-zinc-500">{user?.email || "connected@falbor.com"}</p>
        </div>
      </div>
    </header>
  );
}
