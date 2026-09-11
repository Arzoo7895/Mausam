'use client'

import { createContext, useContext } from 'react'
import { useLocations } from '@/lib/weather/use-locations'
import type { GeoLocation } from '@/lib/weather/service'

const LocationContext = createContext<ReturnType<typeof useLocations> | null>(null)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const locations = useLocations()
  return <LocationContext.Provider value={locations}>{children}</LocationContext.Provider>
}

export function useActiveLocation() {
  const value = useContext(LocationContext)
  if (value) return value
  return useLocations()
}

export function locationLabel(location?: GeoLocation | null) {
  if (!location) return 'Choose a location'
  return [location.name, location.region].filter(Boolean).join(', ')
}
