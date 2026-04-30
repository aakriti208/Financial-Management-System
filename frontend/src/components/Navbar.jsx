import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NumoLogo from './NumoLogo'

const NAV_LINKS = [
  { to: '/dashboard',  label: 'Dashboard'  },
  { to: '/income',     label: 'Income'     },
  { to: '/expenses',   label: 'Expenses'   },
  { to: '/tuition',    label: 'Tuition'    },
  { to: '/prediction', label: 'Prediction' },
  // { to: '/ai-advisor', label: 'AI Advisor' },
  // { to: '/simulation', label: 'Simulation' },
]

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean).join('').toUpperCase() || 'U'

  return (
    <nav className="bg-[#0a1628] text-white border-b border-white/5">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">

        <NumoLogo size="md" theme="dark" />

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/7'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-bold">{initials}</span>
            </div>
            <span className="text-sm text-slate-300 hidden md:block font-medium">
              {user?.firstName ?? 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-all duration-150 font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
