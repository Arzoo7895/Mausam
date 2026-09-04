import Link from 'next/link'
import { Logo } from '@/components/help/logo'
import { SearchDialog } from '@/components/help/search-dialog'
import { ThemeToggle } from '@/components/help/theme-toggle'

const nav = [
  { label: 'Help Center', href: '/' },
  { label: 'Contact', href: '/contact' },
  { label: 'Status', href: '/status' },
]

export function SiteHeader() {
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
          <SearchDialog />
          <ThemeToggle />
          <Link
            href="https://mausam.ai"
            className="ml-1 hidden rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-block"
          >
            Open app
          </Link>
        </div>
      </div>
    </header>
  )
}
