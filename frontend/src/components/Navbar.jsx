import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/income', label: 'Income' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/tuition', label: 'Tuition' },
  { to: '/prediction', label: 'Prediction' },
  { to: '/ai-advisor', label: 'AI Advisor' },
  { to: '/simulation', label: 'Simulation' },
]

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-[#0f2035] text-white shadow-lg">
      <div className="container mx-auto px-6 py-0 flex items-center justify-between h-16">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">$</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">FinanceMS</span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-semibold">
                {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <span className="text-sm text-slate-300 hidden md:block">{user?.firstName ?? 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition-colors duration-150"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
