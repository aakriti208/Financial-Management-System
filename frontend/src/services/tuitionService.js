import api from '../api/axiosInstance'

export const calculate = async (tuitionData) => {
  const response = await api.post('/tuition/calculate', tuitionData)
  return response.data
}
