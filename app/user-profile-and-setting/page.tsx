'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import {
  Bell,
  Check,
  ChevronDown,
  CloudSun,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  Palette,
  PanelLeft,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  X,
} from 'lucide-react'

type Section = 'profile' | 'notifications' | 'preferences' | 'account'

type SettingsState = {
  name: string
  email: string
  location: string
  bio: string
  alerts: boolean
  dailyBrief: boolean
  severeWeather: boolean
  units: 'metric' | 'imperial'
  theme: 'light' | 'dark' | 'system'
}

const initialSettings: SettingsState = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@example.com',
  location: 'Bengaluru, Karnataka',
  bio: 'Building thoughtful products for a changing climate.',
  alerts: true,
  dailyBrief: true,
  severeWeather: true,
  units: 'metric',
  theme: 'system',
}

const navItems: { id: Section; label: string; icon: typeof UserRound }[] = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'account', label: 'Account', icon: ShieldCheck },
]

export default function Page() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [section, setSection] = useState<Section>('profile')
  const [settings, setSettings] = useState(initialSettings)
  const [draftKey, setDraftKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = window.localStorage.getItem('mausam-settings')
    if (stored) setSettings({ ...initialSettings, ...JSON.parse(stored) })
  }, [])

  useEffect(() => {
    setTheme(settings.theme)
  }, [settings.theme, setTheme])

  async function handleSignOut() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // ignore sign-out errors and route to login regardless
    }
    router.push('/login')
  }

  const activeItem = useMemo(() => navItems.find((item) => item.id === section), [section])

  function updateSettings(patch: Partial<SettingsState>) {
    setSettings((current) => ({ ...current, ...patch }))
    setSaved(false)
  }

  function saveSettings() {
    window.localStorage.setItem('mausam-settings', JSON.stringify(settings))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  function selectSection(next: Section) {
    setSection(next)
    setMobileOpen(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar px-4 py-5 lg:flex lg:flex-col">
          <Brand />
          <div className="mt-10 flex flex-1 flex-col">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
            <nav className="mt-3 flex flex-col gap-1" aria-label="Main navigation">
              <NavLink icon={LayoutDashboard} label="Overview" href="/dashboard" />
              <NavLink icon={CloudSun} label="Weather intelligence" href="/map" />
              <NavLink icon={Sparkles} label="Mausam insights" href="/ai-insights" active />
            </nav>
            <p className="mt-9 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Manage</p>
            <nav className="mt-3 flex flex-col gap-1" aria-label="Settings navigation">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => selectSection(item.id)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${section === item.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} aria-current={section === item.id ? 'page' : undefined}>
                  <item.icon aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="border-t border-border pt-4">
            <Link href="/help-center" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><HelpCircle aria-hidden="true" /> Help center</Link>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-background/70 p-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">AM</div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">Arjun Mehta</p><p className="truncate text-xs text-muted-foreground">Personal workspace</p></div>
              <MoreHorizontal aria-hidden="true" className="text-muted-foreground" />
            </div>
          </div>
        </aside>

        {mobileOpen && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar px-4 py-5 shadow-xl transition-transform lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between"><Brand /><button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-accent"><X /></button></div>
          <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile navigation">{navItems.map((item) => <button key={item.id} onClick={() => selectSection(item.id)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${section === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}><item.icon aria-hidden="true" />{item.label}</button>)}</nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-border px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-accent lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></button><div><p className="text-xs font-medium text-muted-foreground">Settings</p><h1 className="text-lg font-semibold tracking-tight">{activeItem?.label}</h1></div></div>
            <div className="flex items-center gap-2"><button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="hidden rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground sm:block" aria-label="Toggle theme">{mounted && resolvedTheme === 'dark' ? <Sun /> : <Moon />}</button><Link href="/alerts" className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Notifications"><Bell /></Link><div className="ml-1 flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold">AM</div></div>
          </header>

          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
            <div className="mb-8 flex items-start justify-between gap-4"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"><Settings aria-hidden="true" /> Workspace settings</div><h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Make Mausam yours.</h2><p className="mt-3 max-w-xl text-pretty leading-6 text-muted-foreground">Tune your weather intelligence experience, profile, and alerts from one calm, focused place.</p></div><button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent sm:flex"><Eye aria-hidden="true" /> Preview</button></div>

            <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1" role="tablist" aria-label="Settings sections">
              {navItems.map((item) => <button key={item.id} onClick={() => selectSection(item.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${section === item.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} role="tab" aria-selected={section === item.id}><item.icon aria-hidden="true" />{item.label}</button>)}
            </div>

            {section === 'profile' && <ProfileSection settings={settings} updateSettings={updateSettings} />}
            {section === 'notifications' && <NotificationsSection settings={settings} updateSettings={updateSettings} />}
            {section === 'preferences' && <PreferencesSection settings={settings} updateSettings={updateSettings} />}
            {section === 'account' && <AccountSection draftKey={draftKey} setDraftKey={setDraftKey} showKey={showKey} setShowKey={setShowKey} onSignOut={handleSignOut} />}

            <div className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center"><p className="text-xs text-muted-foreground">Changes are saved locally to this device.</p><button onClick={saveSettings} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">{saved ? <Check aria-hidden="true" /> : <Save aria-hidden="true" />}{saved ? 'Saved' : 'Save changes'}</button></div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Brand() { return <div className="flex items-center gap-2.5 px-2"><div className="flex size-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground"><CloudSun aria-hidden="true" /></div><span className="text-base font-semibold tracking-tight">Mausam <span className="text-muted-foreground">AI</span></span></div> }
function NavLink({ icon: Icon, label, href, active = false }: { icon: typeof UserRound; label: string; href: string; active?: boolean }) { return <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}><Icon aria-hidden="true" />{label}</Link> }
function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) { return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_color-mix(in_oklab,var(--foreground)_4%,transparent)]"><div className="border-b border-border px-5 py-5 sm:px-6"><h3 className="font-semibold tracking-tight">{title}</h3>{description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>}</div>{children}</section> }
function ProfileSection({ settings, updateSettings }: { settings: SettingsState; updateSettings: (patch: Partial<SettingsState>) => void }) { return <div className="flex flex-col gap-6"><Card title="Personal profile" description="This information helps Mausam personalize your forecasts and recommendations."><div className="flex flex-col gap-6 px-5 py-6 sm:px-6"><div className="flex items-center gap-4"><div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-sm">AM</div><div><p className="font-medium">Profile photo</p><p className="mt-1 text-sm text-muted-foreground">JPG or PNG, up to 5MB.</p></div><button className="ml-auto rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent">Upload</button></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" value={settings.name} onChange={(name) => updateSettings({ name })} /><Field label="Email address" value={settings.email} onChange={(email) => updateSettings({ email })} type="email" /></div><Field label="Home location" value={settings.location} onChange={(location) => updateSettings({ location })} hint="Used for your default weather view." /><label className="flex flex-col gap-2 text-sm font-medium">Bio<textarea value={settings.bio} onChange={(event) => updateSettings({ bio: event.target.value })} rows={3} className="resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-normal outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring" /></label></div></Card><Card title="Profile visibility" description="Choose how your profile appears across shared weather workspaces."><div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6"><div><p className="text-sm font-medium">Private profile</p><p className="mt-1 text-sm text-muted-foreground">Only you can see your personal details.</p></div><div className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">Default</div></div></Card></div> }
function Field({ label, value, onChange, type = 'text', hint }: { label: string; value: string; onChange: (value: string) => void; type?: string; hint?: string }) { return <label className="flex flex-col gap-2 text-sm font-medium">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-input bg-background px-3 py-2.5 font-normal outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring" />{hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}</label> }
function NotificationsSection({ settings, updateSettings }: { settings: SettingsState; updateSettings: (patch: Partial<SettingsState>) => void }) { return <Card title="Notification preferences" description="Stay informed without adding noise to your day."><div className="flex flex-col divide-y divide-border px-5 sm:px-6">{[['alerts', 'Weather alerts', 'Get notified about severe weather and meaningful changes.'], ['dailyBrief', 'Daily weather brief', 'A concise morning summary for your saved locations.'], ['severeWeather', 'Severe weather warnings', 'Priority alerts when conditions may affect your safety.']].map(([key, label, description]) => <div key={key} className="flex items-center justify-between gap-4 py-5"><div><p className="text-sm font-medium">{label}</p><p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p></div><button role="switch" aria-checked={settings[key as keyof SettingsState] as boolean} onClick={() => updateSettings({ [key]: !settings[key as keyof SettingsState] })} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings[key as keyof SettingsState] ? 'bg-primary' : 'bg-muted'}`}><span className={`absolute top-1 size-4 rounded-full bg-background transition-transform ${settings[key as keyof SettingsState] ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>)}</div></Card> }
function PreferencesSection({ settings, updateSettings }: { settings: SettingsState; updateSettings: (patch: Partial<SettingsState>) => void }) { return <div className="flex flex-col gap-6"><Card title="Forecast preferences" description="Shape how weather data is presented to you."><div className="flex flex-col gap-6 px-5 py-6 sm:px-6"><Choice label="Measurement units" value={settings.units} onChange={(units) => updateSettings({ units: units as SettingsState['units'] })} options={[['metric', 'Metric', '°C, km/h'], ['imperial', 'Imperial', '°F, mph']]} /><Choice label="Appearance" value={settings.theme} onChange={(theme) => updateSettings({ theme: theme as SettingsState['theme'] })} options={[['system', 'System', 'Matches device'], ['light', 'Light', 'Always light'], ['dark', 'Dark', 'Always dark']]} /></div></Card><Card title="Data & privacy" description="Mausam is designed to keep your data clear and in your control."><div className="flex items-center gap-3 px-5 py-5 text-sm text-muted-foreground sm:px-6"><ShieldCheck className="text-primary" aria-hidden="true" /><p>Location data is used only to personalize your forecast experience.</p></div></Card></div> }
function Choice({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <fieldset className="flex flex-col gap-3"><legend className="text-sm font-medium">{label}</legend><div className="grid gap-3 sm:grid-cols-3">{options.map(([option, title, detail]) => <button type="button" key={option} onClick={() => onChange(option)} className={`rounded-xl border px-4 py-3 text-left transition-colors ${value === option ? 'border-foreground bg-secondary' : 'border-border hover:bg-accent'}`}><span className="block text-sm font-medium">{title}</span><span className="mt-1 block text-xs text-muted-foreground">{detail}</span></button>)}</div></fieldset> }
function AccountSection({ draftKey, setDraftKey, showKey, setShowKey, onSignOut }: { draftKey: string; setDraftKey: (value: string) => void; showKey: boolean; setShowKey: (value: boolean) => void; onSignOut: () => void }) { return <div className="flex flex-col gap-6"><Card title="Mausam API access" description="Connect your own key for higher rate limits and private integrations."><div className="flex flex-col gap-4 px-5 py-6 sm:px-6"><label className="flex flex-col gap-2 text-sm font-medium">API key<div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input value={draftKey} onChange={(event) => setDraftKey(event.target.value)} type={showKey ? 'text' : 'password'} placeholder="mausam_live_••••••••" className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /><button type="button" aria-label={showKey ? 'Hide API key' : 'Show API key'} onClick={() => setShowKey(!showKey)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent">{showKey ? <EyeOff /> : <Eye />}</button></div></label><p className="text-xs leading-5 text-muted-foreground">Your key is stored locally in this browser and never uploaded by this demo.</p></div></Card><Card title="Account actions" description="Manage your session and workspace access."><div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="text-sm font-medium">Sign out of this device</p><p className="mt-1 text-sm text-muted-foreground">You can sign back in at any time.</p></div><button onClick={onSignOut} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent"><LogOut aria-hidden="true" /> Sign out</button></div></Card></div> }
