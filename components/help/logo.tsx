import Link from 'next/link'
import { cn } from '@/lib/utils'
import { officialLogoUrl } from '@/components/mausam/logo'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/help-center"
      className={cn(
        'group inline-flex min-w-0 items-center gap-1 font-display font-semibold tracking-tight sm:gap-2',
        className,
      )}
      aria-label="Mausam AI Help Center home"
    >
      <img
        src={officialLogoUrl}
        alt="Mausam AI"
        className="size-7 shrink-0 rounded-lg object-cover shadow-sm sm:size-8"
      />
      <span className="flex min-w-0 items-baseline gap-1 whitespace-nowrap">
        Mausam AI
        <span className="text-xs font-normal text-muted-foreground sm:text-sm">Help</span>
      </span>
    </Link>
  )
}
