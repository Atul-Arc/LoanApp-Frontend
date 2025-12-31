import { NavLink } from 'react-router-dom'
import {
  FaHome,
  FaComments,
  FaClipboardCheck,
  FaFileContract,
  FaTasks,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'

type NavItem = {
  to: string
  label: string
  end?: boolean
  icon: IconType
  disabled?: boolean
  tooltip?: string
}

const DISABLED_LINK_TOOLTIP = 'Work in progress - coming soon'

const navItems: NavItem[] = [
  { to: '/', label: 'Home', end: true, icon: FaHome },
  { to: '/chat', label: 'Chat', icon: FaComments },
  { to: '/loan-eligibility', label: 'Loan Eligibility', icon: FaClipboardCheck },
  {
    to: '/apply',
    label: 'Apply for Loan',
    icon: FaFileContract,
    disabled: true,
    tooltip: DISABLED_LINK_TOOLTIP,
  },
  {
    to: '/status',
    label: 'Check Application Status',
    icon: FaTasks,
    disabled: true,
    tooltip: DISABLED_LINK_TOOLTIP,
  },
]

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary">
      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const content = (
            <>
              <item.icon />
              <span>{item.label}</span>
              {item.disabled && <span className="sidebar__chip">WIP</span>}
            </>
          )

          if (item.disabled) {
            return (
              <div
                key={item.to}
                className="sidebar__link sidebar__link--disabled"
                aria-disabled="true"
                title={item.tooltip || DISABLED_LINK_TOOLTIP}
              >
                {content}
              </div>
            )
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
              title={item.tooltip}
            >
              {content}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
