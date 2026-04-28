import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSummary } from './dashboardService'
import api from '../api/axiosInstance'

vi.mock('../api/axiosInstance', () => ({
  default: { get: vi.fn() },
}))

const MOCK_SUMMARY_RESPONSE = {
  data: {
    totalIncome: 5000.00,
    totalExpenses: 3200.50,
    balance: 1799.50,
    incomeCount: 3,
    expenseCount: 12,
  },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('dashboardService.getSummary', () => {
  it('calls GET /dashboard/summary', async () => {
    api.get.mockResolvedValue(MOCK_SUMMARY_RESPONSE)
    await getSummary()
    expect(api.get).toHaveBeenCalledWith('/dashboard/summary')
  })

  it('returns the summary data', async () => {
    api.get.mockResolvedValue(MOCK_SUMMARY_RESPONSE)
    const result = await getSummary()
    expect(result).toEqual(MOCK_SUMMARY_RESPONSE.data)
    expect(result.totalIncome).toBe(5000.00)
    expect(result.totalExpenses).toBe(3200.50)
    expect(result.balance).toBe(1799.50)
  })

  it('returns empty or zero values when no data exists', async () => {
    const emptyResponse = {
      data: {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        incomeCount: 0,
        expenseCount: 0,
      },
    }
    api.get.mockResolvedValue(emptyResponse)
    const result = await getSummary()
    expect(result.totalIncome).toBe(0)
    expect(result.totalExpenses).toBe(0)
  })

  it('throws when API call fails', async () => {
    api.get.mockRejectedValue(new Error('Network error'))
    await expect(getSummary()).rejects.toThrow('Network error')
  })

  it('throws when server returns 401 unauthorized', async () => {
    const authError = new Error('Unauthorized')
    authError.response = { status: 401 }
    api.get.mockRejectedValue(authError)
    await expect(getSummary()).rejects.toThrow('Unauthorized')
  })

  it('handles large numeric values correctly', async () => {
    const largeValuesResponse = {
      data: {
        totalIncome: 999999.99,
        totalExpenses: 500000.00,
        balance: 499999.99,
        incomeCount: 100,
        expenseCount: 250,
      },
    }
    api.get.mockResolvedValue(largeValuesResponse)
    const result = await getSummary()
    expect(result.totalIncome).toBe(999999.99)
    expect(result.balance).toBe(499999.99)
  })
})
