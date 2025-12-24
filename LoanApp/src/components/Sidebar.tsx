import { NavLink } from 'react-router-dom'

type NavItem = { to: string; label: string; end?: boolean }

const navItems: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/chat', label: 'Chat' },
  { to: '/apply', label: 'Apply for Loan' },
  { to: '/status', label: 'Check Application Status' },
]

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary">
      
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
