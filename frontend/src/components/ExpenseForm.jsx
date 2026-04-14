import { useState, useEffect } from 'react'
import { add, update } from '../services/expenseService'

const EXPENSE_CATEGORIES = [
  'Rent', 'Groceries', 'Tuition', 'Transport',
  'Utilities', 'Entertainment', 'Health', 'Other',
]

const EMPTY_FORM = { amount: '', category: '', expenseType: '', necessity: '', date: '', description: '' }

function ExpenseForm({ onSuccess, editRecord, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editRecord) {
      setForm({
        amount: editRecord.amount,
        category: editRecord.category,
        expenseType: editRecord.expenseType,
        necessity: editRecord.necessity,
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
    if (!form.category) { setError('Please select a category'); return }
    if (!form.expenseType) { setError('Please select Fixed or Variable'); return }
    if (!form.necessity) { setError('Please select Essential or Discretionary'); return }
    if (!form.date) { setError('Date is required'); return }

    setLoading(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (editRecord) { await update(editRecord.id, payload) } else { await add(payload) }
      setForm(EMPTY_FORM)
      onSuccess()
      if (onCancelEdit) onCancelEdit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-slate-700 mb-4">
        {editRecord ? 'Edit Expense Record' : 'Add Expense'}
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
          <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} required className="input">
            <option value="">Select category...</option>
            {EXPENSE_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Type</label>
          <div className="flex gap-4">
            {[{ value: 'FIXED', label: 'Fixed' }, { value: 'VARIABLE', label: 'Variable' }].map(opt => (
              <label key={opt.value} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                form.expenseType === opt.value
                  ? 'border-[#0f2035] bg-[#0f2035]/5 text-[#0f2035]'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}>
                <input type="radio" name="expenseType" value={opt.value}
                  checked={form.expenseType === opt.value} onChange={handleChange} className="sr-only" />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Necessity</label>
          <div className="flex gap-4">
            {[{ value: 'ESSENTIAL', label: 'Essential' }, { value: 'DISCRETIONARY', label: 'Discretionary' }].map(opt => (
              <label key={opt.value} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                form.necessity === opt.value
                  ? 'border-[#0f2035] bg-[#0f2035]/5 text-[#0f2035]'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}>
                <input type="radio" name="necessity" value={opt.value}
                  checked={form.necessity === opt.value} onChange={handleChange} className="sr-only" />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange}
            required className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Description <span className="text-slate-400">(optional)</span></label>
          <input type="text" name="description" value={form.description} onChange={handleChange}
            className="input" placeholder="Additional notes..." />
        </div>

        <div className="md:col-span-2 flex gap-3 pt-1">
          <button type="submit" disabled={loading} className="btn-danger">
            {loading ? 'Saving...' : editRecord ? 'Update Expense' : 'Add Expense'}
          </button>
          {editRecord && (
            <button type="button" onClick={onCancelEdit} className="btn-ghost">Cancel</button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
