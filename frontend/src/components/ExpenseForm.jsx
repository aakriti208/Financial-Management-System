import { useState, useEffect } from 'react'
import { add, update } from '../services/expenseService'

const EXPENSE_CATEGORIES = [
  'Rent',
  'Groceries',
  'Tuition',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Other',
]

const EMPTY_FORM = {
  amount: '',
  category: '',
  expenseType: '',
  necessity: '',
  date: '',
  description: '',
}

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
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!form.category) {
      setError('Please select a category')
      return
    }
    if (!form.expenseType) {
      setError('Please select Fixed or Variable')
      return
    }
    if (!form.necessity) {
      setError('Please select Essential or Discretionary')
      return
    }
    if (!form.date) {
      setError('Date is required')
      return
    }

    setLoading(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (editRecord) {
        await update(editRecord.id, payload)
      } else {
        await add(payload)
      }
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{editRecord ? 'Edit Expense' : 'Add Expense'}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category...</option>
            {EXPENSE_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <div className="flex gap-4 mt-2">
            {['FIXED', 'VARIABLE'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="expenseType"
                  value={type}
                  checked={form.expenseType === type}
                  onChange={handleChange}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Necessity</label>
          <div className="flex gap-4 mt-2">
            {['ESSENTIAL', 'DISCRETIONARY'].map(n => (
              <label key={n} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="necessity"
                  value={n}
                  checked={form.necessity === n}
                  onChange={handleChange}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{n.charAt(0) + n.slice(1).toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes..."
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : editRecord ? 'Update Expense' : 'Add Expense'}
          </button>
          {editRecord && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
