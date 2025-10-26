"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { workoutPlanSchema, type WorkoutPlan } from "@/lib/ai/schemas";
import { getWorkoutGeneratorPrompt } from "@/lib/ai/prompts";

/**
 * Tipo para los datos del formulario
 */
export interface WorkoutFormData {
  goals: string[]; // Múltiples objetivos, Ej: ["Fuerza", "Hipertrofia"]
  muscleGroups: string[]; // Múltiples grupos musculares, Ej: ["Pecho", "Brazos"]
  duration: string; // Ej: "30 min", "45 min", "60+ min"
  energyLevel: string; // Ej: "Bajo", "Medio", "Alto"
  additionalNotes?: string; // Comentarios adicionales del usuario
}

/**
 * Server Action que genera una rutina de entrenamiento personalizada
 * usando OpenAI con salida estructurada garantizada por Zod
 */
export async function generateWorkoutAction(formData: WorkoutFormData): Promise<WorkoutPlan> {
  try {
    // Construir el prompt usando la función centralizada
    const systemPrompt = getWorkoutGeneratorPrompt({
      goals: formData.goals,
      muscleGroups: formData.muscleGroups,
      duration: formData.duration,
      energyLevel: formData.energyLevel,
      additionalNotes: formData.additionalNotes,
    });

    // Generar la rutina con salida JSON estructurada
    const { object: workoutPlan } = await generateObject({
      model: openai("gpt-5-mini"),
      schema: workoutPlanSchema,
      system: systemPrompt,
      prompt: "Genera la rutina de entrenamiento personalizada ahora.",
      temperature: 0.7, // Creatividad moderada para variar las rutinas
    });

    return workoutPlan;
  } catch (error) {
    console.error("Error generando rutina:", error);
    throw new Error("No se pudo generar la rutina. Por favor intenta de nuevo.");
  }
}
