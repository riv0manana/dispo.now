import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './core/infrastructure/database/postgres/schema.ts',
  out: './core/infrastructure/database/postgres/drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
