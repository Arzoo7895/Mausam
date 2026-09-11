import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getWeather, weatherCodeInfo } from '@/lib/weather/service'
import { createRecommendations } from '@/lib/recommendations'

const inputSchema = z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) })

export async function POST(request: Request) {
  try {
    const input = inputSchema.parse(await request.json())
    const weather = await getWeather(input.latitude, input.longitude)
    const recommendations = createRecommendations({ weather: { temperatureC: weather.current.tempC, apparentTemperatureC: weather.current.apparentC, precipitationProbability: weather.daily[0]?.precipProb, windSpeedKmh: weather.current.windKmh, uvIndex: weather.uvIndexMax, weatherCode: weather.current.code }, airQuality: weather.airQuality })
    const condition = weatherCodeInfo(weather.current.code).label.toLowerCase()
    const rain = weather.daily[0]?.precipProb ?? 0
    return NextResponse.json({ summary: `It is ${weather.current.tempC}° and ${condition} with a ${rain}% chance of rain today.`, highlights: recommendations.filter((item) => item.severity === 'good' || item.severity === 'info').slice(0, 3).map((item) => item.title), risks: recommendations.filter((item) => item.severity === 'warning' || item.severity === 'urgent').slice(0, 3).map((item) => item.title), recommendations: recommendations.slice(0, 3).map((item) => item.guidance), generatedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 'private, max-age=300' } })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
    return NextResponse.json({ error: 'WEATHER_PROVIDER_UNAVAILABLE' }, { status: 502 })
  }
}
