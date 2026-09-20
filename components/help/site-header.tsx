'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/help/logo'
import { SearchDialog } from '@/components/help/search-dialog'
import { ThemeToggle } from '@/components/help/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useI18n } from '@/lib/i18n'

export function SiteHeader() {
  const { t } = useI18n()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const nav = [
    { label: t('nav.help'), href: '/help-center' },
    { label: t('help.contact'), href: '/help-center/contact' },
    { label: t('help.status'), href: '/help-center/status' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-1 px-2 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-6">
          <Logo className="shrink-0 text-sm sm:text-lg max-[359px]:[&>span]:hidden" />
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
        <div className="flex shrink-0 items-center gap-0 sm:gap-1.5">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileNavOpen}
            aria-controls="help-mobile-nav"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            {mobileNavOpen ? <X /> : <Menu />}
          </button>
          <LanguageSwitcher className="inline-flex" />
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
      {mobileNavOpen && (
        <nav
          id="help-mobile-nav"
          aria-label="Mobile primary"
          className="border-t border-border/80 bg-background/95 px-3 py-2 backdrop-blur-md md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              {t('nav.openApp')}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
