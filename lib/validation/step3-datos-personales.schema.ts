/**
 * Step 3: Datos Personales del Solicitante
 *
 * Schema de validación para información personal del solicitante.
 *
 * Campos: 16 (11 requeridos, 5 opcionales)
 * - tipoDocumento (opcional, default: CC)
 * - cedula (required)
 * - primerApellido, segundoApellido (required, opcional)
 * - primerNombre, segundoNombre (required, opcional)
 * - fechaNacimiento (required, debe ser mayor de 18 años)
 * - ocupacion (required)
 * - nacionalidad (required, default: Colombiana)
 * - correo (required)
 * - telefonoFijo (opcional)
 * - celular (required)
 * - educacion (required)
 * - estadoCivil (required)
 * - genero (required)
 */

import { z } from 'zod'

/**
 * Enums para tipos de documento
 */
export const TIPOS_DOCUMENTO = {
  CC: 'CC',
  CE: 'CE',
  PP: 'PP',
  NIT: 'NIT',
} as const

export type TipoDocumento = typeof TIPOS_DOCUMENTO[keyof typeof TIPOS_DOCUMENTO]

/**
 * Enums para nivel educativo
 */
export const NIVELES_EDUCACION = {
  PRIMARIA: 'primaria',
  SECUNDARIA: 'secundaria',
  TECNICA: 'tecnica',
  UNIVERSIDAD: 'universidad',
  POSGRADO: 'posgrado',
} as const

export type NivelEducacion = typeof NIVELES_EDUCACION[keyof typeof NIVELES_EDUCACION]

/**
 * Enums para estado civil
 */
export const ESTADOS_CIVILES = {
  SOLTERO: 'soltero',
  CASADO: 'casado',
  UNION_LIBRE: 'union_libre',
  DIVORCIADO: 'divorciado',
  VIUDO: 'viudo',
} as const

export type EstadoCivil = typeof ESTADOS_CIVILES[keyof typeof ESTADOS_CIVILES]

/**
 * Enums para género
 */
export const GENEROS = {
  MASCULINO: 'masculino',
  FEMENINO: 'femenino',
  OTRO: 'otro',
} as const

export type Genero = typeof GENEROS[keyof typeof GENEROS]

/**
 * Schema Zod para Step 3: Datos Personales
 */
export const step3DatosPersonalesSchema = z.object({
  tipoDocumento: z.enum(['CC', 'CE', 'PP', 'NIT']).default('CC').optional(),

  cedula: z
    .string()
    .min(6, 'La cédula debe tener mínimo 6 dígitos')
    .max(10, 'La cédula debe tener máximo 10 dígitos')
    .regex(/^[0-9]+$/, 'La cédula debe contener solo números'),

  primerApellido: z
    .string()
    .min(2, 'El primer apellido debe tener mínimo 2 caracteres')
    .max(50, 'El primer apellido debe tener máximo 50 caracteres'),

  segundoApellido: z
    .string()
    .min(2, 'El segundo apellido debe tener mínimo 2 caracteres')
    .max(50, 'El segundo apellido debe tener máximo 50 caracteres')
    .optional(),

  primerNombre: z
    .string()
    .min(2, 'El primer nombre debe tener mínimo 2 caracteres')
    .max(50, 'El primer nombre debe tener máximo 50 caracteres'),

  segundoNombre: z
    .string()
    .min(2, 'El segundo nombre debe tener mínimo 2 caracteres')
    .max(50, 'El segundo nombre debe tener máximo 50 caracteres')
    .optional(),

  fechaNacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18
      }
      return age >= 18
    }, 'Debe ser mayor de 18 años'),

  ocupacion: z
    .string()
    .min(3, 'La ocupación debe tener mínimo 3 caracteres')
    .max(100, 'La ocupación debe tener máximo 100 caracteres'),

  nacionalidad: z.string().default('Colombiana'),

  correo: z
    .string()
    .email('Formato de correo electrónico inválido')
    .min(5, 'El correo debe tener mínimo 5 caracteres'),

  telefonoFijo: z
    .string()
    .regex(/^[0-9]{7,10}$/, 'El teléfono fijo debe tener entre 7 y 10 dígitos')
    .or(z.literal(''))
    .optional(),

  celular: z
    .string()
    .regex(/^3[0-9]{9}$/, 'El celular debe ser un número colombiano válido (10 dígitos empezando con 3)'),

  educacion: z.enum(['primaria', 'secundaria', 'tecnica', 'universidad', 'posgrado'], {
    required_error: 'Debe seleccionar un nivel educativo',
  }),

  estadoCivil: z.enum(['soltero', 'casado', 'union_libre', 'divorciado', 'viudo'], {
    required_error: 'Debe seleccionar un estado civil',
  }),

  genero: z.enum(['masculino', 'femenino', 'otro'], {
    required_error: 'Debe seleccionar un género',
  }),
})

/**
 * TypeScript type inferido del schema
 */
export type Step3DatosPersonalesData = z.infer<typeof step3DatosPersonalesSchema>

/**
 * Helper: Obtiene el nombre legible del tipo de documento
 */
export function getNombreTipoDocumento(tipo: TipoDocumento): string {
  const nombres: Record<TipoDocumento, string> = {
    CC: 'Cédula de Ciudadanía',
    CE: 'Cédula de Extranjería',
    PP: 'Pasaporte',
    NIT: 'NIT',
  }
  return nombres[tipo]
}

/**
 * Helper: Obtiene el nombre legible del nivel educativo
 */
export function getNombreEducacion(nivel: NivelEducacion): string {
  const nombres: Record<NivelEducacion, string> = {
    primaria: 'Primaria',
    secundaria: 'Secundaria',
    tecnica: 'Técnica/Tecnológica',
    universidad: 'Universidad',
    posgrado: 'Posgrado',
  }
  return nombres[nivel]
}

/**
 * Helper: Obtiene el nombre legible del estado civil
 */
export function getNombreEstadoCivil(estado: EstadoCivil): string {
  const nombres: Record<EstadoCivil, string> = {
    soltero: 'Soltero/a',
    casado: 'Casado/a',
    union_libre: 'Unión Libre',
    divorciado: 'Divorciado/a',
    viudo: 'Viudo/a',
  }
  return nombres[estado]
}

/**
 * Helper: Obtiene el nombre legible del género
 */
export function getNombreGenero(genero: Genero): string {
  const nombres: Record<Genero, string> = {
    masculino: 'Masculino',
    femenino: 'Femenino',
    otro: 'Otro',
  }
  return nombres[genero]
}

/**
 * Helper: Calcula la edad a partir de la fecha de nacimiento
 */
export function calcularEdad(fechaNacimiento: string): number {
  const birthDate = new Date(fechaNacimiento)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

/**
 * Helper: Formatea el número de celular (3001234567 → 300 123 4567)
 */
export function formatearCelular(celular: string): string {
  if (celular.length !== 10) return celular
  return `${celular.slice(0, 3)} ${celular.slice(3, 6)} ${celular.slice(6)}`
}

/**
 * Helper: Valida si un celular es de un operador específico
 */
export function getOperadorCelular(celular: string): string {
  if (!celular || celular.length !== 10) return 'Desconocido'

  const prefix = celular.slice(0, 3)

  const operadores: Record<string, string> = {
    '300': 'Tigo',
    '301': 'Tigo',
    '302': 'Movistar',
    '303': 'Tigo',
    '304': 'Movistar',
    '305': 'Movistar',
    '310': 'Tigo',
    '311': 'Tigo',
    '312': 'Movistar',
    '313': 'Movistar',
    '314': 'Claro',
    '315': 'Movistar',
    '316': 'Movistar',
    '317': 'Movistar',
    '318': 'Tigo',
    '319': 'Tigo',
    '320': 'Tigo',
    '321': 'Claro',
    '322': 'Movistar',
    '323': 'Movistar',
    '324': 'WOM',
    '350': 'Avantel',
    '351': 'Avantel',
  }

  return operadores[prefix] || 'Otro operador'
}
