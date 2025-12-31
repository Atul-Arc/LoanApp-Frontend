export type LoanType = {
  loanTypeId: number
  loanTypeName: string
}

export type EmploymentType = 'Salaried' | 'Self Employed'

export type LoanEligibilityPayload = {
  loanTypeId: number
  requestedAmount: number
  tenureInMonths: number
  dateOfBirth: string
  employmentType: EmploymentType
  monthlyIncome: number
  existingEMI: number
  creditScore: number
}

export type LoanEligibilityResponse = {
  isEligible: boolean
  eligibilityStatus: string
  remarks: string
  calculatedEMI?: number
  emiToIncomePct?: number
}

const requireEnvUrl = (value: string | undefined, envKey: string) => {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new Error(`${envKey} is not configured. Please set it in your .env file.`)
  }
  return trimmed
}

const getLoanTypesUrl = () => requireEnvUrl(import.meta.env.VITE_LOAN_TYPES_URL, 'VITE_LOAN_TYPES_URL')
const getCheckEligibilityUrl = () =>
  requireEnvUrl(import.meta.env.VITE_CHECK_ELIGIBILITY_URL, 'VITE_CHECK_ELIGIBILITY_URL')

const handleErrorResponse = async (response: Response) => {
  const fallbackMessage = 'Request failed. Please try again.'
  try {
    const data = await response.json()
    if (typeof data?.message === 'string' && data.message.trim().length > 0) {
      throw new Error(data.message)
    }
    if (typeof data?.error === 'string' && data.error.trim().length > 0) {
      throw new Error(data.error)
    }
  } catch {
    const text = await response.text().catch(() => '')
    if (text.trim().length > 0) {
      throw new Error(text)
    }
  }
  throw new Error(fallbackMessage)
}

export async function getLoanTypes(signal?: AbortSignal): Promise<LoanType[]> {
  const response = await fetch(getLoanTypesUrl(), {
    signal,
  })

  if (!response.ok) {
    await handleErrorResponse(response)
  }

  const data = await response.json()
  return Array.isArray(data) ? (data as LoanType[]) : []
}

export async function checkLoanEligibility(
  payload: LoanEligibilityPayload,
  signal?: AbortSignal,
): Promise<LoanEligibilityResponse> {
  const response = await fetch(getCheckEligibilityUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    await handleErrorResponse(response)
  }

  return response.json() as Promise<LoanEligibilityResponse>
}
