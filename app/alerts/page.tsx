import { AlertsDashboard } from '@/components/alerts-dashboard/index.tsx'
import { getAlerts, getNotificationSettings } from '@/lib/alerts/service'

export const metadata = {
  title: 'Alerts & Notifications | Mausam AI',
  description: 'Monitor weather alerts, AI insights, and notification preferences in Mausam AI.',
}

export default async function AlertsPage() {
  const [alerts, settings] = await Promise.all([getAlerts(), getNotificationSettings()])
  return <AlertsDashboard initialAlerts={alerts} initialSettings={settings} />
}
