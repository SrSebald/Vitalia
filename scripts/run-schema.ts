import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sql as drizzleSql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

async function main() {
  const connectionString = process.env.DIRECT_URL;

  if (!connectionString) {
    throw new Error('DIRECT_URL environment variable is required to run the schema setup.');
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client);

  const schemaPath = resolve(process.cwd(), 'lib/db/schema.sql');
  const schemaSql = await readFile(schemaPath, 'utf8');

  try {
    await db.execute(drizzleSql.raw(schemaSql));
    console.log('Database schema applied successfully.');
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error('Failed to apply database schema:');
  console.error(error);
  process.exit(1);
});
