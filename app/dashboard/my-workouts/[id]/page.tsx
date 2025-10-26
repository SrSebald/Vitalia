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
import { getWorkoutById } from "@/app/actions/workouts";
import { SavedWorkoutView } from "@/components/workouts/SavedWorkoutView";
import type { WorkoutPlan } from "@/lib/ai/schemas";
import type { WorkoutFormData } from "@/app/actions/generate-workout";
import { notFound } from "next/navigation";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const workout = await getWorkoutById(id);
    const workoutPlan: WorkoutPlan = JSON.parse(workout.workoutData);
    const formData: WorkoutFormData = {
      goals: workout.goals,
      muscleGroups: workout.muscleGroups,
      duration: workout.duration,
      energyLevel: workout.energyLevel,
      additionalNotes: workout.additionalNotes || undefined,
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/my-workouts">
                    My Workouts
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{workout.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SavedWorkoutView
            plan={workoutPlan}
            formData={formData}
            workoutId={workout.id}
            initialCompletedExercises={workout.completedExercises || []}
          />
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
