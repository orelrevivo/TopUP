import React from "react";
import { cn } from "./Button";

export interface BadgeProps {
  variant?: "kick" | "twitch" | "youtube" | "success" | "warning" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  const styles = {
    kick: "bg-[#53fc18]/10 text-[#53fc18] border-[#53fc18]/20",
    twitch: "bg-[#9146ff]/10 text-[#a970ff] border-[#9146ff]/20",
    youtube: "bg-red-500/10 text-red-400 border-red-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    neutral: "bg-zinc-800 text-zinc-300 border-zinc-700",
  };

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border tracking-wide", styles[variant], className)}>
      {children}
    </span>
  );
}
