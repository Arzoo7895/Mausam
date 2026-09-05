'use client'

import { AnimatePresence, motion } from 'motion/react'
import { CloudSun, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Why Mausam', href: '#why' },
  { label: 'FAQ', href: '#faq' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
        <div
          className={`flex h-14 items-center justify-between rounded-2xl border px-3 transition-all duration-300 sm:px-4 ${
            scrolled
              ? 'glass border-border shadow-lg shadow-primary/5'
              : 'border-transparent bg-transparent'
          }`}
        >
          <a
            href="#top"
            className="flex items-center gap-2 rounded-lg pl-1 font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CloudSun className="size-4.5" />
            </span>
            <span className="text-[15px]">Mausam&nbsp;AI</span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Button
              size="sm"
              nativeButton={false}
              className="hidden sm:inline-flex"
              render={<a href="/auth/sign-up" />}
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-6xl px-4 sm:px-6 md:hidden"
          >
            <div className="glass flex flex-col gap-1 rounded-2xl border border-border p-3 shadow-xl">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="mt-1 w-full"
                nativeButton={false}
                render={<a href="/auth/sign-up" onClick={() => setOpen(false)} />}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
