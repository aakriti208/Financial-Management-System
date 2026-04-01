// TODO: Display app logo/name on the left
// TODO: Add navigation links: Dashboard, Income, Expenses, Tuition, Prediction, AI Advisor, Simulation
// TODO: Highlight the active route using NavLink from react-router-dom
// TODO: Show logged-in user's first name on the right
// TODO: Add logout button that calls logout() from AuthContext and redirects to /login
// TODO: Make responsive with a hamburger menu on mobile

import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-xl tracking-tight">FMS</span>

        {/* TODO: Replace with proper NavLink list */}
        <div className="hidden md:flex gap-4 text-sm">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/income">Income</NavLink>
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/tuition">Tuition</NavLink>
          <NavLink to="/prediction">Prediction</NavLink>
          <NavLink to="/ai-advisor">AI Advisor</NavLink>
          <NavLink to="/simulation">Simulation</NavLink>
        </div>

        <div className="flex items-center gap-3">
          {/* TODO: Show user?.firstName */}
          <span className="text-sm">{user?.firstName ?? 'User'}</span>
          <button
            onClick={logout}
            className="bg-white text-blue-600 text-sm px-3 py-1 rounded hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
