'use client'

import { motion, useReducedMotion } from 'motion/react'

function Cloud({
  className,
  duration,
  delay = 0,
}: {
  className?: string
  duration: number
  delay?: number
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute rounded-full blur-2xl ${className}`}
      initial={{ x: '-20%' }}
      animate={{ x: '120%' }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      }}
    />
  )
}

export function WeatherBackground() {
  const reduce = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Sky wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_-10%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_55%),radial-gradient(90%_70%_at_10%_10%,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_50%)]" />

      {/* Sun glow */}
      <motion.div
        className="absolute -top-24 right-[-6rem] size-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--accent)_45%,transparent),transparent_65%)] blur-2xl"
        animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />

      {/* Drifting clouds */}
      {!reduce && (
        <>
          <Cloud className="top-[18%] h-24 w-72 bg-primary/12" duration={38} />
          <Cloud
            className="top-[42%] h-16 w-52 bg-foreground/[0.06]"
            duration={52}
            delay={6}
          />
          <Cloud
            className="top-[64%] h-20 w-64 bg-primary/10"
            duration={64}
            delay={12}
          />
        </>
      )}

      {/* Fine dot grid */}
      <div className="absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] dark:opacity-30 bg-[radial-gradient(color-mix(in_oklch,var(--foreground)_16%,transparent)_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  )
}
