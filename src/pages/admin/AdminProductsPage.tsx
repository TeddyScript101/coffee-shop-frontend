import { useState } from 'react'
import { PageLayout } from '@components/layout/PageLayout'
import { Button } from '@ds/components/Button/Button'
import { Badge } from '@ds/components/Badge/Badge'
import { RoastBadge } from '@components/products/RoastBadge/RoastBadge'
import { ProductCardSkeleton } from '@components/feedback/LoadingSkeleton/LoadingSkeleton'
import { ErrorState } from '@components/feedback/ErrorState/ErrorState'
import { useCoffeeBeans } from '@hooks/useCoffeeBeans'
import { useEquipments } from '@hooks/useEquipments'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CoffeeBeanDto, EquipmentDto } from '@/types/api'
import { cn } from '@/utils/cn'
import { toWebp } from '@/utils/toWebp'

type Tab = 'coffee' | 'equipment'

export function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('coffee')
  const { data: beans, isLoading: beansLoading, isError: beansError, refetch: refetchBeans } = useCoffeeBeans()
  const { data: equipments, isLoading: equipLoading, isError: equipError, refetch: refetchEquip } = useEquipments()

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[var(--font-serif)] text-[var(--text-display-lg)] text-[var(--color-text)]">
            Products
          </h1>
          <Button size="sm">+ Add product</Button>
        </div>

        <div className="flex gap-1 mb-8 bg-[var(--color-surface-elevated)] p-1 rounded-xl w-fit">
          {(['coffee', 'equipment'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-[250ms]',
                activeTab === tab
                  ? 'bg-white shadow-[var(--shadow-soft-sm)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
              )}
            >
              {tab === 'coffee' ? 'Coffee Beans' : 'Equipment'}
            </button>
          ))}
        </div>

        {activeTab === 'coffee' && (
          <>
            {beansLoading && <div className="grid grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>}
            {beansError && <ErrorState onRetry={() => refetchBeans()} />}
            {!beansLoading && !beansError && beans && (
              <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <th className="text-left text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-6 py-4">Product</th>
                      <th className="text-left text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-4 py-4">Roast</th>
                      <th className="text-left text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-4 py-4">Origin</th>
                      <th className="text-right text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-4 py-4">Price</th>
                      <th className="text-right text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-4 py-4">Stock</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {beans.map((bean: CoffeeBeanDto) => (
                      <tr key={bean.id} className="border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {bean.imageUrl && (
                              <img src={bean.imageUrl} alt={bean.name} className="w-10 h-10 rounded-lg object-cover bg-[var(--color-surface-elevated)]" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-[var(--color-text)]">{bean.name}</p>
                              <p className="text-xs text-[var(--color-text-subtle)]">{bean.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4"><RoastBadge roastLevel={bean.roastLevel} /></td>
                        <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{bean.originCountry}</td>
                        <td className="px-4 py-4 text-right text-sm font-medium text-[var(--color-text)]">{formatCurrency(bean.price)}</td>
                        <td className="px-4 py-4 text-right">
                          <span className={cn('text-sm', bean.stockQuantity < 10 ? 'text-orange-600' : 'text-[var(--color-text-muted)]')}>
                            {bean.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="danger" size="sm">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'equipment' && (
          <>
            {equipLoading && <div className="grid grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>}
            {equipError && <ErrorState onRetry={() => refetchEquip()} />}
            {!equipLoading && !equipError && equipments && (
              <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <th className="text-left text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-6 py-4">Product</th>
                      <th className="text-left text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-4 py-4">Type</th>
                      <th className="text-left text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-4 py-4">Brand</th>
                      <th className="text-right text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-4 py-4">Price</th>
                      <th className="text-right text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide px-4 py-4">Stock</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {equipments.map((eq: EquipmentDto) => (
                      <tr key={eq.id} className="border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {eq.imageUrl && (
                              <picture>
                                <source srcSet={toWebp(eq.imageUrl)} type="image/webp" />
                                <img src={eq.imageUrl} alt={eq.name} loading="lazy" className="w-10 h-10 rounded-lg object-cover bg-[var(--color-surface-elevated)]" />
                              </picture>
                            )}
                            <div>
                              <p className="text-sm font-medium text-[var(--color-text)]">{eq.name}</p>
                              <p className="text-xs text-[var(--color-text-subtle)]">{eq.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4"><Badge variant="equipment-type">{eq.equipmentType}</Badge></td>
                        <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{eq.brand}</td>
                        <td className="px-4 py-4 text-right text-sm font-medium text-[var(--color-text)]">{formatCurrency(eq.price)}</td>
                        <td className="px-4 py-4 text-right">
                          <span className={cn('text-sm', eq.stockQuantity < 10 ? 'text-orange-600' : 'text-[var(--color-text-muted)]')}>
                            {eq.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="danger" size="sm">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
