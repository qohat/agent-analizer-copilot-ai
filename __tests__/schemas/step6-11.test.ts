/**
 * Tests for Steps 6-11 Schemas
 *
 * Validates all fields, required/optional, enums, regex, and ranges
 */

import {
  step6ConyugeSchema,
  step7BienesSchema,
  step8BalanceSchema,
  step9IngresosGastosSchema,
  step10CapacidadPagoSchema,
  step11ResumenSchema,
} from '@/lib/validation/step6-11-schemas'

describe('Step 6: Cónyuge Schema', () => {
  it('should accept valid minimal data', () => {
    const validData = {}
    const result = step6ConyugeSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should accept complete cónyuge data', () => {
    const validData = {
      conyugeFirma: true,
      tipoDocumento: 'CC',
      identificacion: '12345678',
      primerApellido: 'Pérez',
      segundoApellido: 'García',
      primerNombre: 'María',
      segundoNombre: 'Luisa',
      fechaNacimiento: '1985-05-15',
      ocupacion: 'Comerciante',
      nacionalidad: 'Colombiana',
      telefonoFijo: '6012345678',
      celular: '3001234567',
      genero: 'femenino',
      fechaExpedicion: '2010-03-20',
      lugarExpedicion: 'Bogotá D.C.',
    }
    const result = step6ConyugeSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid tipo documento', () => {
    const invalidData = {
      tipoDocumento: 'INVALID',
    }
    const result = step6ConyugeSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid identificacion format', () => {
    const invalidData = {
      identificacion: '12345', // Too short
    }
    const result = step6ConyugeSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid celular format', () => {
    const invalidData = {
      celular: '2001234567', // Should start with 3
    }
    const result = step6ConyugeSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid genero', () => {
    const invalidData = {
      genero: 'invalid',
    }
    const result = step6ConyugeSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('Step 7: Bienes y Referencias Schema', () => {
  it('should require referencias', () => {
    const invalidData = {}
    const result = step7BienesSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept valid referencias', () => {
    const validData = {
      referencias: {
        familiar: {
          nombre: 'Juan Pérez García',
          telefono: '3001234567',
          direccion: 'Calle 123 #45-67',
        },
        comercial: {
          nombre: 'Tienda El Progreso',
          telefono: '6012345678',
          direccion: 'Carrera 10 #20-30',
        },
        personal: {
          nombre: 'María López',
          telefono: '3109876543',
          direccion: 'Avenida 50 #10-20',
        },
      },
    }
    const result = step7BienesSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should accept bienes raíces (max 3)', () => {
    const validData = {
      bienesRaices: [
        {
          tipoInmueble: 'casa',
          avaluoComercial: 150000000,
          numeroDocumento: '50N-123456',
          ciudad: 'Bogotá',
        },
        {
          tipoInmueble: 'lote',
          avaluoComercial: 80000000,
        },
      ],
      referencias: {
        familiar: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        comercial: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        personal: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
      },
    }
    const result = step7BienesSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject more than 3 bienes raíces', () => {
    const invalidData = {
      bienesRaices: [
        { tipoInmueble: 'casa', avaluoComercial: 100000000 },
        { tipoInmueble: 'apartamento', avaluoComercial: 80000000 },
        { tipoInmueble: 'lote', avaluoComercial: 50000000 },
        { tipoInmueble: 'finca', avaluoComercial: 200000000 },
      ],
      referencias: {
        familiar: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        comercial: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        personal: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
      },
    }
    const result = step7BienesSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept vehiculos (max 2)', () => {
    const validData = {
      vehiculos: [
        {
          clase: 'auto',
          modelo: 2020,
          placa: 'ABC123',
          valorComercial: 40000000,
        },
        {
          clase: 'moto',
          modelo: 2018,
          valorComercial: 8000000,
        },
      ],
      referencias: {
        familiar: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        comercial: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        personal: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
      },
    }
    const result = step7BienesSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject more than 2 vehiculos', () => {
    const invalidData = {
      vehiculos: [
        { clase: 'auto', modelo: 2020, valorComercial: 40000000 },
        { clase: 'moto', modelo: 2018, valorComercial: 8000000 },
        { clase: 'camion', modelo: 2015, valorComercial: 60000000 },
      ],
      referencias: {
        familiar: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        comercial: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        personal: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
      },
    }
    const result = step7BienesSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid placa format', () => {
    const invalidData = {
      vehiculos: [
        {
          clase: 'auto',
          modelo: 2020,
          placa: '12345', // Invalid format
          valorComercial: 40000000,
        },
      ],
      referencias: {
        familiar: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        comercial: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        personal: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
      },
    }
    const result = step7BienesSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject modelo before 1980', () => {
    const invalidData = {
      vehiculos: [
        {
          clase: 'auto',
          modelo: 1970,
          valorComercial: 10000000,
        },
      ],
      referencias: {
        familiar: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        comercial: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
        personal: { nombre: 'Test Test', telefono: '3001234567', direccion: 'Test Address 123' },
      },
    }
    const result = step7BienesSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('Step 8: Balance General Schema', () => {
  it('should accept valid balance data', () => {
    const validData = {
      activos: {
        corrientes: {
          caja: { negocio: 1000000, familiar: 500000 },
          bancosAhorrosCDT: { negocio: 5000000, familiar: 2000000 },
          cuentasPorCobrar: { negocio: 3000000, familiar: 0 },
          inventarios: { negocio: 8000000, familiar: 0 },
        },
        fijos: {
          maquinariaEquipo: { negocio: 15000000, familiar: 0 },
          edificiosTerrenos: { negocio: 0, familiar: 80000000 },
          vehiculos: { negocio: 25000000, familiar: 20000000 },
          semovientes: { negocio: 30000000, familiar: 0 },
          otrosActivos: { negocio: 2000000, familiar: 1000000 },
        },
      },
      pasivos: {
        corriente: {
          proveedores: { negocio: 4000000, familiar: 0 },
          obligacionesCortoPlazo: { negocio: 2000000, familiar: 1000000 },
        },
        largoPlazo: {
          obligacionesLargoPlazo: { negocio: 10000000, familiar: 30000000 },
        },
      },
    }
    const result = step8BalanceSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject negative values', () => {
    const invalidData = {
      activos: {
        corrientes: {
          caja: { negocio: -1000000, familiar: 500000 },
        },
      },
      pasivos: {
        corriente: {},
      },
    }
    const result = step8BalanceSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept calculated fields', () => {
    const validData = {
      activos: {
        corrientes: {
          caja: { negocio: 1000000, familiar: 500000 },
        },
      },
      pasivos: {
        corriente: {
          proveedores: { negocio: 500000, familiar: 0 },
        },
      },
      calculated: {
        totalActivosCorrientes: 1500000,
        totalActivosFijos: 50000000,
        totalActivos: 51500000,
        totalPasivoCorriente: 500000,
        totalPasivoLargoPlazo: 10000000,
        totalPasivos: 10500000,
        patrimonio: 41000000,
      },
    }
    const result = step8BalanceSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})

describe('Step 9: Ingresos y Gastos Schema', () => {
  it('should require ingresosMensualesTitular and basic gastos', () => {
    const invalidData = {}
    const result = step9IngresosGastosSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept valid complete data', () => {
    const validData = {
      ingresos: {
        ingresosMensualesTitular: 3000000,
        otrosIngresosTitular: 500000,
        ingresosConyuge: 2000000,
        otrosIngresosConyuge: 300000,
      },
      gastos: {
        alimentacion: 800000,
        arrendamiento: 600000,
        serviciosPublicos: 300000,
        educacion: 400000,
        transporte: 200000,
        salud: 150000,
        otros: 100000,
      },
    }
    const result = step9IngresosGastosSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject negative values', () => {
    const invalidData = {
      ingresos: {
        ingresosMensualesTitular: -1000000,
      },
      gastos: {
        alimentacion: 500000,
        serviciosPublicos: 200000,
        transporte: 150000,
        salud: 100000,
      },
    }
    const result = step9IngresosGastosSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept calculated fields', () => {
    const validData = {
      ingresos: {
        ingresosMensualesTitular: 3000000,
        otrosIngresosTitular: 500000,
      },
      gastos: {
        alimentacion: 800000,
        serviciosPublicos: 300000,
        transporte: 200000,
        salud: 150000,
      },
      calculated: {
        totalIngresosTitular: 3500000,
        totalIngresosConyuge: 0,
        totalIngresosFamiliares: 3500000,
        totalGastosFamiliares: 1450000,
      },
    }
    const result = step9IngresosGastosSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})

describe('Step 10: Capacidad de Pago Schema', () => {
  it('should accept obligacionesFinancieras with default 0', () => {
    const validData = {}
    const result = step10CapacidadPagoSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.obligacionesFinancieras).toBe(0)
    }
  })

  it('should accept complete calculated data', () => {
    const validData = {
      obligacionesFinancieras: 500000,
      utilidadMensual: 2000000,
      capacidadPago: 1500000,
      ratioDeudaIngreso: 25.5,
      cuotaSolicitada: 800000,
      alertas: {
        capacidadInsuficiente: false,
        ratioAlto: false,
      },
    }
    const result = step10CapacidadPagoSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject negative obligaciones', () => {
    const invalidData = {
      obligacionesFinancieras: -100000,
    }
    const result = step10CapacidadPagoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject ratioDeudaIngreso > 100', () => {
    const invalidData = {
      ratioDeudaIngreso: 150,
    }
    const result = step10CapacidadPagoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept alertas', () => {
    const validData = {
      obligacionesFinancieras: 1500000,
      alertas: {
        capacidadInsuficiente: true,
        ratioAlto: true,
      },
    }
    const result = step10CapacidadPagoSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})

describe('Step 11: Resumen Schema', () => {
  it('should require confirmacion to be true', () => {
    const invalidData = {
      confirmacion: false,
    }
    const result = step11ResumenSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept confirmacion = true', () => {
    const validData = {
      confirmacion: true,
    }
    const result = step11ResumenSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject when confirmacion is missing', () => {
    const invalidData = {}
    const result = step11ResumenSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
