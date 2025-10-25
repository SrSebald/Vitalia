import { eq } from 'drizzle-orm';
import { db } from '../client';
import { exercises } from '../schema';
import type { InsertExercise, UpdateExercise, Exercise } from '../types';

/**
 * Create a new exercise
 */
export async function createExercise(data: InsertExercise): Promise<Exercise> {
  try {
    const result = await db
      .insert(exercises)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw new Error('Failed to create exercise');
  }
}

/**
 * Update an exercise
 */
export async function updateExercise(id: string, data: UpdateExercise): Promise<Exercise> {
  try {
    const result = await db
      .update(exercises)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(exercises.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Exercise not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw new Error('Failed to update exercise');
  }
}

/**
 * Delete an exercise
 */
export async function deleteExercise(id: string): Promise<void> {
  try {
    const result = await db
      .delete(exercises)
      .where(eq(exercises.id, id))
      .returning({ id: exercises.id });

    if (result.length === 0) {
      throw new Error('Exercise not found');
    }
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw new Error('Failed to delete exercise');
  }
}

/**
 * Toggle exercise public/private status
 */
export async function toggleExerciseVisibility(id: string): Promise<Exercise> {
  try {
    // First get the current exercise to check its current status
    const currentExercise = await db
      .select({ isPublic: exercises.isPublic })
      .from(exercises)
      .where(eq(exercises.id, id))
      .limit(1);

    if (currentExercise.length === 0) {
      throw new Error('Exercise not found');
    }

    const newStatus = !currentExercise[0].isPublic;

    const result = await db
      .update(exercises)
      .set({
        isPublic: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(exercises.id, id))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error toggling exercise visibility:', error);
    throw new Error('Failed to toggle exercise visibility');
  }
}

/**
 * Update exercise name
 */
export async function updateExerciseName(id: string, name: string): Promise<Exercise> {
  try {
    const result = await db
      .update(exercises)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(exercises.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Exercise not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating exercise name:', error);
    throw new Error('Failed to update exercise name');
  }
}

/**
 * Update exercise description
 */
export async function updateExerciseDescription(id: string, description: string): Promise<Exercise> {
  try {
    const result = await db
      .update(exercises)
      .set({
        description,
        updatedAt: new Date(),
      })
      .where(eq(exercises.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Exercise not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating exercise description:', error);
    throw new Error('Failed to update exercise description');
  }
}

/**
 * Update exercise muscle group
 */
export async function updateExerciseMuscleGroup(id: string, muscleGroup: string): Promise<Exercise> {
  try {
    const result = await db
      .update(exercises)
      .set({
        muscleGroup,
        updatedAt: new Date(),
      })
      .where(eq(exercises.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Exercise not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating exercise muscle group:', error);
    throw new Error('Failed to update exercise muscle group');
  }
}

/**
 * Update exercise equipment
 */
export async function updateExerciseEquipment(id: string, equipment: string): Promise<Exercise> {
  try {
    const result = await db
      .update(exercises)
      .set({
        equipment,
        updatedAt: new Date(),
      })
      .where(eq(exercises.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Exercise not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating exercise equipment:', error);
    throw new Error('Failed to update exercise equipment');
  }
}

/**
 * Bulk create exercises
 */
export async function bulkCreateExercises(exercisesData: InsertExercise[]): Promise<Exercise[]> {
  try {
    const result = await db
      .insert(exercises)
      .values(
        exercisesData.map(data => ({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
      .returning();

    return result;
  } catch (error) {
    console.error('Error bulk creating exercises:', error);
    throw new Error('Failed to bulk create exercises');
  }
}

/**
 * Delete exercises by creator
 */
export async function deleteExercisesByCreator(createdBy: string): Promise<number> {
  try {
    const result = await db
      .delete(exercises)
      .where(eq(exercises.createdBy, createdBy))
      .returning({ id: exercises.id });

    return result.length;
  } catch (error) {
    console.error('Error deleting exercises by creator:', error);
    throw new Error('Failed to delete exercises by creator');
  }
}
