'use client'

import { Activity, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/help/breadcrumb'
import { ContactForm } from '@/components/help/contact-form'
import { useI18n } from '@/lib/i18n'

export function ContactContent() {
  const { t } = useI18n()

  const channels = [
    {
      icon: Mail,
      title: t('help.emailSupport'),
      desc: 'support@mausam.ai',
      detail: t('help.emailDetail'),
    },
    {
      icon: MessageCircle,
      title: t('help.community'),
      desc: t('help.communityDesc'),
      detail: t('help.communityDetail'),
    },
    {
      icon: Activity,
      title: t('help.systemStatus'),
      desc: t('help.statusDesc'),
      detail: t('help.statusDetail'),
      href: '/help-center/status',
    },
  ]

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumb
        items={[
          { label: t('nav.help'), href: '/help-center' },
          { label: t('help.contactTitle') },
        ]}
      />

      <header className="mt-6">
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('help.contactTitle')}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          {t('help.contactSubtitle')}
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {channels.map((c) => {
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
  )
}
