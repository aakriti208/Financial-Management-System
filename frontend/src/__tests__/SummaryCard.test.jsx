import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SummaryCard from '../components/SummaryCard'

describe('SummaryCard', () => {
  it('shows a dash when value is null', () => {
    render(<SummaryCard title="Total Income" value={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('formats positive value as currency', () => {
    render(<SummaryCard title="Total Income" value={1234.5} />)
    expect(screen.getByText('$1,234.50')).toBeInTheDocument()
  })

  it('renders the title', () => {
    render(<SummaryCard title="Net Balance" value={500} />)
    expect(screen.getByText('Net Balance')).toBeInTheDocument()
  })

  it('renders the subtitle when provided', () => {
    render(<SummaryCard title="Total Expenses" value={200} subtitle="All time" />)
    expect(screen.getByText('All time')).toBeInTheDocument()
  })

  it('applies emerald color for income variant', () => {
    render(<SummaryCard title="Income" value={500} variant="income" />)
    const value = screen.getByText('$500.00')
    expect(value).toHaveClass('text-emerald-600')
  })

  it('applies rose color for expense variant', () => {
    render(<SummaryCard title="Expenses" value={300} variant="expense" />)
    const value = screen.getByText('$300.00')
    expect(value).toHaveClass('text-rose-500')
  })

  it('applies rose color on balance variant when value is negative', () => {
    render(<SummaryCard title="Balance" value={-100} variant="balance" />)
    const value = screen.getByText('$-100.00')
    expect(value).toHaveClass('text-rose-500')
  })

  it('applies emerald color on balance variant when value is positive', () => {
    render(<SummaryCard title="Balance" value={200} variant="balance" />)
    const value = screen.getByText('$200.00')
    expect(value).toHaveClass('text-emerald-600')
  })
})
