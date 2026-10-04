import { PlatformAdapter, LivestreamEvent } from "./types";

export class TwitchAdapter implements PlatformAdapter {
  platform = "twitch" as const;

  async connect(userId: string, code: string): Promise<boolean> {
    return true;
  }

  async getLiveStatus(channelId: string) {
    return { isLive: false };
  }

  async getLatestVod(channelId: string) {
    return { vodUrl: `https://twitch.tv/videos/mock_${channelId}`, duration: 7200 };
  }

  async uploadClip(userId: string, clipId: string, filePath: string, metadata: { title: string; description: string }) {
    return { success: false };
  }

  async handleWebhook(payload: Record<string, any>, headers: Record<string, string>): Promise<LivestreamEvent | null> {
    return null;
  }
}
