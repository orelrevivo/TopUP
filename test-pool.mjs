import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: 'Enter your connection string here' });
try {
  const res = await pool.query('SELECT 1 as x');
  console.log('Success:', res.rows);
} catch (e) {
  console.error('Error:', e.message);
} finally {
  await pool.end();
}
