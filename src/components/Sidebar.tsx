import { NavLink } from 'react-router-dom'
import {
  FaHome,
  FaComments,
  FaClipboardCheck,
  FaFileContract,
  FaTasks,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'

type NavItem = { to: string; label: string; end?: boolean; icon: IconType }

const navItems: NavItem[] = [
  { to: '/', label: 'Home', end: true, icon: FaHome },
  { to: '/chat', label: 'Chat', icon: FaComments },
  { to: '/check-eligibility', label: 'Check Eligibility', icon: FaClipboardCheck },
  { to: '/apply', label: 'Apply for Loan', icon: FaFileContract },
  { to: '/status', label: 'Check Application Status', icon: FaTasks },
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
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
