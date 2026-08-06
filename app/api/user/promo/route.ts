import { NextResponse, NextRequest } from 'next/server';
import { getUserId } from '~/lib/auth';
import { db } from '~/lib/db';
import { users, payments } from '~/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req as unknown as NextRequest);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized — please log in and try again.' }, { status: 401 });
    }

    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Promo code is required.' }, { status: 400 });
    }

    if (code.trim() !== 'Early Access') {
      return NextResponse.json({ error: 'Invalid promo code.' }, { status: 400 });
    }

    // Check if the user has already used this promo code
    const existingUsage = await db.select()
      .from(payments)
      .where(and(eq(payments.userId, userId), eq(payments.orderId, 'PROMO_EARLY_ACCESS')))
      .limit(1);

    if (existingUsage.length > 0) {
      return NextResponse.json({ error: 'This promo code has already been redeemed by this account.' }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month validation

    // Update user balance (+200 cents = $2.00) and set tier to 'early access'
    await db.update(users).set({
      balance: sql`${users.balance} + 200`,
      subscriptionTier: 'early access',
      subscriptionExpiresAt: expiresAt,
      updatedAt: new Date(),
    }).where(eq(users.id, userId));

    // Record payment/redemption to prevent reuse
    await db.insert(payments).values({
      userId,
      orderId: 'PROMO_EARLY_ACCESS',
      amount: 200,
      tier: 'early access',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error redeeming promo code:', error);
    return NextResponse.json(
      { error: 'Internal server error', detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
