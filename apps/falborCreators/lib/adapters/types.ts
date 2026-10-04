export interface LivestreamEvent {
  platform: "youtube" | "twitch" | "kick";
  externalStreamId: string;
  channelId: string;
  eventType: "live_start" | "live_end" | "vod_ready";
  title?: string;
  vodUrl?: string;
}

export interface PlatformAdapter {
  platform: "youtube" | "twitch" | "kick";
  connect(userId: string, code: string): Promise<boolean>;
  getLiveStatus(channelId: string): Promise<{ isLive: boolean; streamId?: string; title?: string }>;
  getLatestVod(channelId: string): Promise<{ vodUrl: string; duration: number } | null>;
  uploadClip(userId: string, clipId: string, filePath: string, metadata: { title: string; description: string }): Promise<{ success: boolean; externalUrl?: string }>;
  handleWebhook(payload: Record<string, any>, headers: Record<string, string>): Promise<LivestreamEvent | null>;
}
