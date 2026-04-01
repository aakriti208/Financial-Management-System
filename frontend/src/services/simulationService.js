import api from '../api/axiosInstance'

/**
 * Run a what-if financial simulation.
 * TODO: POST /simulation/run with { hypotheticalMonthlyIncome, hypotheticalMonthlyExpenses, projectionMonths }
 * TODO: Returns SimulationResultDTO: { projectedFinalBalance, projectedTotalSavings, monthlyBalances }
 */
export const runSimulation = async (simulationData) => {
  // TODO: const response = await api.post('/simulation/run', simulationData)
  // TODO: return response.data
  return null
}
