'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, CloudSun, Copy, RefreshCw, Share2, Sparkles } from 'lucide-react'

export type DailyBriefData = {
  summary: string
  highlights: string[]
  risks: string[]
  recommendations: string[]
  timeline: { time: string; title: string; detail: string }[]
  confidence: number
}

export const defaultDailyBrief: DailyBriefData = {
  summary: 'A warm, bright start with clouds building through the afternoon. If you\'re heading out, the best window is before 3 PM. Carry a light layer for the evening drizzle.',
  highlights: ['Best outdoor window before 3 PM', 'Comfortable morning temperatures', 'Rain likely after 3 PM'],
  risks: ['Moderate rainfall during evening commute'],
  recommendations: ['Carry a compact umbrella', 'Use sunscreen before noon', 'Keep a light layer for later'],
  timeline: [
    { time: 'Now', title: 'Bright & warm', detail: '28° · partly cloudy' },
    { time: '3 PM', title: 'Clouds gather', detail: '30° · rain chance rises' },
    { time: '6 PM', title: 'Evening drizzle', detail: '27° · roads may be slick' },
  ],
  confidence: 94,
}

type AIDailyBriefProps = {
  data?: DailyBriefData
  updatedAt?: string
  onRefresh?: () => Promise<void> | void
  loading?: boolean
  error?: string | null
}

export function AIDailyBrief({ data = defaultDailyBrief, updatedAt = '2 min ago', onRefresh, loading = false, error }: AIDailyBriefProps) {
  const [expanded, setExpanded] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const briefText = `${data.summary}\n\nHighlights: ${data.highlights.join('; ')}\nRecommendations: ${data.recommendations.join('; ')}`
  const refresh = async () => {
    setRefreshing(true)
    try { await onRefresh?.() } finally { setTimeout(() => setRefreshing(false), 500) }
  }
  const copyBrief = async () => {
    await navigator.clipboard?.writeText(briefText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  const shareBrief = async () => {
    if (navigator.share) await navigator.share({ title: 'Mausam AI Daily Brief', text: briefText })
    else await copyBrief()
    setShared(true)
    setTimeout(() => setShared(false), 1800)
  }

  return (
    <section aria-labelledby="daily-brief-title" className="rounded-2xl border border-primary/20 bg-card/80 p-6 shadow-[0_12px_35px_-24px_rgba(13,148,136,.65)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Sparkles size={18} aria-hidden="true" /></div>
          <div><div className="flex items-center gap-2"><h2 id="daily-brief-title" className="font-semibold">AI daily brief</h2><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">AI INSIGHT</span></div><p className="mt-1 text-xs text-muted-foreground">Personalized for your day · Updated {updatedAt}</p></div>
        </div>
        <CloudSun size={26} className="text-primary/70" aria-hidden="true" />
      </div>
      {loading ? <div className="mt-5 space-y-3" aria-label="Loading daily brief"><div className="h-4 animate-pulse rounded bg-muted"/><div className="h-4 w-4/5 animate-pulse rounded bg-muted"/><div className="h-4 w-3/5 animate-pulse rounded bg-muted"/></div> : error ? <p role="alert" className="mt-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : <>
        <motion.p layout className="mt-5 text-[15px] leading-6 text-foreground/85">{data.summary}</motion.p>
        <AnimatePresence initial={false}>{expanded && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-3"><BriefList title="Highlights" items={data.highlights} /><BriefList title="Watch for" items={data.risks} risk /><BriefList title="Your plan" items={data.recommendations} /></div><div className="mt-5 border-t border-border pt-5"><p className="mb-3 text-xs font-medium text-muted-foreground">Through the day</p><div className="grid gap-2 sm:grid-cols-3">{data.timeline.map(item => <div key={item.time} className="rounded-xl bg-muted/60 p-3"><p className="text-xs font-semibold text-primary">{item.time}</p><p className="mt-1 text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p></div>)}</div></div></motion.div>}</AnimatePresence>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><span className="text-xs text-muted-foreground">Confidence {data.confidence}%</span><div className="flex items-center gap-1"><button onClick={copyBrief} aria-label="Copy daily brief" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">{copied ? <Check size={15}/> : <Copy size={15}/>}</button><button onClick={shareBrief} aria-label="Share daily brief" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">{shared ? <Check size={15}/> : <Share2 size={15}/>}</button><button onClick={refresh} disabled={refreshing} aria-label="Refresh daily brief" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''}/></button><button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-primary hover:bg-primary/10">{expanded ? 'Collapse' : 'View insight'}<ChevronDown size={14} className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'}/></button></div></div>
      </>}
    </section>
  )
}

function BriefList({ title, items, risk = false }: { title: string; items: string[]; risk?: boolean }) {
  return <div><p className={`text-xs font-medium ${risk ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>{title}</p><ul className="mt-2 space-y-2">{items.map(item => <li key={item} className="flex gap-2 text-xs leading-5 text-muted-foreground"><span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${risk ? 'bg-amber-500' : 'bg-primary'}`} aria-hidden="true" />{item}</li>)}</ul></div>
}

export default AIDailyBrief
