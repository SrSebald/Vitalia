'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Dumbbell,
  RefreshCw,
  CheckCircle2,
  Info,
  Flame,
  Wind,
  Save,
  Loader2
} from 'lucide-react';
import type { WorkoutPlan, Exercise } from '@/lib/ai/schemas';
import type { WorkoutFormData } from '@/app/actions/generate-workout';
import { saveGeneratedWorkout } from '@/app/actions/workouts';
import { useRouter } from 'next/navigation';

interface WorkoutDisplayProps {
  plan: WorkoutPlan;
  formData: WorkoutFormData;
  onGenerateNew: () => void;
  savedWorkoutId?: string; // Si el workout ya está guardado, ocultar botón de guardar
  initialCompletedExercises?: Set<number>; // Ejercicios ya completados (para workouts guardados)
  onToggleExercise?: (index: number) => void; // Callback para manejar toggle desde el padre
  isSavingProgress?: boolean; // Indicador de guardado en progreso
}

export function WorkoutDisplay({
  plan,
  formData,
  onGenerateNew,
  savedWorkoutId,
  initialCompletedExercises,
  onToggleExercise: parentOnToggleExercise,
  isSavingProgress = false,
}: WorkoutDisplayProps) {
  // Estado para rastrear qué ejercicios se han completado
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    initialCompletedExercises || new Set()
  );
  const [isSaving, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  // Actualizar cuando cambian los ejercicios completados desde el padre
  useEffect(() => {
    if (initialCompletedExercises) {
      setCompletedExercises(initialCompletedExercises);
    }
  }, [initialCompletedExercises]);

  const toggleExercise = (index: number) => {
    // Si hay callback del padre, usarlo (para workouts guardados)
    if (parentOnToggleExercise) {
      parentOnToggleExercise(index);
    } else {
      // Si no, manejar el estado localmente (para workouts recién generados)
      setCompletedExercises((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }
  };

  const completionRate = (completedExercises.size / plan.exercises.length) * 100;

  const handleSaveWorkout = () => {
    startTransition(async () => {
      try {
        await saveGeneratedWorkout(plan, formData);
        setIsSaved(true);
        setTimeout(() => {
          router.push('/dashboard/my-workouts');
        }, 1000);
      } catch (error) {
        console.error('Error guardando workout:', error);
        alert('Hubo un error al guardar el workout. Por favor intenta de nuevo.');
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Header con información general */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-2xl">{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              {savedWorkoutId && isSavingProgress && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Guardando...</span>
                </div>
              )}
              {!savedWorkoutId && (
                <Button
                  onClick={handleSaveWorkout}
                  disabled={isSaving || isSaved}
                  variant="default"
                  size="sm"
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Guardado!
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? 'Guardando...' : 'Guardar Rutina'}
                    </>
                  )}
                </Button>
              )}
              {!savedWorkoutId && (
                <Button onClick={onGenerateNew} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Nueva Rutina
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{plan.estimatedDuration}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>{plan.exercises.length} ejercicios</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>{completionRate.toFixed(0)}% completado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calentamiento */}
      <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-orange-500" />
            Calentamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{plan.warmup}</p>
        </CardContent>
      </Card>

      {/* Lista de Ejercicios */}
      <div className="space-y-3">
        {plan.exercises.map((exercise, index) => (
          <ExerciseCard
            key={index}
            exercise={exercise}
            index={index}
            isCompleted={completedExercises.has(index)}
            onToggle={() => toggleExercise(index)}
          />
        ))}
      </div>

      {/* Enfriamiento */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wind className="h-5 w-5 text-blue-500" />
            Enfriamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{plan.cooldown}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente auxiliar para cada ejercicio
interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  isCompleted: boolean;
  onToggle: () => void;
}

function ExerciseCard({ exercise, index, isCompleted, onToggle }: ExerciseCardProps) {
  return (
    <Card className={isCompleted ? 'opacity-60' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Checkbox para marcar como completado */}
          <Checkbox
            id={`exercise-${index}`}
            checked={isCompleted}
            onCheckedChange={onToggle}
            className="mt-1"
          />

          {/* Contenido del ejercicio */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <label
                htmlFor={`exercise-${index}`}
                className={`font-semibold cursor-pointer ${
                  isCompleted ? 'line-through' : ''
                }`}
              >
                {index + 1}. {exercise.name}
              </label>
            </div>

            {/* Series, Reps, Descanso */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {exercise.sets} series
              </Badge>
              <Badge variant="secondary">
                {exercise.reps} reps
              </Badge>
              <Badge variant="secondary">
                {exercise.rest} descanso
              </Badge>
            </div>

            {/* Notas técnicas */}
            {exercise.notes && (
              <div className="flex gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{exercise.notes}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
