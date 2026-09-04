import {
  CloudSun,
  Droplets,
  MapPin,
  Navigation,
  Sun,
  Wind,
} from 'lucide-react'
import { ForecastChart } from '@/components/forecast-chart'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

function BrowserChrome({
  url,
  children,
}: {
  url: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-destructive/50" />
          <span className="size-3 rounded-full bg-accent/70" />
          <span className="size-3 rounded-full bg-chart-4/60" />
        </div>
        <div className="mx-auto flex w-full max-w-xs items-center gap-1.5 truncate rounded-md border border-border bg-background/70 px-3 py-1 text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-chart-4" />
          {url}
        </div>
      </div>
      {children}
    </div>
  )
}

export function ProductShowcase() {
  return (
    <section id="showcase" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Product"
          title="A dashboard you'll actually enjoy opening"
          description="Fast, focused, and beautifully readable in both light and dark — every pixel earns its place."
        />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-5">
          {/* Main dashboard mockup */}
          <Reveal className="lg:col-span-3" y={30}>
            <BrowserChrome url="app.mausam.ai/dashboard">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <MapPin className="size-3.5 text-primary" /> Mumbai, IN
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight">
                      30°
                    </p>
                  </div>
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground dark:text-accent">
                    <CloudSun className="size-7" />
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: Wind, label: 'Wind', value: '14 km/h' },
                    { icon: Droplets, label: 'Humidity', value: '71%' },
                    { icon: Sun, label: 'UV Index', value: '7 High' },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-border bg-background/50 p-2.5 dark:bg-foreground/5"
                    >
                      <m.icon className="size-4 text-primary" />
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        {m.label}
                      </p>
                      <p className="text-sm font-semibold">{m.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      7-day forecast
                    </p>
                    <span className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-chart-1" /> High
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-chart-3" /> Low
                      </span>
                    </span>
                  </div>
                  <ForecastChart />
                </div>
              </div>
            </BrowserChrome>
          </Reveal>

          {/* Secondary column: map + AQI */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Reveal className="flex-1" y={30} delay={0.1}>
              <BrowserChrome url="app.mausam.ai/map">
                <div className="relative h-full min-h-44 bg-[radial-gradient(70%_70%_at_30%_20%,color-mix(in_oklch,var(--chart-2)_30%,transparent),transparent),radial-gradient(60%_60%_at_80%_80%,color-mix(in_oklch,var(--chart-1)_28%,transparent),transparent)]">
                  <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklch,var(--foreground)_10%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--foreground)_10%,transparent)_1px,transparent_1px)] [background-size:28px_28px]" />
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <span className="flex size-8 animate-float items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <Navigation className="size-4" />
                    </span>
                  </div>
                  <div className="glass absolute bottom-3 left-3 rounded-xl border border-border px-3 py-2 text-[11px]">
                    <p className="font-semibold">Precipitation layer</p>
                    <p className="text-muted-foreground">Live radar · 5 min ago</p>
                  </div>
                </div>
              </BrowserChrome>
            </Reveal>

            <Reveal y={30} delay={0.15}>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-primary/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Air Quality</p>
                  <span className="rounded-full bg-chart-4/15 px-2.5 py-0.5 text-xs font-semibold text-chart-4">
                    Good · 42
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-chart-4 to-chart-2" />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Air is clean today — a great window for that morning run
                  before humidity climbs after noon.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
