import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  checkLoanEligibility,
  getLoanTypes,
  type EmploymentType,
  type LoanEligibilityPayload,
  type LoanEligibilityResponse,
  type LoanType,
} from '../api/loan'
import { useToast } from '../components/ToastProvider'

const EMPLOYMENT_OPTIONS: EmploymentType[] = ['Salaried', 'Self Employed']
const EMPLOYMENT_SUFFIX_REGEX = /\(([^)]+)\)\s*$/

const normalizeEmploymentLabel = (value: string) => value.trim().toLowerCase()

const inferEmploymentTypeFromLoan = (loanTypeName: string): EmploymentType | null => {
  const match = loanTypeName.match(EMPLOYMENT_SUFFIX_REGEX)
  if (!match) {
    return null
  }

  const normalized = normalizeEmploymentLabel(match[1])
  if (normalized === 'salaried') {
    return 'Salaried'
  }
  if (normalized === 'self employed') {
    return 'Self Employed'
  }
  return null
}

const parseNumberInput = (value: string, maxDecimals?: number): number | '' => {
  const trimmed = value.trim()
  if (trimmed === '') {
    return ''
  }

  const parsed = Number(trimmed)
  if (Number.isNaN(parsed)) {
    return ''
  }

  if (typeof maxDecimals === 'number') {
    const factor = 10 ** maxDecimals
    return Math.round(parsed * factor) / factor
  }

  return parsed
}

const toInteger = (value: number) => Math.max(0, Math.trunc(value))
const clampCreditScore = (value: number) => Math.min(900, Math.max(0, value))

const formatNumber = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

export function LoanEligibilityPage() {
  const { showToast } = useToast()

  const [loanTypes, setLoanTypes] = useState<LoanType[]>([])
  const [isLoadingLoanTypes, setIsLoadingLoanTypes] = useState(true)
  const [loanTypesError, setLoanTypesError] = useState<string | null>(null)

  const [loanTypeId, setLoanTypeId] = useState<number | ''>('')
  const [requestedAmount, setRequestedAmount] = useState<number | ''>('')
  const [tenureInMonths, setTenureInMonths] = useState<number | ''>('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>('')
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>('')
  const [existingEMI, setExistingEMI] = useState<number | ''>('')
  const [creditScore, setCreditScore] = useState<number | ''>('')

  const [eligibilityResult, setEligibilityResult] = useState<LoanEligibilityResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedLoanType = useMemo(
    () => loanTypes.find(type => typeof loanTypeId === 'number' && type.loanTypeId === loanTypeId) ?? null,
    [loanTypeId, loanTypes],
  )

  const requiredEmploymentType = useMemo(() => {
    if (!selectedLoanType) {
      return null
    }
    return inferEmploymentTypeFromLoan(selectedLoanType.loanTypeName)
  }, [selectedLoanType])

  const employmentMismatchError = useMemo(() => {
    if (!requiredEmploymentType || !employmentType) {
      return ''
    }
    if (employmentType !== requiredEmploymentType) {
      return `This loan requires ${requiredEmploymentType} employment.`
    }
    return ''
  }, [employmentType, requiredEmploymentType])

  useEffect(() => {
    const controller = new AbortController()

    const fetchLoanTypes = async () => {
      setLoanTypesError(null)
      setIsLoadingLoanTypes(true)
      try {
        const types = await getLoanTypes(controller.signal)
        setLoanTypes(types)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to load loan types. Please try again.'
        setLoanTypes([])
        setLoanTypesError(message)
        showToast({ message, variant: 'error' })
      } finally {
        setIsLoadingLoanTypes(false)
      }
    }

    fetchLoanTypes()

    return () => {
      controller.abort()
    }
  }, [showToast])

  const isLoanTypeUnavailable = isLoadingLoanTypes || !!loanTypesError || loanTypes.length === 0
  const areFormFieldsLocked = isLoanTypeUnavailable || loanTypeId === ''

  const isFormValid = useMemo(() => {
    if (
      typeof loanTypeId !== 'number' ||
      typeof requestedAmount !== 'number' ||
      typeof tenureInMonths !== 'number' ||
      typeof monthlyIncome !== 'number' ||
      typeof existingEMI !== 'number' ||
      typeof creditScore !== 'number'
    ) {
      return false
    }

    return (
      requestedAmount > 0 &&
      tenureInMonths > 0 &&
      monthlyIncome > 0 &&
      existingEMI >= 0 &&
      creditScore >= 0 &&
      !!dateOfBirth &&
      employmentType !== '' &&
      (!requiredEmploymentType || employmentType === requiredEmploymentType)
    )
  }, [
    loanTypeId,
    requestedAmount,
    tenureInMonths,
    monthlyIncome,
    existingEMI,
    creditScore,
    employmentType,
    dateOfBirth,
    requiredEmploymentType,
  ])

  const isSubmitDisabled =
    isSubmitting ||
    !isFormValid ||
    isLoanTypeUnavailable

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitDisabled) {
      return
    }

    const payload: LoanEligibilityPayload = {
      loanTypeId: loanTypeId as number,
      requestedAmount: requestedAmount as number,
      tenureInMonths: tenureInMonths as number,
      dateOfBirth,
      employmentType: employmentType as EmploymentType,
      monthlyIncome: monthlyIncome as number,
      existingEMI: existingEMI as number,
      creditScore: creditScore as number,
    }

    setIsSubmitting(true)
    setEligibilityResult(null)
    try {
      const result = await checkLoanEligibility(payload)
      setEligibilityResult(result)
      showToast({ message: 'Eligibility check completed.', variant: 'success' })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to check loan eligibility. Please try again.'
      showToast({ message, variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">Loan Eligibility</h1>
          <p className="pageSubtitle">
            Provide your financial details to see if you qualify for the selected loan type.
          </p>
        </div>
      </header>

      <section className="section">
        <form onSubmit={handleSubmit} className="eligibilityForm" noValidate>
          <div className="formField">
            <label htmlFor="loanType">Loan Type</label>
            <select
              id="loanType"
              value={loanTypeId === '' ? '' : loanTypeId.toString()}
              onChange={(event) => {
                const parsedValue = parseNumberInput(event.target.value)
                setLoanTypeId(parsedValue === '' ? '' : toInteger(Math.max(0, parsedValue)))
              }}
              required
              disabled={isLoanTypeUnavailable}
            >
              <option value="" disabled>
                {isLoadingLoanTypes ? 'Loading loan types...' : 'Select a loan type'}
              </option>
              {loanTypes.map(({ loanTypeId: id, loanTypeName }) => (
                <option key={id} value={id.toString()}>
                  {loanTypeName}
                </option>
              ))}
            </select>
            {loanTypesError && (
              <p className="formError" role="alert">
                {loanTypesError}
              </p>
            )}
          </div>

          <div className="formField">
            <label htmlFor="requestedAmount">Requested Amount</label>
            <input
              type="number"
              id="requestedAmount"
              min="1"
              step="1000"
              value={requestedAmount === '' ? '' : requestedAmount.toString()}
              onChange={(event) => {
                const parsedValue = parseNumberInput(event.target.value, 2)
                setRequestedAmount(parsedValue === '' ? '' : Math.max(0, parsedValue))
              }}
              required
              disabled={areFormFieldsLocked}
            />
          </div>

          <div className="formField">
            <label htmlFor="tenureInMonths">Tenure (Months)</label>
            <input
              type="number"
              id="tenureInMonths"
              min="1"
              step="1"
              value={tenureInMonths === '' ? '' : tenureInMonths.toString()}
              onChange={(event) => {
                const parsedValue = parseNumberInput(event.target.value)
                setTenureInMonths(parsedValue === '' ? '' : toInteger(parsedValue))
              }}
              required
              disabled={areFormFieldsLocked}
            />
          </div>

          <div className="formField">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              required
              disabled={areFormFieldsLocked}
            />
          </div>

          <div className="formField">
            <label htmlFor="employmentType">Employment Type</label>
            <select
              id="employmentType"
              value={employmentType || ''}
              onChange={(event) =>
                setEmploymentType(event.target.value as EmploymentType | '')
              }
              required
              disabled={areFormFieldsLocked}
            >
              <option value="" disabled>
                Select employment type
              </option>
              {EMPLOYMENT_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {requiredEmploymentType && (
              <p className="formHelper" role="note">
                This loan type is available for {requiredEmploymentType} applicants.
              </p>
            )}
            {employmentMismatchError && (
              <p className="formError" role="alert">
                {employmentMismatchError}
              </p>
            )}
          </div>

          <div className="formField">
            <label htmlFor="monthlyIncome">Monthly Income</label>
            <input
              type="number"
              id="monthlyIncome"
              min="1"
              step="0.01"
              value={monthlyIncome === '' ? '' : monthlyIncome.toString()}
              onChange={(event) => {
                const parsedValue = parseNumberInput(event.target.value, 2)
                setMonthlyIncome(parsedValue === '' ? '' : Math.max(0, parsedValue))
              }}
              required
              disabled={areFormFieldsLocked}
            />
          </div>

          <div className="formField">
            <label htmlFor="existingEMI">Existing EMI</label>
            <input
              type="number"
              id="existingEMI"
              min="0"
              step="0.01"
              value={existingEMI === '' ? '' : existingEMI.toString()}
              onChange={(event) => {
                const parsedValue = parseNumberInput(event.target.value, 2)
                setExistingEMI(parsedValue === '' ? '' : Math.max(0, parsedValue))
              }}
              required
              disabled={areFormFieldsLocked}
            />
          </div>

          <div className="formField">
            <label htmlFor="creditScore">Credit Score</label>
            <input
              type="number"
              id="creditScore"
              min="0"
              max="900"
              step="1"
              value={creditScore === '' ? '' : creditScore.toString()}
              onChange={(event) => {
                const parsedValue = parseNumberInput(event.target.value)
                if (parsedValue === '') {
                  setCreditScore('')
                  return
                }
                setCreditScore(clampCreditScore(parsedValue))
              }}
              required
              disabled={areFormFieldsLocked}
            />
          </div>

          <button type="submit" className="submitButton" disabled={isSubmitDisabled}>
            {isSubmitting ? 'Checking...' : 'Check Eligibility'}
          </button>
        </form>

        {eligibilityResult && (
          <div
            className={`eligibilityResult ${eligibilityResult.isEligible ? 'eligibilityResult--success' : 'eligibilityResult--error'}`}
            role="status"
          >
            <div className="eligibilityResult__status">
              <p className="eligibilityResult__title">{eligibilityResult.eligibilityStatus}</p>
              <p className="eligibilityResult__remarks">{eligibilityResult.remarks}</p>
            </div>

            {eligibilityResult.isEligible && (
              <div className="eligibilityResult__metrics">
                {typeof eligibilityResult.calculatedEMI === 'number' && (
                  <div className="eligibilityResult__metric">
                    <span className="eligibilityResult__metric-label">Calculated EMI</span>
                    <span className="eligibilityResult__metric-value">
                      INR {formatNumber(eligibilityResult.calculatedEMI)}
                    </span>
                  </div>
                )}
                {typeof eligibilityResult.emiToIncomePct === 'number' && (
                  <div className="eligibilityResult__metric">
                    <span className="eligibilityResult__metric-label">EMI / Income %</span>
                    <span className="eligibilityResult__metric-value">
                      {eligibilityResult.emiToIncomePct.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
