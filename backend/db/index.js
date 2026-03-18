const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const schema = require('./schema.js');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the environment');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

module.exports = { db };
