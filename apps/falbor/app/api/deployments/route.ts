import { NextResponse } from 'next/server';
import { db } from '~/lib/db';
import { deployments, falborSiteFiles } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';

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

    // Check if new subdomain is already taken in the DB
    const existingRow = await db.query.falborSiteFiles.findFirst({
      where: eq(falborSiteFiles.subdomain, newSubdomain),
    });
    if (existingRow && existingRow.chatId !== chatId) {
      return NextResponse.json({ error: 'Subdomain already taken' }, { status: 400 });
    }

    // Rename the subdomain in falborSiteFiles and rewrite asset paths in index.html
    const siteRow = await db.query.falborSiteFiles.findFirst({
      where: eq(falborSiteFiles.subdomain, oldSubdomain),
    });

    if (siteRow) {
      const files = siteRow.files as Record<string, string>;
      if (files['/index.html']) {
        files['/index.html'] = files['/index.html'].replace(
          new RegExp(`/api/site/${oldSubdomain}/`, 'g'),
          `/api/site/${newSubdomain}/`,
        );
      }
      await db
        .update(falborSiteFiles)
        .set({ subdomain: newSubdomain, files: files as any, updatedAt: new Date() })
        .where(eq(falborSiteFiles.subdomain, oldSubdomain));
    }

    const newUrl = `/api/site/${newSubdomain}`;

    // Update the deployments table
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
