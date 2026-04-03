/**
 * Complete Type Definitions for Agent Analyzer Copilot
 * Maps ALL 1,091+ fields from ANALISIS_FORMULARIOS_PRODUCTO_DIGITAL.md
 * Generated: 2026-04-01
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export type UUID = string & { readonly __brand: 'UUID' }
export type ProductType = 'commercial' | 'agricultural'
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
export type CreditStatus = 'active' | 'completed' | 'defaulted' | 'cancelled'
export type RiskLevel = 'low' | 'medium' | 'high' | 'very_high'
export type DecisionStatus = 'approved' | 'rejected' | 'pending'
export type SyncStatus = 'pending' | 'synced' | 'failed'

// ============================================================================
// INSTITUTION
// ============================================================================

export interface Institution {
  id: UUID
  name: string
  country: string
  logoUrl?: string
  maxCommercialAmount?: number
  maxAgriculturalAmount?: number
  minMonthlyIncome?: number
  defaultRate?: number
  defaultMonths?: number
  debtToIncomeThreshold?: number
  debtToIncomeWarning?: number
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// USER
// ============================================================================

export interface User {
  id: UUID
  authId: string
  email: string
  name: string
  institutionId: UUID
  role: string
  region?: string
  phone?: string
  managerId?: UUID
  canApproveUntil?: number
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// ============================================================================
// CLIENT
// ============================================================================

export interface Client {
  id: UUID
  institutionId: UUID

  // Step 3: Personal Information (14 fields)
  firstName: string
  lastName: string
  idNumber: string
  idType: 'cedula' | 'passport' | 'dni' | 'nit' | 'ruc'
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  educationLevel?: 'primary' | 'secondary' | 'technical' | 'university'
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'retired'
  phone: string
  email?: string

  // Step 4: Address (6 fields)
  addressStreet?: string
  addressCity?: string
  addressDepartment?: string
  addressPostalCode?: string
  addressCountry?: string
  addressNeighborhood?: string

  // Demographic
  maritalStatus?: 'single' | 'married' | 'common_law' | 'divorced' | 'widowed'
  hasDependentsWithDisability?: boolean

  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// APPLICATION (MAIN FORM - SOLICITUD DE CRÉDITO)
// 195 fields across 11 steps
// ============================================================================

export interface ApplicationStep1 {
  // Step 1: Datos de la Solicitud (5 fields)
  solicitudNumero?: string
  solicitudFecha?: Date
  solicitudAsesor?: string
  solicitudInstitucion?: string
  solicitudCanal?: 'online' | 'presencial' | 'telefonica'
}

export interface ApplicationStep2 {
  // Step 2: Tipo de Producto (1 field)
  productType: ProductType
}

export interface ApplicationStep45 {
  // Step 4: Address fields (conditional)
  addressResidentialTimeMonths?: number
  addressOwnRent?: 'propia' | 'arrendada' | 'prestada'
  addressRentMonthlyAmount?: number
  addressMortgageMonthlyAmount?: number
}

export interface ApplicationStep5Business {
  // Step 5: Datos del Negocio (12+ fields)
  businessName?: string
  businessType?: 'sole_proprietor' | 'cooperative' | 'sas' | 'corporation' | 'farm'
  businessLegalForm?: 'natural_person' | 'juridical_person'
  businessSector?: 'commerce' | 'services' | 'agriculture' | 'livestock' | 'other'
  businessDescription?: string
  businessRegistrationNumber?: string
  businessRegistrationDate?: Date
  businessAddressSameAsResidential?: boolean
  businessAddressStreet?: string
  businessAddressCity?: string
  businessAddressDepartment?: string
  businessPhone?: string
  businessEmail?: string
  businessYearsOperating?: number
  businessMonthsOperating?: number
  businessEmployeesCount?: number
  businessMonthlySales?: number
  businessProfitMarginPercent?: number
  businessRentMonthly?: number
  businessLeaseYearsRemaining?: number
}

export interface ApplicationStep6Spouse {
  // Step 6: Consulta del Cónyuge (16 fields - conditional)
  hasSpouse?: boolean
  spouseSameAddress?: boolean
  spouseEmployed?: boolean
  spouseIncomeSource?: string
  spouseMonthlyIncome?: number
  spouseMonthlyIncomeSecondary?: number
  spouseEmploymentStatus?: string
  spouseProfessionalActivities?: string
  spouseDebtObligationsMonthly?: number
}

export interface RealEstate {
  description?: string
  location?: string
  estimatedValue?: number
  debtValue?: number
  netEquity?: number
  ownershipPercent?: number
  currentUse?: string
}

export interface Vehicle {
  type?: string
  year?: number
  make?: string
  model?: string
  value?: number
  debtValue?: number
  registrationNumber?: string
}

export interface Reference {
  name?: string
  relationship?: string
  phone?: string
  knowsClientYears?: number
  paymentHistory?: string
}

export interface ApplicationStep7Assets {
  // Step 7: Bienes y Referencias

  // 7A. Real Estate (up to 3)
  realEstateCount?: number
  realEstate1?: RealEstate
  realEstate2?: RealEstate
  realEstate3?: RealEstate

  // 7B. Vehicles (up to 2)
  vehiclesCount?: number
  vehicle1?: Vehicle
  vehicle2?: Vehicle

  // 7C. References (3 required)
  reference1?: Reference
  reference2?: Reference
  reference3?: Reference
}

export interface BalanceSheetCurrentAssets {
  cashAndEquivalents?: number
  savingsAccounts?: number
  checkingAccounts?: number
  moneyMarketAccounts?: number
  shortTermInvestments?: number
  accountsReceivableTrade?: number
  accountsReceivableOther?: number
  receivableDays?: number
  inventoryRawMaterials?: number
  inventoryFinishedGoods?: number
  inventoryMerchandise?: number
  inventoryDays?: number
  prepaidExpenses?: number
  currentOther?: number
}

export interface BalanceSheetFixedAssets {
  land?: number
  buildingsStructures?: number
  furnitureFixtures?: number
  machineryEquipment?: number
  vehiclesFixed?: number
  accumulatedDepreciation?: number
  intangibleGoodwill?: number
  fixedOther?: number
}

export interface BalanceSheetCurrentLiabilities {
  accountsPayableTrade?: number
  accountsPayableOther?: number
  payableDays?: number
  shortTermLoans?: number
  creditCardBalances?: number
  currentPortionLtDebt?: number
  payrollAccrued?: number
  taxesAccrued?: number
  utilitiesAccrued?: number
  currentOther?: number
}

export interface BalanceSheetLongTermLiabilities {
  longTermLoans?: number
  mortgageDebt?: number
  equipmentFinancing?: number
  bondPayable?: number
  otherLongTerm?: number
}

export interface ApplicationStep8Balance {
  // Step 8: Balance General
  assetsCurrentAssets?: BalanceSheetCurrentAssets
  assetsFixedAssets?: BalanceSheetFixedAssets
  liabilitiesCurrentLiabilities?: BalanceSheetCurrentLiabilities
  liabilitiesLongTermLiabilities?: BalanceSheetLongTermLiabilities
}

export interface MonthlyIncome {
  businessOperations?: number
  employmentSalary?: number
  selfEmployment?: number
  rentals?: number
  dividendsInterest?: number
  pension?: number
  governmentAssistance?: number
  other?: number
}

export interface HouseholdExpenses {
  housingRentMortgage?: number
  utilitiesElectricity?: number
  utilitiesWater?: number
  utilitiesGas?: number
  utilitiesInternet?: number
  foodGroceries?: number
  transportationPublic?: number
  transportationVehicleFuel?: number
  transportationMaintenance?: number
  transportationInsurance?: number
  educationTuition?: number
  educationSupplies?: number
  healthcareInsurance?: number
  healthcareMedications?: number
  healthcareOther?: number
  childcare?: number
  personalGrooming?: number
  clothing?: number
  recreationEntertainment?: number
  phoneCellular?: number
  subscriptions?: number
  petCare?: number
  personalCare?: number
  miscellaneous?: number
}

export interface ApplicationStep9IncomeExpenses {
  // Step 9: Ingresos y Gastos Mensuales
  incomeClient?: MonthlyIncome
  incomeSpouse?: MonthlyIncome
  incomeFamily?: MonthlyIncome
  householdExpenses?: HouseholdExpenses
  totalHouseholdExpenses?: number
}

export interface ApplicationStep10PaymentCapacity {
  // Step 10: Capacidad de Pago (calculated)
  paymentCapacityMonthly?: number
  paymentCapacityPercent?: number
  debtToIncomeRatio?: number
  requestedMonthlyPayment?: number
}

export interface ApplicationStep11Submission {
  // Step 11: Resumen y Envío
  requestedAmount: number
  requestedMonths: number
  requestedPurpose?: string
  requestedUseDetail?: string
}

export interface ApplicationDecision {
  status: ApplicationStatus
  aiRiskLevel?: RiskLevel
  aiDebtToIncomeRatio?: number
  aiPaymentCapacityPercent?: number
  aiRecommendation?: string
  aiAnalysisAt?: Date
  aiAnalysisVersion?: string
  comiteDecision?: DecisionStatus
  comiteReviewerId?: UUID
  comiteReviewedAt?: Date
  comiteNotes?: string
  creditApprovedAmount?: number
  creditApprovedMonths?: number
  creditApprovedRate?: number
}

export interface Application extends ApplicationStep1, ApplicationStep2, ApplicationStep45,
  ApplicationStep5Business, ApplicationStep6Spouse, ApplicationStep7Assets,
  ApplicationStep8Balance, ApplicationStep9IncomeExpenses, ApplicationStep10PaymentCapacity,
  ApplicationStep11Submission, ApplicationDecision {
  id: UUID
  institutionId: UUID
  advisorId: UUID
  clientId: UUID
  spouseId?: UUID
  coapplicantId?: UUID

  notes?: string
  formAutoSavedAt?: Date
  submittedAt?: Date
  createdAt: Date
  updatedAt: Date

  offlineSyncId?: string
  lastSyncedAt?: Date
}

// ============================================================================
// COMMERCIAL_ANALYSIS
// ~190 fields across 7 sections
// ============================================================================

export interface DailyTransactionsSummary {
  Monday?: { transactionsCount?: number; averageValue?: number; totalSales?: number }
  Tuesday?: { transactionsCount?: number; averageValue?: number; totalSales?: number }
  Wednesday?: { transactionsCount?: number; averageValue?: number; totalSales?: number }
  Thursday?: { transactionsCount?: number; averageValue?: number; totalSales?: number }
  Friday?: { transactionsCount?: number; averageValue?: number; totalSales?: number }
  Saturday?: { transactionsCount?: number; averageValue?: number; totalSales?: number }
  Sunday?: { transactionsCount?: number; averageValue?: number; totalSales?: number }
  weeklyTotalTransactions?: number
  weeklyAverageValue?: number
  weeklyTotalSales?: number
}

export interface ProductLine {
  name?: string
  monthlySales?: number
  productCostPercent?: number
  grossMargin?: number
  grossMarginPercent?: number
}

export interface Service {
  name?: string
  monthlyRevenue?: number
  monthlyHoursOffered?: number
  hourlyRate?: number
  customerCountMonthly?: number
}

export interface OperatingExpenses {
  // Rent and Property
  rentMonthly?: number
  rentPercentRevenue?: number
  propertyMaintenance?: number
  propertyInsurance?: number
  propertyTaxes?: number

  // Utilities
  electricity?: number
  water?: number
  gas?: number
  phoneInternet?: number

  // Equipment and Vehicles
  equipmentMaintenance?: number
  vehicleMaintenance?: number
  vehicleFuel?: number
  vehicleInsurance?: number

  // Administrative
  officeSupplies?: number
  professionalFees?: number
  accountingLegal?: number
  marketingAdvertising?: number
  travelExpenses?: number
  miscellaneous?: number

  totalMonthly?: number
  percentRevenue?: number
}

export interface IncomeStatement {
  totalRevenue?: number
  cogs?: number
  grossProfit?: number
  grossProfitPercent?: number
  operatingExpenses?: number
  operatingIncome?: number
  netProfit?: number
  netProfitPercent?: number
  profitabilityPercent?: number
}

export interface BusinessAssets {
  furnitureFixtures?: number
  machineryEquipment?: number
  vehicles?: number
  technologyComputers?: number
  pointOfSaleSystems?: number
  inventoryDisplay?: number
  leaseholdImprovements?: number
  other?: number
  total?: number
  ageYears?: number
}

export interface CommercialAnalysis {
  id: UUID
  applicationId: UUID

  // Section 1: Daily Transactions (7 days + totals)
  dailyTransactions?: DailyTransactionsSummary

  // Section 2: Products (10 product lines max)
  productLines?: ProductLine[]
  productLinesTotalSales?: number
  productLinesTotalCost?: number
  productLinesTotalGrossMargin?: number

  // Section 3: Services (5 services max)
  services?: Service[]
  servicesTotalRevenue?: number
  servicesTotalHours?: number
  servicesAverageHourlyRate?: number

  // Section 4: Labor & Direct Costs
  laborOwnerSalary?: number
  laborOwnerPercentRevenue?: number
  laborEmployeesCount?: number
  laborEmployeesAverageSalary?: number
  laborEmployeesTotalPayroll?: number
  laborEmployeesPercentRevenue?: number
  laborBenefitsInsurance?: number
  laborTrainingDevelopment?: number
  laborTotalCosts?: number

  // Section 5: Operating Expenses
  operatingExpenses?: OperatingExpenses

  // Section 6: Income Statement
  incomeStatement?: IncomeStatement

  // Section 7: Business Assets
  businessAssets?: BusinessAssets

  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// AGRICULTURAL_FLOW
// ~600 fields (12-month projection)
// ============================================================================

export interface MonthlyAgriculturalIncome {
  cropSales?: number
  livestockSales?: number
  dairyProducts?: number
  valueAddedProducts?: number
  governmentPayments?: number
  otherSources?: number
  total?: number
}

export interface MonthlyAgriculturalExpenses {
  seedFertilizer?: number
  pestDiseaseControl?: number
  irrigation?: number
  feedSupplements?: number
  veterinaryHealth?: number
  equipmentMaintenance?: number
  labor?: number
  other?: number
  total?: number
}

export interface MonthlyAgriculturalObligation {
  existingLoans?: number
  proposedLoanPayment?: number
  otherDebts?: number
  total?: number
}

export interface MonthlyAgriculturalPaymentCapacity {
  availableBeforePayment?: number
  paymentCapacity70Percent?: number
  availableAfterPayment?: number
}

export interface AgriculturalFlowMonth {
  income?: MonthlyAgriculturalIncome
  expenses?: MonthlyAgriculturalExpenses
  utility?: number
  householdExpenses?: number
  obligations?: MonthlyAgriculturalObligation
  paymentCapacity?: MonthlyAgriculturalPaymentCapacity
}

export interface AgriculturalFlow {
  id: UUID
  applicationId: UUID
  projectionYear?: number
  currency?: string

  // 12 months of data
  month1?: AgriculturalFlowMonth
  month2?: AgriculturalFlowMonth
  month3?: AgriculturalFlowMonth
  month4?: AgriculturalFlowMonth
  month5?: AgriculturalFlowMonth
  month6?: AgriculturalFlowMonth
  month7?: AgriculturalFlowMonth
  month8?: AgriculturalFlowMonth
  month9?: AgriculturalFlowMonth
  month10?: AgriculturalFlowMonth
  month11?: AgriculturalFlowMonth
  month12?: AgriculturalFlowMonth

  // Summary
  annualIncome?: number
  annualExpenses?: number
  annualUtility?: number
  annualHouseholdExpenses?: number
  annualObligations?: number
  averageMonthlyPaymentCapacity?: number

  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// AGRICULTURAL_ANALYSIS
// ~116 fields for activity profitability
// ============================================================================

export interface AgriculturalActivity {
  productName?: string
  extension?: string
  extensionUnit?: string
  incomePerCycle?: number
  costsPerCycle?: number
  utilityPerCycle?: number
  frequencyMonths?: number
  annualUtility?: number
  marginPercent?: number
}

export interface AgriculturalAssets {
  landHectares?: number
  landValue?: number
  buildingsStructures?: number
  machineryEquipment?: number
  tractorsVehicles?: number
  irrigationSystems?: number
  storageFacilities?: number
  animalsInventoryValue?: number
  seedsNursery?: number
  toolsMinorEquipment?: number
  technologySystems?: number
  other?: number
  totalValue?: number
  totalAgeYears?: number
}

export interface AgriculturalAnalysis {
  id: UUID
  applicationId: UUID

  // Section 1: Activities (up to 8)
  activities?: AgriculturalActivity[]
  totalAnnualIncome?: number
  totalAnnualCosts?: number
  totalAnnualUtility?: number
  averageMarginPercent?: number

  // Section 2: Assets
  assets?: AgriculturalAssets

  // Section 3: Notes
  analysisNotes?: string
  calculationNotes?: string
  informationCrossesVerified?: boolean
  verifierId?: UUID
  verificationDate?: Date

  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// ANALYSIS_RESULTS
// ============================================================================

export interface AnalysisResults {
  id: UUID
  applicationId: UUID
  analysisType: 'commercial' | 'agricultural' | 'integrated'

  // Financial metrics
  grossIncome?: number
  totalExpenses?: number
  netIncome?: number
  debtToIncomeRatio?: number
  paymentCapacityPercent?: number

  // Risk assessment
  riskLevel?: RiskLevel
  riskFactors?: string[]
  riskScore?: number

  // Recommendation
  recommendation?: string
  confidenceScore?: number
  recommendationReason?: string

  // AI metadata
  modelVersion?: string
  promptVersion?: string
  rawResponse?: Record<string, unknown>
  analysisDurationSeconds?: number

  createdAt: Date
}

// ============================================================================
// CREDITS
// ============================================================================

export interface Credit {
  id: UUID
  institutionId: UUID
  applicationId: UUID
  clientId: UUID

  principalAmount: number
  interestRate: number
  monthlyPayment: number
  totalMonths: number

  disbursementDate?: Date
  startDate?: Date
  maturityDate?: Date

  status: CreditStatus

  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// SYNC_QUEUE
// ============================================================================

export interface SyncQueueItem {
  id: UUID
  userId: UUID
  applicationId?: UUID
  operation: 'create' | 'update' | 'delete'
  entityType: string
  payload: Record<string, unknown>
  status: SyncStatus
  errorMessage?: string
  retryCount?: number
  createdAt: Date
  syncedAt?: Date
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: UUID
  userId: UUID
  type: string
  applicationId?: UUID
  message: string
  actionUrl?: string
  isRead: boolean
  createdAt: Date
  readAt?: Date
}
