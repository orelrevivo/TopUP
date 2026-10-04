"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from "@/components/ui";
import { ClipCard } from "@/components/dashboard/ClipCard";
import { LiveMonitorCard } from "@/components/dashboard/LiveMonitorCard";
import { Radio, Video, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OverviewPage() {
  const [clips, setClips] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/clips")
      .then((res) => res.json())
      .then((data) => setClips(data.clips || []))
      .catch(() => setClips([]));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Creator Dashboard</h2>
        <p className="text-xs text-zinc-400 mt-1">Connect your stream once. Get ready-to-post vertical clips automatically.</p>
      </div>

      <LiveMonitorCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400">Livestream Status</p>
            <p className="text-sm font-semibold text-zinc-100 mt-0.5">Listening on 3 Channels</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400">Total Clips Generated</p>
            <p className="text-sm font-semibold text-zinc-100 mt-0.5">{clips.length} Clips</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400">Automation Mode</p>
            <p className="text-sm font-semibold text-zinc-100 mt-0.5">Manual Review Enabled</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Stream Clips</CardTitle>
            <CardDescription>AI generated moments from your latest livestreams</CardDescription>
          </div>
          <Link href="/dashboard/clips">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>

        {clips.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Video className="w-5 h-5" />
            </div>
            <p className="text-xs text-zinc-400">No clips processed yet. Go live on Twitch, Kick, or YouTube!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {clips.slice(0, 4).map((clip) => (
              <ClipCard key={clip.id} clip={clip} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
