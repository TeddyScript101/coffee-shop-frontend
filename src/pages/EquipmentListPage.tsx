import { useState } from 'react'
import { PageLayout } from '@components/layout/PageLayout'
import { EquipmentCard } from '@components/products/EquipmentCard/EquipmentCard'
import { ProductGrid } from '@components/products/ProductGrid/ProductGrid'
import { ProductCardSkeleton } from '@components/feedback/LoadingSkeleton/LoadingSkeleton'
import { EmptyState } from '@components/feedback/EmptyState/EmptyState'
import { ErrorState } from '@components/feedback/ErrorState/ErrorState'
import { Input } from '@ds/components/Input/Input'
import { useEquipments } from '@hooks/useEquipments'
import type { EquipmentType } from '@/types/api'
import { cn } from '@/utils/cn'

type EquipmentFilter = EquipmentType | 'All'

const filterOptions: EquipmentFilter[] = ['All', 'Grinder', 'Machine', 'Kettle', 'Filter', 'Brewer', 'Scale', 'Accessory']

export function EquipmentListPage() {
  const { data: equipments, isLoading, isError, refetch } = useEquipments()
  const [typeFilter, setTypeFilter] = useState<EquipmentFilter>('All')
  const [search, setSearch] = useState('')

  const filtered = (equipments ?? []).filter((e) => {
    const matchesType = typeFilter === 'All' || e.equipmentType === typeFilter
    const matchesSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.brand.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-[var(--font-serif)] text-[var(--text-display-lg)] text-[var(--color-text)] mb-2">
            Equipment
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Professional-grade tools for the discerning home barista.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="w-full sm:w-64">
            <Input
              variant="search"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setTypeFilter(option)}
                className={cn(
                  'text-sm px-3 py-1.5 rounded-full border transition-all duration-[250ms]',
                  typeFilter === option
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)]',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {isError && <ErrorState onRetry={() => refetch()} />}

        {isLoading && (
          <ProductGrid>
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </ProductGrid>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            heading="No equipment found"
            description="Try adjusting your search or category filter."
            action={{ label: 'Clear filters', onClick: () => { setTypeFilter('All'); setSearch('') } }}
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <p className="text-sm text-[var(--color-text-subtle)] mb-4">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>
            <ProductGrid>
              {filtered.map((eq) => (
                <EquipmentCard key={eq.id} equipment={eq} />
              ))}
            </ProductGrid>
          </>
        )}
      </div>
    </PageLayout>
  )
}
