/**
 * Step 4: Datos del Domicilio
 * Campos: 7 (4 requeridos, 3 opcionales condicionales)
 */

import { z } from 'zod'

export const TIPOS_VIVIENDA = {
  PROPIA: 'propia',
  ARRENDADA: 'arrendada',
  FAMILIAR: 'familiar',
  OTRA: 'otra',
} as const

export type TipoVivienda = typeof TIPOS_VIVIENDA[keyof typeof TIPOS_VIVIENDA]

export const step4DomicilioSchema = z
  .object({
    departamento: z
      .string()
      .min(3, 'Seleccione un departamento')
      .max(50, 'Máximo 50 caracteres'),

    municipio: z
      .string()
      .min(3, 'Seleccione un municipio')
      .max(50, 'Máximo 50 caracteres'),

    direccion: z
      .string()
      .min(10, 'La dirección debe tener mínimo 10 caracteres')
      .max(200, 'La dirección debe tener máximo 200 caracteres'),

    barrioVereda: z
      .string()
      .min(3, 'El barrio/vereda debe tener mínimo 3 caracteres')
      .max(100, 'El barrio/vereda debe tener máximo 100 caracteres'),

    tipoVivienda: z.enum(['propia', 'arrendada', 'familiar', 'otra']).optional(),

    nombrePropietario: z.string().min(5, 'Mínimo 5 caracteres').max(100).or(z.literal('')).optional(),

    valorArrendado: z
      .coerce.number()
      .min(0, 'El valor debe ser positivo')
      .max(100000000, 'Valor máximo: $100.000.000')
      .or(z.nan())
      .optional(),
  })
  .refine(
    (data) => {
      if (data.tipoVivienda === 'arrendada') {
        return !!data.nombrePropietario && data.nombrePropietario.length >= 5 &&
               data.valorArrendado !== undefined && !isNaN(data.valorArrendado) && data.valorArrendado > 0
      }
      return true
    },
    {
      message: 'Si la vivienda es arrendada, debe indicar el propietario y el valor',
      path: ['nombrePropietario'],
    }
  )

export type Step4DomicilioData = z.infer<typeof step4DomicilioSchema>

export function getNombreTipoVivienda(tipo: TipoVivienda): string {
  const nombres: Record<TipoVivienda, string> = {
    propia: 'Vivienda Propia',
    arrendada: 'Arrendada',
    familiar: 'Familiar',
    otra: 'Otra',
  }
  return nombres[tipo]
}

export function formatearDireccion(direccion: string): string {
  return direccion.trim().toUpperCase()
}
