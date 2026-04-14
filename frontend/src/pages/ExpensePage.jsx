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

  useEffect(() => { fetchExpenses() }, [])

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

  const FILTERS = ['ALL', 'FIXED', 'VARIABLE', 'ESSENTIAL', 'DISCRETIONARY']

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
            <p className="text-sm text-slate-500 mt-0.5">Categorize and track your spending</p>
          </div>
          {expenses.length > 0 && (
            <div className="card px-5 py-3 text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total Expenses</p>
              <p className="text-xl font-bold text-rose-500 mt-0.5">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>

        {expenses.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-4 border-l-4 border-l-amber-400">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Fixed</p>
              <p className="text-lg font-bold text-slate-700 mt-1">
                ${fixedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Rent, insurance, subscriptions</p>
            </div>
            <div className="card p-4 border-l-4 border-l-blue-400">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Variable</p>
              <p className="text-lg font-bold text-slate-700 mt-1">
                ${variableTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Food, transport, entertainment</p>
            </div>
          </div>
        )}

        <ExpenseForm
          onSuccess={fetchExpenses}
          editRecord={editRecord}
          onCancelEdit={() => setEditRecord(null)}
        />

        <div className="card mt-6 overflow-hidden">
          <div className="flex gap-2 px-5 py-3 border-b border-slate-100">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-[#0f2035] text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm">No expense records yet.</p>
              <p className="text-slate-300 text-xs mt-1">Add your first expense above.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Necessity</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{expense.date}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{expense.category}</td>
                    <td className="px-5 py-3.5">
                      <span className={expense.expenseType === 'FIXED' ? 'badge-amber' : 'badge-blue'}>
                        {expense.expenseType === 'FIXED' ? 'Fixed' : 'Variable'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={expense.necessity === 'ESSENTIAL' ? 'badge-green' : 'badge-gray'}>
                        {expense.necessity === 'ESSENTIAL' ? 'Essential' : 'Discretionary'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-rose-500">
                      −${parseFloat(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{expense.description || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => { setEditRecord(expense); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          className="text-xs font-medium text-slate-400 hover:text-[#0f2035] transition-colors"
                        >
                          Edit
                        </button>
                        {deleteId === expense.id ? (
                          <span className="flex gap-2 items-center">
                            <button onClick={() => handleDelete(expense.id)}
                              className="text-xs font-medium text-rose-500 hover:text-rose-700">Confirm</button>
                            <button onClick={() => setDeleteId(null)}
                              className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => setDeleteId(expense.id)}
                            className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors">
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
