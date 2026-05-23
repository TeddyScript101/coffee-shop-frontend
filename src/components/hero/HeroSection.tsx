import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Button } from '@ds/components/Button/Button'
import { cn } from '@/utils/cn'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaPrimary: { label: string; to: string }
  ctaSecondary?: { label: string; to: string }
  imageUrl?: string
  imageAlt?: string
  className?: string
}

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="font-[var(--font-serif)] text-[var(--text-display-xl)] text-[var(--color-text)] leading-[1.1] tracking-[-0.02em] mb-6">
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}

export function HeroSection({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  imageUrl,
  imageAlt,
  className,
}: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Image drifts down (moves slower than page scroll, creating depth)
  const imageYRaw = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const imageY = useSpring(imageYRaw, { stiffness: 75, damping: 22 })

  // Text floats slightly upward as hero scrolls away
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])

  // Layer 1: large warm glow blob (deep background, moves down)
  const shape1Y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  // Layer 2: bean-shaped oval (mid-ground, moves up at medium speed)
  const shape2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-55%'])
  // Layer 3: small sharp dot (foreground, exits frame fastest)
  const shape3Y = useTransform(scrollYProgress, [0, 1], ['0%', '-90%'])
  // Layer 4: tiny accent dot
  const shape4Y = useTransform(scrollYProgress, [0, 1], ['0%', '-70%'])

  return (
    <section
      ref={ref}
      className={cn(
        'relative overflow-hidden',
        'min-h-[82vh]',
        'py-24 md:py-32',
        className,
      )}
    >
      {/* Deep-background warm glow */}
      <motion.div
        aria-hidden
        style={{ y: shape1Y }}
        className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-[var(--color-brand-beige)] opacity-50 blur-[110px] pointer-events-none"
      />

      {/* Mid-ground bean shape */}
      <motion.div
        aria-hidden
        style={{ y: shape2Y }}
        className="absolute bottom-4 -left-16 w-36 h-56 rounded-full bg-[var(--color-brand-brown)] opacity-[0.09] rotate-[22deg] pointer-events-none"
      />

      {/* Foreground sharp dot */}
      <motion.div
        aria-hidden
        style={{ y: shape3Y }}
        className="absolute top-1/3 left-[11%] w-3 h-3 rounded-full bg-[var(--color-primary)] opacity-50 pointer-events-none"
      />

      {/* Accent dot (right side) */}
      <motion.div
        aria-hidden
        style={{ y: shape4Y }}
        className="absolute top-[58%] right-[7%] w-2 h-2 rounded-full bg-[var(--color-primary-light)] opacity-60 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div style={{ y: textY }}>
          <AnimatedTitle text={title} />

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-md"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap gap-3"
          >
            <Link to={ctaPrimary.to}>
              <Button size="lg">{ctaPrimary.label}</Button>
            </Link>
            {ctaSecondary && (
              <Link to={ctaSecondary.to}>
                <Button variant="secondary" size="lg">{ctaSecondary.label}</Button>
              </Link>
            )}
          </motion.div>
        </motion.div>

        {imageUrl && (
          <div className="order-first md:order-last">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-[var(--shadow-soft-xl)] bg-[var(--color-surface-elevated)]">
              <motion.img
                src={imageUrl}
                alt={imageAlt ?? ''}
                style={{ y: imageY, scale: 1.18 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
