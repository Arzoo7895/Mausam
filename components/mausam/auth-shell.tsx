"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { CloudSun, Sparkles, Zap } from "lucide-react"
import { Logo } from "@/components/mausam/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { WeatherBackground } from "@/components/weather-background"
const highlights = [
  { icon: CloudSun, title: "Hyperlocal forecasts", desc: "Minute-by-minute accuracy for any coordinate on Earth." },
  { icon: Sparkles, title: "AI-driven insights", desc: "Plain-language guidance from raw meteorological data." },
  { icon: Zap, title: "Real-time alerts", desc: "Severe-weather warnings delivered before they hit." },
]

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-svh flex-col">
      <WeatherBackground />

      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <ThemeToggle />
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 pb-10 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Brand / value panel — hidden on small screens */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden flex-col justify-center lg:flex"
        >
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border/60 glass-panel px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-chart-3" />
              Weather Intelligence
          </span>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground xl:text-5xl">
            The weather platform that thinks ahead.
          </h1>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Mausam AI turns complex atmospheric data into clear, actionable intelligence — so you always know what the
            sky will do next.
          </p>

          <ul className="mt-10 space-y-5">
            {highlights.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.12 }}
                className="flex items-start gap-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl glass-panel border border-border/50 text-primary">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Form panel */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex w-full items-center justify-center lg:justify-end"
        >
          {children}
        </motion.section>
      </div>
    </main>
  )
}
