'use client'

import { CornerDownLeft, FileText, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { searchArticles } from '@/lib/search'
import { cn } from '@/lib/utils'

const POPULAR = [
  'AI Daily Brief',
  'weather alerts',
  'reset password',
  'location not detected',
]

export function SearchDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchArticles(query, 7), [query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }, [])

  const go = useCallback(
    (slug: string) => {
      router.push(`/help-center/articles/${slug}`)
      close()
    },
    [router, close],
  )

  // Global shortcuts: Cmd/Ctrl+K to open, Esc handled in input
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      close()
      return
    }
    if (results.length === 0) return
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        aria-label="Search the help center"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search help</span>
        <kbd className="ml-1 hidden rounded border border-border bg-muted px-1.5 font-mono text-[11px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] sm:pt-[16vh]">
          <button
            type="button"
            aria-label="Close search"
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm animate-in fade-in-0"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search help articles"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search articles, guides, and FAQs…"
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                aria-label="Search query"
                aria-controls="search-results"
              />
              <button
                type="button"
                onClick={close}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div id="search-results" className="max-h-[52vh] overflow-y-auto p-2">
              {query && results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No results for{' '}
                  <span className="font-medium text-foreground">
                    &ldquo;{query}&rdquo;
                  </span>
                  . Try a different term or contact support.
                </p>
              )}

              {!query && (
                <div className="p-2">
                  <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2 px-1">
                    {POPULAR.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setQuery(p)}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.map((r, i) => (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => go(r.slug)}
                  onMouseMove={() => setActive(i)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    i === active ? 'bg-accent' : 'hover:bg-accent/60',
                  )}
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FileText className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {r.title}
                      </span>
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {r.categoryTitle} · {r.summary}
                    </span>
                  </span>
                  {i === active && (
                    <CornerDownLeft
                      className="mt-1 size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
