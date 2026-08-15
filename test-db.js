const { Pool } = require('pg');
require('dotenv').config({ path: 'apps/falbor/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT email, role, agency_id FROM users LIMIT 5').then(res => {
  console.log(res.rows);
  pool.end();
}).catch(console.error);
