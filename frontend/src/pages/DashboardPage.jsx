import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import BudgetChart from '../components/BudgetChart'
import { getSummary } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'

const SOURCE_LABEL = {
  SCHOLARSHIP: 'Scholarship', ASSISTANTSHIP: 'Assistantship',
  PART_TIME_WORK: 'Part-time Work', FAMILY_SUPPORT: 'Family Support', OTHER: 'Other',
}

function EmptyState({ icon, title, subtitle, to, linkLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-slate-200 text-4xl mb-3">{icon}</div>
      <p className="text-sm text-slate-400 font-medium">{title}</p>
      <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>
      {to && (
        <Link to={to} className="mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-700">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

function DashboardPage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const recentAll = [
    ...(summary?.recentIncome ?? []).map(i => ({ ...i, _type: 'income' })),
    ...(summary?.recentExpenses ?? []).map(e => ({ ...e, _type: 'expense' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)

  const savingsRate = summary?.totalIncome && parseFloat(summary.totalIncome) > 0
    ? ((parseFloat(summary.netBalance) / parseFloat(summary.totalIncome)) * 100).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-6 py-8 max-w-5xl">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Good {getGreeting()}, {user?.firstName ?? 'there'} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">Here's your Numo snapshot</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Total Income"
            value={loading ? null : summary?.totalIncome ?? 0}
            subtitle="All time"
            variant="income"
          />
          <SummaryCard
            title="Total Expenses"
            value={loading ? null : summary?.totalExpenses ?? 0}
            subtitle="All time"
            variant="expense"
          />
          <SummaryCard
            title="Net Balance"
            value={loading ? null : summary?.netBalance ?? 0}
            subtitle="Income − Expenses"
            variant="balance"
          />
        </div>

        {/* Savings rate banner */}
        {savingsRate !== null && (
          <div className={`card px-5 py-3.5 mb-6 flex items-center justify-between ${
            parseFloat(savingsRate) >= 20
              ? 'border-l-4 border-l-emerald-500'
              : parseFloat(savingsRate) >= 0
              ? 'border-l-4 border-l-amber-400'
              : 'border-l-4 border-l-rose-500'
          }`}>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Savings Rate</p>
              <p className={`text-lg font-bold mt-0.5 ${
                parseFloat(savingsRate) >= 20 ? 'text-emerald-600'
                : parseFloat(savingsRate) >= 0 ? 'text-amber-600'
                : 'text-rose-500'
              }`}>
                {savingsRate}%
              </p>
            </div>
            <p className="text-xs text-slate-400 max-w-xs text-right">
              {parseFloat(savingsRate) >= 20
                ? 'Great job! You\'re saving a healthy portion of your income.'
                : parseFloat(savingsRate) >= 0
                ? 'You\'re breaking even. Try to reduce variable expenses.'
                : 'You\'re spending more than you earn. Review your expenses.'}
            </p>
          </div>
        )}

        {/* Chart */}
        <div className="mb-6">
          <BudgetChart data={summary?.monthlyData ?? null} />
        </div>

        {/* Bottom grid: recent transactions + quick links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent transactions */}
          <div className="lg:col-span-2 card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Recent Transactions</h2>
              <span className="text-xs text-slate-400">{recentAll.length} entries</span>
            </div>

            {loading ? (
              <div className="p-6 text-center text-slate-300 text-sm">Loading...</div>
            ) : recentAll.length === 0 ? (
              <EmptyState
                icon="💳"
                title="No transactions yet"
                subtitle="Start by adding income or expenses"
                to="/income"
                linkLabel="Add income"
              />
            ) : (
              <div className="divide-y divide-slate-50">
                {recentAll.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        item._type === 'income'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-500'
                      }`}>
                        {item._type === 'income' ? '↑' : '↓'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {item._type === 'income' ? item.source : item.category}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item._type === 'income'
                            ? SOURCE_LABEL[item.sourceType]
                            : `${item.expenseType === 'FIXED' ? 'Fixed' : 'Variable'} · ${item.necessity === 'ESSENTIAL' ? 'Essential' : 'Discretionary'}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        item._type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {item._type === 'income' ? '+' : '−'}${parseFloat(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                {[
                  { to: '/income', label: 'Add Income', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100', icon: '+' },
                  { to: '/expenses', label: 'Add Expense', color: 'text-rose-500 bg-rose-50 hover:bg-rose-100', icon: '−' },
                  { to: '/tuition', label: 'Tuition Planner', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100', icon: '🎓' },
                  { to: '/ai-advisor', label: 'Ask AI Advisor', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100', icon: '✦' },
                ].map(({ to, label, color, icon }) => (
                  <Link key={to} to={to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${color}`}>
                    <span className="w-5 text-center">{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Expense breakdown */}
            {(summary?.recentExpenses?.length ?? 0) > 0 && (
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Expense Breakdown</h2>
                <div className="space-y-2">
                  {Object.entries(
                    (summary?.recentExpenses ?? []).reduce((acc, e) => {
                      acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount)
                      return acc
                    }, {})
                  ).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([cat, amt]) => {
                    const total = parseFloat(summary?.totalExpenses ?? 1)
                    const pct = Math.round((amt / total) * 100)
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600 font-medium">{cat}</span>
                          <span className="text-slate-400">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export default DashboardPage
