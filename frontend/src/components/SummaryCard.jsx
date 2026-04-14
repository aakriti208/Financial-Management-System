function SummaryCard({ title, value, subtitle, variant = 'default' }) {
  const displayValue = value != null
    ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '—'

  const isNegative = value != null && Number(value) < 0

  const variantStyles = {
    default: 'border-slate-100',
    income: 'border-l-4 border-l-emerald-500 border-slate-100',
    expense: 'border-l-4 border-l-rose-500 border-slate-100',
    balance: isNegative
      ? 'border-l-4 border-l-rose-500 border-slate-100'
      : 'border-l-4 border-l-emerald-500 border-slate-100',
  }

  const valueStyles = {
    default: 'text-slate-800',
    income: 'text-emerald-600',
    expense: 'text-rose-500',
    balance: isNegative ? 'text-rose-500' : 'text-emerald-600',
  }

  return (
    <div className={`card p-5 ${variantStyles[variant]}`}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      <p className={`text-2xl font-bold mt-1.5 ${valueStyles[variant]}`}>{displayValue}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  )
}

export default SummaryCard
