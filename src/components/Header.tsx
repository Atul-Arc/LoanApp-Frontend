import { useNavigate } from 'react-router-dom'

export function Header() {
  // Mock user name - in a real app, this would come from auth context or state
  const userName = 'Atul Kharecha'
  const navigate = useNavigate()

  const handleLogout = () => {
    // Mock logout - in a real app, this would clear auth tokens and redirect
    alert('Logged out successfully!')
  }

  const handleBrandClick = () => {
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          Loan Eligibility
        </div>
        { <div className="header__user">
          <span className="header__user-name">Welcome, {userName}</span>
          <button className="header__logout" onClick={handleLogout}>
            Log Out
          </button>
        </div> }
      </div>
    </header>
  )
}