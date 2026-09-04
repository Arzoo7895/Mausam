import { Activity, Mail, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/help/breadcrumb'
import { ContactForm } from '@/components/help/contact-form'
import { SiteFooter } from '@/components/help/site-footer'
import { SiteHeader } from '@/components/help/site-header'

export const metadata: Metadata = {
  title: 'Contact Support — Mausam AI',
  description:
    'Get in touch with the Mausam AI support team. We typically reply within one business day.',
}

const CHANNELS = [
  {
    icon: Mail,
    title: 'Email support',
    desc: 'support@mausam.ai',
    detail: 'Replies within 1 business day',
  },
  {
    icon: MessageCircle,
    title: 'Community',
    desc: 'Ask the Mausam community',
    detail: 'Peer help, available 24/7',
  },
  {
    icon: Activity,
    title: 'System status',
    desc: 'Check live service health',
    detail: 'Real-time component status',
    href: '/status',
  },
]

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Breadcrumb
          items={[
            { label: 'Help Center', href: '/' },
            { label: 'Contact support' },
          ]}
        />

        <header className="mt-6">
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contact support
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Can&apos;t find an answer in the help center? Send us a message and
            our team will get back to you.
          </p>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {CHANNELS.map((c) => {
            const Icon = c.icon
            const inner = (
              <>
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {c.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{c.desc}</p>
                <p className="mt-2 text-xs text-muted-foreground">{c.detail}</p>
              </>
            )
            return c.href ? (
              <Link
                key={c.title}
                href={c.href}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={c.title}
                className="rounded-xl border border-border bg-card p-4"
              >
                {inner}
              </div>
            )
          })}
        </div>

        <div className="mt-8">
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
