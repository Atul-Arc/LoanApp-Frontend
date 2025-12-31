import { useEffect, useState } from "react";
import { useToast } from "../components/ToastProvider";

type LoanType = {
  loanTypeId: number;
  loanTypeName: string;
};

const loanTypesEnvValue = import.meta.env.VITE_LOAN_TYPES_URL?.trim();
const DEFAULT_LOAN_TYPES_URL = '/api/Loan/loantypes';
const LOAN_TYPES_API_URL =
  loanTypesEnvValue && loanTypesEnvValue.length > 0 ? loanTypesEnvValue : DEFAULT_LOAN_TYPES_URL;

export function CheckEligibility() {
  const [loanTypeId, setLoanTypeId] = useState<number | ''>('');
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>('');
  const [creditScore, setCreditScore] = useState<number | ''>('');
  const [existingEMI, setExistingEMI] = useState<number | ''>('');
  const { showToast } = useToast();

  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [isLoadingLoanTypes, setIsLoadingLoanTypes] = useState(true);
  const [loanTypesError, setLoanTypesError] = useState<string | null>(null);
  const isLoanTypeUnavailable = isLoadingLoanTypes || !!loanTypesError || loanTypes.length === 0;
  const areFormFieldsLocked = isLoanTypeUnavailable || loanTypeId === '';
  const isSubmitDisabled =
    areFormFieldsLocked ||
    monthlyIncome === '' ||
    creditScore === '' ||
    existingEMI === '';

  const parseNumberInput = (value: string, maxDecimals?: number): number | '' => {
    if (value.trim() === '') {
      return '';
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return '';
    }

    if (typeof maxDecimals === 'number') {
      const factor = 10 ** maxDecimals;
      return Math.round(parsed * factor) / factor;
    }

    return parsed;
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchLoanTypes = async () => {
      setLoanTypesError(null);
      setIsLoadingLoanTypes(true);
      try {
        const response = await fetch(LOAN_TYPES_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch loan types');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setLoanTypes(data as LoanType[]);
        } else {
          setLoanTypes([]);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        const errorMessage = 'Unable to load loan types. Please try again.';
        setLoanTypesError(errorMessage);
        showToast({ message: errorMessage, variant: 'error' });
      } finally {
        setIsLoadingLoanTypes(false);
      }
    };

    fetchLoanTypes();

    return () => {
      controller.abort();
    };
  }, [showToast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

    const payload = {
      loanTypeId,
      monthlyIncome,
      creditScore,
      existingEMI,
    };

    console.log(payload);
  };

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">Check Loan Eligibility</h1>
          <p className="pageSubtitle">
            Fill in the details below to check your loan eligibility.
          </p>
        </div>
      </header>
      <section className="section">
        <form onSubmit={handleSubmit} className="eligibilityForm">
          <div className="formField">
            <label htmlFor="loanType">Loan Type</label>
            <select
              id="loanType"
              value={loanTypeId === '' ? '' : loanTypeId.toString()}
              onChange={(e) => setLoanTypeId(parseNumberInput(e.target.value))}
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
          </div>
          <div className="formField">
            <label htmlFor="monthlyIncome">Monthly Income</label>
            <input
              type="number"
              id="monthlyIncome"
              step="0.01"
              value={monthlyIncome === '' ? '' : monthlyIncome.toString()}
              onChange={(e) => setMonthlyIncome(parseNumberInput(e.target.value, 2))}
              required
              disabled={areFormFieldsLocked}
            />
          </div>
          <div className="formField">
            <label htmlFor="creditScore">Credit Score</label>
            <input
              type="number"
              id="creditScore"
              value={creditScore === '' ? '' : creditScore.toString()}
              onChange={(e) => {
                const parsedValue = parseNumberInput(e.target.value);
                if (parsedValue === '') {
                  setCreditScore('');
                  return;
                }
                setCreditScore(parsedValue > 900 ? 900 : parsedValue);
              }}
              max="900"
              required
              disabled={areFormFieldsLocked}
            />
          </div>
          <div className="formField">
            <label htmlFor="existingEMI">Existing EMI</label>
            <input
              type="number"
              id="existingEMI"
              step="0.01"
              value={existingEMI === '' ? '' : existingEMI.toString()}
              onChange={(e) => setExistingEMI(parseNumberInput(e.target.value, 2))}
              required
              disabled={areFormFieldsLocked}
            />
          </div>
          <button
            type="submit"
            className="submitButton"
            disabled={isSubmitDisabled}
          >
            Check Eligibility
          </button>
        </form>
      </section>
    </div>
  )
}
