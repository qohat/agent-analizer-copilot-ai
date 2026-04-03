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

  departamentoNegocio: z.string().min(3).max(50).optional(),
  municipioNegocio: z.string().min(3).max(50).optional(),
  direccionNegocio: z.string().min(10).max(200).optional(),
  barrioVeredaNegocio: z.string().max(100).optional(),

  numeroEmpleados: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo')
    .max(500, 'Máximo 500 empleados'),

  celularNegocio: z
    .string()
    .regex(/^3[0-9]{9}$/, 'Debe ser un celular colombiano válido (10 dígitos)'),

  anosOperacion: z
    .number()
    .min(0, 'No puede ser negativo')
    .max(100, 'Máximo 100 años'),

  telefonoFijoNegocio: z.string().regex(/^[0-9]{7,10}$/).optional(),
})

export type Step5NegocioData = z.infer<typeof step5NegocioSchema>
