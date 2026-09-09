export type RecommendationCategory = 'outdoor' | 'travel' | 'clothing' | 'health' | 'precaution'
export type RecommendationPersona = 'student' | 'farmer' | 'commuter' | 'traveler'
export type RecommendationSeverity = 'good' | 'info' | 'warning' | 'urgent'

export interface WeatherSnapshot {
  temperatureC?: number
  apparentTemperatureC?: number
  precipitationProbability?: number
  precipitationMm?: number
  windSpeedKmh?: number
  uvIndex?: number
  weatherCode?: number
}

export interface AirQualitySnapshot {
  pm25?: number
  usAqi?: number
}

export interface RecommendationInput {
  weather: WeatherSnapshot
  airQuality?: AirQualitySnapshot
  preferences?: { outdoorActivities?: boolean; healthConcerns?: string[] }
  persona?: RecommendationPersona
  context?: { locationName?: string; visibilityKm?: number; humidity?: number }
}

export interface Recommendation {
  category: RecommendationCategory
  severity: RecommendationSeverity
  title: string
  guidance: string
  value?: string
}

const isRainy = (code?: number, probability?: number) => (code !== undefined && [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) || (probability ?? 0) >= 55

export function createRecommendations(input: RecommendationInput): Recommendation[] {
  const { weather, airQuality } = input
  const recommendations: Recommendation[] = []
  const temp = weather.apparentTemperatureC ?? weather.temperatureC
  const rainy = isRainy(weather.weatherCode, weather.precipitationProbability)

  if (temp !== undefined && temp >= 32) recommendations.push({ category: 'precaution', severity: 'urgent', title: 'Limit midday exposure', guidance: 'Heat is intense today. Prefer shade, avoid strenuous activity from late morning to mid-afternoon, and take frequent breaks.', value: `${Math.round(temp)}° feels like` })
  else if (temp !== undefined && temp <= 8) recommendations.push({ category: 'precaution', severity: 'warning', title: 'Protect against the cold', guidance: 'Keep outdoor plans shorter and layer up, especially around sunrise and after sunset.', value: `${Math.round(temp)}° feels like` })

  if (rainy) recommendations.push({ category: 'travel', severity: 'warning', title: 'Keep rain gear close', guidance: 'Carry an umbrella or light waterproof layer. Leave a little extra time for slower, slippery roads.', value: weather.precipitationProbability !== undefined ? `${weather.precipitationProbability}% rain chance` : undefined })
  else recommendations.push({ category: 'outdoor', severity: 'good', title: 'Good window for outdoor plans', guidance: 'Conditions look comfortable for a walk, commute, or outdoor activity. Check again before heading out.', value: 'Weather looks favorable' })

  if (weather.uvIndex !== undefined && weather.uvIndex >= 6) recommendations.push({ category: 'health', severity: 'warning', title: 'Sunscreen is a must', guidance: 'Apply broad-spectrum SPF 30+ and reapply every two hours. Sunglasses and a hat will help too.', value: `UV ${Math.round(weather.uvIndex)}` })
  if (temp !== undefined && temp >= 27) recommendations.push({ category: 'health', severity: 'info', title: 'Make hydration part of the plan', guidance: 'Bring water and sip regularly, even if you do not feel thirsty. Add electrolytes for longer activity.', value: 'Hydration reminder' })

  if (airQuality?.usAqi !== undefined && airQuality.usAqi > 100) recommendations.push({ category: 'health', severity: airQuality.usAqi > 150 ? 'urgent' : 'warning', title: 'Air quality needs attention', guidance: 'Reduce prolonged outdoor exertion. If you have respiratory concerns, consider indoor plans and keep medication nearby.', value: `AQI ${Math.round(airQuality.usAqi)}` })
  if (weather.windSpeedKmh !== undefined && weather.windSpeedKmh >= 35) recommendations.push({ category: 'travel', severity: 'warning', title: 'Expect gusty conditions', guidance: 'Secure loose items, use care on two-wheelers, and allow extra caution near trees and open areas.', value: `${Math.round(weather.windSpeedKmh)} km/h wind` })

  const persona = input.persona ?? 'traveler'
  const locationName = input.context?.locationName ?? 'your area'
  if (persona === 'student') recommendations.push({ category: 'travel', severity: rainy ? 'warning' : 'good', title: rainy ? 'Protect the campus commute' : 'Good study commute window', guidance: rainy ? `Rain may slow your route around ${locationName}; carry protection and favor covered paths between classes.` : `Conditions look suitable for getting to campus and balancing indoor and outdoor study time in ${locationName}.`, value: rainy ? 'Transit caution' : 'Campus-friendly' })
  if (persona === 'farmer') recommendations.push({ category: 'outdoor', severity: rainy ? 'warning' : 'info', title: rainy ? 'Plan field work around rain' : 'Field work window is open', guidance: rainy ? 'Prioritize drainage checks and delay spray applications until leaves and soil are workable.' : `Use the clearer window in ${locationName} for field work, while monitoring humidity and irrigation needs.`, value: input.context?.humidity !== undefined ? `${input.context.humidity}% humidity` : undefined })
  if (persona === 'commuter') recommendations.push({ category: 'travel', severity: (input.context?.visibilityKm ?? 10) < 3 || rainy ? 'warning' : 'info', title: rainy ? 'Allow extra travel time' : 'Commute conditions are manageable', guidance: rainy ? 'Expect reduced road grip and possible waterlogging. Leave earlier and avoid low-lying routes.' : `Visibility and weather are currently workable for commuting through ${locationName}.`, value: input.context?.visibilityKm !== undefined ? `${input.context.visibilityKm} km visibility` : undefined })
  if (persona === 'traveler') recommendations.push({ category: 'travel', severity: rainy ? 'warning' : 'good', title: rainy ? 'Keep the itinerary flexible' : 'Good window for exploring', guidance: rainy ? 'Keep indoor alternatives ready and check the next forecast update before longer excursions.' : 'Outdoor sightseeing is supported by the current conditions; keep sun and hydration protection with you.', value: `${locationName} outlook` })

  if (recommendations.length < 3) recommendations.push({ category: 'clothing', severity: 'info', title: temp !== undefined && temp >= 24 ? 'Choose breathable layers' : 'Dress in comfortable layers', guidance: temp !== undefined && temp >= 24 ? 'Light, breathable fabrics will keep you comfortable through the day.' : 'A flexible outer layer will help you adapt as the temperature changes.', value: temp !== undefined ? `${Math.round(temp)}° now` : undefined })
  return recommendations
}
