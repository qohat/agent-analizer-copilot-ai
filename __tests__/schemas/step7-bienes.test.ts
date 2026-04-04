import { step7BienesSchema } from '@/lib/validation/step6-11-schemas'

describe('Step 7: Bienes y Referencias Schema', () => {
  it('should validate with 2 complete references', () => {
    const data = {
      referencias: {
        familiar: {
          nombre: 'Juan Pérez',
          telefono: '3001234567',
          direccion: 'Calle 10 # 20-30',
        },
        comercial: {
          nombre: 'María García',
          telefono: '3007654321',
          direccion: 'Carrera 50 # 30-40',
        },
      },
    }
    expect(step7BienesSchema.safeParse(data).success).toBe(true)
  })

  it('should validate with all 3 references complete', () => {
    const data = {
      referencias: {
        familiar: {
          nombre: 'Juan Pérez',
          telefono: '3001234567',
          direccion: 'Calle 10 # 20-30',
        },
        comercial: {
          nombre: 'María García',
          telefono: '3007654321',
          direccion: 'Carrera 50 # 30-40',
        },
        personal: {
          nombre: 'Carlos López',
          telefono: '3009876543',
          direccion: 'Avenida 80 # 50-60',
        },
      },
    }
    expect(step7BienesSchema.safeParse(data).success).toBe(true)
  })

  it('should reject with only 1 complete reference', () => {
    const data = {
      referencias: {
        familiar: {
          nombre: 'Juan Pérez',
          telefono: '3001234567',
          direccion: 'Calle 10 # 20-30',
        },
      },
    }
    expect(step7BienesSchema.safeParse(data).success).toBe(false)
  })

  it('should reject with 0 references', () => {
    const data = {
      referencias: {},
    }
    expect(step7BienesSchema.safeParse(data).success).toBe(false)
  })

  it('should reject incomplete references (missing fields)', () => {
    const data = {
      referencias: {
        familiar: {
          nombre: 'Juan',
          telefono: '300', // Too short
          direccion: 'Calle', // Too short
        },
        comercial: {
          nombre: 'María García',
          telefono: '3007654321',
          direccion: 'Carrera 50 # 30-40',
        },
      },
    }
    expect(step7BienesSchema.safeParse(data).success).toBe(false)
  })

  it('should allow optional bienes raices and vehiculos', () => {
    const data = {
      referencias: {
        familiar: {
          nombre: 'Juan Pérez',
          telefono: '3001234567',
          direccion: 'Calle 10 # 20-30',
        },
        comercial: {
          nombre: 'María García',
          telefono: '3007654321',
          direccion: 'Carrera 50 # 30-40',
        },
      },
      bienesRaices: [],
      vehiculos: [],
    }
    expect(step7BienesSchema.safeParse(data).success).toBe(true)
  })
})
