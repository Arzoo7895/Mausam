'use client'

import { ArrowRight, FileText, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { searchArticles  } from '@/lib/search'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  'AI Daily Brief',
  'Set up alerts',
  'Change units',
  'Reset password',
]

export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchArticles(query, 6), [query])
  const showPanel = focused && query.trim().length > 0

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function go(slug: string) {
    router.push(`/articles/${slug}`)
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showPanel || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const r = results[active]
      if (r) go(r.slug)
    }
  }

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-2xl">
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border bg-card px-4 shadow-lg transition-all',
          focused
            ? 'border-primary/50 ring-4 ring-primary/10'
            : 'border-border',
        )}
      >
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onKey}
          placeholder="Search for answers — try “AI Daily Brief”"
          aria-label="Search the help center"
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-lg"
        />
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-left shadow-2xl animate-in fade-in-0 slide-in-from-top-1">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No matches. Try another term or{' '}
              <a href="/contact" className="text-primary underline-offset-4 hover:underline">
                contact support
              </a>
              .
            </p>
          ) : (
            results.map((r, i) => (
              <button
                key={r.slug}
                type="button"
                onMouseMove={() => setActive(i)}
                onClick={() => go(r.slug)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                  i === active ? 'bg-accent' : 'hover:bg-accent/60',
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileText className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {r.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {r.categoryTitle}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            ))
          )}
        </div>
      )}

      {!showPanel && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Popular:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuery(s)
                setFocused(true)
              }}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
