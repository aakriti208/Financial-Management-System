import api from '../api/axiosInstance'

/**
 * Fetch all income records for the authenticated user.
 * TODO: GET /income — returns array of IncomeDTO
 */
export const getAll = async () => {
  // TODO: const response = await api.get('/income')
  // TODO: return response.data
  return null
}

/**
 * Add a new income record.
 * TODO: POST /income with { amount, source, date, description }
 */
export const add = async (incomeData) => {
  // TODO: const response = await api.post('/income', incomeData)
  // TODO: return response.data
  return null
}

/**
 * Update an existing income record by ID.
 * TODO: PUT /income/:id with updated fields
 */
export const update = async (id, incomeData) => {
  // TODO: const response = await api.put(`/income/${id}`, incomeData)
  // TODO: return response.data
  return null
}

/**
 * Delete an income record by ID.
 * TODO: DELETE /income/:id
 */
export const remove = async (id) => {
  // TODO: await api.delete(`/income/${id}`)
  return null
}
