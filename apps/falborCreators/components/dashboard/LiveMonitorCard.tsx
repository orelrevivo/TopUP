"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { Radio, Tv, Sparkles, CheckCircle2, Loader2, ArrowRight, Video, ExternalLink, Square } from "lucide-react";
import Link from "next/link";

interface LiveStatusData {
  sourceType: "own" | "custom_url";
  targetChannelUrl: string;
  isConfigured: boolean;
  targetName: string;
  platform: string;
  isChannelLive?: boolean;
  connectedAccountsCount: number;
  activeStream: {
    id: string;
    title: string;
    status: string;
    platform: string;
    createdAt: string;
  } | null;
}

export function LiveMonitorCard() {
  const [data, setData] = useState<LiveStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [isEditingStreamer, setIsEditingStreamer] = useState(false);
  const [editSourceType, setEditSourceType] = useState<"own" | "custom_url">("custom_url");
  const [editTargetUrl, setEditTargetUrl] = useState("");
  const [savingStreamer, setSavingStreamer] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/streams/live-status");
      const json = await res.json();
      setData(json);
      if (json.sourceType) setEditSourceType(json.sourceType);
      if (json.targetChannelUrl) setEditTargetUrl(json.targetChannelUrl);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveStreamer = async () => {
    setSavingStreamer(true);
    try {
      const settingsRes = await fetch("/api/settings");
      const settingsJson = await settingsRes.json();
      const currentSettings = settingsJson.settings || {};

      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentSettings,
          sourceType: editSourceType,
          targetChannelUrl: editTargetUrl,
        }),
      });

      await fetchStatus();
      setIsEditingStreamer(false);
    } catch {
      alert("Failed to update target streamer.");
    } finally {
      setSavingStreamer(false);
    }
  };

  const handleSimulateLive = async () => {
    setTriggering(true);
    try {
      await fetch("/api/streams/live-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data?.targetChannelUrl ? `Live Stream: ${data.targetChannelUrl}` : "Live Stream Broadcast",
        }),
      });
      await fetchStatus();
    } catch {
      alert("Failed to start stream monitoring session.");
    } finally {
      setTriggering(false);
    }
  };

  const handleStopAI = async () => {
    setStopping(true);
    try {
      await fetch("/api/streams/live-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });
      if (data && data.activeStream) {
        setData({
          ...data,
          activeStream: {
            ...data.activeStream,
            status: "stopped",
          },
        });
      }
      await fetchStatus();
    } catch {
      alert("Failed to stop AI processing.");
    } finally {
      setStopping(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-zinc-800 bg-zinc-950/60 animate-pulse">
        <div className="h-6 w-48 bg-zinc-800 rounded mb-4" />
        <div className="h-16 bg-zinc-900 rounded-lg" />
      </Card>
    );
  }

  const isCustom = data?.sourceType === "custom_url";
  const streamStatus = data?.activeStream?.status || "offline";
  const isProcessing = streamStatus !== "offline" && streamStatus !== "clips_ready" && streamStatus !== "completed" && streamStatus !== "stopped";

  const pipelineSteps = [
    { key: "detected_live", label: "Ingesting Live" },
    { key: "transcribing", label: "Transcribing Audio" },
    { key: "detecting_clips", label: "AI Moment Detection" },
    { key: "rendering_clips", label: "9:16 FFmpeg Render" },
    { key: "completed", label: "Auto-Publish / Ready" },
  ];

  const getStepStatus = (stepKey: string) => {
    const stepOrder = ["detected_live", "transcribing", "detecting_clips", "rendering_clips", "completed"];
    const currentIndex = stepOrder.indexOf(streamStatus);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (streamStatus === "offline" || streamStatus === "stopped") return "idle";
    if (currentIndex > stepIndex || streamStatus === "completed" || streamStatus === "clips_ready") return "completed";
    if (currentIndex === stepIndex) return "active";
    return "pending";
  };

  return (
    <>
      <Card className="border-indigo-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/40 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isProcessing ? "bg-red-400 opacity-75" : "bg-emerald-400 opacity-40"}`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isProcessing ? "bg-red-500" : "bg-emerald-500"}`} />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">AI Live Stream Monitor</h2>
              <Badge variant="neutral" className="capitalize text-[11px] py-0.5">
                Source: {isCustom ? "Target Live URL" : "My Channel"}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400">
              {isCustom ? (
                <span>Target Streamer: <strong className="text-indigo-300 font-mono">{data?.targetChannelUrl || "No URL Set"}</strong></span>
              ) : (
                <span>Connected Channel: <strong className="text-indigo-300">{data?.targetName || "No Connected Channel"}</strong></span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-indigo-500/40 text-indigo-200 hover:bg-indigo-950/40"
              onClick={() => {
                setEditSourceType(data?.sourceType || "custom_url");
                setEditTargetUrl(data?.targetChannelUrl || "");
                setIsEditingStreamer(true);
              }}
            >
              Change Streamer
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleStopAI}
              disabled={stopping || !isProcessing}
              className="text-xs gap-1.5 shadow-md shadow-red-600/20"
            >
              {stopping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5 fill-current" />}
              Stop AI Processing
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateLive}
              disabled={triggering || !data?.isConfigured || isProcessing}
              className="text-xs gap-1.5 shadow-md shadow-indigo-600/20"
            >
              {triggering ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
              {isProcessing ? "AI Processing..." : data?.isChannelLive ? "Clip Live Broadcast" : "Clip Recent VOD"}
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {data?.activeStream && (
            <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-sm font-semibold text-zinc-100">{data.activeStream.title}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 font-mono">Stream ID: {data.activeStream.id}</p>
              </div>
              <Badge variant="success" className="uppercase text-[10px]">
                Status: {data.activeStream.status.replace("_", " ")}
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {pipelineSteps.map((step) => {
              const status = getStepStatus(step.key);
              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                    status === "completed"
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : status === "active"
                      ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200 animate-pulse"
                      : "bg-zinc-900/40 border-zinc-800/60 text-zinc-500"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1" />
                  ) : status === "active" ? (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin mb-1" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-zinc-600 mb-1" />
                  )}
                  <span className="text-[11px] font-medium leading-tight">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {isEditingStreamer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Change Target Streamer</h3>
            <p className="text-xs text-zinc-400">Choose which channel or streamer AutoClipper AI monitors for live clipping.</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditSourceType("own")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  editSourceType === "own" ? "bg-indigo-950/60 border-indigo-500 text-white" : "bg-zinc-950 border-zinc-800 text-zinc-400"
                }`}
              >
                <div className="text-xs font-semibold">My Connected Account</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Your YouTube / Twitch / Kick</div>
              </button>

              <button
                type="button"
                onClick={() => setEditSourceType("custom_url")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  editSourceType === "custom_url" ? "bg-indigo-950/60 border-indigo-500 text-white" : "bg-zinc-950 border-zinc-800 text-zinc-400"
                }`}
              >
                <div className="text-xs font-semibold">Target Streamer URL</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">External Channel Link</div>
              </button>
            </div>

            {editSourceType === "custom_url" && (
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-medium text-zinc-300">Streamer URL or Channel Name</label>
                <input
                  type="text"
                  placeholder="https://kick.com/xqc  or  https://twitch.tv/ninja"
                  value={editTargetUrl}
                  onChange={(e) => setEditTargetUrl(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <Button variant="ghost" size="sm" onClick={() => setIsEditingStreamer(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveStreamer} disabled={savingStreamer}>
                {savingStreamer ? "Saving..." : "Save Streamer Target"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
