# 🤖 Sistema de Agentes de IA en VITALIA

## 📋 Resumen

VITALIA implementa un sistema modular de agentes de IA especializados usando **Vercel AI SDK**. Cada agente tiene una personalidad única definida por su `system prompt`, permitiendo asistencia contextual en diferentes áreas de la aplicación.

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario en Dashboard                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              ChatAgent Component (Frontend)                 │
│  • Recibe systemPrompt como prop                           │
│  • Usa useChat() hook de Vercel AI SDK                     │
│  • Maneja UI y estado del chat                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP POST /api/chat
                 │ { messages: [...] }
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 API Route (/api/chat)                       │
│  • Recibe mensajes del cliente                             │
│  • Llama a OpenAI con streamText()                         │
│  • Retorna respuesta en streaming                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ OpenAI API Call
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      OpenAI GPT-4                           │
│  • Procesa mensajes con context del systemPrompt           │
│  • Genera respuesta contextualizada                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Streaming Response
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Usuario ve la respuesta en tiempo real         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Agentes Implementados

### 1. 🥗 Agente Nutricional
**Ubicación:** `/dashboard/nutrition`

**Personalidad:**
- Experto en nutrición
- Tono amigable y científico
- Enfocado en salud y bienestar

**Capacidades:**
- Análisis de comidas
- Consejos sobre macronutrientes
- Sugerencias de recetas
- Planes de alimentación

**System Prompt:** Ver `app/dashboard/nutrition/page.tsx`

---

### 2. 💪 Entrenador Personal
**Ubicación:** `/dashboard/workouts`

**Personalidad:**
- Coach motivador y enérgico
- Profesional en fitness
- Enfocado en técnica correcta

**Capacidades:**
- Diseño de rutinas
- Ejercicios por grupo muscular
- Consejos de progresión
- Adaptación por nivel

**System Prompt:** Ver `app/dashboard/workouts/page.tsx`

---

## 🔧 Configuración

### 1. Variables de Entorno

```env
# .env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 2. Instalación de Dependencias

```bash
npm install ai @ai-sdk/openai openai zod
```

---

## 💻 Uso del Componente ChatAgent

### Sintaxis Básica

```tsx
import { ChatAgent } from '@/components/ai/ChatAgent';

const MY_AGENT_PROMPT = `
Eres un [rol específico] en VITALIA.
Tu objetivo es [objetivo específico].
...
`;

export default function MyPage() {
  return (
    <ChatAgent
      systemPrompt={MY_AGENT_PROMPT}
      placeholder="Escribe tu mensaje..."
      agentName="Mi Agente Personalizado"
    />
  );
}
```

### Props del ChatAgent

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `systemPrompt` | `string` | ✅ | Define la personalidad y comportamiento del agente |
| `placeholder` | `string` | ❌ | Texto del input (default: "Type your message...") |
| `agentName` | `string` | ❌ | Nombre del agente en la UI (default: "AI Assistant") |

---

## 📝 Crear un Nuevo Agente

### Paso 1: Definir el System Prompt

```tsx
const MY_CUSTOM_AGENT_PROMPT = `
Eres un [especialista en X] en VITALIA.

## Tu personalidad:
- [Característica 1]
- [Característica 2]

## Tus capacidades:
- [Capacidad 1]
- [Capacidad 2]

## Restricciones:
- [Restricción 1]
- [Restricción 2]

Responde siempre en español de forma [tono deseado].
`;
```

### Paso 2: Crear la Página

```tsx
// app/dashboard/mi-seccion/page.tsx
import { ChatAgent } from '@/components/ai/ChatAgent';

export default function MySection() {
  return (
    <div className="container mx-auto p-6">
      <h1>Mi Sección</h1>
      <ChatAgent
        systemPrompt={MY_CUSTOM_AGENT_PROMPT}
        placeholder="Pregúntame sobre..."
        agentName="Mi Agente"
      />
    </div>
  );
}
```

### Paso 3: Agregar al Sidebar

Edita `components/app-sidebar.tsx` para incluir tu nueva página en la navegación.

---

## 🔄 Flujo de Datos Detallado

1. **Usuario escribe mensaje**
   - Input capturado por `<ChatAgent />`
   - Hook `useChat()` maneja el estado

2. **Envío al servidor**
   - POST a `/api/chat` con array de mensajes
   - Incluye el `systemPrompt` como primer mensaje

3. **Procesamiento en API**
   - `app/api/chat/route.ts` recibe la petición
   - Llama a OpenAI usando `streamText()`

4. **Respuesta de OpenAI**
   - GPT-4 procesa con contexto del system prompt
   - Genera respuesta personalizada

5. **Streaming al cliente**
   - Respuesta se envía en chunks (streaming)
   - `useChat()` actualiza UI en tiempo real
   - Usuario ve la respuesta aparecer gradualmente

---

## 🎨 Personalización de UI

El componente `ChatAgent` usa componentes de shadcn/ui:
- `Card` - Contenedor principal
- `ScrollArea` - Área de mensajes
- `Input` - Campo de texto
- `Button` - Botón de envío
- `Avatar` - Iconos de usuario/bot

Puedes personalizar los estilos editando `/components/ai/ChatAgent.tsx`

---

## 🚀 Características Avanzadas

### Streaming de Respuestas
- Las respuestas aparecen en tiempo real
- Mejor UX que esperar la respuesta completa
- Implementado automáticamente por Vercel AI SDK

### Historial de Mensajes
- `useChat()` mantiene el historial automáticamente
- Cada agente tiene su propio contexto
- El system prompt persiste en todas las interacciones

### Estados de Carga
- Indicador visual mientras el agente "piensa"
- Animación de puntos suspensivos
- Botones deshabilitados durante carga

---

## 📊 Modelos Soportados

Actualmente usa `gpt-4-turbo`, pero puedes cambiar el modelo en `/app/api/chat/route.ts`:

```typescript
const result = await streamText({
  model: openai('gpt-4-turbo'), // o 'gpt-3.5-turbo', 'gpt-4', etc.
  messages,
  // ...
});
```

---

## 🔐 Seguridad

- ✅ API Key en servidor (no expuesta al cliente)
- ✅ Validación de mensajes en API route
- ✅ Límite de tokens configurado
- ✅ Timeout de 30 segundos

---

## 📈 Próximas Mejoras

- [ ] Guardar historial de conversaciones
- [ ] Integración con datos del usuario (perfil, objetivos)
- [ ] Agente de coach motivacional general
- [ ] Rate limiting por usuario
- [ ] Análisis de sentimiento
- [ ] Soporte multi-idioma

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY is not defined"
- Verifica que `.env` contiene `OPENAI_API_KEY`
- Reinicia el servidor de desarrollo

### Respuestas lentas
- Considera usar `gpt-3.5-turbo` para mayor velocidad
- Ajusta `maxTokens` en la API route

### Agente no responde apropiadamente
- Revisa y mejora el `systemPrompt`
- Asegúrate de ser específico en las instrucciones

---

## 📚 Recursos

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Best Practices for Prompts](https://platform.openai.com/docs/guides/prompt-engineering)

---

**¡Creado con ❤️ para VITALIA!**
