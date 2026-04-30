// Renders child routes only when the user is authenticated.
// Redirects to /login otherwise.

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AIChatWidget from './AIChatWidget'

function ProtectedRoute() {
  const { user } = useAuth()

  if (!user) {
    // TODO: Optionally preserve the attempted URL via state={{ from: location }}
    //       so login can redirect back after authentication
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Outlet />
      <AIChatWidget />
    </>
  )
}

export default ProtectedRoute
