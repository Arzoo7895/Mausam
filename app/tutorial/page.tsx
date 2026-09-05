'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight, CloudSun, Compass, Search, Sparkles, Sun, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'

const steps = [
  { id: 'signals', label: 'Read the signals' },
  { id: 'timeline', label: 'Follow the timeline' },
  { id: 'confidence', label: 'Check confidence' },
]

function WeatherWidget() {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-5" aria-label="Current weather in San Francisco">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">San Francisco, CA</p>
          <div className="mt-2 flex items-center gap-3"><Sun className="size-8 text-primary" aria-hidden="true" /><span className="text-4xl font-semibold tracking-tight">64°</span></div>
          <p className="mt-1 text-sm text-muted-foreground">Partly cloudy · Feels like 63°</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right text-xs text-muted-foreground"><span>Updated just now</span><span className="rounded-full bg-background px-2 py-1 text-foreground">Good visibility</span></div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
        <div><p className="text-muted-foreground">Wind</p><p className="mt-1 flex items-center gap-1 font-medium"><Wind className="size-3.5" aria-hidden="true" /> 8 mph</p></div>
        <div><p className="text-muted-foreground">Humidity</p><p className="mt-1 font-medium">68%</p></div>
        <div><p className="text-muted-foreground">Rain chance</p><p className="mt-1 font-medium">10%</p></div>
      </div>
    </div>
  )
}

function KnowledgeCheck() {
  const [answer, setAnswer] = useState<string | null>(null)
  const options = ['The temperature will rise quickly', 'There is a small chance of rain', 'Visibility will be poor']
  return <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex items-center gap-2"><Sparkles className="size-4 text-primary" aria-hidden="true" /><p className="text-sm font-semibold">Knowledge check</p></div>
    <p className="mt-3 font-medium">What does a 10% rain chance tell you?</p>
    <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Knowledge check answers">
      {options.map((option) => <button key={option} type="button" onClick={() => setAnswer(option)} aria-pressed={answer === option} className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm transition-colors ${answer === option ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background hover:bg-muted'}`}><span>{option}</span>{answer === option && <Check className="size-4 text-primary" aria-hidden="true" />}</button>)}
    </div>
    {answer && <p className="mt-3 text-sm text-muted-foreground">{answer === options[1] ? 'That’s right. Rain chance is the probability of measurable precipitation at your location.' : 'Almost. Look for the probability of precipitation instead.'}</p>}
  </div>
}

export default function Page() {
  const [completed, setCompleted] = useState(false)
  const [activeStep, setActiveStep] = useState('signals')
  const activeIndex = steps.findIndex((step) => step.id === activeStep)
  return <main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-8"><Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight"><span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><CloudSun className="size-4" aria-hidden="true" /></span>Mausam AI</Link><nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"><a className="text-foreground" href="#lesson">Learning center</a><a href="#reference" className="hover:text-foreground">Quick reference</a></nav></div>
        <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Search"><Search aria-hidden="true" /></Button><Button variant="outline" size="sm">My learning <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs">3</span></Button><Link href="/user-profile-and-setting" className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium" aria-label="Profile">A</Link></div>
      </div>
    </header>
    <div id="top" className="border-b border-border"><div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-3 text-xs text-muted-foreground lg:px-8"><a href="#lesson" className="hover:text-foreground">Learning center</a><ChevronRight className="size-3" aria-hidden="true" /><span>Weather fundamentals</span><ChevronRight className="size-3" aria-hidden="true" /><span className="text-foreground">Reading a forecast</span></div></div>
    <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 lg:px-8 lg:pt-14" id="lesson"><div className="max-w-3xl"><div className="flex items-center gap-2 text-sm font-medium text-primary"><BookOpen className="size-4" aria-hidden="true" /> Weather fundamentals <span className="text-muted-foreground">· 8 min lesson</span></div><h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Reading a forecast like a pro</h1><p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-muted-foreground">Turn a handful of weather signals into a clear plan for your day. We’ll start with the basics, then practice with a real forecast.</p></div><div className="mt-8 flex items-center gap-4"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={completed ? 100 : Math.round(((activeIndex + 1) / steps.length) * 100)} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completed ? 100 : ((activeIndex + 1) / steps.length) * 100}%` }} /></div><span className="text-sm font-medium text-muted-foreground">{completed ? 'Complete' : `${activeIndex + 1} of ${steps.length}`}</span></div></section>
    <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 lg:grid-cols-[220px_minmax(0,680px)_240px] lg:px-8">
      <aside className="lg:sticky lg:top-6 lg:self-start"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">In this lesson</p><nav className="mt-3 flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">{steps.map((step, index) => <button key={step.id} type="button" onClick={() => setActiveStep(step.id)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeStep === step.id ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}><span className="mr-2 text-xs text-muted-foreground">0{index + 1}</span>{step.label}</button>)}</nav><div className="mt-8 hidden rounded-xl border border-border bg-card p-4 lg:block"><Compass className="size-5 text-primary" aria-hidden="true" /><p className="mt-3 text-sm font-medium">Keep exploring</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Save this lesson to revisit the fundamentals anytime.</p></div></aside>
      <article className="flex flex-col gap-8">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">1</span><div><p className="text-sm font-medium">Read the signals</p><p className="text-xs text-muted-foreground">Start with what’s happening now</p></div></div><h2 className="mt-6 text-2xl font-semibold tracking-tight">Begin with the conditions outside</h2><p className="mt-3 leading-7 text-muted-foreground">A good forecast is a story told in layers. First, check the current conditions: temperature, how it feels, and the wind. These give you context for everything that follows.</p><div className="mt-6"><WeatherWidget /></div><p className="mt-4 text-sm leading-6 text-muted-foreground"><span className="font-medium text-foreground">Pro tip:</span> “Feels like” includes wind and humidity. It’s often a better guide for what to wear than the actual temperature.</p></section>
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">2</span><div><p className="text-sm font-medium">Follow the timeline</p><p className="text-xs text-muted-foreground">Look ahead with intention</p></div></div><h2 className="mt-6 text-2xl font-semibold tracking-tight">Use the forecast to plan, not predict</h2><p className="mt-3 leading-7 text-muted-foreground">Scan the next few hours for changes that affect your plans. A low rain chance can still matter if you’re spending the afternoon outside, while a wind shift can change how warm a walk feels.</p><div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Now</p><p className="mt-1 font-semibold">64°</p><p className="mt-1 text-xs text-muted-foreground">Partly cloudy</p></div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">3 PM</p><p className="mt-1 font-semibold">66°</p><p className="mt-1 text-xs text-muted-foreground">Mostly sunny</p></div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">6 PM</p><p className="mt-1 font-semibold">61°</p><p className="mt-1 text-xs text-muted-foreground">Cloudy</p></div></div></section>
        <KnowledgeCheck />
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">3</span><div><p className="text-sm font-medium">Check confidence</p><p className="text-xs text-muted-foreground">Know what the forecast knows</p></div></div><h2 className="mt-6 text-2xl font-semibold tracking-tight">Confidence is part of the forecast</h2><p className="mt-3 leading-7 text-muted-foreground">Weather changes. Look for patterns across several signals rather than relying on one number. When the signals disagree, give yourself a little flexibility.</p><div className="mt-5 flex items-start gap-3 rounded-lg bg-muted p-4"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-6"><span className="font-medium">You’ve got it.</span> A forecast becomes useful when it helps you make a decision with the right amount of confidence.</p></div></section>
        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"><Button variant="outline"><ArrowLeft data-icon="inline-start" aria-hidden="true" /> Previous lesson</Button><Button onClick={() => setCompleted(true)}>{completed ? 'Lesson complete' : 'Mark complete'} {completed ? <Check data-icon="inline-end" aria-hidden="true" /> : <ArrowRight data-icon="inline-end" aria-hidden="true" />}</Button></div>
      </article>
      <aside id="reference" className="flex flex-col gap-6"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick reference</p><div className="mt-3 rounded-xl border border-border bg-card p-4"><p className="text-sm font-semibold">Three signals to scan</p><ul className="mt-3 flex flex-col gap-3 text-sm text-muted-foreground"><li className="flex gap-2"><span className="text-primary">—</span>Temperature tells you what’s happening.</li><li className="flex gap-2"><span className="text-primary">—</span>Wind changes how it feels.</li><li className="flex gap-2"><span className="text-primary">—</span>Precipitation shapes your plan.</li></ul></div></div><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Up next</p><div className="mt-3 rounded-xl border border-border bg-muted/50 p-4"><p className="text-sm font-semibold">Forecast layers, decoded</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Learn what radar, satellite, and air quality maps can tell you.</p><Button variant="link" size="sm" className="mt-2 px-0">Preview lesson <ArrowRight data-icon="inline-end" aria-hidden="true" /></Button></div></div></aside>
    </div>
  </main>
}
