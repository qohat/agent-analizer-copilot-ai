import { z } from 'zod'

/**
 * Client Personal Information Schema
 */
export const clientSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100),
  idNumber: z.string().min(5, 'El ID debe ser válido').max(20),
  idType: z.enum(['cedula', 'passport', 'dni', 'ruc']),
  dateOfBirth: z.string().datetime().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido'),
  email: z.string().email().optional(),
  maritalStatus: z.enum(['single', 'married', 'common_law', 'divorced', 'widowed']).optional(),
})

export type ClientInput = z.infer<typeof clientSchema>

/**
 * Business Information Schema
 */
export const businessSchema = z.object({
  businessName: z.string().min(2).max(200),
  businessType: z.enum(['sole_proprietor', 'cooperative', 'sas', 'farm']),
  businessSector: z.enum(['commerce', 'services', 'agriculture', 'livestock']),
  businessYearsOperating: z.number().min(0).max(100),
  businessMonthlySales: z.number().positive('Las ventas deben ser mayores a 0'),
})

export type BusinessInput = z.infer<typeof businessSchema>

/**
 * Income and Expenses Schema
 */
export const incomeExpensesSchema = z.object({
  clientMonthlyIncome: z.number().positive('El ingreso debe ser mayor a 0'),
  spouseMonthlyIncome: z.number().nonnegative().optional(),
  coapplicantMonthlyIncome: z.number().nonnegative().optional(),
  otherMonthlyIncome: z.number().nonnegative().optional(),

  monthlyPersonalExpenses: z.number().nonnegative(),
  monthlyBusinessExpenses: z.number().nonnegative(),
  monthlyOtherObligations: z.number().nonnegative(),
})

export type IncomeExpensesInput = z.infer<typeof incomeExpensesSchema>

/**
 * Application Base Schema (without refinements)
 */
const applicationBaseSchema = z.object({
  // Step 1: Client Personal Information
  clientFirstName: z.string().min(2).max(100),
  clientLastName: z.string().min(2).max(100),
  clientIdNumber: z.string().min(5).max(20),
  clientIdType: z.enum(['cedula', 'passport', 'dni', 'nit']),
  clientDateOfBirth: z.string().datetime().optional(),
  clientGender: z.enum(['male', 'female', 'other']).optional(),
  clientEducationLevel: z.enum(['primary', 'secondary', 'technical', 'university']).optional(),
  clientEmploymentStatus: z.enum(['employed', 'self_employed', 'unemployed', 'retired']),
  clientPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  clientEmail: z.string().email().optional(),
  addressStreet: z.string().min(5).max(200),
  addressCity: z.string().min(2).max(100),
  addressDepartment: z.string().min(2).max(100),
  maritalStatus: z.enum(['single', 'married', 'common_law', 'divorced', 'widowed']),

  // Step 2: Spouse/Co-obligor (optional)
  hasSpouse: z.boolean().default(false),
  spouseFirstName: z.string().min(2).max(100).optional(),
  spouseLastName: z.string().min(2).max(100).optional(),
  spouseIdNumber: z.string().min(5).max(20).optional(),
  spouseIdType: z.enum(['cedula', 'passport', 'dni', 'nit']).optional(),
  spousePhone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  spouseDateOfBirth: z.string().datetime().optional(),
  spouseEmail: z.string().email().optional(),
  spouseRelationship: z.enum(['spouse', 'co_obligor']).optional(),

  // Step 3: Business Information
  productType: z.enum(['commercial', 'agricultural']),
  businessName: z.string().min(2).max(200),
  businessRegistration: z.string().min(3).max(30).optional(),
  businessLegalForm: z.enum(['sole_proprietor', 'cooperative', 'sas', 'corporation']).optional(),
  businessDescription: z.string().min(10).max(500),
  businessAddressStreet: z.string().min(5).max(200).optional(),
  businessAddressCity: z.string().min(2).max(100).optional(),
  businessAddressDepartment: z.string().min(2).max(100).optional(),
  businessPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  businessMonthsInOperation: z.number().min(1).max(600),
  businessYearsOperating: z.number().min(0).max(100),
  businessEmployeesCount: z.number().min(0).max(10000).optional(),
  requestedAmount: z.number().positive('El monto debe ser mayor a 0'),
  loanTermMonths: z.number().min(3).max(120),

  // Assets (Optional)
  equipmentValue: z.number().nonnegative().optional(),
  propertyDetails: z.string().max(500).optional(),
  currentCashPosition: z.number().nonnegative().optional(),
  accountsReceivableDays: z.number().nonnegative().optional(),
  accountsReceivableAmount: z.number().nonnegative().optional(),
  accountsPayableDays: z.number().nonnegative().optional(),
  accountsPayableAmount: z.number().nonnegative().optional(),
  inventoryType: z.string().max(100).optional(),
  inventoryValue: z.number().nonnegative().optional(),
  inventoryDays: z.number().nonnegative().optional(),

  // Step 4: Income & Expenses - COMMERCIAL
  primaryIncomeSource: z.enum(['business', 'employment', 'other']),
  primaryIncomeMonthly: z.number().positive(),
  hasSecondaryIncome: z.boolean().default(false),
  secondaryIncomeMonthly: z.number().nonnegative().optional(),
  spouseIncomeSource: z.enum(['business', 'employment', 'other']).optional(),
  spouseIncomeMonthly: z.number().nonnegative().optional(),
  coapplicantIncomeSource: z.enum(['business', 'employment', 'other']).optional(),
  coapplicantIncomeMonthly: z.number().nonnegative().optional(),

  // Expenses - COMMERCIAL
  householdExpensesMonthly: z.number().nonnegative(),
  businessExpensesMonthly: z.number().nonnegative(),
  debtObligationsMonthly: z.number().nonnegative(),
  businessOwnerSalary: z.number().nonnegative().optional(),
  businessProfitMargin: z.number().min(0).max(100).optional(),
  utilitiesOperatingCosts: z.number().nonnegative().optional(),
  businessRent: z.number().nonnegative().optional(),
  insurancePayments: z.number().nonnegative().optional(),
  transportationCosts: z.number().nonnegative().optional(),
  professionalFees: z.number().nonnegative().optional(),
  maintenanceCosts: z.number().nonnegative().optional(),
  marketingAdvertising: z.number().nonnegative().optional(),
  savingsAmount: z.number().nonnegative().optional(),

  // Step 4: Income & Expenses - AGRICULTURAL
  cropLivestockType: z.string().max(100).optional(),
  lastHarvestAmount: z.number().nonnegative().optional(),
  marketPriceAverage: z.number().nonnegative().optional(),
  productionCostsPerCycle: z.number().nonnegative().optional(),
  productionCyclesPerYear: z.number().min(1).max(12).optional(),
  irrigationCosts: z.number().nonnegative().optional(),
  feedFertilizerCosts: z.number().nonnegative().optional(),
  veterinaryCosts: z.number().nonnegative().optional(),
  storagePostHarvestCosts: z.number().nonnegative().optional(),
  distributionTransportationCosts: z.number().nonnegative().optional(),

  // Step 5: Submission & Collateral
  notes: z.string().max(500).optional(),
  collateralType: z.enum(['none', 'real_estate', 'equipment', 'vehicles', 'inventory', 'other']).optional(),
  collateralValue: z.number().nonnegative().optional(),
  insuranceInterest: z.boolean().default(false),
  acceptTerms: z.boolean(),
})

/**
 * Application Creation Schema (with refinements)
 */
export const applicationCreateSchema = applicationBaseSchema.refine((data) => {
  // Spouse required if married
  if (data.maritalStatus === 'married' && !data.hasSpouse) {
    return false;
  }
  return true;
}, {
  message: 'Spouse information required for married applicants',
  path: ['hasSpouse'],
})

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>

/**
 * Application Update Schema (for draft updates - all fields optional)
 */
export const applicationUpdateSchema = applicationBaseSchema.partial()

export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>

/**
 * Application Submit Schema (trigger analysis)
 */
export const applicationSubmitSchema = z.object({
  applicationId: z.string().uuid('ID inválido'),
})

export type ApplicationSubmitInput = z.infer<typeof applicationSubmitSchema>

/**
 * Sync Request Schema (offline-first)
 */
export const syncRequestSchema = z.object({
  deviceId: z.string(),
  pendingOperations: z.array(
    z.object({
      id: z.string(),
      operation: z.enum(['create', 'update']),
      entity: z.enum(['application', 'client']),
      data: z.record(z.any()),
      createdOfflineAt: z.number(),
    })
  ),
  lastSyncTimestamp: z.number(),
})

export type SyncRequest = z.infer<typeof syncRequestSchema>

/**
 * Decision Schema (comité approval/rejection)
 */
export const decisionSchema = z.object({
  applicationId: z.string().uuid(),
  decision: z.enum(['approved', 'rejected']),
  notes: z.string().max(1000).optional(),
  reason: z.string().max(500).optional(),
})

export type DecisionInput = z.infer<typeof decisionSchema>

/**
 * Analysis Request Schema
 */
export const analysisRequestSchema = z.object({
  applicationId: z.string().uuid(),
  applicationType: z.enum(['commercial', 'agricultural']),
  clientMonthlyIncome: z.number().positive(),
  spouseMonthlyIncome: z.number().nonnegative().optional(),
  coapplicantMonthlyIncome: z.number().nonnegative().optional(),
  monthlyPersonalExpenses: z.number().nonnegative(),
  monthlyBusinessExpenses: z.number().nonnegative(),
  monthlyOtherObligations: z.number().nonnegative(),
  requestedAmount: z.number().positive(),
  requestedMonths: z.number().min(3).max(120),
  businessMonthlySales: z.number().nonnegative().optional(),
  businessYearsOperating: z.number().nonnegative().optional(),
  businessType: z.string().optional(),
})

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>

/**
 * STEP-BY-STEP VALIDATION SCHEMAS (MVP: 11-step form)
 * Each step validates independently for progressive validation
 */

// STEP 1: Datos de la Solicitud (5 fields)
export const applicationStep1Schema = z.object({
  solicitudNumero: z.string().optional(),
  solicitudFecha: z.string().datetime().optional(),
  solicitudAsesor: z.string().optional(),
  solicitudInstitucion: z.string().optional(),
  solicitudCanal: z.enum(['online', 'presencial', 'telefonica']).optional(),
}).partial()

export type ApplicationStep1Input = z.infer<typeof applicationStep1Schema>

// STEP 2: Tipo de Producto (1 field)
export const applicationStep2Schema = z.object({
  productType: z.enum(['commercial', 'agricultural'], {
    errorMap: () => ({ message: 'Selecciona un tipo de producto' })
  }),
}).strict()

export type ApplicationStep2Input = z.infer<typeof applicationStep2Schema>

// STEP 3: Información Personal & Domicilio (approx 20 fields)
export const applicationStep3Schema = z.object({
  // Client personal info
  clientFirstName: z.string().min(2, 'Nombre requerido').max(100),
  clientLastName: z.string().min(2, 'Apellido requerido').max(100),
  clientIdType: z.enum(['cedula', 'passport', 'dni', 'nit']),
  clientIdNumber: z.string().min(5, 'ID inválido').max(20),
  clientDateOfBirth: z.string().datetime().optional(),
  clientGender: z.enum(['male', 'female', 'other']).optional(),
  clientEducationLevel: z.enum(['primary', 'secondary', 'technical', 'university']).optional(),
  clientEmploymentStatus: z.enum(['employed', 'self_employed', 'unemployed', 'retired']),
  clientPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Teléfono inválido'),
  clientEmail: z.string().email('Email inválido').optional(),

  // Address
  addressStreet: z.string().min(5, 'Dirección incompleta').max(200),
  addressCity: z.string().min(2).max(100),
  addressDepartment: z.string().min(2).max(100),
  addressPostalCode: z.string().max(20).optional(),
  addressNeighborhood: z.string().max(100).optional(),

  // Housing info
  residenceType: z.enum(['propia', 'arrendada', 'familiar', 'prestada']).optional(),
  addressResidentialTimeMonths: z.number().nonnegative().optional(),
  addressRentMonthlyAmount: z.number().nonnegative().optional(),
  addressMortgageMonthlyAmount: z.number().nonnegative().optional(),

  // Marital
  maritalStatus: z.enum(['single', 'married', 'common_law', 'divorced', 'widowed']),
}).partial().required({
  clientFirstName: true,
  clientLastName: true,
  clientIdType: true,
  clientIdNumber: true,
  clientEmploymentStatus: true,
  clientPhone: true,
  addressStreet: true,
  addressCity: true,
  addressDepartment: true,
  maritalStatus: true,
})

export type ApplicationStep3Input = z.infer<typeof applicationStep3Schema>

// STEP 4: Información Conyugal (conditional, 18 fields if married)
export const applicationStep4Schema = z.object({
  hasSpouse: z.boolean().default(false),
  spouseFirstName: z.string().min(2).max(100).optional(),
  spouseLastName: z.string().min(2).max(100).optional(),
  spouseIdType: z.enum(['cedula', 'passport', 'dni', 'nit']).optional(),
  spouseIdNumber: z.string().min(5).max(20).optional(),
  spouseDateOfBirth: z.string().datetime().optional(),
  spousePhone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  spouseEmail: z.string().email().optional(),
  spouseSameAddress: z.boolean().optional(),
  spouseEmployed: z.boolean().optional(),
  spouseIncomeSource: z.string().optional(),
  spouseMonthlyIncome: z.number().nonnegative().optional(),
  spouseMonthlyIncomeSecondary: z.number().nonnegative().optional(),
  spouseEmploymentStatus: z.string().optional(),
  spouseProfessionalActivities: z.string().optional(),
  spouseDebtObligationsMonthly: z.number().nonnegative().optional(),
}).partial()

export type ApplicationStep4Input = z.infer<typeof applicationStep4Schema>

// STEP 5: Información Empresarial (14 fields)
export const applicationStep5Schema = z.object({
  businessName: z.string().min(2).max(200).optional(),
  businessType: z.enum(['sole_proprietor', 'cooperative', 'sas', 'corporation', 'farm']).optional(),
  businessLegalForm: z.enum(['natural_person', 'juridical_person']).optional(),
  businessSector: z.enum(['commerce', 'services', 'agriculture', 'livestock', 'other']).optional(),
  businessDescription: z.string().max(500).optional(),
  businessRegistrationNumber: z.string().optional(),
  businessRegistrationDate: z.string().datetime().optional(),
  businessAddressSameAsResidential: z.boolean().default(false),
  businessAddressStreet: z.string().max(200).optional(),
  businessAddressCity: z.string().max(100).optional(),
  businessAddressDepartment: z.string().max(100).optional(),
  businessPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  businessYearsOperating: z.number().min(0).max(100).optional(),
  businessMonthsOperating: z.number().min(0).max(1200).optional(),
}).partial()

export type ApplicationStep5Input = z.infer<typeof applicationStep5Schema>

// STEP 6: Bienes Raíces (real estate array + vehicles array + references)
export const applicationStep6Schema = z.object({
  realEstateCount: z.number().min(0).max(5).default(0),
  realEstate1Description: z.string().optional(),
  realEstate1Location: z.string().optional(),
  realEstate1EstimatedValue: z.number().nonnegative().optional(),
  realEstate1DebtValue: z.number().nonnegative().optional(),
  realEstate1OwnershipPercent: z.number().min(0).max(100).optional(),

  realEstate2Description: z.string().optional(),
  realEstate2Location: z.string().optional(),
  realEstate2EstimatedValue: z.number().nonnegative().optional(),
  realEstate2DebtValue: z.number().nonnegative().optional(),
  realEstate2OwnershipPercent: z.number().min(0).max(100).optional(),

  vehiclesCount: z.number().min(0).max(2).default(0),
  vehicle1Type: z.string().optional(),
  vehicle1Year: z.number().min(1900).max(2100).optional(),
  vehicle1Make: z.string().optional(),
  vehicle1Model: z.string().optional(),
  vehicle1Value: z.number().nonnegative().optional(),
  vehicle1DebtValue: z.number().nonnegative().optional(),

  vehicle2Type: z.string().optional(),
  vehicle2Year: z.number().min(1900).max(2100).optional(),
  vehicle2Make: z.string().optional(),
  vehicle2Model: z.string().optional(),
  vehicle2Value: z.number().nonnegative().optional(),
  vehicle2DebtValue: z.number().nonnegative().optional(),

  reference1Name: z.string().optional(),
  reference1Relationship: z.string().optional(),
  reference1Phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),

  reference2Name: z.string().optional(),
  reference2Relationship: z.string().optional(),
  reference2Phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),

  reference3Name: z.string().optional(),
  reference3Relationship: z.string().optional(),
  reference3Phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
}).partial()

export type ApplicationStep6Input = z.infer<typeof applicationStep6Schema>

// STEP 7-8: Balance Sheet & Financial Data (~60 fields combined)
export const applicationStep78Schema = z.object({
  // Current Assets
  cashAndEquivalents: z.number().nonnegative().optional(),
  savingsAccounts: z.number().nonnegative().optional(),
  checkingAccounts: z.number().nonnegative().optional(),
  moneyMarketAccounts: z.number().nonnegative().optional(),
  shortTermInvestments: z.number().nonnegative().optional(),
  accountsReceivableTrade: z.number().nonnegative().optional(),
  accountsReceivableOther: z.number().nonnegative().optional(),
  inventoryRawMaterials: z.number().nonnegative().optional(),
  inventoryFinishedGoods: z.number().nonnegative().optional(),
  inventoryMerchandise: z.number().nonnegative().optional(),
  prepaidExpenses: z.number().nonnegative().optional(),

  // Fixed Assets
  land: z.number().nonnegative().optional(),
  buildingsStructures: z.number().nonnegative().optional(),
  furnitureFixtures: z.number().nonnegative().optional(),
  machineryEquipment: z.number().nonnegative().optional(),
  vehiclesFixed: z.number().nonnegative().optional(),
  accumulatedDepreciation: z.number().nonnegative().optional(),
  intangibleGoodwill: z.number().nonnegative().optional(),

  // Current Liabilities
  accountsPayableTrade: z.number().nonnegative().optional(),
  accountsPayableOther: z.number().nonnegative().optional(),
  shortTermLoans: z.number().nonnegative().optional(),
  creditCardBalances: z.number().nonnegative().optional(),
  currentPortionLtDebt: z.number().nonnegative().optional(),
  payrollAccrued: z.number().nonnegative().optional(),
  taxesAccrued: z.number().nonnegative().optional(),

  // Long Term Liabilities
  longTermLoans: z.number().nonnegative().optional(),
  mortgageDebt: z.number().nonnegative().optional(),
  equipmentFinancing: z.number().nonnegative().optional(),
  bondPayable: z.number().nonnegative().optional(),
}).partial()

export type ApplicationStep78Input = z.infer<typeof applicationStep78Schema>

// STEP 9: Income & Expenses (~50 fields)
export const applicationStep9Schema = z.object({
  // Client Income
  incomeClientBusinessOperations: z.number().nonnegative().optional(),
  incomeClientEmploymentSalary: z.number().nonnegative().optional(),
  incomeClientSelfEmployment: z.number().nonnegative().optional(),
  incomeClientRentals: z.number().nonnegative().optional(),
  incomeClientDividendsInterest: z.number().nonnegative().optional(),
  incomeClientPension: z.number().nonnegative().optional(),
  incomeClientGovernmentAssistance: z.number().nonnegative().optional(),
  incomeClientOther: z.number().nonnegative().optional(),

  // Spouse Income
  incomeSpouseBusinessOperations: z.number().nonnegative().optional(),
  incomeSpouseEmploymentSalary: z.number().nonnegative().optional(),
  incomeSpouseSelfEmployment: z.number().nonnegative().optional(),
  incomeSpouseRentals: z.number().nonnegative().optional(),
  incomeSpouseDividendsInterest: z.number().nonnegative().optional(),
  incomeSpousePension: z.number().nonnegative().optional(),
  incomeSpouseGovernmentAssistance: z.number().nonnegative().optional(),
  incomeSpouseOther: z.number().nonnegative().optional(),

  // Household Expenses
  householdHousingRentMortgage: z.number().nonnegative().optional(),
  householdUtilitiesElectricity: z.number().nonnegative().optional(),
  householdUtilitiesWater: z.number().nonnegative().optional(),
  householdUtilitiesGas: z.number().nonnegative().optional(),
  householdUtilitiesInternet: z.number().nonnegative().optional(),
  householdFoodGroceries: z.number().nonnegative().optional(),
  householdTransportationPublic: z.number().nonnegative().optional(),
  householdTransportationVehicleFuel: z.number().nonnegative().optional(),
  householdTransportationMaintenance: z.number().nonnegative().optional(),
  householdTransportationInsurance: z.number().nonnegative().optional(),
  householdEducationTuition: z.number().nonnegative().optional(),
  householdEducationSupplies: z.number().nonnegative().optional(),
  householdHealthcareInsurance: z.number().nonnegative().optional(),
  householdHealthcareMedications: z.number().nonnegative().optional(),
  householdHealthcareOther: z.number().nonnegative().optional(),
  householdChildcare: z.number().nonnegative().optional(),
  householdPersonalGrooming: z.number().nonnegative().optional(),
  householdClothing: z.number().nonnegative().optional(),
  householdRecreationEntertainment: z.number().nonnegative().optional(),
  householdPhoneCellular: z.number().nonnegative().optional(),
  householdSubscriptions: z.number().nonnegative().optional(),
  householdPetCare: z.number().nonnegative().optional(),
  householdPersonalCare: z.number().nonnegative().optional(),
  householdMiscellaneous: z.number().nonnegative().optional(),
}).partial()

export type ApplicationStep9Input = z.infer<typeof applicationStep9Schema>

// STEP 10: Propuesta de Crédito (credit terms and capacity)
export const applicationStep10Schema = z.object({
  paymentCapacityMonthly: z.number().nonnegative().optional(),
  paymentCapacityPercent: z.number().min(0).max(100).optional(),
  debtToIncomeRatio: z.number().min(0).max(1).optional(),
  requestedMonthlyPayment: z.number().nonnegative().optional(),
}).partial()

export type ApplicationStep10Input = z.infer<typeof applicationStep10Schema>

// STEP 11: Propuesta Asesor & Decisión (final submission and decision fields)
export const applicationStep11Schema = z.object({
  requestedAmount: z.number().positive('El monto debe ser mayor a 0'),
  requestedMonths: z.number().min(3).max(120),
  requestedPurpose: z.string().optional(),
  requestedUseDetail: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected']).default('draft'),
  notes: z.string().max(1000).optional(),
  acceptTerms: z.boolean().default(false),
}).partial().required({
  requestedAmount: true,
  requestedMonths: true,
})

export type ApplicationStep11Input = z.infer<typeof applicationStep11Schema>
