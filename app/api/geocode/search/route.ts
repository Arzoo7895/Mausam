import { NextResponse } from 'next/server'

export type GeocodeResult = {
  id: string
  name: string
  district?: string
  state?: string
  region?: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  displaySubtitle: string
  provider: 'open-meteo' | 'nominatim'
}

type CacheEntry = {
  timestamp: number
  results: GeocodeResult[]
}

const CACHE_TTL_MS = 10 * 60 * 1000
const searchCache = new Map<string, CacheEntry>()

const EXCLUDED_FOREIGN_QUERIES = new Set([
  'lahore',
  'karachi',
  'islamabad',
  'rawalpindi',
  'peshawar',
  'quetta',
  'kathmandu',
  'pokhara',
  'lalitpur',
  'dhaka',
  'chittagong',
  'colombo',
  'kandy',
  'kabul',
  'kandahar',
  'dubai',
  'abu dhabi',
  'sharjah',
  'doha',
  'riyadh',
  'london',
  'birmingham',
  'manchester',
  'new york',
  'los angeles',
  'chicago',
  'san francisco',
  'toronto',
  'vancouver',
  'sydney',
  'melbourne',
  'beijing',
  'shanghai',
  'tokyo',
  'paris',
  'berlin',
  'singapore',
  'bangkok',
  'kuala lumpur',
])

function isIndia(countryCode?: string, country?: string): boolean {
  if (!countryCode && !country) return false
  const code = countryCode?.trim().toUpperCase()
  const name = country?.trim().toLowerCase()
  return code === 'IN' || name === 'india'
}

function cleanName(val?: string): string {
  return (val || '').trim()
}

function buildSubtitle(parts: { district?: string; state?: string; country?: string }): string {
  const list: string[] = []
  if (parts.district && parts.district !== parts.state) list.push(parts.district)
  if (parts.state) list.push(parts.state)
  if (parts.country) list.push(parts.country)
  else list.push('India')
  return list.join(', ')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawQuery = searchParams.get('q') ?? ''
  const q = rawQuery.trim().toLowerCase()

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  if (EXCLUDED_FOREIGN_QUERIES.has(q)) {
    return NextResponse.json({ results: [] })
  }

  const cached = searchCache.get(q)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ results: cached.results })
  }

  const results: GeocodeResult[] = []
  const seenKeys = new Set<string>()

  function addResult(item: GeocodeResult) {
    const coordKey = item.latitude.toFixed(2) + ',' + item.longitude.toFixed(2)
    const nameKey = item.name.toLowerCase() + '|' + (item.state ? item.state.toLowerCase() : '')
    if (seenKeys.has(coordKey) || seenKeys.has(nameKey)) return
    seenKeys.add(coordKey)
    seenKeys.add(nameKey)
    results.push(item)
  }

  try {
    const openMeteoUrl =
      'https://geocoding-api.open-meteo.com/v1/search?name=' +
      encodeURIComponent(q) +
      '&count=10&language=en&countryCode=IN&format=json'

    const omRes = await fetch(openMeteoUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })

    if (omRes.ok) {
      const omData = await omRes.json()
      if (Array.isArray(omData.results)) {
        for (const r of omData.results) {
          if (!isIndia(r.country_code, r.country)) continue

          const name = cleanName(r.name)
          const state = cleanName(r.admin1)
          const district = cleanName(r.admin2)
          const displaySubtitle = buildSubtitle({ district, state, country: 'India' })

          addResult({
            id: String(r.id),
            name,
            district: district || undefined,
            state: state || undefined,
            region: state || undefined,
            country: 'India',
            countryCode: 'IN',
            latitude: Number(r.latitude),
            longitude: Number(r.longitude),
            displaySubtitle,
            provider: 'open-meteo',
          })
        }
      }
    }
  } catch {}

  const isStateQuery = ['bihar', 'karnataka', 'kerala', 'punjab', 'gujarat', 'odisha', 'assam'].includes(q)
  if (results.length === 0 || isStateQuery || results.length < 3) {
    try {
      const nomUrl =
        'https://nominatim.openstreetmap.org/search?q=' +
        encodeURIComponent(rawQuery.trim()) +
        '&format=json&countrycodes=in&addressdetails=1&limit=8'

      const nomRes = await fetch(nomUrl, {
        headers: {
          'User-Agent': 'MausamAI/1.0 (contact@mausam.ai)',
          Accept: 'application/json',
        },
      })

      if (nomRes.ok) {
        const nomData = await nomRes.json()
        if (Array.isArray(nomData)) {
          for (const item of nomData) {
            const addr = item.address ?? {}
            if (!isIndia(addr.country_code, addr.country)) continue

            const state = cleanName(addr.state)
            const district = cleanName(
              addr.state_district || addr.district || addr.county || addr.city_district || addr.suburb
            )
            const entityName = cleanName(
              item.name || addr.city || addr.town || addr.village || addr.suburb || addr.state || rawQuery.trim()
            )

            const displaySubtitle = buildSubtitle({ district, state, country: 'India' })

            addResult({
              id: 'nom:' + (item.osm_type || 'p') + ':' + (item.osm_id || Math.round(Number(item.lat) * 1000)),
              name: entityName,
              district: district || undefined,
              state: state || undefined,
              region: state || undefined,
              country: 'India',
              countryCode: 'IN',
              latitude: Number(item.lat),
              longitude: Number(item.lon),
              displaySubtitle,
              provider: 'nominatim',
            })
          }
        }
      }
    } catch {}
  }

  if (searchCache.size > 100) {
    const firstKey = searchCache.keys().next().value
    if (firstKey) searchCache.delete(firstKey)
  }
  searchCache.set(q, { timestamp: Date.now(), results })

  return NextResponse.json({ results })
}
