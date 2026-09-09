'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Activity, ArrowLeft, Bell, Cloud, Droplets, Layers3, LocateFixed, Map as MapIcon, Moon, Navigation, Plus, Minus, Search, Sun, Thermometer, Wind, X, Zap } from 'lucide-react'
import { getCurrentPosition, reverseGeocode, searchLocations, weatherCodeInfo, type GeoLocation } from '@/lib/weather/service'
import { useLocations } from '@/lib/weather/use-locations'
import { useWeather } from '@/lib/weather/use-weather'

const layers = [
  { id: 'precipitation', label: 'Precipitation', icon: Droplets, note: 'Open-Meteo precipitation probability and volume' },
  { id: 'wind', label: 'Wind', icon: Wind, note: 'Open-Meteo wind speed and direction' },
  { id: 'clouds', label: 'Cloud cover', icon: Cloud, note: 'Open-Meteo cloud telemetry' },
] as const

function WeatherIcon({ code, isDay = true }: { code: number; isDay?: boolean }) {
  const kind = weatherCodeInfo(code).icon
  if (kind === 'rain') return <Droplets size={25} />
  if (kind === 'cloud') return <Cloud size={25} />
  return isDay ? <Sun size={25} /> : <Moon size={25} />
}

function LiveMap({ location, layer, onReady }: { location?: GeoLocation; layer: string; onReady: (map: maplibregl.Map) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const instance = useRef<maplibregl.Map | null>(null)
  useEffect(() => {
    if (!ref.current) return
    const map = new maplibregl.Map({ container: ref.current, center: location ? [location.longitude, location.latitude] : [78.9629, 22.5937], zoom: location ? 8 : 4.2, attributionControl: false, style: { version: 8, sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' } }, layers: [{ id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-opacity': 0.65 } }] } })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.on('load', () => { instance.current = map; onReady(map) })
    return () => { instance.current = null; map.remove() }
  }, [onReady])
  useEffect(() => {
    if (location && instance.current) instance.current.flyTo({ center: [location.longitude, location.latitude], zoom: 8, speed: 1.1 })
  }, [location])
  return <div className="relative overflow-hidden rounded-2xl border border-border"><div ref={(node) => { ref.current = node }} className="h-[520px] w-full" /><div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-sm"><Layers3 className="mr-1 inline size-3.5 text-primary" /> {layers.find((item) => item.id === layer)?.label} data</div></div>
}

export default function MapPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const { active, addLocation } = useLocations()
  const { data, loading, error, refresh } = useWeather(active?.latitude, active?.longitude)
  const [search, setSearch] = useState('')
  const [layer, setLayer] = useState('precipitation')
  const [locating, setLocating] = useState(false)
  const [showLayers, setShowLayers] = useState(false)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const isDark = resolvedTheme === 'dark'
  const current = data?.current

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    if (!search.trim()) return
    try {
      const result = (await searchLocations(search))[0]
      if (!result) return toast.error(`No place found for “${search.trim()}”.`)
      addLocation(result, true)
      setSearch('')
      toast.success(`Showing ${result.name}.`)
    } catch { toast.error('Search is unavailable right now.') }
  }

  async function locateMe() {
    setLocating(true)
    try {
      const position = await getCurrentPosition()
      const loc = await reverseGeocode(position.coords.latitude, position.coords.longitude)
      addLocation(loc, true)
      toast.success(`Located you in ${loc.name}.`)
    } catch (err: any) {
      toast.error(err?.code === 1 ? 'Location permission denied.' : err?.code === 2 ? 'Location is unavailable.' : err?.code === 3 ? 'Location request timed out.' : 'We could not resolve your location.')
    } finally { setLocating(false) }
  }

  return <main className="min-h-screen bg-background text-foreground"><header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-8"><div className="flex items-center gap-3"><Link href="/dashboard" aria-label="Back to dashboard" className="rounded-lg p-2 hover:bg-muted"><ArrowLeft size={18} /></Link><Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Zap size={15} /></span>Mausam <span className="text-primary">AI</span></Link></div><nav className="hidden items-center gap-1 md:flex"><span className="rounded-lg bg-muted px-3 py-2 text-sm font-medium"><MapIcon className="mr-1 inline size-4" /> Intelligence</span><Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Activity className="mr-1 inline size-4" /> Dashboard</Link><Link href="/alerts" className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Bell className="mr-1 inline size-4" /> Alerts</Link></nav><div className="flex items-center gap-2"><button onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Toggle theme" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">{isDark ? <Sun size={17} /> : <Moon size={17} />}</button></div></header><div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8"><div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Live weather map</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Weather intelligence, <span className="text-primary">connected.</span></h1><p className="mt-2 text-sm text-muted-foreground">{active ? `${active.name}${active.region ? `, ${active.region}` : ''}` : 'Search for a location to begin'}</p></div><form onSubmit={handleSearch} className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search any city, district, or town" aria-label="Search any city, district, or town" className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary" /></form></div><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{layers.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setLayer(item.id)} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm ${layer === item.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'}`}><Icon size={16} />{item.label}</button> })}</div><button onClick={locateMe} disabled={locating} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"><LocateFixed size={16} />{locating ? 'Locating…' : 'Locate me'}</button></div><div className="grid gap-5 lg:grid-cols-[1fr_300px]"><div><LiveMap location={active} layer={layer} onReady={(map) => { mapRef.current = map }} /><div className="mt-3 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground"><strong className="text-foreground">{layers.find((item) => item.id === layer)?.label}:</strong> {layers.find((item) => item.id === layer)?.note}. No fabricated tiles or animation is used; the map remains a truthful basemap with live telemetry.</div></div><aside className="rounded-2xl border border-border bg-card p-5"><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Information station</p>{!active ? <p className="mt-5 text-sm text-muted-foreground">Search or locate yourself to load live station telemetry.</p> : <><div className="mt-3 flex items-start justify-between"><div><h2 className="text-xl font-semibold">{active.name}</h2><p className="text-xs text-muted-foreground">{active.region}, {active.country}</p></div><span className="rounded-xl bg-primary/10 p-2 text-primary"><WeatherIcon code={current?.code ?? 0} isDay={current?.isDay} /></span></div>{loading && !data ? <p className="mt-8 text-sm text-muted-foreground">Loading live telemetry…</p> : error && !data ? <div className="mt-6 text-sm text-destructive">{error}<button onClick={refresh} className="mt-3 block rounded-lg border border-destructive/30 px-3 py-1.5">Retry</button></div> : current && <><p className="mt-5 text-4xl font-semibold">{current.tempC}°<span className="ml-2 text-sm font-normal text-muted-foreground">feels like {current.apparentC}°</span></p><p className="mt-1 text-sm text-muted-foreground">{weatherCodeInfo(current.code).label}</p><div className="mt-5 grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-muted p-3"><Droplets size={15} className="text-primary" />{current.humidity}%<span className="block text-muted-foreground">Humidity</span></div><div className="rounded-xl bg-muted p-3"><Wind size={15} className="text-primary" />{current.windKmh} km/h<span className="block text-muted-foreground">Wind</span></div><div className="rounded-xl bg-muted p-3"><Thermometer size={15} className="text-primary" />{current.precipitation} mm<span className="block text-muted-foreground">Precipitation</span></div><div className="rounded-xl bg-muted p-3"><Cloud size={15} className="text-primary" />{data?.airQuality.usAqi ?? '—'}<span className="block text-muted-foreground">AQI</span></div></div></>}</>}</aside></div></div></main>
}
