import { CloudSun } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight',
        className,
      )}
      aria-label="Mausam AI Help Center home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <CloudSun className="size-5" aria-hidden="true" />
      </span>
      <span className="flex items-baseline gap-1.5">
        Mausam AI
        <span className="text-sm font-normal text-muted-foreground">Help</span>
      </span>
    </Link>
  )
}
