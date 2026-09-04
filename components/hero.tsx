'use client'

import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  CloudSun,
  Droplets,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WeatherBackground } from '@/components/weather-background'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  }
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  }

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-4 pt-28 pb-12 sm:px-6 sm:pt-36 md:pt-40 lg:pb-24"
    >
      <WeatherBackground />

      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.a
            variants={item}
            href="#features"
            className="glass inline-flex items-center gap-2 rounded-full border border-border py-1.5 pr-3.5 pl-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-primary">
              <Sparkles className="size-3" /> New
            </span>
            AI daily briefs are here
            <ArrowRight className="size-3" />
          </motion.a>

          <motion.h1
            variants={item}
            className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          >
            <span className="text-gradient">Weather intelligence</span> that
            tells you what to do next.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base md:text-lg"
          >
            Mausam AI turns raw atmospheric data into a clear daily brief,
            proactive alerts, and personalized recommendations — so you plan
            your day with confidence, not guesswork.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              nativeButton={false}
              className="h-11 px-5 text-sm shadow-lg shadow-primary/25"
              render={<a href="#showcase" />}
            >
              Try Demo
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              className="h-11 px-5 text-sm"
              render={<a href="#get-started" />}
            >
              Get Started
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-chart-4" />
              Live Open-Meteo data
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              12,500+ cities
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              No credit card required
            </span>
          </motion.div>
        </motion.div>

        <HeroWidget reduce={!!reduce} />
      </div>
    </section>
  )
}

function HeroWidget({ reduce }: { reduce: boolean }) {
  const hours = [
    { t: '9AM', v: 26, icon: Sun },
    { t: '12PM', v: 31, icon: Sun },
    { t: '3PM', v: 33, icon: CloudSun },
    { t: '6PM', v: 29, icon: CloudSun },
    { t: '9PM', v: 24, icon: CloudSun },
  ]

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease, delay: 0.2 }}
      className="relative mx-auto w-full max-w-md"
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        className="glass rounded-3xl border border-border p-5 shadow-2xl shadow-primary/10"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Bengaluru, IN</p>
            <p className="mt-1 flex items-start text-6xl font-semibold tracking-tight">
              33<span className="mt-2 text-2xl text-muted-foreground">°C</span>
            </p>
            <p className="text-sm font-medium text-foreground/80">
              Partly cloudy · Feels 35°
            </p>
          </div>
          <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground dark:text-accent">
            <CloudSun className="size-8" />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Wind, label: 'Wind', value: '12 km/h' },
            { icon: Droplets, label: 'Humidity', value: '58%' },
            { icon: Sun, label: 'UV', value: 'High' },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl bg-background/50 p-2.5 dark:bg-foreground/5"
            >
              <m.icon className="mx-auto size-4 text-primary" />
              <p className="mt-1 text-[11px] text-muted-foreground">
                {m.label}
              </p>
              <p className="text-xs font-semibold">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/[0.07] p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <Sparkles className="size-3" /> AI Daily Brief
          </p>
          <p className="mt-1 text-[13px] leading-snug text-foreground/80">
            Warm and bright through the afternoon. Carry water and sunscreen —
            UV peaks at 3PM. Light showers likely after 8PM.
          </p>
        </div>

        <div className="mt-4 flex justify-between gap-1">
          {hours.map((h) => (
            <div key={h.t} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">{h.t}</span>
              <h.icon className="size-4 text-accent-foreground dark:text-accent" />
              <span className="text-xs font-semibold">{h.v}°</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating alert chip */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease }}
        className="glass absolute -bottom-4 -left-3 hidden items-center gap-2 rounded-2xl border border-border p-2.5 shadow-xl sm:flex"
      >
        <span className="flex size-8 items-center justify-center rounded-xl bg-chart-4/20 text-chart-4">
          <Droplets className="size-4" />
        </span>
        <div className="pr-1">
          <p className="text-[11px] font-semibold leading-none">Rain alert</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Showers in ~2 hrs
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
