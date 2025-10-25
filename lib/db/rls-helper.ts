/**
 * RLS (Row Level Security) Helper Functions
 * 
 * These utilities help set the current user context for database queries,
 * enabling Row Level Security policies to work correctly.
 */

import { Sql } from 'postgres';

/**
 * Sets the current user ID in the database session
 * This allows RLS policies to filter data based on the authenticated user
 * 
 * @param sql - Postgres SQL connection instance
 * @param userId - The authenticated user's UUID
 * 
 * @example
 * ```typescript
 * import { sql } from './db';
 * import { setCurrentUser } from './rls-helper';
 * 
 * // Set user context before queries
 * await setCurrentUser(sql, userId);
 * 
 * // Now all queries will respect RLS policies
 * const workouts = await sql`SELECT * FROM workouts`;
 * ```
 */
export async function setCurrentUser(sql: Sql, userId: string): Promise<void> {
  await sql`SET app.current_user_id = ${userId}`;
}

/**
 * Resets the current user session
 * Useful for cleanup or switching contexts
 * 
 * @param sql - Postgres SQL connection instance
 */
export async function resetCurrentUser(sql: Sql): Promise<void> {
  await sql`RESET app.current_user_id`;
}

/**
 * Executes a function with user context, then resets it
 * This is the recommended way to use RLS with queries
 * 
 * @param sql - Postgres SQL connection instance
 * @param userId - The authenticated user's UUID
 * @param callback - Async function to execute with user context
 * @returns The result of the callback function
 * 
 * @example
 * ```typescript
 * import { sql } from './db';
 * import { withUserContext } from './rls-helper';
 * 
 * const result = await withUserContext(sql, userId, async () => {
 *   // All queries here will use the user context
 *   const workouts = await sql`SELECT * FROM workouts`;
 *   const nutrition = await sql`SELECT * FROM nutrition_logs`;
 *   return { workouts, nutrition };
 * });
 * ```
 */
export async function withUserContext<T>(
  sql: Sql,
  userId: string,
  callback: () => Promise<T>
): Promise<T> {
  try {
    await setCurrentUser(sql, userId);
    return await callback();
  } finally {
    await resetCurrentUser(sql);
  }
}

/**
 * Gets the profile ID for a given auth user ID
 * Useful for converting authentication IDs to profile IDs
 * 
 * @param sql - Postgres SQL connection instance
 * @param authUserId - The authenticated user's UUID from the auth system
 * @returns The profile UUID or null if not found
 */
export async function getProfileIdByAuthUserId(
  sql: Sql,
  authUserId: string
): Promise<string | null> {
  const result = await sql`
    SELECT id FROM profiles WHERE auth_user_id = ${authUserId} LIMIT 1
  `;
  return result[0]?.id || null;
}

/**
 * Middleware helper for Next.js API routes
 * Sets the user context from a request object
 * 
 * @example
 * ```typescript
 * // In an API route:
 * export async function GET(request: NextRequest) {
 *   const userId = getUserIdFromSession(request);
 *   
 *   return withUserContext(sql, userId, async () => {
 *     const data = await sql`SELECT * FROM workouts`;
 *     return NextResponse.json(data);
 *   });
 * }
 * ```
 */

