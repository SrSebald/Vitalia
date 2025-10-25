import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { db } from '../client';
import { nutritionLogs } from '../schema';
import type { NutritionLog, NutritionLogFilters } from '../types';

/**
 * Get nutrition logs by user ID with filters
 */
export async function getNutritionLogsByUserId(filters: NutritionLogFilters): Promise<NutritionLog[]> {
  try {
    const conditions = [eq(nutritionLogs.userId, filters.userId)];
    
    if (filters.startDate) {
      conditions.push(gte(nutritionLogs.consumedAt, filters.startDate));
    }
    
    if (filters.endDate) {
      conditions.push(lte(nutritionLogs.consumedAt, filters.endDate));
    }
    
    if (filters.mealType) {
      conditions.push(eq(nutritionLogs.mealType, filters.mealType));
    }

    const result = await db
      .select()
      .from(nutritionLogs)
      .where(and(...conditions))
      .orderBy(desc(nutritionLogs.consumedAt))
      .limit(filters.limit || 50)
      .offset(filters.offset || 0);

    return result;
  } catch (error) {
    console.error('Error fetching nutrition logs:', error);
    throw new Error('Failed to fetch nutrition logs');
  }
}

/**
 * Get nutrition logs by date range
 */
export async function getNutritionLogsByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
  limit = 50,
  offset = 0
): Promise<NutritionLog[]> {
  try {
    const result = await db
      .select()
      .from(nutritionLogs)
      .where(
        and(
          eq(nutritionLogs.userId, userId),
          gte(nutritionLogs.consumedAt, startDate),
          lte(nutritionLogs.consumedAt, endDate)
        )
      )
      .orderBy(desc(nutritionLogs.consumedAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching nutrition logs by date range:', error);
    throw new Error('Failed to fetch nutrition logs by date range');
  }
}

/**
 * Get nutrition logs by meal type
 */
export async function getNutritionLogsByMealType(
  userId: string,
  mealType: string,
  limit = 50,
  offset = 0
): Promise<NutritionLog[]> {
  try {
    const result = await db
      .select()
      .from(nutritionLogs)
      .where(
        and(
          eq(nutritionLogs.userId, userId),
          eq(nutritionLogs.mealType, mealType)
        )
      )
      .orderBy(desc(nutritionLogs.consumedAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching nutrition logs by meal type:', error);
    throw new Error('Failed to fetch nutrition logs by meal type');
  }
}

/**
 * Get a specific nutrition log by ID
 */
export async function getNutritionLogById(id: string): Promise<NutritionLog | null> {
  try {
    const result = await db
      .select()
      .from(nutritionLogs)
      .where(eq(nutritionLogs.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching nutrition log by ID:', error);
    throw new Error('Failed to fetch nutrition log');
  }
}

/**
 * Get nutrition summary for a date range
 */
export async function getNutritionSummary(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const summary = await db
      .select({
        totalCalories: sql<number>`sum(${nutritionLogs.calories})`,
        totalProtein: sql<number>`sum(${nutritionLogs.proteinG})`,
        totalCarbs: sql<number>`sum(${nutritionLogs.carbsG})`,
        totalFat: sql<number>`sum(${nutritionLogs.fatG})`,
        averageCalories: sql<number>`avg(${nutritionLogs.calories})`,
        logCount: sql<number>`count(*)`
      })
      .from(nutritionLogs)
      .where(
        and(
          eq(nutritionLogs.userId, userId),
          gte(nutritionLogs.consumedAt, startDate),
          lte(nutritionLogs.consumedAt, endDate)
        )
      );

    return summary[0] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      averageCalories: 0,
      logCount: 0
    };
  } catch (error) {
    console.error('Error fetching nutrition summary:', error);
    throw new Error('Failed to fetch nutrition summary');
  }
}

/**
 * Get daily nutrition breakdown
 */
export async function getDailyNutritionBreakdown(
  userId: string,
  date: Date
) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await db
      .select({
        mealType: nutritionLogs.mealType,
        totalCalories: sql<number>`sum(${nutritionLogs.calories})`,
        totalProtein: sql<number>`sum(${nutritionLogs.proteinG})`,
        totalCarbs: sql<number>`sum(${nutritionLogs.carbsG})`,
        totalFat: sql<number>`sum(${nutritionLogs.fatG})`,
        logCount: sql<number>`count(*)`
      })
      .from(nutritionLogs)
      .where(
        and(
          eq(nutritionLogs.userId, userId),
          gte(nutritionLogs.consumedAt, startOfDay),
          lte(nutritionLogs.consumedAt, endOfDay)
        )
      )
      .groupBy(nutritionLogs.mealType)
      .orderBy(nutritionLogs.mealType);

    return result;
  } catch (error) {
    console.error('Error fetching daily nutrition breakdown:', error);
    throw new Error('Failed to fetch daily nutrition breakdown');
  }
}

/**
 * Search nutrition logs by food item
 */
export async function searchNutritionLogs(
  userId: string,
  searchTerm: string,
  limit = 50,
  offset = 0
): Promise<NutritionLog[]> {
  try {
    const result = await db
      .select()
      .from(nutritionLogs)
      .where(
        and(
          eq(nutritionLogs.userId, userId),
          sql`${nutritionLogs.foodItem} ILIKE ${`%${searchTerm}%`}`
        )
      )
      .orderBy(desc(nutritionLogs.consumedAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error searching nutrition logs:', error);
    throw new Error('Failed to search nutrition logs');
  }
}
