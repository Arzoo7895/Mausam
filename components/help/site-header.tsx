'use client'

import Link from 'next/link'
import { Logo } from '@/components/help/logo'
import { SearchDialog } from '@/components/help/search-dialog'
import { ThemeToggle } from '@/components/help/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useI18n } from '@/lib/i18n'

export function SiteHeader() {
  const { t } = useI18n()

  const nav = [
    { label: t('nav.help'), href: '/help-center' },
    { label: t('help.contact'), href: '/help-center/contact' },
    { label: t('help.status'), href: '/help-center/status' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <SearchDialog />
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="ml-1 hidden rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-block"
          >
            {t('nav.openApp')}
          </Link>
        </div>
      </div>
    </header>
  )
}
