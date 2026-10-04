import { YouTubeAdapter } from "./youtube";
import { TwitchAdapter } from "./twitch";
import { KickAdapter } from "./kick";
import { PlatformAdapter } from "./types";

export function getPlatformAdapter(platform: "youtube" | "twitch" | "kick"): PlatformAdapter {
  switch (platform) {
    case "youtube":
      return new YouTubeAdapter();
    case "twitch":
      return new TwitchAdapter();
    case "kick":
      return new KickAdapter();
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
