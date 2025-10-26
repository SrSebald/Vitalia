'use client';

import { useState, useCallback, useTransition } from 'react';
import { WorkoutDisplay } from './WorkoutDisplay';
import type { WorkoutPlan } from '@/lib/ai/schemas';
import type { WorkoutFormData } from '@/app/actions/generate-workout';
import { updateWorkoutProgress } from '@/app/actions/workouts';

interface SavedWorkoutViewProps {
  plan: WorkoutPlan;
  formData: WorkoutFormData;
  workoutId: string;
  initialCompletedExercises?: number[];
}

export function SavedWorkoutView({
  plan,
  formData,
  workoutId,
  initialCompletedExercises = [],
}: SavedWorkoutViewProps) {
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set(initialCompletedExercises)
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleExercise = useCallback(async (index: number) => {
    // Actualizar estado local inmediatamente (UI optimista)
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }

    setCompletedExercises(newCompleted);
    const updatedArray = Array.from(newCompleted);

    // Guardar a la BD inmediatamente en background
    startTransition(async () => {
      try {
        await updateWorkoutProgress(workoutId, updatedArray);
      } catch (error) {
        console.error('Error guardando progreso:', error);
        // Revertir el cambio si falla
        setCompletedExercises(completedExercises);
      }
    });
  }, [workoutId, completedExercises]);

  return (
    <WorkoutDisplay
      plan={plan}
      formData={formData}
      onGenerateNew={() => {}} // No hace nada para workouts guardados
      savedWorkoutId={workoutId}
      initialCompletedExercises={completedExercises}
      onToggleExercise={handleToggleExercise}
      isSavingProgress={isPending}
    />
  );
}
