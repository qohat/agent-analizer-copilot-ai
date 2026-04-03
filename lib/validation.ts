import { z } from 'zod'

// Multi-step application form schemas
export const applicationStep1Schema = z.object({
  clientFirstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-záéíóúñ\s]+$/i, 'El nombre solo debe contener letras y espacios'),
  clientLastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres')
    .regex(/^[a-záéíóúñ\s]+$/i, 'El apellido solo debe contener letras y espacios'),
  clientIdType: z.enum(['cedula', 'passport', 'dni', 'nit'], {
    errorMap: () => ({ message: 'Tipo de ID inválido' })
  }),
  clientIdNumber: z.string()
    .regex(/^\d+$/, 'Solo números permitidos en el ID')
    .min(5, 'El ID debe tener al menos 5 dígitos')
    .max(20, 'El ID no puede exceder 20 dígitos'),
  clientDateOfBirth: z.string()
    .refine((date) => {
      const d = new Date(date)
      const age = new Date().getFullYear() - d.getFullYear()
      return age >= 18 && age <= 100
    }, 'Debes ser mayor de 18 años y menor de 100'),
  clientPhone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Teléfono inválido (ej: +573001234567 o 3001234567)'),
  clientEmail: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  addressStreet: z.string()
    .min(5, 'Dirección debe tener al menos 5 caracteres')
    .max(100, 'Dirección muy larga'),
  addressCity: z.string()
    .min(2, 'Ciudad requerida')
    .max(50, 'Nombre de ciudad muy largo'),
  addressDepartment: z.string()
    .min(2, 'Departamento requerido'),
  // From Excel: Solicitud de Crédito, Section 4 - Residence Data
  addressPostalCode: z.string()
    .regex(/^[0-9a-zA-Z\-\s]*$/, 'Código postal inválido')
    .max(10, 'Código postal muy largo')
    .optional(),
  // From Excel: Solicitud de Crédito, Section 4 - Housing Type
  residenceType: z.enum(['propia', 'arrendada', 'familiar'], {
    errorMap: () => ({ message: 'Tipo de vivienda inválido' })
  }).optional(),
  // From Excel: Solicitud de Crédito, Section 4 - Years of Residence
  residenceYears: z.number()
    .int('Años debe ser un número entero')
    .min(0, 'Años no puede ser negativo')
    .max(100, 'Años inválido')
    .optional(),
  // From Excel: Solicitud de Crédito, Section 4 - Landlord Name (conditional)
  landlordName: z.string()
    .max(100, 'Nombre muy largo')
    .optional(),
  // From Excel: Solicitud de Crédito, Section 4 - Rent Amount (conditional)
  rentAmount: z.number()
    .nonnegative('El monto no puede ser negativo')
    .optional(),
  maritalStatus: z.enum(['single', 'married', 'common_law', 'divorced', 'widowed'], {
    errorMap: () => ({ message: 'Estado civil inválido' })
  }),
}).refine((data) => {
  // If residence type is 'arrendada', landlord name and rent are required
  if (data.residenceType === 'arrendada') {
    return data.landlordName && data.rentAmount !== undefined
  }
  return true
}, {
  message: 'Nombre del propietario y monto de arrendamiento son requeridos si la vivienda es arrendada',
  path: ['landlordName']
})

export const applicationStep2Schema = z.object({
  hasSpouse: z.boolean(),
  spouseFirstName: z.string()
    .min(2, 'Nombre requerido')
    .max(100)
    .regex(/^[a-záéíóúñ\s]+$/i, 'Solo letras permitidas')
    .optional()
    .or(z.literal('')),
  spouseLastName: z.string()
    .min(2, 'Apellido requerido')
    .max(100)
    .regex(/^[a-záéíóúñ\s]+$/i, 'Solo letras permitidas')
    .optional()
    .or(z.literal('')),
  spouseIdType: z.enum(['cedula', 'passport', 'dni', 'nit']).optional(),
  spouseIdNumber: z.string()
    .regex(/^\d+$/, 'Solo números permitidos')
    .min(5, 'ID debe tener al menos 5 dígitos')
    .max(20)
    .optional()
    .or(z.literal('')),
  spousePhone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  spouseEmail: z.string()
    .email('Correo electrónico inválido')
    .optional()
    .or(z.literal('')),
  // From Excel: Solicitud de Crédito, Section 6 - Spouse Date of Birth (CRITICAL - was missing)
  spouseDateOfBirth: z.string()
    .refine((date) => {
      if (!date) return true
      const d = new Date(date)
      const age = new Date().getFullYear() - d.getFullYear()
      return age >= 18 && age <= 100
    }, 'Debe ser mayor de 18 años y menor de 100')
    .optional(),
  // From Excel: Solicitud de Crédito, Section 6 - Spouse ID Issue City
  spouseIdIssuedCity: z.string().optional().or(z.literal('')),
  // From Excel: Solicitud de Crédito, Section 6 - Spouse ID Issue Date
  spouseIdIssuedDate: z.string().optional().or(z.literal('')),
  // From Excel: Solicitud de Crédito, Section 6 - Relationship type
  spouseRelationship: z.enum(['spouse', 'co_obligor']).optional(),
  // From Excel: Solicitud de Crédito, Section 7 - Co-applicant Optional
  hasCoapplicant: z.boolean().default(false),
  coapplicantFirstName: z.string()
    .min(2, 'Nombre requerido')
    .max(100)
    .regex(/^[a-záéíóúñ\s]+$/i, 'Solo letras permitidas')
    .optional()
    .or(z.literal('')),
  coapplicantLastName: z.string()
    .min(2, 'Apellido requerido')
    .max(100)
    .regex(/^[a-záéíóúñ\s]+$/i, 'Solo letras permitidas')
    .optional()
    .or(z.literal('')),
  coapplicantIdType: z.enum(['cedula', 'passport', 'dni', 'nit']).optional(),
  coapplicantIdNumber: z.string()
    .regex(/^\d+$/, 'Solo números permitidos')
    .min(5, 'ID debe tener al menos 5 dígitos')
    .max(20)
    .optional()
    .or(z.literal('')),
  coapplicantPhone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  coapplicantEmail: z.string()
    .email('Correo electrónico inválido')
    .optional()
    .or(z.literal('')),
  coapplicantDateOfBirth: z.string()
    .refine((date) => {
      if (!date) return true
      const d = new Date(date)
      const age = new Date().getFullYear() - d.getFullYear()
      return age >= 18 && age <= 100
    }, 'Debe ser mayor de 18 años y menor de 100')
    .optional(),
}).refine((data) => {
  if (data.hasSpouse) {
    return data.spouseFirstName && data.spouseLastName && data.spouseIdNumber && data.spouseIdType && data.spousePhone
  }
  return true
}, {
  message: 'Todos los campos del cónyuge son requeridos si existe co-obligado',
  path: ['spouseFirstName']
}).refine((data) => {
  if (data.hasCoapplicant) {
    return data.coapplicantFirstName && data.coapplicantLastName && data.coapplicantIdNumber && data.coapplicantIdType && data.coapplicantPhone
  }
  return true
}, {
  message: 'Todos los campos del co-deudor son requeridos si existe co-deudor',
  path: ['coapplicantFirstName']
})

export const applicationStep3Schema = z.object({
  productType: z.enum(['commercial', 'agricultural'], {
    errorMap: () => ({ message: 'Selecciona un tipo de crédito válido' })
  }),
  businessName: z.string()
    .min(2, 'Nombre del negocio debe tener al menos 2 caracteres')
    .max(200, 'Nombre del negocio muy largo')
    .trim(),
  businessDescription: z.string()
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(1000, 'Descripción muy larga')
    .trim(),
  // From Excel: Solicitud de Crédito, Section 5 - Business Type (CRITICAL - was missing)
  businessType: z.enum(['formal', 'informal'], {
    errorMap: () => ({ message: 'Tipo de negocio inválido' })
  }).optional(),
  // From Excel: Solicitud de Crédito, Section 5 - Business Sector (CRITICAL - was missing)
  businessSector: z.string()
    .min(2, 'Sector requerido')
    .max(100, 'Sector muy largo')
    .optional(),
  // From Excel: Solicitud de Crédito, Section 5 - Business Monthly Sales (CRITICAL - was missing)
  businessMonthlySales: z.number()
    .nonnegative('Ventas mensuales no pueden ser negativas')
    .optional(),
  businessMonthsInOperation: z.number()
    .int('Meses debe ser un número entero')
    .min(0, 'Meses no puede ser negativo')
    .max(600, 'Meses inválido'),
  businessLocationCity: z.string()
    .min(2, 'Ciudad requerida')
    .max(50, 'Nombre de ciudad muy largo'),
  // From Excel: Solicitud de Crédito, Section 5 - Business Same Address
  businessSameAddress: z.boolean().default(false),
  // From Excel: Solicitud de Crédito, Section 5 - Business Address (conditional)
  businessAddressDepartment: z.string().optional().or(z.literal('')),
  businessAddressCity: z.string().optional().or(z.literal('')),
  businessAddressStreet: z.string().optional().or(z.literal('')),
  businessAddressNeighborhood: z.string().optional().or(z.literal('')),
  // From Excel: Solicitud de Crédito, Section 5 - Business Location Type
  businessLocationType: z.enum(['propio', 'arrendado', 'familiar']).optional(),
  // From Excel: Solicitud de Crédito, Section 5 - Business Landlord Name (conditional)
  businessLandlordName: z.string().optional().or(z.literal('')),
  // From Excel: Solicitud de Crédito, Section 5 - Business Rent Amount (conditional)
  businessRentAmount: z.number().optional(),
  // From Excel: Solicitud de Crédito, Section 1 - Loan Purpose (CRITICAL - was missing)
  loanPurpose: z.string()
    .max(200, 'Propósito muy largo')
    .optional(),
  requestedAmount: z.number()
    .positive('Monto debe ser mayor a 0')
    .max(50000, 'Monto máximo es $50,000'),
  loanTermMonths: z.number()
    .int('Plazo debe ser número entero')
    .positive('Plazo debe ser mayor a 0')
    .min(3, 'Plazo mínimo es 3 meses')
    .max(60, 'Plazo máximo es 60 meses'),
}).refine((data) => {
  if (!data.businessSameAddress) {
    return data.businessAddressCity && data.businessAddressStreet
  }
  return true
}, {
  message: 'Dirección del negocio es requerida si es diferente a la dirección del cliente',
  path: ['businessAddressCity']
}).refine((data) => {
  if (data.businessLocationType === 'arrendado') {
    return data.businessLandlordName && data.businessRentAmount !== undefined
  }
  return true
}, {
  message: 'Nombre del propietario y monto de arrendamiento son requeridos si el local es arrendado',
  path: ['businessLandlordName']
})

export const applicationStep4Schema = z.object({
  primaryIncomeSource: z.enum(['business', 'employment', 'other'], {
    errorMap: () => ({ message: 'Selecciona una fuente de ingreso válida' })
  }),
  primaryIncomeMonthly: z.number()
    .positive('Ingreso principal debe ser mayor a 0')
    .max(100000000, 'Ingreso muy alto'),
  hasSecondaryIncome: z.boolean(),
  secondaryIncomeMonthly: z.number()
    .nonnegative('Ingreso adicional no puede ser negativo')
    .max(100000000, 'Ingreso muy alto')
    .optional()
    .default(0),
  // From Excel: Solicitud de Crédito, Section 11 - Spouse Income (CRITICAL - was missing)
  spouseIncomeMonthly: z.number()
    .nonnegative('Ingreso del cónyuge no puede ser negativo')
    .max(100000000, 'Ingreso muy alto')
    .optional()
    .default(0),
  // From Excel: Solicitud de Crédito, Section 11 - Other Income
  spouseOtherIncomeMonthly: z.number()
    .nonnegative('Otros ingresos no pueden ser negativos')
    .max(100000000, 'Ingresos muy altos')
    .optional()
    .default(0),
  // From Excel: Solicitud de Crédito, Section 11 - Co-applicant Income
  coapplicantMonthlyIncome: z.number()
    .nonnegative('Ingreso del co-deudor no puede ser negativo')
    .max(100000000, 'Ingreso muy alto')
    .optional()
    .default(0),
  // From Excel: Solicitud de Crédito, Section 11 - Expenses (9 detailed categories)
  expenseHousing: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  expenseFood: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  expenseUtilities: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  expenseTransport: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  expenseEducation: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  expenseHealth: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  expenseClothing: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  expenseRecreation: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  expenseOther: z.number().nonnegative('Gasto no puede ser negativo').optional().default(0),
  // Legacy fields (keeping for backward compatibility)
  householdExpensesMonthly: z.number()
    .nonnegative('Gastos no pueden ser negativos')
    .max(100000000, 'Gastos muy altos'),
  businessExpensesMonthly: z.number()
    .nonnegative('Gastos no pueden ser negativos')
    .max(100000000, 'Gastos muy altos'),
  debtObligationsMonthly: z.number()
    .nonnegative('Deudas no pueden ser negativas')
    .max(100000000, 'Deudas muy altas'),
  savingsAmount: z.number()
    .nonnegative('Ahorros no pueden ser negativos')
    .max(1000000000, 'Ahorros muy altos'),
  // From Excel: Solicitud de Crédito, Section 10 - Balance Sheet - Assets
  assetCash: z.number().nonnegative('Activo no puede ser negativo').optional().default(0),
  assetAccountsReceivable: z.number().nonnegative('Activo no puede ser negativo').optional().default(0),
  assetInventory: z.number().nonnegative('Activo no puede ser negativo').optional().default(0),
  assetBusinessValue: z.number().nonnegative('Activo no puede ser negativo').optional().default(0),
  assetMachinery: z.number().nonnegative('Activo no puede ser negativo').optional().default(0),
  assetVehicles: z.number().nonnegative('Activo no puede ser negativo').optional().default(0),
  assetOther: z.number().nonnegative('Activo no puede ser negativo').optional().default(0),
  // From Excel: Solicitud de Crédito, Section 10 - Balance Sheet - Liabilities
  liabilityShortTerm: z.number().nonnegative('Pasivo no puede ser negativo').optional().default(0),
  liabilitySuppliers: z.number().nonnegative('Pasivo no puede ser negativo').optional().default(0),
  liabilityLongTerm: z.number().nonnegative('Pasivo no puede ser negativo').optional().default(0),
  // From Excel: Solicitud de Crédito, Section 8 - Collateral/Guarantees (optional)
  collateralPropertyType: z.enum(['casa', 'apartamento', 'lote', 'finca']).optional(),
  collateralAppraisalValue: z.number().optional(),
  collateralCity: z.string().optional().or(z.literal('')),
  collateralAddress: z.string().optional().or(z.literal('')),
  collateralRegistryNumber: z.string().optional().or(z.literal('')),
  collateralDocumentDate: z.string().optional().or(z.literal('')),
  // From Excel: Solicitud de Crédito, Section 9 - References (3 required)
  reference1Name: z.string().optional().or(z.literal('')),
  reference1Phone: z.string().optional().or(z.literal('')),
  reference1Address: z.string().optional().or(z.literal('')),
  reference1Relationship: z.string().optional().or(z.literal('')),
  reference2Name: z.string().optional().or(z.literal('')),
  reference2Phone: z.string().optional().or(z.literal('')),
  reference2Address: z.string().optional().or(z.literal('')),
  reference2Relationship: z.string().optional().or(z.literal('')),
  reference3Name: z.string().optional().or(z.literal('')),
  reference3Phone: z.string().optional().or(z.literal('')),
  reference3Address: z.string().optional().or(z.literal('')),
  reference3Relationship: z.string().optional().or(z.literal('')),
}).refine((data) => {
  const totalIncome = (data.primaryIncomeMonthly || 0) + (data.secondaryIncomeMonthly || 0) +
                      (data.spouseIncomeMonthly || 0) + (data.coapplicantMonthlyIncome || 0)
  const totalExpenses = (data.householdExpensesMonthly || 0) +
                        (data.businessExpensesMonthly || 0) +
                        (data.debtObligationsMonthly || 0)
  return totalIncome > totalExpenses
}, {
  message: 'Ingreso total debe ser mayor que gastos totales',
  path: ['primaryIncomeMonthly']
})

export const applicationStep5Schema = z.object({
  notes: z.string()
    .max(1000, 'Notas no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  acceptTerms: z.boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones para continuar'
    }),
})

export type ApplicationStep1 = z.infer<typeof applicationStep1Schema>
export type ApplicationStep2 = z.infer<typeof applicationStep2Schema>
export type ApplicationStep3 = z.infer<typeof applicationStep3Schema>
export type ApplicationStep4 = z.infer<typeof applicationStep4Schema>
export type ApplicationStep5 = z.infer<typeof applicationStep5Schema>
