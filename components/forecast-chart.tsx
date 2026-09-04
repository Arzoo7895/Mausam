'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { day: 'Mon', high: 31, low: 22 },
  { day: 'Tue', high: 33, low: 24 },
  { day: 'Wed', high: 30, low: 23 },
  { day: 'Thu', high: 28, low: 21 },
  { day: 'Fri', high: 32, low: 24 },
  { day: 'Sat', high: 34, low: 25 },
  { day: 'Sun', high: 29, low: 22 },
]

export function ForecastChart() {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="high" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="low" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            domain={['dataMin - 4', 'dataMax + 2']}
          />
          <Tooltip
            cursor={{ stroke: 'var(--border)' }}
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              fontSize: 12,
              color: 'var(--popover-foreground)',
            }}
            labelStyle={{ color: 'var(--muted-foreground)' }}
          />
          <Area
            type="monotone"
            dataKey="high"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#high)"
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="var(--chart-3)"
            strokeWidth={2}
            fill="url(#low)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
