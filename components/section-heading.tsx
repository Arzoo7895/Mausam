import type { ReactNode } from 'react'
import { Reveal } from '@/components/reveal'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'center' | 'left'
}) {
  return (
    <div
      className={
        align === 'center'
          ? 'mx-auto max-w-2xl text-center'
          : 'max-w-2xl text-left'
      }
    >
      <Reveal>
        <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={`mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg ${
              align === 'center' ? 'mx-auto max-w-xl' : ''
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
