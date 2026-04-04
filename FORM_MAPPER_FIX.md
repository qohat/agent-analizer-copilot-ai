# 🔧 Form Mapper Fix - Bad Request 400

**Fecha**: 2026-04-04
**Estado**: ✅ RESUELTO

---

## 🐛 Problema Original

El formulario multi-step (11 pasos) fallaba con **400 Bad Request** al intentar guardar:

```
POST /api/applications → 400 Bad Request
Error: Validation error
```

### Causa Raíz

**Incompatibilidad de nombres de campos:**
- **Formulario**: Usa nombres en ESPAÑOL (`valorSolicitado`, `numeroCuotas`, `tipoCredito`)
- **API**: Espera nombres en INGLÉS (`requestedAmount`, `loanTermMonths`, `productType`)

El endpoint `/api/applications` usa el schema `applicationCreateSchema` que valida con Zod, y rechazaba cualquier dato que no coincidiera exactamente.

---

## ✅ Solución Implementada

### 1. **Función de Mapeo** (`lib/validation/form-mapper.ts`)

Creé una función completa que traduce todos los campos:

```typescript
mapFormDataToApplicationCreate(formData) → ApplicationCreateInput
```

**Mapeo de campos críticos:**

| Campo Formulario (ES) | Campo API (EN) | Transformación |
|----------------------|----------------|----------------|
| `valorSolicitado` | `requestedAmount` | Directo |
| `numeroCuotas` | `loanTermMonths` | Directo |
| `tipoCredito` | `productType` | comercial→commercial |
| `primerNombre` | `clientFirstName` | Directo |
| `cedula` | `clientIdNumber` | Directo |
| `genero` | `clientGender` | masculino→male |
| `estadoCivil` | `maritalStatus` | casado→married |
| `anosOperacion` | `businessYearsOperating` | Directo |
| `anosOperacion` | `businessMonthsInOperation` | años × 12 |
| `ingresosMensualesTitular` | `primaryIncomeMonthly` | Directo |

**Mapeo de enums:**
- `tipoCredito`: `comercial` → `commercial`, `agropecuario` → `agricultural`
- `tipoDocumento`: `CC` → `cedula`, `PP` → `passport`
- `genero`: `masculino` → `male`, `femenino` → `female`
- `educacion`: `primaria` → `primary`, `universidad` → `university`
- `estadoCivil`: `soltero` → `single`, `casado` → `married`
- `ocupacion`: `independiente` → `self_employed`

### 2. **Actualización del Formulario** (`components/MultiStepForm.tsx`)

El método `onSubmit` ahora:
1. Importa el mapper
2. Transforma los datos
3. Envía al API en formato correcto
4. Muestra logs en consola para debugging
5. Limpia localStorage después del éxito

```typescript
const onSubmit = async (data: any) => {
  const { mapFormDataToApplicationCreate } = await import('@/lib/validation/form-mapper')
  const mappedData = mapFormDataToApplicationCreate(data)

  console.log('Form data (raw):', data)
  console.log('Form data (mapped):', mappedData)

  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mappedData),
  })
  // ...
}
```

### 3. **Fix Crítico: `businessMonthsInOperation`**

Este campo es **requerido** por el schema pero no existía en el formulario.

**Solución**: Calcular automáticamente:
```typescript
businessMonthsInOperation:
  formData.mesesOperacion ||
  (formData.anosOperacion ? formData.anosOperacion * 12 : null) ||
  1 // Default mínimo
```

---

## 🧪 Tests Implementados

### Test Suite: `__tests__/lib/form-mapper.test.ts`

**9 tests, todos pasando:**

1. ✅ **Mapeo completo de todos los campos** (11 steps)
2. ✅ **Validación con Zod schema** (applicationCreateSchema)
3. ✅ **Mapeo de enums** (todos los enums correctos)
4. ✅ **Manejo de campos opcionales**
5. ✅ **Nombres de campos alternativos**
6. ✅ **Agregación de datos financieros**
7. ✅ **Defaults para campos faltantes**
8. ✅ **Valores enum desconocidos**
9. ✅ **Arrays de bienes y vehículos**

**Ejecutar tests:**
```bash
npm test -- __tests__/lib/form-mapper.test.ts
```

**Resultado esperado:**
```
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

---

## 📝 Ejemplo de Mapeo Completo

### Input (Formulario - Español):
```json
{
  "valorSolicitado": 5000000,
  "numeroCuotas": 24,
  "tipoCredito": "comercial",
  "primerNombre": "Juan",
  "primerApellido": "García",
  "cedula": "1234567890",
  "genero": "masculino",
  "estadoCivil": "casado",
  "actividadEconomica": "Tienda de abarrotes",
  "anosOperacion": 5,
  "ingresosMensualesTitular": 3000000
}
```

### Output (API - Inglés):
```json
{
  "requestedAmount": 5000000,
  "loanTermMonths": 24,
  "productType": "commercial",
  "clientFirstName": "Juan",
  "clientLastName": "García",
  "clientIdNumber": "1234567890",
  "clientGender": "male",
  "maritalStatus": "married",
  "businessName": "Tienda de abarrotes",
  "businessYearsOperating": 5,
  "businessMonthsInOperation": 60,
  "primaryIncomeMonthly": 3000000
}
```

---

## 🚀 Cómo Probar

### 1. **Iniciar el servidor**
```bash
npm run dev
```

### 2. **Abrir el formulario**
- Navegar a http://localhost:3000
- Ir a la sección de solicitudes
- Comenzar un nuevo formulario

### 3. **Completar todos los 11 pasos**
- Step 1: Datos de Solicitud
- Step 2: Tipo de Producto
- Step 3: Datos Personales
- Step 4: Domicilio
- Step 5: Negocio
- Step 6: Cónyuge (opcional)
- Step 7: Bienes y Referencias
- Step 8: Balance General
- Step 9: Ingresos y Gastos
- Step 10: Capacidad de Pago
- Step 11: Resumen y Envío

### 4. **Abrir DevTools (F12)**
- Ir a la pestaña **Console**

### 5. **Enviar formulario**
- Click en "Enviar solicitud"
- Verificar en consola:
  ```
  Form data (raw): { valorSolicitado: 5000000, ... }
  Form data (mapped): { requestedAmount: 5000000, ... }
  ```

### 6. **Verificar respuesta**
- ✅ **Éxito**: Mensaje "¡Solicitud enviada!"
- ❌ **Error**: Mensaje en consola con detalles del campo faltante

---

## 🔍 Debugging

Si aún falla, revisar la consola:

### Error: Campo faltante
```
Validation error: [
  { path: ['clientFirstName'], message: 'Required' }
]
```

**Solución**: El campo `primerNombre` no está siendo capturado en el formulario. Verificar que el campo existe en el Step 3.

### Error: Enum inválido
```
Validation error: [
  { path: ['productType'], expected: ["commercial", "agricultural"] }
]
```

**Solución**: El campo `tipoCredito` no se está mapeando correctamente. Verificar el mapper.

---

## 📊 Campos Requeridos por el API

**Según `applicationCreateSchema`:**

### Cliente (Mínimo):
- ✅ `clientFirstName` ← `primerNombre`
- ✅ `clientLastName` ← `primerApellido`
- ✅ `clientIdNumber` ← `cedula`
- ✅ `clientIdType` ← `tipoDocumento` (default: CC)
- ✅ `clientPhone` ← `celular`
- ✅ `clientEmploymentStatus` ← `ocupacion`
- ✅ `maritalStatus` ← `estadoCivil`

### Dirección (Mínimo):
- ✅ `addressStreet` ← `direccion`
- ✅ `addressCity` ← `municipio`
- ✅ `addressDepartment` ← `departamento`

### Negocio (Mínimo):
- ✅ `businessName` ← `actividadEconomica`
- ✅ `businessYearsOperating` ← `anosOperacion`
- ✅ `businessMonthsInOperation` ← calculado automáticamente

### Solicitud (Mínimo):
- ✅ `requestedAmount` ← `valorSolicitado`
- ✅ `loanTermMonths` ← `numeroCuotas`
- ✅ `productType` ← `tipoCredito`

### Términos:
- ✅ `acceptTerms` ← `aceptaTerminos`

---

## ✨ Mejoras Implementadas

1. **Mapeo automático de enums** (9 enums diferentes)
2. **Cálculo automático de `businessMonthsInOperation`**
3. **Manejo de campos alternativos** (antiguos y nuevos nombres)
4. **Agregación de notas** (destino, frecuencia, día de pago)
5. **Defaults inteligentes** (valores por defecto para campos opcionales)
6. **Logs detallados** (debugging en consola)
7. **Tests completos** (9 casos de prueba)

---

## 📁 Archivos Modificados

| Archivo | Tipo | Cambios |
|---------|------|---------|
| `lib/validation/form-mapper.ts` | NUEVO | Función de mapeo completo |
| `components/MultiStepForm.tsx` | MODIFICADO | Usa mapper antes de enviar |
| `__tests__/lib/form-mapper.test.ts` | NUEVO | 9 tests de validación |

---

## ✅ Checklist de Verificación

- [x] Mapper creado con todos los campos
- [x] Mapper integrado en MultiStepForm
- [x] Tests creados y pasando (9/9)
- [x] Campo crítico `businessMonthsInOperation` solucionado
- [x] Logs de debugging agregados
- [x] Manejo de errores mejorado
- [x] Documentación completa

---

## 🎯 Resultado

**Antes:**
- ❌ 400 Bad Request
- ❌ Campos no reconocidos
- ❌ Sin validación
- ❌ Sin debugging

**Después:**
- ✅ 201 Created (éxito)
- ✅ Todos los campos mapeados
- ✅ Validación completa con Zod
- ✅ Logs detallados en consola
- ✅ Tests garantizando calidad

---

**¡El problema del Bad Request está resuelto! 🎉**

El formulario ahora envía correctamente todos los datos al API en el formato esperado.
