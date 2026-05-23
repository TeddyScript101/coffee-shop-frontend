import { apiClient } from './client'
import type { LoginRequest, RegisterRequest, AuthResponse, RegisterResponse } from '@/types/api'

export async function login(req: LoginRequest): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/api/auth/login', req)
  return res.data
}

export async function register(req: RegisterRequest): Promise<RegisterResponse> {
  const res = await apiClient.post<RegisterResponse>('/api/auth/register', req)
  return res.data
}
