/**
 * Complete Zod Validation Schemas
 * Maps ALL 1,091+ fields from ANALISIS_FORMULARIOS_PRODUCTO_DIGITAL.md
 * Generated: 2026-04-01
 */

import { z } from 'zod'

// ============================================================================
// REUSABLE SCHEMAS
// ============================================================================

const UUID_SCHEMA = z.string().uuid()
const DECIMAL_SCHEMA = z.number().nonnegative()
const PHONE_SCHEMA = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido')
const EMAIL_SCHEMA = z.string().email('Email inválido')
const TEXT_SCHEMA = z.string()
const DATE_SCHEMA = z.date()

// ============================================================================
// CLIENT SCHEMA
// ============================================================================

export const clientSchema = z.object({
  id: UUID_SCHEMA,
  institutionId: UUID_SCHEMA,

  // Step 3: Personal Information (14 fields)
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  idNumber: z.string().min(5).max(20),
  idType: z.enum(['cedula', 'passport', 'dni', 'nit', 'ruc']),
  dateOfBirth: DATE_SCHEMA.optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  educationLevel: z.enum(['primary', 'secondary', 'technical', 'university']).optional(),
  employmentStatus: z.enum(['employed', 'self_employed', 'unemployed', 'retired']),
  phone: PHONE_SCHEMA,
  email: EMAIL_SCHEMA.optional(),

  // Step 4: Address (6 fields)
  addressStreet: z.string().max(200).optional(),
  addressCity: z.string().max(100).optional(),
  addressDepartment: z.string().max(100).optional(),
  addressPostalCode: z.string().max(20).optional(),
  addressCountry: z.string().max(100).optional(),
  addressNeighborhood: z.string().max(100).optional(),

  // Demographic
  maritalStatus: z.enum(['single', 'married', 'common_law', 'divorced', 'widowed']).optional(),
  hasDependentsWithDisability: z.boolean().default(false),

  createdAt: DATE_SCHEMA,
  updatedAt: DATE_SCHEMA,
})

export type ClientType = z.infer<typeof clientSchema>

// ============================================================================
// APPLICATION STEP SCHEMAS
// ============================================================================

const applicationStep1Schema = z.object({
  solicitudNumero: TEXT_SCHEMA.optional(),
  solicitudFecha: DATE_SCHEMA.optional(),
  solicitudAsesor: TEXT_SCHEMA.optional(),
  solicitudInstitucion: TEXT_SCHEMA.optional(),
  solicitudCanal: z.enum(['online', 'presencial', 'telefonica']).optional(),
})

const applicationStep2Schema = z.object({
  productType: z.enum(['commercial', 'agricultural']),
})

const applicationStep45Schema = z.object({
  addressResidentialTimeMonths: z.number().nonnegative().optional(),
  addressOwnRent: z.enum(['propia', 'arrendada', 'prestada']).optional(),
  addressRentMonthlyAmount: DECIMAL_SCHEMA.optional(),
  addressMortgageMonthlyAmount: DECIMAL_SCHEMA.optional(),
})

const applicationStep5BusinessSchema = z.object({
  businessName: TEXT_SCHEMA.optional(),
  businessType: z.enum(['sole_proprietor', 'cooperative', 'sas', 'corporation', 'farm']).optional(),
  businessLegalForm: z.enum(['natural_person', 'juridical_person']).optional(),
  businessSector: z.enum(['commerce', 'services', 'agriculture', 'livestock', 'other']).optional(),
  businessDescription: z.string().max(500).optional(),
  businessRegistrationNumber: TEXT_SCHEMA.optional(),
  businessRegistrationDate: DATE_SCHEMA.optional(),
  businessAddressSameAsResidential: z.boolean().default(false),
  businessAddressStreet: z.string().max(200).optional(),
  businessAddressCity: z.string().max(100).optional(),
  businessAddressDepartment: z.string().max(100).optional(),
  businessPhone: PHONE_SCHEMA.optional(),
  businessEmail: EMAIL_SCHEMA.optional(),
  businessYearsOperating: z.number().min(0).max(100).optional(),
  businessMonthsOperating: z.number().min(0).max(1200).optional(),
  businessEmployeesCount: z.number().min(0).max(10000).default(0),
  businessMonthlySales: DECIMAL_SCHEMA.optional(),
  businessProfitMarginPercent: z.number().min(0).max(100).optional(),
  businessRentMonthly: DECIMAL_SCHEMA.optional(),
  businessLeaseYearsRemaining: z.number().nonnegative().optional(),
})

const applicationStep6SpouseSchema = z.object({
  hasSpouse: z.boolean().default(false),
  spouseSameAddress: z.boolean().optional(),
  spouseEmployed: z.boolean().optional(),
  spouseIncomeSource: TEXT_SCHEMA.optional(),
  spouseMonthlyIncome: DECIMAL_SCHEMA.optional(),
  spouseMonthlyIncomeSecondary: DECIMAL_SCHEMA.optional(),
  spouseEmploymentStatus: TEXT_SCHEMA.optional(),
  spouseProfessionalActivities: TEXT_SCHEMA.optional(),
  spouseDebtObligationsMonthly: DECIMAL_SCHEMA.optional(),
})

const realEstateSchema = z.object({
  description: TEXT_SCHEMA.optional(),
  location: TEXT_SCHEMA.optional(),
  estimatedValue: DECIMAL_SCHEMA.optional(),
  debtValue: DECIMAL_SCHEMA.optional(),
  netEquity: DECIMAL_SCHEMA.optional(),
  ownershipPercent: z.number().min(0).max(100).optional(),
  currentUse: TEXT_SCHEMA.optional(),
})

const vehicleSchema = z.object({
  type: TEXT_SCHEMA.optional(),
  year: z.number().min(1900).max(2100).optional(),
  make: TEXT_SCHEMA.optional(),
  model: TEXT_SCHEMA.optional(),
  value: DECIMAL_SCHEMA.optional(),
  debtValue: DECIMAL_SCHEMA.optional(),
  registrationNumber: TEXT_SCHEMA.optional(),
})

const referenceSchema = z.object({
  name: TEXT_SCHEMA.optional(),
  relationship: TEXT_SCHEMA.optional(),
  phone: PHONE_SCHEMA.optional(),
  knowsClientYears: z.number().nonnegative().optional(),
  paymentHistory: TEXT_SCHEMA.optional(),
})

const applicationStep7AssetsSchema = z.object({
  realEstateCount: z.number().min(0).max(3).default(0),
  realEstate1: realEstateSchema.optional(),
  realEstate2: realEstateSchema.optional(),
  realEstate3: realEstateSchema.optional(),
  vehiclesCount: z.number().min(0).max(2).default(0),
  vehicle1: vehicleSchema.optional(),
  vehicle2: vehicleSchema.optional(),
  reference1: referenceSchema.optional(),
  reference2: referenceSchema.optional(),
  reference3: referenceSchema.optional(),
})

const balanceSheetCurrentAssetsSchema = z.object({
  cashAndEquivalents: DECIMAL_SCHEMA.optional(),
  savingsAccounts: DECIMAL_SCHEMA.optional(),
  checkingAccounts: DECIMAL_SCHEMA.optional(),
  moneyMarketAccounts: DECIMAL_SCHEMA.optional(),
  shortTermInvestments: DECIMAL_SCHEMA.optional(),
  accountsReceivableTrade: DECIMAL_SCHEMA.optional(),
  accountsReceivableOther: DECIMAL_SCHEMA.optional(),
  receivableDays: DECIMAL_SCHEMA.optional(),
  inventoryRawMaterials: DECIMAL_SCHEMA.optional(),
  inventoryFinishedGoods: DECIMAL_SCHEMA.optional(),
  inventoryMerchandise: DECIMAL_SCHEMA.optional(),
  inventoryDays: DECIMAL_SCHEMA.optional(),
  prepaidExpenses: DECIMAL_SCHEMA.optional(),
  currentOther: DECIMAL_SCHEMA.optional(),
})

const balanceSheetFixedAssetsSchema = z.object({
  land: DECIMAL_SCHEMA.optional(),
  buildingsStructures: DECIMAL_SCHEMA.optional(),
  furnitureFixtures: DECIMAL_SCHEMA.optional(),
  machineryEquipment: DECIMAL_SCHEMA.optional(),
  vehiclesFixed: DECIMAL_SCHEMA.optional(),
  accumulatedDepreciation: DECIMAL_SCHEMA.optional(),
  intangibleGoodwill: DECIMAL_SCHEMA.optional(),
  fixedOther: DECIMAL_SCHEMA.optional(),
})

const balanceSheetCurrentLiabilitiesSchema = z.object({
  accountsPayableTrade: DECIMAL_SCHEMA.optional(),
  accountsPayableOther: DECIMAL_SCHEMA.optional(),
  payableDays: DECIMAL_SCHEMA.optional(),
  shortTermLoans: DECIMAL_SCHEMA.optional(),
  creditCardBalances: DECIMAL_SCHEMA.optional(),
  currentPortionLtDebt: DECIMAL_SCHEMA.optional(),
  payrollAccrued: DECIMAL_SCHEMA.optional(),
  taxesAccrued: DECIMAL_SCHEMA.optional(),
  utilitiesAccrued: DECIMAL_SCHEMA.optional(),
  currentOther: DECIMAL_SCHEMA.optional(),
})

const balanceSheetLongTermLiabilitiesSchema = z.object({
  longTermLoans: DECIMAL_SCHEMA.optional(),
  mortgageDebt: DECIMAL_SCHEMA.optional(),
  equipmentFinancing: DECIMAL_SCHEMA.optional(),
  bondPayable: DECIMAL_SCHEMA.optional(),
  otherLongTerm: DECIMAL_SCHEMA.optional(),
})

const applicationStep8BalanceSchema = z.object({
  assetsCurrentAssets: balanceSheetCurrentAssetsSchema.optional(),
  assetsFixedAssets: balanceSheetFixedAssetsSchema.optional(),
  liabilitiesCurrentLiabilities: balanceSheetCurrentLiabilitiesSchema.optional(),
  liabilitiesLongTermLiabilities: balanceSheetLongTermLiabilitiesSchema.optional(),
})

const monthlyIncomeSchema = z.object({
  businessOperations: DECIMAL_SCHEMA.optional(),
  employmentSalary: DECIMAL_SCHEMA.optional(),
  selfEmployment: DECIMAL_SCHEMA.optional(),
  rentals: DECIMAL_SCHEMA.optional(),
  dividendsInterest: DECIMAL_SCHEMA.optional(),
  pension: DECIMAL_SCHEMA.optional(),
  governmentAssistance: DECIMAL_SCHEMA.optional(),
  other: DECIMAL_SCHEMA.optional(),
})

const householdExpensesSchema = z.object({
  housingRentMortgage: DECIMAL_SCHEMA.optional(),
  utilitiesElectricity: DECIMAL_SCHEMA.optional(),
  utilitiesWater: DECIMAL_SCHEMA.optional(),
  utilitiesGas: DECIMAL_SCHEMA.optional(),
  utilitiesInternet: DECIMAL_SCHEMA.optional(),
  foodGroceries: DECIMAL_SCHEMA.optional(),
  transportationPublic: DECIMAL_SCHEMA.optional(),
  transportationVehicleFuel: DECIMAL_SCHEMA.optional(),
  transportationMaintenance: DECIMAL_SCHEMA.optional(),
  transportationInsurance: DECIMAL_SCHEMA.optional(),
  educationTuition: DECIMAL_SCHEMA.optional(),
  educationSupplies: DECIMAL_SCHEMA.optional(),
  healthcareInsurance: DECIMAL_SCHEMA.optional(),
  healthcareMedications: DECIMAL_SCHEMA.optional(),
  healthcareOther: DECIMAL_SCHEMA.optional(),
  childcare: DECIMAL_SCHEMA.optional(),
  personalGrooming: DECIMAL_SCHEMA.optional(),
  clothing: DECIMAL_SCHEMA.optional(),
  recreationEntertainment: DECIMAL_SCHEMA.optional(),
  phoneCellular: DECIMAL_SCHEMA.optional(),
  subscriptions: DECIMAL_SCHEMA.optional(),
  petCare: DECIMAL_SCHEMA.optional(),
  personalCare: DECIMAL_SCHEMA.optional(),
  miscellaneous: DECIMAL_SCHEMA.optional(),
})

const applicationStep9IncomeExpensesSchema = z.object({
  incomeClient: monthlyIncomeSchema.optional(),
  incomeSpouse: monthlyIncomeSchema.optional(),
  incomeFamily: monthlyIncomeSchema.optional(),
  householdExpenses: householdExpensesSchema.optional(),
  totalHouseholdExpenses: DECIMAL_SCHEMA.optional(),
})

const applicationStep10PaymentCapacitySchema = z.object({
  paymentCapacityMonthly: DECIMAL_SCHEMA.optional(),
  paymentCapacityPercent: z.number().min(0).max(100).optional(),
  debtToIncomeRatio: z.number().min(0).max(1).optional(),
  requestedMonthlyPayment: DECIMAL_SCHEMA.optional(),
})

const applicationStep11SubmissionSchema = z.object({
  requestedAmount: z.number().positive('El monto debe ser mayor a 0'),
  requestedMonths: z.number().min(3).max(120),
  requestedPurpose: TEXT_SCHEMA.optional(),
  requestedUseDetail: TEXT_SCHEMA.optional(),
})

const applicationDecisionSchema = z.object({
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected']).default('draft'),
  aiRiskLevel: z.enum(['low', 'medium', 'high', 'very_high']).optional(),
  aiDebtToIncomeRatio: z.number().min(0).max(1).optional(),
  aiPaymentCapacityPercent: z.number().min(0).max(100).optional(),
  aiRecommendation: TEXT_SCHEMA.optional(),
  aiAnalysisAt: DATE_SCHEMA.optional(),
  aiAnalysisVersion: TEXT_SCHEMA.optional(),
  comiteDecision: z.enum(['approved', 'rejected', 'pending']).optional(),
  comiteReviewerId: UUID_SCHEMA.optional(),
  comiteReviewedAt: DATE_SCHEMA.optional(),
  comiteNotes: TEXT_SCHEMA.optional(),
  creditApprovedAmount: DECIMAL_SCHEMA.optional(),
  creditApprovedMonths: z.number().optional(),
  creditApprovedRate: z.number().min(0).max(100).optional(),
})

// ============================================================================
// COMMERCIAL_ANALYSIS SCHEMAS
// ============================================================================

const dailyTransactionsSummarySchema = z.object({
  Monday: z.object({
    transactionsCount: z.number().nonnegative().optional(),
    averageValue: DECIMAL_SCHEMA.optional(),
    totalSales: DECIMAL_SCHEMA.optional(),
  }).optional(),
  Tuesday: z.object({
    transactionsCount: z.number().nonnegative().optional(),
    averageValue: DECIMAL_SCHEMA.optional(),
    totalSales: DECIMAL_SCHEMA.optional(),
  }).optional(),
  Wednesday: z.object({
    transactionsCount: z.number().nonnegative().optional(),
    averageValue: DECIMAL_SCHEMA.optional(),
    totalSales: DECIMAL_SCHEMA.optional(),
  }).optional(),
  Thursday: z.object({
    transactionsCount: z.number().nonnegative().optional(),
    averageValue: DECIMAL_SCHEMA.optional(),
    totalSales: DECIMAL_SCHEMA.optional(),
  }).optional(),
  Friday: z.object({
    transactionsCount: z.number().nonnegative().optional(),
    averageValue: DECIMAL_SCHEMA.optional(),
    totalSales: DECIMAL_SCHEMA.optional(),
  }).optional(),
  Saturday: z.object({
    transactionsCount: z.number().nonnegative().optional(),
    averageValue: DECIMAL_SCHEMA.optional(),
    totalSales: DECIMAL_SCHEMA.optional(),
  }).optional(),
  Sunday: z.object({
    transactionsCount: z.number().nonnegative().optional(),
    averageValue: DECIMAL_SCHEMA.optional(),
    totalSales: DECIMAL_SCHEMA.optional(),
  }).optional(),
  weeklyTotalTransactions: z.number().nonnegative().optional(),
  weeklyAverageValue: DECIMAL_SCHEMA.optional(),
  weeklyTotalSales: DECIMAL_SCHEMA.optional(),
})

const productLineSchema = z.object({
  name: TEXT_SCHEMA.optional(),
  monthlySales: DECIMAL_SCHEMA.optional(),
  productCostPercent: z.number().min(0).max(100).optional(),
  grossMargin: DECIMAL_SCHEMA.optional(),
  grossMarginPercent: z.number().min(0).max(100).optional(),
})

const serviceSchema = z.object({
  name: TEXT_SCHEMA.optional(),
  monthlyRevenue: DECIMAL_SCHEMA.optional(),
  monthlyHoursOffered: z.number().nonnegative().optional(),
  hourlyRate: DECIMAL_SCHEMA.optional(),
  customerCountMonthly: z.number().nonnegative().optional(),
})

const operatingExpensesSchema = z.object({
  rentMonthly: DECIMAL_SCHEMA.optional(),
  rentPercentRevenue: z.number().min(0).max(100).optional(),
  propertyMaintenance: DECIMAL_SCHEMA.optional(),
  propertyInsurance: DECIMAL_SCHEMA.optional(),
  propertyTaxes: DECIMAL_SCHEMA.optional(),
  electricity: DECIMAL_SCHEMA.optional(),
  water: DECIMAL_SCHEMA.optional(),
  gas: DECIMAL_SCHEMA.optional(),
  phoneInternet: DECIMAL_SCHEMA.optional(),
  equipmentMaintenance: DECIMAL_SCHEMA.optional(),
  vehicleMaintenance: DECIMAL_SCHEMA.optional(),
  vehicleFuel: DECIMAL_SCHEMA.optional(),
  vehicleInsurance: DECIMAL_SCHEMA.optional(),
  officeSupplies: DECIMAL_SCHEMA.optional(),
  professionalFees: DECIMAL_SCHEMA.optional(),
  accountingLegal: DECIMAL_SCHEMA.optional(),
  marketingAdvertising: DECIMAL_SCHEMA.optional(),
  travelExpenses: DECIMAL_SCHEMA.optional(),
  miscellaneous: DECIMAL_SCHEMA.optional(),
  totalMonthly: DECIMAL_SCHEMA.optional(),
  percentRevenue: z.number().min(0).max(100).optional(),
})

const incomeStatementSchema = z.object({
  totalRevenue: DECIMAL_SCHEMA.optional(),
  cogs: DECIMAL_SCHEMA.optional(),
  grossProfit: DECIMAL_SCHEMA.optional(),
  grossProfitPercent: z.number().min(0).max(100).optional(),
  operatingExpenses: DECIMAL_SCHEMA.optional(),
  operatingIncome: DECIMAL_SCHEMA.optional(),
  netProfit: DECIMAL_SCHEMA.optional(),
  netProfitPercent: z.number().min(0).max(100).optional(),
  profitabilityPercent: z.number().min(0).max(100).optional(),
})

const businessAssetsSchema = z.object({
  furnitureFixtures: DECIMAL_SCHEMA.optional(),
  machineryEquipment: DECIMAL_SCHEMA.optional(),
  vehicles: DECIMAL_SCHEMA.optional(),
  technologyComputers: DECIMAL_SCHEMA.optional(),
  pointOfSaleSystems: DECIMAL_SCHEMA.optional(),
  inventoryDisplay: DECIMAL_SCHEMA.optional(),
  leaseholdImprovements: DECIMAL_SCHEMA.optional(),
  other: DECIMAL_SCHEMA.optional(),
  total: DECIMAL_SCHEMA.optional(),
  ageYears: z.number().nonnegative().optional(),
})

export const commercialAnalysisSchema = z.object({
  id: UUID_SCHEMA,
  applicationId: UUID_SCHEMA,
  dailyTransactions: dailyTransactionsSummarySchema.optional(),
  productLines: z.array(productLineSchema).max(10).optional(),
  productLinesTotalSales: DECIMAL_SCHEMA.optional(),
  productLinesTotalCost: DECIMAL_SCHEMA.optional(),
  productLinesTotalGrossMargin: DECIMAL_SCHEMA.optional(),
  services: z.array(serviceSchema).max(5).optional(),
  servicesTotalRevenue: DECIMAL_SCHEMA.optional(),
  servicesTotalHours: DECIMAL_SCHEMA.optional(),
  servicesAverageHourlyRate: DECIMAL_SCHEMA.optional(),
  laborOwnerSalary: DECIMAL_SCHEMA.optional(),
  laborOwnerPercentRevenue: z.number().min(0).max(100).optional(),
  laborEmployeesCount: z.number().nonnegative().optional(),
  laborEmployeesAverageSalary: DECIMAL_SCHEMA.optional(),
  laborEmployeesTotalPayroll: DECIMAL_SCHEMA.optional(),
  laborEmployeesPercentRevenue: z.number().min(0).max(100).optional(),
  laborBenefitsInsurance: DECIMAL_SCHEMA.optional(),
  laborTrainingDevelopment: DECIMAL_SCHEMA.optional(),
  laborTotalCosts: DECIMAL_SCHEMA.optional(),
  operatingExpenses: operatingExpensesSchema.optional(),
  incomeStatement: incomeStatementSchema.optional(),
  businessAssets: businessAssetsSchema.optional(),
  createdAt: DATE_SCHEMA,
  updatedAt: DATE_SCHEMA,
})

export type CommercialAnalysisType = z.infer<typeof commercialAnalysisSchema>

// ============================================================================
// AGRICULTURAL_FLOW SCHEMAS
// ============================================================================

const monthlyAgriculturalIncomeSchema = z.object({
  cropSales: DECIMAL_SCHEMA.optional(),
  livestockSales: DECIMAL_SCHEMA.optional(),
  dairyProducts: DECIMAL_SCHEMA.optional(),
  valueAddedProducts: DECIMAL_SCHEMA.optional(),
  governmentPayments: DECIMAL_SCHEMA.optional(),
  otherSources: DECIMAL_SCHEMA.optional(),
  total: DECIMAL_SCHEMA.optional(),
})

const monthlyAgriculturalExpensesSchema = z.object({
  seedFertilizer: DECIMAL_SCHEMA.optional(),
  pestDiseaseControl: DECIMAL_SCHEMA.optional(),
  irrigation: DECIMAL_SCHEMA.optional(),
  feedSupplements: DECIMAL_SCHEMA.optional(),
  veterinaryHealth: DECIMAL_SCHEMA.optional(),
  equipmentMaintenance: DECIMAL_SCHEMA.optional(),
  labor: DECIMAL_SCHEMA.optional(),
  other: DECIMAL_SCHEMA.optional(),
  total: DECIMAL_SCHEMA.optional(),
})

const monthlyAgriculturalObligationSchema = z.object({
  existingLoans: DECIMAL_SCHEMA.optional(),
  proposedLoanPayment: DECIMAL_SCHEMA.optional(),
  otherDebts: DECIMAL_SCHEMA.optional(),
  total: DECIMAL_SCHEMA.optional(),
})

const monthlyAgriculturalPaymentCapacitySchema = z.object({
  availableBeforePayment: DECIMAL_SCHEMA.optional(),
  paymentCapacity70Percent: DECIMAL_SCHEMA.optional(),
  availableAfterPayment: DECIMAL_SCHEMA.optional(),
})

const agriculturalFlowMonthSchema = z.object({
  income: monthlyAgriculturalIncomeSchema.optional(),
  expenses: monthlyAgriculturalExpensesSchema.optional(),
  utility: DECIMAL_SCHEMA.optional(),
  householdExpenses: DECIMAL_SCHEMA.optional(),
  obligations: monthlyAgriculturalObligationSchema.optional(),
  paymentCapacity: monthlyAgriculturalPaymentCapacitySchema.optional(),
})

export const agriculturalFlowSchema = z.object({
  id: UUID_SCHEMA,
  applicationId: UUID_SCHEMA,
  projectionYear: z.number().optional(),
  currency: z.string().default('COP'),
  month1: agriculturalFlowMonthSchema.optional(),
  month2: agriculturalFlowMonthSchema.optional(),
  month3: agriculturalFlowMonthSchema.optional(),
  month4: agriculturalFlowMonthSchema.optional(),
  month5: agriculturalFlowMonthSchema.optional(),
  month6: agriculturalFlowMonthSchema.optional(),
  month7: agriculturalFlowMonthSchema.optional(),
  month8: agriculturalFlowMonthSchema.optional(),
  month9: agriculturalFlowMonthSchema.optional(),
  month10: agriculturalFlowMonthSchema.optional(),
  month11: agriculturalFlowMonthSchema.optional(),
  month12: agriculturalFlowMonthSchema.optional(),
  annualIncome: DECIMAL_SCHEMA.optional(),
  annualExpenses: DECIMAL_SCHEMA.optional(),
  annualUtility: DECIMAL_SCHEMA.optional(),
  annualHouseholdExpenses: DECIMAL_SCHEMA.optional(),
  annualObligations: DECIMAL_SCHEMA.optional(),
  averageMonthlyPaymentCapacity: DECIMAL_SCHEMA.optional(),
  createdAt: DATE_SCHEMA,
  updatedAt: DATE_SCHEMA,
})

export type AgriculturalFlowType = z.infer<typeof agriculturalFlowSchema>

// ============================================================================
// AGRICULTURAL_ANALYSIS SCHEMAS
// ============================================================================

const agriculturalActivitySchema = z.object({
  productName: TEXT_SCHEMA.optional(),
  extension: TEXT_SCHEMA.optional(),
  extensionUnit: TEXT_SCHEMA.optional(),
  incomePerCycle: DECIMAL_SCHEMA.optional(),
  costsPerCycle: DECIMAL_SCHEMA.optional(),
  utilityPerCycle: DECIMAL_SCHEMA.optional(),
  frequencyMonths: z.number().nonnegative().optional(),
  annualUtility: DECIMAL_SCHEMA.optional(),
  marginPercent: z.number().min(0).max(100).optional(),
})

const agriculturalAssetsSchema = z.object({
  landHectares: DECIMAL_SCHEMA.optional(),
  landValue: DECIMAL_SCHEMA.optional(),
  buildingsStructures: DECIMAL_SCHEMA.optional(),
  machineryEquipment: DECIMAL_SCHEMA.optional(),
  tractorsVehicles: DECIMAL_SCHEMA.optional(),
  irrigationSystems: DECIMAL_SCHEMA.optional(),
  storageFacilities: DECIMAL_SCHEMA.optional(),
  animalsInventoryValue: DECIMAL_SCHEMA.optional(),
  seedsNursery: DECIMAL_SCHEMA.optional(),
  toolsMinorEquipment: DECIMAL_SCHEMA.optional(),
  technologySystems: DECIMAL_SCHEMA.optional(),
  other: DECIMAL_SCHEMA.optional(),
  totalValue: DECIMAL_SCHEMA.optional(),
  totalAgeYears: z.number().nonnegative().optional(),
})

export const agriculturalAnalysisSchema = z.object({
  id: UUID_SCHEMA,
  applicationId: UUID_SCHEMA,
  activities: z.array(agriculturalActivitySchema).max(8).optional(),
  totalAnnualIncome: DECIMAL_SCHEMA.optional(),
  totalAnnualCosts: DECIMAL_SCHEMA.optional(),
  totalAnnualUtility: DECIMAL_SCHEMA.optional(),
  averageMarginPercent: z.number().min(0).max(100).optional(),
  assets: agriculturalAssetsSchema.optional(),
  analysisNotes: TEXT_SCHEMA.optional(),
  calculationNotes: TEXT_SCHEMA.optional(),
  informationCrossesVerified: z.boolean().optional(),
  verifierId: UUID_SCHEMA.optional(),
  verificationDate: DATE_SCHEMA.optional(),
  createdAt: DATE_SCHEMA,
  updatedAt: DATE_SCHEMA,
})

export type AgriculturalAnalysisType = z.infer<typeof agriculturalAnalysisSchema>

// ============================================================================
// COMPLETE APPLICATION SCHEMA
// ============================================================================

export const applicationSchema = applicationStep1Schema
  .merge(applicationStep2Schema)
  .merge(applicationStep45Schema)
  .merge(applicationStep5BusinessSchema)
  .merge(applicationStep6SpouseSchema)
  .merge(applicationStep7AssetsSchema)
  .merge(applicationStep8BalanceSchema)
  .merge(applicationStep9IncomeExpensesSchema)
  .merge(applicationStep10PaymentCapacitySchema)
  .merge(applicationStep11SubmissionSchema)
  .merge(applicationDecisionSchema)
  .merge(z.object({
    id: UUID_SCHEMA,
    institutionId: UUID_SCHEMA,
    advisorId: UUID_SCHEMA,
    clientId: UUID_SCHEMA,
    spouseId: UUID_SCHEMA.optional(),
    coapplicantId: UUID_SCHEMA.optional(),
    notes: TEXT_SCHEMA.optional(),
    formAutoSavedAt: DATE_SCHEMA.optional(),
    submittedAt: DATE_SCHEMA.optional(),
    createdAt: DATE_SCHEMA,
    updatedAt: DATE_SCHEMA,
    offlineSyncId: TEXT_SCHEMA.optional(),
    lastSyncedAt: DATE_SCHEMA.optional(),
  }))

export type ApplicationType = z.infer<typeof applicationSchema>

// ============================================================================
// PARTIAL SCHEMAS FOR UPDATES
// ============================================================================

export const applicationCreateSchema = applicationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSyncedAt: true,
})

export const applicationUpdateSchema = applicationSchema.partial()

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>
export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>
