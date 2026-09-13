'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { CategoryIcon } from '@/components/help/category-icon'
import { articlesByCategory, type Category } from '@/lib/help-content'
import { useI18n } from '@/lib/i18n'

const CATEGORY_LOCALIZATION_MAP: Record<string, { title: string; desc: string }> = {
  'getting-started': { title: 'help.catGettingStarted', desc: 'help.catGettingStartedDesc' },
  'account-profile': { title: 'help.catAccountProfile', desc: 'help.catAccountProfileDesc' },
  'forecasts-maps': { title: 'help.catForecastsMaps', desc: 'help.catForecastsMapsDesc' },
  'ai-daily-brief': { title: 'help.catAiDailyBrief', desc: 'help.catAiDailyBriefDesc' },
  'notifications-alerts': { title: 'help.catNotificationsAlerts', desc: 'help.catNotificationsAlertsDesc' },
  'privacy-security': { title: 'help.catPrivacySecurity', desc: 'help.catPrivacySecurityDesc' },
  'troubleshooting': { title: 'help.catTroubleshooting', desc: 'help.catTroubleshootingDesc' },
  'contact-support': { title: 'help.catContactSupport', desc: 'help.catContactSupportDesc' },
}

export function CategoryCard({ category }: { category: Category }) {
  const { t } = useI18n()
  const count = articlesByCategory(category.slug).length
  const loc = CATEGORY_LOCALIZATION_MAP[category.slug]

  const title = loc ? t(loc.title) : category.title
  const description = loc ? t(loc.desc) : category.description
  const articleLabel = count === 1
    ? t('help.articleCountSingle', { count })
    : t('help.articleCount', { count })

  return (
    <Link
      href={`/help-center/categories/${category.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <CategoryIcon name={category.icon} className="size-5" />
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <p className="mt-4 text-xs font-medium text-muted-foreground">
        {articleLabel}
      </p>
    </Link>
  )
}
