import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton-shimmer rounded-xl', className)} />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] bg-white">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 mt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between mt-2 pt-3 border-t border-[var(--color-border-subtle)]">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <Skeleton className="aspect-square rounded-3xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-20 w-full mt-4" />
        <Skeleton className="h-12 w-full mt-4 rounded-xl" />
      </div>
    </div>
  )
}

export function MembershipCardSkeleton() {
  return (
    <div className="rounded-4xl overflow-hidden p-8 shadow-[var(--shadow-soft-lg)] bg-[var(--color-surface-elevated)]" style={{ borderRadius: 'var(--radius-4xl)' }}>
      <div className="flex justify-between mb-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="mb-6">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-14 w-32" />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  )
}
