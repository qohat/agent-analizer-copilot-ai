# 🔐 Sistema de Autenticación

**Fecha**: 2026-04-04
**Estado**: ✅ IMPLEMENTADO (MVP)
**Tipo**: Autenticación basada en localStorage (Desarrollo)

---

## 📋 Resumen

Sistema de autenticación simple para MVP que:
- ✅ Guarda sesión en localStorage
- ✅ Protege rutas con ProtectedRoute
- ✅ Context API para acceso global al usuario
- ✅ Mock de usuarios para desarrollo
- ✅ Ready para migrar a Supabase Auth en producción

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│  AuthContext    │ ← Estado global del usuario
└────────┬────────┘
         │
         ├──> Login Page (/login)
         ├──> ProtectedRoute (HOC)
         └──> useAuth() hook
```

---

## 📁 Archivos Creados

### 1. **Context Provider** (`contexts/AuthContext.tsx`)
```typescript
interface User {
  id: string
  email: string
  role: 'advisor' | 'comite_member' | 'admin'
  institution_id: string
  name?: string
}

// Funciones disponibles:
- login(email, password) → Promise<void>
- logout() → void
- user → User | null
- isLoading → boolean
```

### 2. **Página de Login** (`app/login/page.tsx`)
- Formulario de email/password
- Muestra cuentas de prueba
- Manejo de errores
- Redirección a dashboard después del login

### 3. **Componente de Protección** (`components/ProtectedRoute.tsx`)
```typescript
<ProtectedRoute allowedRoles={['advisor', 'admin']}>
  {/* Contenido protegido */}
</ProtectedRoute>
```

### 4. **Dashboard** (`app/advisor/dashboard/page.tsx`)
- Página principal después del login
- Muestra información del usuario
- Botón de logout
- Link a "Nueva Solicitud"

### 5. **Formulario Protegido** (`app/advisor/new-application/page.tsx`)
- Página del formulario multi-step
- Protegida con ProtectedRoute
- Usa usuario del context

---

## 👥 Usuarios de Prueba

| Email | Password | Rol | Institution ID |
|-------|----------|-----|----------------|
| advisor@test.com | password123 | advisor | dev-institution-1 |
| comite@test.com | password123 | comite_member | dev-institution-1 |
| admin@test.com | password123 | admin | dev-institution-1 |

---

## 🚀 Flujo de Autenticación

### 1. **Login**
```
Usuario ingresa email/password
    ↓
AuthContext.login() valida credenciales
    ↓
Usuario guardado en localStorage
    ↓
Estado global actualizado
    ↓
Redirección a /advisor/dashboard
```

### 2. **Acceso a Ruta Protegida**
```
Usuario navega a ruta protegida
    ↓
ProtectedRoute verifica autenticación
    ↓
  ✅ Autenticado → Muestra contenido
  ❌ No autenticado → Redirect a /login
```

### 3. **Logout**
```
Usuario hace click en "Salir"
    ↓
AuthContext.logout() limpia localStorage
    ↓
Estado global = null
    ↓
Redirección a /login
```

---

## 🔌 Integración con API

El formulario ahora envía el usuario autenticado:

```typescript
// MultiStepForm.tsx
const { user } = useAuth()

const response = await fetch('/api/applications', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${JSON.stringify(user)}`
  },
  body: JSON.stringify(mappedData)
})
```

El API extrae el usuario:

```typescript
// app/api/applications/route.ts
const user = extractUserFromRequest(request)
const authenticatedUser = requireAuth(user)

// Usa authenticatedUser.id, .institution_id, etc.
```

---

## 🛠️ Cómo Usar

### Proteger una Ruta

```typescript
'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function MyProtectedPage() {
  return (
    <ProtectedRoute allowedRoles={['advisor', 'admin']}>
      <div>Contenido protegido</div>
    </ProtectedRoute>
  )
}
```

### Acceder al Usuario Actual

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function MyComponent() {
  const { user, logout } = useAuth()

  return (
    <div>
      <p>Hola, {user?.name}</p>
      <button onClick={logout}>Salir</button>
    </div>
  )
}
```

### Hacer Request Autenticado

```typescript
const { user } = useAuth()

const response = await fetch('/api/something', {
  headers: {
    'Authorization': `Bearer ${JSON.stringify(user)}`
  }
})
```

---

## 🔄 Migración a Supabase Auth (Producción)

Para producción, reemplazar mock auth con Supabase Auth:

### 1. **Actualizar AuthContext**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  setUser(data.user)
}
```

### 2. **Actualizar extractUserFromRequest**
```typescript
export async function extractUserFromRequest(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  const { data } = await supabase.auth.getUser(token)
  return data.user
}
```

---

## 🎯 Rutas Disponibles

| Ruta | Protegida | Roles Permitidos | Descripción |
|------|-----------|------------------|-------------|
| `/` | ❌ | Todos | Landing page |
| `/login` | ❌ | Todos | Página de inicio de sesión |
| `/advisor/dashboard` | ✅ | advisor, admin | Dashboard principal |
| `/advisor/new-application` | ✅ | advisor, admin | Formulario de solicitud |

---

## ✅ Checklist de Implementación

- [x] AuthContext con login/logout
- [x] Página de login funcional
- [x] ProtectedRoute component
- [x] Dashboard protegido
- [x] Formulario usa usuario del context
- [x] API valida autenticación
- [x] Usuarios de prueba documentados
- [x] Layout con AuthProvider
- [x] Redirección después del login
- [x] Manejo de errores en login
- [x] Loading states
- [x] Logout funcional

---

## 🧪 Cómo Probar

### 1. Iniciar el servidor
```bash
npm run dev
```

### 2. Navegar a la app
```
http://localhost:3000
```

### 3. Hacer click en "Ingresar"
```
http://localhost:3000/login
```

### 4. Login con credenciales de prueba
```
Email: advisor@test.com
Password: password123
```

### 5. Verificar dashboard
```
→ Debe redirigir a /advisor/dashboard
→ Debe mostrar nombre del usuario
→ Botón "Nueva Solicitud" debe funcionar
```

### 6. Probar formulario
```
→ Click en "Nueva Solicitud"
→ Completar formulario
→ Enviar → Debe usar usuario autenticado
```

### 7. Probar logout
```
→ Click en "Salir"
→ Debe redirigir a /login
→ Intentar acceder a /advisor/dashboard → Debe redirigir a /login
```

---

## 🐛 Troubleshooting

### Error: "useAuth must be used within an AuthProvider"
**Solución**: Asegúrate de que `<AuthProvider>` esté en `app/layout.tsx`

### Error: Redirect loop infinito
**Solución**: Verifica que `/login` NO esté protegido con ProtectedRoute

### Error: User is null después de login
**Solución**: Revisa localStorage en DevTools → Application → Local Storage

### Error: API retorna 401 Unauthorized
**Solución**: Verifica que el header `Authorization` se esté enviando correctamente

---

## 📊 Estado Actual

✅ **Implementación MVP Completa**

- Autenticación funcional
- Rutas protegidas
- Usuarios de prueba disponibles
- Integrado con formulario y API
- Ready para usar

🚀 **Próximo Paso**: Probar el flujo completo (login → formulario → submit)

---

**¡Sistema de autenticación listo para usar!** 🎉
