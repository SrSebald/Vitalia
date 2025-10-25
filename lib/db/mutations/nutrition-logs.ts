import { eq } from 'drizzle-orm';
import { db } from '../client';
import { nutritionLogs } from '../schema';
import type { InsertNutritionLog, UpdateNutritionLog, NutritionLog } from '../types';

/**
 * Create a new nutrition log
 */
export async function createNutritionLog(data: InsertNutritionLog): Promise<NutritionLog> {
  try {
    const result = await db
      .insert(nutritionLogs)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating nutrition log:', error);
    throw new Error('Failed to create nutrition log');
  }
}

/**
 * Update a nutrition log
 */
export async function updateNutritionLog(id: string, data: UpdateNutritionLog): Promise<NutritionLog> {
  try {
    const result = await db
      .update(nutritionLogs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(nutritionLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Nutrition log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating nutrition log:', error);
    throw new Error('Failed to update nutrition log');
  }
}

/**
 * Delete a nutrition log
 */
export async function deleteNutritionLog(id: string): Promise<void> {
  try {
    const result = await db
      .delete(nutritionLogs)
      .where(eq(nutritionLogs.id, id))
      .returning({ id: nutritionLogs.id });

    if (result.length === 0) {
      throw new Error('Nutrition log not found');
    }
  } catch (error) {
    console.error('Error deleting nutrition log:', error);
    throw new Error('Failed to delete nutrition log');
  }
}

/**
 * Update nutrition log food item
 */
export async function updateNutritionLogFoodItem(id: string, foodItem: string): Promise<NutritionLog> {
  try {
    const result = await db
      .update(nutritionLogs)
      .set({
        foodItem,
        updatedAt: new Date(),
      })
      .where(eq(nutritionLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Nutrition log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating nutrition log food item:', error);
    throw new Error('Failed to update nutrition log food item');
  }
}

/**
 * Update nutrition log serving size
 */
export async function updateNutritionLogServingSize(id: string, servingSize: string): Promise<NutritionLog> {
  try {
    const result = await db
      .update(nutritionLogs)
      .set({
        servingSize,
        updatedAt: new Date(),
      })
      .where(eq(nutritionLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Nutrition log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating nutrition log serving size:', error);
    throw new Error('Failed to update nutrition log serving size');
  }
}

/**
 * Update nutrition log calories
 */
export async function updateNutritionLogCalories(id: string, calories: number): Promise<NutritionLog> {
  try {
    const result = await db
      .update(nutritionLogs)
      .set({
        calories,
        updatedAt: new Date(),
      })
      .where(eq(nutritionLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Nutrition log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating nutrition log calories:', error);
    throw new Error('Failed to update nutrition log calories');
  }
}

/**
 * Update nutrition log macronutrients
 */
export async function updateNutritionLogMacros(
  id: string,
  proteinG?: number,
  carbsG?: number,
  fatG?: number
): Promise<NutritionLog> {
  try {
    const updateData: Partial<UpdateNutritionLog> = {
      updatedAt: new Date(),
    };

    if (proteinG !== undefined) updateData.proteinG = proteinG;
    if (carbsG !== undefined) updateData.carbsG = carbsG;
    if (fatG !== undefined) updateData.fatG = fatG;

    const result = await db
      .update(nutritionLogs)
      .set(updateData)
      .where(eq(nutritionLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Nutrition log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating nutrition log macros:', error);
    throw new Error('Failed to update nutrition log macros');
  }
}

/**
 * Update nutrition log meal type
 */
export async function updateNutritionLogMealType(id: string, mealType: string): Promise<NutritionLog> {
  try {
    const result = await db
      .update(nutritionLogs)
      .set({
        mealType,
        updatedAt: new Date(),
      })
      .where(eq(nutritionLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Nutrition log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating nutrition log meal type:', error);
    throw new Error('Failed to update nutrition log meal type');
  }
}

/**
 * Update nutrition log notes
 */
export async function updateNutritionLogNotes(id: string, notes: string): Promise<NutritionLog> {
  try {
    const result = await db
      .update(nutritionLogs)
      .set({
        notes,
        updatedAt: new Date(),
      })
      .where(eq(nutritionLogs.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Nutrition log not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating nutrition log notes:', error);
    throw new Error('Failed to update nutrition log notes');
  }
}

/**
 * Create multiple nutrition logs
 */
export async function createMultipleNutritionLogs(logsData: InsertNutritionLog[]): Promise<NutritionLog[]> {
  try {
    const result = await db
      .insert(nutritionLogs)
      .values(
        logsData.map(data => ({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
      .returning();

    return result;
  } catch (error) {
    console.error('Error creating multiple nutrition logs:', error);
    throw new Error('Failed to create multiple nutrition logs');
  }
}

/**
 * Delete nutrition logs by user
 */
export async function deleteNutritionLogsByUser(userId: string): Promise<number> {
  try {
    const result = await db
      .delete(nutritionLogs)
      .where(eq(nutritionLogs.userId, userId))
      .returning({ id: nutritionLogs.id });

    return result.length;
  } catch (error) {
    console.error('Error deleting nutrition logs by user:', error);
    throw new Error('Failed to delete nutrition logs by user');
  }
}
