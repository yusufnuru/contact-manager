import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import { DB_URL } from '../constants/env.js';
import * as ContactModel from '../models/contact-model.js';
import * as ContactCategoryModel from '../models/contact-category-model.js';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: DB_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...ContactModel,
    ...ContactCategoryModel,
  },
});

export type PgDatabase = typeof db;

export const connectToDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL with Drizzle');
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL with Drizzle', error);
    process.exit(1);
  }
};

export const closeDatabase = async () => {
  try {
    await pool.end();
    console.log('✅ Successfully Database Pool closed');
  } catch (error) {
    console.error('❌ Error closing database pool', error);
  }
};
