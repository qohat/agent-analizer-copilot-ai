import {
  step4DomicilioSchema,
  getNombreTipoVivienda,
} from '@/lib/validation/step4-domicilio.schema'

describe('Step 4: Domicilio Schema', () => {
  it('should validate complete address data', () => {
    const data = {
      departamento: 'Antioquia',
      municipio: 'Medellín',
      direccion: 'Calle 10 # 20-30',
      barrioVereda: 'El Poblado',
      tipoVivienda: 'propia' as const,
    }

    expect(step4DomicilioSchema.safeParse(data).success).toBe(true)
  })

  it('should require owner and rent when arrendada', () => {
    const data = {
      departamento: 'Antioquia',
      municipio: 'Medellín',
      direccion: 'Calle 10 # 20-30',
      barrioVereda: 'El Poblado',
      tipoVivienda: 'arrendada' as const,
      nombrePropietario: 'Juan Pérez',
      valorArrendado: 500000,
    }

    expect(step4DomicilioSchema.safeParse(data).success).toBe(true)
  })

  it('should reject arrendada without owner', () => {
    const data = {
      departamento: 'Antioquia',
      municipio: 'Medellín',
      direccion: 'Calle 10 # 20-30',
      barrioVereda: 'El Poblado',
      tipoVivienda: 'arrendada' as const,
    }

    const result = step4DomicilioSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should reject short direccion', () => {
    const data = {
      departamento: 'Antioquia',
      municipio: 'Medellín',
      direccion: 'Calle 1',
      barrioVereda: 'Centro',
    }

    const result = step4DomicilioSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should get correct vivienda names', () => {
    expect(getNombreTipoVivienda('propia')).toBe('Vivienda Propia')
    expect(getNombreTipoVivienda('arrendada')).toBe('Arrendada')
  })
})
