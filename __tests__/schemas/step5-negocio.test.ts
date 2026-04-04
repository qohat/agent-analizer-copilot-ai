import { step5NegocioSchema } from '@/lib/validation/step5-negocio.schema'

describe('Step 5: Negocio Schema', () => {
  it('should validate complete business data', () => {
    const data = {
      actividadEconomica: 'Comercio de productos agrícolas',
      numeroEmpleados: 5,
      celularNegocio: '3001234567',
      anosOperacion: 3,
      direccionIgualCasa: true,
    }
    expect(step5NegocioSchema.safeParse(data).success).toBe(true)
  })

  it('should reject invalid celular', () => {
    const data = {
      actividadEconomica: 'Comercio',
      numeroEmpleados: 2,
      celularNegocio: '2001234567',
      anosOperacion: 1,
    }
    expect(step5NegocioSchema.safeParse(data).success).toBe(false)
  })

  it('should reject negative employees', () => {
    const data = {
      actividadEconomica: 'Comercio',
      numeroEmpleados: -1,
      celularNegocio: '3001234567',
      anosOperacion: 1,
      direccionIgualCasa: true,
    }
    expect(step5NegocioSchema.safeParse(data).success).toBe(false)
  })

  it('should validate when direccionIgualCasa is false and all address fields provided', () => {
    const data = {
      actividadEconomica: 'Comercio de productos agrícolas',
      numeroEmpleados: 5,
      celularNegocio: '3001234567',
      anosOperacion: 3,
      direccionIgualCasa: false,
      departamentoNegocio: 'Antioquia',
      municipioNegocio: 'Medellín',
      direccionNegocio: 'Calle 10 # 20-30',
    }
    expect(step5NegocioSchema.safeParse(data).success).toBe(true)
  })

  it('should reject when direccionIgualCasa is false and address fields missing', () => {
    const data = {
      actividadEconomica: 'Comercio de productos agrícolas',
      numeroEmpleados: 5,
      celularNegocio: '3001234567',
      anosOperacion: 3,
      direccionIgualCasa: false,
    }
    expect(step5NegocioSchema.safeParse(data).success).toBe(false)
  })
})
