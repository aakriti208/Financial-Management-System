import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'
import * as authService from '../services/authService'
import { AuthProvider } from '../context/AuthContext'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../services/authService', () => ({
  login: vi.fn(),
}))

const renderLoginPage = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  )

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('LoginPage', () => {
  it('renders the email and password inputs', () => {
    renderLoginPage()
    expect(screen.getByPlaceholderText('you@university.edu')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('renders the sign in button', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders a link to the register page', () => {
    renderLoginPage()
    expect(screen.getByText('Create one free')).toBeInTheDocument()
  })

  it('navigates to dashboard on successful login', async () => {
    authService.login.mockResolvedValue({
      token: 'mock-token',
      email: 'jane@university.edu',
      firstName: 'Jane',
      lastName: 'Doe',
    })
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('you@university.edu'), {
      target: { value: 'jane@university.edu' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows an error message on failed login', async () => {
    authService.login.mockRejectedValue({
      response: { data: { message: 'Invalid email or password' } },
    })
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('you@university.edu'), {
      target: { value: 'wrong@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })

  it('does not navigate on failed login', async () => {
    authService.login.mockRejectedValue({ response: { data: {} } })
    renderLoginPage()

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
