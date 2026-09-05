import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, CloudSun } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service · Mausam AI",
  description: "The terms that govern your use of Mausam AI.",
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/auth/sign-up"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back
      </Link>

      <div className="mt-6 flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CloudSun className="size-5" aria-hidden="true" />
        </span>
        Mausam AI
      </div>

      <h1 className="mt-6 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated September 2026</p>

      <div className="mt-8 flex flex-col gap-6 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of terms</h2>
          <p className="mt-2">
            By creating an account or using Mausam AI, you agree to these terms. Weather forecasts and the AI Daily Brief
            are provided for general informational purposes and should not be treated as official warnings.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Use of the service</h2>
          <p className="mt-2">
            You agree to use Mausam AI lawfully and not to disrupt or misuse the platform. For life-safety decisions
            during severe weather, always follow official meteorological authorities and local alerts.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Accounts</h2>
          <p className="mt-2">
            You are responsible for keeping your account credentials secure. Forecast data is sourced from Open-Meteo and
            places from OpenStreetMap.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Contact</h2>
          <p className="mt-2">
            Questions about these terms? Visit the{" "}
            <Link href="/help-center/contact" className="font-medium text-primary hover:underline">
              Help Center
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
