import { CloudSun, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/brand-icons'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Showcase', href: '#showcase' },
      { label: 'Try Demo', href: '#showcase' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Why Mausam', href: '#why' },
      { label: 'Contact', href: 'mailto:hello@mausam.ai' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Licenses', href: '#' },
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
            <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <CloudSun className="size-4.5" />
              </span>
              Mausam AI
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
