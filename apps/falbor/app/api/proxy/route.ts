import { NextResponse } from 'next/server';

/**
 * The legacy endpoint was a general-purpose HTML proxy. It is disabled until
 * the product has a documented, finite destination allow-list.
 */
export async function GET() {
  return NextResponse.json({ error: 'Gone' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: 'Gone' }, { status: 410 });
}
