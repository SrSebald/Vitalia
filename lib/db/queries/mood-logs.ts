import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { db } from '../client';
import { moodLogs } from '../schema';
import type { MoodLog, MoodLogFilters } from '../types';

/**
 * Get mood logs by user ID with filters
 */
export async function getMoodLogsByUserId(filters: MoodLogFilters): Promise<MoodLog[]> {
  try {
    const conditions = [eq(moodLogs.userId, filters.userId)];
    
    if (filters.startDate) {
      conditions.push(gte(moodLogs.loggedAt, filters.startDate));
    }
    
    if (filters.endDate) {
      conditions.push(lte(moodLogs.loggedAt, filters.endDate));
    }

    const result = await db
      .select()
      .from(moodLogs)
      .where(and(...conditions))
      .orderBy(desc(moodLogs.loggedAt))
      .limit(filters.limit || 50)
      .offset(filters.offset || 0);

    return result;
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    throw new Error('Failed to fetch mood logs');
  }
}

/**
 * Get mood logs by date range
 */
export async function getMoodLogsByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
  limit = 50,
  offset = 0
): Promise<MoodLog[]> {
  try {
    const result = await db
      .select()
      .from(moodLogs)
      .where(
        and(
          eq(moodLogs.userId, userId),
          gte(moodLogs.loggedAt, startDate),
          lte(moodLogs.loggedAt, endDate)
        )
      )
      .orderBy(desc(moodLogs.loggedAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching mood logs by date range:', error);
    throw new Error('Failed to fetch mood logs by date range');
  }
}

/**
 * Get a specific mood log by ID
 */
export async function getMoodLogById(id: number): Promise<MoodLog | null> {
  try {
    const result = await db
      .select()
      .from(moodLogs)
      .where(eq(moodLogs.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching mood log by ID:', error);
    throw new Error('Failed to fetch mood log');
  }
}

/**
 * Get recent mood logs for a user
 */
export async function getRecentMoodLogs(
  userId: string,
  limit = 10
): Promise<MoodLog[]> {
  try {
    const result = await db
      .select()
      .from(moodLogs)
      .where(eq(moodLogs.userId, userId))
      .orderBy(desc(moodLogs.loggedAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Error fetching recent mood logs:', error);
    throw new Error('Failed to fetch recent mood logs');
  }
}

/**
 * Get mood statistics for a user
 */
export async function getMoodStats(userId: string, startDate?: Date, endDate?: Date) {
  try {
    const conditions = [eq(moodLogs.userId, userId)];
    
    if (startDate) {
      conditions.push(gte(moodLogs.loggedAt, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(moodLogs.loggedAt, endDate));
    }

    const stats = await db
      .select({
        averageMood: sql<number>`avg(${moodLogs.moodRating})`,
        totalLogs: sql<number>`count(*)`,
        moodDistribution: sql<number>`count(*) filter (where ${moodLogs.moodRating} = 1)`,
        mood1: sql<number>`count(*) filter (where ${moodLogs.moodRating} = 1)`,
        mood2: sql<number>`count(*) filter (where ${moodLogs.moodRating} = 2)`,
        mood3: sql<number>`count(*) filter (where ${moodLogs.moodRating} = 3)`,
        mood4: sql<number>`count(*) filter (where ${moodLogs.moodRating} = 4)`,
        mood5: sql<number>`count(*) filter (where ${moodLogs.moodRating} = 5)`,
        firstLog: sql<Date>`min(${moodLogs.loggedAt})`,
        lastLog: sql<Date>`max(${moodLogs.loggedAt})`
      })
      .from(moodLogs)
      .where(and(...conditions));

    return stats[0] || {
      averageMood: 0,
      totalLogs: 0,
      mood1: 0,
      mood2: 0,
      mood3: 0,
      mood4: 0,
      mood5: 0,
      firstLog: null,
      lastLog: null
    };
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    throw new Error('Failed to fetch mood statistics');
  }
}

/**
 * Get mood trends by week
 */
export async function getMoodTrendsByWeek(
  userId: string,
  weeks = 12
): Promise<{ week: string; averageMood: number; logCount: number }[]> {
  try {
    const result = await db
      .select({
        week: sql<string>`to_char(${moodLogs.loggedAt}, 'YYYY-"W"WW')`,
        averageMood: sql<number>`avg(${moodLogs.moodRating})`,
        logCount: sql<number>`count(*)`
      })
      .from(moodLogs)
      .where(eq(moodLogs.userId, userId))
      .groupBy(sql`to_char(${moodLogs.loggedAt}, 'YYYY-"W"WW')`)
      .orderBy(sql`to_char(${moodLogs.loggedAt}, 'YYYY-"W"WW')`)
      .limit(weeks);

    return result;
  } catch (error) {
    console.error('Error fetching mood trends by week:', error);
    throw new Error('Failed to fetch mood trends');
  }
}

/**
 * Get mood logs by rating
 */
export async function getMoodLogsByRating(
  userId: string,
  rating: number,
  limit = 50,
  offset = 0
): Promise<MoodLog[]> {
  try {
    const result = await db
      .select()
      .from(moodLogs)
      .where(
        and(
          eq(moodLogs.userId, userId),
          eq(moodLogs.moodRating, rating)
        )
      )
      .orderBy(desc(moodLogs.loggedAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching mood logs by rating:', error);
    throw new Error('Failed to fetch mood logs by rating');
  }
}
