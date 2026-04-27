import { useState } from 'react'
import Navbar from '../components/Navbar'
import TuitionForm from '../components/TuitionForm'

function TuitionPlannerPage() {
  const [result, setResult] = useState(null)

  const fmt = (val) =>
    val !== null && val !== undefined
      ? `$${parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      : '—'

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Tuition Planner</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">
            Plan and assess the affordability of your education costs
          </p>
        </div>

        <TuitionForm onResult={setResult} />

        {result && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Affordability Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-4 border-l-4 border-l-slate-300">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Gross Tuition</p>
                <p className="text-xl font-bold text-slate-700 mt-1">{fmt(result.totalTuition)}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {result.numberOfCourses} course{result.numberOfCourses !== 1 ? 's' : ''} ×{' '}
                  {fmt(result.tuitionPerCourse)}
                </p>
              </div>

              <div className="card p-4 border-l-4 border-l-blue-400">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Scholarship / Aid</p>
                <p className="text-xl font-bold text-blue-600 mt-1">−{fmt(result.scholarshipAmount)}</p>
                <p className="text-xs text-slate-400 mt-0.5">Financial aid applied</p>
              </div>

              <div className="card p-4 border-l-4 border-l-emerald-400">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Net Tuition</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">{fmt(result.remainingCost)}</p>
                <p className="text-xs text-slate-400 mt-0.5">Amount you owe</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Current Savings</p>
                <p className="text-xl font-bold text-slate-700 mt-1">{fmt(result.currentSavings)}</p>
                <p className="text-xs text-slate-400 mt-0.5">Your net balance today</p>
              </div>

              <div className="card p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Avg. Monthly Surplus</p>
                <p
                  className={`text-xl font-bold mt-1 ${
                    parseFloat(result.monthlySurplus) > 0 ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {fmt(result.monthlySurplus)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Avg. over last 6 months</p>
              </div>
            </div>

            <div
              className={`card p-5 border-l-4 ${
                result.isAffordable
                  ? 'border-l-emerald-400 bg-emerald-50'
                  : 'border-l-amber-400 bg-amber-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{result.isAffordable ? '✅' : '⏳'}</span>
                <div>
                  <p
                    className={`font-bold text-sm ${
                      result.isAffordable ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {result.isAffordable
                      ? 'Affordable Now'
                      : result.estimatedMonthsToSave != null
                      ? `Save for ${result.estimatedMonthsToSave} month${result.estimatedMonthsToSave !== 1 ? 's' : ''}`
                      : 'Not Currently Achievable'}
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5">{result.affordabilityMessage}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Calculate again
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default TuitionPlannerPage
