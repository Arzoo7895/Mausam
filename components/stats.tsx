'use client'

import { useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { stats } from '@/lib/site-data'

function formatValue(v: number) {
  if (v >= 1000) return Math.round(v).toLocaleString('en-US')
  if (Number.isInteger(v)) return v.toString()
  return v.toFixed(1)
}

function Counter({
  value,
  suffix,
}: {
  value: number
  suffix: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {formatValue(display)}
      <span className="text-primary">{suffix}</span>
    </span>
  )
}

export function Stats() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.08] via-card to-card p-6 sm:p-8 lg:p-14">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-xs text-muted-foreground text-pretty sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
