# 🚀 RLS Quick Start Guide

## ⚡ Aplicar RLS en 3 Pasos

### Paso 1: Aplicar las Políticas

```bash
bun run db:rls
```

Esto aplicará automáticamente todas las políticas RLS a tu base de datos.

### Paso 2: Verificar Instalación

```bash
psql $DATABASE_URL -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';"
```

Deberías ver `rowsecurity = t` (true) en todas las tablas.

### Paso 3: Usar en tu Código

```typescript
import { withUserContext } from '@/lib/db/rls-helper';
import { sql } from '@/lib/db';

// En tus API routes:
export async function GET(request: NextRequest) {
  const userId = await getAuthenticatedUserId(request);
  
  const data = await withUserContext(sql, userId, async () => {
    // Todas las consultas aquí respetan RLS automáticamente
    return await sql`SELECT * FROM workouts`;
  });
  
  return NextResponse.json(data);
}
```

---

## 📝 Comandos Útiles

### Aplicar Políticas
```bash
bun run db:rls
```

### Ver Políticas Activas
```sql
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Probar RLS Manualmente
```sql
-- Establecer usuario
SET app.current_user_id = 'tu-uuid-aqui';

-- Hacer consultas (solo verás tus datos)
SELECT * FROM workouts;

-- Limpiar
RESET app.current_user_id;
```

### Deshabilitar RLS Temporalmente (Desarrollo)
```sql
ALTER TABLE workouts DISABLE ROW LEVEL SECURITY;
```

---

## 🔒 ¿Qué Protege RLS?

| Tabla | Protección |
|-------|-----------|
| **profiles** | ✅ Solo puedes ver/editar tu propio perfil |
| **workouts** | ✅ Solo puedes ver/editar tus entrenamientos |
| **exercises** | ✅ Ves públicos + tus privados |
| **sets** | ✅ Solo sets de tus workouts |
| **nutrition_logs** | ✅ Solo tus registros |
| **mood_logs** | ✅ Solo tus registros |
| **progress_photos** | ✅ Solo tus fotos |

---

## ⚠️ Importante

1. **Siempre usa `withUserContext()`** - Sin esto, RLS bloqueará todas las consultas
2. **No uses superusuario** - Los superusuarios ignoran RLS
3. **Verifica el auth_user_id** - Debe coincidir con el ID del usuario autenticado

---

## 📚 Más Información

- 📖 [Documentación completa](../../docs/RLS-SECURITY.md)
- 📖 [Archivos de políticas](./README.md)
- 💡 [Ejemplo de API route](../../app/api/workouts/route.ts)

---

## 🆘 Problemas Comunes

### ❌ "No rows returned"
**Solución:** Verifica que estés usando `withUserContext()`

### ❌ "Permission denied"
**Solución:** Verifica que el `user_id` o `created_by` sea correcto

### ❌ RLS no funciona
**Solución:** Verifica que no seas superusuario:
```sql
SELECT current_user, usesuper FROM pg_user WHERE usename = current_user;
```

---

**✨ ¡Listo!** Tu base de datos ahora está protegida con RLS.

