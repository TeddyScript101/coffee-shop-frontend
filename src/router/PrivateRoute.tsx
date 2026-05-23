import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

interface PrivateRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function PrivateRoute({ children, requireAdmin = false }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (requireAdmin && !user?.roles.includes('Admin')) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
