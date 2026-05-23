import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm } from '@components/auth/RegisterForm/RegisterForm'
import { useAuthStore } from '@store/authStore'
import { register, login } from '@api/auth'
import axios from 'axios'

export function RegisterPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login: storeLogin } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (values: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => {
    setError('')
    setIsLoading(true)
    try {
      await register(values)
      const { token } = await login({ email: values.email, password: values.password })
      storeLogin(token)
      navigate('/', { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const data = err.response.data as { errors?: Record<string, string[]> }
        const firstMsg = data.errors ? Object.values(data.errors)[0]?.[0] : null
        setError(firstMsg ?? 'Registration failed. Please check your details.')
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
            Cheeky Ember
          </Link>
          <h1 className="font-[var(--font-serif)] text-[var(--text-display)] text-[var(--color-text)] mt-6 mb-2">
            Create account
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">Join the Cheeky Ember community</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-soft-md)]">
          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
