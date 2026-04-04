/**
 * Step 5: Datos del Negocio
 * Campos: 8 (4 requeridos, 4 opcionales)
 */

import { z } from 'zod'

export const step5NegocioSchema = z.object({
  actividadEconomica: z
    .string()
    .min(5, 'Mínimo 5 caracteres')
    .max(200, 'Máximo 200 caracteres'),

  direccionIgualCasa: z.boolean().default(false).optional(),

  departamentoNegocio: z.string().min(3, 'Mínimo 3 caracteres').max(50).or(z.literal('')).optional(),
  municipioNegocio: z.string().min(3, 'Mínimo 3 caracteres').max(50).or(z.literal('')).optional(),
  direccionNegocio: z.string().min(10, 'Mínimo 10 caracteres').max(200).or(z.literal('')).optional(),
  barrioVeredaNegocio: z.string().max(100).or(z.literal('')).optional(),

  numeroEmpleados: z
    .coerce.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo')
    .max(500, 'Máximo 500 empleados'),

  celularNegocio: z
    .string()
    .regex(/^3[0-9]{9}$/, 'Debe ser un celular colombiano válido (10 dígitos)'),

  anosOperacion: z
    .coerce.number()
    .min(0, 'No puede ser negativo')
    .max(100, 'Máximo 100 años'),

  telefonoFijoNegocio: z.string().regex(/^[0-9]{7,10}$/).or(z.literal('')).optional(),
}).refine(
  (data) => {
    // Si la dirección NO es igual a casa, los campos son requeridos
    if (!data.direccionIgualCasa) {
      return !!data.departamentoNegocio && data.departamentoNegocio.length >= 3 &&
             !!data.municipioNegocio && data.municipioNegocio.length >= 3 &&
             !!data.direccionNegocio && data.direccionNegocio.length >= 10
    }
    return true
  },
  {
    message: 'Complete la ubicación del negocio o marque que es igual a su domicilio',
    path: ['direccionNegocio'],
  }
)

export type Step5NegocioData = z.infer<typeof step5NegocioSchema>
