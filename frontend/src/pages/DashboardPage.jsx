// TODO: On mount, fetch dashboard summary via dashboardService.getSummary()
// TODO: Display 3 SummaryCards: Total Income, Total Expenses, Net Balance
// TODO: Render BudgetChart with monthly income vs. expense data
// TODO: Show recent transactions list

import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import BudgetChart from '../components/BudgetChart'

function DashboardPage() {
  // TODO: const { data, loading, error } = useDashboard() or useState + useEffect

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard title="Total Income" value={null} subtitle="All time" />
          <SummaryCard title="Total Expenses" value={null} subtitle="All time" />
          <SummaryCard title="Net Balance" value={null} subtitle="Income - Expenses" />
          {/* TODO: Replace null with real values from API */}
        </div>

        {/* Budget Chart */}
        <BudgetChart data={null} />

        {/* TODO: Add recent transactions section */}
      </main>
    </div>
  )
}

export default DashboardPage
