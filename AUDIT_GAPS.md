# Auditoría: Gaps entre Schema JSON y FormSteps Actuales

**Fecha**: 2026-04-03
**Proyecto**: Agent Analizer Copilot - Formularios de Crédito

---

## 📊 Resumen Ejecutivo

| Métrica | Schema JSON | Implementado | Gap |
|---------|-------------|--------------|-----|
| **Total de campos** | 195 | ~85 | **~110 campos faltantes** |
| **Steps del formulario** | 11 | 11 | ✅ Completo |
| **Cobertura estimada** | 100% | ~44% | 56% por implementar |

---

## 🔍 Análisis por Step

### **Step 1: Datos de Solicitud**

#### Schema JSON (`step1_datos_solicitud`)
```json
{
  "valorSolicitado": number (requerido),
  "numeroCuotas": integer (requerido),
  "frecuencia": enum ["mensual", "quincenal", "semanal"] (requerido),
  "destino": string (requerido),
  "diaPagoCuota": integer (opcional)
}
```

#### Implementado en FormStep (actualmente distribuido)
- ✅ `requestedAmount` → Step 3 (debería estar en Step 1)
- ✅ `loanTermMonths` → Step 3 (debería estar en Step 1)
- ✅ `loanPurpose` → Step 3 (debería estar en Step 1)
- ❌ `frecuencia` → **FALTANTE**
- ❌ `diaPagoCuota` → **FALTANTE**

**Acción requerida**:
- Mover campos de solicitud de Step 3 a Step 1
- Agregar campo `paymentFrequency` (mensual/quincenal/semanal)
- Agregar campo `paymentDayOfMonth` (1-30)

---

### **Step 2: Tipo de Producto**

#### Schema JSON (`step2_tipo_producto`)
```json
{
  "tipoCredito": enum ["agropecuario", "comercial"] (requerido)
}
```

#### Implementado
- ✅ `productType` → Está en FormStep3, debería estar en Step dedicado

**Acción requerida**:
- Crear FormStep dedicado para selección de tipo de crédito
- Influye en formularios posteriores (comercial vs agropecuario)

---

### **Step 3: Datos Personales del Solicitante**

#### Schema JSON (`step3_datos_personales`)
```json
{
  "tipoDocumento": enum,
  "cedula": string (requerido),
  "primerApellido": string (requerido),
  "segundoApellido": string (opcional),
  "primerNombre": string (requerido),
  "segundoNombre": string (opcional),
  "fechaNacimiento": date (requerido),
  "ocupacion": string (requerido),
  "nacionalidad": string (requerido),
  "correo": email (requerido),
  "telefonoFijo": string (opcional),
  "celular": string (requerido),
  "educacion": enum (requerido),
  "estadoCivil": enum (requerido),
  "genero": enum (requerido)
}
```

#### Implementado en FormStep1
- ✅ `clientFirstName` (primerNombre)
- ✅ `clientLastName` (primerApellido)
- ✅ `clientIdType` (tipoDocumento)
- ✅ `clientIdNumber` (cedula)
- ✅ `clientDateOfBirth` (fechaNacimiento)
- ✅ `clientPhone` (celular)
- ✅ `clientEmail` (correo)
- ✅ `clientGender` (genero)
- ✅ `clientEducationLevel` (educacion)
- ✅ `clientEmploymentStatus`
- ✅ `maritalStatus` (estadoCivil)
- ❌ `segundoApellido` → **FALTANTE**
- ❌ `segundoNombre` → **FALTANTE**
- ❌ `ocupacion` → **FALTANTE** (solo hay employmentStatus, no ocupación específica)
- ❌ `nacionalidad` → **FALTANTE**
- ❌ `telefonoFijo` → **FALTANTE**

**Acción requerida**:
- Agregar campos `clientSecondName`, `clientSecondLastName`
- Agregar `clientOccupation` (string libre, ej: "Agricultor", "Comerciante")
- Agregar `clientNationality` (default: "Colombiana")
- Agregar `clientLandlinePhone` (opcional)

---

### **Step 4: Domicilio**

#### Schema JSON (`step4_domicilio`)
```json
{
  "departamento": string (requerido),
  "municipio": string (requerido),
  "direccion": string (requerido),
  "barrioVereda": string (requerido),
  "tipoVivienda": enum (opcional),
  "nombrePropietario": string (condicional),
  "valorArrendado": number (condicional)
}
```

#### Implementado en FormStep1
- ✅ `addressStreet` (direccion)
- ✅ `addressCity` (municipio)
- ✅ `addressDepartment` (departamento)
- ✅ `addressPostalCode` (no en schema, pero útil)
- ✅ `residenceType` (tipoVivienda)
- ✅ `landlordName` (nombrePropietario, condicional)
- ✅ `rentAmount` (valorArrendado, condicional)
- ✅ `residenceYears`
- ❌ `barrioVereda` → **FALTANTE**

**Acción requerida**:
- Agregar campo `addressNeighborhood` (barrio o vereda)

---

### **Step 5: Datos del Negocio**

#### Schema JSON (`step5_negocio`)
```json
{
  "actividadEconomica": string (requerido),
  "direccionIgualCasa": boolean,
  "departamentoNegocio": string (opcional),
  "municipioNegocio": string (opcional),
  "direccionNegocio": string (opcional),
  "barrioVeredaNegocio": string (opcional),
  "numeroEmpleados": integer (requerido),
  "celularNegocio": string (requerido),
  "anosOperacion": number (requerido),
  "telefonoFijoNegocio": string (opcional),
  "localArrendado": boolean (opcional),
  "nombrePropietarioLocal": string (condicional),
  "valorArriendoLocal": number (condicional)
}
```

#### Implementado en FormStep3
- ✅ `businessName`
- ✅ `businessDescription`
- ✅ `businessSameAddress` (direccionIgualCasa)
- ✅ `businessAddressStreet` (direccionNegocio)
- ✅ `businessAddressCity` (municipioNegocio)
- ✅ `businessAddressDepartment` (departamentoNegocio)
- ✅ `businessEmployeesCount` (numeroEmpleados)
- ✅ `businessPhone` (celularNegocio)
- ✅ `businessYearsOperating` (anosOperacion)
- ✅ `businessLocationType` (localArrendado)
- ✅ `businessLandlordName` (nombrePropietarioLocal)
- ✅ `businessRentAmount` (valorArriendoLocal)
- ❌ `businessAddressNeighborhood` → **FALTANTE** (hay campo pero no mapea a barrioVeredaNegocio)
- ❌ `telefonoFijoNegocio` → **FALTANTE**
- ❌ `actividadEconomica` → ✅ Parcialmente cubierto por `businessDescription`, pero debería ser campo separado

**Acción requerida**:
- Separar `businessEconomicActivity` de `businessDescription`
- Agregar `businessLandlinePhone`
- Asegurar que `businessAddressNeighborhood` mapee correctamente

---

### **Step 6: Cónyuge**

#### Schema JSON (`step6_conyuge`)
```json
{
  "conyugeFirma": boolean,
  "tipoDocumento": enum,
  "identificacion": string,
  "primerApellido": string,
  "segundoApellido": string,
  "primerNombre": string,
  "segundoNombre": string,
  "fechaNacimiento": date,
  "ocupacion": string,
  "nacionalidad": string,
  "telefonoFijo": string,
  "celular": string,
  "genero": enum,
  "fechaExpedicion": date,
  "lugarExpedicion": string
}
```

#### Implementado en FormStep2
- ✅ `hasSpouse` (conyugeFirma)
- ✅ `spouseFirstName`
- ✅ `spouseLastName`
- ✅ `spouseIdType`
- ✅ `spouseIdNumber`
- ✅ `spousePhone`
- ✅ `spouseEmail`
- ✅ `spouseDateOfBirth`
- ✅ `spouseIdIssuedCity` (lugarExpedicion)
- ✅ `spouseIdIssuedDate` (fechaExpedicion)
- ❌ `spouseSecondName` → **FALTANTE**
- ❌ `spouseSecondLastName` → **FALTANTE**
- ❌ `spouseOccupation` → **FALTANTE**
- ❌ `spouseNationality` → **FALTANTE**
- ❌ `spouseLandlinePhone` → **FALTANTE**
- ❌ `spouseGender` → **FALTANTE**

**Acción requerida**:
- Agregar campos completos del cónyuge (segundo nombre/apellido, ocupación, nacionalidad, teléfono fijo, género)

---

### **Step 7: Bienes y Referencias**

#### Schema JSON (`step7_bienes_referencias`)
```json
{
  "bienesRaices": [
    {
      "tipoInmueble": enum,
      "numeroDocumento": string,
      "fechaDocumento": date,
      "avaluoComercial": number,
      "ciudad": string
    }
  ] (max 3),
  "vehiculos": [
    {
      "clase": enum,
      "modelo": integer,
      "placa": string,
      "valorComercial": number
    }
  ] (max 2),
  "referencias": {
    "familiar": { nombre, telefono, direccion },
    "comercial": { nombre, telefono, direccion },
    "personal": { nombre, telefono, direccion }
  }
}
```

#### Implementado en FormStep4
- ✅ Referencias (3x: `reference1Name`, `reference1Phone`, `reference1Address`, etc.)
- ❌ **Bienes raíces completos** → **FALTANTE** (solo hay collateral básico)
- ❌ **Vehículos** → **FALTANTE**
- ❌ **Referencias tipificadas** (familiar/comercial/personal) → Implementado genérico

**Acción requerida**:
- Crear sección completa de bienes raíces (hasta 3 propiedades)
- Crear sección de vehículos (hasta 2 vehículos)
- Cambiar referencias a formato específico (familiar, comercial, personal) según schema

---

### **Step 8: Balance General**

#### Schema JSON (`step8_balance`)
```json
{
  "activos": {
    "corrientes": {
      "caja": { negocio, familiar },
      "bancosAhorrosCDT": { negocio, familiar },
      "cuentasPorCobrar": { negocio, familiar },
      "inventarios": { negocio, familiar }
    },
    "fijos": {
      "maquinariaEquipo": { negocio, familiar },
      "edificiosTerrenos": { negocio, familiar },
      "vehiculos": { negocio, familiar },
      "semovientes": { negocio, familiar },
      "otrosActivos": { negocio, familiar }
    }
  },
  "pasivos": {
    "corriente": {
      "proveedores": { negocio, familiar },
      "obligacionesCortoPlazo": { negocio, familiar }
    },
    "largoPlazo": {
      "obligacionesLargoPlazo": { negocio, familiar }
    }
  },
  "calculated": {
    "totalActivosCorrientes",
    "totalActivosFijos",
    "totalActivos",
    "totalPasivoCorriente",
    "totalPasivoLargoPlazo",
    "totalPasivos",
    "patrimonio"
  }
}
```

#### Implementado en FormStep4 (parcial)
- ✅ `assetCash` → Debería ser `assetsCashBusiness + assetsCashFamily`
- ✅ `assetAccountsReceivable`
- ✅ `assetInventory`
- ✅ `assetBusinessValue`
- ✅ `assetMachinery`
- ✅ `assetVehicles`
- ✅ `assetOther`
- ✅ `liabilityShortTerm`
- ✅ `liabilitySuppliers`
- ✅ `liabilityLongTerm`
- ❌ **Separación negocio/familiar** → **FALTANTE**
- ❌ `bancosAhorrosCDT` → **FALTANTE**
- ❌ `semovientes` (ganado) → **FALTANTE**
- ❌ `edificiosTerrenos` → **FALTANTE** separado
- ❌ **Campos calculados** → **FALTANTE**

**Acción requerida**:
- Reestructurar Balance General para separar negocio/familiar en TODOS los rubros
- Agregar `bancosAhorrosCDT` (Bancos, Ahorros, CDT)
- Agregar `semovientes` (Ganado, animales de producción)
- Agregar `edificiosTerrenos` separado
- Implementar cálculos automáticos (totales, patrimonio)

---

### **Step 9: Ingresos y Gastos Mensuales**

#### Schema JSON (`step9_ingresos_gastos`)
```json
{
  "ingresos": {
    "ingresosMensualesTitular": number (requerido),
    "otrosIngresosTitular": number,
    "ingresosConyuge": number,
    "otrosIngresosConyuge": number
  },
  "gastos": {
    "alimentacion": number (requerido),
    "arrendamiento": number,
    "serviciosPublicos": number (requerido),
    "educacion": number,
    "transporte": number (requerido),
    "salud": number (requerido),
    "otros": number
  },
  "calculated": {
    "totalIngresosTitular",
    "totalIngresosConyuge",
    "totalIngresosFamiliares",
    "totalGastosFamiliares"
  }
}
```

#### Implementado en FormStep4
- ✅ `primaryIncomeMonthly` (ingresosMensualesTitular)
- ✅ `secondaryIncomeMonthly` (otrosIngresosTitular parcialmente)
- ✅ `spouseIncomeMonthly` (ingresosConyuge)
- ✅ `spouseOtherIncomeMonthly` (otrosIngresosConyuge)
- ✅ `householdExpensesMonthly` (agregado)
- ✅ `businessExpensesMonthly` (agregado)
- ✅ Gastos detallados: `expenseFood`, `expenseHousing`, `expenseUtilities`, etc.
- ❌ **Campos calculados** → Parcial (solo muestra en UI, no guarda)

**Acción requerida**:
- Guardar totales calculados en el formulario
- Asegurar que mapeo sea exacto con schema

---

### **Step 10: Capacidad de Pago**

#### Schema JSON (`step10_capacidad_pago`)
```json
{
  "utilidadMensual": number (calculated),
  "obligacionesFinancieras": number (input),
  "capacidadPago": number (calculated),
  "ratioDeudaIngreso": number (calculated),
  "cuotaSolicitada": number (calculated),
  "alertas": {
    "capacidadInsuficiente": boolean,
    "ratioAlto": boolean
  }
}
```

#### Implementado
- ✅ Parcialmente implementado en FormStep4 y FormStep10
- ❌ **Campos calculados separados** → **FALTANTE**
- ❌ **Alertas automáticas** → **FALTANTE**

**Acción requerida**:
- Crear step dedicado con todos los cálculos
- Implementar alertas visuales (capacidad insuficiente, ratio alto)

---

### **Step 11: Resumen y Envío**

#### Schema JSON (`step11_resumen`)
```json
{
  "confirmacion": boolean (requerido),
  "fechaEnvio": datetime,
  "ipAddress": string
}
```

#### Implementado en FormStep11
- ✅ Resumen visual
- ❌ `confirmacion` checkbox → **FALTANTE**
- ❌ `fechaEnvio` automático → **FALTANTE**
- ❌ `ipAddress` → **FALTANTE**

**Acción requerida**:
- Agregar checkbox "Confirmo que la información es correcta"
- Capturar `fechaEnvio` al enviar
- Capturar `ipAddress` en backend

---

## 📋 Lista Completa de Campos Faltantes

### **Alta prioridad (críticos para validación)**

1. **Step 1 - Datos Solicitud**
   - `paymentFrequency` (frecuencia: mensual/quincenal/semanal)
   - `paymentDayOfMonth` (día de pago: 1-30)

2. **Step 3 - Datos Personales**
   - `clientSecondName`
   - `clientSecondLastName`
   - `clientOccupation` (ocupación específica)
   - `clientNationality`
   - `clientLandlinePhone`

3. **Step 4 - Domicilio**
   - `addressNeighborhood` (barrio/vereda)

4. **Step 5 - Negocio**
   - `businessEconomicActivity` (separado de descripción)
   - `businessLandlinePhone`

5. **Step 6 - Cónyuge**
   - `spouseSecondName`
   - `spouseSecondLastName`
   - `spouseOccupation`
   - `spouseNationality`
   - `spouseLandlinePhone`
   - `spouseGender`

6. **Step 7 - Bienes y Referencias**
   - Bienes raíces completos (3x propiedades con matrícula, avalúo, etc.)
   - Vehículos (2x vehículos con placa, modelo, valor)
   - Referencias tipificadas (familiar, comercial, personal)

7. **Step 8 - Balance General**
   - Separación negocio/familiar en TODOS los rubros
   - `bancosAhorrosCDT` (negocio + familiar)
   - `semovientes` (ganado, negocio + familiar)
   - `edificiosTerrenos` (separado, negocio + familiar)
   - Campos calculados (totales, patrimonio)

8. **Step 10 - Capacidad de Pago**
   - Campos calculados separados
   - Alertas automáticas

9. **Step 11 - Resumen**
   - Checkbox de confirmación
   - `fechaEnvio` automático
   - `ipAddress`

### **Media prioridad (mejoran calidad de datos)**

10. Campos adicionales específicos por tipo de crédito (comercial vs agropecuario)
11. Validaciones cruzadas entre steps
12. Campos condicionales bien implementados

---

## 🎯 Plan de Implementación Recomendado

### **Fase 1: Reorganizar steps (2-3 horas)**
1. Crear FormStep dedicado para `step1_datos_solicitud` (mover campos de Step3)
2. Crear FormStep dedicado para `step2_tipo_producto`
3. Reordenar steps para que sigan el schema JSON

### **Fase 2: Completar campos críticos (8-12 horas)**
4. Agregar campos faltantes en Steps 3-6 (datos personales, domicilio, negocio, cónyuge)
5. Reestructurar Step 8 (Balance General con negocio/familiar)
6. Completar Step 7 (Bienes raíces + vehículos)

### **Fase 3: Cálculos y validaciones (4-6 horas)**
7. Implementar campos calculados automáticos
8. Implementar alertas visuales
9. Agregar validaciones cruzadas

### **Fase 4: Testing (4-6 horas)**
10. Validar que todos los campos mapeen correctamente al schema JSON
11. Probar flujo completo (195 campos)
12. Verificar transformación raw → homologated

---

## ✅ Criterios de Completitud

Para considerar el formulario completo, debe cumplir:

- [ ] 195 campos del schema JSON implementados
- [ ] Todos los campos requeridos tienen validación
- [ ] Campos condicionales funcionan correctamente
- [ ] Separación negocio/familiar en Balance General
- [ ] Cálculos automáticos funcionan
- [ ] Alertas visuales implementadas
- [ ] Mapeo raw → homologated completo
- [ ] Tests E2E pasan

---

**Última actualización**: 2026-04-03
**Próximo paso**: Generar schemas Zod desde JSON Schema
