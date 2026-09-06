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
  { id: 'rain-1', type: 'Severe Weather', title: 'Heavy rainfall warning', location: 'Mumbai, Maharashtra', detail: 'Intense monsoon showers are expected through the evening with a risk of waterlogging in low-lying areas. Plan your commute early.', timestamp: 'Today, 10:24 AM', relativeTime: '12 min ago', severity: 'critical', unread: true, favorite: true, archived: false, expiresAt: 'Today at 9:00 PM', temperature: '28°C', insight: 'Rainfall is heaviest between 4–7 PM. Avoid underpasses and coastal roads during high tide.' },
  { id: 'heat-1', type: 'Temperature', title: 'Heatwave advisory', location: 'New Delhi, Delhi', detail: 'High daytime temperatures with elevated humidity. Limit outdoor activity in the afternoon and stay hydrated.', timestamp: 'Today, 9:05 AM', relativeTime: '1 hr ago', severity: 'high', unread: true, favorite: false, archived: false, expiresAt: 'Today at 6:00 PM', temperature: '41°C', insight: 'Heat stress peaks between 12–4 PM. Prefer shaded routes and carry water.' },
  { id: 'air-1', type: 'Air Quality', title: 'Poor air quality alert', location: 'New Delhi, Delhi', detail: 'AQI has risen to unhealthy levels for sensitive groups. Consider limiting prolonged outdoor exertion.', timestamp: 'Today, 7:42 AM', relativeTime: '3 hrs ago', severity: 'medium', unread: true, favorite: false, archived: false, expiresAt: 'Tomorrow at 10:00 AM', insight: 'AQI may improve overnight as wind speeds increase.' },
  { id: 'storm-1', type: 'Precipitation', title: 'Thunderstorm with lightning', location: 'Kolkata, West Bengal', detail: 'Localized thunderstorms and gusty winds are likely this evening. Secure loose outdoor items.', timestamp: 'Yesterday, 6:18 PM', relativeTime: 'Yesterday', severity: 'medium', unread: false, favorite: true, archived: false, expiresAt: 'Tomorrow at 2:00 AM', insight: 'Cells are moving inland at 20 km/h with peak activity after sunset.' },
  { id: 'wind-1', type: 'Severe Weather', title: 'Strong wind advisory', location: 'Chennai, Tamil Nadu', detail: 'Coastal winds strengthening through the day. Two-wheeler riders should exercise caution.', timestamp: 'Yesterday, 3:11 PM', relativeTime: 'Yesterday', severity: 'low', unread: false, favorite: false, archived: false, expiresAt: 'Tomorrow at 7:00 AM' },
  { id: 'forecast-1', type: 'Daily Forecast', title: 'Your morning forecast', location: 'Bengaluru, Karnataka', detail: 'A mild, cloudy morning with pleasant temperatures and clearing skies by late afternoon.', timestamp: 'Yesterday, 7:00 AM', relativeTime: 'Yesterday', severity: 'low', unread: false, favorite: false, archived: false, temperature: '24°C' },
]

export async function getAlerts(): Promise<WeatherAlert[]> {
  // The connected Supabase project is ready for persistence; this fallback keeps the route usable until its alert table schema is defined.
  return fallbackAlerts
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  return { severeWeather: true, dailyForecast: true, airQuality: true, temperature: false, precipitation: true, email: true, push: true, sms: false }
}
