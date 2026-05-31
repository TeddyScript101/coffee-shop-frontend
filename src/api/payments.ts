import { apiClient } from './client'

export async function createPaymentIntent(amountInCents: number): Promise<{ clientSecret: string }> {
  const res = await apiClient.post<{ clientSecret: string }>('/api/payments/create-payment-intent', {
    amountInCents,
  })
  return res.data
}
