// TODO: Accept `data` prop: array of { month: string, income: number, expenses: number }
// TODO: Render a grouped BarChart (recharts) comparing income vs. expenses per month
// TODO: Add a toggle to switch between BarChart (monthly) and LineChart (trend)
// TODO: Show empty state message when data is null or empty

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function BudgetChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
        <p className="text-gray-400 text-center py-12">No data available yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#4ade80" name="Income" />
          <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BudgetChart
