import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, CloudSun } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy · Mausam AI",
  description: "How Mausam AI collects, uses, and protects your data.",
}

export default function PrivacyPage() {
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

      <h1 className="mt-6 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated September 2026</p>

      <div className="mt-8 flex flex-col gap-6 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
          <p className="mt-2">
            We collect the information needed to run your account — your email, saved locations, and preferences. Your
            location is used only to deliver accurate forecasts, maps, and alerts.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">How we use it</h2>
          <p className="mt-2">
            Data personalizes your forecasts and the AI Daily Brief. We do not sell your personal data. You can revoke
            location access at any time from your device or browser settings.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Your controls</h2>
          <p className="mt-2">
            You can review and update your details in{" "}
            <Link href="/user-profile-and-setting" className="font-medium text-primary hover:underline">
              Profile &amp; Settings
            </Link>{" "}
            at any time.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Reach us through the{" "}
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
