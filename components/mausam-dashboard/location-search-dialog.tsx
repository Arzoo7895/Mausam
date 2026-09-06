'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, MapPin, Search, X } from 'lucide-react'
import { type GeoLocation, searchLocations } from '@/lib/weather/service'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (location: GeoLocation) => void
}

export function LocationSearchDialog({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setError(null)
      setTouched(false)
      // Focus after the dialog paints.
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Debounced live search against Open-Meteo geocoding.
  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setTouched(true)
    const t = setTimeout(async () => {
      try {
        const found = await searchLocations(q, controller.signal)
        setResults(found)
        setError(null)
      } catch (err) {
        if (!controller.signal.aborted) setError('Search is unavailable right now. Please try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 300)
    return () => {
      controller.abort()
      clearTimeout(t)
    }
  }, [query, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/30 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search for a location"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city or town…"
            aria-label="Search for a city or town"
            className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} aria-label="Close search" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {loading && (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" /> Searching…
            </div>
          )}

          {!loading && error && (
            <p role="alert" className="px-4 py-10 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          {!loading && !error && results.length === 0 && touched && query.trim().length >= 2 && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No places found for &ldquo;{query.trim()}&rdquo;. Try another spelling.
            </p>
          )}

          {!loading && !error && !touched && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Start typing to find any city in the world.
            </p>
          )}

          {!loading &&
            !error &&
            results.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onSelect(loc)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
              >
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <MapPin size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{loc.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[loc.region, loc.country].filter(Boolean).join(', ')}
                  </span>
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
