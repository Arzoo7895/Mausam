'use client'

import { useSyncExternalStore, useEffect } from 'react'
import { type GeoLocation, locationKey } from './service'
import {
  getSavedLocationsServer,
  saveLocationServer,
  removeSavedLocationServer,
  setDefaultLocationServer,
} from '@/lib/actions/locations'

const STORAGE_KEY = 'mausam:locations'
const ACTIVE_KEY = 'mausam:active'

export const DEFAULT_LOCATIONS: GeoLocation[] = []

type State = {
  locations: GeoLocation[]
  activeKey: string
  isAuthenticated: boolean
  isSyncing: boolean
}

let state: State = {
  locations: DEFAULT_LOCATIONS,
  activeKey: '',
  isAuthenticated: false,
  isSyncing: false,
}

let hydrated = false
let authInitialized = false
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function persistLocal() {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.locations))
      window.localStorage.setItem(ACTIVE_KEY, state.activeKey)
    }
  } catch {
    // ignore quota / privacy-mode errors
  }
}

function hydrateLocal() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const active = window.localStorage.getItem(ACTIVE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as GeoLocation[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        state = {
          ...state,
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

export async function syncLocationsWithServer() {
  if (typeof window === 'undefined') return
  state = { ...state, isSyncing: true }
  emit()

  try {
    const serverData = await getSavedLocationsServer()
    if (serverData.authenticated) {
      state = { ...state, isAuthenticated: true }

      if (serverData.locations.length > 0) {
        // Use Supabase locations as source of truth
        const activeKey = serverData.defaultKey || locationKey(serverData.locations[0])
        state = {
          ...state,
          locations: serverData.locations,
          activeKey: state.activeKey && serverData.locations.some((l) => locationKey(l) === state.activeKey)
            ? state.activeKey
            : activeKey,
          isSyncing: false,
        }
        persistLocal()
        emit()
      } else {
        // User is authenticated but has no locations in Supabase yet.
        // If guest locations existed in localStorage, migrate them to Supabase without duplicates
        const currentLocs = state.locations
        if (currentLocs.length > 0) {
          for (let i = 0; i < currentLocs.length; i++) {
            await saveLocationServer(currentLocs[i], i === 0)
          }
          const refreshed = await getSavedLocationsServer()
          if (refreshed.locations.length > 0) {
            state = {
              ...state,
              locations: refreshed.locations,
              activeKey: refreshed.defaultKey || locationKey(refreshed.locations[0]),
              isSyncing: false,
            }
            persistLocal()
            emit()
            return
          }
        }
        state = { ...state, isSyncing: false }
        emit()
      }
    } else {
      state = { ...state, isAuthenticated: false, isSyncing: false }
      emit()
    }
  } catch {
    state = { ...state, isSyncing: false }
    emit()
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  hydrateLocal()

  if (!authInitialized && typeof window !== 'undefined') {
    authInitialized = true
    syncLocationsWithServer()
  }

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === ACTIVE_KEY) {
      hydrated = false
      hydrateLocal()
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

const SERVER_STATE: State = { locations: DEFAULT_LOCATIONS, activeKey: '', isAuthenticated: false, isSyncing: false }

function getServerSnapshot(): State {
  return SERVER_STATE
}

export type AddResult = 'added' | 'exists'

/** Adds a location if it is not already saved (dedup by stable key). */
export function addLocation(loc: GeoLocation, activate = true): AddResult {
  const key = locationKey(loc)
  const existing = state.locations.find((l) => locationKey(l) === key)
  if (existing) {
    if (activate) state = { ...state, activeKey: key }
    persistLocal()
    emit()
    return 'exists'
  }

  const nextLocations = [...state.locations, loc]
  const nextActiveKey = activate ? key : state.activeKey || key

  state = {
    ...state,
    locations: nextLocations,
    activeKey: nextActiveKey,
  }
  persistLocal()
  emit()

  // If authenticated, persist to Supabase asynchronously with duplicate protection
  if (state.isAuthenticated) {
    saveLocationServer(loc, state.locations.length === 1).catch(() => {})
  }

  return 'added'
}

export function removeLocation(key: string) {
  const target = state.locations.find((l) => locationKey(l) === key)
  const next = state.locations.filter((l) => locationKey(l) !== key)
  if (next.length === 0) return // never leave the user with zero locations

  state = {
    ...state,
    locations: next,
    activeKey: state.activeKey === key ? locationKey(next[0]) : state.activeKey,
  }
  persistLocal()
  emit()

  // If authenticated, delete from Supabase
  if (state.isAuthenticated && target) {
    const idToDelete = target.id || key
    removeSavedLocationServer(idToDelete).catch(() => {})
  }
}

export function setActive(key: string) {
  if (!state.locations.some((l) => locationKey(l) === key)) return
  state = { ...state, activeKey: key }
  persistLocal()
  emit()

  // If authenticated, mark as default in background
  if (state.isAuthenticated) {
    const target = state.locations.find((l) => locationKey(l) === key)
    if (target?.id) {
      setDefaultLocationServer(target.id).catch(() => {})
    }
  }
}

export function useLocations() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const active =
    snap.locations.find((l) => locationKey(l) === snap.activeKey) ?? snap.locations[0]

  return {
    locations: snap.locations,
    active,
    activeKey: snap.activeKey,
    isAuthenticated: snap.isAuthenticated,
    isSyncing: snap.isSyncing,
    addLocation,
    removeLocation,
    setActive,
    refreshLocations: syncLocationsWithServer,
  }
}
