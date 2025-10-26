'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { generateWorkoutAction, type WorkoutFormData } from '@/app/actions/generate-workout';
import type { WorkoutPlan } from '@/lib/ai/schemas';

interface WorkoutGeneratorFormProps {
  onWorkoutGenerated: (plan: WorkoutPlan, formData: WorkoutFormData) => void;
  onGenerationStart: () => void;
}

export function WorkoutGeneratorForm({ onWorkoutGenerated, onGenerationStart }: WorkoutGeneratorFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Opciones disponibles
  const goals = ['Fuerza', 'Hipertrofia', 'Resistencia', 'Cardio', 'Recuperación'];
  const muscleGroups = ['Full Body', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];
  const durations = ['15 min', '30 min', '45 min', '60+ min'];
  const energyLevels = ['Bajo', 'Medio', 'Alto'];

  // Funciones para manejar selecciones múltiples
  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleMuscleGroup = (group: string) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  // Validar si el formulario está completo
  const isFormValid =
    selectedGoals.length > 0 &&
    selectedMuscleGroups.length > 0 &&
    selectedDuration &&
    selectedEnergyLevel;

  async function handleGenerate() {
    if (!isFormValid) return;

    setLoading(true);
    onGenerationStart(); // Notificar a la página que la generación ha comenzado

    try {
      const formData: WorkoutFormData = {
        goals: selectedGoals,
        muscleGroups: selectedMuscleGroups,
        duration: selectedDuration,
        energyLevel: selectedEnergyLevel,
        additionalNotes: additionalNotes.trim() || undefined,
      };

      const workoutPlan = await generateWorkoutAction(formData);
      onWorkoutGenerated(workoutPlan, formData);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al generar la rutina. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genera tu Rutina con IA</CardTitle>
        <CardDescription>
          Selecciona tus parámetros y deja que la IA cree una rutina personalizada para ti
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Objetivo del Día */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            ¿Cuáles son tus objetivos hoy?
            <span className="text-xs text-muted-foreground font-normal ml-2">
              (Puedes seleccionar varios)
            </span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal) => (
              <Badge
                key={goal}
                variant={selectedGoals.includes(goal) ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleGoal(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>

        {/* Grupo Muscular */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            ¿Qué grupos musculares quieres trabajar?
            <span className="text-xs text-muted-foreground font-normal ml-2">
              (Puedes seleccionar varios)
            </span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((group) => (
              <Badge
                key={group}
                variant={selectedMuscleGroups.includes(group) ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleMuscleGroup(group)}
              >
                {group}
              </Badge>
            ))}
          </div>
        </div>

        {/* Duración Disponible */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">¿Cuánto tiempo tienes disponible?</label>
          <div className="flex flex-wrap gap-2">
            {durations.map((duration) => (
              <Badge
                key={duration}
                variant={selectedDuration === duration ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => setSelectedDuration(duration)}
              >
                {duration}
              </Badge>
            ))}
          </div>
        </div>

        {/* Nivel de Energía */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">¿Cómo te sientes hoy?</label>
          <div className="flex flex-wrap gap-2">
            {energyLevels.map((level) => (
              <Badge
                key={level}
                variant={selectedEnergyLevel === level ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => setSelectedEnergyLevel(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Comentarios Adicionales */}
        <div className="space-y-2">
          <Label htmlFor="additional-notes" className="text-sm font-semibold">
            ¿Algo más que quieras mencionar?
            <span className="text-xs text-muted-foreground font-normal ml-2">
              (Opcional)
            </span>
          </Label>
          <Textarea
            id="additional-notes"
            placeholder="Ej: Tengo una lesión en la rodilla, prefiero ejercicios sin impacto..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Botón de Generación */}
        <Button
          onClick={handleGenerate}
          disabled={!isFormValid || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando rutina...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Rutina con IA
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
