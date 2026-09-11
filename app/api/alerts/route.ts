import { NextResponse } from 'next/server'
import { getAlerts } from '@/lib/alerts/service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latitude = Number(searchParams.get('latitude'))
  const longitude = Number(searchParams.get('longitude'))
  const name = (searchParams.get('name') ?? 'Current location').slice(0, 120)
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }
  return NextResponse.json(await getAlerts({ latitude, longitude, name }))
}
