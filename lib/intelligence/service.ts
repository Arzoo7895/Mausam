import { type WeatherData, weatherCodeInfo } from '@/lib/weather/service'
import type { WeatherAlert } from '@/lib/alerts/service'

export type PersonaType = 'student' | 'farmer' | 'commuter' | 'traveler'
export type UnitPreference = 'metric' | 'imperial'

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low'
export type RecommendationCategory =
  | 'academic'
  | 'agriculture'
  | 'commute'
  | 'leisure'
  | 'health'
  | 'precaution'
  | 'timing'
  | 'clothing'
export type RecommendationSeverity = 'good' | 'info' | 'warning' | 'urgent'

export interface SummaryMetric {
  label: string
  value: string
  hint: string
  iconName: string
  tone: 'good' | 'warning' | 'urgent' | 'neutral'
}

export interface Recommendation {
  id: string
  persona: PersonaType
  priority: RecommendationPriority
  category: RecommendationCategory
  severity: RecommendationSeverity
  title: string
  guidance: string
  whyThis: string
  timeWindow?: string
  weatherStat?: string
  value?: string
  iconName: string
}

export interface RecommendationResult {
  metrics: SummaryMetric[]
  recommendations: Recommendation[]
}

export type DailyBriefTimelinePoint = {
  time: string
  title: string
  detail: string
}

export type DailyBriefData = {
  summary: string
  highlights: string[]
  risks: string[]
  recommendations: string[]
  timeline: DailyBriefTimelinePoint[]
  confidence: number // Measurable data completeness percentage (e.g. 100 if all telemetry available)
  confidenceLevel: 'High' | 'Medium' | 'Low'
  disabled?: boolean
}

export interface IntelligenceInput {
  weather: WeatherData
  alerts?: WeatherAlert[]
  persona?: PersonaType
  userName?: string
  isGuest?: boolean
  locationName?: string
  region?: string
  units?: UnitPreference
  dailyBriefEnabled?: boolean
  language?: string
}

// Unit conversion utilities
export function formatTemperature(tempC: number, unit: UnitPreference = 'metric'): string {
  if (unit === 'imperial') {
    const tempF = Math.round((tempC * 9) / 5 + 32)
    return `${tempF}°F`
  }
  return `${Math.round(tempC)}°C`
}

export function formatWindSpeed(windKmh: number, unit: UnitPreference = 'metric'): string {
  if (unit === 'imperial') {
    const windMph = Math.round(windKmh * 0.621371)
    return `${windMph} mph`
  }
  return `${Math.round(windKmh)} km/h`
}

export function formatShortTemp(tempC: number, unit: UnitPreference = 'metric'): string {
  if (unit === 'imperial') {
    return `${Math.round((tempC * 9) / 5 + 32)}°`
  }
  return `${Math.round(tempC)}°`
}

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Calculates honest data-readiness / telemetry-completeness score (0-100%)
 * based on actual available weather parameters rather than arbitrary predictions.
 */
function calculateDataCompleteness(weather: WeatherData): { score: number; level: 'High' | 'Medium' | 'Low' } {
  let score = 0
  // 1. Current atmospheric observations (temp, humidity, wind, code)
  if (weather.current && typeof weather.current.tempC === 'number' && typeof weather.current.humidity === 'number') {
    score += 35
  }
  // 2. Hourly forecast telemetry
  if (Array.isArray(weather.hourly) && weather.hourly.length >= 12) {
    score += 30
  }
  // 3. Multi-day outlook
  if (Array.isArray(weather.daily) && weather.daily.length >= 5) {
    score += 20
  }
  // 4. Air quality telemetry
  if (weather.airQuality && typeof weather.airQuality.usAqi === 'number' && weather.airQuality.usAqi > 0) {
    score += 15
  } else {
    // If AQI sensor missing, base is still good
    score += 5
  }

  const bounded = Math.min(100, Math.max(0, score))
  const level: 'High' | 'Medium' | 'Low' = bounded >= 90 ? 'High' : bounded >= 65 ? 'Medium' : 'Low'
  return { score: bounded, level }
}

const rainyCodes = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99])

function findDryWindow(weather: WeatherData): string {
  const hours = weather.hourly.slice(0, 14)
  const dryHours = hours.filter((h) => !rainyCodes.has(h.code) && h.precipProb < 40 && h.windKmh < 30)
  if (dryHours.length === 0) return 'No clear dry window'
  const first = dryHours[0].label
  const last = dryHours[Math.min(dryHours.length - 1, 4)].label
  return `${first} – ${last}`
}

/**
 * Generates personalized recommendations based on live weather data, user persona,
 * unit preference, and Phase 4 weather alerts.
 */
export function generateRecommendations(input: IntelligenceInput): RecommendationResult {
  const persona: PersonaType = input.persona ?? 'traveler'
  const units: UnitPreference = input.units ?? 'metric'
  const w = input.weather
  const current = w.current
  const today = w.daily[0]
  const aqi = w.airQuality?.usAqi ?? 0
  const location = input.locationName ?? 'your location'
  const alerts = input.alerts ?? []

  const metrics: SummaryMetric[] = []
  const recommendations: Recommendation[] = []

  const formattedTemp = formatTemperature(current.tempC, units)
  const formattedApparent = formatTemperature(current.apparentC, units)
  const formattedWind = formatWindSpeed(current.windKmh, units)
  const rainPeak = Math.max(today?.precipProb ?? 0, ...w.hourly.slice(0, 24).map((h) => h.precipProb))
  const nextDry = findDryWindow(w)
  const comfortable = current.apparentC >= 20 && current.apparentC <= 29 && current.humidity <= 75 && aqi < 100

  // 1. ESCALATE PHASE 4 SEVERE WEATHER ALERTS TO CRITICAL / HIGH RECOMMENDATIONS
  for (const alert of alerts) {
    if (alert.severity === 'critical') {
      recommendations.push({
        id: `alert-critical-${alert.id}`,
        persona,
        priority: 'critical',
        category: 'precaution',
        severity: 'urgent',
        title: `Active Alert: ${alert.title}`,
        guidance: `${alert.detail} Grounded in current atmospheric conditions for ${location}.`,
        whyThis: alert.insight || `Phase 4 alert active with critical severity in ${location}.`,
        weatherStat: alert.temperature ? alert.temperature : formattedTemp,
        iconName: 'umbrella',
      })
    } else if (alert.severity === 'high') {
      recommendations.push({
        id: `alert-high-${alert.id}`,
        persona,
        priority: 'high',
        category: 'precaution',
        severity: 'warning',
        title: `Weather Advisory: ${alert.title}`,
        guidance: `${alert.detail}`,
        whyThis: alert.insight || `Advisory in effect for ${location}.`,
        weatherStat: alert.temperature ? alert.temperature : formattedTemp,
        iconName: 'umbrella',
      })
    }
  }

  // 2. PERSONA-SPECIFIC INTELLIGENCE
  if (persona === 'student') {
    const transitHours = w.hourly.filter((h) => {
      const hr = new Date(h.time).getHours()
      return (hr >= 7 && hr <= 9) || (hr >= 14 && hr <= 17)
    })
    const transitRain = Math.max(0, ...transitHours.map((h) => h.precipProb))

    metrics.push(
      {
        label: 'Study comfort',
        value: comfortable ? 'Optimal' : current.apparentC >= 32 ? 'Heat caution' : 'Indoor preferred',
        hint: `Feels ${formattedApparent}${aqi ? ` · AQI ${Math.round(aqi)}` : ''}`,
        iconName: 'graduation',
        tone: comfortable ? 'good' : 'warning',
      },
      {
        label: 'Commute rain chance',
        value: `${transitRain}%`,
        hint: 'Class transit windows',
        iconName: 'umbrella',
        tone: transitRain >= 50 ? 'warning' : 'good',
      },
      {
        label: 'Best outdoor window',
        value: nextDry,
        hint: 'Dry and calmer hours',
        iconName: 'sun',
        tone: 'neutral',
      }
    )

    recommendations.push({
      id: `student-academic-${location}`,
      persona,
      priority: transitRain >= 60 ? 'high' : 'medium',
      category: 'academic',
      severity: transitRain >= 60 ? 'warning' : 'good',
      title: transitRain >= 60 ? 'Protect the campus commute' : 'Campus conditions look manageable',
      guidance:
        transitRain >= 60
          ? 'Pack an umbrella and waterproof backpack sleeve; leave slightly early between lecture halls.'
          : `The forecast supports an unhurried walk or commute around ${location}.`,
      whyThis: `Transit-hour precipitation probability peaks at ${transitRain}%.`,
      timeWindow: '7–9 AM · 2–5 PM',
      weatherStat: `${transitRain}% rain chance`,
      iconName: 'umbrella',
    })

    if (current.apparentC >= 32 || w.uvIndexMax >= 6) {
      recommendations.push({
        id: `student-health-${location}`,
        persona,
        priority: 'high',
        category: 'health',
        severity: 'warning',
        title: 'Plan shaded campus routes',
        guidance: 'Carry a water bottle, seek shaded corridors, and minimize direct midday sun exposure between classes.',
        whyThis: `Feels like ${formattedApparent} with maximum UV index ${Math.round(w.uvIndexMax)}.`,
        timeWindow: '11:00 AM – 3:30 PM',
        weatherStat: `Feels ${formattedApparent}`,
        iconName: 'sun',
      })
    }
  } else if (persona === 'farmer') {
    const totalRainMm = w.hourly.slice(0, 24).reduce((sum, h) => sum + (h.precipitationMm || 0), 0)
    const isCalm = current.windKmh < 15 && current.windGustKmh < 25

    metrics.push(
      {
        label: 'Irrigation outlook',
        value: rainPeak >= 50 || totalRainMm > 2 ? 'Pause watering' : 'Normal schedule',
        hint: `${Math.round(totalRainMm * 10) / 10} mm expected next 24h`,
        iconName: 'droplets',
        tone: rainPeak >= 50 || totalRainMm > 2 ? 'warning' : 'good',
      },
      {
        label: 'Spraying suitability',
        value: isCalm && rainPeak < 30 ? 'Favorable' : 'Unfavorable',
        hint: `Wind ${formattedWind}`,
        iconName: 'sprout',
        tone: isCalm && rainPeak < 30 ? 'good' : 'warning',
      },
      {
        label: 'Field work comfort',
        value: current.tempC > 34 ? 'High heat stress' : 'Good before noon',
        hint: `Current ${formattedTemp}`,
        iconName: 'sun',
        tone: current.tempC > 34 ? 'urgent' : 'good',
      }
    )

    recommendations.push({
      id: `farmer-irrigation-${location}`,
      persona,
      priority: rainPeak >= 50 || totalRainMm > 2 ? 'high' : 'medium',
      category: 'agriculture',
      severity: rainPeak >= 50 || totalRainMm > 2 ? 'warning' : 'good',
      title: rainPeak >= 50 || totalRainMm > 2 ? 'Delay planned irrigation' : 'Proceed with scheduled irrigation',
      guidance:
        rainPeak >= 50 || totalRainMm > 2
          ? 'Incoming precipitation is projected; hold off irrigation and verify bunds and drainage outlets.'
          : 'Low moisture signal over the next 24 hours supports standard crop watering cycles.',
      whyThis: `Rain probability is ${rainPeak}% with ~${Math.round(totalRainMm * 10) / 10} mm total accumulation.`,
      weatherStat: `${rainPeak}% rain · ${Math.round(totalRainMm * 10) / 10} mm`,
      iconName: 'droplets',
    })

    recommendations.push({
      id: `farmer-spraying-${location}`,
      persona,
      priority: isCalm && rainPeak < 30 ? 'medium' : 'high',
      category: 'timing',
      severity: isCalm && rainPeak < 30 ? 'good' : 'warning',
      title: isCalm && rainPeak < 30 ? 'Spraying window is open' : 'Hold chemical application',
      guidance:
        isCalm && rainPeak < 30
          ? `Calm winds (${formattedWind}) during ${nextDry} provide suitable drift-free conditions.`
          : `Wind gusts (${formatWindSpeed(current.windGustKmh, units)}) or rain risk may cause drift or runoff.`,
      whyThis: `Surface wind speed is ${formattedWind} with rain probability ${rainPeak}%.`,
      timeWindow: nextDry,
      weatherStat: `Wind ${formattedWind}`,
      iconName: 'sprout',
    })
  } else if (persona === 'commuter') {
    const rushHours = w.hourly.filter((h) => {
      const hr = new Date(h.time).getHours()
      return (hr >= 8 && hr <= 10) || (hr >= 17 && hr <= 20)
    })
    const rushRain = Math.max(0, ...rushHours.map((h) => h.precipProb))
    const isSlick = rushRain >= 45 || current.visibilityKm < 4

    metrics.push(
      {
        label: 'Commute conditions',
        value: isSlick ? 'Slick roads expected' : 'Normal transit',
        hint: `Visibility ${current.visibilityKm} km`,
        iconName: 'car',
        tone: isSlick ? 'warning' : 'good',
      },
      {
        label: 'Peak rain window',
        value: `${rushRain}%`,
        hint: 'Rush hour probability',
        iconName: 'umbrella',
        tone: rushRain >= 50 ? 'warning' : 'good',
      },
      {
        label: 'Wind & visibility',
        value: `${current.visibilityKm} km · ${formattedWind}`,
        hint: 'Current roadside observations',
        iconName: 'wind',
        tone: 'neutral',
      }
    )

    recommendations.push({
      id: `commuter-transit-${location}`,
      persona,
      priority: isSlick ? 'high' : 'medium',
      category: 'commute',
      severity: isSlick ? 'warning' : 'good',
      title: isSlick ? 'Allow extra travel buffer' : 'Commute conditions are clear',
      guidance: isSlick
        ? 'Allow 10–15 extra minutes, maintain safe two-wheeler speeds, and watch for waterlogged underpasses.'
        : `Normal traffic pacing around ${location} is supported by current atmospheric visibility.`,
      whyThis: `Rush-hour rain risk is ${rushRain}% with ${current.visibilityKm} km visibility.`,
      timeWindow: '8–10 AM · 5–8 PM',
      weatherStat: `${rushRain}% rain chance`,
      iconName: 'car',
    })
  } else {
    // Traveler persona (default)
    const comfortScore = Math.max(
      0,
      Math.min(10, 10 - rainPeak / 15 - Math.max(0, current.apparentC - 30) / 2.5 - (aqi > 100 ? 2 : 0))
    )

    metrics.push(
      {
        label: 'Sightseeing index',
        value: `${comfortScore.toFixed(1)} / 10`,
        hint: comfortScore >= 7 ? 'Favorable' : 'Indoor preferred',
        iconName: 'compass',
        tone: comfortScore >= 7 ? 'good' : 'warning',
      },
      {
        label: 'Prime outdoor window',
        value: nextDry,
        hint: 'Milder, drier hours',
        iconName: 'sun',
        tone: 'neutral',
      },
      {
        label: 'UV & thermal load',
        value: `UV ${Math.round(w.uvIndexMax)} · ${formattedTemp}`,
        hint: 'Plan outdoor protection',
        iconName: 'sun',
        tone: w.uvIndexMax >= 6 || current.tempC >= 33 ? 'warning' : 'good',
      }
    )

    recommendations.push({
      id: `traveler-leisure-${location}`,
      persona,
      priority: comfortScore < 5.5 ? 'high' : 'medium',
      category: 'leisure',
      severity: comfortScore < 5.5 ? 'warning' : 'good',
      title: comfortScore < 5.5 ? 'Keep indoor alternatives ready' : 'Pleasant window for exploration',
      guidance:
        comfortScore < 5.5
          ? `Plan covered heritage sites, museums, or cafes in ${location} during rain or peak heat.`
          : `Walking tours and outdoor exploration in ${location} are well-supported during ${nextDry}.`,
      whyThis: `Index considers ${rainPeak}% rain chance, ${formattedTemp} temperature, and air quality.`,
      timeWindow: nextDry,
      weatherStat: `${comfortScore.toFixed(1)} / 10 index`,
      iconName: 'compass',
    })
  }

  // 3. AIR QUALITY RECOMMENDATION (Universal health consideration)
  if (aqi >= 151) {
    recommendations.push({
      id: `health-aqi-${location}`,
      persona,
      priority: 'high',
      category: 'health',
      severity: 'urgent',
      title: 'Poor air quality advisory',
      guidance: 'Reduce prolonged outdoor physical exertion. Sensitive groups and morning joggers should wear N95 masks.',
      whyThis: `US AQI is currently measured at ${Math.round(aqi)} (Unhealthy).`,
      weatherStat: `AQI ${Math.round(aqi)}`,
      iconName: 'health',
    })
  } else if (aqi >= 101) {
    recommendations.push({
      id: `health-aqi-${location}`,
      persona,
      priority: 'medium',
      category: 'health',
      severity: 'warning',
      title: 'Moderate air quality',
      guidance: 'Sensitive groups should consider shifting intense outdoor exercise indoors.',
      whyThis: `US AQI is ${Math.round(aqi)} (Moderate).`,
      weatherStat: `AQI ${Math.round(aqi)}`,
      iconName: 'health',
    })
  }

  // Sort strictly by priority: critical -> high -> medium -> low
  const priorityWeight: Record<RecommendationPriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  }

  recommendations.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority])

  return { metrics, recommendations }
}

/**
 * Generates the personalized Daily Brief based on real weather observations,
 * user name, persona, Phase 4 weather alerts, and active location.
 */
export function generateDailyBrief(input: IntelligenceInput): DailyBriefData {
  if (input.dailyBriefEnabled === false) {
    return {
      summary: 'Daily Brief is currently disabled in your notification preferences.',
      highlights: ['Feature paused in settings'],
      risks: [],
      recommendations: ['Enable Daily Brief in Settings to receive personalized morning weather summaries.'],
      timeline: [],
      confidence: 0,
      confidenceLevel: 'Low',
      disabled: true,
    }
  }

  const w = input.weather
  const current = w.current
  const today = w.daily[0]
  const units = input.units ?? 'metric'
  const location = input.locationName || 'your location'
  const persona = input.persona ?? 'traveler'
  const alerts = input.alerts ?? []

  const completeness = calculateDataCompleteness(w)
  const greetingPart = getTimeOfDayGreeting()
  const nameSalutation = input.userName?.trim() ? `${greetingPart}, ${input.userName.trim()}.` : `${greetingPart}.`

  const formattedTemp = formatTemperature(current.tempC, units)
  const formattedApparent = formatTemperature(current.apparentC, units)
  const formattedHigh = today ? formatTemperature(today.maxC, units) : formattedTemp
  const formattedLow = today ? formatTemperature(today.minC, units) : formattedTemp
  const rainProb = today?.precipProb ?? 0
  const conditionLabel = weatherCodeInfo(current.code).label.toLowerCase()

  // 1. Build narrative summary from actual data
  let summarySentence = `${nameSalutation} ${location} is at ${formattedTemp} (${conditionLabel}), feeling like ${formattedApparent}. `

  // Weather outlook sentence
  if (today) {
    summarySentence += `Today's high will reach ${formattedHigh} with an overnight low of ${formattedLow}. `
  }

  // Rain / precipitation nuance
  if (rainProb >= 65 || current.precipitation >= 5) {
    summarySentence += `Rain probability is high (${rainProb}%) today — keep rain protection handy before heading out. `
  } else if (rainProb >= 30) {
    summarySentence += `There is a ${rainProb}% chance of passing showers; carry an umbrella if you are traveling later. `
  } else {
    summarySentence += `Precipitation risk is low (${rainProb}%), providing a dry window for your schedule. `
  }

  // Phase 4 Alert integration
  const criticalAlert = alerts.find((a) => a.severity === 'critical')
  const highAlert = alerts.find((a) => a.severity === 'high')
  if (criticalAlert) {
    summarySentence += `Active alert: ${criticalAlert.title} in effect for ${location}. Avoid exposed areas. `
  } else if (highAlert) {
    summarySentence += `Notice: ${highAlert.title} active in ${location}. `
  }

  // Persona-specific concluding guidance
  if (persona === 'student') {
    summarySentence += rainProb >= 50
      ? 'Ensure your laptop and study material are waterproofed before traveling to campus.'
      : 'Comfortable conditions support study sessions and campus movement.'
  } else if (persona === 'farmer') {
    summarySentence += rainProb >= 50
      ? 'Inspect crop drainage and pause scheduled irrigation until rain passes.'
      : 'Atmospheric conditions support normal farm chores and field activities.'
  } else if (persona === 'commuter') {
    summarySentence += rainProb >= 50
      ? 'Anticipate slick roads and leave 10 minutes early for rush-hour transit.'
      : 'Clear road conditions are indicated for today’s commute.'
  } else {
    summarySentence += current.tempC >= 34
      ? 'Stay hydrated and schedule sightseeing outside the peak afternoon sun.'
      : 'Great opportunity for outdoor walks and local exploration.'
  }

  // 2. Highlights
  const highlights: string[] = []
  const dryWindow = findDryWindow(w)
  highlights.push(`Best outdoor window: ${dryWindow}`)
  if (today) {
    highlights.push(`Temperature range: ${formattedLow} to ${formattedHigh}`)
  } else {
    highlights.push(`Current temperature: ${formattedTemp}`)
  }
  highlights.push(
    rainProb >= 50
      ? `Rain expected: ${rainProb}% chance today`
      : current.humidity <= 65
      ? `Pleasant humidity around ${current.humidity}%`
      : `Wind around ${formatWindSpeed(current.windKmh, units)}`
  )

  // 3. Watch-for Risks
  const risks: string[] = []
  if (criticalAlert) {
    risks.push(`${criticalAlert.title} (${criticalAlert.detail.slice(0, 70)}...)`)
  }
  if (highAlert && highAlert !== criticalAlert) {
    risks.push(highAlert.title)
  }
  if (rainProb >= 60) {
    risks.push(`Heavy rain likelihood (${rainProb}%) during peak hours`)
  }
  if (current.tempC >= 38) {
    risks.push(`Extreme heat: Maximum ${formattedHigh} with high heat index`)
  } else if (current.tempC <= 10) {
    risks.push(`Cold wave advisory: Night temperatures dipping to ${formattedLow}`)
  }
  if ((w.airQuality?.usAqi ?? 0) >= 151) {
    risks.push(`Unhealthy air quality (US AQI ${Math.round(w.airQuality?.usAqi ?? 151)})`)
  }
  if (risks.length === 0) {
    risks.push('No major atmospheric risks detected for today')
  }

  // 4. Recommendations
  const recResult = generateRecommendations(input)
  const topRecommendations = recResult.recommendations.slice(0, 3).map((r) => r.guidance)

  // 5. Timeline points (morning/now, mid-day, evening)
  const timeline: DailyBriefTimelinePoint[] = []
  const h0 = w.hourly[0]
  const h3 = w.hourly[Math.min(3, w.hourly.length - 1)]
  const h6 = w.hourly[Math.min(6, w.hourly.length - 1)]

  if (h0) {
    timeline.push({
      time: 'Now',
      title: weatherCodeInfo(h0.code).label,
      detail: `${formatShortTemp(h0.tempC, units)} · ${h0.precipProb}% rain`,
    })
  }
  if (h3) {
    timeline.push({
      time: h3.label,
      title: weatherCodeInfo(h3.code).label,
      detail: `${formatShortTemp(h3.tempC, units)} · ${h3.precipProb}% rain`,
    })
  }
  if (h6) {
    timeline.push({
      time: h6.label,
      title: weatherCodeInfo(h6.code).label,
      detail: `${formatShortTemp(h6.tempC, units)} · ${h6.precipProb}% rain`,
    })
  }

  return {
    summary: summarySentence,
    highlights,
    risks: risks.slice(0, 2),
    recommendations: topRecommendations,
    timeline,
    confidence: completeness.score,
    confidenceLevel: completeness.level,
  }
}
