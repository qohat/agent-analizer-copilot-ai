/**
 * Step 2: Tipo de Producto
 *
 * Schema de validación para la selección del tipo de crédito.
 * Este campo determina qué formularios de apoyo se requieren:
 * - Comercial → Análisis Comercial
 * - Agropecuario → Flujo de Caja + Análisis Agropecuario
 *
 * Campos: 1
 * - tipoCredito (required)
 */

import { z } from 'zod'

/**
 * Enum para tipos de crédito disponibles
 */
export const TIPOS_CREDITO = {
  COMERCIAL: 'comercial',
  AGROPECUARIO: 'agropecuario',
} as const

export type TipoCredito = typeof TIPOS_CREDITO[keyof typeof TIPOS_CREDITO]

/**
 * Schema Zod para Step 2: Tipo de Producto
 */
export const step2TipoProductoSchema = z.object({
  tipoCredito: z.enum(['comercial', 'agropecuario'], {
    required_error: 'Debe seleccionar el tipo de crédito',
    invalid_type_error: 'El tipo de crédito debe ser "comercial" o "agropecuario"',
  }),
})

/**
 * TypeScript type inferido del schema
 */
export type Step2TipoProductoData = z.infer<typeof step2TipoProductoSchema>

/**
 * Helper: Obtiene el nombre legible del tipo de crédito
 */
export function getNombreTipoCredito(tipo: TipoCredito): string {
  const nombres: Record<TipoCredito, string> = {
    comercial: 'Crédito Comercial',
    agropecuario: 'Crédito Agropecuario',
  }
  return nombres[tipo]
}

/**
 * Helper: Obtiene la descripción del tipo de crédito
 */
export function getDescripcionTipoCredito(tipo: TipoCredito): string {
  const descripciones: Record<TipoCredito, string> = {
    comercial:
      'Orientado a financiar actividades comerciales como compra de inventario, equipos, ampliación de negocio, capital de trabajo, etc.',
    agropecuario:
      'Orientado a financiar actividades agrícolas, ganaderas, piscícolas o forestales. Incluye compra de insumos, maquinaria agrícola, mejoramiento de tierras, etc.',
  }
  return descripciones[tipo]
}

/**
 * Helper: Obtiene los formularios de apoyo requeridos según el tipo
 */
export function getFormulariosRequeridos(tipo: TipoCredito): string[] {
  const formularios: Record<TipoCredito, string[]> = {
    comercial: ['Análisis Comercial'],
    agropecuario: ['Flujo de Caja Agropecuario', 'Análisis Agropecuario'],
  }
  return formularios[tipo]
}

/**
 * Helper: Valida si un string es un tipo de crédito válido
 */
export function esTipoCreditoValido(tipo: string): tipo is TipoCredito {
  return tipo === TIPOS_CREDITO.COMERCIAL || tipo === TIPOS_CREDITO.AGROPECUARIO
}
