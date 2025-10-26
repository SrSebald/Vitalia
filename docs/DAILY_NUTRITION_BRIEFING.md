# 📋 Briefing Nutricional Diario - Documentación Técnica

## 🎯 Concepto

El **Briefing Nutricional Diario** es un sistema de "Coach Proactivo" que genera automáticamente recomendaciones nutricionales personalizadas basadas en:

- **Datos Estáticos**: Perfil del usuario (objetivos, alergias, dieta, medidas)
- **Datos Dinámicos**: Actividad reciente (entrenamientos, logs nutricionales, estado de ánimo)

A diferencia de un chatbot reactivo, este sistema **proactivamente** analiza el contexto completo del usuario y presenta un plan nutricional estructurado al visitar la página.

---

## 🏗️ Arquitectura

### Flujo de Datos

```
Usuario navega a /nutrition/today
         ↓
Server Component carga datos del usuario
         ↓
generateDailyNutritionPlan() [Server Action]
   ├─ Consulta profiles (Supabase)
   ├─ Consulta workouts recientes
   ├─ Consulta nutritionLogs de ayer
   └─ Consulta moodLogs recientes
         ↓
Construye system prompt dinámico
         ↓
Llama a OpenAI con generateObject()
   └─ Schema: dailyNutritionPlanSchema (Zod)
         ↓
Retorna objeto JSON estructurado
         ↓
<DailyBriefingUI> renderiza el plan
```

---

## 📂 Estructura de Archivos

### 1. **Esquema de Datos**
```
lib/schemas/daily-nutrition-plan.ts
```
Define el contrato de datos con Zod:
- `macrosSchema`: Estructura de macronutrientes
- `mealSchema`: Estructura de una comida individual
- `dailyNutritionPlanSchema`: Plan completo del día

**Ventajas:**
- Validación automática de la respuesta de la IA
- Type-safety en todo el flujo
- Auto-completado en el IDE

### 2. **Server Action**
```
app/actions/generate-daily-nutrition.ts
```
Orquesta toda la lógica:
- Autenticación del usuario
- Recopilación de datos de múltiples tablas
- Construcción del prompt dinámico
- Llamada a OpenAI con `generateObject()`

**Funciones clave:**
- `generateDailyNutritionPlan()`: Función principal (exported)
- `buildSystemPrompt()`: Construye el prompt con todos los datos

### 3. **Componentes de UI**
```
components/nutrition/DailyBriefingUI.tsx
components/nutrition/DailyBriefingSkeleton.tsx
```

**DailyBriefingUI:**
- Renderiza el plan estructurado
- Usa `<Accordion>` para las comidas (expandibles)
- Cards con colores semánticos para destacar secciones
- Componentes auxiliares: `MacroCard`, `MiniMacro`

**DailyBriefingSkeleton:**
- Estado de carga elegante
- Imita la forma de la UI final
- Mejora la percepción de velocidad

### 4. **Página Principal**
```
app/dashboard/nutrition/today/page.tsx
```
- **Server Component** asíncrono
- Usa `<Suspense>` para manejo de carga
- `dynamic = 'force-dynamic'` para evitar caché
- Breadcrumbs y botones de navegación

---

## 🧠 System Prompt Inteligente

El prompt se construye dinámicamente con:

### Datos Estáticos
- Nombre, edad, peso, altura
- Objetivo principal
- Tipo de dieta (vegano, keto, etc.)
- Alergias y restricciones
- Condiciones de salud

### Datos Dinámicos
- **Último workout**: Tipo, duración, grupos musculares
- **Balance nutricional de ayer**: Calorías, macros totales
- **Estado emocional**: Mood rating reciente

### Instrucciones para la IA
1. **Conectar los puntos**: Analizar cómo el entrenamiento afecta la nutrición de hoy
2. **Respeto absoluto** a alergias y tipo de dieta
3. **Especificidad**: Alimentos concretos con cantidades
4. **Pro Tip**: Conclusión inteligente que demuestre análisis contextual
5. **Tono motivador** pero realista

---

## 🎨 Componentes de UI Utilizados

### shadcn/ui
- `<Card>` - Contenedores principales
- `<Accordion>` - Comidas expandibles
- `<Badge>` - Tags de calorías
- `<Separator>` - Divisores
- `<Skeleton>` - Estados de carga
- `<Alert>` - Mensajes de error
- `<Breadcrumb>` - Navegación
- `<Button>` - Acciones

### Iconos (lucide-react)
- `Droplets` - Hidratación
- `Lightbulb` - Pro Tip
- `Flame` - Calorías
- `Apple` - Nutrición
- `RefreshCw` - Regenerar
- `MessageSquare` - Chat

---

## 🔑 Características Clave

### 1. **Generación Proactiva**
- No requiere input del usuario
- Se genera automáticamente al cargar la página
- Basado en el contexto completo

### 2. **Análisis Contextual Inteligente**
- Si entrenó ayer → Enfoque en recuperación
- Si faltaron calorías → Ajuste con comidas más densas
- Si el mood fue bajo → Alimentos que mejoran el ánimo
- Si es día de descanso → Mantención calórica

### 3. **Respeto a Restricciones**
- Las alergias son **inquebrantables**
- El tipo de dieta se respeta siempre
- Sugerencias adaptadas al horario preferido

### 4. **UX Optimizada**
- Skeleton loading inmediato
- Accordion para mantener UI limpia
- Macros visuales con colores semánticos
- Mobile-first responsive

---

## 🚀 Uso

### Como Usuario
1. Navega a `/dashboard/nutrition/today`
2. El sistema genera el plan automáticamente
3. Revisa las comidas en el accordion
4. Lee el Pro Tip del coach
5. (Opcional) Regenera el plan si quieres variedad

### Como Desarrollador
```typescript
// Llamar la Server Action directamente
const result = await generateDailyNutritionPlan();

if (result.success && result.plan) {
  // result.plan contiene el objeto tipado DailyNutritionPlan
  console.log(result.plan.dailyTitle);
  console.log(result.plan.meals);
  console.log(result.plan.proTip);
}
```

---

## 🔧 Configuración Requerida

### Variables de Entorno
```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Dependencias
```json
{
  "@ai-sdk/openai": "^2.0.53",
  "ai": "^5.0.78",
  "zod": "^4.1.12",
  "@radix-ui/react-accordion": "^1.2.2"
}
```

### Base de Datos (Supabase)
Tablas requeridas:
- `profiles` - Perfil del usuario
- `workouts` - Entrenamientos manuales
- `ai_generated_workouts` - Workouts generados por IA
- `nutrition_logs` - Logs de comida
- `mood_logs` - Estado de ánimo

---

## 📊 Ejemplo de Respuesta de IA

```typescript
{
  dailyTitle: "Día de Recuperación Muscular",
  dailyFocus: "Hoy es clave para la reparación de tejido muscular después del entrenamiento intenso de piernas de ayer. Prioriza proteínas de alta calidad y carbohidratos complejos.",
  meals: [
    {
      title: "Desayuno Rico en Proteínas",
      description: "3 huevos revueltos + 1 taza de avena con arándanos + 1 plátano + café negro",
      timing: "7:00 - 8:00 AM",
      macros: { calories: 520, protein_g: 32, carbs_g: 65, fat_g: 18 }
    },
    // ... más comidas
  ],
  hydrationTip: "Como ayer entrenaste, necesitas 3-4 litros de agua hoy para eliminar ácido láctico...",
  proTip: "Tu cuerpo está en ventana anabólica de 48h post-entrenamiento. Asegúrate de consumir 30g de proteína en cada comida...",
  totalDailyMacros: { calories: 2400, protein_g: 180, carbs_g: 250, fat_g: 70 }
}
```

---

## 🎯 Mejoras Futuras

### Corto Plazo
- [ ] Botón "Guardar como favorito"
- [ ] Historial de planes generados
- [ ] Notificaciones push diarias
- [ ] Integración con el chat de nutrición

### Mediano Plazo
- [ ] Generación por horario (mañana/tarde/noche)
- [ ] Exportar como PDF o imagen
- [ ] Sincronización con calendario
- [ ] Recordatorios de comidas

### Largo Plazo
- [ ] Análisis de tendencias nutricionales
- [ ] Sugerencias de compras basadas en el plan
- [ ] Integración con apps de delivery
- [ ] Planes semanales en lugar de diarios

---

## 🐛 Troubleshooting

### Error: "No se encontró el perfil del usuario"
**Solución**: El usuario debe completar su perfil en `/dashboard/settings` primero.

### Error: "No autenticado"
**Solución**: Verificar que la sesión de Supabase esté activa.

### Plan genérico sin contexto
**Causa**: Falta de datos dinámicos (sin workouts o nutrition logs).
**Solución**: La IA genera un plan base, animar al usuario a registrar actividad.

### Tiempos de carga largos
**Causa**: Llamada a OpenAI puede tardar 3-8 segundos.
**Solución**: El skeleton loading mejora la percepción. Considerar caché de 1 hora.

---

## 👥 Contribuciones

Para agregar nueva funcionalidad al briefing:

1. **Actualizar el esquema Zod** si necesitas nuevos campos
2. **Modificar el system prompt** en `buildSystemPrompt()`
3. **Actualizar DailyBriefingUI** para renderizar los nuevos datos
4. **Agregar queries** de datos adicionales si es necesario

---

## 📝 Licencia

Parte del proyecto VITALIA. Uso interno.

