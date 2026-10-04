"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, Button } from "@/components/ui";
import { ClipCard } from "@/components/dashboard/ClipCard";
import { Video } from "lucide-react";

export default function ClipsPage() {
  const [clips, setClips] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/clips")
      .then((res) => res.json())
      .then((data) => setClips(data.clips || []))
      .catch(() => setClips([]));
  }, []);

  const handleAction = async (clipId: string, action: string) => {
    await fetch("/api/clips/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clipId, action }),
    });
    setClips((prev) =>
      prev.map((c) => (c.id === clipId ? { ...c, status: action === "approve" ? "approved" : action } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Clips Library</h2>
        <p className="text-xs text-zinc-400 mt-1">Review, approve, and auto-publish vertical clips created by AI.</p>
      </div>

      {clips.length === 0 ? (
        <Card className="py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <Video className="w-6 h-6" />
          </div>
          <p className="text-xs text-zinc-400">No clips found in your library yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {clips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              onApprove={(id) => handleAction(id, "approve")}
              onReject={(id) => handleAction(id, "reject")}
              onPublish={(id) => handleAction(id, "publish")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
