'use client'

import { useCallback, useEffect, useState } from 'react'
import { getWeather, type WeatherData } from './service'

type WeatherState = {
  data: WeatherData | null
  loading: boolean
  error: string | null
}

/** Fetches live weather for a coordinate. Refetches when lat/lon change. */
export function useWeather(latitude?: number, longitude?: number) {
  const [state, setState] = useState<WeatherState>({ data: null, loading: true, error: null })

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (latitude === undefined || longitude === undefined) return
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const data = await getWeather(latitude, longitude, signal)
        if (!signal?.aborted) setState({ data, loading: false, error: null })
      } catch (err) {
        if (signal?.aborted) return
        setState((s) => ({
          data: s.data,
          loading: false,
          error: 'We could not load live weather right now. Check your connection and try again.',
        }))
      }
    },
    [latitude, longitude],
  )

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  const refresh = useCallback(() => load(), [load])

  return { ...state, refresh }
}
