'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Bell,
  Check,
  CircleAlert,
  CloudRain,
  Droplets,
  Heart,
  Inbox,
  Loader2,
  MapPin,
  Search,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Thermometer,
  UserRound,
  Wind,
  X,
} from 'lucide-react'
import type { AlertType, NotificationSettings, WeatherAlert } from '@/lib/alerts/service'
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  useNotificationPreferences,
  type NotificationPreferences,
} from '@/lib/alerts/preferences'
import { useProfile } from '@/lib/profile-context'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { GuestAuthModal } from '@/components/guest-auth-modal'
import { useActiveLocation } from '@/lib/location-context'
import {
  getUserAlertsServer,
  markAlertReadServer,
  favoriteAlertServer,
  archiveAlertServer,
  deleteAlertServer,
  saveAlertPreferencesServer,
} from '@/lib/actions/alerts'

type Props = {
  initialAlerts: WeatherAlert[]
  initialSettings: NotificationSettings
  initialPreferences?: NotificationPreferences
  initialLocation?: { latitude: number; longitude: number; name: string }
  initialAuthenticated?: boolean
}

const filters: Array<'All' | AlertType> = [
  'All',
  'Severe Weather',
  'Daily Forecast',
  'Air Quality',
  'Temperature',
  'Precipitation',
]

const iconByType = {
  'Severe Weather': ShieldAlert,
  'Daily Forecast': CloudRain,
  'Air Quality': Wind,
  Temperature: Thermometer,
  Precipitation: Droplets,
}

const toneBySeverity = {
  critical: 'bg-red-50 text-red-700 ring-red-100',
  high: 'bg-orange-50 text-orange-700 ring-orange-100',
  medium: 'bg-amber-50 text-amber-700 ring-amber-100',
  low: 'bg-slate-50 text-slate-600 ring-slate-200',
}

const preferenceRows = [
  ['Severe Weather', 'Severe weather', 'Critical warnings and thunderstorm advisories'],
  ['Daily Forecast', 'Daily forecast', 'A morning summary for your saved places'],
  ['Air Quality', 'Air quality', 'Smoke, dust, and AQI shifts'],
  ['Temperature', 'Temperature changes', 'High heat and cold wave advisories'],
  ['Precipitation', 'Precipitation', 'Heavy rain and monsoon activity'],
] as const

function toPreferences(settings: NotificationSettings): NotificationPreferences {
  const categories = preferenceRows
    .filter(([key]) =>
      settings[
        key === 'Severe Weather'
          ? 'severeWeather'
          : key === 'Daily Forecast'
          ? 'dailyForecast'
          : key === 'Air Quality'
          ? 'airQuality'
          : key === 'Temperature'
          ? 'temperature'
          : 'precipitation'
      ]
    )
    .map(([key]) => key)
  return { email: settings.email, push: settings.push, categories }
}

function getGuestStates(): Record<
  string,
  { unread?: boolean; favorite?: boolean; archived?: boolean; dismissed?: boolean }
> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem('mausam:guest-alert-states')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setGuestState(
  alertId: string,
  patch: { unread?: boolean; favorite?: boolean; archived?: boolean; dismissed?: boolean }
) {
  if (typeof window === 'undefined') return
  try {
    const current = getGuestStates()
    current[alertId] = { ...(current[alertId] || {}), ...patch }
    window.localStorage.setItem('mausam:guest-alert-states', JSON.stringify(current))
  } catch {}
}

export function AlertsDashboard({
  initialAlerts,
  initialSettings,
  initialPreferences,
  initialLocation,
  initialAuthenticated = false,
}: Props) {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Newest first')
  const [selected, setSelected] = useState<WeatherAlert | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { preferences, save } = useNotificationPreferences(initialPreferences)
  const [draft, setDraft] = useState<NotificationPreferences>(() => initialPreferences ?? toPreferences(initialSettings))
  const [discardOpen, setDiscardOpen] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  const [guestModalOpen, setGuestModalOpen] = useState(false)
  const { initials, isGuest, profile } = useProfile()
  const { t } = useI18n()
  const { active, locations, setActive, isAuthenticated: clientAuth } = useActiveLocation()

  const isAuth = (initialAuthenticated || clientAuth) && !isGuest
  const currentLocation = active || initialLocation

  // Sync alerts whenever active location changes
  useEffect(() => {
    let isMounted = true
    if (!currentLocation?.latitude || !currentLocation?.longitude) return

    const loadAlerts = async () => {
      setIsLoading(true)
      try {
        if (isAuth) {
          const res = await getUserAlertsServer({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            name: currentLocation.name,
          })
          if (isMounted && res.alerts) {
            setAlerts(res.alerts)
          }
        } else {
          // Guest mode: fetch weather-derived alerts and merge client states
          const queryUrl = `/api/alerts?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}&name=${encodeURIComponent(
            currentLocation.name
          )}`
          const res = await fetch(queryUrl)
          if (res.ok) {
            const rawAlerts: WeatherAlert[] = await res.json()
            const guestStates = getGuestStates()
            const merged = rawAlerts
              .filter((a) => !guestStates[a.id]?.dismissed)
              .map((a) => {
                const st = guestStates[a.id]
                return st
                  ? {
                      ...a,
                      unread: st.unread !== undefined ? st.unread : a.unread,
                      favorite: st.favorite !== undefined ? st.favorite : a.favorite,
                      archived: st.archived !== undefined ? st.archived : a.archived,
                    }
                  : a
              })
            if (isMounted) setAlerts(merged)
          }
        }
      } catch (err) {
        console.error('Failed to sync alerts:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadAlerts()
    return () => {
      isMounted = false
    }
  }, [currentLocation?.latitude, currentLocation?.longitude, currentLocation?.name, isAuth])

  const visible = useMemo(
    () =>
      alerts
        .filter(
          (alert) =>
            (showArchived ? alert.archived : !alert.archived) &&
            (filter === 'All' || alert.type === filter) &&
            `${alert.title} ${alert.location} ${alert.detail}`.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) =>
          sort === 'Oldest first' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
        ),
    [alerts, filter, query, showArchived, sort]
  )

  const unreadCount = alerts.filter((a) => a.unread && !a.archived).length

  const updateAlert = (id: string, patch: Partial<WeatherAlert>) =>
    setAlerts((current) => current.map((alert) => (alert.id === id ? { ...alert, ...patch } : alert)))

  const handleOpen = (alert: WeatherAlert) => {
    updateAlert(alert.id, { unread: false })
    setSelected(alert)
    if (isAuth) {
      markAlertReadServer(alert.id, false, alert).catch(() => {})
    } else {
      setGuestState(alert.id, { unread: false })
    }
  }

  const handleFavorite = (alert: WeatherAlert) => {
    const nextFav = !alert.favorite
    updateAlert(alert.id, { favorite: nextFav })
    if (isAuth) {
      favoriteAlertServer(alert.id, nextFav, alert).catch(() => {})
    } else {
      setGuestState(alert.id, { favorite: nextFav })
    }
  }

  const handleArchive = (alert: WeatherAlert) => {
    const nextArchived = !alert.archived
    updateAlert(alert.id, { archived: nextArchived })
    if (isAuth) {
      archiveAlertServer(alert.id, nextArchived, alert).catch(() => {})
    } else {
      setGuestState(alert.id, { archived: nextArchived })
    }
  }

  const handleDelete = (alert: WeatherAlert) => {
    setAlerts((all) => all.filter((item) => item.id !== alert.id))
    if (isAuth) {
      deleteAlertServer(alert.id, alert).catch(() => {})
    } else {
      setGuestState(alert.id, { dismissed: true })
    }
  }

  const openSettings = () => {
    setDraft(preferences)
    setSavedMessage(false)
    setSettingsOpen(true)
  }

  const closeSettings = () => {
    if (JSON.stringify(draft) !== JSON.stringify(preferences)) setDiscardOpen(true)
    else setSettingsOpen(false)
  }

  const commitSettings = async () => {
    save(draft)
    if (isAuth) {
      await saveAlertPreferencesServer(draft)
    }
    setSavedMessage(true)
    window.setTimeout(() => {
      setSettingsOpen(false)
      setSavedMessage(false)
    }, 900)

    // Re-fetch alerts to match new category preferences
    if (currentLocation?.latitude && currentLocation?.longitude) {
      if (isAuth) {
        const res = await getUserAlertsServer({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          name: currentLocation.name,
        })
        if (res.alerts) setAlerts(res.alerts)
      }
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              aria-label="Back to dashboard"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-border/80 hover:bg-muted"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Mausam AI</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{t('alerts.title')}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => {
                if (isGuest) {
                  setGuestModalOpen(true)
                } else {
                  openSettings()
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <Settings2 size={16} /> {t('alerts.settingsBtn')}
            </button>
            <button
              onClick={() => {
                if (isGuest) {
                  setGuestModalOpen(true)
                } else {
                  window.location.href = '/user-profile-and-setting'
                }
              }}
              aria-label="Profile"
              className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground overflow-hidden"
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName || 'User Avatar'}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || <UserRound size={16} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-muted-foreground">{t('alerts.subtitle')}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border text-foreground">
                <Bell size={15} className="text-orange-500" /> {t('alerts.unreadCount', { count: unreadCount })}
              </span>
              {currentLocation ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border text-foreground font-medium">
                  <MapPin size={14} className="text-orange-500" />
                  {currentLocation.name}
                  {currentLocation.region ? `, ${currentLocation.region}` : ''}
                </span>
              ) : null}
              {locations.length > 1 && (
                <select
                  aria-label="Switch location"
                  value={active ? `${active.name}-${active.latitude}-${active.longitude}` : ''}
                  onChange={(e) => {
                    const found = locations.find(
                      (l) => `${l.name}-${l.latitude}-${l.longitude}` === e.target.value
                    )
                    if (found) setActive(found.id || `${found.name}-${found.latitude}`)
                  }}
                  className="rounded-full bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm ring-1 ring-border outline-none hover:bg-muted cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option
                      key={loc.id || `${loc.name}-${loc.latitude}`}
                      value={`${loc.name}-${loc.latitude}-${loc.longitude}`}
                      className="bg-card text-foreground"
                    >
                      {loc.name} {loc.region ? `(${loc.region})` : ''}
                    </option>
                  ))}
                </select>
              )}
              <span>{t('alerts.updatedJustNow')}</span>
              {isLoading && <Loader2 size={14} className="animate-spin text-orange-500" />}
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              aria-label={t('alerts.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('alerts.searchPlaceholder')}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none ring-orange-400 transition focus:ring-2 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === item
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-muted-foreground ring-1 ring-border hover:text-foreground'
              }`}
            >
              {item === 'All'
                ? t('alerts.filterAll')
                : item === 'Severe Weather'
                ? t('alerts.filterSevere')
                : item === 'Daily Forecast'
                ? t('alerts.filterDaily')
                : item === 'Air Quality'
                ? t('alerts.filterAqi')
                : item === 'Temperature'
                ? t('alerts.filterTemp')
                : t('alerts.filterPrecip')}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {showArchived
              ? t('alerts.archivedAlerts', { count: visible.length })
              : t('alerts.activeAlerts', { count: visible.length })}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            >
              <Inbox size={15} /> {showArchived ? t('alerts.active') : t('alerts.archived')}
            </button>
            <label className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <SlidersHorizontal size={15} />
              <select
                aria-label="Sort alerts"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-foreground"
              >
                <option value="Newest first" className="bg-card text-foreground">{t('alerts.sortNewest')}</option>
                <option value="Oldest first" className="bg-card text-foreground">{t('alerts.sortOldest')}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-4">
          {visible.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onOpen={() => handleOpen(alert)}
              onFavorite={() => handleFavorite(alert)}
              onArchive={() => handleArchive(alert)}
              onDelete={() => handleDelete(alert)}
            />
          ))}

          {visible.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <CircleAlert className="mx-auto text-muted-foreground" size={32} />
              <h2 className="mt-3 font-semibold text-foreground">{t('alerts.noAlerts')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentLocation
                  ? t('alerts.tryAnotherSearch')
                  : 'Select an Indian location in your Dashboard to view live atmospheric alerts.'}
              </p>
              {!currentLocation && (
                <Link
                  href="/dashboard"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
                >
                  Choose Location
                </Link>
              )}
            </div>
          )}
        </div>

        <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-orange-600">
                <Sparkles size={17} />
                <p className="text-sm font-semibold">{t('alerts.aiInsights')}</p>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-foreground">{t('alerts.title')}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                {t('alerts.feedSummary')}
              </p>
            </div>
          </div>
        </section>

        {settingsOpen && (
          <SettingsPanel
            draft={draft}
            onChange={setDraft}
            onSave={commitSettings}
            onClose={closeSettings}
            saved={savedMessage}
          />
        )}

        {discardOpen && (
          <DiscardDialog
            onKeep={() => setDiscardOpen(false)}
            onDiscard={() => {
              setDraft(preferences)
              setDiscardOpen(false)
              setSettingsOpen(false)
            }}
          />
        )}

        {selected && <DetailPanel alert={selected} onClose={() => setSelected(null)} />}
      </div>
      <GuestAuthModal
        open={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        featureName="Alert Preferences"
        title="Sign up to customize alerts"
        description="Configure personalized push, email, and SMS notifications for thunderstorms, daily weather summaries, and extreme temperatures."
      />
    </main>
  )
}

function AlertCard({
  alert,
  onOpen,
  onFavorite,
  onArchive,
  onDelete,
}: {
  alert: WeatherAlert
  onOpen: () => void
  onFavorite: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  const Icon = iconByType[alert.type] || ShieldAlert

  return (
    <article
      className={`group relative rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        alert.unread ? 'border-orange-500/40 ring-1 ring-orange-500/20' : 'border-border'
      }`}
    >
      <div className="flex gap-4">
        <div className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ${toneBySeverity[alert.severity]}`}>
          <Icon size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {alert.type}
                </span>
                {alert.unread && <span className="size-2 rounded-full bg-orange-500" aria-label="Unread" />}
              </div>
              <button
                onClick={onOpen}
                className="mt-1 text-left text-base font-semibold text-foreground hover:text-orange-500 transition"
              >
                {alert.title}
              </button>
            </div>
            <button
              onClick={onFavorite}
              aria-label={alert.favorite ? 'Remove favorite' : 'Add favorite'}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-orange-500 transition"
            >
              {alert.favorite ? (
                <Heart size={18} fill="currentColor" className="text-orange-500" />
              ) : (
                <Heart size={18} />
              )}
            </button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin size={14} className="text-muted-foreground" /> {alert.location}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{alert.detail}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>{alert.relativeTime}</span>
            {alert.expiresAt && <span>Expires {alert.expiresAt}</span>}
            {alert.temperature && <span>{alert.temperature}</span>}
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={onArchive}
                className="rounded-md p-1.5 hover:bg-muted hover:text-foreground transition"
                aria-label={alert.archived ? 'Restore alert' : 'Archive alert'}
                title={alert.archived ? 'Restore alert' : 'Archive alert'}
              >
                <Inbox size={16} />
              </button>
              <button
                onClick={onDelete}
                className="rounded-md p-1.5 hover:bg-muted hover:text-red-500 transition"
                aria-label="Delete alert"
                title="Delete alert"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function DetailPanel({ alert, onClose }: { alert: WeatherAlert; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-black/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card border border-border p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">{alert.type}</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">{alert.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {alert.location} · {alert.timestamp}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close details" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
            <Sparkles size={16} /> Weather intelligence insight
          </div>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {alert.insight ?? 'Keep an eye on changing conditions and check back for the latest atmospheric forecast.'}
          </p>
        </div>

        <p className="mt-6 text-sm leading-7 text-muted-foreground">{alert.detail}</p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          Done
        </button>
      </aside>
    </div>
  )
}

function SettingsPanel({
  draft,
  onChange,
  onSave,
  onClose,
  saved,
}: {
  draft: NotificationPreferences
  onChange: (next: NotificationPreferences) => void
  onSave: () => void
  onClose: () => void
  saved: boolean
}) {
  const toggleCategory = (category: string) =>
    onChange({
      ...draft,
      categories: draft.categories.includes(category)
        ? draft.categories.filter((item) => item !== category)
        : [...draft.categories, category],
    })

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-black/50 backdrop-blur-[2px]" onClick={onClose}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md overflow-y-auto bg-card border-l border-border p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">Preferences</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Notification settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose how Mausam should notify you.</p>
          </div>
          <button onClick={onClose} aria-label="Close settings" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alert types</p>
          {preferenceRows.map(([key, title, description]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between border-b border-border py-4">
              <span>
                <span className="block text-sm font-medium text-foreground">{title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
              </span>
              <input
                type="checkbox"
                checked={draft.categories.includes(key)}
                onChange={() => toggleCategory(key)}
                className="size-4 accent-orange-500 cursor-pointer"
              />
            </label>
          ))}
        </div>

        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery channels</p>
          {(['email', 'push'] as const).map((key) => (
            <label key={key} className="flex items-center justify-between border-b border-border py-4 cursor-pointer">
              <span>
                <span className="block text-sm font-medium capitalize text-foreground">{key} notifications</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {key === 'email' ? 'Receive alerts in your inbox' : 'Receive alerts on supported devices'}
                </span>
              </span>
              <input
                type="checkbox"
                checked={draft[key]}
                onChange={(e) => onChange({ ...draft, [key]: e.target.checked })}
                className="size-4 accent-orange-500 cursor-pointer"
              />
            </label>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            {saved ? (
              <span className="inline-flex items-center gap-2">
                <Check size={16} /> Saved
              </span>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </aside>
    </div>
  )
}

function DiscardDialog({ onKeep, onDiscard }: { onKeep: () => void; onDiscard: () => void }) {
  return (
    <div
      className="fixed inset-0 z-30 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discard-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl">
        <h2 id="discard-title" className="text-lg font-semibold text-foreground">
          Discard unsaved changes?
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Your notification preferences have not been saved.</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onKeep} className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted">
            Keep editing
          </button>
          <button onClick={onDiscard} className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}
