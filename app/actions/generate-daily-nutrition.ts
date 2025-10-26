"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles, workouts, nutritionLogs, moodLogs, aiGeneratedWorkouts } from "@/lib/db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { dailyNutritionPlanSchema, type DailyNutritionPlan } from "@/lib/schemas/daily-nutrition-plan";

interface GenerateDailyNutritionResult {
  success: boolean;
  plan?: DailyNutritionPlan;
  error?: string;
}

/**
 * Server Action para generar un plan nutricional diario personalizado
 * Recopila datos del perfil del usuario, actividad reciente y genera
 * recomendaciones inteligentes usando IA
 */
export async function generateDailyNutritionPlan(): Promise<GenerateDailyNutritionResult> {
  try {
    // 1. Autenticar al usuario
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "No autenticado. Por favor inicia sesión.",
      };
    }

    // 2. Recopilar datos del perfil
    const [userProfile] = await db.select().from(profiles).where(eq(profiles.authUserId, user.id)).limit(1);

    if (!userProfile) {
      return {
        success: false,
        error: "No se encontró el perfil del usuario. Por favor completa tu perfil primero.",
      };
    }

    // 3. Recopilar datos de actividad reciente
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0];

    // 3a. Último workout (últimos 2 días)
    const recentWorkouts = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, userProfile.id), gte(workouts.workoutDate, twoDaysAgoStr)))
      .orderBy(desc(workouts.workoutDate))
      .limit(2);

    // 3b. Últimos workouts generados por IA (últimos 2 días)
    const recentAIWorkouts = await db
      .select()
      .from(aiGeneratedWorkouts)
      .where(eq(aiGeneratedWorkouts.userId, userProfile.id))
      .orderBy(desc(aiGeneratedWorkouts.createdAt))
      .limit(2);

    // 3c. Logs nutricionales de ayer
    const yesterdayStart = new Date(yesterdayStr + "T00:00:00Z");
    const yesterdayEnd = new Date(yesterdayStr + "T23:59:59Z");

    const yesterdayNutrition = await db
      .select()
      .from(nutritionLogs)
      .where(
        and(
          eq(nutritionLogs.userId, userProfile.id),
          gte(nutritionLogs.consumedAt, yesterdayStart),
          lte(nutritionLogs.consumedAt, yesterdayEnd)
        )
      )
      .orderBy(nutritionLogs.consumedAt);

    // 3d. Último mood log (últimos 2 días)
    const recentMoodLogs = await db
      .select()
      .from(moodLogs)
      .where(eq(moodLogs.userId, userProfile.id))
      .orderBy(desc(moodLogs.loggedAt))
      .limit(3);

    // 4. Calcular totales nutricionales de ayer
    const yesterdayTotals = yesterdayNutrition.reduce(
      (acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (parseFloat(log.proteinG?.toString() || "0") || 0),
        carbs: acc.carbs + (parseFloat(log.carbsG?.toString() || "0") || 0),
        fat: acc.fat + (parseFloat(log.fatG?.toString() || "0") || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // 5. Construir el prompt dinámico
    const systemPrompt = buildSystemPrompt({
      profile: userProfile,
      recentWorkouts,
      recentAIWorkouts,
      yesterdayNutrition: yesterdayTotals,
      recentMoodLogs,
    });

    // 6. Generar el plan con IA
    const { object: plan } = await generateObject({
      model: openai("gpt-4o"),
      schema: dailyNutritionPlanSchema,
      prompt: systemPrompt,
    });

    return {
      success: true,
      plan,
    };
  } catch (error) {
    console.error("Error generando plan nutricional:", error);
    return {
      success: false,
      error: "Ocurrió un error al generar el plan. Por favor intenta de nuevo.",
    };
  }
}

/**
 * Construye el system prompt dinámico con todos los datos del usuario
 */
function buildSystemPrompt(data: {
  profile: any;
  recentWorkouts: any[];
  recentAIWorkouts: any[];
  yesterdayNutrition: { calories: number; protein: number; carbs: number; fat: number };
  recentMoodLogs: any[];
}): string {
  const { profile, recentWorkouts, recentAIWorkouts, yesterdayNutrition, recentMoodLogs } = data;

  // Analizar el último workout
  const lastWorkout = recentWorkouts[0] || recentAIWorkouts[0];
  const workoutInfo = lastWorkout
    ? recentWorkouts[0]
      ? `${lastWorkout.name} (Duración: ${lastWorkout.durationMin || "N/A"} min)`
      : `Workout generado por IA: ${lastWorkout.title} - Grupos musculares: ${
          lastWorkout.muscleGroups?.join(", ") || "N/A"
        }, Objetivos: ${lastWorkout.goals?.join(", ") || "N/A"}`
    : "Día de descanso o sin entrenamientos registrados";

  // Analizar el estado nutricional de ayer
  const nutritionAnalysis =
    yesterdayNutrition.calories > 0
      ? `Calorías: ${yesterdayNutrition.calories.toFixed(0)} kcal, Proteínas: ${yesterdayNutrition.protein.toFixed(
          1
        )}g, Carbohidratos: ${yesterdayNutrition.carbs.toFixed(1)}g, Grasas: ${yesterdayNutrition.fat.toFixed(1)}g`
      : "No se registraron comidas";

  // Analizar el mood
  const moodInfo =
    recentMoodLogs.length > 0
      ? `Último estado de ánimo: ${recentMoodLogs[0].moodRating}/5${
          recentMoodLogs[0].notes ? ` - "${recentMoodLogs[0].notes}"` : ""
        }`
      : "No hay registros de estado de ánimo";

  // Calcular edad aproximada si hay fecha de nacimiento
  let ageInfo = "No especificada";
  if (profile.dateOfBirth) {
    const birthDate = new Date(profile.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    ageInfo = `${age} años`;
  }

  return `
Eres un nutricionista deportivo de élite y coach de bienestar para VITALIA. Tu misión es crear un "Briefing Nutricional Diario" personalizado y proactivo.

**═══════════════════════════════════════════════════════════════**
**EXPEDIENTE COMPLETO DEL USUARIO**
**═══════════════════════════════════════════════════════════════**

📋 **DATOS ESTÁTICOS (Perfil Base):**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nombre: ${profile.fullName || "No especificado"}
• Edad: ${ageInfo}
• Objetivo Principal: ${profile.mainGoal || "No especificado"}
• Peso: ${profile.weightKg || "N/A"} kg | Altura: ${profile.heightCm || "N/A"} cm
• Tipo de Cuerpo: ${profile.bodyType || "No especificado"}
• Nivel de Actividad: ${profile.activityLevel || "No especificado"}
• Dieta Preferida: ${profile.dietType || "Sin restricciones específicas"}
• Alergias y Restricciones: ${profile.allergies?.length > 0 ? profile.allergies.join(", ") : "Ninguna"}
• Condiciones de Salud: ${profile.healthConditions || "Ninguna reportada"}
• Horario de Comidas Preferido: ${profile.mealSchedule || "Flexible"}

📊 **CONTEXTO DINÁMICO (Actividad Reciente):**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏋️ **Entrenamiento Reciente:** 
   ${workoutInfo}

🍽️ **Balance Nutricional de Ayer:**
   ${nutritionAnalysis}

😊 **Estado Emocional:**
   ${moodInfo}

**═══════════════════════════════════════════════════════════════**
**INSTRUCCIONES PARA GENERAR EL PLAN DE HOY**
**═══════════════════════════════════════════════════════════════**

🎯 **TU MISIÓN:**
Como coach proactivo, debes analizar TODO el contexto y generar un plan nutricional que:

1. **CONECTA LOS PUNTOS:** No listes datos. SINTETIZA.
   • Si entrenó ayer → Enfócate en recuperación (proteínas + carbohidratos para glucógeno)
   • Si tuvo un día de descanso → Optimiza para mantención o ligera restricción calórica
   • Si el mood fue bajo → Incluye alimentos que mejoren serotonina (carbohidratos complejos, omega-3)
   • Si faltaron calorías ayer → Ajusta hoy con comidas más densas
   • Si excedió macros ayer → Balancea hoy con opciones más ligeras

2. **RESPETA LAS REGLAS INQUEBRANTABLES:**
   • Las alergias y el tipo de dieta son ABSOLUTOS. Nunca sugieras algo prohibido.
   • Si es vegano, JAMÁS menciones carne/lácteos/huevos.
   • Si tiene alergia a frutos secos, evítalos completamente.

3. **SÉ ESPECÍFICO Y PRÁCTICO:**
   • En cada comida, menciona alimentos CONCRETOS con cantidades aproximadas.
   • Ejemplo BUENO: "2 huevos revueltos + 1 taza de avena + 1 plátano + café"
   • Ejemplo MALO: "Un desayuno balanceado"

4. **EL PRO TIP ES TU MOMENTO DE BRILLAR:**
   • Debe ser la conclusión más inteligente de tu análisis.
   • Conecta el entrenamiento de ayer con la nutrición de hoy.
   • Ejemplo: "Como ayer entrenaste piernas con alta intensidad, tu cuerpo está en modo de reparación muscular. Prioriza las proteínas en cada comida (mínimo 30g) y asegúrate de incluir carbohidratos complejos en tu almuerzo para reponer el glucógeno muscular. Tu recuperación depende de las próximas 24 horas."

5. **TONO Y ENERGÍA:**
   • Motivador pero realista.
   • Usa un lenguaje que inspire confianza y acción.
   • El usuario debe sentir que tiene un coach personal que ENTIENDE su situación.

6. **ESTRUCTURA DE COMIDAS:**
   • Genera entre 3-6 comidas según el perfil (típicamente 3 principales + 2-3 snacks).
   • Distribuye macros inteligentemente según el objetivo:
     - Pérdida de peso: Mayor proteína, carbohidratos moderados
     - Ganancia muscular: Alta proteína + carbohidratos suficientes
     - Mantenimiento: Balance equilibrado
   • Calcula los macros totales del día y asegúrate de que sean coherentes con el objetivo.

**GENERA EL PLAN AHORA:**
Rellena el objeto JSON con el plan nutricional completo para hoy. El usuario está esperando ver tu análisis inteligente en acción.
`;
}
