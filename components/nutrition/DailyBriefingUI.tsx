'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import type { DailyNutritionPlan } from '@/lib/schemas/daily-nutrition-plan';
import { Droplets, Lightbulb, Flame, Apple } from 'lucide-react';

interface DailyBriefingUIProps {
  plan: DailyNutritionPlan;
}

export function DailyBriefingUI({ plan }: DailyBriefingUIProps) {
  return (
    <div className="w-full px-4 py-8 space-y-6">
      {/* Header Principal */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Apple className="h-6 w-6 text-primary" />
            <CardTitle className="text-3xl font-bold">{plan.dailyTitle}</CardTitle>
          </div>
          <CardDescription className="text-base leading-relaxed">
            {plan.dailyFocus}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Resumen de Macros Totales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Macronutrientes del Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MacroCard
              label="Calorías"
              value={`${plan.totalDailyMacros.calories}`}
              unit="kcal"
              color="text-orange-600"
              bgColor="bg-orange-50 dark:bg-orange-950/20"
            />
            <MacroCard
              label="Proteínas"
              value={`${plan.totalDailyMacros.protein_g}`}
              unit="g"
              color="text-red-600"
              bgColor="bg-red-50 dark:bg-red-950/20"
            />
            <MacroCard
              label="Carbohidratos"
              value={`${plan.totalDailyMacros.carbs_g}`}
              unit="g"
              color="text-blue-600"
              bgColor="bg-blue-50 dark:bg-blue-950/20"
            />
            <MacroCard
              label="Grasas"
              value={`${plan.totalDailyMacros.fat_g}`}
              unit="g"
              color="text-yellow-600"
              bgColor="bg-yellow-50 dark:bg-yellow-950/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Plan de Comidas */}
      <Card>
        <CardHeader>
          <CardTitle>Plan de Comidas</CardTitle>
          <CardDescription>
            Toca cada comida para ver los detalles y macronutrientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {plan.meals.map((meal, index) => (
              <AccordionItem key={index} value={`meal-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-semibold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{meal.title}</div>
                        <div className="text-xs text-muted-foreground">{meal.timing}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {meal.macros.calories} kcal
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4 pl-14">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {meal.description}
                    </p>
                    <Separator />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <MiniMacro label="Calorías" value={meal.macros.calories} unit="kcal" />
                      <MiniMacro label="Proteínas" value={meal.macros.protein_g} unit="g" />
                      <MiniMacro label="Carbos" value={meal.macros.carbs_g} unit="g" />
                      <MiniMacro label="Grasas" value={meal.macros.fat_g} unit="g" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Consejo de Hidratación */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Hidratación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{plan.hydrationTip}</p>
        </CardContent>
      </Card>

      {/* Pro Tip */}
      <Card className="border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50 to-background dark:from-amber-950/20 dark:to-background">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Pro Tip del Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed font-medium">{plan.proTip}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente auxiliar para tarjetas de macros grandes
function MacroCard({
  label,
  value,
  unit,
  color,
  bgColor,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${bgColor}`}>
      <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>
        {value}
        <span className="text-sm font-normal ml-1">{unit}</span>
      </div>
    </div>
  );
}

// Componente auxiliar para macros pequeños en el accordion
function MiniMacro({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-semibold">
        {value}
        <span className="text-xs font-normal ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

