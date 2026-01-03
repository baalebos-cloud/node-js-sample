process.env.NODE_DEBUG = 'pg'; require('dotenv').config(); // Load environment variables from .env
const { Pool } = require('pg');

const isRenderInternal =
  process.env.DATABASE_URL?.includes('postgres.internal');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRenderInternal
    ? false
    : { rejectUnauthorized: false },

  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected DB error', err);
});

module.exports = pool;
