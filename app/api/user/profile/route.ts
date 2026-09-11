import { NextResponse } from 'next/server'
import { getProfileServer } from '@/lib/actions/profile'

export async function GET() {
  const result = await getProfileServer()
  if (!result) {
    return NextResponse.json({ authenticated: false, user: null, profile: null, preferences: null }, { status: 200 })
  }
  return NextResponse.json({ authenticated: true, ...result }, { status: 200 })
}
