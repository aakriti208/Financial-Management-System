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

const SOURCE_BADGE = {
  SCHOLARSHIP: 'badge-blue',
  ASSISTANTSHIP: 'badge-purple',
  PART_TIME_WORK: 'badge-green',
  FAMILY_SUPPORT: 'badge-amber',
  OTHER: 'badge-gray',
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

  useEffect(() => { fetchIncomes() }, [])

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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Income</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track all your income sources</p>
          </div>
          {incomes.length > 0 && (
            <div className="card px-5 py-3 text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total Income</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">
                ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>

        <IncomeForm
          onSuccess={fetchIncomes}
          editRecord={editRecord}
          onCancelEdit={() => setEditRecord(null)}
        />

        <div className="card mt-6 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
          ) : incomes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm">No income records yet.</p>
              <p className="text-slate-300 text-xs mt-1">Add your first income source above.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {incomes.map(income => (
                  <tr key={income.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{income.date}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{income.source}</td>
                    <td className="px-5 py-3.5">
                      <span className={SOURCE_BADGE[income.sourceType]}>
                        {SOURCE_LABEL[income.sourceType]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">
                      +${parseFloat(income.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{income.description || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => { setEditRecord(income); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          className="text-xs font-medium text-slate-400 hover:text-[#0f2035] transition-colors"
                        >
                          Edit
                        </button>
                        {deleteId === income.id ? (
                          <span className="flex gap-2 items-center">
                            <button onClick={() => handleDelete(income.id)}
                              className="text-xs font-medium text-rose-500 hover:text-rose-700">Confirm</button>
                            <button onClick={() => setDeleteId(null)}
                              className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => setDeleteId(income.id)}
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

export default IncomePage
