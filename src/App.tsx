import './App.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './layout/AppShell'
import { ApplyForLoanPage } from './pages/ApplyForLoan'
import { ChatPage } from './pages/Chat'
import { CheckApplicationStatusPage } from './pages/CheckApplicationStatus'
import { CheckEligibility } from './pages/CheckEligibility'
import { HomePage } from './pages/Home'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/check-eligibility" element={<CheckEligibility />} />
        <Route path="/apply" element={<ApplyForLoanPage />} />
        <Route path="/status" element={<CheckApplicationStatusPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
