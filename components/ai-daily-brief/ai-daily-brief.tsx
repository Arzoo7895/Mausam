'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, CloudSun, Copy, RefreshCw, Share2, Sparkles, Sliders } from 'lucide-react'
import type { DailyBriefData } from '@/lib/intelligence/service'

export type { DailyBriefData }

type AIDailyBriefProps = {
  data?: DailyBriefData
  updatedAt?: string
  onRefresh?: () => Promise<void> | void
  loading?: boolean
  error?: string | null
}

export function AIDailyBrief({
  data,
  updatedAt = 'Just now',
  onRefresh,
  loading = false,
  error,
}: AIDailyBriefProps) {
  const [expanded, setExpanded] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const briefText = data
    ? `${data.summary}\n\nHighlights: ${data.highlights.join('; ')}\nRecommendations: ${data.recommendations.join('; ')}`
    : ''

  const refresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh?.()
    } finally {
      setTimeout(() => setRefreshing(false), 500)
    }
  }

  const copyBrief = async () => {
    if (!briefText) return
    await navigator.clipboard?.writeText(briefText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const shareBrief = async () => {
    if (!briefText) return
    if (navigator.share) {
      await navigator.share({ title: 'Mausam AI Daily Brief', text: briefText })
      setShared(true)
      setTimeout(() => setShared(false), 1800)
    } else {
      await copyBrief()
    }
  }

  return (
    <section
      aria-labelledby="daily-brief-title"
      className="rounded-2xl border border-primary/20 bg-card/80 p-6 shadow-[0_12px_35px_-24px_rgba(13,148,136,.65)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Sparkles size={18} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="daily-brief-title" className="font-semibold">
                AI daily brief
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                AI INSIGHT
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Personalized for your day · Updated {updatedAt}
            </p>
          </div>
        </div>
        <CloudSun size={26} className="text-primary/70" aria-hidden="true" />
      </div>

      {loading && !data ? (
        <div className="mt-5 space-y-3" aria-label="Loading daily brief">
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        </div>
      ) : error ? (
        <p role="alert" className="mt-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : data?.disabled ? (
        <div className="mt-5 rounded-xl border border-dashed border-border p-5 text-center">
          <p className="text-sm font-medium text-muted-foreground">{data.summary}</p>
          <Link
            href="/user-profile-and-setting"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Sliders size={13} /> Enable Daily Brief in Settings
          </Link>
        </div>
      ) : data ? (
        <>
          <motion.p layout className="mt-5 text-[15px] leading-6 text-foreground/85">
            {data.summary}
          </motion.p>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
                  <BriefList title="Highlights" items={data.highlights} />
                  <BriefList title="Watch for" items={data.risks} risk />
                  <BriefList title="Your plan" items={data.recommendations} />
                </div>
                {data.timeline.length > 0 && (
                  <div className="mt-5 border-t border-border pt-5">
                    <p className="mb-3 text-xs font-medium text-muted-foreground">Through the day</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {data.timeline.map((item) => (
                        <div key={item.time} className="rounded-xl bg-muted/60 p-3">
                          <p className="text-xs font-semibold text-primary">{item.time}</p>
                          <p className="mt-1 text-sm font-medium">{item.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <span
              className="text-xs text-muted-foreground"
              title="Telemetry completeness based on available local sensors and numerical forecast streams"
            >
              Data readiness: {data.confidenceLevel ?? 'High'} ({data.confidence}%)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={copyBrief}
                aria-label="Copy daily brief"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
              <button
                onClick={shareBrief}
                aria-label="Share daily brief"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                {shared ? <Check size={15} /> : <Share2 size={15} />}
              </button>
              <button
                onClick={refresh}
                disabled={refreshing}
                aria-label="Refresh daily brief"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition"
              >
                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition"
              >
                {expanded ? 'Collapse' : 'View insight'}
                <ChevronDown
                  size={14}
                  className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'}
                />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 space-y-3" aria-label="Loading daily brief">
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        </div>
      )}
    </section>
  )
}

function BriefList({ title, items, risk = false }: { title: string; items: string[]; risk?: boolean }) {
  return (
    <div>
      <p className={`text-xs font-medium ${risk ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
        {title}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-5 text-muted-foreground">
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${risk ? 'bg-amber-500' : 'bg-primary'}`}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AIDailyBrief
