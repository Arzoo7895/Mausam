// Real weather + geocoding data via Open-Meteo (no API key required, CORS-enabled).
// Reverse geocoding uses BigDataCloud's keyless client endpoint.

export type GeoLocation = {
  id: string
  name: string
  region?: string
  country?: string
  countryCode?: string
  latitude: number
  longitude: number
}

export type WeatherCodeInfo = {
  label: string
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'fog'
}

export type HourPoint = {
  time: string
  label: string
  tempC: number
  code: number
  precipProb: number
  humidity: number
  windKmh: number
  precipitationMm: number
}
export type DayPoint = {
  date: string
  label: string
  maxC: number
  minC: number
  code: number
  precipProb: number
  uvIndex: number
  sunrise: string
  sunset: string
}

export type WeatherData = {
  current: {
    tempC: number
    apparentC: number
    humidity: number
    windKmh: number
    visibilityKm: number
    precipitation: number
    code: number
    isDay: boolean
  }
  hourly: HourPoint[]
  daily: DayPoint[]
  uvIndexMax: number
  sunrise: string
  sunset: string
  airQuality: { usAqi?: number; pm25?: number }
  timezone: string
}

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

// Stable identity for dedup: prefer a provider id, else normalized name + rounded coords.
export function locationKey(loc: Pick<GeoLocation, 'id' | 'name' | 'latitude' | 'longitude'>): string {
  if (loc.id && !loc.id.startsWith('coord:')) return `id:${loc.id}`
  return `geo:${normalizeName(loc.name)}|${loc.latitude.toFixed(2)}|${loc.longitude.toFixed(2)}`
}

export function weatherCodeInfo(code: number): WeatherCodeInfo {
  if (code === 0) return { label: 'Clear sky', icon: 'sun' }
  if (code === 1) return { label: 'Mostly clear', icon: 'sun' }
  if (code === 2) return { label: 'Partly cloudy', icon: 'cloud' }
  if (code === 3) return { label: 'Overcast', icon: 'cloud' }
  if (code === 45 || code === 48) return { label: 'Foggy', icon: 'fog' }
  if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: 'rain' }
  if (code >= 61 && code <= 67) return { label: 'Rain', icon: 'rain' }
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'snow' }
  if (code >= 80 && code <= 82) return { label: 'Rain showers', icon: 'rain' }
  if (code >= 85 && code <= 86) return { label: 'Snow showers', icon: 'snow' }
  if (code >= 95) return { label: 'Thunderstorm', icon: 'rain' }
  return { label: 'Unknown', icon: 'cloud' }
}

export async function searchLocations(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const q = query.trim()
  if (q.length < 2) return []
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(q)}&count=8&language=en&format=json`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error('Location search failed')
  const data = await res.json()
  if (!Array.isArray(data.results)) return []
  return data.results.map((r: any) => ({
    id: String(r.id),
    name: r.name,
    region: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation> {
  const fallback: GeoLocation = {
    id: `coord:${latitude.toFixed(3)},${longitude.toFixed(3)}`,
    name: 'My location',
    latitude,
    longitude,
  }
  try {
    const url = `${REVERSE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    const res = await fetch(url)
    if (!res.ok) return fallback
    const data = await res.json()
    const name = data.city || data.locality || data.principalSubdivision || 'My location'
    return {
      id: `coord:${latitude.toFixed(3)},${longitude.toFixed(3)}`,
      name,
      region: data.principalSubdivision || undefined,
      country: data.countryName || undefined,
      countryCode: data.countryCode || undefined,
      latitude,
      longitude,
    }
  } catch {
    return fallback
  }
}

export async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('unsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 12000,
      maximumAge: 5 * 60 * 1000,
    })
  })
}

export async function getWeather(latitude: number, longitude: number, signal?: AbortSignal): Promise<WeatherData> {
  const forecastUrl =
    `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,visibility` +
    `&hourly=temperature_2m,weather_code,precipitation_probability,relative_humidity_2m,wind_speed_10m,precipitation` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset` +
    `&timezone=auto&forecast_days=7`

  const airUrl = `${AIR_URL}?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5&timezone=auto`

  const [forecastRes, airRes] = await Promise.all([
    fetch(forecastUrl, { signal }),
    fetch(airUrl, { signal }).catch(() => null),
  ])

  if (!forecastRes.ok) throw new Error('Weather request failed')
  const f = await forecastRes.json()

  const now = new Date()
  const hourlyTimes: string[] = f.hourly?.time ?? []
  // Find the index nearest to the current hour to start the timeline "Now".
  let startIdx = hourlyTimes.findIndex((t) => new Date(t).getTime() >= now.getTime() - 30 * 60 * 1000)
  if (startIdx < 0) startIdx = 0

  const hourly: HourPoint[] = hourlyTimes.slice(startIdx, startIdx + 9).map((time, i) => {
    const idx = startIdx + i
    const d = new Date(time)
    return {
      time,
      label: i === 0 ? 'Now' : d.toLocaleTimeString('en-US', { hour: 'numeric' }),
      tempC: Math.round(f.hourly.temperature_2m[idx]),
      code: f.hourly.weather_code[idx],
      precipProb: f.hourly.precipitation_probability?.[idx] ?? 0,
      humidity: Math.round(f.hourly.relative_humidity_2m?.[idx] ?? f.current.relative_humidity_2m ?? 0),
      windKmh: Math.round(f.hourly.wind_speed_10m?.[idx] ?? f.current.wind_speed_10m ?? 0),
      precipitationMm: Number((f.hourly.precipitation?.[idx] ?? 0).toFixed(1)),
    }
  })

  const dailyTimes: string[] = f.daily?.time ?? []
  const daily: DayPoint[] = dailyTimes.map((date, i) => {
    const d = new Date(date)
    return {
      date,
      label: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      maxC: Math.round(f.daily.temperature_2m_max[i]),
      minC: Math.round(f.daily.temperature_2m_min[i]),
      code: f.daily.weather_code[i],
      precipProb: f.daily.precipitation_probability_max?.[i] ?? 0,
      uvIndex: Math.round(f.daily.uv_index_max?.[i] ?? 0),
      sunrise: f.daily.sunrise?.[i] ?? '',
      sunset: f.daily.sunset?.[i] ?? '',
    }
  })

  let airQuality: { usAqi?: number; pm25?: number } = {}
  if (airRes && airRes.ok) {
    try {
      const a = await airRes.json()
      airQuality = { usAqi: a.current?.us_aqi, pm25: a.current?.pm2_5 }
    } catch {
      airQuality = {}
    }
  }

  return {
    current: {
      tempC: Math.round(f.current.temperature_2m),
      apparentC: Math.round(f.current.apparent_temperature),
      humidity: Math.round(f.current.relative_humidity_2m),
      windKmh: Math.round(f.current.wind_speed_10m),
      visibilityKm: Math.round((f.current.visibility ?? 0) / 1000),
      precipitation: f.current.precipitation ?? 0,
      code: f.current.weather_code,
      isDay: f.current.is_day === 1,
    },
    hourly,
    daily,
    uvIndexMax: Math.round(f.daily?.uv_index_max?.[0] ?? 0),
    sunrise: f.daily?.sunrise?.[0] ?? '',
    sunset: f.daily?.sunset?.[0] ?? '',
    airQuality,
    timezone: f.timezone ?? 'auto',
  }
}

export function formatTime(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
