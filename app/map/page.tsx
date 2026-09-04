'use client'
import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  Activity, Bell, CalendarDays, ChevronDown, Cloud, CloudRain, Droplets, Gauge, Layers3,
  LocateFixed, Map as MapIcon, Menu, Moon, Navigation, Plus, Minus, Search, Settings2,
  Sparkles, Sun, Thermometer, Wind, X, Zap
} from 'lucide-react'
import dynamic from 'next/dynamic'

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

function MapCanvas({ selected, setSelected, layer }: { selected: typeof stations[number], setSelected: (s: typeof stations[number]) => void, layer: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  useEffect(() => {
    if (!ref.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      center: [79.5, 22.8], zoom: 4.25,
      attributionControl: false,
      style: { version: 8, sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' } }, layers: [{ id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-opacity': 0.16, 'raster-saturation': -0.55 } }] }
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    stations.forEach((station) => {
      const el = document.createElement('button')
      el.className = `map-marker ${station.id === selected.id ? 'is-selected' : ''} marker-${station.tone}`
      el.setAttribute('aria-label', `${station.city}, ${station.temp} degrees`)
      el.innerHTML = `<span>${station.temp}°</span>`
      el.onclick = () => setSelected(station)
      new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(station.coords).addTo(map)
    })
    mapRef.current = map
    return () => map.remove()
  }, [setSelected, selected.id])

  return <div className={`map-shell layer-${layer}`}><div ref={ref} className="h-500px w-100%" /><div className="map-fade" /><div className="wind-lines" aria-hidden="true"><i /><i /><i /></div><div className="map-layer-name"><Layers3 className="size-3.5" /> {layerOptions.find((x) => x.id === layer)?.label}</div></div>
}

function Sidebar({ selected, setSelected }: { selected: typeof stations[number], setSelected: (s: typeof stations[number]) => void }) {
  return <aside className="sidebar-panel">
    <div className="flex items-center justify-between border-b border-border/70 px-5 py-4"><div><p className="eyebrow">Live conditions</p><h2 className="text-lg font-semibold tracking-tight">Your locations</h2></div><button className="icon-button" aria-label="Add location"><Plus className="size-4" /></button></div>
    <div className="p-3">{stations.slice(0, 4).map((s) => { const Icon = s.icon; return <button key={s.id} onClick={() => setSelected(s)} className={`location-row ${selected.id === s.id ? 'active' : ''}`}><span className={`weather-icon icon-${s.tone}`}><Icon className="size-4" /></span><span className="min-w-0 flex-1 text-left"><strong>{s.city}</strong><small>{s.condition}</small></span><span className="text-lg font-semibold tabular-nums">{s.temp}°</span></button> })}</div>
    <div className="mt-auto border-t border-border/70 p-5"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="live-dot" /> Updated just now</div><p className="mt-3 text-xs leading-5 text-muted-foreground">Mausam AI blends satellite data, local sensors, and predictive intelligence for a clearer picture of what&apos;s ahead.</p></div>
  </aside>
}

export default function Page() {
  const [selected, setSelected] = useState(stations[0])
  const [layer, setLayer] = useState('temperature')
  const [search, setSearch] = useState('')
  const [dark, setDark] = useState(false)
  const [time, setTime] = useState('Now')
  const [showLayers, setShowLayers] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const Icon = selected.icon
  return <main className="mausam-app">
    <header className="topbar"><div className="brand"><span className="brand-mark"><Zap className="size-4 fill-current" /></span><span>Mausam <em>AI</em></span></div><nav className="topnav"><button className="nav-item active"><MapIcon className="size-4" /> Intelligence</button><button className="nav-item"><Activity className="size-4" /> Analytics</button><button className="nav-item"><Bell className="size-4" /> Alerts <span className="alert-count">3</span></button></nav><div className="top-actions"><button className="icon-button mobile-menu" aria-label="Open menu"><Menu className="size-5" /></button><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle color theme">{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button><button className="avatar" aria-label="Open profile">AK</button></div></header>
    <div className="workspace"><Sidebar selected={selected} setSelected={setSelected} /><section className="main-stage"><div className="stage-header"><div><p className="eyebrow">Friday, September 4, 2026 · India</p><h1>Weather intelligence, <span>simplified.</span></h1></div><div className="search-wrap"><Search className="size-4" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search a city or region" aria-label="Search a city or region" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X className="size-3.5" /></button>}</div></div>
      <div className="toolbar"><div className="segmented">{['Now', 'Today', '7 days'].map((t) => <button key={t} onClick={() => setTime(t)} className={time === t ? 'selected' : ''}>{t}</button>)}</div><div className="toolbar-actions"><button className="control-button" onClick={() => setShowLayers(!showLayers)}><Layers3 className="size-4" /> Layers <ChevronDown className="size-3.5" /></button>{showLayers && <div className="layer-popover">{layerOptions.map((item) => { const L = item.icon; return <button key={item.id} onClick={() => { setLayer(item.id); setShowLayers(false) }} className={layer === item.id ? 'active' : ''}><L className="size-4" style={{ color: item.color }} />{item.label}</button> })}</div>}<button className="control-button"><Settings2 className="size-4" /> Map style</button><button className="control-button"><LocateFixed className="size-4" /> Locate me</button></div></div>
      <div className="map-card"><MapCanvas selected={selected} setSelected={setSelected} layer={layer} /><div className="map-tools"><button aria-label="Zoom in"><Plus className="size-4" /></button><button aria-label="Zoom out"><Minus className="size-4" /></button><button aria-label="Recenter map"><Navigation className="size-4" /></button></div><div className="map-legend"><span><i className="legend-hot" /> Warm</span><span><i className="legend-mild" /> Mild</span><span><i className="legend-cool" /> Cool</span></div>{showDetails && <div className="station-card"><button className="close-card" onClick={() => setShowDetails(false)} aria-label="Close station details"><X className="size-3.5" /></button><p className="eyebrow">Selected station</p><div className="flex items-start justify-between gap-4"><div><h3>{selected.city}</h3><p>{selected.region}</p></div><span className={`big-weather-icon icon-${selected.tone}`}><Icon className="size-7" /></span></div><div className="station-temp"><strong>{selected.temp}°</strong><span>Feels like {selected.temp + 1}°</span></div><div className="station-stats"><span><Droplets /> {selected.humidity}%<small>Humidity</small></span><span><Wind /> {selected.wind} km/h<small>Wind</small></span><span><Gauge /> {selected.aqi}<small>AQI</small></span></div><button className="full-report">View full report <ChevronDown className="size-3.5 -rotate-90" /></button></div>}</div>
      <div className="bottom-grid"><div className="insight-card"><div className="insight-icon"><Sparkles className="size-4" /></div><div><p className="eyebrow">Mausam insight</p><p className="insight-copy">Clear skies through the evening. Air quality is <strong>moderate</strong> — a good time for an outdoor walk before 8 PM.</p></div></div><div className="forecast-card"><div className="flex items-center justify-between"><div><p className="eyebrow">Next 6 hours</p><p className="text-sm font-semibold">Rain probability</p></div><CloudRain className="size-5 text-primary" /></div><div className="forecast-bars">{[12, 18, 22, 38, 27, 16].map((n, i) => <span key={i}><i style={{ height: `${n * 1.5}px` }} /><small>{['Now', '14h', '15h', '16h', '17h', '18h'][i]}</small></span>)}</div></div></div>
    </section></div>
  </main>
}
