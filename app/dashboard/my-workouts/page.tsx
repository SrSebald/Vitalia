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
import { getUserWorkouts } from "@/app/actions/workouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Calendar, Target } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default async function MyWorkoutsPage() {
  let workouts: Awaited<ReturnType<typeof getUserWorkouts>> = [];
  let error: string | null = null;

  try {
    workouts = await getUserWorkouts();
  } catch (err) {
    error = err instanceof Error ? err.message : "Error al cargar workouts";
    console.error("Error loading workouts:", err);
  }

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
                <BreadcrumbPage>My Workouts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header con gradiente */}
        <div className="rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Dumbbell className="h-8 w-8" />
                Mis Entrenamientos
              </h1>
              <p className="text-white/90 mt-2">
                Historial de rutinas generadas por IA
              </p>
            </div>
            <Link
              href="/dashboard/workouts"
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-white text-purple-600 hover:bg-white/90 hover:scale-105 h-10 px-4 py-2 shadow-md"
            >
              <Dumbbell className="mr-2 h-4 w-4" />
              Nueva Rutina
            </Link>
          </div>
        </div>

        {error ? (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <Dumbbell className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-900 dark:text-red-100">Error al cargar entrenamientos</h3>
              <p className="text-red-700 dark:text-red-300 text-center mb-6 max-w-md">
                {error}
              </p>
              <Link
                href="/dashboard/workouts"
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 h-10 px-6 py-2 shadow-lg"
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                Intentar Generar Nueva Rutina
              </Link>
            </CardContent>
          </Card>
        ) : workouts.length === 0 ? (
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
                <Dumbbell className="h-16 w-16 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No hay entrenamientos guardados</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Genera tu primera rutina personalizada con IA y comienza tu transformación
              </p>
              <Link
                href="/dashboard/workouts"
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 h-10 px-6 py-2 shadow-lg"
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                Generar Primera Rutina
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout, index) => {
              const gradientClasses = [
                "from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600",
                "from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600",
                "from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600",
                "from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600",
              ];
              const gradientClass = gradientClasses[index % gradientClasses.length];
              
              return (
                <Link key={workout.id} href={`/dashboard/my-workouts/${workout.id}`}>
                  <Card className={`bg-gradient-to-br ${gradientClass} transition-all cursor-pointer h-full hover:shadow-lg hover:scale-[1.02]`}>
                    <CardHeader>
                      <CardTitle className="line-clamp-1 flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        {workout.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {workout.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Objetivos */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs font-semibold">
                          <Target className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          <span>Objetivos</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {workout.goals.map((goal) => (
                            <Badge key={goal} className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Grupos Musculares */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs font-semibold">
                          <Dumbbell className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <span>Grupos Musculares</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {workout.muscleGroups.map((group) => (
                            <Badge key={group} variant="outline" className="text-xs border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Info adicional */}
                      <Separator />
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                          <Clock className="h-3 w-3" />
                          <span>{workout.estimatedDuration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(workout.createdAt), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
