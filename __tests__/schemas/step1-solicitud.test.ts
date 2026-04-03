/**
 * Tests for Step 1: Datos de la Solicitud
 *
 * Schema JSON: step1_datos_solicitud
 * - valorSolicitado (required)
 * - numeroCuotas (required)
 * - frecuencia (required)
 * - destino (required)
 * - diaPagoCuota (optional)
 */

import { z } from 'zod'

// Schema basado en JSON Schema: solicitud-credito.schema.json > step1_datos_solicitud
export const step1SolicitudSchema = z.object({
  // Valor solicitado en pesos colombianos
  valorSolicitado: z.number()
    .min(500000, 'El valor mínimo es $500,000')
    .max(50000000, 'El valor máximo es $50,000,000'),

  // Número de cuotas
  numeroCuotas: z.number()
    .int('Debe ser un número entero')
    .min(3, 'Mínimo 3 cuotas')
    .max(60, 'Máximo 60 cuotas'),

  // Frecuencia de pago
  frecuencia: z.enum(['mensual', 'quincenal', 'semanal'], {
    errorMap: () => ({ message: 'Frecuencia inválida' })
  }),

  // Destino del crédito
  destino: z.string()
    .min(10, 'Describa el destino del crédito (mínimo 10 caracteres)')
    .max(200, 'Máximo 200 caracteres'),

  // Día de pago de la cuota (opcional)
  diaPagoCuota: z.number()
    .int()
    .min(1, 'Día inválido')
    .max(30, 'Día inválido')
    .optional()
})

export type Step1SolicitudInput = z.infer<typeof step1SolicitudSchema>

describe('Step 1: Datos de la Solicitud - Schema Validation', () => {
  describe('✅ Valid inputs', () => {
    it('should validate valid application data (minimum)', () => {
      const validData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo para compra de inventario'
      }

      const result = step1SolicitudSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.valorSolicitado).toBe(5000000)
        expect(result.data.numeroCuotas).toBe(12)
        expect(result.data.frecuencia).toBe('mensual')
      }
    })

    it('should validate valid application data (with optional fields)', () => {
      const validData = {
        valorSolicitado: 15000000,
        numeroCuotas: 24,
        frecuencia: 'quincenal' as const,
        destino: 'Compra de equipos agrícolas para la finca',
        diaPagoCuota: 15
      }

      const result = step1SolicitudSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.diaPagoCuota).toBe(15)
      }
    })

    it('should validate minimum amount', () => {
      const validData = {
        valorSolicitado: 500000, // Minimum
        numeroCuotas: 3,
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo'
      }

      const result = step1SolicitudSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate maximum amount', () => {
      const validData = {
        valorSolicitado: 50000000, // Maximum
        numeroCuotas: 60,
        frecuencia: 'mensual' as const,
        destino: 'Expansión del negocio'
      }

      const result = step1SolicitudSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate all payment frequencies', () => {
      const frequencies = ['mensual', 'quincenal', 'semanal'] as const

      frequencies.forEach(freq => {
        const validData = {
          valorSolicitado: 5000000,
          numeroCuotas: 12,
          frecuencia: freq,
          destino: 'Capital de trabajo'
        }

        const result = step1SolicitudSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('❌ Invalid inputs', () => {
    it('should reject amount below minimum', () => {
      const invalidData = {
        valorSolicitado: 400000, // Below minimum
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo'
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mínimo')
      }
    })

    it('should reject amount above maximum', () => {
      const invalidData = {
        valorSolicitado: 60000000, // Above maximum
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo'
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('máximo')
      }
    })

    it('should reject invalid numeroCuotas (below minimum)', () => {
      const invalidData = {
        valorSolicitado: 5000000,
        numeroCuotas: 2, // Below minimum
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo'
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Mínimo 3')
      }
    })

    it('should reject invalid numeroCuotas (above maximum)', () => {
      const invalidData = {
        valorSolicitado: 5000000,
        numeroCuotas: 70, // Above maximum
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo'
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Máximo 60')
      }
    })

    it('should reject invalid numeroCuotas (decimal)', () => {
      const invalidData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12.5, // Must be integer
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo'
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid frecuencia', () => {
      const invalidData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'anual' as any, // Invalid value
        destino: 'Capital de trabajo'
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('inválida')
      }
    })

    it('should reject destino too short', () => {
      const invalidData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'Corto' // Too short
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mínimo 10')
      }
    })

    it('should reject destino too long', () => {
      const invalidData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'a'.repeat(201) // Too long
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Máximo 200')
      }
    })

    it('should reject invalid diaPagoCuota (below 1)', () => {
      const invalidData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo',
        diaPagoCuota: 0 // Invalid
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid diaPagoCuota (above 30)', () => {
      const invalidData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo',
        diaPagoCuota: 31 // Invalid
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        valorSolicitado: 5000000
        // Missing: numeroCuotas, frecuencia, destino
      }

      const result = step1SolicitudSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1)
      }
    })
  })

  describe('🔢 Edge cases', () => {
    it('should handle minimum payment day', () => {
      const validData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo',
        diaPagoCuota: 1 // First day of month
      }

      const result = step1SolicitudSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle maximum payment day', () => {
      const validData = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'mensual' as const,
        destino: 'Capital de trabajo',
        diaPagoCuota: 30 // Last valid day
      }

      const result = step1SolicitudSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle minimum cuotas with maximum amount', () => {
      const validData = {
        valorSolicitado: 50000000, // Max amount
        numeroCuotas: 3, // Min cuotas
        frecuencia: 'mensual' as const,
        destino: 'Expansión de infraestructura'
      }

      const result = step1SolicitudSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle semanal frequency', () => {
      const validData = {
        valorSolicitado: 1000000,
        numeroCuotas: 12,
        frecuencia: 'semanal' as const,
        destino: 'Capital de trabajo para negocio pequeño'
      }

      const result = step1SolicitudSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('📊 Type inference', () => {
    it('should infer correct TypeScript types', () => {
      const data: Step1SolicitudInput = {
        valorSolicitado: 5000000,
        numeroCuotas: 12,
        frecuencia: 'mensual',
        destino: 'Capital de trabajo'
      }

      // Type check - should compile without errors
      expect(data.valorSolicitado).toBe(5000000)
      expect(data.numeroCuotas).toBe(12)
      expect(data.frecuencia).toBe('mensual')
      expect(data.destino).toBe('Capital de trabajo')
    })
  })
})
