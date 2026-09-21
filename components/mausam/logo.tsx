import { cn } from "@/lib/utils"

const officialLogoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-09-19%20at%2019.27.44-diphBTjK14zaWkToICApMTDSFOtSPR.jpeg"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <img
        src={officialLogoUrl}
        alt="Mausam AI"
        className="size-9 shrink-0 rounded-xl object-cover shadow-sm"
      />
      <span className="whitespace-nowrap text-base font-semibold tracking-tight text-foreground sm:text-lg">
        Mausam<span className="text-primary"> AI</span>
      </span>
    </div>
  )
}

export { officialLogoUrl }
