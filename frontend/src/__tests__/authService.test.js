import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { login, register, logout } from '../services/authService'
import api from '../api/axiosInstance'

vi.mock('../api/axiosInstance', () => ({
  default: { post: vi.fn() },
}))

const MOCK_RESPONSE = {
  data: {
    token: 'mock-jwt-token',
    email: 'jane@university.edu',
    firstName: 'Jane',
    lastName: 'Doe',
  },
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe('authService.login', () => {
  it('calls POST /auth/login with credentials', async () => {
    api.post.mockResolvedValue(MOCK_RESPONSE)
    await login({ email: 'jane@university.edu', password: 'password123' })
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'jane@university.edu',
      password: 'password123',
    })
  })

  it('stores the token in localStorage', async () => {
    api.post.mockResolvedValue(MOCK_RESPONSE)
    await login({ email: 'jane@university.edu', password: 'password123' })
    expect(localStorage.getItem('token')).toBe('mock-jwt-token')
  })

  it('stores user data in localStorage', async () => {
    api.post.mockResolvedValue(MOCK_RESPONSE)
    await login({ email: 'jane@university.edu', password: 'password123' })
    const user = JSON.parse(localStorage.getItem('user'))
    expect(user.firstName).toBe('Jane')
    expect(user.email).toBe('jane@university.edu')
  })

  it('returns the response data', async () => {
    api.post.mockResolvedValue(MOCK_RESPONSE)
    const result = await login({ email: 'jane@university.edu', password: 'password123' })
    expect(result.token).toBe('mock-jwt-token')
  })

  it('throws when API call fails', async () => {
    api.post.mockRejectedValue(new Error('Network error'))
    await expect(login({ email: 'x', password: 'y' })).rejects.toThrow('Network error')
  })
})

describe('authService.register', () => {
  it('calls POST /auth/register with user data', async () => {
    api.post.mockResolvedValue(MOCK_RESPONSE)
    await register({ firstName: 'Jane', lastName: 'Doe', email: 'jane@university.edu', password: 'password123' })
    expect(api.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
      firstName: 'Jane',
      email: 'jane@university.edu',
    }))
  })

  it('stores the token after registration', async () => {
    api.post.mockResolvedValue(MOCK_RESPONSE)
    await register({ firstName: 'Jane', lastName: 'Doe', email: 'jane@university.edu', password: 'password123' })
    expect(localStorage.getItem('token')).toBe('mock-jwt-token')
  })
})

describe('authService.logout', () => {
  it('removes token and user from localStorage', () => {
    localStorage.setItem('token', 'some-token')
    localStorage.setItem('user', JSON.stringify({ firstName: 'Jane' }))
    logout()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })
})
