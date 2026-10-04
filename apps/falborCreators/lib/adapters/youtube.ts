import { PlatformAdapter, LivestreamEvent } from "./types";

export class YouTubeAdapter implements PlatformAdapter {
  platform = "youtube" as const;

  async connect(userId: string, code: string): Promise<boolean> {
    return true;
  }

  async getLiveStatus(channelId: string) {
    return { isLive: false };
  }

  async getLatestVod(channelId: string) {
    return { vodUrl: `https://youtube.com/watch?v=mock_${channelId}`, duration: 3600 };
  }

  async uploadClip(userId: string, clipId: string, filePath: string, metadata: { title: string; description: string }) {
    return { success: true, externalUrl: `https://youtube.com/shorts/mock_${clipId}` };
  }

  async handleWebhook(payload: Record<string, any>, headers: Record<string, string>): Promise<LivestreamEvent | null> {
    return null;
  }
}
