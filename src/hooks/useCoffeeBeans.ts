import { useQuery } from '@tanstack/react-query'
import { getCoffeeBeans } from '@api/products'

export const coffeeBeanKeys = {
  all: ['coffeeBeans'] as const,
}

export function useCoffeeBeans() {
  return useQuery({
    queryKey: coffeeBeanKeys.all,
    queryFn: getCoffeeBeans,
    staleTime: 5 * 60 * 1000,
  })
}
