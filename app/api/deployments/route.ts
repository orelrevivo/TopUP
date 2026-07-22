import { NextResponse } from 'next/server';
import { db } from '~/lib/db';
import { deployments } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
  }

  try {
    const deployment = await db.query.deployments.findFirst({
      where: eq(deployments.chatId, chatId),
    });

    return NextResponse.json(deployment || null);
  } catch (error) {
    console.error('Error fetching deployment:', error);
    return NextResponse.json({ error: 'Failed to fetch deployment' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { chatId, url, provider, subdomain } = data;

    if (!chatId || !url || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert or update deployment
    const [deployment] = await db
      .insert(deployments)
      .values({
        chatId,
        url,
        provider,
        subdomain,
      })
      .onConflictDoUpdate({
        target: deployments.chatId,
        set: {
          url,
          provider,
          subdomain,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json(deployment);
  } catch (error) {
    console.error('Error saving deployment:', error);
    return NextResponse.json({ error: 'Failed to save deployment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
  }

  try {
    // We optionally might want to clean up files if it was a falbor deployment
    // but the user only mentioned deleting the URL from the server for now.
    
    await db.delete(deployments).where(eq(deployments.chatId, chatId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deployment:', error);
    return NextResponse.json({ error: 'Failed to delete deployment' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { chatId, newSubdomain } = data;

    if (!chatId || !newSubdomain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const deployment = await db.query.deployments.findFirst({
      where: eq(deployments.chatId, chatId),
    });

    if (!deployment || deployment.provider !== 'falbor') {
      return NextResponse.json({ error: 'Only falbor deployments can be renamed this way' }, { status: 400 });
    }

    const oldSubdomain = deployment.subdomain;
    if (!oldSubdomain) {
      return NextResponse.json({ error: 'Invalid deployment state' }, { status: 400 });
    }

    // Rename the directory in public/site/
    const publicDir = path.join(process.cwd(), 'public', 'site');
    const oldPath = path.join(publicDir, oldSubdomain);
    const newPath = path.join(publicDir, newSubdomain);

    if (fs.existsSync(oldPath)) {
      if (fs.existsSync(newPath)) {
        return NextResponse.json({ error: 'Subdomain already taken' }, { status: 400 });
      }

      // Read index.html and update the relative paths before renaming the folder
      const indexPath = path.join(oldPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf-8');
        // Replace /site/oldSubdomain/ with /site/newSubdomain/
        content = content.replace(new RegExp(`/site/${oldSubdomain}/`, 'g'), `/site/${newSubdomain}/`);
        fs.writeFileSync(indexPath, content);
      }

      fs.renameSync(oldPath, newPath);
    }

    const newUrl = `/site/${newSubdomain}`;

    // Update DB
    const [updated] = await db
      .update(deployments)
      .set({
        subdomain: newSubdomain,
        url: newUrl,
        updatedAt: new Date(),
      })
      .where(eq(deployments.chatId, chatId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error renaming deployment:', error);
    return NextResponse.json({ error: 'Failed to rename deployment' }, { status: 500 });
  }
}
