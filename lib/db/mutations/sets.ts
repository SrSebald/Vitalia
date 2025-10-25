import { eq } from 'drizzle-orm';
import { db } from '../client';
import { sets } from '../schema';
import type { InsertSet, UpdateSet, Set } from '../types';

/**
 * Create a new set
 */
export async function createSet(data: InsertSet): Promise<Set> {
  try {
    const result = await db
      .insert(sets)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating set:', error);
    throw new Error('Failed to create set');
  }
}

/**
 * Update a set
 */
export async function updateSet(id: string, data: UpdateSet): Promise<Set> {
  try {
    const result = await db
      .update(sets)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(sets.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Set not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating set:', error);
    throw new Error('Failed to update set');
  }
}

/**
 * Delete a set
 */
export async function deleteSet(id: string): Promise<void> {
  try {
    const result = await db
      .delete(sets)
      .where(eq(sets.id, id))
      .returning({ id: sets.id });

    if (result.length === 0) {
      throw new Error('Set not found');
    }
  } catch (error) {
    console.error('Error deleting set:', error);
    throw new Error('Failed to delete set');
  }
}

/**
 * Create multiple sets for a workout
 */
export async function createMultipleSets(setsData: InsertSet[]): Promise<Set[]> {
  try {
    const result = await db
      .insert(sets)
      .values(
        setsData.map(data => ({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
      .returning();

    return result;
  } catch (error) {
    console.error('Error creating multiple sets:', error);
    throw new Error('Failed to create multiple sets');
  }
}

/**
 * Update set order
 */
export async function updateSetOrder(id: string, setOrder: number): Promise<Set> {
  try {
    const result = await db
      .update(sets)
      .set({
        setOrder,
        updatedAt: new Date(),
      })
      .where(eq(sets.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Set not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating set order:', error);
    throw new Error('Failed to update set order');
  }
}

/**
 * Update set reps
 */
export async function updateSetReps(id: string, reps: number): Promise<Set> {
  try {
    const result = await db
      .update(sets)
      .set({
        reps,
        updatedAt: new Date(),
      })
      .where(eq(sets.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Set not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating set reps:', error);
    throw new Error('Failed to update set reps');
  }
}

/**
 * Update set weight
 */
export async function updateSetWeight(id: string, weightKg: number): Promise<Set> {
  try {
    const result = await db
      .update(sets)
      .set({
        weightKg,
        updatedAt: new Date(),
      })
      .where(eq(sets.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Set not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating set weight:', error);
    throw new Error('Failed to update set weight');
  }
}

/**
 * Update set distance
 */
export async function updateSetDistance(id: string, distanceM: number): Promise<Set> {
  try {
    const result = await db
      .update(sets)
      .set({
        distanceM,
        updatedAt: new Date(),
      })
      .where(eq(sets.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Set not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating set distance:', error);
    throw new Error('Failed to update set distance');
  }
}

/**
 * Update set duration
 */
export async function updateSetDuration(id: string, durationSec: number): Promise<Set> {
  try {
    const result = await db
      .update(sets)
      .set({
        durationSec,
        updatedAt: new Date(),
      })
      .where(eq(sets.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Set not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating set duration:', error);
    throw new Error('Failed to update set duration');
  }
}

/**
 * Update set intensity
 */
export async function updateSetIntensity(id: string, intensity: string): Promise<Set> {
  try {
    const result = await db
      .update(sets)
      .set({
        intensity,
        updatedAt: new Date(),
      })
      .where(eq(sets.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Set not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating set intensity:', error);
    throw new Error('Failed to update set intensity');
  }
}

/**
 * Delete all sets for a workout
 */
export async function deleteSetsByWorkout(workoutId: string): Promise<number> {
  try {
    const result = await db
      .delete(sets)
      .where(eq(sets.workoutId, workoutId))
      .returning({ id: sets.id });

    return result.length;
  } catch (error) {
    console.error('Error deleting sets by workout:', error);
    throw new Error('Failed to delete sets by workout');
  }
}

/**
 * Reorder sets in a workout
 */
export async function reorderSets(workoutId: string, setIds: string[]): Promise<void> {
  try {
    // Update set order for each set
    for (let i = 0; i < setIds.length; i++) {
      await db
        .update(sets)
        .set({
          setOrder: i + 1,
          updatedAt: new Date(),
        })
        .where(eq(sets.id, setIds[i]));
    }
  } catch (error) {
    console.error('Error reordering sets:', error);
    throw new Error('Failed to reorder sets');
  }
}
