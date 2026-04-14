import api from '../api/axiosInstance'

export const getAll = async () => {
  const response = await api.get('/expense')
  return response.data
}

export const add = async (expenseData) => {
  const response = await api.post('/expense', expenseData)
  return response.data
}

export const update = async (id, expenseData) => {
  const response = await api.put(`/expense/${id}`, expenseData)
  return response.data
}

export const remove = async (id) => {
  await api.delete(`/expense/${id}`)
}
