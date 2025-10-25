# Row Level Security (RLS) Policies

Este directorio contiene todas las políticas de seguridad a nivel de fila (RLS) para la base de datos PostgreSQL de Vitalia.

## 🔐 ¿Qué es Row Level Security (RLS)?

RLS es una característica de PostgreSQL que permite controlar qué filas de una tabla puede ver o modificar cada usuario. Es una capa adicional de seguridad que funciona a nivel de base de datos, independientemente de tu código de aplicación.

## 📁 Estructura de Archivos

Los archivos se ejecutan en orden numérico:

1. **01-enable-rls.sql** - Habilita RLS en todas las tablas
2. **02-helper-functions.sql** - Funciones auxiliares para verificar permisos
3. **03-profiles-policies.sql** - Políticas para la tabla `profiles`
4. **04-exercises-policies.sql** - Políticas para la tabla `exercises`
5. **05-workouts-policies.sql** - Políticas para la tabla `workouts`
6. **06-sets-policies.sql** - Políticas para la tabla `sets`
7. **07-nutrition-logs-policies.sql** - Políticas para la tabla `nutrition_logs`
8. **08-mood-logs-policies.sql** - Políticas para la tabla `mood_logs`
9. **09-progress-photos-policies.sql** - Políticas para la tabla `progress_photos`

## 🚀 Aplicar las Políticas

Para aplicar todas las políticas RLS a tu base de datos:

```bash
bun run scripts/apply-rls.ts
```

Este script:
- ✅ Lee todos los archivos SQL en orden
- ✅ Ejecuta cada política en la base de datos
- ✅ Verifica que no haya errores
- ✅ Muestra un resumen de las políticas aplicadas

## 🔒 Políticas de Seguridad Implementadas

### 1. Profiles (Perfiles)
- **SELECT**: Los usuarios solo pueden ver su propio perfil
- **INSERT**: Los usuarios solo pueden crear su propio perfil
- **UPDATE**: Los usuarios solo pueden actualizar su propio perfil
- **DELETE**: Los usuarios solo pueden eliminar su propio perfil

### 2. Exercises (Ejercicios)
- **SELECT**: Los usuarios pueden ver:
  - Todos los ejercicios públicos (`is_public = true`)
  - Sus propios ejercicios privados
- **INSERT**: Los usuarios pueden crear ejercicios vinculados a su perfil
- **UPDATE**: Los usuarios solo pueden actualizar sus propios ejercicios
- **DELETE**: Los usuarios solo pueden eliminar sus propios ejercicios

### 3. Workouts (Entrenamientos)
- **SELECT**: Los usuarios solo pueden ver sus propios entrenamientos
- **INSERT**: Los usuarios solo pueden crear entrenamientos para sí mismos
- **UPDATE**: Los usuarios solo pueden actualizar sus propios entrenamientos
- **DELETE**: Los usuarios solo pueden eliminar sus propios entrenamientos

### 4. Sets (Series de Ejercicios)
- **SELECT**: Los usuarios solo pueden ver series de sus propios entrenamientos
- **INSERT**: Los usuarios solo pueden agregar series a sus propios entrenamientos
- **UPDATE**: Los usuarios solo pueden actualizar series de sus propios entrenamientos
- **DELETE**: Los usuarios solo pueden eliminar series de sus propios entrenamientos

### 5. Nutrition Logs (Registros de Nutrición)
- **SELECT**: Los usuarios solo pueden ver sus propios registros
- **INSERT**: Los usuarios solo pueden crear sus propios registros
- **UPDATE**: Los usuarios solo pueden actualizar sus propios registros
- **DELETE**: Los usuarios solo pueden eliminar sus propios registros

### 6. Mood Logs (Registros de Estado de Ánimo)
- **SELECT**: Los usuarios solo pueden ver sus propios registros
- **INSERT**: Los usuarios solo pueden crear sus propios registros
- **UPDATE**: Los usuarios solo pueden actualizar sus propios registros
- **DELETE**: Los usuarios solo pueden eliminar sus propios registros

### 7. Progress Photos (Fotos de Progreso)
- **SELECT**: Los usuarios solo pueden ver sus propias fotos
- **INSERT**: Los usuarios solo pueden subir sus propias fotos
- **UPDATE**: Los usuarios solo pueden actualizar sus propias fotos
- **DELETE**: Los usuarios solo pueden eliminar sus propias fotos

## 🔧 Configuración de Autenticación

Para que RLS funcione correctamente, necesitas establecer el ID del usuario autenticado en cada conexión:

### Opción 1: Variable de Sesión PostgreSQL

```typescript
// En tu código de backend, antes de hacer consultas:
await sql`SET app.current_user_id = ${userId}`;
```

### Opción 2: Supabase JWT (si usas Supabase)

Las políticas pueden usar automáticamente el JWT de Supabase:
- Descomentar la función `auth.uid()` en `02-helper-functions.sql`
- Supabase inyecta automáticamente el JWT en cada request

## 📊 Verificar las Políticas

Para verificar que las políticas están activas:

```sql
-- Ver todas las políticas activas
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Ver si RLS está habilitado en una tabla
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

## 🧪 Probar las Políticas

```sql
-- 1. Establecer el ID de usuario actual
SET app.current_user_id = 'tu-uuid-aqui';

-- 2. Intentar consultar datos (solo verás tus propios datos)
SELECT * FROM workouts;

-- 3. Intentar insertar datos
INSERT INTO workouts (user_id, name, workout_date)
VALUES ('tu-profile-id', 'Test Workout', CURRENT_DATE);

-- 4. Restablecer la sesión
RESET app.current_user_id;
```

## ⚠️ Importante

1. **Bypass para Superusuarios**: Los usuarios `postgres` o con rol `BYPASSRLS` pueden ver todos los datos
2. **Performance**: Las políticas RLS pueden impactar el rendimiento; usa índices apropiados
3. **Testing**: En desarrollo, puedes deshabilitar RLS temporalmente:
   ```sql
   ALTER TABLE tabla_nombre DISABLE ROW LEVEL SECURITY;
   ```

## 🔄 Actualizar Políticas

Para actualizar las políticas:

1. Modifica los archivos SQL necesarios
2. Ejecuta nuevamente: `bun run scripts/apply-rls.ts`
3. El script eliminará las políticas existentes y aplicará las nuevas

## 📚 Referencias

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Best Practices for RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html#DDL-ROWSECURITY-PERFORMANCE)

