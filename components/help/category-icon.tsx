import {
  Activity,
  Bell,
  Cloud,
  LifeBuoy,
  Rocket,
  Shield,
  Sparkles,
  User,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { IconKey } from '@/lib/help-content'
import { cn } from '@/lib/utils'

const map: Record<IconKey, LucideIcon> = {
  rocket: Rocket,
  user: User,
  cloud: Cloud,
  sparkles: Sparkles,
  bell: Bell,
  shield: Shield,
  wrench: Wrench,
  lifebuoy: LifeBuoy,
  activity: Activity,
}

export function CategoryIcon({
  name,
  className,
}: {
  name: IconKey
  className?: string
}) {
  const Icon = map[name] ?? Cloud
  return <Icon className={cn('size-5', className)} aria-hidden="true" />
}
