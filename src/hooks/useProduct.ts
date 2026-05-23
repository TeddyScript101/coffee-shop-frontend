import { useQuery } from '@tanstack/react-query'
import { getProduct } from '@api/products'

export const productKeys = {
  detail: (id: string) => ['product', id] as const,
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id),
  })
}
