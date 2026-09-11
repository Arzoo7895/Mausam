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

const defaultSettings: NotificationSettings = { severeWeather: true, dailyForecast: true, airQuality: true, temperature: false, precipitation: true, email: true, push: true }

function makeAlert(input: Omit<WeatherAlert, 'timestamp' | 'relativeTime' | 'unread' | 'favorite' | 'archived'>): WeatherAlert {
  return { ...input, timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), relativeTime: 'Just now', unread: true, favorite: false, archived: false }
}

export function buildWeatherAlerts(weather: WeatherData, locationName: string): WeatherAlert[] {
  const alerts: WeatherAlert[] = []
  const current = weather.current
  const today = weather.daily[0]
  const aqi = weather.airQuality.usAqi ?? 0
  const temp = `${current.tempC}°C`
  if (current.code >= 95) alerts.push(makeAlert({ id: `storm-${locationName}`, type: 'Severe Weather', title: 'Thunderstorm risk', location: locationName, detail: 'Thunderstorms are active or expected nearby. Avoid exposed areas and secure loose outdoor items.', severity: 'critical', temperature: temp, insight: 'Lightning can remain dangerous even when rain is light.' }))
  if (today?.precipProb >= 70 || current.precipitation >= 5) alerts.push(makeAlert({ id: `rain-${locationName}`, type: 'Precipitation', title: 'Heavy rain likely', location: locationName, detail: `Rain probability is ${today?.precipProb ?? 0}% today. Plan extra travel time and avoid waterlogged routes.`, severity: today.precipProb >= 85 ? 'high' : 'medium', expiresAt: today?.date, temperature: temp }))
  if (current.tempC >= 40 || today?.maxC >= 40) alerts.push(makeAlert({ id: `heat-${locationName}`, type: 'Temperature', title: 'High heat advisory', location: locationName, detail: 'High temperatures are expected. Limit strenuous outdoor activity during the afternoon and drink water regularly.', severity: 'high', temperature: temp }))
  if (aqi >= 151) alerts.push(makeAlert({ id: `aqi-${locationName}`, type: 'Air Quality', title: 'Poor air quality', location: locationName, detail: `US AQI is ${Math.round(aqi)}. Sensitive groups should reduce prolonged outdoor exertion.`, severity: aqi >= 201 ? 'high' : 'medium', insight: 'Check local conditions before outdoor exercise.' }))
  if (current.windGustKmh >= 50) alerts.push(makeAlert({ id: `wind-${locationName}`, type: 'Severe Weather', title: 'Strong wind advisory', location: locationName, detail: `Wind gusts may reach ${current.windGustKmh} km/h. Use caution on two-wheelers and near unsecured objects.`, severity: 'medium', temperature: temp }))
  return alerts
}

export async function getAlerts(location?: { latitude: number; longitude: number; name: string }): Promise<WeatherAlert[]> {
  if (!location) return []
  try {
    return buildWeatherAlerts(await getWeather(location.latitude, location.longitude), location.name)
  } catch {
    return []
  }
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  return defaultSettings
}
