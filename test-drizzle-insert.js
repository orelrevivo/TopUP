require('dotenv').config({ path: 'apps/falbor/.env' });
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { users } = require('./apps/falbor/drizzle/schema.js'); // Wait, drizzls/schema.ts is not compiled

