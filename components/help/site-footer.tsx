'use client'

import Link from 'next/link'
import { categories } from '@/lib/help-content'
import { Logo } from '@/components/help/logo'
import { useI18n } from '@/lib/i18n'

const CATEGORY_TITLE_MAP: Record<string, string> = {
  'getting-started': 'help.catGettingStarted',
  'account-profile': 'help.catAccountProfile',
  'forecasts-maps': 'help.catForecastsMaps',
  'ai-daily-brief': 'help.catAiDailyBrief',
  'notifications-alerts': 'help.catNotificationsAlerts',
  'privacy-security': 'help.catPrivacySecurity',
  'troubleshooting': 'help.catTroubleshooting',
  'contact-support': 'help.catContactSupport',
}

export function SiteFooter() {
  const { t } = useI18n()

  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t('help.footerDesc')}
            </p>
          </div>

          <nav aria-label="Help topics">
            <h2 className="text-sm font-semibold text-foreground">{t('help.footerTopics')}</h2>
            <ul className="mt-3 space-y-2">
              {categories.slice(0, 5).map((c) => {
                const key = CATEGORY_TITLE_MAP[c.slug]
                const title = key ? t(key) : c.title
                return (
                  <li key={c.slug}>
                    <Link
                      href={`/help-center/categories/${c.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h2 className="text-sm font-semibold text-foreground">{t('help.footerSupport')}</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/help-center/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t('help.contactSupport')}
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center/status"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t('help.systemStatus')}
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center/categories/privacy-security"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t('help.footerPrivacy')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>{t('help.footerRights', { year: new Date().getFullYear() })}</p>
          <p>
            {t('help.footerDataAttribution')}
          </p>
        </div>
      </div>
    </footer>
  )
}
