import { useState, useEffect } from 'react'
import { add, update } from '../services/incomeService'

const SOURCE_TYPES = [
  { value: 'SCHOLARSHIP', label: 'Scholarship' },
  { value: 'ASSISTANTSHIP', label: 'Assistantship' },
  { value: 'PART_TIME_WORK', label: 'Part-time Work' },
  { value: 'FAMILY_SUPPORT', label: 'Family Support' },
  { value: 'OTHER', label: 'Other' },
]

const EMPTY_FORM = { amount: '', source: '', sourceType: '', date: '', description: '' }

function IncomeForm({ onSuccess, editRecord, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editRecord) {
      setForm({
        amount: editRecord.amount,
        source: editRecord.source,
        sourceType: editRecord.sourceType,
        date: editRecord.date,
        description: editRecord.description || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editRecord])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || parseFloat(form.amount) <= 0) { setError('Amount must be greater than 0'); return }
    if (!form.source.trim()) { setError('Source name is required'); return }
    if (!form.sourceType) { setError('Please select a source type'); return }
    if (!form.date) { setError('Date is required'); return }

    setLoading(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (editRecord) { await update(editRecord.id, payload) } else { await add(payload) }
      setForm(EMPTY_FORM)
      onSuccess()
      if (onCancelEdit) onCancelEdit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save income record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-slate-700 mb-4">
        {editRecord ? 'Edit Income Record' : 'Add Income'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange}
            min="0.01" step="0.01" required className="input" placeholder="0.00" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Source Type</label>
          <select name="sourceType" value={form.sourceType} onChange={handleChange} required className="input">
            <option value="">Select type...</option>
            {SOURCE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Source Name</label>
          <input type="text" name="source" value={form.source} onChange={handleChange}
            required className="input" placeholder="e.g. NSF Fellowship, TA Position" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange}
            required className="input" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Description <span className="text-slate-400">(optional)</span></label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows={2} className="input resize-none" placeholder="Additional notes..." />
        </div>

        <div className="md:col-span-2 flex gap-3 pt-1">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : editRecord ? 'Update Income' : 'Add Income'}
          </button>
          {editRecord && (
            <button type="button" onClick={onCancelEdit} className="btn-ghost">Cancel</button>
          )}
        </div>
      </form>
    </div>
  )
}

export default IncomeForm
