/**
 * Tests for Step 3: Datos Personales Schema
 *
 * Tests cover:
 * - Valid inputs (complete data)
 * - Invalid inputs (per field)
 * - Edge cases (age validation, phone formats)
 * - Helper functions
 * - Type inference
 */

import {
  step3DatosPersonalesSchema,
  getNombreTipoDocumento,
  getNombreEducacion,
  getNombreEstadoCivil,
  getNombreGenero,
  calcularEdad,
  formatearCelular,
  getOperadorCelular,
  type Step3DatosPersonalesData,
} from '@/lib/validation/step3-datos-personales.schema'

describe('Step 3: Datos Personales Schema', () => {
  describe('✅ Valid inputs', () => {
    it('should validate complete personal data with all fields', () => {
      const data = {
        tipoDocumento: 'CC' as const,
        cedula: '1234567890',
        primerApellido: 'García',
        segundoApellido: 'López',
        primerNombre: 'Juan',
        segundoNombre: 'Carlos',
        fechaNacimiento: '1990-05-15',
        ocupacion: 'Comerciante',
        nacionalidad: 'Colombiana',
        correo: 'juan.garcia@example.com',
        telefonoFijo: '6012345678',
        celular: '3001234567',
        educacion: 'universidad' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.cedula).toBe('1234567890')
        expect(result.data.primerNombre).toBe('Juan')
      }
    })

    it('should validate with only required fields', () => {
      const data = {
        cedula: '123456',
        primerApellido: 'García',
        primerNombre: 'Juan',
        fechaNacimiento: '1995-01-01',
        ocupacion: 'Agricultor',
        nacionalidad: 'Colombiana',
        correo: 'test@example.com',
        celular: '3101234567',
        educacion: 'secundaria' as const,
        estadoCivil: 'casado' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate all document types', () => {
      const tipos = ['CC', 'CE', 'PP', 'NIT'] as const

      tipos.forEach((tipo) => {
        const data = {
          tipoDocumento: tipo,
          cedula: '1234567',
          primerApellido: 'Test',
          primerNombre: 'Test',
          fechaNacimiento: '1990-01-01',
          ocupacion: 'Test',
          nacionalidad: 'Colombiana',
          correo: 'test@test.com',
          celular: '3001234567',
          educacion: 'secundaria' as const,
          estadoCivil: 'soltero' as const,
          genero: 'masculino' as const,
        }

        expect(step3DatosPersonalesSchema.safeParse(data).success).toBe(true)
      })
    })

    it('should validate all education levels', () => {
      const niveles = ['primaria', 'secundaria', 'tecnica', 'universidad', 'posgrado'] as const

      niveles.forEach((nivel) => {
        const data = {
          cedula: '1234567',
          primerApellido: 'Test',
          primerNombre: 'Test',
          fechaNacimiento: '1990-01-01',
          ocupacion: 'Test',
          nacionalidad: 'Colombiana',
          correo: 'test@test.com',
          celular: '3001234567',
          educacion: nivel,
          estadoCivil: 'soltero' as const,
          genero: 'masculino' as const,
        }

        expect(step3DatosPersonalesSchema.safeParse(data).success).toBe(true)
      })
    })
  })

  describe('❌ Invalid inputs - cedula', () => {
    it('should reject cedula with less than 6 digits', () => {
      const data = {
        cedula: '12345',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento: '1990-01-01',
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'test@test.com',
        celular: '3001234567',
        educacion: 'secundaria' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mínimo 6')
      }
    })

    it('should reject cedula with more than 10 digits', () => {
      const data = {
        cedula: '12345678901',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento: '1990-01-01',
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'test@test.com',
        celular: '3001234567',
        educacion: 'secundaria' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject cedula with non-numeric characters', () => {
      const data = {
        cedula: '123ABC',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento: '1990-01-01',
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'test@test.com',
        celular: '3001234567',
        educacion: 'secundaria' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('solo números')
      }
    })
  })

  describe('❌ Invalid inputs - fechaNacimiento', () => {
    it('should reject age less than 18 years', () => {
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate())
      const fechaNacimiento = birthDate.toISOString().split('T')[0]

      const data = {
        cedula: '1234567',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento,
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'test@test.com',
        celular: '3001234567',
        educacion: 'secundaria' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mayor de 18')
      }
    })

    it('should reject invalid date format', () => {
      const data = {
        cedula: '1234567',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento: '15/05/1990',
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'test@test.com',
        celular: '3001234567',
        educacion: 'secundaria' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('❌ Invalid inputs - correo', () => {
    it('should reject invalid email format', () => {
      const data = {
        cedula: '1234567',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento: '1990-01-01',
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'not-an-email',
        celular: '3001234567',
        educacion: 'secundaria' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('correo')
      }
    })
  })

  describe('❌ Invalid inputs - celular', () => {
    it('should reject celular not starting with 3', () => {
      const data = {
        cedula: '1234567',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento: '1990-01-01',
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'test@test.com',
        celular: '2001234567',
        educacion: 'secundaria' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject celular with incorrect length', () => {
      const data = {
        cedula: '1234567',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento: '1990-01-01',
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'test@test.com',
        celular: '300123',
        educacion: 'secundaria' as const,
        estadoCivil: 'soltero' as const,
        genero: 'masculino' as const,
      }

      const result = step3DatosPersonalesSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('🔧 Helper functions', () => {
    describe('getNombreTipoDocumento', () => {
      it('should return correct names for document types', () => {
        expect(getNombreTipoDocumento('CC')).toBe('Cédula de Ciudadanía')
        expect(getNombreTipoDocumento('CE')).toBe('Cédula de Extranjería')
        expect(getNombreTipoDocumento('PP')).toBe('Pasaporte')
        expect(getNombreTipoDocumento('NIT')).toBe('NIT')
      })
    })

    describe('getNombreEducacion', () => {
      it('should return correct names for education levels', () => {
        expect(getNombreEducacion('primaria')).toBe('Primaria')
        expect(getNombreEducacion('secundaria')).toBe('Secundaria')
        expect(getNombreEducacion('tecnica')).toBe('Técnica/Tecnológica')
        expect(getNombreEducacion('universidad')).toBe('Universidad')
        expect(getNombreEducacion('posgrado')).toBe('Posgrado')
      })
    })

    describe('getNombreEstadoCivil', () => {
      it('should return correct names for marital status', () => {
        expect(getNombreEstadoCivil('soltero')).toBe('Soltero/a')
        expect(getNombreEstadoCivil('casado')).toBe('Casado/a')
        expect(getNombreEstadoCivil('union_libre')).toBe('Unión Libre')
        expect(getNombreEstadoCivil('divorciado')).toBe('Divorciado/a')
        expect(getNombreEstadoCivil('viudo')).toBe('Viudo/a')
      })
    })

    describe('getNombreGenero', () => {
      it('should return correct names for gender', () => {
        expect(getNombreGenero('masculino')).toBe('Masculino')
        expect(getNombreGenero('femenino')).toBe('Femenino')
        expect(getNombreGenero('otro')).toBe('Otro')
      })
    })

    describe('calcularEdad', () => {
      it('should calculate age correctly', () => {
        const today = new Date()
        const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate())
        const fechaNacimiento = birthDate.toISOString().split('T')[0]

        expect(calcularEdad(fechaNacimiento)).toBe(30)
      })

      it('should handle birthday not yet occurred this year', () => {
        const today = new Date()
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth() + 1, today.getDate())
        const fechaNacimiento = birthDate.toISOString().split('T')[0]

        expect(calcularEdad(fechaNacimiento)).toBe(24)
      })
    })

    describe('formatearCelular', () => {
      it('should format Colombian cellphone correctly', () => {
        expect(formatearCelular('3001234567')).toBe('300 123 4567')
        expect(formatearCelular('3151234567')).toBe('315 123 4567')
      })

      it('should return original if length is not 10', () => {
        expect(formatearCelular('300123')).toBe('300123')
      })
    })

    describe('getOperadorCelular', () => {
      it('should identify Tigo numbers', () => {
        expect(getOperadorCelular('3001234567')).toBe('Tigo')
        expect(getOperadorCelular('3101234567')).toBe('Tigo')
      })

      it('should identify Claro numbers', () => {
        expect(getOperadorCelular('3141234567')).toBe('Claro')
        expect(getOperadorCelular('3211234567')).toBe('Claro')
      })

      it('should identify Movistar numbers', () => {
        expect(getOperadorCelular('3021234567')).toBe('Movistar')
        expect(getOperadorCelular('3151234567')).toBe('Movistar')
      })

      it('should return "Desconocido" for invalid numbers', () => {
        expect(getOperadorCelular('12345')).toBe('Desconocido')
        expect(getOperadorCelular('')).toBe('Desconocido')
      })
    })
  })

  describe('🔍 Type inference', () => {
    it('should infer correct TypeScript types', () => {
      const data: Step3DatosPersonalesData = {
        cedula: '1234567',
        primerApellido: 'Test',
        primerNombre: 'Test',
        fechaNacimiento: '1990-01-01',
        ocupacion: 'Test',
        nacionalidad: 'Colombiana',
        correo: 'test@test.com',
        celular: '3001234567',
        educacion: 'secundaria',
        estadoCivil: 'soltero',
        genero: 'masculino',
      }

      expect(data.cedula).toBe('1234567')
    })
  })
})
