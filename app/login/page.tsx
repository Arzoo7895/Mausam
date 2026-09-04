import Link from "next/link"
import { ArrowUpRight, CloudSun, Gauge, MapPinned } from "lucide-react"
import { Logo } from "@/components/mausam/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { WeatherBackdrop } from "@/components/weather-backdrop"
import { LoginForm } from "@/components/auth/login-form"

const highlights = [
  {
    icon: CloudSun,
    title: "Hyperlocal forecasts",
    desc: "AI-refined predictions down to your street, updated continuously.",
  },
  {
    icon: Gauge,
    title: "Live conditions",
    desc: "Real-time temperature, wind, and precipitation from Open-Meteo.",
  },
  {
    icon: MapPinned,
    title: "Anywhere on the map",
    desc: "Search any location worldwide and pin the places that matter.",
  },
]

export default function LoginPage() {
  return (
    <main className="relative flex min-h-svh w-full flex-col lg:flex-row">
      {/* Brand / showcase panel */}
      <section className="relative hidden w-full overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
        <WeatherBackdrop />

        <div className="relative flex items-center justify-between">
          <Logo />
          <span className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            Weather Intelligence
          </span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight text-foreground">
            Weather intelligence, <span className="text-primary">reimagined.</span>
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Sign in to your Mausam AI workspace for precise, AI-powered forecasts and live conditions built for the
            decisions that depend on the sky.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/40 p-3.5 backdrop-blur-sm"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{title}</span>
                  <span className="block text-sm leading-relaxed text-muted-foreground">{desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">Built for Smart India Hackathon · v1.0</p>
      </section>

      {/* Form panel */}
      <section className="relative flex w-full flex-1 flex-col lg:w-1/2">
        <header className="flex items-center justify-between p-5 lg:justify-end lg:p-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 items-center justify-center px-5 pb-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>
            </div>

            <LoginForm />

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Learn more about Mausam AI
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
