import { useState } from 'react'
import { calculate } from '../services/tuitionService'

const EMPTY_FORM = { tuitionPerCourse: '', numberOfCourses: '', scholarshipAmount: '' }

function TuitionForm({ onResult }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const gross =
    form.tuitionPerCourse && form.numberOfCourses
      ? parseFloat(form.tuitionPerCourse) * parseInt(form.numberOfCourses)
      : null

  const net =
    gross !== null
      ? Math.max(0, gross - (parseFloat(form.scholarshipAmount) || 0))
      : null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.tuitionPerCourse || parseFloat(form.tuitionPerCourse) <= 0) {
      setError('Tuition per course must be greater than 0.')
      return
    }
    if (!form.numberOfCourses || parseInt(form.numberOfCourses) < 1) {
      setError('Number of courses must be at least 1.')
      return
    }
    if (form.scholarshipAmount && parseFloat(form.scholarshipAmount) < 0) {
      setError('Scholarship amount cannot be negative.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        tuitionPerCourse: parseFloat(form.tuitionPerCourse),
        numberOfCourses: parseInt(form.numberOfCourses),
        scholarshipAmount: form.scholarshipAmount ? parseFloat(form.scholarshipAmount) : 0,
      }
      const result = await calculate(payload)
      onResult(result)
    } catch (err) {
      setError('Failed to calculate tuition. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (val) =>
    val !== null ? `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Calculate Tuition Cost</h2>

      {error && (
        <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Tuition Per Course ($)
            </label>
            <input
              type="number"
              name="tuitionPerCourse"
              value={form.tuitionPerCourse}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              placeholder="e.g. 1500.00"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Number of Courses
            </label>
            <input
              type="number"
              name="numberOfCourses"
              value={form.numberOfCourses}
              onChange={handleChange}
              min="1"
              step="1"
              placeholder="e.g. 4"
              className="input"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Scholarship / Financial Aid ($){' '}
              <span className="text-slate-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="number"
              name="scholarshipAmount"
              value={form.scholarshipAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 500.00"
              className="input"
            />
          </div>
        </div>

        {gross !== null && (
          <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Gross Tuition</p>
              <p className="text-lg font-bold text-slate-700 mt-0.5">{fmt(gross)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Net After Aid</p>
              <p className="text-lg font-bold text-emerald-600 mt-0.5">{fmt(net)}</p>
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Affordability'}
        </button>
      </form>
    </div>
  )
}

export default TuitionForm
