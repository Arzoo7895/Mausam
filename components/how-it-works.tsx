import { MapPin, Radar, Sparkles } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { steps } from '@/lib/site-data'

const icons = [MapPin, Radar, Sparkles]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="From atmosphere to action in three steps"
          description="No dashboards to decode. Mausam does the interpreting so you can just decide."
        />

        <Stagger className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <StaggerItem key={step.index}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-4xl font-semibold text-border transition-colors group-hover:text-primary/30">
                      {step.index}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-6 hidden items-center justify-center gap-2 text-xs text-muted-foreground md:flex">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            Continuously refreshed as conditions change
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
