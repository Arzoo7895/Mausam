'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import  AIDailyBrief  from '@/components/ai-daily-brief/ai-daily-brief'
import {
  ArrowUpRight, Bell, CalendarDays, ChevronDown, CloudRain, Droplets, Eye,
  Gauge, Leaf, LocateFixed, MapPin, Menu, Moon, MoreHorizontal, Navigation,
  Plus, Search, Settings2, ShieldAlert, Sun, Sunrise, Thermometer, Umbrella,
  Wind, X
} from 'lucide-react'

const hourly = [
  ['Now', '28°', 'sun'], ['11 AM', '29°', 'sun'], ['12 PM', '30°', 'sun'],
  ['1 PM', '31°', 'sun'], ['2 PM', '31°', 'cloud'], ['3 PM', '30°', 'cloud'],
  ['4 PM', '29°', 'rain'], ['5 PM', '28°', 'rain'], ['6 PM', '27°', 'rain']
]
const week = [
  ['Today', '28°', '20°', 'sun', '10%'], ['Tue', '29°', '21°', 'cloud', '20%'],
  ['Wed', '27°', '20°', 'rain', '65%'], ['Thu', '26°', '19°', 'rain', '70%'],
  ['Fri', '28°', '20°', 'sun', '15%'], ['Sat', '29°', '21°', 'sun', '10%'], ['Sun', '30°', '22°', 'cloud', '25%']
]

function WeatherIcon({ type = 'sun', size = 24 }: { type?: string; size?: number }) {
  if (type === 'rain') return <CloudRain size={size} aria-hidden="true" />
  if (type === 'cloud') return <CloudRain size={size} aria-hidden="true" className="opacity-60" />
  return <Sun size={size} aria-hidden="true" />
}
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-border bg-card shadow-[0_8px_30px_-20px_rgba(15,23,42,.35)] ${className}`}>{children}</section>
}

export default function MausamDashboard() {
  const [dark, setDark] = useState(false)
  const [menu, setMenu] = useState(false)
  const [location, setLocation] = useState('New Delhi')
  const [saved, setSaved] = useState(['New Delhi', 'Bengaluru', 'Mumbai'])
  const [alert, setAlert] = useState(true)

  return (
    <div className={dark ? 'dark min-h-screen' : 'min-h-screen'}>
      <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <button aria-label="Open navigation" onClick={() => setMenu(!menu)} className="rounded-lg p-2 hover:bg-muted md:hidden"><Menu size={20}/></button>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sun size={19}/></div>
              <div><p className="font-semibold tracking-tight">Mausam <span className="text-primary">AI</span></p><p className="hidden text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground sm:block">Weather intelligence</p></div>
            </div>
            <div className="hidden items-center gap-1 rounded-xl border border-border bg-card p-1 md:flex">
              {['Overview', 'Insights', 'Locations'].map((item, i) => <button key={item} className={`rounded-lg px-4 py-2 text-sm ${i === 0 ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'}`}>{item}</button>)}
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Search locations" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Search size={18}/></button>
              <button aria-label="Toggle dark mode" onClick={() => setDark(!dark)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
              <button aria-label="Notifications" className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Bell size={18}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary"/></button>
              <div className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold sm:flex">AS</div>
            </div>
          </div>
          {menu && <div className="border-t border-border px-4 py-3 md:hidden"><div className="flex gap-2">{['Overview', 'Insights', 'Locations'].map(x => <button key={x} className="rounded-lg bg-muted px-3 py-2 text-sm">{x}</button>)}</div></div>}
        </header>

        <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} className="text-primary"/> {location}, India <ChevronDown size={14}/></p><h1 className="text-3xl font-semibold tracking-[-.04em] md:text-4xl">Good morning, Ananya</h1><p className="mt-2 text-sm text-muted-foreground">Tuesday, September 2, 2026 <span className="mx-2">·</span> Updated 2 min ago</p></div>
            <div className="flex gap-2"><button onClick={() => setSaved([...saved, 'Chennai'])} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted"><Plus size={16}/> Add location</button><button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"><LocateFixed size={16}/> Use my location</button></div>
          </div>

          {alert && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/8 px-4 py-3"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/15 p-2 text-primary"><ShieldAlert size={18}/></div><p className="text-sm"><strong>Monsoon watch:</strong> Moderate rainfall expected after 3 PM. Plan your commute accordingly.</p></div><button aria-label="Dismiss alert" onClick={() => setAlert(false)} className="text-muted-foreground hover:text-foreground"><X size={17}/></button></motion.div>}

          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="relative overflow-hidden bg-primary text-primary-foreground"><div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.25),transparent_35%)]"/><div className="relative flex h-full min-h-[250px] flex-col justify-between p-6 md:p-8"><div className="flex items-start justify-between"><div><p className="text-sm text-primary-foreground/70">Current conditions</p><div className="mt-4 flex items-start gap-3"><span className="text-7xl font-semibold tracking-[-.08em]">28°</span><span className="mt-3 text-sm text-primary-foreground/75">Feels like 30°</span></div><p className="mt-2 text-lg">Partly cloudy</p></div><Sun size={62} strokeWidth={1.2} className="text-primary-foreground/85"/></div><div className="flex flex-wrap gap-5 border-t border-primary-foreground/15 pt-4 text-sm"><span className="flex items-center gap-2"><Wind size={15}/> 12 km/h</span><span className="flex items-center gap-2"><Droplets size={15}/> 68% humidity</span><span className="flex items-center gap-2"><Eye size={15}/> 8 km visibility</span></div></div></Card>
            <AIDailyBrief />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
            <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-border px-6 py-5"><div><h2 className="font-semibold">Today&apos;s timeline</h2><p className="mt-1 text-xs text-muted-foreground">Temperature & conditions</p></div><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><MoreHorizontal size={18}/></button></div><div className="overflow-x-auto"><div className="flex min-w-[700px] divide-x divide-border px-2 py-5">{hourly.map(([time, temp, type], i) => <div key={time} className={`flex min-w-[77px] flex-1 flex-col items-center gap-3 px-3 text-center ${i === 0 ? 'text-primary' : ''}`}><span className="text-xs font-medium">{time}</span><WeatherIcon type={type} size={i === 0 ? 26 : 22}/><span className="text-sm font-semibold">{temp}</span><span className="text-[10px] text-muted-foreground">{type === 'rain' ? 'Rain' : type === 'cloud' ? 'Cloudy' : 'Sunny'}</span></div>)}</div></div></Card>
            <Card className="p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Live radar</h2><p className="mt-1 text-xs text-muted-foreground">Precipitation · New Delhi</p></div><button aria-label="Expand map" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowUpRight size={17}/></button></div><div className="relative mt-5 h-40 overflow-hidden rounded-xl border border-border bg-secondary"><div className="absolute inset-0 opacity-40" style={{backgroundImage: 'linear-gradient(35deg, transparent 48%, var(--primary) 49%, transparent 51%), linear-gradient(110deg, transparent 47%, var(--border) 48%, transparent 50%)', backgroundSize: '65px 65px'}}/><div className="absolute left-[48%] top-[43%] h-3 w-3 rounded-full border-2 border-background bg-primary shadow-[0_0_0_6px_rgba(20,184,166,.2)]"/><span className="absolute left-[52%] top-[53%] rounded-md bg-card px-2 py-1 text-[10px] font-medium shadow-sm">You are here</span><div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-[10px] text-muted-foreground"><Navigation size={11} className="text-primary"/> OpenStreetMap</div></div></Card>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
            <Card className="p-6 lg:col-span-2"><div className="flex items-center justify-between"><div><h2 className="font-semibold">7-day forecast</h2><p className="mt-1 text-xs text-muted-foreground">Plan ahead with confidence</p></div><button className="flex items-center gap-1 text-xs font-medium text-primary">Full forecast <ArrowUpRight size={14}/></button></div><div className="mt-5 grid grid-cols-7 gap-1">{week.map(([day, high, low, type, rain], i) => <div key={day} className={`flex flex-col items-center gap-3 rounded-xl px-1 py-3 ${i === 0 ? 'bg-muted' : ''}`}><span className="text-xs font-medium">{day}</span><WeatherIcon type={type} size={20}/><span className="text-sm font-semibold">{high}</span><span className="text-xs text-muted-foreground">{low}</span><span className="text-[10px] text-primary">{rain}</span></div>)}</div></Card>
            <Card className="p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">Comfort index</h2><Gauge size={18} className="text-primary"/></div><div className="mt-5 flex items-end gap-3"><span className="text-4xl font-semibold tracking-tight">72</span><span className="mb-1 text-sm text-muted-foreground">/ 100 · Good</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[72%] rounded-full bg-primary"/></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs"><span className="text-muted-foreground">UV index <strong className="ml-1 text-foreground">6 High</strong></span><span className="text-muted-foreground">AQI <strong className="ml-1 text-foreground">58 Fair</strong></span></div></Card>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3"><Card className="p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Umbrella size={17}/></div><div><h3 className="text-sm font-semibold">Commute window</h3><p className="text-xs text-muted-foreground">Best time to head out</p></div></div><p className="mt-4 text-2xl font-semibold">Now – 3 PM</p><p className="mt-1 text-xs text-muted-foreground">Low chance of rain · Clear roads</p></Card><Card className="p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Leaf size={17}/></div><div><h3 className="text-sm font-semibold">Outdoor score</h3><p className="text-xs text-muted-foreground">Great for a walk</p></div></div><p className="mt-4 text-2xl font-semibold">8.4 <span className="text-sm font-normal text-muted-foreground">/ 10</span></p><p className="mt-1 text-xs text-muted-foreground">Take sunscreen and water</p></Card><Card className="p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Sunrise size={17}/></div><div><h3 className="text-sm font-semibold">Sunrise & sunset</h3><p className="text-xs text-muted-foreground">Daylight duration</p></div></div><p className="mt-4 text-2xl font-semibold">5:59 <span className="text-sm font-normal text-muted-foreground">AM</span></p><p className="mt-1 text-xs text-muted-foreground">Sunset 6:39 PM · 12h 40m day</p></Card></div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]"><Card className="p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Saved locations</h2><p className="mt-1 text-xs text-muted-foreground">Your cities at a glance</p></div><button aria-label="Add saved location" onClick={() => setSaved([...saved, 'Kolkata'])} className="rounded-lg p-2 text-primary hover:bg-muted"><Plus size={17}/></button></div><div className="mt-4 flex flex-wrap gap-2">{saved.map((city, i) => <button key={`${city}-${i}`} onClick={() => setLocation(city)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${location === city ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border hover:bg-muted'}`}><MapPin size={14}/>{city}<span className="text-xs text-muted-foreground">{i === 0 ? '28°' : i === 1 ? '24°' : '30°'}</span></button>)}</div></Card><Card className="p-6"><div><h2 className="font-semibold">Quick actions</h2><p className="mt-1 text-xs text-muted-foreground">Make your forecast work for you</p></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><button className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-xs hover:bg-muted"><CalendarDays size={18} className="text-primary"/> Plan trip</button><button className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-xs hover:bg-muted"><Bell size={18} className="text-primary"/> Set alert</button><button className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-xs hover:bg-muted"><Thermometer size={18} className="text-primary"/> Compare</button><button className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-xs hover:bg-muted"><Wind size={18} className="text-primary"/> Air quality</button></div></Card></div>

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>Data from Open-Meteo · Location services enabled</p><div className="flex items-center gap-4"><button className="hover:text-foreground"><Settings2 size={13} className="mr-1 inline"/> Preferences</button><button className="hover:text-foreground">Privacy</button></div></div>
        </div>
      </main>
    </div>
  )
}
