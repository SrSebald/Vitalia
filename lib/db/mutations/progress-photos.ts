import { eq, and, gte, lte } from 'drizzle-orm';
import { db } from '../client';
import { progressPhotos } from '../schema';
import type { InsertProgressPhoto, UpdateProgressPhoto, ProgressPhoto } from '../types';

/**
 * Create a new progress photo
 */
export async function createProgressPhoto(data: InsertProgressPhoto): Promise<ProgressPhoto> {
  try {
    const result = await db
      .insert(progressPhotos)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating progress photo:', error);
    throw new Error('Failed to create progress photo');
  }
}

/**
 * Update a progress photo
 */
export async function updateProgressPhoto(id: string, data: UpdateProgressPhoto): Promise<ProgressPhoto> {
  try {
    const result = await db
      .update(progressPhotos)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(progressPhotos.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Progress photo not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating progress photo:', error);
    throw new Error('Failed to update progress photo');
  }
}

/**
 * Delete a progress photo
 */
export async function deleteProgressPhoto(id: string): Promise<void> {
  try {
    const result = await db
      .delete(progressPhotos)
      .where(eq(progressPhotos.id, id))
      .returning({ id: progressPhotos.id });

    if (result.length === 0) {
      throw new Error('Progress photo not found');
    }
  } catch (error) {
    console.error('Error deleting progress photo:', error);
    throw new Error('Failed to delete progress photo');
  }
}

/**
 * Update progress photo caption
 */
export async function updateProgressPhotoCaption(id: string, caption: string): Promise<ProgressPhoto> {
  try {
    const result = await db
      .update(progressPhotos)
      .set({
        caption,
        updatedAt: new Date(),
      })
      .where(eq(progressPhotos.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Progress photo not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating progress photo caption:', error);
    throw new Error('Failed to update progress photo caption');
  }
}

/**
 * Update progress photo taken date
 */
export async function updateProgressPhotoTakenDate(id: string, takenOn: Date): Promise<ProgressPhoto> {
  try {
    const result = await db
      .update(progressPhotos)
      .set({
        takenOn,
        updatedAt: new Date(),
      })
      .where(eq(progressPhotos.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Progress photo not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating progress photo taken date:', error);
    throw new Error('Failed to update progress photo taken date');
  }
}

/**
 * Update progress photo image URL
 */
export async function updateProgressPhotoImageUrl(id: string, imageUrl: string): Promise<ProgressPhoto> {
  try {
    const result = await db
      .update(progressPhotos)
      .set({
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(progressPhotos.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Progress photo not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating progress photo image URL:', error);
    throw new Error('Failed to update progress photo image URL');
  }
}

/**
 * Create multiple progress photos
 */
export async function createMultipleProgressPhotos(photosData: InsertProgressPhoto[]): Promise<ProgressPhoto[]> {
  try {
    const result = await db
      .insert(progressPhotos)
      .values(
        photosData.map(data => ({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
      .returning();

    return result;
  } catch (error) {
    console.error('Error creating multiple progress photos:', error);
    throw new Error('Failed to create multiple progress photos');
  }
}

/**
 * Delete progress photos by user
 */
export async function deleteProgressPhotosByUser(userId: string): Promise<number> {
  try {
    const result = await db
      .delete(progressPhotos)
      .where(eq(progressPhotos.userId, userId))
      .returning({ id: progressPhotos.id });

    return result.length;
  } catch (error) {
    console.error('Error deleting progress photos by user:', error);
    throw new Error('Failed to delete progress photos by user');
  }
}

/**
 * Delete progress photos by date range
 */
export async function deleteProgressPhotosByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  try {
    const result = await db
      .delete(progressPhotos)
      .where(
        and(
          eq(progressPhotos.userId, userId),
          gte(progressPhotos.takenOn, startDate),
          lte(progressPhotos.takenOn, endDate)
        )
      )
      .returning({ id: progressPhotos.id });

    return result.length;
  } catch (error) {
    console.error('Error deleting progress photos by date range:', error);
    throw new Error('Failed to delete progress photos by date range');
  }
}
