import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Help Center',
  description:
    'Find answers, guides, and support for Mausam AI — the AI-powered weather intelligence platform. Search articles on forecasts, maps, the AI Daily Brief, alerts, privacy, and more.',
  keywords: [
    'Mausam AI',
    'weather help',
    'forecast support',
    'AI Daily Brief',
    'weather alerts',
  ],
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f9fc' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1220' },
  ],
}

export default function HelpCenterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
