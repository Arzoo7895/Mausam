import { Suspense } from 'react'
import MausamDashboard from '@/components/mausam-dashboard/mausam-dashboard'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MausamDashboard />
    </Suspense>
  )
}
