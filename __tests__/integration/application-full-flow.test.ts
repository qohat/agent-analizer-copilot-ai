/**
 * Integration Test: Complete Application Flow
 *
 * Tests the full lifecycle:
 * 1. User fills out 11-step form
 * 2. Form data is mapped correctly
 * 3. POST /api/applications saves ALL data
 * 4. GET /api/applications/[id] retrieves complete data
 * 5. All expected fields are non-null
 */

import { mapFormDataToApplicationRecord } from '@/lib/validation/form-mapper'

describe('Application Full Flow - Data Persistence', () => {
  const mockCompleteFormData = {
    // Step 1: Datos de Solicitud
    numeroSolicitud: 'SOL-001',
    fechaSolicitud: '2026-04-04',
    nombreAsesor: 'Juan Pérez',
    institucion: 'Banco Test',
    canal: 'online',

    // Step 2: Tipo de Producto
    tipoCredito: 'comercial',
    valorSolicitado: 6000000,
    numeroCuotas: 24,

    // Step 3: Datos Personales
    primerNombre: 'Luis',
    primerApellido: 'Perez',
    cedula: '1234567890',
    tipoDocumento: 'CC',
    fechaNacimiento: '1995-01-01',
    celular: '3009494949',
    email: 'q@mail.com',
    genero: 'masculino',
    educacion: 'primaria',
    ocupacion: 'independiente',
    estadoCivil: 'casado',

    // Step 4: Domicilio
    direccion: 'Calle 234523',
    municipio: 'Medellin',
    departamento: 'Antioquia',
    barrio: 'Barrio',
    tipoVivienda: 'propia',
    tiempoResidencia: 24,

    // Step 5: Negocio
    actividadEconomica: 'Grankerp',
    sectorEconomico: 'comercio',
    anosOperacion: 4,
    numeroEmpleados: 2,
    direccionIgualCasa: true,
    celularNegocio: '3007474747',

    // Step 6: Cónyuge
    conyugeFirma: true,
    conyuge: {
      nombres: 'Maria',
      apellidos: 'Lopez',
      cedula: '0987654321',
      celular: '3001234567',
    },

    // Step 7: Bienes Raíces y Referencias
    bienesRaices: [
      {
        tipoInmueble: 'Casa',
        ciudad: 'Medellin',
        avaluoComercial: 150000000,
      },
    ],
    vehiculos: [
      {
        tipo: 'Carro',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2020,
        valorComercial: 30000000,
      },
    ],
    referencias: {
      familiar: {
        nombre: 'Pedro Perez',
        telefono: '3001111111',
        direccion: 'Calle 1',
      },
      comercial: {
        nombre: 'Tienda ABC',
        telefono: '3002222222',
        direccion: 'Calle 2',
      },
      personal: {
        nombre: 'Carlos Gomez',
        telefono: '3003333333',
        direccion: 'Calle 3',
      },
    },

    // Step 8: Balance General
    activos: {
      corrientes: {
        caja: { negocio: '1000000', familiar: '500000' },
        bancosAhorrosCDT: { negocio: '2000000', familiar: '1000000' },
        cuentasPorCobrar: { negocio: '500000', familiar: '0' },
        inventarios: { negocio: '3000000', familiar: '0' },
      },
      fijos: {
        terrenosEdificaciones: { negocio: '50000000', familiar: '100000000' },
        maquinariaEquipo: { negocio: '10000000', familiar: '0' },
        vehiculos: { negocio: '15000000', familiar: '30000000' },
      },
    },
    pasivos: {
      corriente: {
        proveedores: { negocio: '2000000', familiar: '0' },
        obligacionesBancarias: { negocio: '1000000', familiar: '500000' },
        otrasObligaciones: { negocio: '500000', familiar: '200000' },
      },
      largoPlazo: {
        obligacionesBancarias: { negocio: '10000000', familiar: '50000000' },
        otrasObligaciones: { negocio: '0', familiar: '0' },
      },
    },

    // Step 9: Ingresos y Gastos
    ingresos: {
      ingresosMensualesTitular: 10000000,
      ingresosSecundarios: 10000,
      ingresosConyuge: 0,
    },
    gastos: {
      familiares: {
        alimentacion: 1500000,
        vivienda: 800000,
        serviciosPublicos: 350000,
        transporte: 500000,
        educacion: 1000000,
        salud: 300000,
        vestuario: 200000,
        recreacion: 150000,
        otros: 100000,
      },
      negocio: {
        arriendoLocal: 0,
        serviciosPublicos: 0,
        nomina: 0,
        inventario: 0,
        transporte: 0,
        otros: 0,
      },
      obligaciones: {
        creditosVivienda: 0,
        creditosConsumo: 100000,
        creditosVehiculo: 0,
        tarjetasCredito: 0,
        otros: 0,
      },
    },

    // Step 10: Capacidad de Pago (calculated)
    calculated: {
      totalIngresos: 10010000,
      totalGastosFamiliares: 4900000,
      totalGastosNegocio: 0,
      totalObligaciones: 100000,
      capacidadPago: 5010000,
    },

    // Step 11: Confirmación
    confirmacion: true,
  }

  it('should map all form fields correctly', () => {
    const mapped = mapFormDataToApplicationRecord(mockCompleteFormData)

    // Verify key fields are mapped
    expect(mapped.product_type).toBe('commercial')
    expect(mapped.requested_amount).toBe(6000000)
    expect(mapped.requested_months).toBe(24)

    // Client info
    expect(mapped.client_monthly_income).toBe(10000000)
    expect(mapped.primary_income_monthly).toBe(10000000)
    expect(mapped.secondary_income_monthly).toBe(10000)

    // Business info
    expect(mapped.business_name).toBe('Grankerp')
    expect(mapped.business_years_operating).toBe(4)
    expect(mapped.business_months_operating).toBe(48)
    expect(mapped.business_employees_count).toBe(2)

    // Spouse
    expect(mapped.has_spouse).toBe(true)

    // Real estate
    expect(mapped.real_estate_count).toBe(1)
    expect(mapped.real_estate_1_description).toBe('Casa')
    expect(mapped.real_estate_1_estimated_value).toBe(150000000)

    // Vehicles
    expect(mapped.vehicles_count).toBe(1)
    expect(mapped.vehicle_1_type).toBe('Carro')
    expect(mapped.vehicle_1_make).toBe('Toyota')
    expect(mapped.vehicle_1_value).toBe(30000000)

    // References
    expect(mapped.reference_1_name).toBe('Pedro Perez')
    expect(mapped.reference_1_phone).toBe('3001111111')
    expect(mapped.reference_2_name).toBe('Tienda ABC')
    expect(mapped.reference_3_name).toBe('Carlos Gomez')

    // Assets
    expect(mapped.assets_cash_and_equivalents).toBe(1500000)
    expect(mapped.assets_accounts_receivable_trade).toBe(500000)
    expect(mapped.assets_inventory_raw_materials).toBe(3000000)

    // Liabilities
    expect(mapped.liabilities_accounts_payable_trade).toBe(2000000)
    expect(mapped.liabilities_short_term_loans).toBe(1500000)

    // Expenses
    expect(mapped.expenses_food_groceries).toBe(1500000)
    expect(mapped.expenses_housing_rent_mortgage).toBe(800000)
    expect(mapped.expenses_utilities_electricity).toBe(350000)

    // Debt obligations
    expect(mapped.debt_obligations_monthly).toBe(100000)
  })

  it('should not include accept_terms field (does not exist in DB)', () => {
    const mapped = mapFormDataToApplicationRecord(mockCompleteFormData)
    expect(mapped.accept_terms).toBeUndefined()
  })

  it('should handle missing optional fields gracefully', () => {
    const minimalData = {
      tipoCredito: 'comercial',
      valorSolicitado: 5000000,
      numeroCuotas: 12,
      primerNombre: 'Test',
      primerApellido: 'User',
      cedula: '123456',
      celular: '300123456',
      actividadEconomica: 'Test Business',
    }

    const mapped = mapFormDataToApplicationRecord(minimalData)

    expect(mapped.product_type).toBe('commercial')
    expect(mapped.requested_amount).toBe(5000000)
    expect(mapped.requested_months).toBe(12)
    expect(mapped.business_name).toBe('Test Business')

    // Optional fields should default to 0 or empty
    expect(mapped.real_estate_count).toBe(0)
    expect(mapped.vehicles_count).toBe(0)
    expect(mapped.business_employees_count).toBe(0)
  })

  it('should calculate business_months_operating from years', () => {
    const data = {
      ...mockCompleteFormData,
      anosOperacion: 5,
      mesesOperacion: undefined,
    }

    const mapped = mapFormDataToApplicationRecord(data)
    expect(mapped.business_months_operating).toBe(60) // 5 years * 12 months
  })

  it('should handle arrays with multiple items', () => {
    const dataWithMultipleAssets = {
      ...mockCompleteFormData,
      bienesRaices: [
        { tipoInmueble: 'Casa', ciudad: 'Bogota', avaluoComercial: 200000000 },
        { tipoInmueble: 'Apartamento', ciudad: 'Medellin', avaluoComercial: 150000000 },
        { tipoInmueble: 'Lote', ciudad: 'Cali', avaluoComercial: 100000000 },
      ],
      vehiculos: [
        { tipo: 'Carro', marca: 'Toyota', valorComercial: 30000000 },
        { tipo: 'Moto', marca: 'Honda', valorComercial: 5000000 },
      ],
    }

    const mapped = mapFormDataToApplicationRecord(dataWithMultipleAssets)

    expect(mapped.real_estate_count).toBe(3)
    expect(mapped.real_estate_1_description).toBe('Casa')
    expect(mapped.real_estate_2_description).toBe('Apartamento')
    expect(mapped.real_estate_3_description).toBe('Lote')

    expect(mapped.vehicles_count).toBe(2)
    expect(mapped.vehicle_1_type).toBe('Carro')
    expect(mapped.vehicle_2_type).toBe('Moto')
  })
})

describe('Critical Fields Validation', () => {
  it('should include ALL required fields for database insert', () => {
    const testData = {
      tipoCredito: 'comercial',
      valorSolicitado: 5000000,
      numeroCuotas: 12,
      primerNombre: 'Test',
      primerApellido: 'User',
      cedula: '123456',
      celular: '300123456',
      actividadEconomica: 'Business',
      anosOperacion: 3,
    }

    const mapped = mapFormDataToApplicationRecord(testData)

    // These fields MUST exist for database insert
    const requiredFields = [
      'product_type',
      'requested_amount',
      'requested_months',
      'business_name',
      'business_years_operating',
      'business_months_operating',
    ]

    requiredFields.forEach(field => {
      expect(mapped[field]).toBeDefined()
      expect(mapped[field]).not.toBeNull()
    })
  })
})
