import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getWeather } from '@/lib/weather/service'
import { getAlerts } from '@/lib/alerts/service'
import { generateDailyBrief, type PersonaType, type UnitPreference } from '@/lib/intelligence/service'

const inputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().max(150).optional(),
  persona: z.enum(['student', 'farmer', 'commuter', 'traveler']).optional(),
  units: z.enum(['metric', 'imperial']).optional(),
  userName: z.string().max(100).optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const input = inputSchema.parse(json)
    const locationName = input.name || 'Current location'

    const [weather, alerts] = await Promise.all([
      getWeather(input.latitude, input.longitude),
      getAlerts({ latitude: input.latitude, longitude: input.longitude, name: locationName }),
    ])

    const brief = generateDailyBrief({
      weather,
      alerts,
      persona: input.persona as PersonaType | undefined,
      userName: input.userName,
      locationName,
      units: input.units as UnitPreference | undefined,
    })

    return NextResponse.json(brief, {
      headers: { 'Cache-Control': 'private, max-age=300' },
    })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
    return NextResponse.json({ error: 'WEATHER_PROVIDER_UNAVAILABLE' }, { status: 502 })
  }
}
