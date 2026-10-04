import { db } from "@/db";
import { creatorStreams, creatorClips, creatorAutomationSettings, creatorProcessingLogs } from "@/db/schema";
import { getPlatformAdapter } from "@/lib/adapters";
import { transcribeAudio } from "@/lib/media/transcription";
import { detectClipMoments } from "@/lib/ai/clipDetector";
import { processVerticalClip } from "@/lib/media/ffmpeg";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";

export async function processStreamPipeline(streamId: string) {
  const [stream] = await db.select().from(creatorStreams).where(eq(creatorStreams.id, streamId));
  if (!stream) return;

  const isStopped = async () => {
    const [curr] = await db.select().from(creatorStreams).where(eq(creatorStreams.id, streamId));
    return curr?.status === "stopped";
  };

  if (await isStopped()) return;

  await db.update(creatorStreams).set({ status: "processing" }).where(eq(creatorStreams.id, streamId));
  await logProgress(streamId, "info", "Starting stream video processing pipeline");

  const [settings] = await db.select().from(creatorAutomationSettings).where(eq(creatorAutomationSettings.userId, stream.userId));
  const autoPublish = settings?.autoPublish ?? false;
  const minScore = settings?.minClipScore ?? 70;

  try {
    if (await isStopped()) return;
    await db.update(creatorStreams).set({ status: "transcribing" }).where(eq(creatorStreams.id, streamId));
    await logProgress(streamId, "info", "Transcribing stream audio with Whisper...");
    const transcript = await transcribeAudio(stream.vodUrl || "mock.mp4", settings?.language || "en");

    if (await isStopped()) return;
    await db.update(creatorStreams).set({ status: "selecting_clips" }).where(eq(creatorStreams.id, streamId));
    await logProgress(streamId, "info", "Running AI moment detection algorithm...");
    const moments = await detectClipMoments(transcript, settings?.language || "en", stream.title || "Livestream");

    if (await isStopped()) return;
    await db.update(creatorStreams).set({ status: "rendering" }).where(eq(creatorStreams.id, streamId));
    await logProgress(streamId, "info", `Rendering ${moments.length} vertical 9:16 clips with burned captions...`);

    const publicRenderDir = path.join(process.cwd(), "public", "rendered");
    if (!fs.existsSync(publicRenderDir)) {
      fs.mkdirSync(publicRenderDir, { recursive: true });
    }

    for (const moment of moments) {
      if (await isStopped()) {
        await logProgress(streamId, "info", "Pipeline halted by user stop command");
        return;
      }

      const clipId = `clip_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const outputFilePath = path.join(publicRenderDir, `${clipId}.mp4`);

      await processVerticalClip({
        inputPath: stream.vodUrl || "",
        outputPath: outputFilePath,
        startTime: moment.startTime,
        endTime: moment.endTime,
        title: moment.title,
      });

      await db.insert(creatorClips).values({
        id: clipId,
        streamId,
        userId: stream.userId,
        title: moment.title,
        hookText: moment.hookText,
        description: `${moment.title}\n\n${moment.suggestedCaption}`,
        hashtags: ["#shorts", "#livestream", "#highlight"],
        startTime: moment.startTime,
        endTime: moment.endTime,
        score: moment.score,
        contentType: moment.contentType,
        videoUrl: `/rendered/${clipId}.mp4`,
        status: autoPublish && moment.score >= minScore ? "uploading" : "generated",
        riskFlags: moment.riskFlags,
      });

      if (autoPublish && moment.score >= minScore) {
        await logProgress(streamId, "info", `Auto-publishing clip ${clipId} to connected YouTube channel`);
        const adapter = getPlatformAdapter("youtube");
        await adapter.uploadClip(stream.userId, clipId, outputFilePath, {
          title: moment.title,
          description: moment.suggestedCaption,
        });
        await db.update(creatorClips).set({ status: "published" }).where(eq(creatorClips.id, clipId));
      }
    }

    await db.update(creatorStreams).set({ status: autoPublish ? "published" : "clips_ready" }).where(eq(creatorStreams.id, streamId));
    await logProgress(streamId, "info", "Pipeline completed successfully");
  } catch (error) {
    await db.update(creatorStreams).set({ status: "failed" }).where(eq(creatorStreams.id, streamId));
    await logProgress(streamId, "error", `Processing failed: ${(error as Error).message}`);
  }
}

async function logProgress(streamId: string, level: string, message: string) {
  await db.insert(creatorProcessingLogs).values({
    id: `log_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    streamId,
    level,
    message,
  });
}
