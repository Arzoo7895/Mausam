import type { GeoLocation } from '@/lib/weather/service'
import { searchLocations, reverseGeocode } from '@/lib/weather/service'

export const INDIA_COUNTRY_CODE = 'IN'

export function isIndiaLocation(location?: Pick<GeoLocation, 'countryCode' | 'country'> | null): boolean {
  if (!location) return false
  if (location.countryCode && location.countryCode.toUpperCase() === INDIA_COUNTRY_CODE) return true
  if (location.country && location.country.toLowerCase() === 'india') return true
  return false
}

export async function searchIndiaLocations(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const results = await searchLocations(query, signal)
  return results.filter(isIndiaLocation)
}

export async function resolveIndiaLocation(latitude: number, longitude: number): Promise<GeoLocation | null> {
  const location = await reverseGeocode(latitude, longitude)
  if (!isIndiaLocation(location)) {
    return null
  }
  return { ...location, countryCode: INDIA_COUNTRY_CODE, country: 'India' }
}
