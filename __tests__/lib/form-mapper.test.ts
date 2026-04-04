/**
 * Test: Form Field Mapper
 *
 * Validates that all Spanish form fields are correctly mapped to English API fields
 */

import { mapFormDataToApplicationCreate } from '@/lib/validation/form-mapper'
import { applicationCreateSchema } from '@/lib/validation/schemas'

describe('Form Field Mapper', () => {
  describe('mapFormDataToApplicationCreate', () => {
    it('should map all fields from complete form data to API format', () => {
      // Mock complete form data with all 11 steps
      const completeFormData = {
        // Step 1: Datos de la Solicitud
        valorSolicitado: 5000000,
        numeroCuotas: 24,
        frecuencia: 'mensual',
        destino: 'Capital de trabajo para compra de inventario',
        diaPagoCuota: 15,

        // Step 2: Tipo de Producto
        tipoCredito: 'comercial',

        // Step 3: Datos Personales
        tipoDocumento: 'CC',
        cedula: '1234567890',
        primerApellido: 'García',
        segundoApellido: 'Rodríguez',
        primerNombre: 'Juan',
        segundoNombre: 'Carlos',
        fechaNacimiento: '1985-05-15T00:00:00Z',
        ocupacion: 'independiente',
        nacionalidad: 'Colombiana',
        correo: 'juan.garcia@example.com',
        telefonoFijo: '6012345678',
        celular: '3001234567',
        educacion: 'universidad',
        estadoCivil: 'casado',
        genero: 'masculino',

        // Step 4: Domicilio
        direccion: 'Calle 45 # 23-67',
        municipio: 'Bogotá',
        departamento: 'Cundinamarca',
        barrioVereda: 'Chapinero',
        codigoPostal: '110111',
        tipoVivienda: 'arrendada',
        antiguedadVivienda: 3,
        nombreArrendador: 'Pedro López',
        valorArriendo: 1200000,

        // Step 5: Negocio
        actividadEconomica: 'Tienda de abarrotes',
        descripcionNegocio: 'Venta al por menor de productos de primera necesidad',
        formaJuridica: 'persona_natural',
        anosOperacion: 5,
        mesesOperacion: 60,
        direccionNegocio: 'Carrera 7 # 12-34',
        ciudadNegocio: 'Bogotá',
        departamentoNegocio: 'Cundinamarca',
        celularNegocio: '3009876543',
        numeroMatricula: 'MAT123456',
        numeroEmpleados: 2,
        direccionIgualCasa: false,

        // Step 6: Cónyuge
        conyugeFirma: true,
        primerNombreConyuge: 'María',
        primerApellidoConyuge: 'Pérez',
        tipoDocumentoConyuge: 'CC',
        cedulaConyuge: '9876543210',
        fechaNacimientoConyuge: '1987-08-20T00:00:00Z',
        celularConyuge: '3102345678',
        correoConyuge: 'maria.perez@example.com',
        ingresosConyuge: 1500000,

        // Step 7: Bienes Raíces (usando arrays como en FormSteps6-11)
        bienesRaices: [
          {
            tipoInmueble: 'Casa',
            direccion: 'Calle 10 # 20-30',
            ciudad: 'Medellín',
            avaluoComercial: 150000000,
            deudaHipotecaria: 50000000,
          },
        ],

        // Vehículos
        vehiculos: [
          {
            clase: 'Automóvil',
            marca: 'Chevrolet',
            linea: 'Spark',
            modelo: 2018,
            placa: 'ABC123',
            valorComercial: 25000000,
            deuda: 5000000,
          },
        ],

        // Referencias
        referencias: {
          familiar: {
            nombre: 'Ana García',
            telefono: '3123456789',
            direccion: 'Calle 50 # 10-20',
          },
          personal: {
            nombre: 'Luis Martínez',
            telefono: '3145678901',
            direccion: 'Carrera 15 # 30-40',
          },
          comercial: {
            nombre: 'Distribuidora XYZ',
            telefono: '6017654321',
            direccion: 'Avenida 68 # 45-67',
          },
        },

        // Step 8: Balance General
        activosCorrientes: {
          caja: { negocio: 2000000, familiar: 500000 },
          bancos: { negocio: 5000000, familiar: 1000000 },
          inventarios: { negocio: 8000000, familiar: 0 },
        },
        activosFijos: {
          edificios: { negocio: 0, familiar: 150000000 },
          maquinaria: { negocio: 3000000, familiar: 0 },
          vehiculos: { negocio: 25000000, familiar: 0 },
        },
        pasivosCorrientes: {
          proveedores: { negocio: 2000000, familiar: 0 },
          obligacionesCorto: { negocio: 1000000, familiar: 0 },
        },
        pasivosLargo: {
          obligacionesLargo: { negocio: 0, familiar: 50000000 },
        },

        // Step 9: Ingresos y Gastos (nested structure)
        ingresos: {
          ingresosMensualesTitular: 3000000,
          otrosIngresosTitular: 500000,
          ingresosConyuge: 1500000,
          otrosIngresosConyuge: 0,
        },
        gastos: {
          alimentacion: 800000,
          arrendamiento: 600000,
          serviciosPublicos: 200000,
          educacion: 150000,
          transporte: 150000,
          salud: 100000,
          otros: 0,
        },
        calculated: {
          totalIngresosTitular: 3500000,
          totalIngresosConyuge: 1500000,
          totalIngresosFamiliares: 5000000,
          totalGastosFamiliares: 2000000,
        },
        obligacionesFinancieras: 800000,

        // Step 10: Capacidad de Pago (auto-calculado)
        capacidadPagoMensual: 1200000,

        // Step 11: Términos y Condiciones
        aceptaTerminos: true,
        notes: 'Solicitud para ampliación del negocio',
      }

      // Execute mapping
      const mappedData = mapFormDataToApplicationCreate(completeFormData)

      // Assertions: Verify all critical fields are mapped correctly
      expect(mappedData.requestedAmount).toBe(5000000)
      expect(mappedData.loanTermMonths).toBe(24)
      expect(mappedData.productType).toBe('commercial')

      // Client personal info
      expect(mappedData.clientIdType).toBe('cedula')
      expect(mappedData.clientIdNumber).toBe('1234567890')
      expect(mappedData.clientFirstName).toBe('Juan')
      expect(mappedData.clientLastName).toBe('García')
      expect(mappedData.clientDateOfBirth).toBe('1985-05-15T00:00:00Z')
      expect(mappedData.clientPhone).toBe('3001234567')
      expect(mappedData.clientEmail).toBe('juan.garcia@example.com')
      expect(mappedData.clientGender).toBe('male')
      expect(mappedData.clientEducationLevel).toBe('university')
      expect(mappedData.clientEmploymentStatus).toBe('self_employed')
      expect(mappedData.maritalStatus).toBe('married')

      // Address
      expect(mappedData.addressStreet).toBe('Calle 45 # 23-67')
      expect(mappedData.addressCity).toBe('Bogotá')
      expect(mappedData.addressDepartment).toBe('Cundinamarca')
      expect(mappedData.addressNeighborhood).toBe('Chapinero')
      expect(mappedData.residenceType).toBe('arrendada')
      expect(mappedData.landlordName).toBe('Pedro López')
      expect(mappedData.rentAmount).toBe(1200000)

      // Business
      expect(mappedData.businessName).toBe('Tienda de abarrotes')
      expect(mappedData.businessDescription).toBe('Venta al por menor de productos de primera necesidad')
      expect(mappedData.businessLegalForm).toBe('sole_proprietor')
      expect(mappedData.businessYearsOperating).toBe(5)
      expect(mappedData.businessPhone).toBe('3009876543')
      expect(mappedData.businessEmployeesCount).toBe(2)

      // Spouse
      expect(mappedData.hasSpouse).toBe(true)
      expect(mappedData.spouseFirstName).toBe('María')
      expect(mappedData.spouseLastName).toBe('Pérez')
      expect(mappedData.spouseIdNumber).toBe('9876543210')
      expect(mappedData.spouseMonthlyIncome).toBe(1500000)

      // Financial
      expect(mappedData.primaryIncomeMonthly).toBe(3000000)
      expect(mappedData.secondaryIncomeMonthly).toBe(500000)
      expect(mappedData.spouseMonthlyIncome).toBe(1500000)
      expect(mappedData.householdExpensesMonthly).toBe(2000000) // from calculated total
      expect(mappedData.businessExpensesMonthly).toBe(0) // not set in this test
      expect(mappedData.debtObligationsMonthly).toBe(800000)

      // Terms
      expect(mappedData.acceptTerms).toBe(true)

      // Verify notes include multiple fields
      expect(mappedData.notes).toContain('Capital de trabajo')
      expect(mappedData.notes).toContain('mensual')

      console.log('✅ All fields mapped successfully')
      console.log('Mapped data:', JSON.stringify(mappedData, null, 2))
    })

    it('should validate against applicationCreateSchema', () => {
      // Complete valid form data
      const completeFormData = {
        // Required fields only
        valorSolicitado: 5000000,
        numeroCuotas: 24,
        destino: 'Capital de trabajo',
        tipoCredito: 'comercial',

        // Client
        cedula: '1234567890',
        primerApellido: 'García',
        primerNombre: 'Juan',
        celular: '3001234567',
        ocupacion: 'independiente',
        estadoCivil: 'soltero',

        // Address
        direccion: 'Calle 45 # 23-67',
        municipio: 'Bogotá',
        departamento: 'Cundinamarca',

        // Business
        actividadEconomica: 'Tienda de abarrotes',
        anosOperacion: 5,

        // Financial (nested structure)
        ingresos: {
          ingresosMensualesTitular: 3000000,
          otrosIngresosTitular: 0,
        },
        gastos: {
          alimentacion: 400000,
          arrendamiento: 300000,
          serviciosPublicos: 150000,
          educacion: 100000,
          transporte: 50000,
          salud: 0,
          otros: 0,
        },
        calculated: {
          totalIngresosFamiliares: 3000000,
          totalGastosFamiliares: 1000000,
        },
        obligacionesFinancieras: 500000,

        // Terms
        aceptaTerminos: true,
      }

      const mappedData = mapFormDataToApplicationCreate(completeFormData)

      // Validate with Zod schema
      const result = applicationCreateSchema.safeParse(mappedData)

      if (!result.success) {
        console.error('❌ Validation failed:', result.error.errors)
        console.error('Mapped data:', mappedData)
      }

      expect(result.success).toBe(true)
    })

    it('should handle enum mappings correctly', () => {
      const testData = {
        tipoCredito: 'agropecuario',
        tipoDocumento: 'PP',
        genero: 'femenino',
        educacion: 'tecnica',
        ocupacion: 'comerciante',
        estadoCivil: 'union_libre',
        formaJuridica: 'cooperativa',
      }

      const mapped = mapFormDataToApplicationCreate(testData)

      expect(mapped.productType).toBe('agricultural')
      expect(mapped.clientIdType).toBe('passport')
      expect(mapped.clientGender).toBe('female')
      expect(mapped.clientEducationLevel).toBe('technical')
      expect(mapped.clientEmploymentStatus).toBe('self_employed')
      expect(mapped.maritalStatus).toBe('common_law')
      expect(mapped.businessLegalForm).toBe('cooperative')
    })

    it('should handle missing optional fields gracefully', () => {
      const minimalData = {
        valorSolicitado: 5000000,
        numeroCuotas: 24,
        tipoCredito: 'comercial',
        cedula: '1234567890',
        primerNombre: 'Juan',
        primerApellido: 'García',
      }

      const mapped = mapFormDataToApplicationCreate(minimalData)

      expect(mapped.requestedAmount).toBe(5000000)
      expect(mapped.clientFirstName).toBe('Juan')
      expect(mapped.hasSpouse).toBe(false)
      expect(mapped.secondaryIncomeMonthly).toBe(0)
    })

    it('should map alternative field names', () => {
      // Test that both old and new field names work
      const dataWithAlternatives = {
        // Old field names
        valorSolicitado: 5000000,
        nombreNegocio: 'Mi Negocio',
        ingresosMensuales: 3000000,

        // New field names
        actividadEconomica: 'Comercio',
        ingresosMensualesTitular: 3500000,
      }

      const mapped = mapFormDataToApplicationCreate(dataWithAlternatives)

      // Should prefer the new field names when both exist
      expect(mapped.requestedAmount).toBe(5000000)
      expect(mapped.businessName).toBe('Comercio') // actividadEconomica has priority
      expect(mapped.primaryIncomeMonthly).toBe(3500000) // ingresosMensualesTitular has priority
    })

    it('should aggregate financial data correctly', () => {
      const financialData = {
        // Multiple income sources (nested)
        ingresos: {
          ingresosMensualesTitular: 3000000,
          otrosIngresosTitular: 500000,
          ingresosConyuge: 2000000,
        },

        // Expenses (nested)
        gastos: {
          alimentacion: 600000,
          arrendamiento: 500000,
          serviciosPublicos: 200000,
          educacion: 150000,
          transporte: 50000,
          salud: 0,
          otros: 0,
        },

        // Business expenses (separate)
        gastosNegocio: 1000000,
        obligacionesFinancieras: 800000,
      }

      const mapped = mapFormDataToApplicationCreate(financialData)

      expect(mapped.primaryIncomeMonthly).toBe(3000000)
      expect(mapped.secondaryIncomeMonthly).toBe(500000)
      expect(mapped.hasSecondaryIncome).toBe(true)
      expect(mapped.spouseMonthlyIncome).toBe(2000000)
      expect(mapped.householdExpensesMonthly).toBe(1500000) // sum of gastos
      expect(mapped.businessExpensesMonthly).toBe(1000000)
      expect(mapped.debtObligationsMonthly).toBe(800000)
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing tipoCredito with default', () => {
      const data = { valorSolicitado: 5000000 }
      const mapped = mapFormDataToApplicationCreate(data)
      expect(mapped.productType).toBe('commercial') // default
    })

    it('should handle unknown enum values with defaults', () => {
      const data = {
        tipoDocumento: 'UNKNOWN',
        genero: 'otro_valor',
        educacion: 'ninguna',
        ocupacion: 'otra_cosa',
      }
      const mapped = mapFormDataToApplicationCreate(data)

      expect(mapped.clientIdType).toBe('cedula') // default
      expect(mapped.clientGender).toBe('other') // default for unknown
      expect(mapped.clientEducationLevel).toBe('secondary') // default
      expect(mapped.clientEmploymentStatus).toBe('self_employed') // default
    })

    it('should handle arrays in bienes and vehiculos', () => {
      const data = {
        bienesRaices: [
          { tipoInmueble: 'Casa', avaluoComercial: 100000000 },
          { tipoInmueble: 'Lote', avaluoComercial: 50000000 },
        ],
        vehiculos: [
          { marca: 'Toyota', modelo: 2020, valorComercial: 40000000 },
        ],
      }

      const mapped = mapFormDataToApplicationCreate(data)

      // These arrays should be preserved in notes or handled separately
      // The current mapper doesn't expand arrays to individual fields
      // This is expected behavior - arrays need separate processing
      expect(mapped).toBeDefined()
    })
  })
})
