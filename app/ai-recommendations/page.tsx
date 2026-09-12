'use client'

import Link from 'next/link'
import { ArrowLeft, MapPin, Sparkles } from 'lucide-react'
import { useLocations } from '@/lib/weather/use-locations'
import { useWeather } from '@/lib/weather/use-weather'
import { createRecommendationResult, type PersonaType } from '@/lib/recommendations'
import { useMemo, useState } from 'react'

const personas: { id: PersonaType; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'farmer', label: 'Farmer' },
  { id: 'commuter', label: 'Commuter' },
  { id: 'traveler', label: 'Traveler' },
]

export default function AIRecommendationsPage() {
  const { active } = useLocations()
  const { data, loading, error } = useWeather(active?.latitude, active?.longitude)
  const [persona, setPersona] = useState<PersonaType>('traveler')
  const result = useMemo(() => {
    if (!data) return null
    return createRecommendationResult({
      persona,
      context: { locationName: active?.name, humidity: data.current.humidity },
      airQuality: data.airQuality,
      weather: {
        temperatureC: data.current.tempC,
        apparentTemperatureC: data.current.apparentC,
        precipitationProbability: data.daily[0]?.precipProb,
        precipitationMm: data.current.precipitation,
        windSpeedKmh: data.current.windKmh,
        windGustKmh: data.current.windGustKmh,
        windDirection: data.current.windDirection,
        uvIndex: data.uvIndexMax,
        weatherCode: data.current.code,
        cloudCover: data.current.cloudCover,
        visibilityKm: data.current.visibilityKm,
        hourly: data.hourly,
        timezone: data.timezone,
      },
    })
  }, [active?.name, data, persona])

  return (
    <main className="min-h-screen bg-background pb-16 text-foreground">
      <header className="border-b border-border/70 bg-background/90">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 md:px-8">
          <Link href="/dashboard" aria-label="Back to dashboard" className="rounded-lg p-2 hover:bg-muted"><ArrowLeft size={18} /></Link>
          <div><p className="text-xs uppercase tracking-[.2em] text-muted-foreground">Mausam intelligence</p><p className="font-semibold">AI recommendations</p></div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} className="text-primary" />{active ? `${active.name}${active.region ? `, ${active.region}` : ''}` : 'Choose a location'}</p>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[.2em] text-primary">Mausam AI recommendations</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Make today easier.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Practical, weather-informed guidance tailored to your routine and live atmospheric conditions.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Recommendation persona">
          {personas.map((item) => <button key={item.id} onClick={() => setPersona(item.id)} className={`rounded-2xl border p-4 text-left ${persona === item.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:bg-muted'}`}>{item.label}</button>)}
        </div>
        <section className="mt-8 space-y-4" aria-live="polite">
          {loading && <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading live recommendations…</p>}
          {error && <p className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm">{error}</p>}
          {!loading && !error && result?.recommendations.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start gap-3"><Sparkles className="mt-1 text-primary" size={20} /><div><h2 className="font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.guidance}</p><p className="mt-3 text-xs text-muted-foreground">{item.whyThis}</p></div></div></article>)}
          {!loading && !error && result?.recommendations.length === 0 && <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">No recommendations are available for the current conditions.</p>}
        </section>
      </div>
    </main>
  )
}
