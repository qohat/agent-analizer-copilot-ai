/**
 * Claude API Prompts for Credit Analysis
 */

export const commercialAnalysisPrompt = `You are an expert financial analyst for microfinance institutions in Latin America.
Analyze the following commercial credit application and provide a risk assessment.

Applicant Income:
- Client Monthly Income: {clientMonthlyIncome}
- Spouse Monthly Income: {spouseMonthlyIncome}
- Co-applicant Monthly Income: {coapplicantMonthlyIncome}
- Other Income: {otherMonthlyIncome}

Total Gross Income: {totalIncome}

Monthly Expenses:
- Personal Expenses: {monthlyPersonalExpenses}
- Business Expenses: {monthlyBusinessExpenses}
- Other Obligations: {monthlyOtherObligations}

Total Monthly Expenses: {totalExpenses}

Net Monthly Income: {netIncome}

Credit Request:
- Amount: {requestedAmount}
- Duration: {requestedMonths} months
- Proposed Monthly Payment: {proposedMonthlyPayment}

Business Information:
- Business Type: {businessType}
- Sector: {businessSector}
- Years Operating: {businessYearsOperating}
- Monthly Sales: {businessMonthlySales}

Provide your analysis in the following JSON format:
{
  "risk_level": "low|medium|high|very_high",
  "debt_to_income_ratio": <decimal between 0 and 1>,
  "payment_capacity_percent": <percentage of net income going to credit payment>,
  "risk_factors": ["factor1", "factor2", ...],
  "recommendation": "Short recommendation text",
  "confidence_score": <0.0 to 1.0>
}

Consider:
1. Debt-to-income ratio (should be < 40%, warning if > 30%)
2. Capacity to pay (monthly payment should not exceed 30-40% of net income)
3. Business stability (years operating, consistent sales)
4. Income sources diversity (multiple income sources reduce risk)
5. Expense patterns (business expenses well documented?)

Be conservative: it's better to approve with conditions than to over-leverage the applicant.`

export const agriculturalAnalysisPrompt = `You are an expert financial analyst specializing in agricultural lending for microfinance institutions in Latin America.
Analyze the following agricultural credit application and provide a risk assessment.

Applicant Income:
- Client Monthly Income: {clientMonthlyIncome}
- Spouse Monthly Income: {spouseMonthlyIncome}
- Co-applicant Monthly Income: {coapplicantMonthlyIncome}
- Other Income: {otherMonthlyIncome}

Total Gross Income: {totalIncome}

Monthly Expenses:
- Personal Expenses: {monthlyPersonalExpenses}
- Business Expenses (farm): {monthlyBusinessExpenses}
- Other Obligations: {monthlyOtherObligations}

Total Monthly Expenses: {totalExpenses}

Net Monthly Income: {netIncome}

Credit Request:
- Amount: {requestedAmount}
- Duration: {requestedMonths} months
- Proposed Monthly Payment: {proposedMonthlyPayment}

Farm Information:
- Farm Type: {businessType}
- Main Crop/Livestock: {businessSector}
- Years Operating: {businessYearsOperating}
- Monthly Farm Sales/Production Value: {businessMonthlySales}

Provide your analysis in the following JSON format:
{
  "risk_level": "low|medium|high|very_high",
  "debt_to_income_ratio": <decimal between 0 and 1>,
  "payment_capacity_percent": <percentage of net income going to credit payment>,
  "risk_factors": ["factor1", "factor2", ...],
  "recommendation": "Short recommendation text",
  "confidence_score": <0.0 to 1.0>
}

Consider:
1. Seasonality of agricultural income (crops have seasonal cycles)
2. Debt-to-income ratio (agricultural borrowers typically higher debt ratios acceptable: < 50%)
3. Diversification of crops/livestock (reduces weather risk)
4. Years of farm operation (newer farms are riskier)
5. Off-farm income sources (important safety net in agricultural lending)
6. Proposed use of credit (working capital vs equipment vs land improvement)

Agricultural lending requires more flexibility due to seasonal nature. Recommend payment terms that align with harvest cycles.`

export function fillCommercialPrompt(params: {
  clientMonthlyIncome: number
  spouseMonthlyIncome?: number
  coapplicantMonthlyIncome?: number
  otherMonthlyIncome?: number
  monthlyPersonalExpenses: number
  monthlyBusinessExpenses: number
  monthlyOtherObligations: number
  requestedAmount: number
  requestedMonths: number
  businessType: string
  businessSector: string
  businessYearsOperating: number
  businessMonthlySales?: number
}): string {
  const spouse = params.spouseMonthlyIncome || 0
  const coapplicant = params.coapplicantMonthlyIncome || 0
  const other = params.otherMonthlyIncome || 0

  const totalIncome = params.clientMonthlyIncome + spouse + coapplicant + other
  const totalExpenses =
    params.monthlyPersonalExpenses +
    params.monthlyBusinessExpenses +
    params.monthlyOtherObligations

  const netIncome = totalIncome - totalExpenses
  const monthlyPayment = params.requestedAmount / params.requestedMonths

  let prompt = commercialAnalysisPrompt
  prompt = prompt.replace('{clientMonthlyIncome}', String(params.clientMonthlyIncome))
  prompt = prompt.replace('{spouseMonthlyIncome}', String(spouse))
  prompt = prompt.replace('{coapplicantMonthlyIncome}', String(coapplicant))
  prompt = prompt.replace('{otherMonthlyIncome}', String(other))
  prompt = prompt.replace('{totalIncome}', String(totalIncome))
  prompt = prompt.replace('{monthlyPersonalExpenses}', String(params.monthlyPersonalExpenses))
  prompt = prompt.replace('{monthlyBusinessExpenses}', String(params.monthlyBusinessExpenses))
  prompt = prompt.replace('{monthlyOtherObligations}', String(params.monthlyOtherObligations))
  prompt = prompt.replace('{totalExpenses}', String(totalExpenses))
  prompt = prompt.replace('{netIncome}', String(netIncome))
  prompt = prompt.replace('{requestedAmount}', String(params.requestedAmount))
  prompt = prompt.replace('{requestedMonths}', String(params.requestedMonths))
  prompt = prompt.replace('{proposedMonthlyPayment}', String(monthlyPayment))
  prompt = prompt.replace('{businessType}', params.businessType)
  prompt = prompt.replace('{businessSector}', params.businessSector)
  prompt = prompt.replace('{businessYearsOperating}', String(params.businessYearsOperating))
  prompt = prompt.replace('{businessMonthlySales}', String(params.businessMonthlySales || 0))

  return prompt
}

export function fillAgriculturalPrompt(params: {
  clientMonthlyIncome: number
  spouseMonthlyIncome?: number
  coapplicantMonthlyIncome?: number
  otherMonthlyIncome?: number
  monthlyPersonalExpenses: number
  monthlyBusinessExpenses: number
  monthlyOtherObligations: number
  requestedAmount: number
  requestedMonths: number
  businessType: string
  businessSector: string
  businessYearsOperating: number
  businessMonthlySales?: number
}): string {
  const spouse = params.spouseMonthlyIncome || 0
  const coapplicant = params.coapplicantMonthlyIncome || 0
  const other = params.otherMonthlyIncome || 0

  const totalIncome = params.clientMonthlyIncome + spouse + coapplicant + other
  const totalExpenses =
    params.monthlyPersonalExpenses +
    params.monthlyBusinessExpenses +
    params.monthlyOtherObligations

  const netIncome = totalIncome - totalExpenses
  const monthlyPayment = params.requestedAmount / params.requestedMonths

  let prompt = agriculturalAnalysisPrompt
  prompt = prompt.replace('{clientMonthlyIncome}', String(params.clientMonthlyIncome))
  prompt = prompt.replace('{spouseMonthlyIncome}', String(spouse))
  prompt = prompt.replace('{coapplicantMonthlyIncome}', String(coapplicant))
  prompt = prompt.replace('{otherMonthlyIncome}', String(other))
  prompt = prompt.replace('{totalIncome}', String(totalIncome))
  prompt = prompt.replace('{monthlyPersonalExpenses}', String(params.monthlyPersonalExpenses))
  prompt = prompt.replace('{monthlyBusinessExpenses}', String(params.monthlyBusinessExpenses))
  prompt = prompt.replace('{monthlyOtherObligations}', String(params.monthlyOtherObligations))
  prompt = prompt.replace('{totalExpenses}', String(totalExpenses))
  prompt = prompt.replace('{netIncome}', String(netIncome))
  prompt = prompt.replace('{requestedAmount}', String(params.requestedAmount))
  prompt = prompt.replace('{requestedMonths}', String(params.requestedMonths))
  prompt = prompt.replace('{proposedMonthlyPayment}', String(monthlyPayment))
  prompt = prompt.replace('{businessType}', params.businessType)
  prompt = prompt.replace('{businessSector}', params.businessSector)
  prompt = prompt.replace('{businessYearsOperating}', String(params.businessYearsOperating))
  prompt = prompt.replace('{businessMonthlySales}', String(params.businessMonthlySales || 0))

  return prompt
}
