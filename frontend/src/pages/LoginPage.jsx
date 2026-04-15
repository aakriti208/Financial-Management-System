import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginService } from '../services/authService'
import NumoLogo from '../components/NumoLogo'

const FEATURES = [
  { icon: '↑', label: 'Track every dollar in and out' },
  { icon: '◎', label: 'AI-powered spending insights' },
  { icon: '◈', label: 'Tuition & scholarship planning' },
  // { icon: '⟳', label: 'What-if financial simulations' },
]

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

      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-[46%] bg-[#0a1628] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-emerald-500/10" />
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-emerald-500/10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full border border-white/5 -translate-x-1/2 translate-y-1/2" />

        <NumoLogo size="lg" theme="dark" />

        <div>
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            Money,<br />
            <span className="text-emerald-400">made clear.</span>
          </h1>
          <p className="mt-5 text-slate-400 text-sm leading-relaxed max-w-xs">
            Built for students navigating finances across borders — scholarships, stipends, rent, and everything in between.
          </p>

          <div className="mt-8 space-y-3">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                  {f.icon}
                </span>
                <span className="text-slate-400 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-slate-500 text-xs ml-1">Your data is encrypted and never shared.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          <div className="lg:hidden mb-8">
            <NumoLogo size="md" theme="light" />
          </div>

          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">Welcome back</p>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Sign in</h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Create one free
            </Link>
          </p>

          {successMessage && (
            <div className="mt-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mt-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                required className="input" placeholder="you@university.edu" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                required className="input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1 text-sm">
              {loading ? 'Signing in...' : 'Sign in to Numo →'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-300">
            © {new Date().getFullYear()} Numo. Built for international students.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
