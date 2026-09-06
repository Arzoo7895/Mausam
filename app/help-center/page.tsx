import { ArrowRight, LifeBuoy, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { CategoryCard } from '@/components/help/category-card'
import { HeroSearch } from '@/components/help/hero-search'
import { SiteFooter } from '@/components/help/site-footer'
import { SiteHeader } from '@/components/help/site-header'
import { StatusPill } from '@/components/help/status-pill'
import { articles, categories, getCategory } from '@/lib/help-content'

const POPULAR_SLUGS = [
  'what-is-daily-brief',
  'set-up-alerts',
  'reading-the-forecast',
  'create-your-account',
  'privacy-and-location',
  'location-not-detected',
]

export default function HomePage() {
  const popular = POPULAR_SLUGS.map((s) =>
    articles.find((a) => a.slug === s),
  ).filter((a): a is (typeof articles)[number] => Boolean(a))

  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-accent/50 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
            <div className="mb-5 flex justify-center">
              <StatusPill />
            </div>
            <h1 className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How can we help you today?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
              Search guides and answers for forecasts, maps, the AI Daily Brief,
              alerts, and your account.
            </p>
            <div className="mt-8">
              <HeroSearch />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Browse by topic
              </h2>
              <p className="mt-1 text-muted-foreground">
                Everything you need, organized by what you are trying to do.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </section>

        {/* Popular articles */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-foreground">
            Popular articles
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {popular.map((a) => (
              <Link
                key={a.slug}
                href={`/help-center/articles/${a.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">
                    {a.title}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {getCategory(a.category)?.title} · {a.readMinutes} min read
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/help-center/contact"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="font-display text-base font-semibold text-foreground">
                  Still need help?
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Reach our support team — we usually reply within a day.
                </span>
              </span>
            </Link>
            <Link
              href="/help-center/status"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LifeBuoy className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="font-display text-base font-semibold text-foreground">
                  System status
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Check the live health of forecasts, maps, and alerts.
                </span>
              </span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
