import { NextResponse, NextRequest } from 'next/server';
import { getUserId, verifyToken, COOKIE_NAME } from '~/lib/auth';
import { db } from '~/lib/db';
import { users, payments } from '~/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';

async function getUserIdFromRequestOrToken(
  req: Request,
  sessionToken?: string
): Promise<string | null> {
  // Try standard cookie/header based auth first
  const userId = await getUserId(req as unknown as NextRequest);
  if (userId) return userId;

  // Fallback: accept session token passed explicitly in body
  if (sessionToken) {
    const payload = await verifyToken(sessionToken);
    if (payload?.userId) return payload.userId;
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequestOrToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRows = await db.select({
      balance: users.balance,
      subscriptionTier: users.subscriptionTier,
      subscriptionExpiresAt: users.subscriptionExpiresAt,
    }).from(users).where(eq(users.id, userId));

    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userRows[0];
    
    // Check if subscription has expired
    if (user.subscriptionTier !== 'free' && user.subscriptionExpiresAt) {
      if (new Date() > new Date(user.subscriptionExpiresAt)) {
        await db.update(users).set({ 
          subscriptionTier: 'free',
          subscriptionExpiresAt: null
        }).where(eq(users.id, userId));
        user.subscriptionTier = 'free';
      }
    }

    // Fetch payments
    const userPayments = await db.select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt))
      .limit(50);

    return NextResponse.json({ 
      balance: user.balance, 
      subscriptionTier: user.subscriptionTier,
      payments: userPayments
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, tier, sessionToken } = body;

    if (!orderId || amount === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const userId = await getUserIdFromRequestOrToken(req, sessionToken);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized — please log in and try again.' }, { status: 401 });
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const updateData: any = {
      balance: sql`${users.balance} + ${amountNum}`,
      updatedAt: new Date(),
    };

    if (tier) {
      updateData.subscriptionTier = tier.toLowerCase();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      updateData.subscriptionExpiresAt = expiresAt;
    }

    // Update user balance and tier
    await db.update(users).set(updateData).where(eq(users.id, userId));

    // Record payment (separate query — Neon HTTP driver doesn't support transactions)
    await db.insert(payments).values({
      userId,
      orderId,
      amount: amountNum,
      tier: tier ? tier.toLowerCase() : null,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding credits:', error);
    return NextResponse.json(
      { error: 'Internal server error', detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
