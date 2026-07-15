import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { checkHealth } from '@api/healthCheck'

const API_BASE_URL = (import.meta.env['VITE_API_BASE_URL'] as string) ?? 'http://localhost:5046'
const RETURN_KEY = 'healthcheck_return'
const WARMING_UP_PATH = '/warming-up'

interface Props {
  /** Path on the backend, e.g. "/swagger" or "/scalar" */
  backendPath: string
}

/**
 * Frontend proxy route for backend-hosted pages (Swagger, Scalar, etc.).
 *
 * Flow:
 *   /health passes  →  window.location.href = backendUrl + backendPath
 *   /health fails   →  save backendPath in sessionStorage, go to /warming-up
 *                      (WarmingUpPage polls and redirects to backend URL when ready)
 */
export function BackendRedirectPage({ backendPath }: Props) {
  const navigate = useNavigate()
  const cancelled = useRef(false)

  useEffect(() => {
    cancelled.current = false

    const tryOnce = async () => {
      try {
        await checkHealth()
        if (!cancelled.current) {
          window.location.href = `${API_BASE_URL}${backendPath}`
        }
      } catch {
        if (!cancelled.current) {
          // Backend is unreachable — hand off to WarmingUpPage for polling + retry UX
          sessionStorage.setItem(RETURN_KEY, backendPath)
          navigate(WARMING_UP_PATH, { replace: true })
        }
      }
    }

    tryOnce()

    return () => {
      cancelled.current = true
    }
  }, [backendPath, navigate])

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6">
      <motion.div
        className="text-6xl select-none"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☕
      </motion.div>

      <div className="text-center space-y-1">
        <p className="text-stone-300 text-sm font-medium">
          Connecting to {backendPath.replace('/', '').toUpperCase()}…
        </p>
        <p className="text-stone-500 text-xs">
          Checking server status
        </p>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-600"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, delay: i * 0.4, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}
