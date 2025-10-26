import { z } from 'zod';

/**
 * Esquema para los macros de una comida
 */
export const macrosSchema = z.object({
  calories: z.number().describe('Calorías estimadas de la comida'),
  protein_g: z.number().describe('Proteínas en gramos'),
  carbs_g: z.number().describe('Carbohidratos en gramos'),
  fat_g: z.number().describe('Grasas en gramos'),
});

/**
 * Esquema para una comida individual
 */
export const mealSchema = z.object({
  title: z
    .string()
    .describe('Título descriptivo de la comida (ej: "Desayuno Rico en Proteínas")'),
  description: z
    .string()
    .describe(
      'Descripción detallada de qué comer, incluyendo alimentos específicos y cantidades aproximadas'
    ),
  macros: macrosSchema.describe('Macronutrientes estimados de esta comida'),
  timing: z.string().describe('Momento sugerido para consumir (ej: "7:00 - 8:00 AM")'),
});

/**
 * Esquema principal del plan nutricional diario
 */
export const dailyNutritionPlanSchema = z.object({
  dailyTitle: z
    .string()
    .describe(
      'Título motivador y personalizado para el día (ej: "Día de Recuperación Muscular")'
    ),
  dailyFocus: z
    .string()
    .describe(
      'Resumen ejecutivo del enfoque nutricional del día (2-3 oraciones máximo)'
    ),
  meals: z
    .array(mealSchema)
    .min(3)
    .max(6)
    .describe(
      'Array de comidas recomendadas (típicamente: desayuno, snack AM, almuerzo, snack PM, cena, snack nocturno opcional)'
    ),
  hydrationTip: z
    .string()
    .describe(
      'Consejo específico sobre hidratación basado en la actividad del usuario'
    ),
  proTip: z
    .string()
    .describe(
      'Consejo experto que conecta la actividad reciente con la nutrición de hoy. Debe mostrar análisis inteligente del contexto.'
    ),
  totalDailyMacros: macrosSchema.describe('Suma total de macronutrientes del día'),
});

export type DailyNutritionPlan = z.infer<typeof dailyNutritionPlanSchema>;
export type Meal = z.infer<typeof mealSchema>;
export type Macros = z.infer<typeof macrosSchema>;

