import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { filename: string } }) {
  const filename = params.filename;
  const filePath = path.join(process.cwd(), "public", "rendered", filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Video not found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": stat.size.toString(),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
