import Link from 'next/link'

export default function ProfileSettingsPage() {
  return <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16"><p className="text-sm font-medium text-primary">Mausam settings</p><h1 className="text-4xl font-semibold tracking-tight">Your profile and preferences.</h1><p className="max-w-xl leading-7 text-muted-foreground">Manage your account, weather preferences, language, and notification settings.</p><Link href="/dashboard" className="w-fit rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted">Back to dashboard</Link></main>
}
