"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, Button, Input, Switch } from "@/components/ui";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoPublish: false,
    manualApproval: true,
    maxClipsPerStream: 3,
    minClipScore: 70,
    language: "en",
    captionStyle: "modern_bold",
    uploadPrivacy: "unlisted",
    sourceType: "own",
    targetChannelUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Automation Settings</h2>
        <p className="text-xs text-zinc-400 mt-1">Configure how AutoClipper detects, cuts, and publishes your stream highlights.</p>
      </div>

      <Card className="space-y-6">
        <div className="space-y-3 border-b border-zinc-800 pb-5">
          <h4 className="text-sm font-semibold text-zinc-100">Stream Content Source</h4>
          <p className="text-[11px] text-zinc-400">Choose whether AI clips are generated from your connected channel or an external target stream.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, sourceType: "own" })}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.sourceType === "own"
                  ? "bg-indigo-950/40 border-indigo-500/80 text-white"
                  : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <div className="font-semibold text-xs text-zinc-200">Option 1: My Connected Channel</div>
              <div className="text-[11px] text-zinc-400 mt-1">Auto-detect when your connected YouTube, Twitch, or Kick channel goes live.</div>
            </button>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, sourceType: "custom_url" })}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                settings.sourceType === "custom_url"
                  ? "bg-indigo-950/40 border-indigo-500/80 text-white"
                  : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <div className="font-semibold text-xs text-zinc-200">Option 2: External Channel / Custom URL</div>
              <div className="text-[11px] text-zinc-400 mt-1">Monitor someone else&apos;s channel live stream link (Kick, Twitch, or YouTube).</div>
            </button>
          </div>

          {settings.sourceType === "custom_url" && (
            <div className="pt-2">
              <Input
                label="Target Live Stream URL"
                placeholder="https://kick.com/streamer  or  https://twitch.tv/streamer"
                value={settings.targetChannelUrl}
                onChange={(e) => setSettings({ ...settings, targetChannelUrl: e.target.value })}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h4 className="text-xs font-semibold text-zinc-100">Auto-Publish Mode</h4>
            <p className="text-[11px] text-zinc-400">Automatically upload generated clips directly to YouTube Shorts upon stream end.</p>
          </div>
          <Switch
            checked={settings.autoPublish}
            onChange={(checked) => setSettings({ ...settings, autoPublish: checked })}
          />
        </div>

        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h4 className="text-xs font-semibold text-zinc-100">Manual Approval Mode</h4>
            <p className="text-[11px] text-zinc-400">Require creator review in dashboard before any clip is published.</p>
          </div>
          <Switch
            checked={settings.manualApproval}
            onChange={(checked) => setSettings({ ...settings, manualApproval: checked })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-4">
          <Input
            label="Max Clips Per Stream"
            type="number"
            value={settings.maxClipsPerStream}
            onChange={(e) => setSettings({ ...settings, maxClipsPerStream: parseInt(e.target.value) || 3 })}
          />
          <Input
            label="Minimum AI Score (0 - 100)"
            type="number"
            value={settings.minClipScore}
            onChange={(e) => setSettings({ ...settings, minClipScore: parseInt(e.target.value) || 70 })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">Stream Primary Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="he">Hebrew (עברית)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">YouTube Upload Privacy</label>
            <select
              value={settings.uploadPrivacy}
              onChange={(e) => setSettings({ ...settings, uploadPrivacy: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none"
            >
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving Changes..." : "Save Settings"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
