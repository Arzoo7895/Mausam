'use client'

import { useCallback, useEffect, useState } from 'react'

export type NotificationPreferences = {
  email: boolean
  push: boolean
  categories: string[]
}

const STORAGE_KEY = 'mausam-notification-preferences'
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email: true,
  push: true,
  categories: ['Severe Weather', 'Air Quality', 'Precipitation', 'Temperature'],
}

function readPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_PREFERENCES
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_NOTIFICATION_PREFERENCES
    const parsed = JSON.parse(stored) as Partial<NotificationPreferences>
    return {
      email: parsed.email ?? DEFAULT_NOTIFICATION_PREFERENCES.email,
      push: parsed.push ?? DEFAULT_NOTIFICATION_PREFERENCES.push,
      categories: parsed.categories ?? DEFAULT_NOTIFICATION_PREFERENCES.categories,
    }
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES
  }
}

export function saveNotificationPreferences(preferences: NotificationPreferences) {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  window.dispatchEvent(new CustomEvent('mausam-notification-preferences', { detail: preferences }))
}

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES)

  useEffect(() => {
    const sync = (event?: Event) => {
      const detail = (event as CustomEvent<NotificationPreferences> | undefined)?.detail
      setPreferences(detail ?? readPreferences())
    }
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('mausam-notification-preferences', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('mausam-notification-preferences', sync)
    }
  }, [])

  const save = useCallback((next: NotificationPreferences) => {
    saveNotificationPreferences(next)
    setPreferences(next)
  }, [])

  return { preferences, save }
}
