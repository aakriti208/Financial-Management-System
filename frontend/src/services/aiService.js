import api from '../api/axiosInstance'

export const askQuestion = async (question) => {
  const response = await api.post('/ai/ask', { question })
  return response.data
}
