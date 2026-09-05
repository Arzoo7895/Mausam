import Link from 'next/link'
import { categories } from '@/lib/help-content'
import { Logo } from '@/components/help/logo'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Weather intelligence that speaks human. Clear forecasts, honest
              uncertainty, and an AI brief for your day.
            </p>
          </div>

          <nav aria-label="Help topics">
            <h2 className="text-sm font-semibold text-foreground">Topics</h2>
            <ul className="mt-3 space-y-2">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/help-center/categories/${c.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h2 className="text-sm font-semibold text-foreground">Support</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/help-center/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact support
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center/status"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  System status
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center/categories/privacy-security"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy &amp; security
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Mausam AI. All rights reserved.</p>
          <p>
            Forecast data by Open-Meteo · Places by OpenStreetMap
          </p>
        </div>
      </div>
    </footer>
  )
}
