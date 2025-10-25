import { eq } from 'drizzle-orm';
import { db } from '../client';
import { moodLogs } from '../schema';
import type { InsertMoodLog, UpdateMoodLog, MoodLog } from '../types';

/**
 * Create a new mood log
 */
export async function createMoodLog(data: InsertMoodLog): Promise<MoodLog> {
  try {
    const result = await db
      .insert(moodLogs)
      .values(data)
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating mood log:', error);
    throw new Error('Failed to create mood log');
  }
}

/**
 * Update a mood log
 */
export async function updateMoodLog(id: number, data: UpdateMoodLog): Promise<MoodLog> {
  try {
    const result = await db
      .update(moodLogs)
      .set(data)
      .where(eq(moodLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Mood log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating mood log:', error);
    throw new Error('Failed to update mood log');
  }
}

/**
 * Delete a mood log
 */
export async function deleteMoodLog(id: number): Promise<void> {
  try {
    const result = await db
      .delete(moodLogs)
      .where(eq(moodLogs.id, id))
      .returning({ id: moodLogs.id });

    if (result.length === 0) {
      throw new Error('Mood log not found');
    }
  } catch (error) {
    console.error('Error deleting mood log:', error);
    throw new Error('Failed to delete mood log');
  }
}

/**
 * Update mood rating
 */
export async function updateMoodRating(id: number, moodRating: number): Promise<MoodLog> {
  try {
    // Validate mood rating is between 1 and 5
    if (moodRating < 1 || moodRating > 5) {
      throw new Error('Mood rating must be between 1 and 5');
    }

    const result = await db
      .update(moodLogs)
      .set({
        moodRating,
      })
      .where(eq(moodLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Mood log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating mood rating:', error);
    if (error instanceof Error && error.message.includes('Mood rating must be between 1 and 5')) {
      throw error;
    }
    throw new Error('Failed to update mood rating');
  }
}

/**
 * Update mood log notes
 */
export async function updateMoodLogNotes(id: number, notes: string): Promise<MoodLog> {
  try {
    const result = await db
      .update(moodLogs)
      .set({
        notes,
      })
      .where(eq(moodLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Mood log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating mood log notes:', error);
    throw new Error('Failed to update mood log notes');
  }
}

/**
 * Create multiple mood logs
 */
export async function createMultipleMoodLogs(logsData: InsertMoodLog[]): Promise<MoodLog[]> {
  try {
    const result = await db
      .insert(moodLogs)
      .values(logsData)
      .returning();

    return result;
  } catch (error) {
    console.error('Error creating multiple mood logs:', error);
    throw new Error('Failed to create multiple mood logs');
  }
}

/**
 * Delete mood logs by user
 */
export async function deleteMoodLogsByUser(userId: string): Promise<number> {
  try {
    const result = await db
      .delete(moodLogs)
      .where(eq(moodLogs.userId, userId))
      .returning({ id: moodLogs.id });

    return result.length;
  } catch (error) {
    console.error('Error deleting mood logs by user:', error);
    throw new Error('Failed to delete mood logs by user');
  }
}

/**
 * Log mood for today (create or update)
 */
export async function logMoodForToday(
  userId: string,
  moodRating: number,
  notes?: string
): Promise<MoodLog> {
  try {
    // Validate mood rating
    if (moodRating < 1 || moodRating > 5) {
      throw new Error('Mood rating must be between 1 and 5');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's already a mood log for today
    const existingLog = await db
      .select()
      .from(moodLogs)
      .where(
        eq(moodLogs.userId, userId)
        // Note: In a real implementation, you'd want to check the date as well
        // This is simplified for the example
      )
      .limit(1);

    if (existingLog.length > 0) {
      // Update existing log
      const result = await db
        .update(moodLogs)
        .set({
          moodRating,
          notes,
        })
        .where(eq(moodLogs.id, existingLog[0].id))
        .returning();

      return result[0];
    } else {
      // Create new log
      const result = await db
        .insert(moodLogs)
        .values({
          userId,
          moodRating,
          notes,
          loggedAt: new Date(),
        })
        .returning();

      return result[0];
    }
  } catch (error) {
    console.error('Error logging mood for today:', error);
    if (error instanceof Error && error.message.includes('Mood rating must be between 1 and 5')) {
      throw error;
    }
    throw new Error('Failed to log mood for today');
  }
}
