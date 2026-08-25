import { NextResponse } from 'next/server';
import { db } from '~/lib/db';
import { templates } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const data = await db
      .select()
      .from(templates)
      .where(eq(templates.userId, userId));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('List templates error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
