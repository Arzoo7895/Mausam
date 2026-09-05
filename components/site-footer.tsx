import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/brand-icons'
import { Logo } from '@/components/mausam/logo'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Showcase', href: '#showcase' },
      { label: 'Open dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why Mausam', href: '#why' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Get started', href: '/auth/sign-up' },
      { label: 'Contact', href: 'mailto:hello@mausam.ai' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help-center' },
      { label: 'Contact Support', href: '/help-center/contact' },
      { label: 'System Status', href: '/help-center/status' },
      { label: 'Sign in', href: '/login' },
    ],
  },
]

const socials = [
  { label: 'GitHub', href: 'https://github.com', Icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
  { label: 'X (Twitter)', href: 'https://x.com', Icon: XIcon },
  { label: 'Email', href: 'mailto:hello@mausam.ai', Icon: Mail },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40 px-4 pt-12 pb-6 sm:px-6 sm:pt-16 sm:pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <a href="#top" aria-label="Mausam AI home" className="inline-flex">
              <Logo />
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
              AI-powered weather intelligence that turns raw atmospheric data
              into clear, actionable decisions.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Mausam AI. Built for Smart India Hackathon.</p>
          <p className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-chart-4" />
            All systems operational · Powered by Open-Meteo
          </p>
        </div>
      </div>
    </footer>
  )
}
