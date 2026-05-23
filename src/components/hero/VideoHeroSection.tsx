import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Button } from '@ds/components/Button/Button'

interface VideoHeroSectionProps {
  youtubeId: string
  /** Cut the video this many seconds before its natural end to avoid YouTube end-screen overlays */
  endSeconds?: number
  title: string
  subtitle: string
  ctaPrimary: { label: string; to: string }
  ctaSecondary?: { label: string; to: string }
}

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1
      className="font-[var(--font-serif)] text-white leading-[1.1] tracking-[-0.02em] mb-6"
      style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}
    >
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}

export function VideoHeroSection({
  youtubeId,
  endSeconds,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: VideoHeroSectionProps) {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const videoScaleRaw = useTransform(scrollYProgress, [0, 1], [1.06, 1.18])
  const videoScale = useSpring(videoScaleRaw, { stiffness: 60, damping: 20 })

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    controls: '0',
    playlist: youtubeId,
    playsinline: '1',
    disablekb: '1',
    rel: '0',
    iv_load_policy: '3',
    start: '0',
    ...(endSeconds !== undefined ? { end: String(endSeconds) } : {}),
  })
  const embedSrc = `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`

  return (
    <section
      ref={ref}
      // -mt-16 pulls the section under the fixed navbar so the transparent
      // glass sits over the video, not the body background below the nav.
      className="relative overflow-hidden min-h-screen -mt-16"
    >
      {/* Video layer */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ scale: videoScale }}
      >
        <iframe
          src={embedSrc}
          allow="autoplay; encrypted-media"
          // pointer-events: none prevents accidental interaction with the
          // YouTube player iframe in case the parent event is ever enabled.
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'max(135vw, calc(135vh * 16 / 9))',
            height: 'max(135vh, calc(135vw * 9 / 16))',
            border: 'none',
            pointerEvents: 'none',
          }}
          title="hero background video"
        />
      </motion.div>

      {/* Loading mask: hides YouTube thumbnail/UI while the video initialises */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-[2] bg-[var(--color-brand-charcoal)] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.5, duration: 1.0, ease: 'easeOut' }}
      />

      {/* Gradient overlay: dark top & bottom, lighter mid */}
      <div
        aria-hidden
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: [
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.55) 100%)',
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.35) 100%)',
          ].join(', '),
        }}
      />

      {/* Text content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <AnimatedTitle text={title} />

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap gap-3 justify-center"
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
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-5 h-9 rounded-full border border-white/40 flex items-start justify-center p-1.5"
        >
          <div className="w-0.5 h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
