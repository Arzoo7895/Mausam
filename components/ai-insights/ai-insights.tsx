'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, ChevronLeft, CircleAlert, ListChecks, MapPin, Sparkles } from 'lucide-react'
import { buildDemoAlerts, buildWeatherInsight } from '@/lib/alerts/service'
import { getStoredLocation, DEFAULT_LOCATION } from '@/lib/location'

export function AiInsights() {
  const [location, setLocation] = useState(DEFAULT_LOCATION)

  useEffect(() => {
    const sync = () => setLocation(getStoredLocation())
    sync()
    window.addEventListener('mausam:location-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('mausam:location-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const insight = useMemo(() => buildWeatherInsight(location), [location])
  const alerts = useMemo(() => buildDemoAlerts(location).filter((a) => a.insight), [location])

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1024px] items-center justify-between px-6 py-4 lg:px-10">
          <div>
            <Link href="/alerts" className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-900">
              <ChevronLeft size={14} /> Back to alerts
            </Link>
            <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 transition hover:text-slate-600">Mausam AI</Link>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">AI Weather Insight</h1>
          </div>
          <Link href="/user-profile-and-setting" aria-label="Account and settings" className="grid size-9 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-700">MA</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1024px] px-6 py-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
            <MapPin size={15} className="text-orange-500" /> {insight.location}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-700 ring-1 ring-amber-100" title="Live weather data is not connected yet">
            Demo data
          </span>
        </div>

        <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 text-orange-600">
            <Sparkles size={18} />
            <p className="text-sm font-semibold">Summary for {insight.location}</p>
          </div>
          <p className="mt-3 max-w-2xl text-lg leading-7 text-slate-800">{insight.summary}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700">
            <Sparkles size={13} /> Confidence {insight.confidence}%
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InsightList title="Highlights" icon={<Sparkles size={16} className="text-orange-500" />} items={insight.highlights} />
          <InsightList title="Watch for" icon={<CircleAlert size={16} className="text-amber-500" />} items={insight.risks} tone="risk" />
          <InsightList title="Your plan" icon={<ListChecks size={16} className="text-emerald-600" />} items={insight.recommendations} />
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Per-alert insights</h2>
          <p className="mt-1 text-sm text-slate-500">How Mausam AI reads each active alert in {insight.location}.</p>
          <div className="mt-5 grid gap-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{alert.type}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900">{alert.title}</p>
                <p className="mt-1 flex items-start gap-1.5 text-sm leading-6 text-slate-500">
                  <Sparkles size={14} className="mt-1 shrink-0 text-orange-500" /> {alert.insight}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <Link href="/alerts" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            <ArrowLeft size={16} /> Back to alerts
          </Link>
        </div>
      </div>
    </main>
  )
}

function InsightList({ title, items, icon, tone = 'default' }: { title: string; items: string[]; icon: React.ReactNode; tone?: 'default' | 'risk' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
            <Check size={15} className={`mt-1 shrink-0 ${tone === 'risk' ? 'text-amber-500' : 'text-emerald-600'}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
