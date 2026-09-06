'use client'

import { useSyncExternalStore } from 'react'
import { type GeoLocation, locationKey } from './service'

const STORAGE_KEY = 'mausam:locations'
const ACTIVE_KEY = 'mausam:active'

export const DEFAULT_LOCATIONS: GeoLocation[] = [
  { id: '1261481', name: 'New Delhi', region: 'Delhi', country: 'India', countryCode: 'IN', latitude: 28.6139, longitude: 77.209 },
  { id: '1277333', name: 'Bengaluru', region: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9716, longitude: 77.5946 },
  { id: '1275339', name: 'Mumbai', region: 'Maharashtra', country: 'India', countryCode: 'IN', latitude: 19.076, longitude: 72.8777 },
]

type State = { locations: GeoLocation[]; activeKey: string }

let state: State = {
  locations: DEFAULT_LOCATIONS,
  activeKey: locationKey(DEFAULT_LOCATIONS[0]),
}
let hydrated = false

const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.locations))
    window.localStorage.setItem(ACTIVE_KEY, state.activeKey)
  } catch {
    // ignore quota / privacy-mode errors
  }
}

function hydrate() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const active = window.localStorage.getItem(ACTIVE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as GeoLocation[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        state = {
          locations: parsed,
          activeKey: active && parsed.some((l) => locationKey(l) === active) ? active : locationKey(parsed[0]),
        }
      }
    }
  } catch {
    // fall back to defaults
  }
  emit()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  hydrate()
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === ACTIVE_KEY) {
      hydrated = false
      hydrate()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

function getSnapshot(): State {
  return state
}

const SERVER_STATE: State = { locations: DEFAULT_LOCATIONS, activeKey: locationKey(DEFAULT_LOCATIONS[0]) }

function getServerSnapshot(): State {
  return SERVER_STATE
}

export type AddResult = 'added' | 'exists'

/** Adds a location if it is not already saved (dedup by stable key). Returns whether it was new. */
export function addLocation(loc: GeoLocation, activate = true): AddResult {
  const key = locationKey(loc)
  const existing = state.locations.find((l) => locationKey(l) === key)
  if (existing) {
    if (activate) state = { ...state, activeKey: key }
    persist()
    emit()
    return 'exists'
  }
  state = {
    locations: [...state.locations, loc],
    activeKey: activate ? key : state.activeKey,
  }
  persist()
  emit()
  return 'added'
}

export function removeLocation(key: string) {
  const next = state.locations.filter((l) => locationKey(l) !== key)
  if (next.length === 0) return // never leave the user with zero locations
  state = {
    locations: next,
    activeKey: state.activeKey === key ? locationKey(next[0]) : state.activeKey,
  }
  persist()
  emit()
}

export function setActive(key: string) {
  if (!state.locations.some((l) => locationKey(l) === key)) return
  state = { ...state, activeKey: key }
  persist()
  emit()
}

export function useLocations() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const active =
    snap.locations.find((l) => locationKey(l) === snap.activeKey) ?? snap.locations[0] ?? DEFAULT_LOCATIONS[0]
  return {
    locations: snap.locations,
    active,
    activeKey: snap.activeKey,
    addLocation,
    removeLocation,
    setActive,
  }
}
