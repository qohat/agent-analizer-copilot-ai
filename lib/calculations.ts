/**
 * Financial Calculations for Credit Analysis
 * Supports both Commercial and Agricultural credit types
 */

export interface CommercialMetrics {
  grossIncome: number
  totalExpenses: number
  netIncome: number
  debtToIncomeRatio: number
  paymentCapacityPercent: number
  monthlyPayment: number
  workingCapital: number
  daysPayableOutstanding: number
  daysInventoryOutstanding: number
  daysReceivableOutstanding: number
  cashConversionCycle: number
  riskFactors: string[]
  recommendation: 'GO' | 'CAUTION' | 'NO_GO'
}

export interface AgriculturalMetrics {
  annualGrossIncome: number
  annualProductionCosts: number
  annualNetProfit: number
  debtToIncomeRatio: number
  lowSeasonPaymentCapacity: number
  riskFactors: string[]
  recommendation: 'GO' | 'CAUTION' | 'NO_GO'
}

/**
 * Calculate Commercial Credit Metrics
 */
export function calculateCommercialMetrics(data: any): CommercialMetrics {
  // Income calculation
  const primaryIncome = data.primaryIncomeMonthly || 0
  const secondaryIncome = data.secondaryIncomeMonthly || 0
  const spouseIncome = data.spouseIncomeMonthly || 0
  const grossIncome = primaryIncome + secondaryIncome + spouseIncome

  // Expenses calculation
  const householdExpenses = data.householdExpensesMonthly || 0
  const businessExpenses = data.businessExpensesMonthly || 0
  const debtObligations = data.debtObligationsMonthly || 0
  const totalExpenses = householdExpenses + businessExpenses + debtObligations

  // Net income
  const netIncome = grossIncome - totalExpenses

  // Loan payment calculation
  const annualRate = 0.25 // 25% annual interest (default)
  const monthlyRate = annualRate / 12
  const numPayments = data.loanTermMonths || 24
  const loanAmount = data.requestedAmount || 0

  // PMT = P * (r * (1+r)^n) / ((1+r)^n - 1)
  const monthlyPayment = numPayments > 0
    ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0

  // Debt-to-income ratio
  const totalDebtService = debtObligations + monthlyPayment
  const debtToIncomeRatio = grossIncome > 0 ? totalDebtService / grossIncome : 0

  // Payment capacity (percentage of net income available after loan payment)
  const paymentCapacityPercent = netIncome > 0
    ? ((netIncome - monthlyPayment) / netIncome) * 100
    : 0

  // Working capital calculation
  const receivables = data.accountsReceivableAmount || 0
  const payables = data.accountsPayableAmount || 0
  const inventory = data.inventoryValue || 0
  const workingCapital = receivables + inventory - payables

  // Days calculations (for working capital cycle)
  const daysPayableOutstanding = data.accountsPayableDays || 0
  const daysInventoryOutstanding = data.inventoryDays || 0
  const daysReceivableOutstanding = data.accountsReceivableDays || 0
  const cashConversionCycle = daysInventoryOutstanding + daysReceivableOutstanding - daysPayableOutstanding

  // Risk assessment
  const riskFactors: string[] = []

  if (debtToIncomeRatio > 0.40) {
    riskFactors.push('Relación deuda-ingreso mayor a 40%')
  }

  if (debtToIncomeRatio > 0.35 && debtToIncomeRatio <= 0.40) {
    riskFactors.push('Relación deuda-ingreso en zona de alerta (35-40%)')
  }

  if (netIncome <= monthlyPayment) {
    riskFactors.push('Ingreso neto insuficiente para cubrir cuota de préstamo')
  }

  if (data.businessMonthsInOperation < 6) {
    riskFactors.push('Negocio en operación menos de 6 meses')
  }

  if (!data.collateralValue || data.collateralValue < loanAmount * 0.20) {
    riskFactors.push('Garantía insuficiente (menor al 20% del monto solicitado)')
  }

  if (cashConversionCycle > 60) {
    riskFactors.push('Ciclo de conversión de efectivo prolongado')
  }

  if (workingCapital < 0) {
    riskFactors.push('Capital de trabajo negativo')
  }

  if (data.businessProfitMargin && data.businessProfitMargin < 10) {
    riskFactors.push('Margen de ganancia bajo (< 10%)')
  }

  // Recommendation logic
  let recommendation: 'GO' | 'CAUTION' | 'NO_GO' = 'GO'

  if (riskFactors.length >= 3 || debtToIncomeRatio > 0.40 || netIncome <= monthlyPayment) {
    recommendation = 'NO_GO'
  } else if (riskFactors.length >= 1 || debtToIncomeRatio > 0.35) {
    recommendation = 'CAUTION'
  }

  return {
    grossIncome,
    totalExpenses,
    netIncome,
    debtToIncomeRatio,
    paymentCapacityPercent,
    monthlyPayment,
    workingCapital,
    daysPayableOutstanding,
    daysInventoryOutstanding,
    daysReceivableOutstanding,
    cashConversionCycle,
    riskFactors,
    recommendation,
  }
}

/**
 * Calculate Agricultural Credit Metrics
 */
export function calculateAgriculturalMetrics(data: any): AgriculturalMetrics {
  // Production income
  const lastHarvestAmount = data.lastHarvestAmount || 0
  const marketPrice = data.marketPriceAverage || 0
  const cyclesPerYear = data.productionCyclesPerYear || 1

  // Annual gross income
  const annualGrossIncome = (lastHarvestAmount * marketPrice) / cyclesPerYear

  // Annual production costs
  const productionCostsPerCycle = data.productionCostsPerCycle || 0
  const irrigationCosts = data.irrigationCosts || 0
  const feedFertilizerCosts = data.feedFertilizerCosts || 0
  const veterinaryCosts = data.veterinaryCosts || 0
  const storagePostHarvestCosts = data.storagePostHarvestCosts || 0
  const distributionCosts = data.distributionTransportationCosts || 0

  const costPerCycle = productionCostsPerCycle + irrigationCosts + feedFertilizerCosts +
    veterinaryCosts + storagePostHarvestCosts + distributionCosts
  const annualProductionCosts = costPerCycle * cyclesPerYear

  // Net profit
  const annualNetProfit = annualGrossIncome - annualProductionCosts

  // Loan payment calculation (assume even distribution across year)
  const annualRate = 0.25 // 25% annual interest (default)
  const monthlyRate = annualRate / 12
  const numPayments = data.loanTermMonths || 24
  const loanAmount = data.requestedAmount || 0

  // PMT = P * (r * (1+r)^n) / ((1+r)^n - 1)
  const monthlyPayment = numPayments > 0
    ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0
  const annualPayment = monthlyPayment * 12

  // Debt-to-income ratio (annualized)
  const debtObligations = (data.debtObligationsMonthly || 0) * 12
  const totalAnnualDebt = debtObligations + annualPayment
  const debtToIncomeRatio = annualGrossIncome > 0
    ? totalAnnualDebt / annualGrossIncome
    : 0

  // Low season payment capacity (assume 30% of average monthly income during low season)
  const averageMonthlyIncome = annualGrossIncome / 12
  const lowSeasonMonthlyIncome = averageMonthlyIncome * 0.30
  const householdExpenses = (data.householdExpensesMonthly || 0)
  const lowSeasonPaymentCapacity = lowSeasonMonthlyIncome - householdExpenses - monthlyPayment

  // Risk assessment
  const riskFactors: string[] = []

  if (debtToIncomeRatio > 0.40) {
    riskFactors.push('Relación deuda-ingreso mayor a 40%')
  }

  if (lowSeasonPaymentCapacity < 0) {
    riskFactors.push('Capacidad de pago negativa en época baja')
  }

  if (annualNetProfit <= annualPayment) {
    riskFactors.push('Ganancia neta insuficiente para cubrir préstamo anual')
  }

  if (!data.cropLivestockType) {
    riskFactors.push('Tipo de cultivo/ganadería no especificado')
  }

  if (!data.lastHarvestAmount || data.lastHarvestAmount === 0) {
    riskFactors.push('Sin información de últimas cosechas')
  }

  if (cyclesPerYear > 2) {
    riskFactors.push('Alta frecuencia de ciclos (riesgo por repetición)')
  }

  if (!data.collateralValue || data.collateralValue < loanAmount * 0.20) {
    riskFactors.push('Garantía insuficiente (menor al 20% del monto solicitado)')
  }

  // Recommendation logic
  let recommendation: 'GO' | 'CAUTION' | 'NO_GO' = 'GO'

  if (
    riskFactors.length >= 3 ||
    debtToIncomeRatio > 0.40 ||
    lowSeasonPaymentCapacity < 0
  ) {
    recommendation = 'NO_GO'
  } else if (riskFactors.length >= 1 || debtToIncomeRatio > 0.35) {
    recommendation = 'CAUTION'
  }

  return {
    annualGrossIncome,
    annualProductionCosts,
    annualNetProfit,
    debtToIncomeRatio,
    lowSeasonPaymentCapacity,
    riskFactors,
    recommendation,
  }
}

/**
 * Generate 12-month cash flow projection for commercial
 */
export function generateCommercialCashFlowProjection(data: any, metrics: CommercialMetrics): any[] {
  const projection: Array<{
    month: number
    inflow: number
    outflow: number
    netCash: number
    cumulativeCash: number
  }> = []
  const monthlyPayment = metrics.monthlyPayment

  for (let month = 1; month <= 12; month++) {
    const inflow = metrics.grossIncome
    const outflow = metrics.totalExpenses + monthlyPayment
    const netCash = inflow - outflow

    projection.push({
      month,
      inflow,
      outflow,
      netCash,
      cumulativeCash: (projection[month - 2]?.cumulativeCash || 0) + netCash,
    })
  }

  return projection
}

/**
 * Generate seasonal income pattern for agricultural
 */
export function generateAgriculturalSeasonalPattern(data: any): any[] {
  const cyclesPerYear = data.productionCyclesPerYear || 1
  const monthsPerCycle = 12 / cyclesPerYear

  const pattern = []
  for (let month = 1; month <= 12; month++) {
    const cycleMonth = ((month - 1) % monthsPerCycle) + 1
    const isCycleEnd = month % Math.ceil(monthsPerCycle) === 0

    const harvestMonth = isCycleEnd ? data.lastHarvestAmount * data.marketPriceAverage : 0
    const regularIncome = (data.annualGrossIncome / 12)
    const monthlyIncome = harvestMonth || regularIncome

    pattern.push({
      month,
      cycleMonth,
      isHarvestMonth: isCycleEnd,
      income: monthlyIncome,
      baseExpenses: (data.annualProductionCosts / 12),
    })
  }

  return pattern
}
