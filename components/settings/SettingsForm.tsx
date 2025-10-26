'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Save, X } from 'lucide-react';
import { updateUserProfile, type ProfileFormData } from '@/app/actions/settings';
import {
  BODY_TYPES,
  ACTIVITY_LEVELS,
  DIET_TYPES,
  MEAL_SCHEDULES,
  COMMON_ALLERGIES,
} from '@/lib/constants/settings';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SettingsFormProps {
  initialData: any;
}

// Helper para parsear fecha en formato yyyy-MM-dd como fecha local
function parseLocalDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Helper para formatear fecha a yyyy-MM-dd en zona horaria local
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Estados del formulario
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: initialData?.fullName || '',
    username: initialData?.username || '',
    heightCm: initialData?.heightCm || '',
    weightKg: initialData?.weightKg || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    bodyType: initialData?.bodyType || '',
    mainGoal: initialData?.mainGoal || '',
    goalDeadline: initialData?.goalDeadline || '',
    motivation: initialData?.motivation || '',
    activityLevel: initialData?.activityLevel || '',
    healthConditions: initialData?.healthConditions || '',
    allergies: initialData?.allergies || [],
    dietType: initialData?.dietType || '',
    mealSchedule: initialData?.mealSchedule || '',
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [birthDateOpen, setBirthDateOpen] = useState(false);
  const [goalDateOpen, setGoalDateOpen] = useState(false);

  // Convertir strings de fecha a Date objects
  const birthDate = formData.dateOfBirth ? parseLocalDate(formData.dateOfBirth) : undefined;
  const goalDate = formData.goalDeadline ? parseLocalDate(formData.goalDeadline) : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateUserProfile(formData);

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Perfil actualizado',
          description: 'Tus cambios se han guardado exitosamente',
        });
      }
    });
  };

  const addAllergy = (allergy: string) => {
    if (allergy && !formData.allergies?.includes(allergy)) {
      setFormData({
        ...formData,
        allergies: [...(formData.allergies || []), allergy],
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: formData.allergies?.filter((a) => a !== allergy) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Tu información básica y datos de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                value={formData.fullName || ''}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={formData.username || ''}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="juanperez"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Física */}
      <Card>
        <CardHeader>
          <CardTitle>Información Física</CardTitle>
          <CardDescription>
            Ayúdanos a personalizar tus rutinas y nutrición
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="heightCm">Altura (cm)</Label>
              <Input
                id="heightCm"
                type="number"
                step="0.1"
                value={formData.heightCm || ''}
                onChange={(e) =>
                  setFormData({ ...formData, heightCm: e.target.value })
                }
                placeholder="175"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightKg">Peso (kg)</Label>
              <Input
                id="weightKg"
                type="number"
                step="0.1"
                value={formData.weightKg || ''}
                onChange={(e) =>
                  setFormData({ ...formData, weightKg: e.target.value })
                }
                placeholder="70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
              <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="dateOfBirth"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !birthDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? (
                      birthDate.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setFormData({
                        ...formData,
                        dateOfBirth: date ? formatLocalDate(date) : '',
                      });
                      setBirthDateOpen(false);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bodyType">Tipo de Cuerpo</Label>
            <Select
              value={formData.bodyType || ''}
              onValueChange={(value) =>
                setFormData({ ...formData, bodyType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu tipo de cuerpo" />
              </SelectTrigger>
              <SelectContent>
                {BODY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Nivel de Actividad</Label>
            <Select
              value={formData.activityLevel || ''}
              onValueChange={(value) =>
                setFormData({ ...formData, activityLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="¿Qué tan activo eres?" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Metas y Motivación */}
      <Card>
        <CardHeader>
          <CardTitle>Metas y Motivación</CardTitle>
          <CardDescription>
            Define tus objetivos para personalizar tu experiencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mainGoal">Meta Principal</Label>
            <Input
              id="mainGoal"
              value={formData.mainGoal || ''}
              onChange={(e) =>
                setFormData({ ...formData, mainGoal: e.target.value })
              }
              placeholder="Ej: Perder 10kg, Ganar masa muscular..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalDeadline">Fecha Objetivo</Label>
            <Popover open={goalDateOpen} onOpenChange={setGoalDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="goalDeadline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !goalDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {goalDate ? (
                    goalDate.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={goalDate}
                  onSelect={(date) => {
                    setFormData({
                      ...formData,
                      goalDeadline: date ? formatLocalDate(date) : '',
                    });
                    setGoalDateOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">¿Por qué quieres alcanzar esta meta?</Label>
            <Textarea
              id="motivation"
              value={formData.motivation || ''}
              onChange={(e) =>
                setFormData({ ...formData, motivation: e.target.value })
              }
              placeholder="Tu motivación personal..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Salud y Restricciones */}
      <Card>
        <CardHeader>
          <CardTitle>Salud y Restricciones</CardTitle>
          <CardDescription>
            Información importante para adaptar tus rutinas de forma segura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="healthConditions">
              Condiciones de Salud o Lesiones
            </Label>
            <Textarea
              id="healthConditions"
              value={formData.healthConditions || ''}
              onChange={(e) =>
                setFormData({ ...formData, healthConditions: e.target.value })
              }
              placeholder="Lesiones, enfermedades crónicas, medicaciones..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Esta información nos ayuda a adaptar las recomendaciones
            </p>
          </div>

          <div className="space-y-2">
            <Label>Alergias Alimentarias</Label>
            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Agregar alergia..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergy(newAllergy);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addAllergy(newAllergy)}
              >
                Agregar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {COMMON_ALLERGIES.map((allergy) => (
                <Badge
                  key={allergy}
                  variant={formData.allergies?.includes(allergy) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    formData.allergies?.includes(allergy)
                      ? removeAllergy(allergy)
                      : addAllergy(allergy)
                  }
                >
                  {allergy}
                </Badge>
              ))}
            </div>

            {formData.allergies && formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allergies.map((allergy) => (
                  <Badge key={allergy} variant="secondary">
                    {allergy}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => removeAllergy(allergy)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferencias Nutricionales */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias Nutricionales</CardTitle>
          <CardDescription>
            Personaliza tus planes de alimentación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dietType">Tipo de Dieta</Label>
            <Select
              value={formData.dietType || ''}
              onValueChange={(value) =>
                setFormData({ ...formData, dietType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="¿Sigues alguna dieta específica?" />
              </SelectTrigger>
              <SelectContent>
                {DIET_TYPES.map((diet) => (
                  <SelectItem key={diet.value} value={diet.value}>
                    {diet.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealSchedule">Horario de Comidas</Label>
            <Select
              value={formData.mealSchedule || ''}
              onValueChange={(value) =>
                setFormData({ ...formData, mealSchedule: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="¿Cómo prefieres distribuir tus comidas?" />
              </SelectTrigger>
              <SelectContent>
                {MEAL_SCHEDULES.map((schedule) => (
                  <SelectItem key={schedule.value} value={schedule.value}>
                    {schedule.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
