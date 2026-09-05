'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import {
  Activity, ArrowLeft, Bell, ChevronDown, Cloud, CloudRain, Droplets, Gauge, Layers3,
  LocateFixed, Map as MapIcon, Menu, Moon, Navigation, Plus, Minus, Search, Settings2,
  Sparkles, Sun, Thermometer, Wind, X, Zap
} from 'lucide-react'
import { getCurrentPosition, searchLocations } from '@/lib/weather/service'

const stations = [
  { id: 'delhi', city: 'New Delhi', region: 'Delhi, India', temp: 31, condition: 'Mostly clear', humidity: 42, wind: 14, aqi: 86, rain: 4, coords: [77.209, 28.614] as [number, number], icon: Sun, tone: 'sunny' },
  { id: 'mumbai', city: 'Mumbai', region: 'Maharashtra, India', temp: 28, condition: 'Light rain', humidity: 78, wind: 19, aqi: 64, rain: 68, coords: [72.877, 19.076] as [number, number], icon: CloudRain, tone: 'rain' },
  { id: 'bengaluru', city: 'Bengaluru', region: 'Karnataka, India', temp: 24, condition: 'Cloudy', humidity: 68, wind: 11, aqi: 52, rain: 31, coords: [77.594, 12.972] as [number, number], icon: Cloud, tone: 'cloud' },
  { id: 'kolkata', city: 'Kolkata', region: 'West Bengal, India', temp: 29, condition: 'Humid & cloudy', humidity: 81, wind: 9, aqi: 72, rain: 44, coords: [88.363, 22.573] as [number, number], icon: Cloud, tone: 'cloud' },
  { id: 'hyderabad', city: 'Hyderabad', region: 'Telangana, India', temp: 27, condition: 'Partly cloudy', humidity: 57, wind: 17, aqi: 48, rain: 18, coords: [78.486, 17.385] as [number, number], icon: Sun, tone: 'sunny' },
]

const layerOptions = [
  { id: 'temperature', label: 'Temperature', color: '#ff7657', icon: Thermometer },
  { id: 'precipitation', label: 'Precipitation', color: '#5b8def', icon: Droplets },
  { id: 'wind', label: 'Wind speed', color: '#48b9b1', icon: Wind },
  { id: 'clouds', label: 'Cloud cover', color: '#8b7cf6', icon: Cloud },
]

function MapCanvas({ selected, setSelected, layer, mapRef }: { selected: typeof stations[number], setSelected: (s: typeof stations[number]) => void, layer: string, mapRef: React.MutableRefObject<maplibregl.Map | null> }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      center: [79.5, 22.8], zoom: 4.25,
      attributionControl: false,
      style: { version: 8, sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' } }, layers: [{ id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-opacity': 0.55 } }] }
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    stations.forEach((station) => {
      const el = document.createElement('button')
      el.className = `map-marker ${station.id === selected.id ? 'is-selected' : ''} marker-${station.tone}`
      el.style.cssText = 'display:grid;place-items:center;min-width:38px;height:32px;padding:0 8px;border-radius:9999px;border:2px solid #fff;background:#0d9488;color:#fff;font-weight:600;font-size:12px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)'
      el.setAttribute('aria-label', `${station.city}, ${station.temp} degrees`)
      el.innerHTML = `<span>${station.temp}°</span>`
      el.onclick = () => setSelected(station)
      new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(station.coords).addTo(map)
    })
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [setSelected, selected.id, mapRef])

  return <div className="relative overflow-hidden rounded-2xl border border-border"><div ref={ref} className="h-[520px] w-full" /><div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-xs text-muted-foreground shadow-sm"><Layers3 className="size-3.5" /> {layerOptions.find((x) => x.id === layer)?.label}</div></div>
}

function Sidebar({ selected, setSelected, onAdd }: { selected: typeof stations[number], setSelected: (s: typeof stations[number]) => void, onAdd: () => void }) {
  return <aside className="flex w-full flex-col rounded-2xl border border-border bg-card lg:w-72 lg:shrink-0">
    <div className="flex items-center justify-between border-b border-border/70 px-5 py-4"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live conditions</p><h2 className="text-lg font-semibold tracking-tight">Your locations</h2></div><button onClick={onAdd} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Add location"><Plus className="size-4" /></button></div>
    <div className="flex flex-col gap-1 p-3">{stations.slice(0, 4).map((s) => { const Icon = s.icon; return <button key={s.id} onClick={() => setSelected(s)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${selected.id === s.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}><span className="rounded-lg bg-muted p-2"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><strong className="block text-sm font-medium">{s.city}</strong><small className="block text-xs text-muted-foreground">{s.condition}</small></span><span className="text-lg font-semibold tabular-nums">{s.temp}°</span></button> })}</div>
    <div className="mt-auto border-t border-border/70 p-5"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="inline-block size-2 rounded-full bg-primary" /> Updated just now</div><p className="mt-3 text-xs leading-5 text-muted-foreground">Mausam AI blends satellite data, local sensors, and predictive intelligence for a clearer picture of what&apos;s ahead.</p></div>
  </aside>
}

export default function Page() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState(stations[0])
  const [layer, setLayer] = useState('temperature')
  const [search, setSearch] = useState('')
  const [time, setTime] = useState('Now')
  const [showLayers, setShowLayers] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [locating, setLocating] = useState(false)
  const mapRef = useRef<maplibregl.Map | null>(null)

  useEffect(() => setMounted(true), [])
  const isDark = mounted ? resolvedTheme === 'dark' : false
  const Icon = selected.icon

  function flyTo(coords: [number, number], zoom = 7) {
    mapRef.current?.flyTo({ center: coords, zoom, speed: 1.2 })
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = search.trim()
    if (!q) return
    const match = stations.find((s) => s.city.toLowerCase().includes(q.toLowerCase()))
    if (match) {
      setSelected(match)
      flyTo(match.coords)
      return
    }
    try {
      const results = await searchLocations(q)
      if (results[0]) {
        flyTo([results[0].longitude, results[0].latitude])
        toast.success(`Showing ${results[0].name}${results[0].country ? `, ${results[0].country}` : ''}.`)
      } else {
        toast.error(`No place found for "${q}".`)
      }
    } catch {
      toast.error('Search is unavailable right now. Please try again.')
    }
  }

  async function locateMe() {
    setLocating(true)
    try {
      const pos = await getCurrentPosition()
      flyTo([pos.coords.longitude, pos.coords.latitude], 9)
      toast.success('Centered on your current location.')
    } catch (err: any) {
      if (err?.code === 1) toast.error('Location permission denied. Enable it in your browser settings.')
      else toast.error('We could not get your location.')
    } finally {
      setLocating(false)
    }
  }

  return <main className="min-h-screen bg-background text-foreground">
    <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" aria-label="Back to dashboard" className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground"><ArrowLeft className="size-4" /></Link>
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight"><span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Zap className="size-4 fill-current" /></span>Mausam <span className="text-primary">AI</span></Link>
      </div>
      <nav className="hidden items-center gap-1 md:flex"><span className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-sm font-medium"><MapIcon className="size-4" /> Intelligence</span><Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Activity className="size-4" /> Dashboard</Link><Link href="/alerts" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Bell className="size-4" /> Alerts</Link></nav>
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button>
        <Link href="/user-profile-and-setting" aria-label="Open profile" className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold">AK</Link>
      </div>
    </header>

    <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-6 md:px-8 lg:flex-row">
      <Sidebar selected={selected} setSelected={setSelected} onAdd={locateMe} />
      <section className="min-w-0 flex-1">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">India · Weather map</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Weather intelligence, <span className="text-primary">simplified.</span></h1></div>
          <form onSubmit={handleSearch} className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search a city or region" aria-label="Search a city or region" className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-9 text-sm outline-none ring-primary transition focus:ring-2" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}</form>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">{['Now', 'Today', '7 days'].map((t) => <button key={t} onClick={() => setTime(t)} className={`rounded-md px-3 py-1.5 text-sm ${time === t ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>)}</div>
          <div className="relative flex items-center gap-2"><button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted" onClick={() => setShowLayers(!showLayers)}><Layers3 className="size-4" /> Layers <ChevronDown className="size-3.5" /></button>{showLayers && <div className="absolute right-0 top-11 z-10 w-44 rounded-xl border border-border bg-card p-1 shadow-lg">{layerOptions.map((item) => { const L = item.icon; return <button key={item.id} onClick={() => { setLayer(item.id); setShowLayers(false) }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${layer === item.id ? 'bg-muted font-medium' : 'hover:bg-muted'}`}><L className="size-4" style={{ color: item.color }} />{item.label}</button> })}</div>}<button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted" onClick={locateMe} disabled={locating}><LocateFixed className="size-4" /> {locating ? 'Locating…' : 'Locate me'}</button></div>
        </div>

        <div className="relative">
          <MapCanvas selected={selected} setSelected={setSelected} layer={layer} mapRef={mapRef} />
          <div className="absolute right-3 top-3 z-[1] flex flex-col gap-1"><button aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()} className="grid size-9 place-items-center rounded-lg border border-border bg-card shadow-sm hover:bg-muted"><Plus className="size-4" /></button><button aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()} className="grid size-9 place-items-center rounded-lg border border-border bg-card shadow-sm hover:bg-muted"><Minus className="size-4" /></button><button aria-label="Recenter map" onClick={() => flyTo(selected.coords, 6)} className="grid size-9 place-items-center rounded-lg border border-border bg-card shadow-sm hover:bg-muted"><Navigation className="size-4" /></button></div>
          {showDetails && <div className="absolute bottom-4 left-4 w-[280px] rounded-2xl border border-border bg-card/95 p-5 shadow-xl backdrop-blur"><button className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted" onClick={() => setShowDetails(false)} aria-label="Close station details"><X className="size-3.5" /></button><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Selected station</p><div className="mt-2 flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold">{selected.city}</h3><p className="text-xs text-muted-foreground">{selected.region}</p></div><span className="rounded-xl bg-muted p-2 text-primary"><Icon className="size-7" /></span></div><div className="mt-3 flex items-end gap-2"><strong className="text-3xl font-semibold">{selected.temp}°</strong><span className="mb-1 text-xs text-muted-foreground">Feels like {selected.temp + 1}°</span></div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><span className="flex flex-col items-center gap-1 rounded-lg bg-muted p-2"><Droplets className="size-4 text-primary" /> {selected.humidity}%<small className="text-muted-foreground">Humidity</small></span><span className="flex flex-col items-center gap-1 rounded-lg bg-muted p-2"><Wind className="size-4 text-primary" /> {selected.wind}<small className="text-muted-foreground">Wind</small></span><span className="flex flex-col items-center gap-1 rounded-lg bg-muted p-2"><Gauge className="size-4 text-primary" /> {selected.aqi}<small className="text-muted-foreground">AQI</small></span></div></div>}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5"><span className="rounded-lg bg-primary/10 p-2 text-primary"><Sparkles className="size-4" /></span><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mausam insight</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Clear skies through the evening for {selected.city}. Air quality is <strong className="text-foreground">moderate</strong> — a good time for an outdoor walk before 8 PM.</p></div></div>
          <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Next 6 hours</p><p className="text-sm font-semibold">Rain probability</p></div><CloudRain className="size-5 text-primary" /></div><div className="mt-4 flex items-end justify-between gap-2">{[12, 18, 22, 38, 27, 16].map((n, i) => <span key={i} className="flex flex-1 flex-col items-center gap-1"><span className="w-full rounded-t bg-primary/70" style={{ height: `${n * 1.5}px` }} /><small className="text-[10px] text-muted-foreground">{['Now', '14h', '15h', '16h', '17h', '18h'][i]}</small></span>)}</div></div>
        </div>
      </section>
    </div>
  </main>
}
