'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Sprout,
  Car,
  Compass,
  HeartPulse,
  Umbrella,
  Wind,
  Sun,
  Droplets,
  RefreshCw,
  Loader2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocations } from '@/lib/weather/use-locations'
import { useWeather } from '@/lib/weather/use-weather'
import {
  generateRecommendations,
  type Recommendation,
  type PersonaType,
} from '@/lib/intelligence/service'
import { getAlerts, type WeatherAlert } from '@/lib/alerts/service'
import { useProfile } from '@/lib/profile-context'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { GuestAuthModal } from '@/components/guest-auth-modal'
import { InternalAppHeader } from '@/components/internal-app-header'

const icons = {
  academic: GraduationCap,
  agriculture: Sprout,
  commute: Car,
  leisure: Compass,
  health: HeartPulse,
  precaution: Umbrella,
  timing: Wind,
  clothing: Sun,
}

const tone = {
  good: 'border-emerald-500/25 bg-emerald-500/5',
  info: 'border-primary/20 bg-primary/5',
  warning: 'border-amber-500/25 bg-amber-500/8',
  urgent: 'border-destructive/30 bg-destructive/10',
}

const metricIcons = {
  graduation: GraduationCap,
  umbrella: Umbrella,
  sun: Sun,
  droplets: Droplets,
  sprout: Sprout,
  car: Car,
  wind: Wind,
  compass: Compass,
  health: HeartPulse,
}

export default function AIRecommendationsPage() {
  const { active } = useLocations()
  const { preferences, saveProfile, isGuest } = useProfile()
  const { t } = useI18n()

  const currentPersona = (preferences.persona as PersonaType) || 'traveler'
  const [dismissed, setDismissed] = useState<string[]>([])
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [guestModalOpen, setGuestModalOpen] = useState(false)

  const { data, loading, error, refresh } = useWeather(active?.latitude, active?.longitude)

  // Fetch Phase 4 weather alerts for active location
  useEffect(() => {
    let isMounted = true
    if (active?.latitude && active?.longitude) {
      getAlerts({ latitude: active.latitude, longitude: active.longitude, name: active.name }).then((res) => {
        if (isMounted) setAlerts(res)
      })
    } else {
      setAlerts([])
    }
    return () => {
      isMounted = false
    }
  }, [active?.latitude, active?.longitude, active?.name])

  const personas: { id: PersonaType; label: string; hint: string }[] = [
    { id: 'student', label: t('recommendations.student'), hint: t('recommendations.studentHint') },
    { id: 'farmer', label: t('recommendations.farmer'), hint: t('recommendations.farmerHint') },
    { id: 'commuter', label: t('recommendations.commuter'), hint: t('recommendations.commuterHint') },
    { id: 'traveler', label: t('recommendations.traveler'), hint: t('recommendations.travelerHint') },
  ]

  const currentPersonaLabel = personas.find((p) => p.id === currentPersona)?.label || currentPersona

  // Single Intelligence Engine for recommendations
  const result = useMemo(() => {
    if (!data) return null
    return generateRecommendations({
      weather: data,
      alerts,
      persona: currentPersona,
      locationName: active?.name,
      region: active?.region,
      units: preferences.units,
    })
  }, [data, alerts, currentPersona, preferences.units, active?.name, active?.region])

  const visible = result?.recommendations.filter((item) => !dismissed.includes(item.id)) ?? []

  const setPreferred = async (value: PersonaType) => {
    await saveProfile({ persona: value })
  }

  const location = active ? `${active.name}${active.region ? `, ${active.region}` : ''}` : t('recommendations.chooseLocation')

  return (
    <main className="min-h-screen bg-background pb-16 text-foreground">
      <InternalAppHeader backHref="/dashboard" backLabel="Back to dashboard" className="sticky top-0 z-20"><div><p className="text-xs uppercase tracking-[.2em] text-muted-foreground">{t('recommendations.intelligence')}</p><p className="font-semibold">{t('recommendations.title')}</p></div><button onClick={refresh} aria-label="Refresh recommendations" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><RefreshCw size={18} /></button></InternalAppHeader>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" /> {location}
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[.2em] text-primary">
              {t('recommendations.title')}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance md:text-5xl">{t('recommendations.pageTitle')}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t('recommendations.pageSubtitle')}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />
            {t('recommendations.liveData')}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Recommendation persona">
          {personas.map((item) => (
            <button
              key={item.id}
              onClick={() => setPreferred(item.id)}
              className={`rounded-2xl border p-4 text-left ${currentPersona === item.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card hover:bg-muted'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          >
            <span>{error}</span>
            <button onClick={refresh} className="rounded-lg border border-destructive/30 px-3 py-2 font-medium">
              {t('recommendations.retry')}
            </button>
          </div>
        )}

        {loading && !data ? (
          <div className="flex min-h-80 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" size={18} /> {t('recommendations.loading')}
          </div>
        ) : (
          result && (
            <>
              <section className="mt-8 grid gap-4 md:grid-cols-3">
                {result.metrics.map((metric) => {
                  const Icon = metricIcons[metric.iconName as keyof typeof metricIcons] ?? Sun
                  return (
                    <div key={metric.label} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <Icon size={18} className="text-primary" />
                      </div>
                      <p className="mt-4 text-2xl font-semibold tracking-tight">{metric.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
                    </div>
                  )
                })}
              </section>

              <section className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{t('recommendations.briefTitle')}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('recommendations.briefSubtitle', { persona: currentPersonaLabel })}
                    </p>
                  </div>
                  {dismissed.length > 0 && (
                    <button onClick={() => setDismissed([])} className="text-sm text-primary hover:underline">
                      {t('recommendations.restore')}
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-4">
                  {visible.map((item) => (
                    <RecommendationCard
                      key={item.id}
                      item={item}
                      onDismiss={() => setDismissed((current) => [...current, item.id])}
                    />
                  ))}
                  {visible.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                      {t('recommendations.dismissedAll')}
                    </div>
                  )}
                </div>
              </section>
            </>
          )
        )}
      </div>
    </main>
  )
}

function RecommendationCard({ item, onDismiss }: { item: Recommendation; onDismiss: () => void }) {
  const Icon = icons[item.category] ?? Sun
  const { t } = useI18n()
  return (
    <article className={`rounded-2xl border p-5 ${tone[item.severity]}`}>
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-background/70 p-3 text-primary">
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{item.title}</h3>
            <span className="rounded-full bg-background/70 px-2 py-1 text-[11px] font-medium uppercase tracking-wide">
              {item.priority}
            </span>
            {item.weatherStat && (
              <span className="rounded-full bg-background/70 px-2 py-1 text-xs text-muted-foreground">
                {item.weatherStat}
              </span>
            )}
            <button
              onClick={onDismiss}
              aria-label={`Dismiss ${item.title}`}
              className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-background transition"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.guidance}</p>
          <div className="mt-4 rounded-xl bg-background/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('recommendations.whyThis')}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.whyThis}</p>
          </div>
          {item.timeWindow && <p className="mt-3 text-xs font-medium text-primary">{t('recommendations.window', { window: item.timeWindow })}</p>}
        </div>
      </div>
    </article>
  )
}
