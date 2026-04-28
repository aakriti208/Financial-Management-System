import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import Navbar from '../components/Navbar'
import { getExpensePrediction } from '../services/predictionService'

const CATEGORY_COLORS = [
  '#f43f5e', '#fb923c', '#facc15', '#4ade80',
  '#38bdf8', '#818cf8', '#e879f9', '#94a3b8',
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-4 py-3 text-xs shadow-lg">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-rose-500 font-semibold">
        ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

function PredictionPage() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getExpensePrediction()
      .then(data => setPredictions(data ?? []))
      .catch(() => setError('Failed to load predictions. Make sure you have expense history.'))
      .finally(() => setLoading(false))
  }, [])

  const totalPredicted = predictions.reduce((sum, p) => sum + parseFloat(p.amount), 0)

  const chartData = predictions.map(p => ({
    category: p.category,
    amount: parseFloat(p.amount),
  }))

  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const nextMonthLabel = nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Expense Prediction</h1>
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              Projected spending for {nextMonthLabel} based on your 6-month history
            </p>
          </div>
          {predictions.length > 0 && (
            <div className="card px-5 py-3 text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Predicted Total</p>
              <p className="text-xl font-bold text-rose-500 mt-0.5">
                ${totalPredicted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="card p-12 text-center text-slate-400 text-sm">Loading predictions...</div>
        ) : error ? (
          <div className="card p-12 text-center">
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        ) : predictions.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-slate-400 text-sm">No prediction data available.</p>
            <p className="text-slate-300 text-xs mt-1">
              Add at least one month of expense history to generate predictions.
            </p>
          </div>
        ) : (
          <>
            {/* Bar Chart */}
            <div className="card p-6 mb-6">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-slate-700">Predicted Expenses by Category</h2>
                <p className="text-xs text-slate-400 mt-0.5">Moving average of spending per category</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} barCategoryGap="35%" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="amount" name="Predicted" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, idx) => (
                      <Cell key={idx} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Comparison Table */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">Category Breakdown</h2>
                <span className="text-xs text-slate-400">{predictions.length} categories</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Necessity</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Predicted</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {predictions.map((p, idx) => {
                    const amt = parseFloat(p.amount)
                    const pct = totalPredicted > 0 ? ((amt / totalPredicted) * 100).toFixed(1) : 0
                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                            />
                            <span className="font-medium text-slate-700">{p.category}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={p.expenseType === 'FIXED' ? 'badge-amber' : 'badge-blue'}>
                            {p.expenseType === 'FIXED' ? 'Fixed' : 'Variable'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={p.necessity === 'ESSENTIAL' ? 'badge-green' : 'badge-gray'}>
                            {p.necessity === 'ESSENTIAL' ? 'Essential' : 'Discretionary'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-rose-500">
                          ${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                                }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t border-slate-100">
                    <td colSpan={3} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Total Predicted
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-rose-500">
                      ${totalPredicted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-slate-400">100%</td>
                  </tr>
                </tfoot>
              </table>
              <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
                <p className="text-xs text-slate-400">
                  Predictions are based on your moving average spending per category over the last 6 months.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default PredictionPage
