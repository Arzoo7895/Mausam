import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v1.5" />
          <path d="M5.6 5.6l1 1" />
          <path d="M18.4 5.6l-1 1" />
          <circle cx="12" cy="10" r="3" />
          <path d="M7 18.5a3.5 3.5 0 0 1 .5-6.98A5 5 0 0 1 17 13a3 3 0 0 1-.2 5.5H7Z" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Mausam<span className="text-primary"> AI</span>
      </span>
    </div>
  )
}
