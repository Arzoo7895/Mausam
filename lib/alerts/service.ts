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
  sms: boolean
}

const fallbackAlerts: WeatherAlert[] = [
  { id: 'heat-1', type: 'Severe Weather', title: 'Extreme heat warning', location: 'Phoenix, AZ', detail: 'Dangerously high temperatures expected through the afternoon. Stay hydrated and avoid prolonged outdoor exposure.', timestamp: 'Today, 10:24 AM', relativeTime: '12 min ago', severity: 'critical', unread: true, favorite: true, archived: false, expiresAt: 'Today at 8:00 PM', temperature: '118°F', insight: 'Heat risk is highest between 2–5 PM. Outdoor plans should be postponed.' },
  { id: 'storm-1', type: 'Severe Weather', title: 'Severe thunderstorm watch', location: 'Austin, TX', detail: 'Strong winds and large hail are possible across the metro area this evening.', timestamp: 'Today, 9:05 AM', relativeTime: '1 hr ago', severity: 'high', unread: true, favorite: false, archived: false, expiresAt: 'Today at 11:00 PM', insight: 'Storm cells are moving northeast at 24 mph with peak activity after sunset.' },
  { id: 'air-1', type: 'Air Quality', title: 'Air quality advisory', location: 'Denver, CO', detail: 'Smoke from regional wildfires is causing unhealthy air for sensitive groups.', timestamp: 'Today, 7:42 AM', relativeTime: '3 hrs ago', severity: 'medium', unread: true, favorite: false, archived: false, expiresAt: 'Tomorrow at 10:00 AM', insight: 'AQI may improve overnight as winds shift east.' },
  { id: 'rain-1', type: 'Precipitation', title: 'Heavy rain expected', location: 'Miami, FL', detail: 'Periods of heavy rain may cause localized flooding in low-lying areas.', timestamp: 'Yesterday, 6:18 PM', relativeTime: 'Yesterday', severity: 'medium', unread: false, favorite: true, archived: false, expiresAt: 'Tomorrow at 4:00 AM', insight: 'Rainfall totals could reach 3 inches near the coast.' },
  { id: 'temp-1', type: 'Temperature', title: 'First frost expected', location: 'Chicago, IL', detail: 'Temperatures are expected to drop below freezing overnight.', timestamp: 'Yesterday, 3:11 PM', relativeTime: 'Yesterday', severity: 'low', unread: false, favorite: false, archived: false, expiresAt: 'Tomorrow at 7:00 AM' },
  { id: 'forecast-1', type: 'Daily Forecast', title: 'Your morning forecast', location: 'New York, NY', detail: 'A cool, breezy morning with clearing skies by late afternoon.', timestamp: 'Yesterday, 7:00 AM', relativeTime: 'Yesterday', severity: 'low', unread: false, favorite: false, archived: false, temperature: '64°F' },
]

export async function getAlerts(): Promise<WeatherAlert[]> {
  // The connected Supabase project is ready for persistence; this fallback keeps the route usable until its alert table schema is defined.
  return fallbackAlerts
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  return { severeWeather: true, dailyForecast: true, airQuality: true, temperature: false, precipitation: true, email: true, push: true, sms: false }
}
