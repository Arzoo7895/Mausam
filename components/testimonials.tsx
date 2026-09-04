import { Star } from 'lucide-react'
import { Stagger, StaggerItem } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { testimonials } from '@/lib/site-data'

const avatarTints = [
  'bg-chart-1/20 text-chart-1',
  'bg-chart-2/20 text-chart-2',
  'bg-chart-3/25 text-accent-foreground dark:text-chart-3',
  'bg-chart-4/20 text-chart-4',
  'bg-chart-5/20 text-chart-5',
  'bg-primary/20 text-primary',
]

export function Testimonials() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Loved by users"
          title="Trusted by people who plan around the weather"
          description="From runners to farmers to field teams — Mausam has become part of the daily routine."
        />

        <Stagger className="mt-10 grid gap-3 sm:mt-14 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <StaggerItem key={t.name}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="size-4 fill-accent text-accent"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90 text-pretty">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span
                    className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${avatarTints[i % avatarTints.length]}`}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {t.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
