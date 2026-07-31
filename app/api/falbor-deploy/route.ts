import { NextResponse } from "next/server";
import { db } from "~/lib/db";
import { falborSiteFiles } from "~/lib/db/schema";
import { eq } from "drizzle-orm";

const json = NextResponse.json;

interface DeployRequestBody {
  files: Record<string, string>;
  chatId: string;
  subdomain?: string;
}

export async function POST(request: Request) {
  try {
    const { files, chatId, subdomain: existingSubdomain } = (await request.json()) as DeployRequestBody;

    if (!files || Object.keys(files).length === 0) {
      return json({ error: 'No files provided' }, { status: 400 });
    }

    if (!chatId) {
      return json({ error: 'No chatId provided' }, { status: 400 });
    }

    // Use existing subdomain if provided, otherwise generate a new one
    const subdomain = existingSubdomain || `site-${chatId.substring(0, 8)}-${Date.now().toString(36)}`;

    // Normalize file paths and rewrite index.html asset paths so they
    // resolve correctly when served from /api/site/[subdomain]/...
    const normalizedFiles: Record<string, string> = {};

    for (const [filePath, content] of Object.entries(files)) {
      const normalizedPath = filePath.startsWith('/') ? filePath : '/' + filePath;
      let finalContent = content;

      // Rewrite absolute asset paths in index.html to point to our API route prefix
      if (normalizedPath === '/index.html') {
        finalContent = finalContent.replace(
          /(src|href|content)\s*=\s*(['"])\/((?!\/)[^'"]*)(\2)/gi,
          `$1=$2/api/site/${subdomain}/$3$4`
        );
      }

      normalizedFiles[normalizedPath] = finalContent;
    }

    // Upsert site files into the database (no filesystem writes — works on Vercel)
    await db
      .insert(falborSiteFiles)
      .values({
        subdomain,
        chatId,
        files: normalizedFiles as any,
      })
      .onConflictDoUpdate({
        target: falborSiteFiles.subdomain,
        set: {
          chatId,
          files: normalizedFiles as any,
          updatedAt: new Date(),
        },
      });

    // Return the URL that points to our DB-backed API serving route
    const deployUrl = `/api/site/${subdomain}`;

    return json({
      success: true,
      url: deployUrl,
      subdomain,
    });
  } catch (error) {
    console.error('Falbor deploy error:', error);
    return json({ error: 'Deployment failed' }, { status: 500 });
  }
}
