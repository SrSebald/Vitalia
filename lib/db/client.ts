import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb__: ReturnType<typeof drizzle> | undefined;
  // eslint-disable-next-line no-var
  var __postgresClient__: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DIRECT_URL environment variable is not set. Please add it to your environment configuration.');
}

const getClient = () => {
  if (!globalThis.__postgresClient__) {
    globalThis.__postgresClient__ = postgres(connectionString, { prepare: false });
  }
  return globalThis.__postgresClient__;
};

export const sqlClient = getClient();

if (!globalThis.__drizzleDb__) {
  globalThis.__drizzleDb__ = drizzle(sqlClient);
}

export const db = globalThis.__drizzleDb__;

export const closeDbConnection = async () => {
  if (globalThis.__postgresClient__) {
    await globalThis.__postgresClient__.end();
    globalThis.__postgresClient__ = undefined;
    globalThis.__drizzleDb__ = undefined;
  }
};
