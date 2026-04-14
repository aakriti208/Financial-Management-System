import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ExpenseForm from '../components/ExpenseForm'
import { getAll, remove } from '../services/expenseService'

function ExpensePage() {
  const [expenses, setExpenses] = useState([])
  const [editRecord, setEditRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const fetchExpenses = async () => {
    try {
      const data = await getAll()
      setExpenses(data)
    } catch (err) {
      console.error('Failed to fetch expenses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleDelete = async (id) => {
    try {
      await remove(id)
      setExpenses(expenses.filter(e => e.id !== id))
    } catch (err) {
      console.error('Failed to delete expense', err)
    } finally {
      setDeleteId(null)
    }
  }

  const filtered = filter === 'ALL'
    ? expenses
    : expenses.filter(e => e.expenseType === filter || e.necessity === filter)

  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
  const fixedTotal = expenses.filter(e => e.expenseType === 'FIXED').reduce((sum, e) => sum + parseFloat(e.amount), 0)
  const variableTotal = expenses.filter(e => e.expenseType === 'VARIABLE').reduce((sum, e) => sum + parseFloat(e.amount), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
          {expenses.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
            </div>
          )}
        </div>

        {expenses.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Fixed</p>
              <p className="text-xl font-bold text-gray-800">${fixedTotal.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Variable</p>
              <p className="text-xl font-bold text-gray-800">${variableTotal.toFixed(2)}</p>
            </div>
          </div>
        )}

        <ExpenseForm
          onSuccess={fetchExpenses}
          editRecord={editRecord}
          onCancelEdit={() => setEditRecord(null)}
        />

        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="flex gap-2 p-4 border-b border-gray-100">
            {['ALL', 'FIXED', 'VARIABLE', 'ESSENTIAL', 'DISCRETIONARY'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="p-6 text-gray-400">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-gray-400">No expense records yet. Add your first one above.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Necessity</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(expense => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{expense.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{expense.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expense.expenseType === 'FIXED'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {expense.expenseType === 'FIXED' ? 'Fixed' : 'Variable'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expense.necessity === 'ESSENTIAL'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {expense.necessity === 'ESSENTIAL' ? 'Essential' : 'Discretionary'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-red-500">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{expense.description || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setEditRecord(expense); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Edit
                        </button>
                        {deleteId === expense.id ? (
                          <span className="flex gap-1 items-center">
                            <button
                              onClick={() => handleDelete(expense.id)}
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
                            onClick={() => setDeleteId(expense.id)}
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

export default ExpensePage
