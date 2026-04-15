import api from '../api/axiosInstance'

export const getSummary = async () => {
  const response = await api.get('/dashboard/summary')
  return response.data
}
