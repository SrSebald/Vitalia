# 🚀 Cloudflare Pages - Deployment desde Dashboard

## Guía Paso a Paso para Vitalia

### 📋 Prerrequisitos

Antes de empezar, asegúrate de tener:
- ✅ Cuenta de Cloudflare (gratuita)
- ✅ Tu código subido a GitHub
- ✅ Variables de entorno a mano:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `DIRECT_URL`

---

## 🎯 Paso 1: Acceder a Cloudflare Pages

1. Ve a **[dash.cloudflare.com](https://dash.cloudflare.com)**
2. Inicia sesión (o crea cuenta si no tienes)
3. En el menú lateral, haz click en **"Workers & Pages"**
4. Click en el botón **"Create application"**
5. Selecciona la pestaña **"Pages"**
6. Click en **"Connect to Git"**

---

## 🔗 Paso 2: Conectar tu Repositorio de GitHub

1. **Autorizar GitHub:**
   - Click en **"Connect GitHub"**
   - Se abrirá una ventana de autorización
   - Click en **"Authorize Cloudflare Pages"**

2. **Seleccionar Repositorio:**
   - Busca **"Vitalia"** en la lista
   - Click en el repositorio
   - Click **"Begin setup"**

> 💡 **Nota:** Si no ves el repositorio, es posible que necesites dar permisos adicionales. Click en "Configure GitHub" y selecciona los repositorios que quieres dar acceso.

---

## ⚙️ Paso 3: Configurar el Build

En la página de configuración, completa estos campos:

### **Project name:**
```
vitalia
```
(Puedes cambiarlo si quieres)

### **Production branch:**
```
main
```

### **Framework preset:**
Selecciona: **"Next.js"**

### **Build command:**
```
bun run pages:build
```

### **Build output directory:**
```
.vercel/output/static
```

### **Root directory (path):**
Dejar vacío (o `/` si pide algo)

---

## 🔐 Paso 4: Configurar Variables de Entorno

Antes de hacer click en "Save and Deploy", necesitas agregar las variables de entorno:

1. **Expande la sección "Environment variables"**

2. **Agrega cada variable:**
   
   **Variable 1:**
   ```
   Variable name: NEXT_PUBLIC_SUPABASE_URL
   Value: [tu URL de Supabase]
   Environment: Production (y Preview si quieres)
   ```

   **Variable 2:**
   ```
   Variable name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [tu clave anon de Supabase]
   Environment: Production (y Preview)
   ```

   **Variable 3:**
   ```
   Variable name: DIRECT_URL
   Value: [tu URL de conexión directa a la base de datos]
   Environment: Production (y Preview)
   ```

   **Variable 4 (opcional pero recomendado):**
   ```
   Variable name: NODE_ENV
   Value: production
   Environment: Production only
   ```

> ⚠️ **Importante:** Asegúrate de marcar "Production" para cada variable. También puedes marcar "Preview" si quieres que funcione en deployments de preview.

---

## 🎉 Paso 5: Deploy

1. **Revisa la configuración:**
   - Build command: `bun run pages:build`
   - Output directory: `.vercel/output/static`
   - Variables de entorno agregadas: ✅

2. **Click en "Save and Deploy"**

3. **Espera el build:**
   - Verás una pantalla con logs en tiempo real
   - El proceso toma aproximadamente 2-5 minutos
   - Si hay errores, los verás en los logs

4. **¡Listo!**
   - Una vez completado, verás un mensaje de éxito
   - Te darán una URL tipo: `https://vitalia-abc.pages.dev`
   - Click en "Continue to project"

---

## 🌐 Paso 6: Acceder a tu Sitio

Tu aplicación estará disponible en:
```
https://[tu-proyecto].pages.dev
```

Prueba:
1. Abre la URL en tu navegador
2. Deberías ver la página de login
3. Intenta registrarte o iniciar sesión
4. Verifica que todo funcione correctamente

---

## 🔄 Deployments Futuros

### Deployments Automáticos

Ahora, **cada vez que hagas push a `main`**:
1. Cloudflare detectará el cambio automáticamente
2. Iniciará un nuevo build
3. Desplegará la nueva versión
4. Todo sin que tengas que hacer nada

### Ver el Estado del Deployment

1. Ve a **Workers & Pages** en Cloudflare
2. Click en tu proyecto **"vitalia"**
3. Verás:
   - Deployments recientes
   - Estado (Building, Success, Failed)
   - Logs de cada deployment

---

## 🎨 Paso 7: Configurar Dominio Personalizado (Opcional)

Si tienes un dominio:

1. En tu proyecto, ve a **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Ingresa tu dominio: `tudominio.com`
4. Sigue las instrucciones para configurar DNS
5. ¡Listo! Tu app estará en tu dominio

---

## 🔧 Gestión de Variables de Entorno

### Ver/Editar Variables:

1. En tu proyecto → **Settings**
2. Sección **"Environment variables"**
3. Puedes agregar, editar o eliminar variables
4. Después de cambiar, haz un **"Redeploy"** para aplicar

### Agregar Nueva Variable:

1. Settings → Environment variables
2. Click **"Add variable"**
3. Completa nombre y valor
4. Selecciona environment (Production/Preview)
5. Click **"Save"**
6. **Redeploy** para aplicar

---

## 📊 Monitoreo y Logs

### Ver Logs de Build:

1. Ve a tu proyecto
2. Click en cualquier deployment
3. Verás los logs completos del build
4. Busca errores si algo falla

### Ver Analytics:

1. En tu proyecto → **Analytics**
2. Verás:
   - Requests por día
   - Bandwidth usado
   - Errores
   - Performance

---

## 🐛 Troubleshooting

### Build Falla

**Error común:** "bash: command not found"
- ✅ Ya está configurado para usar bun
- ✅ El comando debería ser: `bun run pages:build`

**Error:** "Module not found"
- Verifica que `package.json` tenga todas las dependencias
- Intenta hacer commit de `bun.lock`

### La App No Carga

1. **Verifica variables de entorno:**
   - Settings → Environment variables
   - Todas deben estar presentes
   - Sin espacios extra

2. **Revisa los logs:**
   - Click en el deployment
   - Busca errores en los logs

3. **Redeploy:**
   - Click en "Redeploy"
   - A veces soluciona problemas temporales

### Problemas de Autenticación

1. Verifica que `NEXT_PUBLIC_SUPABASE_URL` sea correcta
2. Verifica que `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea correcta
3. En Supabase, agrega tu dominio de Cloudflare a URLs permitidas:
   - Supabase Dashboard → Settings → Authentication
   - Site URL: `https://tu-proyecto.pages.dev`
   - Redirect URLs: agregar la misma

### Base de Datos No Conecta

1. Verifica `DIRECT_URL` en variables de entorno
2. Asegúrate de usar la URL **directa**, no la pooled
3. Verifica que tu base de datos permita conexiones externas

---

## 🔄 Rollback (Volver a Versión Anterior)

Si algo sale mal:

1. Ve a tu proyecto en Cloudflare
2. Mira la lista de **Deployments**
3. Encuentra el deployment que funcionaba
4. Click en **"..."** → **"Rollback to this deployment"**
5. Confirma

---

## 📝 Checklist Final

Antes de considerar completado:

- [ ] Repositorio conectado a Cloudflare
- [ ] Build configuration correcta
- [ ] Todas las variables de entorno agregadas
- [ ] Primer deployment exitoso
- [ ] Sitio accesible en `*.pages.dev`
- [ ] Login/signup funciona
- [ ] Base de datos conecta correctamente
- [ ] No hay errores en la consola del navegador

---

## 🎯 URLs Importantes

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Tu Proyecto:** https://dash.cloudflare.com → Workers & Pages → vitalia
- **Documentación Cloudflare:** https://developers.cloudflare.com/pages/
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## 💡 Tips

- **Preview Deployments:** Cada PR automáticamente crea un deployment de preview
- **Environment Branches:** Puedes configurar diferentes branches para diferentes ambientes
- **Build Cache:** Cloudflare cachea dependencias para builds más rápidos
- **CDN Global:** Tu app se sirve desde el CDN de Cloudflare automáticamente

---

¿Necesitas ayuda? Revisa los logs en Cloudflare Dashboard o la documentación oficial.

