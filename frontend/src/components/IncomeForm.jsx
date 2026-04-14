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
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!form.source.trim()) {
      setError('Source name is required')
      return
    }
    if (!form.sourceType) {
      setError('Please select a source type')
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
      setError(err.response?.data?.message || 'Failed to save income record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{editRecord ? 'Edit Income' : 'Add Income'}</h2>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
          <select
            name="sourceType"
            value={form.sourceType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type...</option>
            {SOURCE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
          <input
            type="text"
            name="source"
            value={form.source}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. NSF Fellowship, TA Position"
          />
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes..."
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : editRecord ? 'Update Income' : 'Add Income'}
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

export default IncomeForm
