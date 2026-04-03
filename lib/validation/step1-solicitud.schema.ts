/**
 * Step 1: Datos de la Solicitud
 *
 * Schema based on JSON Schema: solicitud-credito.schema.json > step1_datos_solicitud
 *
 * Required fields:
 * - valorSolicitado
 * - numeroCuotas
 * - frecuencia
 * - destino
 *
 * Optional fields:
 * - diaPagoCuota
 */

import { z } from 'zod'

export const step1SolicitudSchema = z.object({
  // Valor solicitado en pesos colombianos
  valorSolicitado: z.number()
    .min(500000, 'El valor mínimo es $500,000')
    .max(50000000, 'El valor máximo es $50,000,000')
    .describe('Monto del crédito solicitado en COP'),

  // Número de cuotas
  numeroCuotas: z.number()
    .int('Debe ser un número entero')
    .min(3, 'Mínimo 3 cuotas')
    .max(60, 'Máximo 60 cuotas')
    .describe('Plazo del crédito en número de cuotas'),

  // Frecuencia de pago
  frecuencia: z.enum(['mensual', 'quincenal', 'semanal'], {
    errorMap: () => ({ message: 'Frecuencia inválida. Seleccione: mensual, quincenal o semanal' })
  }).describe('Periodicidad de pago de las cuotas'),

  // Destino del crédito
  destino: z.string()
    .min(10, 'Describa el destino del crédito (mínimo 10 caracteres)')
    .max(200, 'Máximo 200 caracteres')
    .describe('Propósito del crédito solicitado'),

  // Día de pago de la cuota (opcional)
  diaPagoCuota: z.number()
    .int()
    .min(1, 'El día debe estar entre 1 y 30')
    .max(30, 'El día debe estar entre 1 y 30')
    .optional()
    .describe('Día del mes preferido para pago de cuotas (1-30)')
})

export type Step1SolicitudInput = z.infer<typeof step1SolicitudSchema>

// Helper para formatear montos en pesos colombianos
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Helper para calcular cuota mensual estimada (tasa fija 2.5% mensual como ejemplo)
export function estimarCuotaMensual(
  monto: number,
  numeroCuotas: number,
  tasaMensual: number = 0.025
): number {
  if (numeroCuotas === 0) return 0

  // Fórmula de cuota fija: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const factor = Math.pow(1 + tasaMensual, numeroCuotas)
  const cuota = monto * tasaMensual * factor / (factor - 1)

  return Math.round(cuota)
}

// Helper para validar capacidad de pago mínima
export function validarCapacidadPago(
  cuotaEstimada: number,
  ingresoMensual: number
): { isValid: boolean; porcentajeIngreso: number; mensaje: string } {
  const porcentajeIngreso = (cuotaEstimada / ingresoMensual) * 100

  if (porcentajeIngreso > 50) {
    return {
      isValid: false,
      porcentajeIngreso,
      mensaje: `La cuota representa ${porcentajeIngreso.toFixed(1)}% del ingreso mensual. Se recomienda que no supere el 50%.`
    }
  }

  if (porcentajeIngreso > 40) {
    return {
      isValid: true,
      porcentajeIngreso,
      mensaje: `La cuota representa ${porcentajeIngreso.toFixed(1)}% del ingreso mensual. Está cerca del límite recomendado.`
    }
  }

  return {
    isValid: true,
    porcentajeIngreso,
    mensaje: `La cuota representa ${porcentajeIngreso.toFixed(1)}% del ingreso mensual. Está dentro del rango recomendado.`
  }
}
