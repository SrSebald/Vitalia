# 🚀 Instalar RLS en Supabase - Guía Paso a Paso

Ya que estás usando **Supabase**, aquí está la forma más fácil de aplicar las políticas RLS:

---

## 📋 Método 1: Desde el Dashboard de Supabase (Recomendado)

### Paso 1: Abrir el SQL Editor

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto **yzmylhqlhwpyhxxiqgaq**
3. En el menú lateral, haz clic en **SQL Editor**

### Paso 2: Copiar el Script Completo

1. Abre el archivo: `scripts/rls/supabase-all-policies.sql`
2. **Copia TODO el contenido** del archivo (Ctrl+A, Ctrl+C)

### Paso 3: Ejecutar el Script

1. En el SQL Editor de Supabase, haz clic en **+ New query**
2. Pega el contenido completo
3. Haz clic en **Run** (o presiona Ctrl+Enter)
4. Espera a que se complete (puede tomar 10-20 segundos)

### Paso 4: Verificar que Funcionó

En el SQL Editor, ejecuta esta consulta:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Deberías ver `rowsecurity = true` en todas tus tablas.

---

## 📋 Método 2: Usando la CLI de Supabase

Si prefieres usar la terminal:

### Instalar Supabase CLI

```bash
npm install -g supabase
```

### Iniciar sesión

```bash
supabase login
```

### Ejecutar el script

```bash
supabase db push --db-url "postgresql://postgres.yzmylhqlhwpyhxxiqgaq:Vademeucm1945@aws-1-sa-east-1.pooler.supabase.com:5432/postgres" --file scripts/rls/supabase-all-policies.sql
```

---

## 📋 Método 3: Conexión Directa (Si tienes problemas de red)

Si los métodos anteriores no funcionan, puedes usar `psql` directamente:

```bash
# Windows (si tienes PostgreSQL instalado)
psql "postgresql://postgres.yzmylhqlhwpyhxxiqgaq:Vademeucm1945@aws-1-sa-east-1.pooler.supabase.com:5432/postgres" -f scripts/rls/supabase-all-policies.sql

# O con la DATABASE_URL
psql $DATABASE_URL -f scripts/rls/supabase-all-policies.sql
```

---

## ✅ Verificación Post-Instalación

### 1. Verificar RLS está Habilitado

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

Resultado esperado:
```
   tablename     | rowsecurity
-----------------+-------------
 exercises       | t
 mood_logs       | t
 nutrition_logs  | t
 profiles        | t
 progress_photos | t
 sets            | t
 workouts        | t
```

### 2. Verificar Políticas Creadas

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Deberías ver **28 políticas** (4 por cada una de las 7 tablas).

### 3. Probar las Políticas

```sql
-- Esto debería fallar o retornar vacío si no estás autenticado
SELECT * FROM workouts;

-- Esto debería funcionar cuando estés autenticado vía Supabase
-- (automáticamente cuando uses el cliente de Supabase)
```

---

## 🎯 Próximos Pasos

Una vez aplicadas las políticas:

1. ✅ **Las políticas RLS están activas**
2. ✅ **Tu código en Next.js automáticamente las respetará** cuando uses:
   - Supabase Client (recomendado para frontend)
   - `withUserContext()` (para backend con postgres directo)

### Usar con Supabase Client (Frontend)

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// RLS se aplica automáticamente basándose en el JWT
const { data: workouts } = await supabase
  .from('workouts')
  .select('*')
```

### Usar con Postgres Directo (Backend API)

```typescript
import { withUserContext } from '@/lib/db/rls-helper'
import { sql } from '@/lib/db'

const workouts = await withUserContext(sql, userId, async () => {
  return await sql`SELECT * FROM workouts`
})
```

---

## 🔒 ¿Qué Está Protegido Ahora?

✅ **profiles** - Solo tu propio perfil  
✅ **workouts** - Solo tus entrenamientos  
✅ **exercises** - Públicos + tus privados  
✅ **sets** - Solo sets de tus workouts  
✅ **nutrition_logs** - Solo tus registros  
✅ **mood_logs** - Solo tus registros  
✅ **progress_photos** - Solo tus fotos  

---

## 💡 Tip: Usar el Dashboard de Supabase para RLS

Supabase también tiene una interfaz visual para RLS:

1. Ve a **Database > Policies** en el dashboard
2. Verás todas las políticas listadas
3. Puedes habilitarlas/deshabilitarlas visualmente
4. Puedes ver qué usuarios tienen acceso a qué datos

---

## 🆘 Problemas Comunes

### ❌ "relation does not exist"

**Solución:** Tus tablas no existen aún. Primero ejecuta:
```bash
bun run db:push
```

### ❌ "insufficient privilege"

**Solución:** Asegúrate de estar usando las credenciales correctas (usuario `postgres` o `service_role`).

### ❌ Políticas no se aplican

**Solución:** Verifica que estás usando el cliente de Supabase o `withUserContext()` en tu código.

---

**✨ ¡Listo!** Una vez aplicadas las políticas, tu base de datos está completamente protegida.

