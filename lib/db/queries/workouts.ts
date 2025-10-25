import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { db } from '../client';
import { workouts, sets, exercises } from '../schema';
import type { Workout, WorkoutWithSets, WorkoutFilters } from '../types';

/**
 * Get workouts by user ID with optional filters
 */
export async function getWorkoutsByUserId(filters: WorkoutFilters): Promise<Workout[]> {
  try {
    if (!filters.userId) {
      throw new Error('User ID is required');
    }

    const conditions = [eq(workouts.userId, filters.userId)];
    
    if (filters.startDate) {
      conditions.push(gte(workouts.workoutDate, filters.startDate));
    }
    
    if (filters.endDate) {
      conditions.push(lte(workouts.workoutDate, filters.endDate));
    }

    const result = await db
      .select()
      .from(workouts)
      .where(and(...conditions))
      .orderBy(desc(workouts.workoutDate), desc(workouts.createdAt))
      .limit(filters.limit || 20)
      .offset(filters.offset || 0);

    return result;
  } catch (error) {
    console.error('Error fetching workouts by user ID:', error);
    throw new Error('Failed to fetch workouts');
  }
}

/**
 * Get a specific workout by ID
 */
export async function getWorkoutById(id: string): Promise<Workout | null> {
  try {
    const result = await db
      .select()
      .from(workouts)
      .where(eq(workouts.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching workout by ID:', error);
    throw new Error('Failed to fetch workout');
  }
}

/**
 * Get workout with all its sets and exercises
 */
export async function getWorkoutWithSets(id: string): Promise<WorkoutWithSets | null> {
  try {
    // First get the workout
    const workout = await getWorkoutById(id);
    if (!workout) {
      return null;
    }

    // Then get all sets with exercises
    const setsWithExercises = await db
      .select({
        id: sets.id,
        workoutId: sets.workoutId,
        exerciseId: sets.exerciseId,
        setOrder: sets.setOrder,
        reps: sets.reps,
        weightKg: sets.weightKg,
        distanceM: sets.distanceM,
        durationSec: sets.durationSec,
        intensity: sets.intensity,
        createdAt: sets.createdAt,
        updatedAt: sets.updatedAt,
        exercise: {
          id: exercises.id,
          name: exercises.name,
          muscleGroup: exercises.muscleGroup,
          equipment: exercises.equipment,
          description: exercises.description,
        }
      })
      .from(sets)
      .leftJoin(exercises, eq(sets.exerciseId, exercises.id))
      .where(eq(sets.workoutId, id))
      .orderBy(sets.setOrder, sets.createdAt);

    return {
      ...workout,
      sets: setsWithExercises
    };
  } catch (error) {
    console.error('Error fetching workout with sets:', error);
    throw new Error('Failed to fetch workout with sets');
  }
}

/**
 * Get workouts by date range
 */
export async function getWorkoutsByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
  limit = 20,
  offset = 0
): Promise<Workout[]> {
  try {
    const result = await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.workoutDate, startDate),
          lte(workouts.workoutDate, endDate)
        )
      )
      .orderBy(desc(workouts.workoutDate), desc(workouts.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching workouts by date range:', error);
    throw new Error('Failed to fetch workouts by date range');
  }
}

/**
 * Get recent workouts for a user
 */
export async function getRecentWorkouts(
  userId: string,
  limit = 10
): Promise<Workout[]> {
  try {
    const result = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.workoutDate), desc(workouts.createdAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Error fetching recent workouts:', error);
    throw new Error('Failed to fetch recent workouts');
  }
}

/**
 * Get workout statistics for a user
 */
export async function getWorkoutStats(userId: string) {
  try {
    const stats = await db
      .select({
        totalWorkouts: sql<number>`count(*)`,
        totalDuration: sql<number>`sum(${workouts.durationMin})`,
        avgDuration: sql<number>`avg(${workouts.durationMin})`,
        firstWorkout: sql<Date>`min(${workouts.workoutDate})`,
        lastWorkout: sql<Date>`max(${workouts.workoutDate})`
      })
      .from(workouts)
      .where(eq(workouts.userId, userId));

    return stats[0] || {
      totalWorkouts: 0,
      totalDuration: 0,
      avgDuration: 0,
      firstWorkout: null,
      lastWorkout: null
    };
  } catch (error) {
    console.error('Error fetching workout stats:', error);
    throw new Error('Failed to fetch workout statistics');
  }
}

/**
 * Get workouts by name (search)
 */
export async function searchWorkouts(
  userId: string,
  searchTerm: string,
  limit = 20,
  offset = 0
): Promise<Workout[]> {
  try {
    const result = await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          sql`${workouts.name} ILIKE ${`%${searchTerm}%`}`
        )
      )
      .orderBy(desc(workouts.workoutDate), desc(workouts.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error searching workouts:', error);
    throw new Error('Failed to search workouts');
  }
}

/**
 * Get workout count by month for a user (for charts)
 */
export async function getWorkoutCountByMonth(
  userId: string,
  year: number
): Promise<{ month: number; count: number }[]> {
  try {
    const result = await db
      .select({
        month: sql<number>`extract(month from ${workouts.workoutDate})`,
        count: sql<number>`count(*)`
      })
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          sql`extract(year from ${workouts.workoutDate}) = ${year}`
        )
      )
      .groupBy(sql`extract(month from ${workouts.workoutDate})`)
      .orderBy(sql`extract(month from ${workouts.workoutDate})`);

    return result;
  } catch (error) {
    console.error('Error fetching workout count by month:', error);
    throw new Error('Failed to fetch workout count by month');
  }
}
