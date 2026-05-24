import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '@/api/client'

const RETURN_KEY = 'healthcheck_return'
const POLL_INTERVAL_MS = 3000

const STATUS_MESSAGES = [
  'Waking up the server…',
  'Brewing the first pot…',
  'Loading the menu…',
  'Almost ready…',
]

export function WarmingUpPage() {
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const tryRedirect = useCallback(async () => {
    setIsRetrying(true)
    try {
      await apiClient.get('/health', { timeout: 5000 })
      const returnTo = sessionStorage.getItem(RETURN_KEY) ?? '/'
      sessionStorage.removeItem(RETURN_KEY)
      navigate(returnTo, { replace: true })
    } catch {
      setIsRetrying(false)
    }
  }, [navigate])

  // Poll every 3 seconds
  useEffect(() => {
    // Try immediately on mount
    tryRedirect()
    const interval = setInterval(tryRedirect, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [tryRedirect])

  // Elapsed seconds counter
  useEffect(() => {
    const timer = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Cycle status messages every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex(i => (i + 1) % STATUS_MESSAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-8 px-4">

      {/* Animated coffee cup */}
      <div className="relative flex flex-col items-center">
        {/* Steam lines */}
        <div className="flex gap-3 mb-2 h-10">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full bg-stone-400/60"
              animate={{ height: ['8px', '28px', '8px'], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.6, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Cup */}
        <motion.div
          className="text-7xl select-none"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☕
        </motion.div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-stone-100 tracking-wide">
          Server is waking up
        </h1>
        <p className="text-stone-400 text-sm max-w-xs">
          Render's free tier sleeps after 15 minutes of inactivity.
          This usually takes under 30 seconds.
        </p>
      </div>

      {/* Status message (animated swap) */}
      <div className="h-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="text-amber-500/80 text-sm font-medium"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            {STATUS_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-amber-600"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, delay: i * 0.4, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Retry status */}
      <div className="flex items-center gap-2 text-stone-500 text-xs">
        <motion.div
          className="w-3 h-3 rounded-full border border-stone-500 border-t-amber-500"
          animate={isRetrying ? { rotate: 360 } : {}}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <span>
          Checking every 3s · {elapsed}s elapsed
        </span>
      </div>

    </div>
  )
}
