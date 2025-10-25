import { eq, and, desc } from 'drizzle-orm';
import { db } from '../client';
import { profiles } from '../schema';
import type { Profile } from '../types';

/**
 * Get a profile by ID
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching profile by ID:', error);
    throw new Error('Failed to fetch profile');
  }
}

/**
 * Get a profile by username
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  try {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.username, username))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching profile by username:', error);
    throw new Error('Failed to fetch profile by username');
  }
}

/**
 * Get a profile by auth user ID
 */
export async function getProfileByAuthUserId(authUserId: string): Promise<Profile | null> {
  try {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.authUserId, authUserId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching profile by auth user ID:', error);
    throw new Error('Failed to fetch profile by auth user ID');
  }
}

/**
 * Check if a username is available
 */
export async function isUsernameAvailable(username: string, excludeId?: string): Promise<boolean> {
  try {
    const conditions = [eq(profiles.username, username)];
    
    if (excludeId) {
      conditions.push(eq(profiles.id, excludeId));
    }

    const result = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(and(...conditions))
      .limit(1);

    return result.length === 0;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw new Error('Failed to check username availability');
  }
}

/**
 * Get profiles with pagination
 */
export async function getProfiles(limit = 20, offset = 0): Promise<Profile[]> {
  try {
    const result = await db
      .select()
      .from(profiles)
      .orderBy(desc(profiles.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw new Error('Failed to fetch profiles');
  }
}

/**
 * Search profiles by name or username
 */
export async function searchProfiles(
  query: string,
  limit = 20,
  offset = 0
): Promise<Profile[]> {
  try {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    const result = await db
      .select()
      .from(profiles)
      .where(
        and(
          // Search in full_name or username
          // Note: This is a simplified search - for production, consider using full-text search
          eq(profiles.fullName, searchTerm)
        )
      )
      .orderBy(desc(profiles.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error searching profiles:', error);
    throw new Error('Failed to search profiles');
  }
}
