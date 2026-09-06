import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { summarizeStatus, type StatusRow } from '@/lib/status'
import { cn } from '@/lib/utils'

export async function StatusPill() {
  let rows: StatusRow[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('system_status')
      .select('component, status')
    rows = (data as StatusRow[]) ?? []
  } catch {
    rows = []
  }

  const summary = summarizeStatus(rows)

  return (
    <Link
      href="/help-center/status"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-foreground"
    >
      <span className="relative flex size-2.5">
        <span
          className={cn(
            'absolute inline-flex size-full animate-ping rounded-full opacity-60',
            summary.dotClass,
          )}
        />
        <span
          className={cn(
            'relative inline-flex size-2.5 rounded-full',
            summary.dotClass,
          )}
        />
      </span>
      {summary.label}
    </Link>
  )
}
