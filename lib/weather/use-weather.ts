'use client'

import { useCallback, useEffect, useState } from 'react'
import { getWeather, type WeatherData } from './service'

type WeatherState = {
  data: WeatherData | null
  loading: boolean
  error: string | null
}

const weatherCache = new Map<string, WeatherData>()

/** Fetches live weather for a coordinate. Refetches when lat/lon change. */
export function useWeather(latitude?: number, longitude?: number) {
  const [state, setState] = useState<WeatherState>({ data: null, loading: true, error: null })
  const cacheKey = latitude !== undefined && longitude !== undefined ? `${latitude.toFixed(3)}:${longitude.toFixed(3)}` : ''

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (latitude === undefined || longitude === undefined) return
      const cached = cacheKey ? weatherCache.get(cacheKey) : undefined
      setState((s) => ({ data: cached ?? s.data, loading: !cached, error: null }))
      try {
        const data = await getWeather(latitude, longitude, signal)
        if (!signal?.aborted) {
          if (cacheKey) weatherCache.set(cacheKey, data)
          setState({ data, loading: false, error: null })
        }
      } catch (err) {
        if (signal?.aborted) return
        setState((s) => ({
          data: s.data,
          loading: false,
          error: 'We could not load live weather right now. Check your connection and try again.',
        }))
      }
    },
    [latitude, longitude, cacheKey],
  )

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  const refresh = useCallback(() => load(), [load])

  return { ...state, refresh }
}
