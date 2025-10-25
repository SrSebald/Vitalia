# 🔐 Row Level Security (RLS) - Guía Completa

## 📋 Tabla de Contenidos
- [¿Qué es RLS?](#qué-es-rls)
- [Arquitectura de Seguridad](#arquitectura-de-seguridad)
- [Políticas Implementadas](#políticas-implementadas)
- [Cómo Usar RLS en tu Código](#cómo-usar-rls-en-tu-código)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Troubleshooting](#troubleshooting)

---

## ¿Qué es RLS?

**Row Level Security (RLS)** es una característica de PostgreSQL que permite controlar el acceso a filas individuales de una tabla basándose en políticas de seguridad. 

### Beneficios:

✅ **Seguridad a nivel de base de datos** - Independiente del código de la aplicación  
✅ **Protección contra bugs** - Aunque tu código tenga errores, RLS protege los datos  
✅ **Multi-tenancy** - Usuarios solo ven sus propios datos automáticamente  
✅ **Cumplimiento de privacidad** - GDPR, HIPAA, etc.  
✅ **Defensa en profundidad** - Capa adicional de seguridad

### ⚠️ Lo que RLS NO hace:

❌ No reemplaza la autenticación  
❌ No funciona sin establecer el contexto de usuario  
❌ No protege contra ataques de fuerza bruta  
❌ No cifra datos en reposo

---

## Arquitectura de Seguridad

```
┌─────────────────────────────────────────────────────────┐
│                    Usuario Autenticado                   │
│                     (Supabase / JWT)                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js Middleware                     │
│                (Verifica autenticación)                  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     API Routes                           │
│          setCurrentUser(sql, userId)                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL                            │
│              RLS Policies Active                         │
│    • Filtra automáticamente filas por usuario           │
│    • Bloquea INSERT/UPDATE/DELETE no autorizados        │
└─────────────────────────────────────────────────────────┘
```

---

## Políticas Implementadas

### 🗂️ Por Tabla

#### 1. **profiles** - Perfiles de Usuario
```sql
✓ SELECT: Solo ver tu propio perfil
✓ INSERT: Solo crear tu propio perfil
✓ UPDATE: Solo actualizar tu propio perfil
✓ DELETE: Solo eliminar tu propio perfil
```

#### 2. **exercises** - Ejercicios
```sql
✓ SELECT: Ver ejercicios públicos + tus ejercicios privados
✓ INSERT: Crear ejercicios vinculados a tu perfil
✓ UPDATE: Solo actualizar tus propios ejercicios
✓ DELETE: Solo eliminar tus propios ejercicios
```

#### 3. **workouts** - Entrenamientos
```sql
✓ SELECT: Solo ver tus entrenamientos
✓ INSERT: Solo crear tus propios entrenamientos
✓ UPDATE: Solo actualizar tus entrenamientos
✓ DELETE: Solo eliminar tus entrenamientos
```

#### 4. **sets** - Series de Ejercicios
```sql
✓ SELECT: Ver series de tus entrenamientos
✓ INSERT: Agregar series a tus entrenamientos
✓ UPDATE: Actualizar series de tus entrenamientos
✓ DELETE: Eliminar series de tus entrenamientos
```

#### 5. **nutrition_logs** - Registros de Nutrición
```sql
✓ Acceso completo solo a tus propios registros
```

#### 6. **mood_logs** - Registros de Estado de Ánimo
```sql
✓ Acceso completo solo a tus propios registros
```

#### 7. **progress_photos** - Fotos de Progreso
```sql
✓ Acceso completo solo a tus propias fotos
```

---

## Cómo Usar RLS en tu Código

### 1️⃣ Importar las Utilidades

```typescript
import { sql } from '@/lib/db';
import { withUserContext } from '@/lib/db/rls-helper';
```

### 2️⃣ Usar en API Routes

```typescript
// app/api/workouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { withUserContext } from '@/lib/db/rls-helper';

export async function GET(request: NextRequest) {
  // 1. Obtener el userId de la sesión/JWT
  const userId = getUserFromSession(request); // Tu función de auth
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Ejecutar queries con contexto de usuario
  const workouts = await withUserContext(sql, userId, async () => {
    // Todas las consultas aquí respetan RLS automáticamente
    return await sql`
      SELECT * FROM workouts
      ORDER BY workout_date DESC
    `;
  });

  return NextResponse.json(workouts);
}

export async function POST(request: NextRequest) {
  const userId = getUserFromSession(request);
  const body = await request.json();

  const result = await withUserContext(sql, userId, async () => {
    // RLS verifica automáticamente que user_id coincida
    return await sql`
      INSERT INTO workouts (user_id, name, workout_date)
      VALUES (${body.userId}, ${body.name}, ${body.date})
      RETURNING *
    `;
  });

  return NextResponse.json(result[0]);
}
```

### 3️⃣ Uso con Supabase Auth

Si usas Supabase para autenticación:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getUserIdFromSupabase() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromSupabase();
  
  return withUserContext(sql, userId!, async () => {
    const data = await sql`SELECT * FROM workouts`;
    return NextResponse.json(data);
  });
}
```

---

## Instalación y Configuración

### Paso 1: Aplicar las Políticas RLS

```bash
# Opción A: Usar el script npm
bun run db:rls

# Opción B: Ejecutar manualmente
bun run scripts/apply-rls.ts
```

### Paso 2: Verificar que se Aplicaron

```bash
# Conectar a PostgreSQL
psql $DATABASE_URL

# Ver políticas activas
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;

# Verificar que RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Deberías ver:
```
 tablename        | rowsecurity
------------------+-------------
 profiles         | t
 exercises        | t
 workouts         | t
 sets             | t
 nutrition_logs   | t
 mood_logs        | t
 progress_photos  | t
```

### Paso 3: Configurar tu .env

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/Vitalia
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Ejemplos de Uso

### Ejemplo 1: Obtener Entrenamientos del Usuario

```typescript
// app/api/my-workouts/route.ts
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);

  const workouts = await withUserContext(sql, userId, async () => {
    return await sql`
      SELECT 
        w.*,
        COUNT(s.id) as total_sets
      FROM workouts w
      LEFT JOIN sets s ON s.workout_id = w.id
      GROUP BY w.id
      ORDER BY w.workout_date DESC
      LIMIT 10
    `;
  });

  return NextResponse.json({ workouts });
}
```

### Ejemplo 2: Crear un Nuevo Workout

```typescript
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  const { profileId, name, date } = await request.json();

  const workout = await withUserContext(sql, userId, async () => {
    // RLS verifica que profileId pertenezca al usuario autenticado
    const [newWorkout] = await sql`
      INSERT INTO workouts (user_id, name, workout_date)
      VALUES (${profileId}, ${name}, ${date})
      RETURNING *
    `;
    return newWorkout;
  });

  return NextResponse.json(workout);
}
```

### Ejemplo 3: Ver Ejercicios (Públicos + Propios)

```typescript
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);

  const exercises = await withUserContext(sql, userId, async () => {
    // RLS automáticamente filtra: is_public = true OR created_by = tu perfil
    return await sql`
      SELECT * FROM exercises
      ORDER BY name
    `;
  });

  return NextResponse.json({ exercises });
}
```

---

## Troubleshooting

### ❌ Error: "No rows returned"

**Problema:** Las consultas no devuelven datos

**Solución:**
```typescript
// ✅ Verificar que estás estableciendo el contexto
await withUserContext(sql, userId, async () => {
  // tus queries aquí
});

// ❌ NO hagas esto:
const data = await sql`SELECT * FROM workouts`; // Sin contexto
```

### ❌ Error: "Permission denied"

**Problema:** No puedes insertar/actualizar datos

**Solución:**
- Verifica que `user_id` o `created_by` coincida con el perfil del usuario
- Verifica que estés usando el `auth_user_id` correcto

```typescript
// ✅ Correcto
const profileId = await getProfileIdByAuthUserId(sql, userId);
await sql`INSERT INTO workouts (user_id, ...) VALUES (${profileId}, ...)`;
```

### ❌ RLS no se está aplicando

**Verificar:**
```sql
-- 1. ¿Está habilitado RLS?
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- 2. ¿Existen las políticas?
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- 3. ¿Estás conectado como superusuario?
SELECT current_user, usesuper FROM pg_user WHERE usename = current_user;
```

**Nota:** Los superusuarios de PostgreSQL ignoran RLS por defecto.

### 🔧 Deshabilitar RLS temporalmente (Desarrollo)

```sql
-- Para testing/debugging
ALTER TABLE workouts DISABLE ROW LEVEL SECURITY;

-- Volver a habilitar
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
```

---

## 📚 Recursos Adicionales

- 📖 [Documentación PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- 📖 [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- 📖 [Archivos de políticas](../scripts/rls/)

---

## 🆘 Soporte

Si tienes problemas con RLS:

1. Revisa los logs de PostgreSQL: `tail -f /var/log/postgresql/postgresql.log`
2. Ejecuta queries de verificación (ver sección Troubleshooting)
3. Revisa que las variables de entorno estén configuradas
4. Verifica que el `auth_user_id` sea el correcto

---

**✨ ¡RLS implementado exitosamente!** Tu base de datos ahora tiene una capa adicional de seguridad robusta.

