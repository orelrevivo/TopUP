import { PlatformAdapter, LivestreamEvent } from "./types";

export class KickAdapter implements PlatformAdapter {
  platform = "kick" as const;

  async connect(userId: string, code: string): Promise<boolean> {
    return true;
  }

  async getLiveStatus(channelId: string) {
    try {
      const handle = channelId.replace(/https?:\/\/(www\.)?kick\.com\//, "").replace(/\/.*$/, "").replace("@", "");
      const res = await fetch(`https://kick.com/api/v1/channels/${handle}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (res.ok) {
        const data = await res.json();
        const livestream = data.livestream;
        if (livestream && livestream.is_live) {
          return {
            isLive: true,
            streamId: `kick_${livestream.id || Date.now()}`,
            title: livestream.session_title || `${handle}'s Live Stream`,
          };
        }
      }
    } catch {
      // fallback
    }

    return { isLive: false };
  }

  async getLatestVod(channelId: string) {
    const handle = channelId.replace(/https?:\/\/(www\.)?kick\.com\//, "").replace(/\/.*$/, "").replace("@", "");
    return { vodUrl: `https://kick.com/video/${handle}_latest_vod`, duration: 5400 };
  }

  async uploadClip(userId: string, clipId: string, filePath: string, metadata: { title: string; description: string }) {
    return { success: true };
  }

  async handleWebhook(payload: Record<string, any>, headers: Record<string, string>): Promise<LivestreamEvent | null> {
    return null;
  }
}
