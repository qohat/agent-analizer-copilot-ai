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
    addressNeighborhood: formData.barrioVereda || formData.barrio,

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
  } as Partial<ApplicationCreateInput>
}

/**
 * Maps ALL form data for database insertion
 * This includes fields not in applicationCreateSchema but present in the database
 */
export function mapFormDataToApplicationRecord(formData: any): Record<string, any> {
  const mapped = mapFormDataToApplicationCreate(formData)

  return {
    // Step 1: Datos de la Solicitud
    solicitud_numero: formData.numeroSolicitud || `SOL-${Date.now()}`,
    solicitud_fecha: parseDate(formData.fechaSolicitud) || new Date().toISOString(),
    solicitud_asesor: formData.nombreAsesor || '',
    solicitud_institucion: formData.institucion || '',
    solicitud_canal: formData.canal || 'online',

    // Product & requested amounts
    product_type: mapped.productType,
    requested_amount: mapped.requestedAmount,
    requested_months: mapped.loanTermMonths,

    // Client info (references clients table, but duplicated for searchability)
    client_monthly_income: mapped.primaryIncomeMonthly,
    client_secondary_income: mapped.secondaryIncomeMonthly,

    // Spouse info
    spouse_monthly_income: parseNumber(
      formData.ingresos?.ingresosConyuge ||
      formData.ingresosConyuge ||
      formData.ingresosMensualesConyuge ||
      0
    ),
    has_spouse: mapped.hasSpouse,

    // Address
    address_residential_time_months: parseNumber(formData.tiempoResidencia) || 0,
    address_own_rent: formData.tipoVivienda,
    address_rent_monthly_amount: parseNumber(formData.valorArrendado || formData.valorArriendo || 0),

    // Business info
    business_name: mapped.businessName,
    business_type: mapped.businessLegalForm,
    business_sector: formData.sectorEconomico || '',
    business_description: mapped.businessDescription,
    business_registration_number: mapped.businessRegistration,
    business_address_street: mapped.businessAddressStreet,
    business_address_city: mapped.businessAddressCity,
    business_address_department: mapped.businessAddressDepartment,
    business_phone: formData.celularNegocio || formData.telefonoNegocio,
    business_years_operating: parseNumber(formData.anosOperacion || formData.antiguedadNegocio || 0),
    business_months_operating: parseNumber(
      formData.mesesOperacion ||
      (formData.anosOperacion ? formData.anosOperacion * 12 : null) ||
      (formData.antiguedadNegocio ? formData.antiguedadNegocio * 12 : null) ||
      1
    ),
    business_employees_count: parseNumber(formData.numeroEmpleados || 0),
    business_address_same_as_residential: formData.direccionIgualCasa || false,

    // Step 7: Bienes Raíces (Arrays from form)
    real_estate_count: formData.bienesRaices?.length || 0,
    real_estate_1_description: formData.bienesRaices?.[0]?.tipoInmueble || '',
    real_estate_1_estimated_value: parseNumber(formData.bienesRaices?.[0]?.avaluoComercial) || 0,
    real_estate_1_location: formData.bienesRaices?.[0]?.ciudad || '',
    real_estate_1_ownership_percent: 100,

    real_estate_2_description: formData.bienesRaices?.[1]?.tipoInmueble || '',
    real_estate_2_estimated_value: parseNumber(formData.bienesRaices?.[1]?.avaluoComercial) || 0,
    real_estate_2_location: formData.bienesRaices?.[1]?.ciudad || '',
    real_estate_2_ownership_percent: 100,

    real_estate_3_description: formData.bienesRaices?.[2]?.tipoInmueble || '',
    real_estate_3_estimated_value: parseNumber(formData.bienesRaices?.[2]?.avaluoComercial) || 0,
    real_estate_3_location: formData.bienesRaices?.[2]?.ciudad || '',
    real_estate_3_ownership_percent: 100,

    // Step 7: Vehículos (Arrays from form)
    vehicles_count: formData.vehiculos?.length || 0,
    vehicle_1_type: formData.vehiculos?.[0]?.clase || '',
    vehicle_1_year: parseNumber(formData.vehiculos?.[0]?.modelo) || 0,
    vehicle_1_make: formData.vehiculos?.[0]?.marca || '',
    vehicle_1_model: formData.vehiculos?.[0]?.modelo || '',
    vehicle_1_value: parseNumber(formData.vehiculos?.[0]?.valorComercial) || 0,
    vehicle_1_registration_number: formData.vehiculos?.[0]?.placa || '',

    vehicle_2_type: formData.vehiculos?.[1]?.clase || '',
    vehicle_2_year: parseNumber(formData.vehiculos?.[1]?.modelo) || 0,
    vehicle_2_make: formData.vehiculos?.[1]?.marca || '',
    vehicle_2_model: formData.vehiculos?.[1]?.modelo || '',
    vehicle_2_value: parseNumber(formData.vehiculos?.[1]?.valorComercial) || 0,
    vehicle_2_registration_number: formData.vehiculos?.[1]?.placa || '',

    // Step 7: Referencias
    reference_1_name: formData.referencias?.[0]?.nombre || '',
    reference_1_relationship: formData.referencias?.[0]?.parentesco || '',
    reference_1_phone: formData.referencias?.[0]?.celular || '',
    reference_1_knows_client_years: parseNumber(formData.referencias?.[0]?.tiempoConocimiento) || 0,

    reference_2_name: formData.referencias?.[1]?.nombre || '',
    reference_2_relationship: formData.referencias?.[1]?.parentesco || '',
    reference_2_phone: formData.referencias?.[1]?.celular || '',
    reference_2_knows_client_years: parseNumber(formData.referencias?.[1]?.tiempoConocimiento) || 0,

    reference_3_name: formData.referencias?.[2]?.nombre || '',
    reference_3_relationship: formData.referencias?.[2]?.parentesco || '',
    reference_3_phone: formData.referencias?.[2]?.celular || '',
    reference_3_knows_client_years: parseNumber(formData.referencias?.[2]?.tiempoConocimiento) || 0,

    // Step 8: Balance General - Assets
    assets_cash_and_equivalents: parseNumber(formData.activos?.efectivo) || 0,
    assets_savings_accounts: parseNumber(formData.activos?.ahorros) || 0,
    assets_checking_accounts: parseNumber(formData.activos?.corriente) || 0,
    assets_accounts_receivable_trade: parseNumber(formData.activos?.cuentasXCobrar) || 0,
    assets_inventory_raw_materials: parseNumber(formData.activos?.inventarioMP) || 0,
    assets_inventory_finished_goods: parseNumber(formData.activos?.inventarioPT) || 0,
    assets_land: parseNumber(formData.activos?.terrenos) || 0,
    assets_buildings_structures: parseNumber(formData.activos?.construcciones) || 0,
    assets_furniture_fixtures: parseNumber(formData.activos?.mueblesFijos) || 0,
    assets_machinery_equipment: parseNumber(formData.activos?.maquinaria) || 0,
    assets_vehicles_fixed: parseNumber(formData.activos?.vehiculosActivos) || 0,

    // Step 8: Balance General - Liabilities
    liabilities_accounts_payable_trade: parseNumber(formData.pasivos?.cuentasXPagar) || 0,
    liabilities_short_term_loans: parseNumber(formData.pasivos?.creditosCortoPlazo) || 0,
    liabilities_long_term_loans: parseNumber(formData.pasivos?.creditosLargoPlazo) || 0,

    // Step 9: Income & Expenses (detailed)
    primary_income_source: mapped.primaryIncomeSource,
    primary_income_monthly: mapped.primaryIncomeMonthly,
    secondary_income_monthly: mapped.secondaryIncomeMonthly,
    household_expenses_monthly: mapped.householdExpensesMonthly,
    business_expenses_monthly: mapped.businessExpensesMonthly,
    debt_obligations_monthly: mapped.debtObligationsMonthly,

    // Step 11: Términos
    accept_terms: mapped.acceptTerms,
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
