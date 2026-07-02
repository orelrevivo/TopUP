import { NextResponse } from 'next/server';
import { db } from '~/lib/db';
import { supabaseDatabases } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('api.database.admin');

async function runQuery(projectId: string, accessToken: string, query: string) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectId}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase query failed (${res.status}): ${text}`);
  }

  return res.json();
}

export async function POST(request: Request) {
  try {
    const { chatId, action, payload } = await request.json();

    if (!chatId || !action) {
      return NextResponse.json({ error: 'chatId and action are required' }, { status: 400 });
    }

    const [project] = await db
      .select()
      .from(supabaseDatabases)
      .where(eq(supabaseDatabases.chatId, chatId))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Database not found for this chat.' }, { status: 404 });
    }

    const accessToken = process.env.SUPABASE_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ error: 'SUPABASE_ACCESS_TOKEN is not configured on this server.' }, { status: 500 });
    }

    const projectId = project.projectId;

    if (action === 'get_tables') {
      const rows = await runQuery(projectId, accessToken, `
        SELECT schemaname, tablename
        FROM pg_catalog.pg_tables
        WHERE schemaname IN ('public', 'auth', 'storage')
        ORDER BY schemaname, tablename;
      `);

      const tables = rows.map((r: any) => ({
        schema: r.schemaname,
        name: r.tablename,
        fullName: r.schemaname === 'public' ? r.tablename : `${r.schemaname}.${r.tablename}`,
      }));

      return NextResponse.json({ tables });
    }

    if (action === 'get_table_data') {
      const fullTableName = payload?.tableName;
      if (!fullTableName || !/^[a-zA-Z0-9_.]+$/.test(fullTableName)) {
        return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
      }

      let schema = 'public';
      let table = fullTableName;
      if (fullTableName.includes('.')) {
        const parts = fullTableName.split('.');
        schema = parts[0];
        table = parts[1];
      }

      const rows = await runQuery(projectId, accessToken, `SELECT * FROM "${schema}"."${table}" LIMIT 100;`);
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      return NextResponse.json({ rows, columns });
    }

    if (action === 'get_users') {
      const rows = await runQuery(projectId, accessToken, `
        SELECT id, email, created_at, last_sign_in_at, banned_until, email_confirmed_at, role
        FROM auth.users
        ORDER BY created_at DESC;
      `);
      return NextResponse.json({ users: rows });
    }

    if (action === 'get_storage_buckets') {
      const rows = await runQuery(projectId, accessToken, `
        SELECT id, name, public, created_at
        FROM storage.buckets
        ORDER BY created_at DESC;
      `);
      return NextResponse.json({ buckets: rows });
    }

    if (action === 'get_storage_files') {
      const bucketId = payload?.bucketId;
      if (!bucketId) return NextResponse.json({ error: 'bucketId required' }, { status: 400 });
      const rows = await runQuery(projectId, accessToken, `
        SELECT name, metadata, created_at, updated_at
        FROM storage.objects
        WHERE bucket_id = '${bucketId.replace(/'/g, "''")}'
        ORDER BY created_at DESC
        LIMIT 100;
      `);
      return NextResponse.json({ files: rows });
    }

    if (action === 'get_functions') {
      const rows = await runQuery(projectId, accessToken, `
        SELECT routine_name AS name, routine_schema AS schema, routine_type AS type, data_type AS return_type
        FROM information_schema.routines
        WHERE routine_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY routine_schema, routine_name;
      `);
      return NextResponse.json({ functions: rows });
    }

    if (action === 'get_logs') {
      const rows = await runQuery(projectId, accessToken, `
        SELECT NOW() AS log_time, 'Log access via Supabase Management API is not available in self-hosted mode' AS message
        LIMIT 1;
      `);
      return NextResponse.json({ logs: rows });
    }

    if (action === 'delete_user') {
      const userId = payload?.userId;
      if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      await runQuery(projectId, accessToken, `DELETE FROM auth.users WHERE id = '${userId.replace(/'/g, "''")}';`);
      return NextResponse.json({ success: true });
    }

    if (action === 'ban_user') {
      const userId = payload?.userId;
      if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      await runQuery(projectId, accessToken, `UPDATE auth.users SET banned_until = NOW() + INTERVAL '100 years' WHERE id = '${userId.replace(/'/g, "''")}';`);
      return NextResponse.json({ success: true });
    }

    if (action === 'unban_user') {
      const userId = payload?.userId;
      if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      await runQuery(projectId, accessToken, `UPDATE auth.users SET banned_until = NULL WHERE id = '${userId.replace(/'/g, "''")}';`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error: any) {
    logger.error('Admin DB Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
