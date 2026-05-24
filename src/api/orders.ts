import { apiClient } from './client'
import type { CreateOrderRequest, OrderDto } from '@/types/api'

export async function createOrder(req: CreateOrderRequest): Promise<OrderDto> {
  const res = await apiClient.post<OrderDto>('/api/orders', req)
  return res.data
}

export async function getMyOrders(): Promise<OrderDto[]> {
  const res = await apiClient.get<OrderDto[]>('/api/orders')
  return res.data
}

export async function getOrder(id: string): Promise<OrderDto> {
  const res = await apiClient.get<OrderDto>(`/api/orders/${id}`)
  return res.data
}
