import type { GeoLocation } from '@/lib/weather/service'
import { searchLocations, reverseGeocode } from '@/lib/weather/service'

export const INDIA_COUNTRY_CODE = 'IN'

export async function searchIndiaLocations(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const results = await searchLocations(query, signal)
  return results.filter((location) => !location.countryCode || location.countryCode.toUpperCase() === INDIA_COUNTRY_CODE)
}

export async function resolveIndiaLocation(latitude: number, longitude: number): Promise<GeoLocation> {
  const location = await reverseGeocode(latitude, longitude)
  return { ...location, countryCode: location.countryCode ?? INDIA_COUNTRY_CODE, country: location.country ?? 'India' }
}

export function isIndiaLocation(location?: Pick<GeoLocation, 'countryCode'> | null) {
  return !location?.countryCode || location.countryCode.toUpperCase() === INDIA_COUNTRY_CODE
}
