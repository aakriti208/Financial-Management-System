import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginService } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const successMessage = location.state?.message

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await loginService(form)
      login({ email: data.email, firstName: data.firstName, lastName: data.lastName }, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f2035] flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">$</span>
          </div>
          <span className="text-white font-bold text-xl">FinanceMS</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-snug">
            Manage your finances<br />
            <span className="text-emerald-400">with confidence.</span>
          </h1>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm">
            Track income, monitor expenses, plan tuition, and get AI-powered financial guidance — all in one place.
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-2xl font-bold text-emerald-400">100%</p>
            <p className="text-slate-500 text-xs mt-0.5">Secure & private</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">Real-time</p>
            <p className="text-slate-500 text-xs mt-0.5">Financial insights</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">$</span>
            </div>
            <span className="text-[#0f2035] font-bold text-lg">FinanceMS</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>

          {successMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
