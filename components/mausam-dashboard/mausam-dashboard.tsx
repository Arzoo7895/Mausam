'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import AIDailyBrief, { type DailyBriefData } from '@/components/ai-daily-brief/ai-daily-brief'
import { LocationSearchDialog } from '@/components/mausam-dashboard/location-search-dialog'
import {
  ArrowUpRight, Bell, CalendarDays, ChevronDown, Cloud, CloudFog, CloudRain, CloudSnow,
  Droplets, Eye, Gauge, Leaf, Loader2, LocateFixed, MapPin, Menu, Moon, MoreHorizontal,
  Navigation, Plus, Search, Settings2, ShieldAlert, Sun, Sunrise, Thermometer, Umbrella,
  Wind, X,
} from 'lucide-react'
import {
  type GeoLocation, type WeatherData, formatTime, getCurrentPosition, locationKey,
  reverseGeocode, weatherCodeInfo,
} from '@/lib/weather/service'
import { useLocations } from '@/lib/weather/use-locations'
import { useWeather } from '@/lib/weather/use-weather'
import { createRecommendations } from '@/lib/recommendations'

function WeatherIcon({ code = 0, size = 24 }: { code?: number; size?: number }) {
  const { icon } = weatherCodeInfo(code)
  if (icon === 'rain') return <CloudRain size={size} aria-hidden="true" />
  if (icon === 'snow') return <CloudSnow size={size} aria-hidden="true" />
  if (icon === 'fog') return <CloudFog size={size} aria-hidden="true" />
  if (icon === 'cloud') return <Cloud size={size} aria-hidden="true" />
  return <Sun size={size} aria-hidden="true" />
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-border bg-card shadow-[0_8px_30px_-20px_rgba(15,23,42,.35)] ${className}`}>{children}</section>
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function comfortScore(data: WeatherData | null): { score: number; label: string } {
  if (!data) return { score: 0, label: '—' }
  let score = 100
  const t = data.current.apparentC
  score -= Math.min(45, Math.abs(t - 24) * 2.2) // ideal ~24°C
  score -= Math.max(0, data.current.humidity - 60) * 0.4
  score -= Math.max(0, data.uvIndexMax - 5) * 2.5
  if (data.airQuality.usAqi) score -= Math.max(0, data.airQuality.usAqi - 50) * 0.25
  score = Math.max(0, Math.min(100, Math.round(score)))
  const label = score >= 75 ? 'Good' : score >= 50 ? 'Fair' : 'Poor'
  return { score, label }
}

function aqiLabel(aqi?: number): string {
  if (aqi === undefined) return '—'
  if (aqi <= 50) return `${aqi} Good`
  if (aqi <= 100) return `${aqi} Fair`
  if (aqi <= 150) return `${aqi} Poor`
  return `${aqi} Unhealthy`
}

function buildBrief(data: WeatherData): DailyBriefData {
  const recs = createRecommendations({
    weather: {
      temperatureC: data.current.tempC,
      apparentTemperatureC: data.current.apparentC,
      precipitationProbability: data.daily[0]?.precipProb,
      windSpeedKmh: data.current.windKmh,
      uvIndex: data.uvIndexMax,
      weatherCode: data.current.code,
    },
    airQuality: { usAqi: data.airQuality.usAqi, pm25: data.airQuality.pm25 },
  })
  const good = recs.filter((r) => r.severity === 'good' || r.severity === 'info')
  const risks = recs.filter((r) => r.severity === 'warning' || r.severity === 'urgent')
  const condition = weatherCodeInfo(data.current.code).label.toLowerCase()
  const rainDay = data.daily[0]?.precipProb ?? 0
  const summary =
    `It's ${data.current.tempC}° and ${condition}, feeling like ${data.current.apparentC}°. ` +
    (rainDay >= 50
      ? `Rain is likely today (${rainDay}% chance) — keep cover handy.`
      : rainDay >= 25
        ? `There's a ${rainDay}% chance of rain, so a light plan for later helps.`
        : `Low rain chance today, a good window for outdoor plans.`)
  const pick = [data.hourly[0], data.hourly[3], data.hourly[6]].filter(Boolean)
  return {
    summary,
    highlights: good.length ? good.map((r) => r.title) : ['Conditions look manageable today'],
    risks: risks.length ? risks.map((r) => r.title) : ['No major weather risks right now'],
    recommendations: recs.slice(0, 3).map((r) => r.guidance),
    timeline: pick.map((h) => ({
      time: h.label,
      title: weatherCodeInfo(h.code).label,
      detail: `${h.tempC}° · ${h.precipProb}% rain`,
    })),
    confidence: data.airQuality.usAqi ? 94 : 90,
  }
}

export default function MausamDashboard() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menu, setMenu] = useState(false)
  const [alertOpen, setAlertOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')

  const { locations, active, activeKey, addLocation, removeLocation, setActive } = useLocations()
  const { data, loading, error, refresh } = useWeather(active?.latitude, active?.longitude)

  useEffect(() => setMounted(true), [])
  const isDark = mounted ? resolvedTheme === 'dark' : false

  const overviewRef = useRef<HTMLDivElement>(null)
  const insightsRef = useRef<HTMLDivElement>(null)
  const locationsRef = useRef<HTMLDivElement>(null)

  const brief = useMemo(() => (data ? buildBrief(data) : undefined), [data])
  const comfort = comfortScore(data)
  const c = data?.current
  const today = data?.daily[0]

  function goTab(tab: string) {
    setActiveTab(tab)
    setMenu(false)
    const ref = tab === 'Insights' ? insightsRef : tab === 'Locations' ? locationsRef : overviewRef
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSelect(loc: GeoLocation) {
    const res = addLocation(loc, true)
    setSearchOpen(false)
    toast.success(res === 'exists' ? `${loc.name} is already saved — switched to it.` : `Added ${loc.name} to your locations.`)
  }

  async function useMyLocation() {
    setLocating(true)
    try {
      const pos = await getCurrentPosition()
      const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
      const res = addLocation(loc, true)
      toast.success(res === 'exists' ? `${loc.name} is already saved — switched to it.` : `Located you in ${loc.name}.`)
    } catch (err: any) {
      if (err?.code === 1) toast.error('Location permission denied. Enable it in your browser settings to use this.')
      else if (err?.code === 2) toast.error('Your location is unavailable right now. Try again shortly.')
      else if (err?.code === 3) toast.error('Finding your location timed out. Please try again.')
      else if (err?.message === 'unsupported') toast.error('Geolocation is not supported on this device.')
      else toast.error('We could not get your location.')
    } finally {
      setLocating(false)
    }
  }

  const tabs = ['Overview', 'Insights', 'Locations']
  const locationLabel = `${active?.name ?? '—'}${active?.country ? `, ${active.country}` : ''}`
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button aria-label="Open navigation" onClick={() => setMenu(!menu)} className="rounded-lg p-2 hover:bg-muted md:hidden"><Menu size={20} /></button>
            <Link href="/" aria-label="Mausam AI home" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sun size={19} /></div>
              <div><p className="font-semibold tracking-tight">Mausam <span className="text-primary">AI</span></p><p className="hidden text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground sm:block">Weather intelligence</p></div>
            </Link>
          </div>
          <div className="hidden items-center gap-1 rounded-xl border border-border bg-card p-1 md:flex">
            {tabs.map((item) => <button key={item} onClick={() => goTab(item)} className={`rounded-lg px-4 py-2 text-sm transition-colors ${activeTab === item ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'}`}>{item}</button>)}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Search locations" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Search size={18} /></button>
            <button aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} onClick={() => setTheme(isDark ? 'light' : 'dark')} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <Link href="/alerts" aria-label="Notifications and alerts" className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" /></Link>
            <Link href="/user-profile-and-setting" aria-label="Profile and settings" className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold sm:flex">AS</Link>
          </div>
        </div>
        {menu && <div className="border-t border-border px-4 py-3 md:hidden"><div className="flex gap-2">{tabs.map((x) => <button key={x} onClick={() => goTab(x)} className={`rounded-lg px-3 py-2 text-sm ${activeTab === x ? 'bg-muted font-medium' : 'bg-muted/40'}`}>{x}</button>)}</div></div>}
      </header>

      <div ref={overviewRef} className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} className="text-primary" /> {locationLabel} {loading && <Loader2 size={13} className="animate-spin" />}</p>
            <h1 className="text-3xl font-semibold tracking-[-.04em] md:text-4xl">{greeting()}, Ananya</h1>
            <p className="mt-2 text-sm text-muted-foreground">{dateLabel}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSearchOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted"><Plus size={16} /> Add location</button>
            <button onClick={useMyLocation} disabled={locating} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">{locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />} {locating ? 'Locating…' : 'Use my location'}</button>
          </div>
        </div>

        {alertOpen && today && today.precipProb >= 40 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/8 px-4 py-3">
            <div className="flex items-center gap-3"><div className="rounded-lg bg-primary/15 p-2 text-primary"><ShieldAlert size={18} /></div><p className="text-sm"><strong>Rain watch:</strong> {today.precipProb}% chance of rain in {active?.name} today. <Link href="/alerts" className="font-medium text-primary underline-offset-2 hover:underline">View alerts</Link></p></div>
            <button aria-label="Dismiss alert" onClick={() => setAlertOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={17} /></button>
          </motion.div>
        )}

        {error && !data && (
          <div role="alert" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>
            <button onClick={refresh} className="rounded-lg border border-destructive/30 px-3 py-1.5 font-medium hover:bg-destructive/10">Retry</button>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <Card className="relative overflow-hidden bg-primary text-primary-foreground"><div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.25),transparent_35%)]" /><div className="relative flex h-full min-h-[250px] flex-col justify-between p-6 md:p-8"><div className="flex items-start justify-between"><div><p className="text-sm text-primary-foreground/70">Current conditions</p><div className="mt-4 flex items-start gap-3"><span className="text-7xl font-semibold tracking-[-.08em]">{c ? `${c.tempC}°` : '—'}</span><span className="mt-3 text-sm text-primary-foreground/75">{c ? `Feels like ${c.apparentC}°` : 'Loading…'}</span></div><p className="mt-2 text-lg">{c ? weatherCodeInfo(c.code).label : ' '}</p></div><WeatherIcon code={c?.code ?? 0} size={62} /></div><div className="flex flex-wrap gap-5 border-t border-primary-foreground/15 pt-4 text-sm"><span className="flex items-center gap-2"><Wind size={15} /> {c ? `${c.windKmh} km/h` : '—'}</span><span className="flex items-center gap-2"><Droplets size={15} /> {c ? `${c.humidity}% humidity` : '—'}</span><span className="flex items-center gap-2"><Eye size={15} /> {c ? `${c.visibilityKm} km visibility` : '—'}</span></div></div></Card>
          <div ref={insightsRef}>
            <AIDailyBrief data={brief} loading={loading && !data} error={error && !data ? error : null} onRefresh={refresh} updatedAt="just now" />
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
          <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-border px-6 py-5"><div><h2 className="font-semibold">Today&apos;s timeline</h2><p className="mt-1 text-xs text-muted-foreground">Temperature &amp; conditions</p></div><Link href="/map" aria-label="Open weather map" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><MoreHorizontal size={18} /></Link></div><div className="overflow-x-auto"><div className="flex min-w-[700px] divide-x divide-border px-2 py-5">{(data?.hourly ?? []).map((h, i) => <div key={h.time} className={`flex min-w-[77px] flex-1 flex-col items-center gap-3 px-3 text-center ${i === 0 ? 'text-primary' : ''}`}><span className="text-xs font-medium">{h.label}</span><WeatherIcon code={h.code} size={i === 0 ? 26 : 22} /><span className="text-sm font-semibold">{h.tempC}°</span><span className="text-[10px] text-muted-foreground">{weatherCodeInfo(h.code).label}</span></div>)}{!data && <div className="flex flex-1 items-center justify-center px-6 py-6 text-sm text-muted-foreground">{loading ? 'Loading hourly forecast…' : 'No forecast available.'}</div>}</div></div></Card>
          <Card className="p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Live radar</h2><p className="mt-1 text-xs text-muted-foreground">Precipitation · {active?.name}</p></div><Link href="/map" aria-label="Expand map" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowUpRight size={17} /></Link></div><Link href="/map" className="relative mt-5 block h-40 overflow-hidden rounded-xl border border-border bg-secondary"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(35deg, transparent 48%, var(--primary) 49%, transparent 51%), linear-gradient(110deg, transparent 47%, var(--border) 48%, transparent 50%)', backgroundSize: '65px 65px' }} /><div className="absolute left-[48%] top-[43%] h-3 w-3 rounded-full border-2 border-background bg-primary shadow-[0_0_0_6px_rgba(20,184,166,.2)]" /><span className="absolute left-[52%] top-[53%] rounded-md bg-card px-2 py-1 text-[10px] font-medium shadow-sm">{active?.name}</span><div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-[10px] text-muted-foreground"><Navigation size={11} className="text-primary" /> Open full map</div></Link></Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          <Card className="p-6 lg:col-span-2"><div className="flex items-center justify-between"><div><h2 className="font-semibold">7-day forecast</h2><p className="mt-1 text-xs text-muted-foreground">Plan ahead with confidence</p></div><Link href="/map" className="flex items-center gap-1 text-xs font-medium text-primary">Full forecast <ArrowUpRight size={14} /></Link></div><div className="mt-5 grid grid-cols-7 gap-1">{(data?.daily ?? []).map((d, i) => <div key={d.date} className={`flex flex-col items-center gap-3 rounded-xl px-1 py-3 ${i === 0 ? 'bg-muted' : ''}`}><span className="text-xs font-medium">{d.label}</span><WeatherIcon code={d.code} size={20} /><span className="text-sm font-semibold">{d.maxC}°</span><span className="text-xs text-muted-foreground">{d.minC}°</span><span className="text-[10px] text-primary">{d.precipProb}%</span></div>)}{!data && <div className="col-span-7 py-6 text-center text-sm text-muted-foreground">{loading ? 'Loading forecast…' : 'No forecast available.'}</div>}</div></Card>
          <Card className="p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">Comfort index</h2><Gauge size={18} className="text-primary" /></div><div className="mt-5 flex items-end gap-3"><span className="text-4xl font-semibold tracking-tight">{data ? comfort.score : '—'}</span><span className="mb-1 text-sm text-muted-foreground">/ 100 · {comfort.label}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${data ? comfort.score : 0}%` }} /></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs"><span className="text-muted-foreground">UV index <strong className="ml-1 text-foreground">{data ? data.uvIndexMax : '—'}</strong></span><span className="text-muted-foreground">AQI <strong className="ml-1 text-foreground">{aqiLabel(data?.airQuality.usAqi)}</strong></span></div></Card>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Card className="p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Umbrella size={17} /></div><div><h3 className="text-sm font-semibold">Rain outlook</h3><p className="text-xs text-muted-foreground">Chance of rain today</p></div></div><p className="mt-4 text-2xl font-semibold">{today ? `${today.precipProb}%` : '—'}</p><p className="mt-1 text-xs text-muted-foreground">{today ? (today.precipProb >= 50 ? 'Carry rain protection' : 'Mostly dry conditions') : 'Loading…'}</p></Card>
          <Card className="p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Leaf size={17} /></div><div><h3 className="text-sm font-semibold">Outdoor score</h3><p className="text-xs text-muted-foreground">Based on comfort &amp; air</p></div></div><p className="mt-4 text-2xl font-semibold">{data ? (comfort.score / 10).toFixed(1) : '—'} <span className="text-sm font-normal text-muted-foreground">/ 10</span></p><p className="mt-1 text-xs text-muted-foreground">{data ? (comfort.score >= 70 ? 'Great for a walk' : 'Plan around conditions') : 'Loading…'}</p></Card>
          <Card className="p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Sunrise size={17} /></div><div><h3 className="text-sm font-semibold">Sunrise &amp; sunset</h3><p className="text-xs text-muted-foreground">Daylight for {active?.name}</p></div></div><p className="mt-4 text-2xl font-semibold">{formatTime(data?.sunrise ?? '')}</p><p className="mt-1 text-xs text-muted-foreground">Sunset {formatTime(data?.sunset ?? '')}</p></Card>
        </div>

        <div ref={locationsRef} className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card className="p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Saved locations</h2><p className="mt-1 text-xs text-muted-foreground">Your cities at a glance</p></div><button aria-label="Add saved location" onClick={() => setSearchOpen(true)} className="rounded-lg p-2 text-primary hover:bg-muted"><Plus size={17} /></button></div><div className="mt-4 flex flex-wrap gap-2">{locations.map((loc) => { const key = locationKey(loc); const isActive = key === activeKey; return <span key={key} className={`group flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${isActive ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border hover:bg-muted'}`}><button onClick={() => setActive(key)} className="flex items-center gap-2"><MapPin size={14} />{loc.name}</button>{locations.length > 1 && <button onClick={() => removeLocation(key)} aria-label={`Remove ${loc.name}`} className="ml-0.5 rounded-md p-0.5 text-muted-foreground opacity-60 hover:bg-background/60 hover:text-foreground group-hover:opacity-100"><X size={13} /></button>}</span> })}</div></Card>
          <Card className="p-6"><div><h2 className="font-semibold">Quick actions</h2><p className="mt-1 text-xs text-muted-foreground">Make your forecast work for you</p></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><Link href="/map" className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-xs hover:bg-muted"><CalendarDays size={18} className="text-primary" /> Plan trip</Link><Link href="/alerts" className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-xs hover:bg-muted"><Bell size={18} className="text-primary" /> Set alert</Link><Link href="/map" className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-xs hover:bg-muted"><Thermometer size={18} className="text-primary" /> Compare</Link><Link href="/alerts" className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-xs hover:bg-muted"><Wind size={18} className="text-primary" /> Air quality</Link></div></Card>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>Data from Open-Meteo · Location services enabled</p><div className="flex items-center gap-4"><Link href="/user-profile-and-setting" className="hover:text-foreground"><Settings2 size={13} className="mr-1 inline" /> Preferences</Link><Link href="/help-center/categories/privacy-security" className="hover:text-foreground">Privacy</Link></div></div>
      </div>

      <LocationSearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={handleSelect} />
    </main>
  )
}
