'use client'

import { Globe } from 'lucide-react'
import { useI18n, type Language } from '@/lib/i18n'
import { useProfile } from '@/lib/profile-context'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, options } = useI18n()
  const { isGuest, saveProfile } = useProfile()

  const handleSelect = (next: Language) => {
    setLanguage(next)
    if (!isGuest) {
      saveProfile({ language: next }).catch(() => {
        // silent rollback or keep local
      })
    }
  }

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <label htmlFor="global-language-select" className="sr-only">
        Select Language
      </label>
      <Globe size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <select
        id="global-language-select"
        value={language}
        onChange={(e) => handleSelect(e.target.value as Language)}
        aria-label="Language"
        className="h-8 appearance-none rounded-lg border border-border bg-card py-1 pl-8 pr-7 text-xs font-medium text-foreground outline-none transition hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map(([code, nativeName, englishName]) => (
          <option key={code} value={code} className="bg-popover text-popover-foreground">
            {nativeName} ({englishName})
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground" aria-hidden="true">
        ▼
      </span>
    </div>
  )
}
