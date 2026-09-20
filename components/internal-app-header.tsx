'use client'

import Link from 'next/link'
import { ArrowLeft, Menu, UserRound } from 'lucide-react'
import { officialLogoUrl } from '@/components/mausam/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

type InternalAppHeaderProps = {
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
  className?: string
  showProfile?: boolean
  onMenuClick?: () => void
}

export function InternalAppHeader({
  backHref,
  backLabel = 'Back to dashboard',
  children,
  className,
  showProfile = false,
  onMenuClick,
}: InternalAppHeaderProps) {
  return (
    <header className={cn('border-b border-border/80 bg-background/95 backdrop-blur-md', className)}>
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center gap-3 px-3 py-3 sm:px-5 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          {onMenuClick && (
            <button type="button" onClick={onMenuClick} aria-label="Open menu" className="shrink-0 rounded-lg p-2 hover:bg-muted lg:hidden">
              <Menu aria-hidden="true" />
            </button>
          )}
          {backHref && (
            <Link href={backHref} aria-label={backLabel} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <ArrowLeft aria-hidden="true" size={18} />
            </Link>
          )}
          <Link href="/" aria-label="Mausam AI home" className="flex min-w-0 shrink items-center gap-2">
            <img src={officialLogoUrl} alt="Mausam AI" className="size-9 shrink-0 rounded-xl object-cover" />
            <span className="truncate text-base font-semibold tracking-tight sm:text-lg">Mausam <span className="text-primary">AI</span></span>
          </Link>
          {children && <div className="hidden min-w-0 items-center gap-1 md:flex">{children}</div>}
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {showProfile && (
            <Link href="/user-profile-and-setting" aria-label="User Profile" className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90">
              <UserRound size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
