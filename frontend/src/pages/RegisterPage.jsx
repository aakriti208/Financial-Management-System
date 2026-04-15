import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerService } from '../services/authService'
import NumoLogo from '../components/NumoLogo'

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
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (form.password.length < 8) e.password = 'Min. 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    setLoading(true)
    try {
      await registerService({
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, password: form.password,
      })
      navigate('/login', { state: { message: 'Account created! Sign in to get started.' } })
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-1.5">{label}</label>
      <input type={type} name={name} value={form[name]} onChange={handleChange}
        className="input" placeholder={placeholder} />
      {errors[name] && <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-[46%] bg-[#0a1628] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-emerald-500/10" />
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-emerald-500/10" />

        <NumoLogo size="lg" theme="dark" />

        <div>
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            Your numbers,<br />
            <span className="text-emerald-400">your story.</span>
          </h1>
          <p className="mt-5 text-slate-400 text-sm leading-relaxed max-w-xs">
            Join students who use Numo to take control of scholarships, assistantships, expenses, and tuition - all in one place.
          </p>

          {/* Social proof */}
          <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/8">
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-amber-400 text-sm">★</span>
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "Numo helped me understand where my stipend was going every month. I finally feel in control."
            </p>
            <p className="text-slate-500 text-xs mt-3 font-medium">— PhD student, International Program</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-slate-500 text-xs ml-1">Free to use. No credit card required.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <div className="lg:hidden mb-8">
            <NumoLogo size="md" theme="light" />
          </div>

          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">Get started free</p>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create your account</h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Already have one?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Sign in
            </Link>
          </p>

          {serverError && (
            <div className="mt-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="flex gap-3">
              <Field label="First name" name="firstName" placeholder="Jane" />
              <Field label="Last name" name="lastName" placeholder="Doe" />
            </div>
            <Field label="Email address" name="email" type="email" placeholder="you@university.edu" />
            <Field label="Password" name="password" type="password" placeholder="Min. 8 characters" />
            <Field label="Confirm password" name="confirmPassword" type="password" placeholder="••••••••" />

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1 text-sm">
              {loading ? 'Creating your account...' : 'Create my Numo account →'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-300 leading-relaxed">
            By creating an account you agree to Numo's terms of service and privacy policy.
          </p>

          <p className="mt-6 text-center text-xs text-slate-300">
            © {new Date().getFullYear()} Numo. Built for international students.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
