/**
 * Steps 6-11: Schemas compactos
 * Agrupados para eficiencia
 */

import { z } from 'zod'

// Step 6: Cónyuge (condicional)
export const step6ConyugeSchema = z.object({
  conyugeFirma: z.boolean().optional(),
  tipoDocumento: z.enum(['CC', 'CE', 'PP']).or(z.literal('')).optional(),
  identificacion: z.string().regex(/^[0-9]{6,10}$/).or(z.literal('')).optional(),
  primerApellido: z.string().min(2).or(z.literal('')).optional(),
  segundoApellido: z.string().min(2).or(z.literal('')).optional(),
  primerNombre: z.string().min(2).or(z.literal('')).optional(),
  segundoNombre: z.string().min(2).or(z.literal('')).optional(),
  fechaNacimiento: z.string().or(z.literal('')).optional(), // format: date
  ocupacion: z.string().or(z.literal('')).optional(),
  nacionalidad: z.string().or(z.literal('')).optional(),
  telefonoFijo: z.string().regex(/^[0-9]{7,10}$/).or(z.literal('')).optional(),
  celular: z.string().regex(/^3[0-9]{9}$/).or(z.literal('')).optional(),
  genero: z.enum(['masculino', 'femenino', 'otro']).or(z.literal('')).optional(),
  fechaExpedicion: z.string().or(z.literal('')).optional(), // format: date
  lugarExpedicion: z.string().or(z.literal('')).optional(),
}).optional()

// Step 7: Bienes y Referencias
const referenciaSchema = z.object({
  nombre: z.string().min(5, 'Mínimo 5 caracteres').or(z.literal('')).optional(),
  telefono: z.string().min(7, 'Mínimo 7 caracteres').or(z.literal('')).optional(),
  direccion: z.string().min(10, 'Mínimo 10 caracteres').or(z.literal('')).optional(),
})

const bienRaizSchema = z.object({
  tipoInmueble: z.enum(['casa', 'apartamento', 'lote', 'finca']),
  numeroDocumento: z.string().or(z.literal('')).optional(), // Matrícula inmobiliaria
  fechaDocumento: z.string().or(z.literal('')).optional(), // format: date
  avaluoComercial: z.number().min(0),
  ciudad: z.string().or(z.literal('')).optional(),
})

const vehiculoSchema = z.object({
  clase: z.enum(['auto', 'moto', 'camion']),
  modelo: z.number().int().min(1980),
  placa: z.string().regex(/^[A-Z]{3}[0-9]{3}$/).or(z.literal('')).optional(),
  valorComercial: z.number().min(0),
})

export const step7BienesSchema = z.object({
  bienesRaices: z.array(bienRaizSchema).max(3).optional(),
  vehiculos: z.array(vehiculoSchema).max(2).optional(),
  referencias: z.object({
    familiar: referenciaSchema.optional(),
    comercial: referenciaSchema.optional(),
    personal: referenciaSchema.optional(),
  }),
}).refine(
  (data) => {
    // Contar cuántas referencias están completas
    const referencias = data.referencias || {}
    let referenciasCompletas = 0

    // Verificar cada tipo de referencia
    const tipos: ('familiar' | 'comercial' | 'personal')[] = ['familiar', 'comercial', 'personal']

    for (const tipo of tipos) {
      const ref = referencias[tipo]
      if (ref && ref.nombre && ref.nombre.length >= 5 &&
          ref.telefono && ref.telefono.length >= 7 &&
          ref.direccion && ref.direccion.length >= 10) {
        referenciasCompletas++
      }
    }

    // Requerir al menos 2 referencias completas
    return referenciasCompletas >= 2
  },
  {
    message: 'Debe proporcionar al menos 2 referencias completas (nombre, teléfono y dirección)',
    path: ['referencias'],
  }
)

// Step 8: Balance General
const montoSchema = z.object({
  negocio: z.number().min(0).default(0),
  familiar: z.number().min(0).default(0),
})

export const step8BalanceSchema = z.object({
  activos: z.object({
    corrientes: z.object({
      caja: montoSchema.optional(),
      bancosAhorrosCDT: montoSchema.optional(),
      cuentasPorCobrar: montoSchema.optional(),
      inventarios: montoSchema.optional(),
    }).optional(),
    fijos: z.object({
      maquinariaEquipo: montoSchema.optional(),
      edificiosTerrenos: montoSchema.optional(),
      vehiculos: montoSchema.optional(),
      semovientes: montoSchema.optional(), // Para sector agropecuario
      otrosActivos: montoSchema.optional(),
    }).optional(),
  }),
  pasivos: z.object({
    corriente: z.object({
      proveedores: montoSchema.optional(),
      obligacionesCortoPlazo: montoSchema.optional(),
    }).optional(),
    largoPlazo: z.object({
      obligacionesLargoPlazo: montoSchema.optional(),
    }).optional(),
  }),
  calculated: z.object({
    totalActivosCorrientes: z.number().optional(),
    totalActivosFijos: z.number().optional(),
    totalActivos: z.number().optional(),
    totalPasivoCorriente: z.number().optional(),
    totalPasivoLargoPlazo: z.number().optional(),
    totalPasivos: z.number().optional(),
    patrimonio: z.number().optional(), // = Total Activos - Total Pasivos
  }).optional(),
})

// Step 9: Ingresos y Gastos
export const step9IngresosGastosSchema = z.object({
  ingresos: z.object({
    ingresosMensualesTitular: z.number().min(0),
    otrosIngresosTitular: z.number().min(0).optional(),
    ingresosConyuge: z.number().min(0).optional(),
    otrosIngresosConyuge: z.number().min(0).optional(),
  }),
  gastos: z.object({
    alimentacion: z.number().min(0),
    arrendamiento: z.number().min(0).optional(),
    serviciosPublicos: z.number().min(0),
    educacion: z.number().min(0).optional(),
    transporte: z.number().min(0),
    salud: z.number().min(0),
    otros: z.number().min(0).optional(),
  }),
  calculated: z.object({
    totalIngresosTitular: z.number().optional(),
    totalIngresosConyuge: z.number().optional(),
    totalIngresosFamiliares: z.number().optional(),
    totalGastosFamiliares: z.number().optional(),
  }).optional(),
})

// Step 10: Capacidad de Pago
export const step10CapacidadPagoSchema = z.object({
  obligacionesFinancieras: z.number().min(0).default(0),
  utilidadMensual: z.number().optional(),
  capacidadPago: z.number().optional(),
  ratioDeudaIngreso: z.number().min(0).max(100).optional(),
  cuotaSolicitada: z.number().optional(),
  alertas: z.object({
    capacidadInsuficiente: z.boolean().optional(),
    ratioAlto: z.boolean().optional(),
  }).optional(),
})

// Step 11: Resumen
export const step11ResumenSchema = z.object({
  confirmacion: z.boolean().refine((val) => val === true, {
    message: 'Debe confirmar que la información es correcta',
  }),
})

// Types
export type Step6ConyugeData = z.infer<typeof step6ConyugeSchema>
export type Step7BienesData = z.infer<typeof step7BienesSchema>
export type Step8BalanceData = z.infer<typeof step8BalanceSchema>
export type Step9IngresosGastosData = z.infer<typeof step9IngresosGastosSchema>
export type Step10CapacidadPagoData = z.infer<typeof step10CapacidadPagoSchema>
export type Step11ResumenData = z.infer<typeof step11ResumenSchema>
