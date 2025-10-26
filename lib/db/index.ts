import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use DATABASE_URL for transaction mode (better for serverless with pooling)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Singleton pattern to reuse the same connection
const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined;
};

// Create or reuse connection with proper pooling for serverless
const client =
  globalForDb.client ??
  postgres(connectionString, {
    prepare: false,
    max: 10, // Reasonable pool size
    idle_timeout: 20, // Close idle connections after 20 seconds
    max_lifetime: 60 * 30, // 30 minutes max lifetime
    connect_timeout: 10, // 10 seconds to establish connection
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
