import api from '../api/axiosInstance'

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  localStorage.setItem('token', response.data.token)
  localStorage.setItem('user', JSON.stringify({
    email: response.data.email,
    firstName: response.data.firstName,
    lastName: response.data.lastName,
  }))
  return response.data
}

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  localStorage.setItem('token', response.data.token)
  localStorage.setItem('user', JSON.stringify({
    email: response.data.email,
    firstName: response.data.firstName,
    lastName: response.data.lastName,
  }))
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
