import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_Uj32HluyYoWS@ep-green-glade-axmu503k-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require' });
try {
  const res = await pool.query('SELECT 1 as x');
  console.log('Success:', res.rows);
} catch (e) {
  console.error('Error:', e.message);
} finally {
  await pool.end();
}
