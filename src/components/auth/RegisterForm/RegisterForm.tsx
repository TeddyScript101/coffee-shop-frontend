import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@ds/components/Input/Input'
import { Button } from '@ds/components/Button/Button'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          placeholder="Alex"
          autoComplete="given-name"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Input
          label="Last name"
          placeholder="Chen"
          autoComplete="family-name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>
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
        autoComplete="new-password"
        hint="Minimum 8 characters"
        {...register('password')}
        error={errors.password?.message}
      />
      {error && (
        <p role="alert" className="text-sm text-red-600 text-center">{error}</p>
      )}
      <Button type="submit" block isLoading={isLoading}>
        Create account
      </Button>
    </form>
  )
}
