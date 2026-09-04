export function WeatherBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/60 via-background to-background" />

      {/* soft aurora orbs */}
      <div className="absolute -left-24 -top-24 size-[32rem] rounded-full bg-primary/25 blur-3xl animate-drift-slow" />
      <div className="absolute -right-32 top-1/3 size-[28rem] rounded-full bg-chart-2/20 blur-3xl animate-drift-slower" />
      <div className="absolute bottom-[-10rem] left-1/3 size-[30rem] rounded-full bg-chart-3/15 blur-3xl animate-drift-slow" />

      {/* fine grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
    </div>
  )
}
