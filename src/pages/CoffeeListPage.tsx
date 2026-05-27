import { useState } from 'react'
import { PageLayout } from '@components/layout/PageLayout'
import { CoffeeBeanCard } from '@components/products/CoffeeBeanCard/CoffeeBeanCard'
import { ProductGrid } from '@components/products/ProductGrid/ProductGrid'
import { ProductCardSkeleton } from '@components/feedback/LoadingSkeleton/LoadingSkeleton'
import { EmptyState } from '@components/feedback/EmptyState/EmptyState'
import { ErrorState } from '@components/feedback/ErrorState/ErrorState'
import { Input } from '@ds/components/Input/Input'
import { useCoffeeBeans } from '@hooks/useCoffeeBeans'
import type { RoastLevel } from '@/types/api'
import { cn } from '@/utils/cn'

type RoastFilter = RoastLevel | 'All'

const roastOptions: RoastFilter[] = ['All', 'Light', 'Medium', 'Dark']

export function CoffeeListPage() {
  const { data: beans, isLoading, isError, refetch } = useCoffeeBeans()
  const [roastFilter, setRoastFilter] = useState<RoastFilter>('All')
  const [search, setSearch] = useState('')

  const filtered = (beans ?? []).filter((b) => {
    const matchesRoast = roastFilter === 'All' || b.roastLevel === roastFilter
    const matchesSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.originCountry.toLowerCase().includes(search.toLowerCase()) ||
      b.originRegion.toLowerCase().includes(search.toLowerCase())
    return matchesRoast && matchesSearch
  })

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="font-[var(--font-serif)] text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-2">
            Coffee Beans
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl">
            Premium single-origins and signature blends, roasted to order.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="w-full sm:w-64">
            <Input
              variant="search"
              placeholder="Search by name or origin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {roastOptions.map((option) => (
              <button
                key={option}
                onClick={() => setRoastFilter(option)}
                className={cn(
                  'text-sm px-3 py-1.5 rounded-full border transition-all duration-[250ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
                  roastFilter === option
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)]',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {isError && (
          <ErrorState onRetry={() => refetch()} />
        )}

        {isLoading && (
          <ProductGrid>
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </ProductGrid>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            heading="No coffees found"
            description="Try adjusting your search or roast filter."
            action={{ label: 'Clear filters', onClick: () => { setRoastFilter('All'); setSearch('') } }}
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <p className="text-sm text-[var(--color-text-subtle)] mb-4">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>
            <ProductGrid>
              {filtered.map((bean) => (
                <CoffeeBeanCard key={bean.id} bean={bean} />
              ))}
            </ProductGrid>
          </>
        )}
      </div>
    </PageLayout>
  )
}
