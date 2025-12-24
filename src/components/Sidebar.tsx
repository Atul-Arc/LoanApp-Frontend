import { NavLink } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'

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

      <div className="sidebar__footer">
        <a
          href="https://github.com/Atul-Arc"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar__link"
        >
          <FaGithub />
          <span>GitHub</span>
        </a>
      </div>
    </aside>
  )
}
