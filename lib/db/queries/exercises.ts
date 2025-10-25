import { eq, and, or, desc, like, sql } from 'drizzle-orm';
import { db } from '../client';
import { exercises } from '../schema';
import type { Exercise, ExerciseFilters, ExerciseWithStats } from '../types';

/**
 * Get all public exercises with optional filters
 */
export async function getPublicExercises(filters: ExerciseFilters = {}): Promise<Exercise[]> {
  try {
    const conditions = [eq(exercises.isPublic, true)];
    
    if (filters.muscleGroup) {
      conditions.push(eq(exercises.muscleGroup, filters.muscleGroup));
    }
    
    if (filters.equipment) {
      conditions.push(eq(exercises.equipment, filters.equipment));
    }
    
    if (filters.search) {
      conditions.push(
        or(
          like(exercises.name, `%${filters.search}%`),
          like(exercises.description, `%${filters.search}%`)
        )!
      );
    }

    const result = await db
      .select()
      .from(exercises)
      .where(and(...conditions))
      .orderBy(desc(exercises.createdAt))
      .limit(filters.limit || 50)
      .offset(filters.offset || 0);

    return result;
  } catch (error) {
    console.error('Error fetching public exercises:', error);
    throw new Error('Failed to fetch public exercises');
  }
}

/**
 * Get exercises created by a specific user
 */
export async function getExercisesByUser(
  userId: string,
  filters: Omit<ExerciseFilters, 'createdBy'> = {}
): Promise<Exercise[]> {
  try {
    const conditions = [eq(exercises.createdBy, userId)];
    
    if (filters.muscleGroup) {
      conditions.push(eq(exercises.muscleGroup, filters.muscleGroup));
    }
    
    if (filters.equipment) {
      conditions.push(eq(exercises.equipment, filters.equipment));
    }
    
    if (filters.search) {
      conditions.push(
        or(
          like(exercises.name, `%${filters.search}%`),
          like(exercises.description, `%${filters.search}%`)
        )!
      );
    }

    const result = await db
      .select()
      .from(exercises)
      .where(and(...conditions))
      .orderBy(desc(exercises.createdAt))
      .limit(filters.limit || 50)
      .offset(filters.offset || 0);

    return result;
  } catch (error) {
    console.error('Error fetching user exercises:', error);
    throw new Error('Failed to fetch user exercises');
  }
}

/**
 * Get a specific exercise by ID
 */
export async function getExerciseById(id: string): Promise<Exercise | null> {
  try {
    const result = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching exercise by ID:', error);
    throw new Error('Failed to fetch exercise');
  }
}

/**
 * Get exercises by muscle group
 */
export async function getExercisesByMuscleGroup(
  muscleGroup: string,
  limit = 20,
  offset = 0
): Promise<Exercise[]> {
  try {
    const result = await db
      .select()
      .from(exercises)
      .where(
        and(
          eq(exercises.muscleGroup, muscleGroup),
          eq(exercises.isPublic, true)
        )
      )
      .orderBy(desc(exercises.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching exercises by muscle group:', error);
    throw new Error('Failed to fetch exercises by muscle group');
  }
}

/**
 * Get exercises by equipment
 */
export async function getExercisesByEquipment(
  equipment: string,
  limit = 20,
  offset = 0
): Promise<Exercise[]> {
  try {
    const result = await db
      .select()
      .from(exercises)
      .where(
        and(
          eq(exercises.equipment, equipment),
          eq(exercises.isPublic, true)
        )
      )
      .orderBy(desc(exercises.createdAt))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('Error fetching exercises by equipment:', error);
    throw new Error('Failed to fetch exercises by equipment');
  }
}

/**
 * Search exercises by name or description
 */
export async function searchExercises(
  searchTerm: string,
  filters: Omit<ExerciseFilters, 'search'> = {}
): Promise<Exercise[]> {
  try {
    const conditions = [
      or(
        like(exercises.name, `%${searchTerm}%`),
        like(exercises.description, `%${searchTerm}%`)
      )!
    ];
    
    if (filters.muscleGroup) {
      conditions.push(eq(exercises.muscleGroup, filters.muscleGroup));
    }
    
    if (filters.equipment) {
      conditions.push(eq(exercises.equipment, filters.equipment));
    }
    
    if (filters.isPublic !== undefined) {
      conditions.push(eq(exercises.isPublic, filters.isPublic));
    }

    const result = await db
      .select()
      .from(exercises)
      .where(and(...conditions))
      .orderBy(desc(exercises.createdAt))
      .limit(filters.limit || 50)
      .offset(filters.offset || 0);

    return result;
  } catch (error) {
    console.error('Error searching exercises:', error);
    throw new Error('Failed to search exercises');
  }
}

/**
 * Get popular exercises (most used)
 */
export async function getPopularExercises(limit = 20): Promise<ExerciseWithStats[]> {
  try {
    // This would require a join with sets table to count usage
    // For now, return recent public exercises
    const result = await db
      .select()
      .from(exercises)
      .where(eq(exercises.isPublic, true))
      .orderBy(desc(exercises.createdAt))
      .limit(limit);

    return result.map((exercise: any) => ({
      ...exercise,
      _count: { sets: 0 } // Placeholder - would need actual count query
    }));
  } catch (error) {
    console.error('Error fetching popular exercises:', error);
    throw new Error('Failed to fetch popular exercises');
  }
}

/**
 * Get all unique muscle groups
 */
export async function getMuscleGroups(): Promise<string[]> {
  try {
    const result = await db
      .selectDistinct({ muscleGroup: exercises.muscleGroup })
      .from(exercises)
      .where(
        and(
          eq(exercises.isPublic, true),
          sql`${exercises.muscleGroup} IS NOT NULL`
        )
      );

    return result
      .map((row: any) => row.muscleGroup)
      .filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching muscle groups:', error);
    throw new Error('Failed to fetch muscle groups');
  }
}

/**
 * Get all unique equipment types
 */
export async function getEquipmentTypes(): Promise<string[]> {
  try {
    const result = await db
      .selectDistinct({ equipment: exercises.equipment })
      .from(exercises)
      .where(
        and(
          eq(exercises.isPublic, true),
          sql`${exercises.equipment} IS NOT NULL`
        )
      );

    return result
      .map((row: any) => row.equipment)
      .filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching equipment types:', error);
    throw new Error('Failed to fetch equipment types');
  }
}
