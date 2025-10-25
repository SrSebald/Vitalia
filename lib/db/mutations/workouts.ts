import { eq } from 'drizzle-orm';
import { db } from '../client';
import { workouts } from '../schema';
import type { InsertWorkout, UpdateWorkout, Workout } from '../types';

/**
 * Create a new workout
 */
export async function createWorkout(data: InsertWorkout): Promise<Workout> {
  try {
    const result = await db
      .insert(workouts)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating workout:', error);
    throw new Error('Failed to create workout');
  }
}

/**
 * Update a workout
 */
export async function updateWorkout(id: string, data: UpdateWorkout): Promise<Workout> {
  try {
    const result = await db
      .update(workouts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(workouts.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Workout not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating workout:', error);
    throw new Error('Failed to update workout');
  }
}

/**
 * Delete a workout
 */
export async function deleteWorkout(id: string): Promise<void> {
  try {
    const result = await db
      .delete(workouts)
      .where(eq(workouts.id, id))
      .returning({ id: workouts.id });

    if (result.length === 0) {
      throw new Error('Workout not found');
    }
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw new Error('Failed to delete workout');
  }
}

/**
 * Update workout name
 */
export async function updateWorkoutName(id: string, name: string): Promise<Workout> {
  try {
    const result = await db
      .update(workouts)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(workouts.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Workout not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating workout name:', error);
    throw new Error('Failed to update workout name');
  }
}

/**
 * Update workout notes
 */
export async function updateWorkoutNotes(id: string, notes: string): Promise<Workout> {
  try {
    const result = await db
      .update(workouts)
      .set({
        notes,
        updatedAt: new Date(),
      })
      .where(eq(workouts.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Workout not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating workout notes:', error);
    throw new Error('Failed to update workout notes');
  }
}

/**
 * Update workout duration
 */
export async function updateWorkoutDuration(id: string, durationMin: number): Promise<Workout> {
  try {
    const result = await db
      .update(workouts)
      .set({
        durationMin,
        updatedAt: new Date(),
      })
      .where(eq(workouts.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Workout not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating workout duration:', error);
    throw new Error('Failed to update workout duration');
  }
}

/**
 * Update workout date
 */
export async function updateWorkoutDate(id: string, workoutDate: Date): Promise<Workout> {
  try {
    const result = await db
      .update(workouts)
      .set({
        workoutDate,
        updatedAt: new Date(),
      })
      .where(eq(workouts.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Workout not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating workout date:', error);
    throw new Error('Failed to update workout date');
  }
}

/**
 * Delete workouts by user
 */
export async function deleteWorkoutsByUser(userId: string): Promise<number> {
  try {
    const result = await db
      .delete(workouts)
      .where(eq(workouts.userId, userId))
      .returning({ id: workouts.id });

    return result.length;
  } catch (error) {
    console.error('Error deleting workouts by user:', error);
    throw new Error('Failed to delete workouts by user');
  }
}
