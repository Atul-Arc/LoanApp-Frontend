import { useState } from "react";

export function CheckEligibility() {
  const [loanType, setLoanType] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [existingEMI, setExistingEMI] = useState('');

  const loanTypes = [
    'Personal Loan',
    'Business Loan',
    'Home Loan (Salaried)',
    'Home Loan (Self Employed)',
    'Loan Against Property (Salaried)',
    'Loan Against Property (Self Employed)',
    'New Car Loan (Salaried)',
    'New Car Loan (Self Employed)',
    'Used Car Loan (Salaried)',
    'Used Car Loan (Self Employed)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      loanType,
      monthlyIncome,
      creditScore,
      existingEMI,
    });
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
            <select id="loanType" value={loanType} onChange={(e) => setLoanType(e.target.value)} required>
              <option value="" disabled>Select a loan type</option>
              {loanTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="formField">
            <label htmlFor="monthlyIncome">Monthly Income</label>
            <input
              type="number"
              id="monthlyIncome"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              required
            />
          </div>
          <div className="formField">
            <label htmlFor="creditScore">Credit Score</label>
            <input
              type="number"
              id="creditScore"
              value={creditScore}
              onChange={(e) => {
                if (Number(e.target.value) > 900) {
                  setCreditScore('900');
                } else {
                  setCreditScore(e.target.value);
                }
              }}
              max="900"
              required
            />
          </div>
          <div className="formField">
            <label htmlFor="existingEMI">Existing EMI</label>
            <input
              type="number"
              id="existingEMI"
              value={existingEMI}
              onChange={(e) => setExistingEMI(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submitButton">Check Eligibility</button>
        </form>
      </section>
    </div>
  )
}
