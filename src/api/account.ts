import { apiClient } from './client'
import type { UserProfileDto, UpdateProfileRequest, ChangePasswordRequest } from '@/types/api'

export async function getProfile(): Promise<UserProfileDto> {
  const res = await apiClient.get<UserProfileDto>('/api/account/profile')
  return res.data
}

export async function updateProfile(req: UpdateProfileRequest): Promise<UserProfileDto> {
  const res = await apiClient.put<UserProfileDto>('/api/account/profile', req)
  return res.data
}

export async function changePassword(req: ChangePasswordRequest): Promise<{ message: string }> {
  const res = await apiClient.put<{ message: string }>('/api/account/change-password', req)
  return res.data
}
