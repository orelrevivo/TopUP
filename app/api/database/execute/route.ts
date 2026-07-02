import { NextResponse } from "next/server";
import { SupabaseService } from "~/lib/services/supabaseService";
import { createScopedLogger } from "~/utils/logger";

const logger = createScopedLogger("api.database.execute");

export async function POST(request: Request) {
  try {
    const { chatId, sql } = await request.json();

    if (!chatId || !sql) {
      return NextResponse.json({ error: "chatId and sql are required" }, { status: 400 });
    }

    const projectData = await SupabaseService.getOrCreateSupabaseProject(chatId);

    if (!projectData || !projectData.projectId) {
      return NextResponse.json({ error: "Failed to retrieve Supabase project for chat" }, { status: 404 });
    }

    const result = await SupabaseService.executeSql(projectData.projectId, sql);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    logger.error("Failed to execute SQL:", error);
    return NextResponse.json({ error: error.message || "Failed to execute SQL" }, { status: 500 });
  }
}
