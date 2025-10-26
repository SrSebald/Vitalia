'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

/**
 * Schema de validación para el perfil de usuario
 */
const profileSchema = z.object({
  fullName: z.string().optional(),
  username: z.string().min(3).max(30).optional(),

  // Información Física
  heightCm: z.string().optional().transform((val) => val ? parseFloat(val) : null),
  weightKg: z.string().optional().transform((val) => val ? parseFloat(val) : null),
  dateOfBirth: z.string().optional().nullable(),
  bodyType: z.string().optional().nullable(),

  // Metas
  mainGoal: z.string().optional().nullable(),
  goalDeadline: z.string().optional().nullable(),
  motivation: z.string().optional().nullable(),
  activityLevel: z.string().optional().nullable(),

  // Salud
  healthConditions: z.string().optional().nullable(),
  allergies: z.array(z.string()).optional().default([]),

  // Nutrición
  dietType: z.string().optional().nullable(),
  mealSchedule: z.string().optional().nullable(),
});

export type ProfileFormData = z.input<typeof profileSchema>;

/**
 * Actualiza el perfil del usuario autenticado
 */
export async function updateUserProfile(formData: ProfileFormData) {
  try {
    // Obtener usuario autenticado
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Usuario no autenticado' };
    }

    // Validar datos
    const validatedData = profileSchema.parse(formData);

    // Obtener o crear perfil
    let [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.authUserId, user.id))
      .limit(1);

    if (!profile) {
      // Crear perfil si no existe
      [profile] = await db
        .insert(profiles)
        .values({
          id: user.id,
          authUserId: user.id,
          fullName: validatedData.fullName || null,
          username: validatedData.username || null,
        })
        .returning();
    }

    // Actualizar perfil
    await db
      .update(profiles)
      .set({
        fullName: validatedData.fullName || profile.fullName,
        username: validatedData.username || profile.username,
        heightCm: validatedData.heightCm?.toString() || profile.heightCm,
        weightKg: validatedData.weightKg?.toString() || profile.weightKg,
        dateOfBirth: validatedData.dateOfBirth || profile.dateOfBirth,
        bodyType: validatedData.bodyType || profile.bodyType,
        mainGoal: validatedData.mainGoal || profile.mainGoal,
        goalDeadline: validatedData.goalDeadline || profile.goalDeadline,
        motivation: validatedData.motivation || profile.motivation,
        activityLevel: validatedData.activityLevel || profile.activityLevel,
        healthConditions: validatedData.healthConditions || profile.healthConditions,
        allergies: validatedData.allergies || profile.allergies || [],
        dietType: validatedData.dietType || profile.dietType,
        mealSchedule: validatedData.mealSchedule || profile.mealSchedule,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id));

    // Revalidar la página de settings
    revalidatePath('/dashboard/settings');

    return { success: true };
  } catch (error) {
    console.error('Error actualizando perfil:', error);

    if (error instanceof z.ZodError) {
      return { error: 'Datos inválidos: ' + error.errors.map(e => e.message).join(', ') };
    }

    return { error: 'No se pudo actualizar el perfil' };
  }
}

/**
 * Obtiene el perfil del usuario autenticado
 */
export async function getUserProfile() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.authUserId, user.id))
      .limit(1);

    return profile || null;
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return null;
  }
}
