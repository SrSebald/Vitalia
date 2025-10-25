import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '../client';
import { sets, exercises } from '../schema';
import type { Set } from '../types';

/**
 * Get sets by workout ID
 */
export async function getSetsByWorkoutId(workoutId: string): Promise<Set[]> {
  try {
    const result = await db
      .select()
      .from(sets)
      .where(eq(sets.workoutId, workoutId))
      .orderBy(asc(sets.setOrder), asc(sets.createdAt));

    return result;
  } catch (error) {
    console.error('Error fetching sets by workout ID:', error);
    throw new Error('Failed to fetch sets');
  }
}

/**
 * Get sets with exercise information
 */
export async function getSetsWithExercises(workoutId: string) {
  try {
    const result = await db
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
      .where(eq(sets.workoutId, workoutId))
      .orderBy(asc(sets.setOrder), asc(sets.createdAt));

    return result;
  } catch (error) {
    console.error('Error fetching sets with exercises:', error);
    throw new Error('Failed to fetch sets with exercises');
  }
}

/**
 * Get a specific set by ID
 */
export async function getSetById(id: string): Promise<Set | null> {
  try {
    const result = await db
      .select()
      .from(sets)
      .where(eq(sets.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching set by ID:', error);
    throw new Error('Failed to fetch set');
  }
}

/**
 * Get sets by exercise ID across all workouts
 */
export async function getSetsByExerciseId(
  exerciseId: string,
  limit = 50,
  offset = 0
): Promise<Set[]> {
  try {
    const result = await db
      .select()
      .from(sets)
      .where(eq(sets.exerciseId, exerciseId))
      .orderBy(desc(sets.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching sets by exercise ID:', error);
    throw new Error('Failed to fetch sets by exercise');
  }
}
