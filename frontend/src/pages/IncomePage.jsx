import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import IncomeForm from '../components/IncomeForm'
import { getAll, remove } from '../services/incomeService'

const SOURCE_LABEL = {
  SCHOLARSHIP: 'Scholarship',
  ASSISTANTSHIP: 'Assistantship',
  PART_TIME_WORK: 'Part-time Work',
  FAMILY_SUPPORT: 'Family Support',
  OTHER: 'Other',
}

const SOURCE_COLOR = {
  SCHOLARSHIP: 'bg-blue-100 text-blue-800',
  ASSISTANTSHIP: 'bg-purple-100 text-purple-800',
  PART_TIME_WORK: 'bg-green-100 text-green-800',
  FAMILY_SUPPORT: 'bg-yellow-100 text-yellow-800',
  OTHER: 'bg-gray-100 text-gray-700',
}

function IncomePage() {
  const [incomes, setIncomes] = useState([])
  const [editRecord, setEditRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  const fetchIncomes = async () => {
    try {
      const data = await getAll()
      setIncomes(data)
    } catch (err) {
      console.error('Failed to fetch incomes', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomes()
  }, [])

  const handleDelete = async (id) => {
    try {
      await remove(id)
      setIncomes(incomes.filter(i => i.id !== id))
    } catch (err) {
      console.error('Failed to delete income', err)
    } finally {
      setDeleteId(null)
    }
  }

  const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Income</h1>
          {incomes.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
          )}
        </div>

        <IncomeForm
          onSuccess={fetchIncomes}
          editRecord={editRecord}
          onCancelEdit={() => setEditRecord(null)}
        />

        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-400">Loading...</p>
          ) : incomes.length === 0 ? (
            <p className="p-6 text-gray-400">No income records yet. Add your first one above.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {incomes.map(income => (
                  <tr key={income.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{income.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{income.source}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${SOURCE_COLOR[income.sourceType]}`}>
                        {SOURCE_LABEL[income.sourceType]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      ${parseFloat(income.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{income.description || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setEditRecord(income); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Edit
                        </button>
                        {deleteId === income.id ? (
                          <span className="flex gap-1 items-center">
                            <button
                              onClick={() => handleDelete(income.id)}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="text-gray-500 hover:text-gray-700 text-xs"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setDeleteId(income.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

export default IncomePage
