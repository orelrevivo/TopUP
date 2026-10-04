import { Client } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";

dotenv.config();
import { processVerticalClip } from "../lib/media/ffmpeg";

dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const res = await client.query(`SELECT id, video_url, title FROM creator_clips`);
  
  const publicRenderDir = path.join(process.cwd(), "public", "rendered");
  if (!fs.existsSync(publicRenderDir)) {
    fs.mkdirSync(publicRenderDir, { recursive: true });
  }

  for (const row of res.rows) {
    if (row.video_url && row.video_url.startsWith("/rendered/")) {
      const filename = path.basename(row.video_url);
      const filePath = path.join(publicRenderDir, filename);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 1000) {
        console.log(`Generating valid MP4 for ${filename}...`);
        await processVerticalClip({
          inputPath: "",
          outputPath: filePath,
          startTime: 0,
          endTime: 10,
          title: row.title || "AI Clip",
        });
        console.log(`Successfully processed ${filename}`);
      }
    }
  }

  await client.end();
}

main().catch(console.error);
