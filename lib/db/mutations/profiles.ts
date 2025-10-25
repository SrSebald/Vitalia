import { eq } from 'drizzle-orm';
import { db } from '../client';
import { profiles } from '../schema';
import type { InsertProfile, UpdateProfile, Profile } from '../types';
import { isUsernameAvailable } from '../queries/profiles';

/**
 * Create a new profile
 */
export async function createProfile(data: InsertProfile): Promise<Profile> {
  try {
    // Validate username availability if provided
    if (data.username) {
      const isAvailable = await isUsernameAvailable(data.username);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }
    }

    const result = await db
      .insert(profiles)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating profile:', error);
    if (error instanceof Error && error.message.includes('Username is already taken')) {
      throw error;
    }
    throw new Error('Failed to create profile');
  }
}

/**
 * Update a profile
 */
export async function updateProfile(id: string, data: UpdateProfile): Promise<Profile> {
  try {
    // Validate username availability if being updated
    if (data.username) {
      const isAvailable = await isUsernameAvailable(data.username, id);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }
    }

    const result = await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Profile not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof Error && error.message.includes('Username is already taken')) {
      throw error;
    }
    throw new Error('Failed to update profile');
  }
}

/**
 * Update profile by auth user ID
 */
export async function updateProfileByAuthUserId(
  authUserId: string,
  data: UpdateProfile
): Promise<Profile> {
  try {
    // Validate username availability if being updated
    if (data.username) {
      const isAvailable = await isUsernameAvailable(data.username);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }
    }

    const result = await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(profiles.authUserId, authUserId))
      .returning();

    if (result.length === 0) {
      throw new Error('Profile not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating profile by auth user ID:', error);
    if (error instanceof Error && error.message.includes('Username is already taken')) {
      throw error;
    }
    throw new Error('Failed to update profile');
  }
}

/**
 * Delete a profile
 */
export async function deleteProfile(id: string): Promise<void> {
  try {
    const result = await db
      .delete(profiles)
      .where(eq(profiles.id, id))
      .returning({ id: profiles.id });

    if (result.length === 0) {
      throw new Error('Profile not found');
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw new Error('Failed to delete profile');
  }
}

/**
 * Delete profile by auth user ID
 */
export async function deleteProfileByAuthUserId(authUserId: string): Promise<void> {
  try {
    const result = await db
      .delete(profiles)
      .where(eq(profiles.authUserId, authUserId))
      .returning({ id: profiles.id });

    if (result.length === 0) {
      throw new Error('Profile not found');
    }
  } catch (error) {
    console.error('Error deleting profile by auth user ID:', error);
    throw new Error('Failed to delete profile');
  }
}

/**
 * Update profile fitness goals
 */
export async function updateFitnessGoals(
  id: string,
  fitnessGoals: string
): Promise<Profile> {
  try {
    const result = await db
      .update(profiles)
      .set({
        fitnessGoals,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Profile not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating fitness goals:', error);
    throw new Error('Failed to update fitness goals');
  }
}

/**
 * Update profile activity level
 */
export async function updateActivityLevel(
  id: string,
  activityLevel: string
): Promise<Profile> {
  try {
    const result = await db
      .update(profiles)
      .set({
        activityLevel,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Profile not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating activity level:', error);
    throw new Error('Failed to update activity level');
  }
}

/**
 * Update profile physical measurements
 */
export async function updatePhysicalMeasurements(
  id: string,
  heightCm?: number,
  weightKg?: number
): Promise<Profile> {
  try {
    const updateData: Partial<UpdateProfile> = {
      updatedAt: new Date(),
    };

    if (heightCm !== undefined) {
      updateData.heightCm = heightCm;
    }

    if (weightKg !== undefined) {
      updateData.weightKg = weightKg;
    }

    const result = await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Profile not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating physical measurements:', error);
    throw new Error('Failed to update physical measurements');
  }
}
