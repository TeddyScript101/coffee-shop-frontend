import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LoginForm } from '@components/auth/LoginForm/LoginForm'
import { useAuthStore } from '@store/authStore'
import { login } from '@api/auth'
import axios from 'axios'

export function LoginPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login: storeLogin } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('')
    setIsLoading(true)
    try {
      const { token } = await login(values)
      storeLogin(token)
      navigate(redirect, { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Invalid email or password.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-[var(--font-serif)] text-2xl text-[var(--color-text)]">
            BeanWorks
          </Link>
          <h1 className="font-[var(--font-serif)] text-[var(--text-display)] text-[var(--color-text)] mt-6 mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-soft-md)]">
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary)] hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
