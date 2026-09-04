import { Check, Info, Lightbulb, TriangleAlert } from 'lucide-react'
import type { Block } from '@/lib/help-content'
import { cn } from '@/lib/utils'

const calloutMeta = {
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    className: 'border-success/25 bg-success/5',
    iconClass: 'text-success',
  },
  info: {
    icon: Info,
    label: 'Good to know',
    className: 'border-primary/25 bg-primary/5',
    iconClass: 'text-primary',
  },
  warning: {
    icon: TriangleAlert,
    label: 'Heads up',
    className: 'border-warning/30 bg-warning/5',
    iconClass: 'text-warning',
  },
} as const

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={i}
                className="text-[15px] leading-relaxed text-foreground/90"
              >
                {block.text}
              </p>
            )
          case 'heading':
            return (
              <h2
                key={i}
                className="pt-2 font-display text-xl font-semibold tracking-tight text-foreground"
              >
                {block.text}
              </h2>
            )
          case 'list':
            return (
              <ul key={i} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[15px] leading-relaxed">
                    <Check
                      className="mt-1 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            )
          case 'steps':
            return (
              <ol key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-4">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-semibold text-primary"
                      aria-hidden="true"
                    >
                      {j + 1}
                    </span>
                    <span className="pt-0.5 text-[15px] leading-relaxed text-foreground/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            )
          case 'callout': {
            const meta = calloutMeta[block.variant]
            const Icon = meta.icon
            return (
              <div
                key={i}
                className={cn(
                  'flex gap-3 rounded-xl border p-4',
                  meta.className,
                )}
              >
                <Icon
                  className={cn('mt-0.5 size-5 shrink-0', meta.iconClass)}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {meta.label}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">
                    {block.text}
                  </p>
                </div>
              </div>
            )
          }
          default:
            return null
        }
      })}
    </div>
  )
}
