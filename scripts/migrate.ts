import { drizzle } from 'npm:drizzle-orm@^0.29.3/postgres-js';
import { migrate } from 'npm:drizzle-orm@^0.29.3/postgres-js/migrator';
import postgres from 'npm:postgres@^3.4.3';
import "https://deno.land/std@0.224.0/dotenv/load.ts";

async function main() {
  const connectionString = Deno.env.get('DATABASE_URL');

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'core/infrastructure/database/postgres/drizzle' });
  console.log('Migrations complete!');
  await sql.end();
}

main().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  Deno.exit(1);
});
