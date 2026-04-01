import api from '../api/axiosInstance'

/**
 * Register a new user.
 * TODO: POST /auth/register with { firstName, lastName, email, password }
 * TODO: Store returned JWT token in localStorage
 * TODO: Return { token, email, firstName, lastName }
 */
export const register = async (userData) => {
  // TODO: const response = await api.post('/auth/register', userData)
  // TODO: localStorage.setItem('token', response.data.token)
  // TODO: return response.data
  return null
}

/**
 * Log in with email and password.
 * TODO: POST /auth/login with { email, password }
 * TODO: Store returned JWT token in localStorage
 * TODO: Return { token, email, firstName, lastName }
 */
export const login = async (credentials) => {
  // TODO: const response = await api.post('/auth/login', credentials)
  // TODO: localStorage.setItem('token', response.data.token)
  // TODO: return response.data
  return null
}

/**
 * Log out the current user.
 * TODO: Remove token from localStorage (no server call needed for stateless JWT)
 */
export const logout = () => {
  // TODO: localStorage.removeItem('token')
}
