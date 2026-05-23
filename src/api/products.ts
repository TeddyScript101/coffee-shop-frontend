import { apiClient } from './client'
import type { CoffeeBeanDto, EquipmentDto, ProductDto } from '@/types/api'

export async function getCoffeeBeans(): Promise<CoffeeBeanDto[]> {
  const res = await apiClient.get<CoffeeBeanDto[]>('/api/products/coffeebeans')
  return res.data
}

export async function getEquipments(): Promise<EquipmentDto[]> {
  const res = await apiClient.get<EquipmentDto[]>('/api/products/equipments')
  return res.data
}

export async function getProduct(id: string): Promise<CoffeeBeanDto | EquipmentDto> {
  const res = await apiClient.get<CoffeeBeanDto | EquipmentDto>(`/api/products/${id}`)
  return res.data
}

export async function getAllProducts(): Promise<ProductDto[]> {
  const res = await apiClient.get<ProductDto[]>('/api/products')
  return res.data
}

export async function createCoffeeBean(data: Omit<CoffeeBeanDto, 'id' | 'createdAt' | 'productType'>): Promise<CoffeeBeanDto> {
  const res = await apiClient.post<CoffeeBeanDto>('/api/products/coffeebeans', data)
  return res.data
}

export async function updateCoffeeBean(id: string, data: Partial<Omit<CoffeeBeanDto, 'id' | 'createdAt' | 'productType'>>): Promise<CoffeeBeanDto> {
  const res = await apiClient.put<CoffeeBeanDto>(`/api/products/coffeebeans/${id}`, data)
  return res.data
}

export async function createEquipment(data: Omit<EquipmentDto, 'id' | 'createdAt' | 'productType'>): Promise<EquipmentDto> {
  const res = await apiClient.post<EquipmentDto>('/api/products/equipments', data)
  return res.data
}

export async function updateEquipment(id: string, data: Partial<Omit<EquipmentDto, 'id' | 'createdAt' | 'productType'>>): Promise<EquipmentDto> {
  const res = await apiClient.put<EquipmentDto>(`/api/products/equipments/${id}`, data)
  return res.data
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/api/products/${id}`)
}
