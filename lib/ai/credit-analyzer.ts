import Anthropic from '@anthropic-ai/sdk'
import { fillCommercialPrompt, fillAgriculturalPrompt } from './prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AnalysisResult {
  risk_level: 'low' | 'medium' | 'high' | 'very_high'
  debt_to_income_ratio: number
  payment_capacity_percent: number
  risk_factors: string[]
  recommendation: string
  confidence_score: number
}

export async function analyzeCommercialCredit(params: {
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
}): Promise<AnalysisResult> {
  const prompt = fillCommercialPrompt(params)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from Claude')
    }

    const analysis = JSON.parse(jsonMatch[0]) as AnalysisResult

    // Validate required fields
    if (
      !analysis.risk_level ||
      typeof analysis.debt_to_income_ratio !== 'number' ||
      typeof analysis.payment_capacity_percent !== 'number' ||
      !analysis.recommendation
    ) {
      throw new Error('Invalid analysis response structure')
    }

    return analysis
  } catch (error) {
    console.error('Error calling Claude API for commercial analysis:', error)
    throw error
  }
}

export async function analyzeAgriculturalCredit(params: {
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
}): Promise<AnalysisResult> {
  const prompt = fillAgriculturalPrompt(params)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from Claude')
    }

    const analysis = JSON.parse(jsonMatch[0]) as AnalysisResult

    // Validate required fields
    if (
      !analysis.risk_level ||
      typeof analysis.debt_to_income_ratio !== 'number' ||
      typeof analysis.payment_capacity_percent !== 'number' ||
      !analysis.recommendation
    ) {
      throw new Error('Invalid analysis response structure')
    }

    return analysis
  } catch (error) {
    console.error('Error calling Claude API for agricultural analysis:', error)
    throw error
  }
}
