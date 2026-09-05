import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center — Mausam AI',
  description:
    'Find answers, guides, and support for Mausam AI — the AI-powered weather intelligence platform. Search articles on forecasts, maps, the AI Daily Brief, alerts, privacy, and more.',
  generator: 'v0.app',
  keywords: [
    'Mausam AI',
    'weather help',
    'forecast support',
    'AI Daily Brief',
    'weather alerts',
  ],
}

export default function HelpCenterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
