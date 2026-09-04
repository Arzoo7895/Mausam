import { Stagger, StaggerItem } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { features } from '@/lib/site-data'

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Everything the sky is doing, made simple"
          description="A complete weather intelligence toolkit — the essentials done exceptionally well, plus the AI layer that ties it together."
        />

        <Stagger className="mt-10 grid gap-3 sm:mt-14 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <StaggerItem
                key={feature.title}
                className={feature.accent ? 'sm:col-span-2' : ''}
              >
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                    feature.accent
                      ? 'border-primary/25 bg-gradient-to-br from-primary/[0.09] via-card to-card'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-2xl transition-colors ${
                      feature.accent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  {feature.accent && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Temperature', 'Precipitation', 'Wind', 'Pressure'].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground dark:bg-foreground/5"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </article>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
