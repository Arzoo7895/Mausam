import { CircleCheck } from 'lucide-react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/help/breadcrumb'
import { SiteFooter } from '@/components/help/site-footer'
import { SiteHeader } from '@/components/help/site-header'
import { createClient } from '@/lib/supabase/server'
import { STATUS_META, summarizeStatus, type StatusRow } from '@/lib/status'

export const metadata: Metadata = {
  title: 'System Status — Mausam AI',
  description:
    'Live operational status of Mausam AI services: forecast API, AI Daily Brief, maps, alerts, and more.',
}

export const dynamic = 'force-dynamic'

export default async function StatusPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('system_status')
    .select('component, description, status, sort_order, updated_at')
    .order('sort_order', { ascending: true })

  const rows = (data ?? []) as StatusRow[]
  const summary = summarizeStatus(rows)
  const allOperational = summary.level === 'operational'

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Breadcrumb
          items={[{ label: 'Help Center', href: '/' }, { label: 'System status' }]}
        />

        <div
          className={`mt-6 flex items-center gap-4 rounded-2xl border p-6 ${
            allOperational
              ? 'border-success/20 bg-success/5'
              : 'border-warning/20 bg-warning/5'
          }`}
        >
          <span
            className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
              allOperational ? 'bg-success/15' : 'bg-warning/15'
            }`}
          >
            <CircleCheck
              className={`size-6 ${allOperational ? 'text-success' : 'text-warning'}`}
              aria-hidden="true"
            />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {summary.label}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Live status of Mausam AI platform components.
            </p>
          </div>
        </div>

        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {rows.map((row) => {
            const meta = STATUS_META[row.status]
            return (
              <li
                key={row.component}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{row.component}</p>
                  {row.description ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {row.description}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${meta.badgeClass}`}
                >
                  <span className={`size-1.5 rounded-full ${meta.dotClass}`} />
                  {meta.label}
                </span>
              </li>
            )
          })}
        </ul>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Status reflects real-time monitoring of our services. For incident
          history or to report an issue, contact support.
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
