'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { summarizeStatus, type StatusRow } from '@/lib/status'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

export function StatusPill() {
  const { t } = useI18n()
  const [rows, setRows] = useState<StatusRow[]>([])

  useEffect(() => {
    async function loadStatus() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('system_status')
          .select('component, status')
        if (data) setRows(data as StatusRow[])
      } catch {}
    }
    loadStatus()
  }, [])

  const summary = summarizeStatus(rows)
  const label = summary.level === 'operational'
    ? t('help.allOperational')
    : summary.label

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
      {label}
    </Link>
  )
}
