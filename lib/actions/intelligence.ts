'use server'

import { createClient } from '@/lib/supabase/server'
import { getWeather } from '@/lib/weather/service'
import { getUserAlertsServer } from '@/lib/actions/alerts'
import {
  generateDailyBrief,
  generateRecommendations,
  type DailyBriefData,
  type RecommendationResult,
  type PersonaType,
  type UnitPreference,
} from '@/lib/intelligence/service'

export type WeatherIntelligenceResult = {
  authenticated: boolean
  brief: DailyBriefData
  recommendations: RecommendationResult
  locationName: string
  persona: PersonaType
  units: UnitPreference
  dailyBriefEnabled: boolean
}

export async function getWeatherIntelligenceServer(location?: {
  latitude: number
  longitude: number
  name: string
  region?: string
}): Promise<WeatherIntelligenceResult | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let userName: string | undefined = undefined
    let persona: PersonaType = 'traveler'
    let units: UnitPreference = 'metric'
    let dailyBriefEnabled = true

    let targetLoc = location

    if (user) {
      // Fetch user profile and preferences in parallel
      const [profileRes, prefRes] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
        supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle(),
      ])

      const pData = profileRes.data
      const prefData = prefRes.data

      const meta = user.user_metadata || {}
      const metaName = (
        meta.full_name?.trim() ||
        meta.name?.trim() ||
        meta.fullName?.trim() ||
        meta.display_name?.trim() ||
        ''
      )

      if (pData?.full_name?.trim()) {
        userName = pData.full_name.trim().split(/\s+/)[0]
      } else if (metaName) {
        userName = metaName.split(/\s+/)[0]
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: metaName,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' })
        } catch {}
      }

      if (prefData?.persona && ['student', 'farmer', 'commuter', 'traveler'].includes(prefData.persona)) {
        persona = prefData.persona as PersonaType
      }
      if (prefData?.temperature_unit === 'fahrenheit') {
        units = 'imperial'
      }
      if (prefData?.daily_brief !== undefined) {
        dailyBriefEnabled = Boolean(prefData.daily_brief)
      }

      // If no location passed, load user's default saved location
      if (!targetLoc) {
        const { data: savedLocs } = await supabase
          .from('saved_locations')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: true })
          .limit(1)

        if (savedLocs && savedLocs.length > 0) {
          const first = savedLocs[0]
          targetLoc = {
            name: first.name,
            region: first.region || undefined,
            latitude: first.latitude,
            longitude: first.longitude,
          }
        }
      }
    }

    if (!targetLoc) {
      return null
    }

    // Parallel fetch of weather and Phase 4 alerts
    const [weather, alertsData] = await Promise.all([
      getWeather(targetLoc.latitude, targetLoc.longitude),
      getUserAlertsServer(targetLoc),
    ])

    const intelligenceInput = {
      weather,
      alerts: alertsData.alerts,
      persona,
      userName,
      isGuest: !user,
      locationName: targetLoc.name,
      region: targetLoc.region,
      units,
      dailyBriefEnabled,
    }

    const brief = generateDailyBrief(intelligenceInput)
    const recommendations = generateRecommendations(intelligenceInput)

    return {
      authenticated: Boolean(user),
      brief,
      recommendations,
      locationName: targetLoc.name,
      persona,
      units,
      dailyBriefEnabled,
    }
  } catch (err) {
    console.error('getWeatherIntelligenceServer error:', err)
    return null
  }
}
