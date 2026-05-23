import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
import { PageLayout } from '@components/layout/PageLayout'
import { VideoHeroSection } from '@components/hero/VideoHeroSection'
import { CoffeeBeanCard } from '@components/products/CoffeeBeanCard/CoffeeBeanCard'
import { EquipmentCard } from '@components/products/EquipmentCard/EquipmentCard'
import { ProductCardSkeleton } from '@components/feedback/LoadingSkeleton/LoadingSkeleton'
import { Button } from '@ds/components/Button/Button'
import { useCoffeeBeans } from '@hooks/useCoffeeBeans'
import { useEquipments } from '@hooks/useEquipments'

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
        className="font-[var(--font-serif)] text-[var(--text-display)] text-[var(--color-text)]"
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

function PhilosophyBand() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgTextY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[var(--color-brand-charcoal)]">
      {/* Huge ghost text in the background */}
      <motion.div
        aria-hidden
        style={{ y: bgTextY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="text-white font-[var(--font-serif)] whitespace-nowrap opacity-[0.035]"
          style={{ fontSize: 'clamp(90px, 18vw, 220px)' }}
        >
          COFFEE
        </span>
      </motion.div>



      <div className="relative py-32 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="h-px w-20 bg-[var(--color-primary)] mx-auto mb-12 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 64 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-[var(--color-brand-warm-white)] font-[var(--font-serif)] text-4xl md:text-5xl leading-[1.2] tracking-[-0.02em]"
        >
          Sourced. Roasted.<br />Delivered.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="mt-6 text-[var(--color-brand-sage)] text-lg leading-relaxed"
        >
          We partner directly with smallholder farms across 12 origins. Every roast is done
          in small batches and ships within 48 hours of leaving the drum.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.75, delay: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="h-px w-20 bg-[var(--color-primary)] mx-auto mt-12 origin-right"
        />
      </div>
    </section>
  )
}

export function HomePage() {
  const { data: beans, isLoading: beansLoading } = useCoffeeBeans()
  const { data: equipments, isLoading: equipLoading } = useEquipments()

  const featuredBeans = beans?.slice(0, 3) ?? []
  const featuredEquip = equipments?.slice(0, 3) ?? []

  return (
    <PageLayout>
      <VideoHeroSection
        youtubeId="Z6Dx-o3vfJY"
        endSeconds={59}
        title="Coffee Roasted at Peak."
        subtitle="Single-origin beans from the world's finest growing regions. Every cup tells a story of place and craft."
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
