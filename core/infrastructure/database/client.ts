import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as pgSchema from './postgres/schema.ts';

const dbType = Deno.env.get('DB_TYPE') || 'postgres';

export let db: any;
export let schema: any;

if (dbType === 'postgres') {
  const connectionString = Deno.env.get('DATABASE_URL');
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for postgres DB_TYPE');
  }
  const client = postgres(connectionString);
  db = drizzlePg(client, { schema: pgSchema });
  schema = pgSchema;
} else {
    // SQLite implementation removed for now as file is missing
    throw new Error('SQLite implementation is currently unavailable');
}

export const isPostgres = dbType === 'postgres';
