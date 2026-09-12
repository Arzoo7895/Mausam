import Link from 'next/link'

export default function TutorialPage() {
  return <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16"><p className="text-sm font-medium text-primary">Mausam tutorial</p><h1 className="text-4xl font-semibold tracking-tight">Learn to read your weather.</h1><p className="max-w-xl leading-7 text-muted-foreground">Explore locations, forecasts, alerts, and personalized recommendations from one place.</p><Link href="/dashboard" className="w-fit rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Open dashboard</Link></main>
}
