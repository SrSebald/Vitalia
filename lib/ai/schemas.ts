import { z } from 'zod';

/**
 * Schema para un ejercicio individual en la rutina
 */
export const exerciseSchema = z.object({
  name: z.string().describe('Nombre del ejercicio, ej: Press de Banca'),
  sets: z.number().describe('Número de series recomendadas'),
  reps: z.string().describe('Rango de repeticiones, ej: "8-12" o "Al fallo"'),
  rest: z.string().describe('Tiempo de descanso recomendado entre series, ej: "60s"'),
  notes: z.string().optional().describe('Breve consejo de ejecución o seguridad para este ejercicio'),
});

/**
 * Schema para la rutina completa de entrenamiento
 */
export const workoutPlanSchema = z.object({
  title: z.string().describe('Un título motivador para la rutina'),
  description: z.string().describe('Breve resumen del enfoque de la sesión'),
  estimatedDuration: z.string().describe('Duración estimada total, ej: "45 minutos"'),
  warmup: z.string().describe('Descripción del calentamiento recomendado'),
  exercises: z.array(exerciseSchema).describe('Lista de ejercicios a realizar'),
  cooldown: z.string().describe('Descripción del enfriamiento/estiramiento final'),
});

/**
 * Type inference para usar en TypeScript
 */
export type Exercise = z.infer<typeof exerciseSchema>;
export type WorkoutPlan = z.infer<typeof workoutPlanSchema>;
