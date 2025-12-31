import './App.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './layout/AppShell'
import { ApplyForLoanPage } from './pages/ApplyForLoan'
import { ChatPage } from './pages/Chat'
import { CheckApplicationStatusPage } from './pages/CheckApplicationStatus'
import { LoanEligibilityPage } from './pages/LoanEligibility'
import { HomePage } from './pages/Home'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/loan-eligibility" element={<LoanEligibilityPage />} />
        <Route path="/check-eligibility" element={<LoanEligibilityPage />} />
        <Route path="/apply" element={<ApplyForLoanPage />} />
        <Route path="/status" element={<CheckApplicationStatusPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
