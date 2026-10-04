"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from "@/components/ui";
import { Youtube, Twitch, Radio } from "lucide-react";

interface AccountItem {
  id: string;
  platform: "youtube" | "twitch" | "kick";
  platformUsername: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
    const urlParams = new URLSearchParams(window.location.search);
    const err = urlParams.get("error");
    if (err) {
      alert(`Account connection status: ${err}`);
    }
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch {
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      const res = await fetch("/api/auth/oauth-config");
      const config = await res.json();

      if (platform === "youtube") {
        const clientId = config.youtubeClientId || process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/api/integrations/youtube/callback`);
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube.readonly`;
      } else if (platform === "twitch") {
        const clientId = config.twitchClientId || process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/api/integrations/twitch/callback`);
        window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:broadcast%20user:read:email`;
      } else if (platform === "kick") {
        const clientId = config.kickClientId || process.env.NEXT_PUBLIC_KICK_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/api/integrations/kick/callback`);
        const state = Math.random().toString(36).substring(2);
        const codeChallenge = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM";
        window.location.href = `https://id.kick.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:read%20channel:read&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      }
    } catch {
      alert("Failed to initiate account connection. Please try again.");
    }
  };

  const handleDisconnect = async (platform: string) => {
    await fetch(`/api/accounts?platform=${platform}`, { method: "DELETE" });
    setAccounts((prev) => prev.filter((a) => a.platform !== platform));
  };

  const platforms = [
    {
      id: "youtube" as const,
      name: "YouTube",
      badge: "youtube" as const,
      icon: Youtube,
      description: "Detect live broadcasts & auto-publish YouTube Shorts.",
    },
    {
      id: "twitch" as const,
      name: "Twitch",
      badge: "twitch" as const,
      icon: Twitch,
      description: "Receive EventSub webhooks on stream end & VOD ready.",
    },
    {
      id: "kick" as const,
      name: "Kick",
      badge: "kick" as const,
      icon: Radio,
      description: "Modular Kick platform adapter integration.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Connected Accounts</h2>
        <p className="text-xs text-zinc-400 mt-1">Connect your livestream channels once. AutoClipper handles the rest.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const connectedAccount = accounts.find((a) => a.platform === platform.id);
          const isConnected = Boolean(connectedAccount);

          return (
            <Card key={platform.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100">{platform.name}</h3>
                    <Badge variant={platform.badge}>{isConnected ? "Connected" : "Disconnected"}</Badge>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{platform.description}</p>
                  {isConnected && connectedAccount && (
                    <p className="text-[11px] text-zinc-500 font-mono mt-1">Channel: {connectedAccount.platformUsername}</p>
                  )}
                </div>
              </div>

              <div>
                {isConnected ? (
                  <Button variant="outline" size="sm" onClick={() => handleDisconnect(platform.id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => handleConnect(platform.id)}>
                    Connect Account
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
