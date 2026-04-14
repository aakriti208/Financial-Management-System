import api from '../api/axiosInstance'

export const getAll = async () => {
  const response = await api.get('/income')
  return response.data
}

export const add = async (incomeData) => {
  const response = await api.post('/income', incomeData)
  return response.data
}

export const update = async (id, incomeData) => {
  const response = await api.put(`/income/${id}`, incomeData)
  return response.data
}

export const remove = async (id) => {
  await api.delete(`/income/${id}`)
}
