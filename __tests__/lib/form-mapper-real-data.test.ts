/**
 * Test: Form Mapper with Real User Data
 *
 * Tests the mapper with actual data captured from the browser
 */

import { mapFormDataToApplicationCreate } from '@/lib/validation/form-mapper'
import { applicationCreateSchema } from '@/lib/validation/schemas'

describe('Form Mapper - Real User Data', () => {
  it('should map real form data from browser', () => {
    // Real data captured from browser console
    const realFormData = {
      "bienesRaices": [
        {
          "tipoInmueble": "casa",
          "avaluoComercial": 1234588,
          "numeroDocumento": "W2WWW",
          "ciudad": "Bogota",
          "fechaDocumento": "2026-04-01"
        }
      ],
      "vehiculos": [],
      "valorSolicitado": 5000000,
      "numeroCuotas": 12,
      "frecuencia": "mensual",
      "destino": "ferrrt jnknjknkjn kj",
      "diaPagoCuota": 12,
      "tipoCredito": "agropecuario",
      "tipoDocumento": "CC",
      "cedula": "123456789",
      "primerNombre": "fgh",
      "segundoNombre": "fgh",
      "primerApellido": "asdfgh",
      "segundoApellido": "wertyu",
      "fechaNacimiento": "1994-01-01",
      "nacionalidad": "Colombiana",
      "correo": "corea@dfghjk.com",
      "celular": "3004456666",
      "telefonoFijo": "600030303",
      "ocupacion": "comercial",
      "educacion": "secundaria",
      "estadoCivil": "casado",
      "genero": "femenino",
      "departamento": "Antioquia",
      "municipio": "Medellin",
      "direccion": "calle 34 2222",
      "barrioVereda": "Poblado",
      "tipoVivienda": "arrendada",
      "nombrePropietario": "Nombre",
      "valorArrendado": 400000,
      "actividadEconomica": "Granjero",
      "numeroEmpleados": 2,
      "anosOperacion": 3,
      "celularNegocio": "3008484848",
      "direccionIgualCasa": true,
      "departamentoNegocio": "Antioquia",
      "municipioNegocio": "Medellin",
      "direccionNegocio": "calle 34 2222",
      "barrioVeredaNegocio": "Poblado",
      "conyugeFirma": false,
      "identificacion": "1082828282",
      "fechaExpedicion": "",
      "lugarExpedicion": "",
      "referencias": {
        "familiar": {
          "nombre": "Qohat",
          "telefono": "30074757474",
          "direccion": "Calle 47 # 21-21"
        },
        "comercial": {
          "nombre": "Qohat P",
          "telefono": "30064536727",
          "direccion": "CALLE 34 2211"
        },
        "personal": {
          "nombre": "",
          "telefono": "",
          "direccion": ""
        }
      },
      "activos": {
        "corrientes": {
          "caja": {
            "negocio": "3100500",
            "familiar": "7094043"
          },
          "bancosAhorrosCDT": {
            "negocio": 0,
            "familiar": "93939"
          },
          "cuentasPorCobrar": {
            "negocio": 0,
            "familiar": ""
          },
          "inventarios": {
            "negocio": 0,
            "familiar": "04"
          }
        },
        "fijos": {
          "maquinariaEquipo": {
            "negocio": 0,
            "familiar": "343433"
          },
          "edificiosTerrenos": {
            "negocio": 0,
            "familiar": 0
          },
          "vehiculos": {
            "negocio": 0,
            "familiar": 0
          },
          "semovientes": {
            "negocio": 0,
            "familiar": 0
          },
          "otrosActivos": {
            "negocio": 0,
            "familiar": 0
          }
        }
      },
      "pasivos": {
        "corriente": {
          "proveedores": {
            "negocio": 0,
            "familiar": 0
          },
          "obligacionesCortoPlazo": {
            "negocio": 0,
            "familiar": 0
          }
        },
        "largoPlazo": {
          "obligacionesLargoPlazo": {
            "negocio": "3000000",
            "familiar": "2000000"
          }
        }
      },
      "calculated": {
        "totalActivosCorrientes": 10288486,
        "totalActivosFijos": 343433,
        "totalActivos": 10631919,
        "totalPasivoCorriente": 0,
        "totalPasivoLargoPlazo": 5000000,
        "totalPasivos": 5000000,
        "patrimonio": 5631919,
        "totalIngresosTitular": 34342341,
        "totalIngresosConyuge": 0,
        "totalIngresosFamiliares": 34342341,
        "totalGastosFamiliares": 33585559
      },
      "ingresos": {
        "ingresosMensualesTitular": "999999",
        "otrosIngresosTitular": "33342342",
        "ingresosConyuge": "",
        "otrosIngresosConyuge": ""
      },
      "gastos": {
        "alimentacion": "",
        "arrendamiento": "30000",
        "serviciosPublicos": "4",
        "educacion": "",
        "transporte": "33555555",
        "salud": "",
        "otros": ""
      },
      "utilidadMensual": 756782,
      "capacidadPago": 752548,
      "ratioDeudaIngreso": 1.389049113206223,
      "cuotaSolicitada": 472797.98311475717,
      "alertas": {
        "capacidadInsuficiente": false,
        "ratioAlto": false
      },
      "obligacionesFinancieras": "4234",
      "confirmacion": true
    }

    // Map the data
    const mapped = mapFormDataToApplicationCreate(realFormData)

    console.log('Real data mapped:', JSON.stringify(mapped, null, 2))

    // Verify critical fields
    expect(mapped.requestedAmount).toBe(5000000)
    expect(mapped.loanTermMonths).toBe(12)
    expect(mapped.productType).toBe('agricultural')

    // Client info
    expect(mapped.clientFirstName).toBe('fgh')
    expect(mapped.clientLastName).toBe('asdfgh')
    expect(mapped.clientIdNumber).toBe('123456789')
    expect(mapped.clientPhone).toBe('3004456666')
    expect(mapped.clientEmail).toBe('corea@dfghjk.com')

    // Address
    expect(mapped.addressStreet).toBe('calle 34 2222')
    expect(mapped.addressCity).toBe('Medellin')
    expect(mapped.addressDepartment).toBe('Antioquia')
    expect(mapped.landlordName).toBe('Nombre')
    expect(mapped.rentAmount).toBe(400000)

    // Business
    expect(mapped.businessName).toBe('Granjero')
    expect(mapped.businessYearsOperating).toBe(3)
    expect(mapped.businessMonthsInOperation).toBe(36)
    expect(mapped.businessAddressCity).toBe('Medellin')
    expect(mapped.businessEmployeesCount).toBe(2)

    // Financial (strings should be converted to numbers)
    expect(mapped.primaryIncomeMonthly).toBe(999999)
    expect(mapped.secondaryIncomeMonthly).toBe(33342342)
    expect(mapped.householdExpensesMonthly).toBe(33585559) // from calculated
    expect(mapped.debtObligationsMonthly).toBe(4234)

    // Validate with schema
    const result = applicationCreateSchema.safeParse(mapped)

    if (!result.success) {
      console.error('❌ Validation failed:')
      result.error.errors.forEach((err, i) => {
        console.error(`  ${i + 1}. ${err.path.join('.')}: ${err.message}`)
      })
    }

    expect(result.success).toBe(true)
  })
})
