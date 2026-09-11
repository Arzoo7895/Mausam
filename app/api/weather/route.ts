import { NextResponse } from 'next/server'
import { getWeather } from '@/lib/weather/service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latitude = Number(searchParams.get('latitude'))
  const longitude = Number(searchParams.get('longitude'))
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }
  try {
    const weather = await getWeather(latitude, longitude)
    return NextResponse.json(weather, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } })
  } catch {
    return NextResponse.json({ error: 'WEATHER_PROVIDER_UNAVAILABLE' }, { status: 502 })
  }
}
