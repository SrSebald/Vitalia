'use client';

import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { WorkoutGeneratorForm } from '@/components/workouts/WorkoutGeneratorForm';
import { WorkoutDisplay } from '@/components/workouts/WorkoutDisplay';
import { WorkoutSkeleton } from '@/components/workouts/WorkoutSkeleton';
import type { WorkoutPlan } from '@/lib/ai/schemas';
import type { WorkoutFormData } from '@/app/actions/generate-workout';
import { Dumbbell, Target, Clock, AlertCircle } from 'lucide-react';

export default function WorkoutsPage() {
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [formData, setFormData] = useState<WorkoutFormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleWorkoutGenerated = (plan: WorkoutPlan, data: WorkoutFormData) => {
    setGeneratedPlan(plan);
    setFormData(data);
    setIsGenerating(false);
  };

  const handleGenerateNew = () => {
    setGeneratedPlan(null);
    setFormData(null);
    setIsGenerating(false);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>AI Trainer</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Cards informativos */}
        {!generatedPlan && (
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Personalizado</h3>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Rutinas adaptadas a tu objetivo, tiempo y nivel de energía
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Objetivos</h3>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Fuerza, hipertrofia, resistencia o cardio
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Flexible</h3>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Desde 15 minutos hasta entrenamientos completos
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Seguridad</h3>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Siempre calienta y escucha a tu cuerpo
              </p>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="flex-1 md:min-h-min">
          {isGenerating ? (
            <WorkoutSkeleton />
          ) : !generatedPlan ? (
            <WorkoutGeneratorForm
              onWorkoutGenerated={handleWorkoutGenerated}
              onGenerationStart={handleGenerationStart}
            />
          ) : (
            <WorkoutDisplay
              plan={generatedPlan}
              formData={formData!}
              onGenerateNew={handleGenerateNew}
            />
          )}
        </div>
      </div>
    </>
  );
}
