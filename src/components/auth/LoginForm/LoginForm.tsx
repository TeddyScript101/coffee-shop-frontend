import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@ds/components/Input/Input'
import { Button } from '@ds/components/Button/Button'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        {...register('password')}
        error={errors.password?.message}
      />
      {error && (
        <p role="alert" className="text-sm text-red-600 text-center">{error}</p>
      )}
      <Button type="submit" block isLoading={isLoading}>
        Sign in
      </Button>
    </form>
  )
}
