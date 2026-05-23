import { useQuery } from '@tanstack/react-query'
import { getEquipments } from '@api/products'

export const equipmentKeys = {
  all: ['equipments'] as const,
}

export function useEquipments() {
  return useQuery({
    queryKey: equipmentKeys.all,
    queryFn: getEquipments,
    staleTime: 5 * 60 * 1000,
  })
}
