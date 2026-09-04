export type StatusLevel =
  | 'operational'
  | 'degraded'
  | 'partial_outage'
  | 'major_outage'
  | 'maintenance'

export type StatusRow = {
  component: string
  description?: string
  status: StatusLevel
  sort_order?: number
  updated_at?: string
}

export const STATUS_META: Record<
  StatusLevel,
  { label: string; dotClass: string; textClass: string; badgeClass: string }
> = {
  operational: {
    label: 'Operational',
    dotClass: 'bg-success',
    textClass: 'text-success',
    badgeClass: 'bg-success/10 text-success border-success/20',
  },
  degraded: {
    label: 'Degraded performance',
    dotClass: 'bg-warning',
    textClass: 'text-warning',
    badgeClass: 'bg-warning/10 text-warning border-warning/20',
  },
  maintenance: {
    label: 'Under maintenance',
    dotClass: 'bg-primary',
    textClass: 'text-primary',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
  },
  partial_outage: {
    label: 'Partial outage',
    dotClass: 'bg-warning',
    textClass: 'text-warning',
    badgeClass: 'bg-warning/10 text-warning border-warning/20',
  },
  major_outage: {
    label: 'Major outage',
    dotClass: 'bg-destructive',
    textClass: 'text-destructive',
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/20',
  },
}

const SEVERITY: Record<StatusLevel, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  partial_outage: 3,
  major_outage: 4,
}

export function summarizeStatus(rows: StatusRow[]): {
  label: string
  dotClass: string
  level: StatusLevel
} {
  if (rows.length === 0) {
    return {
      label: 'All systems operational',
      dotClass: 'bg-success',
      level: 'operational',
    }
  }

  const worst = rows.reduce<StatusLevel>((acc, r) => {
    return SEVERITY[r.status] > SEVERITY[acc] ? r.status : acc
  }, 'operational')

  if (worst === 'operational') {
    return {
      label: 'All systems operational',
      dotClass: 'bg-success',
      level: 'operational',
    }
  }

  return {
    label: STATUS_META[worst].label,
    dotClass: STATUS_META[worst].dotClass,
    level: worst,
  }
}
