import api from '../api/axiosInstance'

export const getExpensePrediction = async () => {
  const response = await api.get('/prediction/expenses')
  return response.data
}
