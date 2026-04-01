// TODO: Accept props: title (string), value (number|string), subtitle (string), trend (optional)
// TODO: Format value as currency (e.g. $1,234.56) using Intl.NumberFormat
// TODO: Apply red styling when value is negative (net balance below zero)
// TODO: Optionally show an up/down arrow icon based on trend

function SummaryCard({ title, value, subtitle }) {
  // TODO: Format value as currency
  const displayValue = value != null
    ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '—'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-gray-800">{displayValue}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      {/* TODO: Add trend indicator (e.g. +5% vs last month) */}
    </div>
  )
}

export default SummaryCard
