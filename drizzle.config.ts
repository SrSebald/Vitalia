import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// For drizzle-kit commands, use DIRECT_URL (non-pooled connection)
// This is the direct connection without pgbouncer
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL environment variable is required to run Drizzle commands.');
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
});
