import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
    
    // Determine the public directory path where we'll serve the static files
    const publicDir = path.join(process.cwd(), 'public');
    const deployDir = path.join(publicDir, 'site', subdomain);

    // Ensure the deployment directory exists
    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir, { recursive: true });
    }

    // Write all files
    for (const [filePath, content] of Object.entries(files)) {
      // Ensure file path starts with a forward slash
      const normalizedPath = filePath.startsWith('/') ? filePath : '/' + filePath;
      
      const fullPath = path.join(deployDir, normalizedPath);
      const dirPath = path.dirname(fullPath);

      // Ensure subdirectory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      let finalContent = content;
      
      // Rewrite absolute asset paths in index.html to point to our subdirectory
      if (normalizedPath === '/index.html') {
        // Replace src="/...", href="/...", etc. with our subfolder prefix
        finalContent = finalContent.replace(/(src|href|content)\s*=\s*(['"])\/([^'"]*)\2/gi, `$1=$2/site/${subdomain}/$3$2`);
      }

      // Write file content
      fs.writeFileSync(fullPath, finalContent);
    }

    // Return the clean URL without index.html
    const deployUrl = `/site/${subdomain}`;

    return json({
      success: true,
      url: deployUrl,
      subdomain
    });
  } catch (error) {
    console.error('Falbor deploy error:', error);
    return json({ error: 'Deployment failed' }, { status: 500 });
  }
}
