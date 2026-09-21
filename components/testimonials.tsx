import { Brain, CloudSun, UserRound } from 'lucide-react'
import { Stagger, StaggerItem } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const thinkingSteps = [
  {
    icon: UserRound,
    title: 'Your Context',
    description: 'Tell Mausam what matters to you — your activity, preferences, location, and daily needs.',
  },
  {
    icon: CloudSun,
    title: 'Live Weather Intelligence',
    description: 'Mausam combines real-time weather, forecast, alerts, and environmental data for your selected location.',
  },
  {
    icon: Brain,
    title: 'AI Recommendations',
    description: 'AI interprets the conditions and your context to provide practical recommendations for what you should consider next.',
  },
]

export function Testimonials() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How Mausam thinks"
          title="From your context to a smarter weather decision."
          description="Mausam AI combines your preferences, location, weather conditions, and forecast data to turn complex weather information into practical, personalized recommendations."
        />

        <Stagger className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3">
          {thinkingSteps.map((step) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.title}>
                <article className="h-full rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </article>
              </StaggerItem>
            )
          })}
        </Stagger>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:mt-10 sm:gap-x-4 sm:text-xs">
          <span>Your input</span>
          <span aria-hidden="true" className="text-primary">→</span>
          <span>Weather data</span>
          <span aria-hidden="true" className="text-primary">→</span>
          <span>AI analysis</span>
          <span aria-hidden="true" className="text-primary">→</span>
          <span>Personalized recommendation</span>
        </div>
      </div>
    </section>
  )
}
