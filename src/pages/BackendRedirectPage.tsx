import { useEffect } from 'react'
import { motion } from 'framer-motion'

const API_BASE_URL = (import.meta.env['VITE_API_BASE_URL'] as string) ?? 'http://localhost:5046'

interface Props {
  backendPath: string
}

export function BackendRedirectPage({ backendPath }: Props) {
  useEffect(() => {
    window.location.href = `${API_BASE_URL}${backendPath}`
  }, [backendPath])

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6">
      <motion.div
        className="text-6xl select-none"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☕
      </motion.div>
      <p className="text-stone-300 text-sm font-medium">
        Redirecting to {backendPath.replace('/', '').toUpperCase()}…
      </p>
    </div>
  )
}
