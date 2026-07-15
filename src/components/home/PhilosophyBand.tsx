import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function PhilosophyBand() {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[var(--color-brand-charcoal)]">
      {/* Video Background — deferred until the section nears the viewport */}
      <div className="absolute inset-0 pointer-events-none">
        {shouldLoadVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            src="/philosophy_bg.mp4"
            className="w-full h-full object-cover opacity-75"
          />
        )}
      </div>

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
