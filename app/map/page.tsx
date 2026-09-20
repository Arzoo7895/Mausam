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
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { useI18n } from '@/lib/i18n'
import { InternalAppHeader } from '@/components/internal-app-header'

const layerConfigs = [
  { id: 'precipitation', labelKey: 'map.precipLayer', icon: Droplets, noteKey: 'map.precipNote' },
  { id: 'wind', labelKey: 'map.windLayer', icon: Wind, noteKey: 'map.windNote' },
  { id: 'clouds', labelKey: 'map.cloudsLayer', icon: Cloud, noteKey: 'map.cloudsNote' },
] as const

function WeatherIcon({ code, isDay = true }: { code: number; isDay?: boolean }) {
  const kind = weatherCodeInfo(code).icon
  if (kind === 'rain') return <Droplets size={25} />
  if (kind === 'cloud') return <Cloud size={25} />
  return isDay ? <Sun size={25} /> : <Moon size={25} />
}

function LiveMap({ location, layer, layerLabel, onReady }: { location?: GeoLocation; layer: string; layerLabel: string; onReady: (map: maplibregl.Map) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const instance = useRef<maplibregl.Map | null>(null)
  const { t } = useI18n()
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
  return <div className="relative overflow-hidden rounded-2xl border border-border"><div ref={(node) => { ref.current = node }} className="h-[520px] w-full" /><div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-sm"><Layers3 className="mr-1 inline size-3.5 text-primary" /> {t('map.layerData', { layer: layerLabel })}</div></div>
}

export default function MapPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const { active, addLocation } = useLocations()
  const { data, loading, error, refresh } = useWeather(active?.latitude, active?.longitude)
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [layer, setLayer] = useState('precipitation')
  const [locating, setLocating] = useState(false)
  const [showLayers, setShowLayers] = useState(false)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const isDark = resolvedTheme === 'dark'
  const current = data?.current

  const activeLayerConfig = layerConfigs.find((item) => item.id === layer) ?? layerConfigs[0]
  const activeLayerLabel = t(activeLayerConfig.labelKey)
  const activeLayerNote = t(activeLayerConfig.noteKey)

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    if (!search.trim()) return
    try {
      const result = (await searchLocations(search))[0]
      if (!result) return toast.error(t('map.noPlaceFound', { query: search.trim() }))
      addLocation(result, true)
      setSearch('')
      toast.success(t('map.showing', { name: result.name }))
    } catch { toast.error(t('map.searchUnavailable')) }
  }

  async function locateMe() {
    setLocating(true)
    try {
      const position = await getCurrentPosition()
      const loc = await reverseGeocode(position.coords.latitude, position.coords.longitude)
      addLocation(loc, true)
      toast.success(t('map.locatedYou', { name: loc.name }))
    } catch (err: any) {
      toast.error(err?.code === 1 ? t('location.permissionDenied') : err?.code === 2 ? t('location.locationUnavailable') : err?.code === 3 ? t('location.timeout') : t('location.failed'))
    } finally { setLocating(false) }
  }

  return <main className="min-h-screen bg-background text-foreground"><InternalAppHeader backHref="/dashboard" backLabel={t('nav.dashboard')}><span className="rounded-lg bg-muted px-3 py-2 text-sm font-medium"><MapIcon className="mr-1 inline size-4" /> {t('map.intelligenceNav')}</span><Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Activity className="mr-1 inline size-4" /> {t('nav.dashboard')}</Link><Link href="/alerts" className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Bell className="mr-1 inline size-4" /> {t('nav.alerts')}</Link></InternalAppHeader><div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8"><div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-muted-foreground">{t('map.title')}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">{t('map.headline')}</h1><p className="mt-2 text-sm text-muted-foreground">{active ? `${active.name}${active.region ? `, ${active.region}` : ''}` : t('map.searchPrompt')}</p></div><form onSubmit={handleSearch} className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('map.searchPlaceholder')} aria-label={t('map.searchPlaceholder')} className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary" /></form></div><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{layerConfigs.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setLayer(item.id)} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm ${layer === item.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'}`}><Icon size={16} />{t(item.labelKey)}</button> })}</div><button onClick={locateMe} disabled={locating} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"><LocateFixed size={16} />{locating ? t('map.locating') : t('map.locateMe')}</button></div><div className="grid gap-5 lg:grid-cols-[1fr_300px]"><div><LiveMap location={active} layer={layer} layerLabel={activeLayerLabel} onReady={(map) => { mapRef.current = map }} /><div className="mt-3 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground"><strong className="text-foreground">{activeLayerLabel}:</strong> {activeLayerNote}. {t('map.truthfulNotice')}</div></div><aside className="rounded-2xl border border-border bg-card p-5"><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-muted-foreground">{t('map.station')}</p>{!active ? <p className="mt-5 text-sm text-muted-foreground">{t('map.stationPrompt')}</p> : <><div className="mt-3 flex items-start justify-between"><div><h2 className="text-xl font-semibold">{active.name}</h2><p className="text-xs text-muted-foreground">{active.region}, {active.country}</p></div><span className="rounded-xl bg-primary/10 p-2 text-primary"><WeatherIcon code={current?.code ?? 0} isDay={current?.isDay} /></span></div>{loading && !data ? <p className="mt-8 text-sm text-muted-foreground">{t('map.loadingTelemetry')}</p> : error && !data ? <div className="mt-6 text-sm text-destructive">{error}<button onClick={refresh} className="mt-3 block rounded-lg border border-destructive/30 px-3 py-1.5">{t('map.retry')}</button></div> : current && <><p className="mt-5 text-4xl font-semibold">{current.tempC}°<span className="ml-2 text-sm font-normal text-muted-foreground">{t('map.feelsLike', { temp: current.apparentC })}</span></p><p className="mt-1 text-sm text-muted-foreground">{weatherCodeInfo(current.code).label}</p><div className="mt-5 grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-muted p-3"><Droplets size={15} className="text-primary" />{current.humidity}%<span className="block text-muted-foreground">{t('map.humidity')}</span></div><div className="rounded-xl bg-muted p-3"><Wind size={15} className="text-primary" />{current.windKmh} km/h<span className="block text-muted-foreground">{t('map.wind')}</span></div><div className="rounded-xl bg-muted p-3"><Thermometer size={15} className="text-primary" />{current.precipitation} mm<span className="block text-muted-foreground">{t('map.precipitation')}</span></div><div className="rounded-xl bg-muted p-3"><Cloud size={15} className="text-primary" />{data?.airQuality.usAqi ?? '—'}<span className="block text-muted-foreground">{t('map.aqi')}</span></div></div></>}</>}</aside></div></div></main>
}
