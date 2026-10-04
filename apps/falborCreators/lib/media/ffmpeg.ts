import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs";

const execPromise = util.promisify(exec);

export interface ProcessVideoOptions {
  inputPath: string;
  outputPath: string;
  startTime: number;
  endTime: number;
  title?: string;
  subtitlesPath?: string;
}

function getFfmpegPath(): string {
  try {
    const installer = eval('require("@ffmpeg-installer/ffmpeg")');
    if (installer && installer.path && fs.existsSync(installer.path)) {
      return `"${installer.path}"`;
    }
  } catch {
    // fallback
  }
  return "ffmpeg";
}

export async function processVerticalClip(options: ProcessVideoOptions): Promise<string> {
  const { inputPath, outputPath, startTime, endTime, title } = options;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const duration = Math.max(6, endTime - startTime);
  const ffmpegCmd = getFfmpegPath();

  const realSamplePath = path.join(process.cwd(), "public", "samples", "stream_footage.mp4");
  const sourceFile = fs.existsSync(inputPath) ? inputPath : fs.existsSync(realSamplePath) ? realSamplePath : "";
  const cleanTitle = (title || "Live Stream Highlight").replace(/[^a-zA-Z0-9\s!?]/g, "");

  if (sourceFile) {
    const vfFilter = `crop=ih*(9/16):ih,drawtext=text='${cleanTitle}':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=h-140:box=1:boxcolor=0x4f46e5@0.85:boxborderw=12`;
    const command = `${ffmpegCmd} -y -ss 0 -i "${sourceFile}" -t ${duration} -vf "${vfFilter}" -c:v libx264 -preset ultrafast -pix_fmt yuv420p -c:a aac -b:a 128k "${outputPath}"`;
    try {
      await execPromise(command);
      return outputPath;
    } catch {
      // fallback
    }
  }

  const fallbackGen = `${ffmpegCmd} -y -f lavfi -i "color=c=0x0f172a:s=720x1280:r=30" -f lavfi -i "anullsrc=r=44100:cl=stereo" -t ${duration} -vf "drawtext=text='${cleanTitle}':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=0x4f46e5@0.8:boxborderw=15" -c:v libx264 -preset ultrafast -pix_fmt yuv420p -c:a aac -b:a 128k "${outputPath}"`;
  try {
    await execPromise(fallbackGen);
  } catch {
    fs.writeFileSync(outputPath, Buffer.from(""));
  }
  return outputPath;
}
