import { DEFAULT_LOCATION } from '@/lib/location'

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

// Demo data. Live weather/alert API is not configured, so these alerts are
// generated for the user's selected location and clearly labeled as demo data.
// Each template is stamped with the active location so the feed is always
// location-aware instead of showing unrelated foreign cities.
type AlertTemplate = Omit<WeatherAlert, 'location'>

const alertTemplates: AlertTemplate[] = [
  { id: 'severe-1', type: 'Severe Weather', title: 'Heavy rainfall warning', detail: 'The regional meteorological centre expects intense rainfall through the evening, with a risk of waterlogging on low-lying roads. Plan your commute early.', timestamp: 'Today, 10:24 AM', relativeTime: '12 min ago', severity: 'critical', unread: true, favorite: true, archived: false, expiresAt: 'Today at 9:00 PM', insight: 'Rain intensity peaks between 4–7 PM. Avoid underpasses and keep an umbrella handy.' },
  { id: 'storm-1', type: 'Severe Weather', title: 'Thunderstorm watch', detail: 'Gusty winds and lightning are possible across the metro area this evening as an active cell moves in.', timestamp: 'Today, 9:05 AM', relativeTime: '1 hr ago', severity: 'high', unread: true, favorite: false, archived: false, expiresAt: 'Today at 11:00 PM', insight: 'Storm cells are tracking northeast at 22 km/h with peak activity after sunset.' },
  { id: 'air-1', type: 'Air Quality', title: 'Air quality advisory', detail: 'AQI has risen to unhealthy levels for sensitive groups. Limit prolonged outdoor exertion and keep windows closed.', timestamp: 'Today, 7:42 AM', relativeTime: '3 hrs ago', severity: 'medium', unread: true, favorite: false, archived: false, expiresAt: 'Tomorrow at 10:00 AM', insight: 'AQI should improve overnight as surface winds pick up.' },
  { id: 'rain-1', type: 'Precipitation', title: 'Heavy rain expected', detail: 'Periods of heavy rain may cause localized flooding in low-lying areas over the next few hours.', timestamp: 'Yesterday, 6:18 PM', relativeTime: 'Yesterday', severity: 'medium', unread: false, favorite: true, archived: false, expiresAt: 'Tomorrow at 4:00 AM', insight: 'Rainfall totals could reach 70 mm near the city centre.' },
  { id: 'temp-1', type: 'Temperature', title: 'Sharp temperature drop', detail: 'Temperatures are expected to fall noticeably overnight. Keep a warm layer ready for the early morning.', timestamp: 'Yesterday, 3:11 PM', relativeTime: 'Yesterday', severity: 'low', unread: false, favorite: false, archived: false, expiresAt: 'Tomorrow at 7:00 AM', temperature: '18°C' },
  { id: 'forecast-1', type: 'Daily Forecast', title: 'Your morning forecast', detail: 'A cool, breezy morning with clearing skies by late afternoon and comfortable humidity.', timestamp: 'Yesterday, 7:00 AM', relativeTime: 'Yesterday', severity: 'low', unread: false, favorite: false, archived: false, temperature: '28°C' },
]

export function buildDemoAlerts(location: string = DEFAULT_LOCATION): WeatherAlert[] {
  const city = location?.trim() || DEFAULT_LOCATION
  return alertTemplates.map((template) => ({ ...template, location: city }))
}

export type WeatherInsight = {
  location: string
  summary: string
  highlights: string[]
  risks: string[]
  recommendations: string[]
  confidence: number
}

export function buildWeatherInsight(location: string = DEFAULT_LOCATION): WeatherInsight {
  const city = location?.trim() || DEFAULT_LOCATION
  return {
    location: city,
    summary: `The most important thing to know for ${city} today: heavy rainfall and a thunderstorm watch are the only high-impact conditions in your feed. Everything else is routine.`,
    highlights: [
      `Rain is the headline for ${city}, peaking through the evening`,
      'Comfortable morning temperatures before the system arrives',
      'Air quality is borderline for sensitive groups',
    ],
    risks: [
      'Waterlogging on low-lying roads during the evening commute',
      'Gusty winds and lightning after sunset',
    ],
    recommendations: [
      'Head out before 4 PM to beat the heaviest rain',
      'Carry a compact umbrella and a light layer',
      'Sensitive groups should limit outdoor exertion',
    ],
    confidence: 92,
  }
}

export async function getAlerts(location: string = DEFAULT_LOCATION): Promise<WeatherAlert[]> {
  // The connected Supabase project is ready for persistence; this demo data
  // keeps the route usable until a live alert source / table schema is wired up.
  return buildDemoAlerts(location)
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  return { severeWeather: true, dailyForecast: true, airQuality: true, temperature: false, precipitation: true, email: true, push: true, sms: false }
}
