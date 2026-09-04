'use client'

import { ArrowRight, Check } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export function Cta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      setStatus('error')
      return
    }
    setStatus('done')
  }

  return (
    <section id="get-started" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <Reveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-4xl border border-primary/25 bg-gradient-to-br from-primary/[0.14] via-card to-card px-5 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 size-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_65%)] blur-2xl"
          />
          <h2 className="relative text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Start planning with intelligence, not guesswork
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            Join thousands who wake up to a clear, AI-written weather brief every
            morning. Free to start — no credit card required.
          </p>

          {status === 'done' ? (
            <div className="relative mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-2xl border border-chart-4/30 bg-chart-4/10 px-5 py-4 text-sm font-medium text-chart-4">
              <Check className="size-4" />
              You&apos;re on the list — check your inbox to get started.
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="relative mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row"
            >
              <div className="flex-1 text-left">
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cta-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  aria-invalid={status === 'error'}
                  aria-describedby={status === 'error' ? 'cta-error' : undefined}
                  className="h-11 w-full rounded-xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive"
                />
                {status === 'error' && (
                  <p id="cta-error" className="mt-1.5 pl-1 text-xs text-destructive">
                    Please enter a valid email address.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-11 shrink-0 px-5 shadow-lg shadow-primary/25"
              >
                Get Started
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  )
}
