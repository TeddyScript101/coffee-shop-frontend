export type ProductType = 'Unknown' | 'CoffeeBean' | 'Equipment'
export type RoastLevel = 'Light' | 'Medium' | 'Dark'
export type EquipmentType = 'Grinder' | 'Filter' | 'Machine' | 'Kettle' | 'Brewer' | 'Scale' | 'Accessory'
export type MembershipTier = 'Bronze' | 'Silver' | 'Gold'

export interface ProductDto {
  id: string
  name: string
  sku: string
  price: number
  stockQuantity: number
  imageUrl: string | null
  productType: ProductType
  createdAt: string
}

export interface CoffeeBeanDto extends ProductDto {
  roastLevel: RoastLevel
  tastingNotes: string
  originCountry: string
  originRegion: string
}

export interface EquipmentDto extends ProductDto {
  brand: string
  equipmentType: EquipmentType
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  token: string
}

export interface RegisterResponse {
  message: string
}

export interface MembershipDto {
  id: string
  points: number
  tier: MembershipTier
  joinedAt: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
