import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Restore user from localStorage on page refresh
  const [user, setUser] = useState(() => {
    // TODO: Decode JWT from localStorage to restore user info without an extra API call
    //       e.g. const token = localStorage.getItem('token')
    //            if (token) return parseUserFromToken(token)
    return null
  })

  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  /**
   * Called after a successful login or register.
   * Stores the JWT and user data in state and localStorage.
   */
  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('token', jwtToken)
  }

  /**
   * Clears authentication state.
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    // TODO: Redirect to /login (use navigate from react-router-dom or handle in Navbar)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access auth context. Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
