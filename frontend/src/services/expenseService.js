import api from '../api/axiosInstance'

/**
 * Fetch all expense records for the authenticated user.
 * TODO: GET /expense — returns array of ExpenseDTO
 */
export const getAll = async () => {
  // TODO: const response = await api.get('/expense')
  // TODO: return response.data
  return null
}

/**
 * Add a new expense record.
 * TODO: POST /expense with { amount, category, date, description }
 */
export const add = async (expenseData) => {
  // TODO: const response = await api.post('/expense', expenseData)
  // TODO: return response.data
  return null
}

/**
 * Update an existing expense record by ID.
 * TODO: PUT /expense/:id with updated fields
 */
export const update = async (id, expenseData) => {
  // TODO: const response = await api.put(`/expense/${id}`, expenseData)
  // TODO: return response.data
  return null
}

/**
 * Delete an expense record by ID.
 * TODO: DELETE /expense/:id
 */
export const remove = async (id) => {
  // TODO: await api.delete(`/expense/${id}`)
  return null
}
