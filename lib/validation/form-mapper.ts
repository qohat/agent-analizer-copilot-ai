/**
 * Form Field Mapper
 *
 * Maps Spanish field names from the multi-step form to English field names
 * expected by the applicationCreateSchema API endpoint.
 *
 * Based on official mapping: /proposals/agent_analizer_copilot/schema/homologated/MAPPING.md
 *
 * This is needed because:
 * - Form schemas use Spanish field names (valorSolicitado, numeroCuotas, etc.)
 * - API expects English field names (requestedAmount, loanTermMonths, etc.)
 */

import { ApplicationCreateInput } from './schemas'

/**
 * Maps form data from Spanish field names to English field names
 * compatible with applicationCreateSchema
 */
export function mapFormDataToApplicationCreate(formData: any): Partial<ApplicationCreateInput> {
  return {
    // Step 1: Datos de la Solicitud
    requestedAmount: parseNumber(formData.valorSolicitado),
    loanTermMonths: parseNumber(formData.numeroCuotas),

    // Build comprehensive notes from multiple fields
    notes: [
      formData.destino ? `Destino: ${formData.destino}` : '',
      formData.frecuencia ? `Frecuencia de pago: ${formData.frecuencia}` : '',
      formData.diaPagoCuota ? `Día de pago: ${formData.diaPagoCuota}` : '',
      formData.notes || '',
    ].filter(Boolean).join(' | '),

    // Step 2: Tipo de Producto
    productType: mapProductType(formData.tipoCredito),

    // Step 3: Datos Personales
    clientIdType: mapIdType(formData.tipoDocumento),
    clientIdNumber: formData.cedula || formData.identificacion,
    clientFirstName: formData.primerNombre,
    clientLastName: formData.primerApellido,
    clientDateOfBirth: parseDate(formData.fechaNacimiento),
    clientPhone: formData.celular,
    clientEmail: formData.correo,
    clientGender: mapGender(formData.genero),
    clientEducationLevel: mapEducationLevel(formData.educacion),
    clientEmploymentStatus: mapEmploymentStatus(formData.ocupacion),
    maritalStatus: mapMaritalStatus(formData.estadoCivil),

    // Step 4: Domicilio
    addressStreet: formData.direccion || formData.direccionResidencia,
    addressCity: formData.municipio || formData.ciudad || formData.ciudadResidencia,
    addressDepartment: formData.departamento || formData.departamentoResidencia,
    addressPostalCode: formData.codigoPostal,
    addressNeighborhood: formData.barrioVereda || formData.barrio,
    residenceType: formData.tipoVivienda,
    residenceYears: formData.antiguedadVivienda,
    landlordName: formData.nombrePropietario || formData.nombreArrendador,
    rentAmount: parseNumber(formData.valorArrendado || formData.valorArriendo || 0),

    // Step 5: Negocio
    businessName: formData.actividadEconomica || formData.nombreNegocio || formData.razonSocial,
    businessDescription:
      formData.descripcionNegocio ||
      (formData.actividadEconomica && formData.actividadEconomica.length >= 10
        ? formData.actividadEconomica
        : formData.actividadEconomica
        ? `Actividad: ${formData.actividadEconomica}`
        : undefined),
    businessLegalForm: mapFormaJuridica(formData.formaJuridica),
    businessYearsOperating: parseNumber(formData.anosOperacion || formData.antiguedadNegocio || 0),
    // businessMonthsInOperation is required by the schema
    // Calculate from mesesOperacion, or anosOperacion * 12, or default to 1
    businessMonthsInOperation: parseNumber(
      formData.mesesOperacion ||
      (formData.anosOperacion ? formData.anosOperacion * 12 : null) ||
      (formData.antiguedadNegocio ? formData.antiguedadNegocio * 12 : null) ||
      1 // Default to 1 month minimum
    ),
    businessAddressStreet: formData.direccionNegocio,
    businessAddressCity: formData.municipioNegocio || formData.ciudadNegocio,
    businessAddressDepartment: formData.departamentoNegocio,
    businessPhone: formData.celularNegocio || formData.telefonoNegocio,
    businessRegistration: formData.numeroMatricula,
    businessEmployeesCount: parseNumber(formData.numeroEmpleados || 0),
    businessAddressSameAsResidential: formData.direccionIgualCasa || false,

    // Step 6: Cónyuge (if applicable)
    // If marital status is married, hasSpouse must be true (schema requirement)
    hasSpouse:
      formData.conyugeFirma ||
      formData.tieneConyuge ||
      mapMaritalStatus(formData.estadoCivil) === 'married',
    spouseFirstName: formData.primerNombreConyuge,
    spouseLastName: formData.primerApellidoConyuge,
    spouseIdType: mapIdType(formData.tipoDocumentoConyuge),
    spouseIdNumber: formData.cedulaConyuge || formData.identificacionConyuge,
    spouseDateOfBirth: parseDate(formData.fechaNacimientoConyuge),
    spousePhone: formData.celularConyuge,
    spouseEmail: formData.correoConyuge,
    spouseMonthlyIncome: parseNumber(
      formData.ingresos?.ingresosConyuge ||
      formData.ingresosConyuge ||
      formData.ingresosMensualesConyuge ||
      0
    ),

    // Steps 7-9: Financial data
    primaryIncomeSource: 'business',
    primaryIncomeMonthly: parseNumber(
      formData.ingresos?.ingresosMensualesTitular ||
      formData.ingresosMensualesTitular ||
      formData.ingresosMensuales ||
      formData.ingresoClienteNegocio ||
      formData.ingresosNegocio ||
      formData.ingresosMensualesNegocio ||
      0
    ),
    secondaryIncomeMonthly: parseNumber(
      formData.ingresos?.otrosIngresosTitular ||
      formData.otrosIngresosTitular ||
      formData.otrosIngresos ||
      0
    ),
    hasSecondaryIncome: parseNumber(
      formData.ingresos?.otrosIngresosTitular ||
      formData.otrosIngresosTitular ||
      formData.otrosIngresos ||
      0
    ) > 0,

    // Use calculated totals if available, otherwise use individual fields
    householdExpensesMonthly: parseNumber(
      formData.calculated?.totalGastosFamiliares ||
      formData.gastosPersonales ||
      formData.gastosHogar ||
      formData.gastosFamiliares ||
      (formData.gastos ? (
        parseNumber(formData.gastos.alimentacion || 0) +
        parseNumber(formData.gastos.arrendamiento || 0) +
        parseNumber(formData.gastos.serviciosPublicos || 0) +
        parseNumber(formData.gastos.educacion || 0) +
        parseNumber(formData.gastos.transporte || 0) +
        parseNumber(formData.gastos.salud || 0) +
        parseNumber(formData.gastos.otros || 0)
      ) : 0) ||
      0
    ),
    businessExpensesMonthly: parseNumber(formData.gastosNegocio || formData.gastosOperacionales || formData.gastosNegocioMensuales || 0),
    debtObligationsMonthly: parseNumber(formData.obligacionesFinancieras || formData.cuotasCreditos || formData.obligacionesMensuales || 0),

    // Step 11: Términos y condiciones
    acceptTerms: formData.aceptaTerminos || false,
  }
}

/**
 * Helper functions to map enum values from Spanish to English
 * Based on official MAPPING.md
 */

/**
 * Parse a value to number, handling strings and undefined
 */
function parseNumber(value: any): number {
  if (value === undefined || value === null || value === '') {
    return 0
  }
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    // Remove currency symbols, commas, dots used as thousands separators
    const cleaned = value.replace(/[$,]/g, '').trim()
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

/**
 * Convert date to ISO datetime format expected by Zod
 */
function parseDate(value: any): string | undefined {
  if (!value || value === '') {
    return undefined
  }

  // If already in ISO format, return as-is
  if (typeof value === 'string' && value.includes('T')) {
    return value
  }

  // If it's just a date (YYYY-MM-DD), add time
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00Z`
  }

  return value
}

function mapProductType(raw: string | undefined): 'commercial' | 'agricultural' {
  const mapping: Record<string, 'commercial' | 'agricultural'> = {
    'comercial': 'commercial',
    'agropecuario': 'agricultural',
  }
  return mapping[raw || 'comercial'] || 'commercial'
}

function mapIdType(raw: string | undefined): 'cedula' | 'passport' | 'dni' | 'nit' {
  const mapping: Record<string, 'cedula' | 'passport' | 'dni' | 'nit'> = {
    'CC': 'cedula',
    'CE': 'passport',
    'PP': 'passport',
    'NIT': 'nit',
  }
  return mapping[raw || 'CC'] || 'cedula'
}

function mapGender(raw: string | undefined): 'male' | 'female' | 'other' | undefined {
  const mapping: Record<string, 'male' | 'female' | 'other'> = {
    'masculino': 'male',
    'femenino': 'female',
    'otro': 'other',
    'M': 'male',
    'F': 'female',
  }
  return raw ? mapping[raw] || 'other' : undefined
}

function mapEducationLevel(raw: string | undefined): 'primary' | 'secondary' | 'technical' | 'university' | undefined {
  const mapping: Record<string, 'primary' | 'secondary' | 'technical' | 'university'> = {
    'primaria': 'primary',
    'secundaria': 'secondary',
    'tecnica': 'technical',
    'universidad': 'university',
    'posgrado': 'university', // Postgraduate is mapped to university
  }
  return raw ? mapping[raw] || 'secondary' : undefined
}

function mapEmploymentStatus(raw: string | undefined): 'employed' | 'self_employed' | 'unemployed' | 'retired' {
  const mapping: Record<string, 'employed' | 'self_employed' | 'unemployed' | 'retired'> = {
    'empleado': 'employed',
    'independiente': 'self_employed',
    'comerciante': 'self_employed',
    'empresario': 'self_employed',
    'desempleado': 'unemployed',
    'pensionado': 'retired',
  }
  return mapping[raw || ''] || 'self_employed'
}

function mapMaritalStatus(raw: string | undefined): 'single' | 'married' | 'common_law' | 'divorced' | 'widowed' {
  const mapping: Record<string, 'single' | 'married' | 'common_law' | 'divorced' | 'widowed'> = {
    'soltero': 'single',
    'soltera': 'single',
    'casado': 'married',
    'casada': 'married',
    'union_libre': 'common_law',
    'divorciado': 'divorced',
    'divorciada': 'divorced',
    'viudo': 'widowed',
    'viuda': 'widowed',
  }
  return mapping[raw || ''] || 'single'
}

function mapFormaJuridica(raw: string | undefined): 'sole_proprietor' | 'cooperative' | 'sas' | 'corporation' | undefined {
  const mapping: Record<string, 'sole_proprietor' | 'cooperative' | 'sas' | 'corporation'> = {
    'persona_natural': 'sole_proprietor',
    'natural': 'sole_proprietor',
    'cooperativa': 'cooperative',
    'sas': 'sas',
    'sa': 'corporation',
    'sociedad_anonima': 'corporation',
  }
  return raw ? mapping[raw] : undefined
}
