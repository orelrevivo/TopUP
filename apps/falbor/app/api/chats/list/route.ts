import { NextResponse } from 'next/server';
import { db } from '~/lib/db';
import { chats, hackingChats, users } from '~/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  headers();
  try {
    // In a real app we'd filter by logged-in user, but for now we get the default user
    const [defaultUser] = await db.select().from(users).limit(1);
    if (!defaultUser) {
      return NextResponse.json({ success: true, data: [] });
    }

    const list1 = await db.select({
      id: chats.id,
      title: chats.title,
      createdAt: chats.createdAt
    })
    .from(chats)
    .where(eq(chats.userId, defaultUser.id));

    const list2 = await db.select({
      id: hackingChats.id,
      title: hackingChats.title,
      createdAt: hackingChats.createdAt
    })
    .from(hackingChats)
    .where(eq(hackingChats.userId, defaultUser.id));

    const combined = [...list1, ...list2].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ success: true, data: combined });
  } catch (error: any) {
    console.error('List chats error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
