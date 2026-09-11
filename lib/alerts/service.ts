import { getWeather, type WeatherData } from '@/lib/weather/service'

export type AlertType = 'Severe Weather' | 'Daily Forecast' | 'Air Quality' | 'Temperature' | 'Precipitation'
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'

export type WeatherAlert = {
  id: string
  type: AlertType
  title: string
  location: string
  detail: string
  timestamp: string
  relativeTime: string
  severity: AlertSeverity
  unread: boolean
  favorite: boolean
  archived: boolean
  expiresAt?: string
  temperature?: string
  insight?: string
  latitude?: number
  longitude?: number
}

export type NotificationSettings = {
  severeWeather: boolean
  dailyForecast: boolean
  airQuality: boolean
  temperature: boolean
  precipitation: boolean
  email: boolean
  push: boolean
}

export const defaultSettings: NotificationSettings = {
  severeWeather: true,
  dailyForecast: true,
  airQuality: true,
  temperature: true,
  precipitation: true,
  email: true,
  push: true,
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function makeAlert(
  input: Omit<WeatherAlert, 'timestamp' | 'relativeTime' | 'unread' | 'favorite' | 'archived'>
): WeatherAlert {
  return {
    ...input,
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    relativeTime: 'Just now',
    unread: true,
    favorite: false,
    archived: false,
  }
}

export function buildWeatherAlerts(
  weather: WeatherData,
  locationName: string,
  coords?: { latitude: number; longitude: number }
): WeatherAlert[] {
  const alerts: WeatherAlert[] = []
  const current = weather.current
  const today = weather.daily[0]
  const aqi = weather.airQuality.usAqi ?? 0
  const temp = `${current.tempC}°C`
  const dateStr = today?.date || new Date().toISOString().slice(0, 10)
  const locSlug = slugify(locationName) || 'location'

  // 1. Severe Weather: Thunderstorm
  if (current.code >= 95 || (today?.code !== undefined && today.code >= 95)) {
    alerts.push(
      makeAlert({
        id: `storm-${locSlug}-${dateStr}`,
        type: 'Severe Weather',
        title: 'Thunderstorm risk',
        location: locationName,
        detail: 'Thunderstorms are active or expected nearby. Avoid exposed open areas and secure loose outdoor items.',
        severity: 'critical',
        temperature: temp,
        insight: 'Weather-derived insight: Atmospheric instability indicates convective cloud buildup and lightning potential.',
        expiresAt: today?.date,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
    )
  }

  // 2. Severe Weather: High Wind
  if (current.windGustKmh >= 50 || current.windKmh >= 40) {
    alerts.push(
      makeAlert({
        id: `wind-${locSlug}-${dateStr}`,
        type: 'Severe Weather',
        title: 'Strong wind advisory',
        location: locationName,
        detail: `Wind gusts may reach ${current.windGustKmh} km/h. Use caution on two-wheelers and near temporary structures.`,
        severity: 'medium',
        temperature: temp,
        insight: 'Weather-derived insight: Elevated gradient wind gusts may cause flying debris or dust plumes.',
        expiresAt: today?.date,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
    )
  }

  // 3. Precipitation: Heavy Rain
  if (today?.precipProb >= 70 || current.precipitation >= 5 || [63, 65, 81, 82].includes(current.code)) {
    alerts.push(
      makeAlert({
        id: `rain-${locSlug}-${dateStr}`,
        type: 'Precipitation',
        title: 'Heavy rain advisory',
        location: locationName,
        detail: `Precipitation probability is ${today?.precipProb ?? 0}% today. Plan extra travel time and prepare for waterlogging in low-lying areas.`,
        severity: (today?.precipProb ?? 0) >= 85 ? 'high' : 'medium',
        expiresAt: today?.date,
        temperature: temp,
        insight: 'Weather-derived insight: Radar and forecast models indicate significant moisture accumulation over the region.',
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
    )
  }

  // 4. Temperature: Heat Wave / High Heat
  if (current.tempC >= 40 || (today?.maxC !== undefined && today.maxC >= 40)) {
    alerts.push(
      makeAlert({
        id: `heat-${locSlug}-${dateStr}`,
        type: 'Temperature',
        title: 'High heat advisory',
        location: locationName,
        detail: `Maximum temperatures reaching ${Math.max(current.tempC, today?.maxC ?? 0)}°C. Avoid strenuous outdoor activity during the afternoon and hydrate regularly.`,
        severity: 'high',
        temperature: temp,
        insight: 'Weather-derived insight: Elevated heat index may lead to fatigue and heat exhaustion without adequate shade and water.',
        expiresAt: today?.date,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
    )
  }

  // 5. Temperature: Cold Wave
  if (current.tempC <= 10 || (today?.minC !== undefined && today.minC <= 10)) {
    alerts.push(
      makeAlert({
        id: `cold-${locSlug}-${dateStr}`,
        type: 'Temperature',
        title: 'Cold wave advisory',
        location: locationName,
        detail: `Temperatures dipping to ${Math.min(current.tempC, today?.minC ?? current.tempC)}°C. Wear warm layers, especially during early morning and late night travel.`,
        severity: current.tempC <= 6 || (today?.minC ?? 10) <= 6 ? 'high' : 'medium',
        temperature: temp,
        insight: 'Weather-derived insight: Dry northerly winds causing sharp temperature drop during night and morning hours.',
        expiresAt: today?.date,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
    )
  }

  // 6. Air Quality
  if (aqi >= 151) {
    alerts.push(
      makeAlert({
        id: `aqi-${locSlug}-${dateStr}`,
        type: 'Air Quality',
        title: 'Poor air quality',
        location: locationName,
        detail: `US AQI is ${Math.round(aqi)} (Unhealthy). Sensitive groups and outdoor exercisers should wear protective masks and limit outdoor exposure.`,
        severity: aqi >= 201 ? 'high' : 'medium',
        insight: 'Weather-derived insight: Elevated particulate matter concentrations trapped near ground level.',
        temperature: temp,
        expiresAt: today?.date,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
    )
  } else if (aqi >= 101) {
    alerts.push(
      makeAlert({
        id: `aqi-${locSlug}-${dateStr}`,
        type: 'Air Quality',
        title: 'Moderate air quality',
        location: locationName,
        detail: `US AQI is ${Math.round(aqi)} (Moderate). People with respiratory sensitivities should consider reducing prolonged outdoor exertion.`,
        severity: 'low',
        insight: 'Weather-derived insight: Airborne particulate concentration is elevated for sensitive demographics.',
        temperature: temp,
        expiresAt: today?.date,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
    )
  }

  // 7. Daily Forecast Briefing (always included so users have continuous actionable weather intelligence)
  const dailyTitle =
    (today?.precipProb ?? 0) >= 40
      ? 'Passing showers expected today'
      : (today?.maxC ?? 0) >= 35
      ? 'Hot and sunny outlook'
      : (today?.maxC ?? 30) <= 18
      ? 'Cool day ahead'
      : 'Pleasant weather outlook'

  alerts.push(
    makeAlert({
      id: `daily-${locSlug}-${dateStr}`,
      type: 'Daily Forecast',
      title: dailyTitle,
      location: locationName,
      detail: `Expected high of ${today?.maxC ?? current.tempC}°C and low of ${today?.minC ?? current.tempC}°C in ${locationName}. Rain probability is ${today?.precipProb ?? 0}%.`,
      severity: 'low',
      temperature: temp,
      insight: 'Weather-derived intelligence based on high-resolution numerical forecast models.',
      expiresAt: today?.date,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    })
  )

  return alerts
}

export async function getAlerts(
  location?: { latitude: number; longitude: number; name: string }
): Promise<WeatherAlert[]> {
  if (!location) return []
  try {
    const weather = await getWeather(location.latitude, location.longitude)
    return buildWeatherAlerts(weather, location.name, location)
  } catch {
    return []
  }
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  return defaultSettings
}
