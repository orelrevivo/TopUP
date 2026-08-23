import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('api.database.execute');

export async function POST(request: Request) {
  try {
    const { chatId, databaseUrl, sql } = await request.json();

    if (!chatId || !databaseUrl || !sql) {
      return NextResponse.json({ error: 'chatId, databaseUrl, and sql are required' }, { status: 400 });
    }

    const sqlClient = neon(databaseUrl);
    try {
      const rows = await sqlClient([sql] as any);
      return NextResponse.json({ success: true, result: rows });
    } catch (dbError: any) {
      logger.error('DB Error inside execute:', dbError);
      throw dbError;
    }
  } catch (error: any) {
    logger.error('Failed to execute SQL:', error);
    return NextResponse.json({ error: error.message || 'Failed to execute SQL' }, { status: 500 });
  }
}
