import { Check, CloudSun, X } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { comparisons } from '@/lib/site-data'

export function WhyChoose() {
  return (
    <section id="why" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Why Mausam"
          title="Not another weather app"
          description="Traditional apps hand you data and wish you luck. Mausam does the thinking and hands you a decision."
        />

        <div className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-2">
          {/* Traditional */}
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <X className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-muted-foreground">
                  Traditional weather apps
                </h3>
              </div>
              <ul className="mt-6 space-y-4">
                {comparisons.map((c) => (
                  <li key={c.label} className="flex gap-3">
                    <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                    <div>
                      <p className="text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
                        {c.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {c.traditional}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Mausam */}
          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/[0.1] via-card to-card p-6 shadow-xl shadow-primary/10 sm:p-8">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <CloudSun className="size-5" />
                </span>
                <h3 className="text-base font-semibold">Mausam AI</h3>
                <span className="ml-auto rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  Intelligent
                </span>
              </div>
              <Stagger>
                <ul className="mt-6 space-y-4">
                  {comparisons.map((c) => (
                    <StaggerItem key={c.label} as="li" className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-xs font-medium tracking-wide text-primary/80 uppercase">
                          {c.label}
                        </p>
                        <p className="text-sm text-foreground/90">{c.mausam}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </ul>
              </Stagger>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
