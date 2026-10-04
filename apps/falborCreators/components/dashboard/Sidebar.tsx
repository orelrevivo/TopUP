"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, Settings, UserCheck, ShieldCheck, LogOut, Radio } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: Radio },
    { href: "/dashboard/accounts", label: "Connected Channels", icon: UserCheck },
    { href: "/dashboard/clips", label: "Clips Library", icon: Video },
    { href: "/dashboard/settings", label: "Automation Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-xl flex flex-col justify-between p-4 h-screen sticky top-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-600/30">
            FC
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-100 leading-none">AutoClipper AI</h1>
            <p className="text-[10px] text-zinc-500 mt-1">FalborCreators SaaS</p>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 px-2 border-t border-zinc-800/80 pt-4">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> System Active</span>
          <span className="text-zinc-500">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
