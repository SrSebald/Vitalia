# 🔧 Configuración de Cloudflare Pages con Bun

## ✅ Problema Resuelto

El error de `zod` dependency conflict ha sido arreglado:
- ❌ `zod@4.1.12` (causaba conflicto)
- ✅ `zod@3.25.76` (compatible con @ai-sdk/react)

## 🚀 Configuración en Cloudflare Dashboard

### **IMPORTANTE:** Debes cambiar el comando de instalación en Cloudflare

Por defecto, Cloudflare usa `npm clean-install`, pero necesitamos usar `bun` o ajustar npm.

### Opción 1: Usar Legacy Peer Deps (Más Fácil)

En el Dashboard de Cloudflare:

1. Ve a tu proyecto **"vitalia"**
2. **Settings** → **Builds & deployments**
3. En **Build configurations**, edita:

```
Build command: npm install --legacy-peer-deps && npx @cloudflare/next-on-pages

Build output directory: .vercel/output/static
```

### Opción 2: Usar Bun (Recomendado)

En el Dashboard de Cloudflare:

1. Ve a tu proyecto **"vitalia"**
2. **Settings** → **Builds & deployments**  
3. **Environment variables** → Add variable:

```
Variable name: UNSTABLE_PRE_BUILD
Value: curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH"
```

4. Cambia el **Build command** a:

```
Build command: $HOME/.bun/bin/bun install && $HOME/.bun/bin/bun run pages:build

Build output directory: .vercel/output/static
```

### Opción 3: Usar npm con force (Más Simple)

En el Dashboard:

```
Build command: npm install --force && npx @cloudflare/next-on-pages

Build output directory: .vercel/output/static
```

## 📝 Configuración Completa Recomendada

### Build Settings:
```
Framework preset: Next.js
Build command: npm install --legacy-peer-deps && npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
Root directory: (leave empty)
Node.js version: 20 (detectado automáticamente por .nvmrc)
```

### Environment Variables:
```
NODE_VERSION = 20
NEXT_PUBLIC_SUPABASE_URL = [tu valor]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [tu valor]
DIRECT_URL = [tu valor]
NODE_ENV = production
```

## 🎯 Pasos para Re-deployar

### 1. Commit y Push los Cambios

```bash
git add .
git commit -m "Fix: zod version conflict and Cloudflare config"
git push origin main
```

### 2. Actualizar Configuración en Cloudflare

1. Ve a tu proyecto en Cloudflare Dashboard
2. **Settings** → **Builds & deployments**
3. **Edit configuration**
4. Cambia **Build command** a una de las opciones de arriba
5. **Save**

### 3. Trigger Manual Deployment

1. En tu proyecto → **Deployments**
2. Click **"Create deployment"**
3. O simplemente espera a que detecte el push automáticamente

## ✅ Verificación

El build debe:
- ✅ Instalar dependencias sin errores
- ✅ Ejecutar `@cloudflare/next-on-pages` correctamente
- ✅ Generar output en `.vercel/output/static`
- ✅ Deployar exitosamente

## 🐛 Si Sigue Fallando

### Logs a Revisar:

1. **"Initializing build environment"**
   - Debe mostrar Node.js 20.x
   
2. **"Installing project dependencies"**
   - No debe haber errores de ERESOLVE

3. **"Building application"**
   - Debe completar el build de Next.js

### Comandos de Emergencia:

Si nada funciona, prueba en tu configuración de Cloudflare:

```bash
# Build command más agresivo
npm ci --legacy-peer-deps --force && npx @cloudflare/next-on-pages --experimental-minify

# O aún más simple
npm install --legacy-peer-deps && npm run pages:build
```

## 📚 Archivos Actualizados

- ✅ `package.json` - zod@3.25.76
- ✅ `bun.lock` - dependencias actualizadas
- ✅ `.nvmrc` - Node.js version
- ✅ `.node-version` - Node.js version (alternativo)
- ✅ `wrangler.toml` - configuración mejorada

## 🎉 Siguiente Paso

Una vez que hagas el commit y push:
1. Ve al Dashboard de Cloudflare
2. Edita el Build command
3. Observa el nuevo deployment
4. ¡Debería funcionar!

