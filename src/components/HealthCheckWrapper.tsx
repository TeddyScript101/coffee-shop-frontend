import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiClient } from '@/api/client'

const WARMING_UP_PATH = '/warming-up'
const RETURN_KEY = 'healthcheck_return'

export function HealthCheckWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const hasChecked = useRef(false)

  useEffect(() => {
    // Don't re-check if already on the warming-up page
    if (hasChecked.current || location.pathname === WARMING_UP_PATH) return
    hasChecked.current = true

    const check = async () => {
      try {
        await apiClient.get('/health', { timeout: 5000 })
      } catch {
        // Backend is sleeping — save where user was going and redirect
        sessionStorage.setItem(RETURN_KEY, location.pathname + location.search)
        navigate(WARMING_UP_PATH, { replace: true })
      }
    }

    check()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
