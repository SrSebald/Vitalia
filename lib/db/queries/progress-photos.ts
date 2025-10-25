import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { db } from '../client';
import { progressPhotos } from '../schema';
import type { ProgressPhoto, ProgressPhotoFilters } from '../types';

/**
 * Get progress photos by user ID with filters
 */
export async function getProgressPhotosByUserId(filters: ProgressPhotoFilters): Promise<ProgressPhoto[]> {
  try {
    const conditions = [eq(progressPhotos.userId, filters.userId)];
    
    if (filters.startDate) {
      conditions.push(gte(progressPhotos.takenOn, filters.startDate));
    }
    
    if (filters.endDate) {
      conditions.push(lte(progressPhotos.takenOn, filters.endDate));
    }

    const result = await db
      .select()
      .from(progressPhotos)
      .where(and(...conditions))
      .orderBy(desc(progressPhotos.takenOn), desc(progressPhotos.createdAt))
      .limit(filters.limit || 50)
      .offset(filters.offset || 0);

    return result;
  } catch (error) {
    console.error('Error fetching progress photos:', error);
    throw new Error('Failed to fetch progress photos');
  }
}

/**
 * Get progress photos by date range
 */
export async function getProgressPhotosByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
  limit = 50,
  offset = 0
): Promise<ProgressPhoto[]> {
  try {
    const result = await db
      .select()
      .from(progressPhotos)
      .where(
        and(
          eq(progressPhotos.userId, userId),
          gte(progressPhotos.takenOn, startDate),
          lte(progressPhotos.takenOn, endDate)
        )
      )
      .orderBy(desc(progressPhotos.takenOn), desc(progressPhotos.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching progress photos by date range:', error);
    throw new Error('Failed to fetch progress photos by date range');
  }
}

/**
 * Get a specific progress photo by ID
 */
export async function getProgressPhotoById(id: string): Promise<ProgressPhoto | null> {
  try {
    const result = await db
      .select()
      .from(progressPhotos)
      .where(eq(progressPhotos.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching progress photo by ID:', error);
    throw new Error('Failed to fetch progress photo');
  }
}

/**
 * Get recent progress photos for a user
 */
export async function getRecentProgressPhotos(
  userId: string,
  limit = 10
): Promise<ProgressPhoto[]> {
  try {
    const result = await db
      .select()
      .from(progressPhotos)
      .where(eq(progressPhotos.userId, userId))
      .orderBy(desc(progressPhotos.takenOn), desc(progressPhotos.createdAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Error fetching recent progress photos:', error);
    throw new Error('Failed to fetch recent progress photos');
  }
}

/**
 * Get progress photos by year
 */
export async function getProgressPhotosByYear(
  userId: string,
  year: number,
  limit = 50,
  offset = 0
): Promise<ProgressPhoto[]> {
  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const result = await db
      .select()
      .from(progressPhotos)
      .where(
        and(
          eq(progressPhotos.userId, userId),
          gte(progressPhotos.takenOn, startDate),
          lte(progressPhotos.takenOn, endDate)
        )
      )
      .orderBy(desc(progressPhotos.takenOn), desc(progressPhotos.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching progress photos by year:', error);
    throw new Error('Failed to fetch progress photos by year');
  }
}

/**
 * Get progress photos by month
 */
export async function getProgressPhotosByMonth(
  userId: string,
  year: number,
  month: number,
  limit = 50,
  offset = 0
): Promise<ProgressPhoto[]> {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await db
      .select()
      .from(progressPhotos)
      .where(
        and(
          eq(progressPhotos.userId, userId),
          gte(progressPhotos.takenOn, startDate),
          lte(progressPhotos.takenOn, endDate)
        )
      )
      .orderBy(desc(progressPhotos.takenOn), desc(progressPhotos.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching progress photos by month:', error);
    throw new Error('Failed to fetch progress photos by month');
  }
}

/**
 * Get progress photo statistics
 */
export async function getProgressPhotoStats(userId: string) {
  try {
    const stats = await db
      .select({
        totalPhotos: sql<number>`count(*)`,
        firstPhoto: sql<Date>`min(${progressPhotos.takenOn})`,
        lastPhoto: sql<Date>`max(${progressPhotos.takenOn})`,
        photosThisYear: sql<number>`count(*) filter (where extract(year from ${progressPhotos.takenOn}) = extract(year from now()))`,
        photosThisMonth: sql<number>`count(*) filter (where extract(year from ${progressPhotos.takenOn}) = extract(year from now()) and extract(month from ${progressPhotos.takenOn}) = extract(month from now()))`
      })
      .from(progressPhotos)
      .where(eq(progressPhotos.userId, userId));

    return stats[0] || {
      totalPhotos: 0,
      firstPhoto: null,
      lastPhoto: null,
      photosThisYear: 0,
      photosThisMonth: 0
    };
  } catch (error) {
    console.error('Error fetching progress photo stats:', error);
    throw new Error('Failed to fetch progress photo statistics');
  }
}
