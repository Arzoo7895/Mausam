import { AlertsDashboard } from '@/components/alerts-dashboard/index.tsx'
import { getUserAlertsServer, getAlertPreferencesServer } from '@/lib/actions/alerts'
import { getNotificationSettings } from '@/lib/alerts/service'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Alerts & Notifications | Mausam AI',
  description: 'Monitor weather alerts, AI insights, and notification preferences in Mausam AI.',
}

export default async function AlertsPage() {
  const [userAlertsData, prefData, fallbackSettings] = await Promise.all([
    getUserAlertsServer(),
    getAlertPreferencesServer(),
    getNotificationSettings(),
  ])

  return (
    <AlertsDashboard
      initialAlerts={userAlertsData.alerts}
      initialSettings={fallbackSettings}
      initialPreferences={prefData.preferences}
      initialLocation={userAlertsData.location}
      initialAuthenticated={userAlertsData.authenticated}
    />
  )
}
