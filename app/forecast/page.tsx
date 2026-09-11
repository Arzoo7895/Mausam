'use client'

import Link from 'next/link'
import { ArrowLeft, CloudRain, Droplets, Sun, Wind } from 'lucide-react'
import { locationLabel, useActiveLocation } from '@/lib/location-context'
import { useWeather } from '@/lib/weather/use-weather'
import { weatherCodeInfo } from '@/lib/weather/service'

export default function ForecastPage() {
  const { active } = useActiveLocation()
  const { data, loading, error, refresh } = useWeather(active?.latitude, active?.longitude)

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Back to dashboard</Link>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm text-primary">Live forecast</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{locationLabel(active)}</h1><p className="mt-2 text-sm text-muted-foreground">Open-Meteo forecast aligned to the current local hour.</p></div>
          <button onClick={refresh} className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">Refresh forecast</button>
        </div>
        {error && <div role="alert" className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Current', value: data ? `${data.current.tempC}°` : '—', detail: data ? weatherCodeInfo(data.current.code).label : 'Loading', icon: Sun },
            { label: 'Rain chance', value: data ? `${data.daily[0]?.precipProb ?? 0}%` : '—', detail: 'Today', icon: CloudRain },
            { label: 'Humidity', value: data ? `${data.current.humidity}%` : '—', detail: 'Current', icon: Droplets },
            { label: 'Wind', value: data ? `${data.current.windKmh} km/h` : '—', detail: 'Current', icon: Wind },
          ].map(({ label, value, detail, icon: Icon }) => <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><Icon size={18} className="text-primary" /><p className="mt-5 text-xs text-muted-foreground">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>)}
        </section>
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">7-day outlook</h2><p className="mt-1 text-xs text-muted-foreground">High, low, conditions, and rain probability.</p></div>{loading && <span className="text-xs text-muted-foreground">Loading…</span>}</div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{(data?.daily ?? []).map((day) => <div key={day.date} className="rounded-xl bg-muted/60 p-4"><p className="text-xs font-medium">{day.label}</p><p className="mt-4 text-lg font-semibold">{day.maxC}° <span className="text-sm font-normal text-muted-foreground">{day.minC}°</span></p><p className="mt-2 text-xs text-muted-foreground">{weatherCodeInfo(day.code).label}</p><p className="mt-3 text-xs text-primary">{day.precipProb}% rain</p></div>)}{!data && !loading && <p className="col-span-full py-8 text-center text-sm text-muted-foreground">Select a location to view a forecast.</p>}</div></section>
      </div>
    </main>
  )
}
