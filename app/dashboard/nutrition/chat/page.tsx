import { ChatAgent } from "@/components/ai/ChatAgent";
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
import { Apple } from "lucide-react";
import Link from "next/link";
import { NUTRITION_AGENT_PROMPT } from "@/lib/ai/prompts";

export default function NutritionChatPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/nutrition">Nutrición</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chat con IA</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Botón para volver al plan */}
          <div className="ml-auto">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/nutrition">
                <Apple className="mr-2 h-4 w-4" />
                Ver Plan del Día
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">💡 Sugerencias</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• "¿Qué opinas de mi desayuno?"</li>
              <li>• "Dame una receta alta en proteína"</li>
              <li>• "¿Cuántas calorías necesito?"</li>
              <li>• "Explícame los macronutrientes"</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 col-span-2">
            <h3 className="font-semibold mb-2">🎯 Objetivos</h3>
            <p className="text-sm text-muted-foreground">
              Cuéntale al asistente tus objetivos nutricionales para recibir consejos más personalizados y efectivos.
            </p>
          </div>
        </div>

        <div className="min-h-[100vh] flex-1 md:min-h-min">
          <ChatAgent
            systemPrompt={NUTRITION_AGENT_PROMPT}
            placeholder="Pregúntame sobre nutrición, recetas, macros..."
            agentName="Nutricionista IA"
          />
        </div>
      </div>
    </>
  );
}

