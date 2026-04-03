/**
 * Tests for Step 2: Tipo de Producto Schema
 *
 * Tests cover:
 * - Valid inputs (both credit types)
 * - Invalid inputs (wrong values, missing fields)
 * - Helper functions
 * - Type inference
 */

import {
  step2TipoProductoSchema,
  TIPOS_CREDITO,
  getNombreTipoCredito,
  getDescripcionTipoCredito,
  getFormulariosRequeridos,
  esTipoCreditoValido,
  type Step2TipoProductoData,
} from '@/lib/validation/step2-tipo-producto.schema'

describe('Step 2: Tipo de Producto Schema', () => {
  describe('✅ Valid inputs', () => {
    it('should validate comercial credit type', () => {
      const data = {
        tipoCredito: 'comercial' as const,
      }

      const result = step2TipoProductoSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.tipoCredito).toBe('comercial')
      }
    })

    it('should validate agropecuario credit type', () => {
      const data = {
        tipoCredito: 'agropecuario' as const,
      }

      const result = step2TipoProductoSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.tipoCredito).toBe('agropecuario')
      }
    })

    it('should validate using TIPOS_CREDITO constants', () => {
      const dataComercial = {
        tipoCredito: TIPOS_CREDITO.COMERCIAL,
      }
      const dataAgropecuario = {
        tipoCredito: TIPOS_CREDITO.AGROPECUARIO,
      }

      expect(step2TipoProductoSchema.safeParse(dataComercial).success).toBe(true)
      expect(step2TipoProductoSchema.safeParse(dataAgropecuario).success).toBe(true)
    })
  })

  describe('❌ Invalid inputs', () => {
    it('should reject invalid credit type', () => {
      const data = {
        tipoCredito: 'industrial',
      }

      const result = step2TipoProductoSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('comercial')
      }
    })

    it('should reject empty string', () => {
      const data = {
        tipoCredito: '',
      }

      const result = step2TipoProductoSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject numeric value', () => {
      const data = {
        tipoCredito: 1,
      }

      const result = step2TipoProductoSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject missing tipoCredito field', () => {
      const data = {}

      const result = step2TipoProductoSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('seleccionar')
      }
    })

    it('should reject null value', () => {
      const data = {
        tipoCredito: null,
      }

      const result = step2TipoProductoSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject undefined value', () => {
      const data = {
        tipoCredito: undefined,
      }

      const result = step2TipoProductoSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('🔧 Helper functions', () => {
    describe('getNombreTipoCredito', () => {
      it('should return correct name for comercial', () => {
        expect(getNombreTipoCredito('comercial')).toBe('Crédito Comercial')
      })

      it('should return correct name for agropecuario', () => {
        expect(getNombreTipoCredito('agropecuario')).toBe('Crédito Agropecuario')
      })
    })

    describe('getDescripcionTipoCredito', () => {
      it('should return description for comercial', () => {
        const desc = getDescripcionTipoCredito('comercial')
        expect(desc).toContain('comercial')
        expect(desc).toContain('inventario')
        expect(desc.length).toBeGreaterThan(50)
      })

      it('should return description for agropecuario', () => {
        const desc = getDescripcionTipoCredito('agropecuario')
        expect(desc).toContain('agrícola')
        expect(desc).toContain('insumos')
        expect(desc.length).toBeGreaterThan(50)
      })
    })

    describe('getFormulariosRequeridos', () => {
      it('should return correct forms for comercial', () => {
        const forms = getFormulariosRequeridos('comercial')
        expect(forms).toEqual(['Análisis Comercial'])
        expect(forms.length).toBe(1)
      })

      it('should return correct forms for agropecuario', () => {
        const forms = getFormulariosRequeridos('agropecuario')
        expect(forms).toEqual(['Flujo de Caja Agropecuario', 'Análisis Agropecuario'])
        expect(forms.length).toBe(2)
      })
    })

    describe('esTipoCreditoValido', () => {
      it('should return true for comercial', () => {
        expect(esTipoCreditoValido('comercial')).toBe(true)
      })

      it('should return true for agropecuario', () => {
        expect(esTipoCreditoValido('agropecuario')).toBe(true)
      })

      it('should return false for invalid type', () => {
        expect(esTipoCreditoValido('industrial')).toBe(false)
      })

      it('should return false for empty string', () => {
        expect(esTipoCreditoValido('')).toBe(false)
      })
    })
  })

  describe('🔍 Type inference', () => {
    it('should infer correct TypeScript types', () => {
      const data: Step2TipoProductoData = {
        tipoCredito: 'comercial',
      }

      // TypeScript compilation test - if this compiles, type inference works
      expect(data.tipoCredito).toBe('comercial')
    })

    it('should not allow invalid types at compile time', () => {
      // @ts-expect-error - Testing that invalid types are caught at compile time
      const invalidData: Step2TipoProductoData = {
        tipoCredito: 'invalid',
      }

      expect(invalidData).toBeDefined()
    })
  })

  describe('🎯 Integration scenarios', () => {
    it('should handle complete user flow - selecting comercial', () => {
      const userInput = 'comercial'

      // Validate user input
      expect(esTipoCreditoValido(userInput)).toBe(true)

      // Parse with schema
      const result = step2TipoProductoSchema.safeParse({ tipoCredito: userInput })
      expect(result.success).toBe(true)

      if (result.success) {
        const tipo = result.data.tipoCredito

        // Get display info
        expect(getNombreTipoCredito(tipo)).toBe('Crédito Comercial')

        // Get required forms
        const forms = getFormulariosRequeridos(tipo)
        expect(forms).toContain('Análisis Comercial')
      }
    })

    it('should handle complete user flow - selecting agropecuario', () => {
      const userInput = 'agropecuario'

      // Validate user input
      expect(esTipoCreditoValido(userInput)).toBe(true)

      // Parse with schema
      const result = step2TipoProductoSchema.safeParse({ tipoCredito: userInput })
      expect(result.success).toBe(true)

      if (result.success) {
        const tipo = result.data.tipoCredito

        // Get display info
        expect(getNombreTipoCredito(tipo)).toBe('Crédito Agropecuario')

        // Get required forms
        const forms = getFormulariosRequeridos(tipo)
        expect(forms.length).toBe(2)
        expect(forms).toContain('Flujo de Caja Agropecuario')
        expect(forms).toContain('Análisis Agropecuario')
      }
    })
  })
})
