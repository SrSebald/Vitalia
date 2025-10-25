import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DIRECT_URL environment variable is required to run Drizzle commands.');
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
  casing: 'snake_case',
});
