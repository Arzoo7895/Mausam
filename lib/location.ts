export const LOCATION_STORAGE_KEY = 'mausam:selected-location'
export const DEFAULT_LOCATION = 'New Delhi'

export function getStoredLocation(): string {
  if (typeof window === 'undefined') return DEFAULT_LOCATION
  return window.localStorage.getItem(LOCATION_STORAGE_KEY) || DEFAULT_LOCATION
}

export function setStoredLocation(location: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCATION_STORAGE_KEY, location)
  // Let other open tabs/pages in the app react to the change.
  window.dispatchEvent(new CustomEvent('mausam:location-change', { detail: location }))
}
