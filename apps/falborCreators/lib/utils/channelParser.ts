export interface ParsedChannel {
  platform: "kick" | "twitch" | "youtube";
  handle: string;
  cleanName: string;
}

export function parseChannelUrl(urlOrName: string): ParsedChannel {
  const input = (urlOrName || "").trim();

  if (input.includes("kick.com")) {
    const parts = input.split("kick.com/").pop()?.split("?")[0].split("/")[0] || "";
    const handle = parts.replace("@", "").trim();
    return {
      platform: "kick",
      handle: handle || "streamer",
      cleanName: handle || "Kick Streamer",
    };
  }

  if (input.includes("twitch.tv")) {
    const parts = input.split("twitch.tv/").pop()?.split("?")[0].split("/")[0] || "";
    const handle = parts.replace("@", "").trim();
    return {
      platform: "twitch",
      handle: handle || "streamer",
      cleanName: handle || "Twitch Streamer",
    };
  }

  if (input.includes("youtube.com") || input.includes("youtu.be")) {
    const parts = input.split("/").pop()?.replace("@", "").split("?")[0] || "";
    return {
      platform: "youtube",
      handle: parts || "streamer",
      cleanName: parts || "YouTube Creator",
    };
  }

  const cleanHandle = input.replace(/https?:\/\//g, "").replace(/[^a-zA-Z0-9_-]/g, "");
  return {
    platform: "kick",
    handle: cleanHandle || "streamer",
    cleanName: cleanHandle || "Streamer",
  };
}
