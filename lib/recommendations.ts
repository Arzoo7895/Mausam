// Re-export from the single source of truth in lib/intelligence/service.ts
export type {
  PersonaType,
  RecommendationPriority,
  RecommendationCategory,
  RecommendationSeverity,
  SummaryMetric,
  Recommendation,
  RecommendationResult,
} from '@/lib/intelligence/service'

export type RecommendationPersona = import('@/lib/intelligence/service').PersonaType

export interface WeatherHour {
  time: string
  tempC: number
  code: number
  precipProb: number
  humidity: number
  windKmh: number
  precipitationMm: number
}

export interface WeatherSnapshot {
  temperatureC?: number
  apparentTemperatureC?: number
  precipitationProbability?: number
  precipitationMm?: number
  windSpeedKmh?: number
  windGustKmh?: number
  windDirection?: number
  uvIndex?: number
  weatherCode?: number
  cloudCover?: number
  visibilityKm?: number
  hourly?: WeatherHour[]
  timezone?: string
}

export interface AirQualitySnapshot {
  pm25?: number
  usAqi?: number
}

export interface RecommendationInput {
  weather: WeatherSnapshot
  airQuality?: AirQualitySnapshot
  persona?: import('@/lib/intelligence/service').PersonaType
  context?: { locationName?: string; humidity?: number }
  units?: 'metric' | 'imperial'
}

import { generateRecommendations } from '@/lib/intelligence/service'
import type { WeatherData } from '@/lib/weather/service'

export function createRecommendationResult(input: RecommendationInput) {
  const w = input.weather
  const currentTemp = w.temperatureC ?? 25
  const apparentTemp = w.apparentTemperatureC ?? currentTemp

  // Construct minimal WeatherData to feed the single intelligence engine
  const syntheticWeather: WeatherData = {
    current: {
      tempC: currentTemp,
      apparentC: apparentTemp,
      humidity: input.context?.humidity ?? 60,
      windKmh: w.windSpeedKmh ?? 10,
      windGustKmh: w.windGustKmh ?? w.windSpeedKmh ?? 12,
      windDirection: w.windDirection ?? 180,
      visibilityKm: w.visibilityKm ?? 10,
      precipitation: w.precipitationMm ?? 0,
      code: w.weatherCode ?? 0,
      cloudCover: w.cloudCover ?? 20,
      isDay: true,
    },
    hourly: (w.hourly ?? []).map((h) => ({
      time: h.time,
      label: new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true }).format(new Date(h.time)),
      tempC: h.tempC,
      code: h.code,
      precipProb: h.precipProb,
      humidity: h.humidity,
      windKmh: h.windKmh,
      precipitationMm: h.precipitationMm,
    })),
    daily: [
      {
        date: new Date().toISOString().slice(0, 10),
        label: 'Today',
        maxC: currentTemp + 4,
        minC: currentTemp - 4,
        code: w.weatherCode ?? 0,
        precipProb: w.precipitationProbability ?? 0,
        uvIndex: w.uvIndex ?? 5,
        sunrise: '06:00',
        sunset: '18:30',
      },
    ],
    airQuality: {
      usAqi: input.airQuality?.usAqi ?? 50,
      pm25: input.airQuality?.pm25 ?? 15,
    },
    uvIndexMax: w.uvIndex ?? 5,
    sunrise: '06:00',
    sunset: '18:30',
    timezone: w.timezone ?? 'Asia/Kolkata',
  }

  return generateRecommendations({
    weather: syntheticWeather,
    persona: input.persona,
    locationName: input.context?.locationName,
    units: input.units ?? 'metric',
  })
}

export function createRecommendations(input: RecommendationInput) {
  return createRecommendationResult(input).recommendations
}

const rainyCodes = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99])
export function isRainy(code?: number, probability?: number) {
  return (code !== undefined && rainyCodes.has(code)) || (probability ?? 0) >= 55
}
