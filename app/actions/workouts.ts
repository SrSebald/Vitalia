'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { aiGeneratedWorkouts, profiles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { WorkoutPlan } from '@/lib/ai/schemas';
import type { WorkoutFormData } from './generate-workout';
import { revalidatePath } from 'next/cache';

/**
 * Guarda un workout generado por IA en la base de datos
 */
export async function saveGeneratedWorkout(
  workoutPlan: WorkoutPlan,
  formData: WorkoutFormData
) {
  try {
    // Obtener el usuario actual
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    // Obtener o crear el perfil del usuario
    let [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.authUserId, user.id))
      .limit(1);

    // Si no existe el perfil, crearlo
    if (!profile) {
      [profile] = await db
        .insert(profiles)
        .values({
          id: user.id, // Usar el mismo ID del usuario de auth
          authUserId: user.id,
          fullName: user.user_metadata?.full_name || null,
          username: user.email?.split('@')[0] || null,
        })
        .returning();
    }

    // Guardar el workout
    const [savedWorkout] = await db
      .insert(aiGeneratedWorkouts)
      .values({
        userId: profile.id,
        title: workoutPlan.title,
        description: workoutPlan.description,
        goals: formData.goals,
        muscleGroups: formData.muscleGroups,
        duration: formData.duration,
        energyLevel: formData.energyLevel,
        estimatedDuration: workoutPlan.estimatedDuration,
        workoutData: JSON.stringify(workoutPlan),
        additionalNotes: formData.additionalNotes || null,
      })
      .returning();

    revalidatePath('/dashboard/my-workouts');

    return { success: true, workout: savedWorkout };
  } catch (error) {
    console.error('Error guardando workout:', error);
    throw new Error('No se pudo guardar el workout');
  }
}

/**
 * Obtiene todos los workouts guardados del usuario actual
 */
export async function getUserWorkouts() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    // Obtener o crear el perfil del usuario
    let [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.authUserId, user.id))
      .limit(1);

    // Si no existe el perfil, crearlo
    if (!profile) {
      [profile] = await db
        .insert(profiles)
        .values({
          id: user.id,
          authUserId: user.id,
          fullName: user.user_metadata?.full_name || null,
          username: user.email?.split('@')[0] || null,
        })
        .returning();
    }

    // Obtener todos los workouts del usuario, ordenados por fecha de creación
    const workouts = await db
      .select()
      .from(aiGeneratedWorkouts)
      .where(eq(aiGeneratedWorkouts.userId, profile.id))
      .orderBy(desc(aiGeneratedWorkouts.createdAt));

    return workouts;
  } catch (error) {
    console.error('Error obteniendo workouts:', error);
    return [];
  }
}

/**
 * Obtiene un workout específico por ID
 */
export async function getWorkoutById(workoutId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    let [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.authUserId, user.id))
      .limit(1);

    if (!profile) {
      [profile] = await db
        .insert(profiles)
        .values({
          id: user.id,
          authUserId: user.id,
          fullName: user.user_metadata?.full_name || null,
          username: user.email?.split('@')[0] || null,
        })
        .returning();
    }

    const [workout] = await db
      .select()
      .from(aiGeneratedWorkouts)
      .where(eq(aiGeneratedWorkouts.id, workoutId))
      .limit(1);

    if (!workout || workout.userId !== profile.id) {
      throw new Error('Workout no encontrado');
    }

    return workout;
  } catch (error) {
    console.error('Error obteniendo workout:', error);
    throw new Error('No se pudo obtener el workout');
  }
}

/**
 * Marca un workout como completado
 */
export async function markWorkoutAsCompleted(workoutId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    let [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.authUserId, user.id))
      .limit(1);

    if (!profile) {
      [profile] = await db
        .insert(profiles)
        .values({
          id: user.id,
          authUserId: user.id,
          fullName: user.user_metadata?.full_name || null,
          username: user.email?.split('@')[0] || null,
        })
        .returning();
    }

    await db
      .update(aiGeneratedWorkouts)
      .set({
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(aiGeneratedWorkouts.id, workoutId));

    revalidatePath('/dashboard/my-workouts');

    return { success: true };
  } catch (error) {
    console.error('Error marcando workout como completado:', error);
    throw new Error('No se pudo marcar el workout como completado');
  }
}

/**
 * Actualiza el progreso de ejercicios completados
 */
export async function updateWorkoutProgress(
  workoutId: string,
  completedExercises: number[]
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    await db
      .update(aiGeneratedWorkouts)
      .set({
        completedExercises,
        updatedAt: new Date()
      })
      .where(eq(aiGeneratedWorkouts.id, workoutId));

    revalidatePath(`/dashboard/my-workouts/${workoutId}`);

    return { success: true };
  } catch (error) {
    console.error('Error actualizando progreso:', error);
    throw new Error('No se pudo actualizar el progreso');
  }
}

/**
 * Elimina un workout guardado
 */
export async function deleteWorkout(workoutId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    let [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.authUserId, user.id))
      .limit(1);

    if (!profile) {
      [profile] = await db
        .insert(profiles)
        .values({
          id: user.id,
          authUserId: user.id,
          fullName: user.user_metadata?.full_name || null,
          username: user.email?.split('@')[0] || null,
        })
        .returning();
    }

    await db
      .delete(aiGeneratedWorkouts)
      .where(eq(aiGeneratedWorkouts.id, workoutId));

    revalidatePath('/dashboard/my-workouts');

    return { success: true };
  } catch (error) {
    console.error('Error eliminando workout:', error);
    throw new Error('No se pudo eliminar el workout');
  }
}
