import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerService } from '../services/authService'

function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setServerError('')
  }

  const validate = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = 'Required'
    if (!form.lastName.trim()) newErrors.lastName = 'Required'
    if (!form.email.trim()) newErrors.email = 'Required'
    if (form.password.length < 8) newErrors.password = 'Min. 8 characters'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      await registerService({
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, password: form.password,
      })
      navigate('/login', { state: { message: 'Account created! Please sign in.' } })
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
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
            Take control of<br />
            <span className="text-emerald-400">your money.</span>
          </h1>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm">
            Built for international students — track scholarships, assistantships, tuition costs, and daily expenses in one secure dashboard.
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-2xl font-bold text-emerald-400">Free</p>
            <p className="text-slate-500 text-xs mt-0.5">No credit card needed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">AI-powered</p>
            <p className="text-slate-500 text-xs mt-0.5">Smart advisor</p>
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

          <h2 className="text-2xl font-bold text-slate-800">Create your account</h2>
          <p className="text-slate-500 text-sm mt-1">Start managing your finances today</p>

          {serverError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="input" placeholder="Jane" />
                {errors.firstName && <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="input" placeholder="Doe" />
                {errors.lastName && <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input" placeholder="Min. 8 characters" />
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input" placeholder="••••••••" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
