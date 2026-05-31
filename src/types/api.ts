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

// ---- Account ----

export interface UserProfileDto {
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  billingFirstName: string | null
  billingLastName: string | null
  billingAddress: string | null
  billingCity: string | null
  billingState: string | null
  billingPostalCode: string | null
  billingCountry: string | null
  // Membership / loyalty info
  points: number
  tier: MembershipTier
  memberSince: string | null
}

export interface UpdateProfileRequest {
  phone?: string
  billingFirstName?: string
  billingLastName?: string
  billingAddress?: string
  billingCity?: string
  billingState?: string
  billingPostalCode?: string
  billingCountry?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// ---- Orders ----

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded'

export interface OrderItemDto {
  id: string
  productId: string
  productName: string
  productSku: string
  productImageUrl: string | null
  productType: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface ShippingAddressDto {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderDto {
  id: string
  items: OrderItemDto[]
  shippingAddress: ShippingAddressDto
  cardLastFour: string
  paymentStatus: PaymentStatus
  status: OrderStatus
  subtotal: number
  shippingCost: number
  total: number
  createdAt: string
}

export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[]
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  payment: {
    paymentIntentId: string
  }
}
