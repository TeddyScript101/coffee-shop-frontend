
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
import { PageLayout } from '@components/layout/PageLayout'
import { VideoHeroSection } from '@components/hero/VideoHeroSection'
import { PhilosophyBand } from '@components/home/PhilosophyBand'
import { CoffeeBeanCard } from '@components/products/CoffeeBeanCard/CoffeeBeanCard'
import { EquipmentCard } from '@components/products/EquipmentCard/EquipmentCard'
import { ProductCardSkeleton } from '@components/feedback/LoadingSkeleton/LoadingSkeleton'
import { Button } from '@ds/components/Button/Button'
import { useCoffeeBeans } from '@hooks/useCoffeeBeans'
import { useEquipments } from '@hooks/useEquipments'
import { ErrorState } from '@components/feedback/ErrorState/ErrorState'

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 52, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: EASE },
  },
}

function SectionHeader({
  title,
  linkTo,
  linkLabel,
}: {
  title: string
  linkTo: string
  linkLabel: string
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <motion.h2
        initial={{ opacity: 0, x: -28 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
        className="font-[var(--font-serif)] text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text)]"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
      >
        <Link to={linkTo}>
          <Button variant="ghost" size="sm">{linkLabel}</Button>
        </Link>
      </motion.div>
    </div>
  )
}



export function HomePage() {
  const { data: beans, isLoading: beansLoading, isError: beansError, refetch: refetchBeans } = useCoffeeBeans()
  const { data: equipments, isLoading: equipLoading, isError: equipError, refetch: refetchEquip } = useEquipments()

  const featuredBeans = beans?.slice(0, 3) ?? []
  const featuredEquip = equipments?.slice(0, 3) ?? []

  return (
    <PageLayout>
      <VideoHeroSection
        videoSrc="/hero.mp4"
        mobileVideoSrc="/video_vertical_compressed.mp4"
        title="Coffee Roasted at Peak."
        subtitle="Single-origin beans and signature blends from the world's finest growing regions. Every cup tells a story of place and craft."
        ctaPrimary={{ label: 'Shop Coffee', to: '/coffee' }}
        ctaSecondary={{ label: 'Shop Equipment', to: '/equipment' }}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader title="Our Coffees" linkTo="/coffee" linkLabel="View all" />
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {beansLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <ProductCardSkeleton />
                </motion.div>
              ))
            : beansError
            ? <div className="col-span-full"><ErrorState onRetry={refetchBeans} /></div>
            : featuredBeans.map((bean) => (
                <motion.div key={bean.id} variants={cardVariants}>
                  <CoffeeBeanCard bean={bean} />
                </motion.div>
              ))}
        </motion.div>
      </section>

      <PhilosophyBand />

      <section className="bg-[var(--color-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeader title="Equipment" linkTo="/equipment" linkLabel="View all" />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {equipLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <motion.div key={i} variants={cardVariants}>
                    <ProductCardSkeleton />
                  </motion.div>
                ))
              : equipError
              ? <div className="col-span-full"><ErrorState onRetry={refetchEquip} /></div>
              : featuredEquip.map((eq) => (
                  <motion.div key={eq.id} variants={cardVariants}>
                    <EquipmentCard equipment={eq} />
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}
