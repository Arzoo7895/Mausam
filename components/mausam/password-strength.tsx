"use client"

import { Check, X } from "lucide-react"
import { evaluatePassword } from "@/lib/validations/auth"
import { cn } from "@/lib/utils"

const barColors = [
  "bg-destructive",
  "bg-destructive",
  "bg-chart-4",
  "bg-chart-3",
  "bg-chart-3",
]

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const { score, label, checks } = evaluatePassword(password)

  return (
    <div className="mt-2 space-y-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < score ? barColors[score] : "bg-border",
              )}
            />
          ))}
        </div>
        <span className="w-16 text-right text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {checks.map((c) => (
          <li
            key={c.label}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              c.passed ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {c.passed ? (
              <Check className="size-3 text-chart-3" />
            ) : (
              <X className="size-3 text-muted-foreground/60" />
            )}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
