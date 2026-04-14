import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import BudgetChart from '../components/BudgetChart'

function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your financial overview at a glance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard title="Total Income" value={null} subtitle="All time" variant="income" />
          <SummaryCard title="Total Expenses" value={null} subtitle="All time" variant="expense" />
          <SummaryCard title="Net Balance" value={null} subtitle="Income − Expenses" variant="balance" />
        </div>

        <BudgetChart data={null} />
      </main>
    </div>
  )
}

export default DashboardPage
