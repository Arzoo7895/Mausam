'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export function Cta() {
  return (
    <section id="get-started" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <Reveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-4xl border border-primary/25 bg-gradient-to-br from-primary/[0.14] via-card to-card px-5 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 size-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_65%)] blur-2xl"
          />
          <h2 className="relative text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Your weather, your decisions — made smarter.
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            See what Mausam can do for your day. Explore live forecasts, alerts, and intelligent recommendations in one place.
          </p>

          <Button
            size="lg"
            nativeButton={false}
            className="relative mt-8 h-11 px-5 shadow-lg shadow-primary/25"
            onClick={() => { window.location.href = '/tutorial' }}
          >
            Explore Mausam
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
