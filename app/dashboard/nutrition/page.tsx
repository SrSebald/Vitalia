import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateDailyNutritionPlan } from "@/app/actions/generate-daily-nutrition";
import { DailyBriefingUI } from "@/components/nutrition/DailyBriefingUI";
import { DailyBriefingSkeleton } from "@/components/nutrition/DailyBriefingSkeleton";
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
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * Componente que maneja la generación del plan nutricional
 */
async function DailyBriefingContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await generateDailyNutritionPlan();

  if (!result.success || !result.plan) {
    return (
      <div className="w-full px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.error || "No se pudo generar el plan nutricional."}</AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link href="/dashboard/settings">Completar Perfil</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <DailyBriefingUI plan={result.plan} />;
}

export default function NutritionPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Plan Nutricional</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Botón para chat */}
          <div className="ml-auto">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/nutrition/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat con Nutricionista IA
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<DailyBriefingSkeleton />}>
          <DailyBriefingContent />
        </Suspense>
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
