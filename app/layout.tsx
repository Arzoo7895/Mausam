import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import "./globals.css";

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mausam.ai'),
  title: {
    default: 'Mausam AI — AI-Powered Weather Intelligence',
    template: '%s · Mausam AI',
  },
  description:
    'Mausam AI turns raw atmospheric data into clear, actionable intelligence. Real-time forecasts, AI daily briefs, air quality, severe-weather alerts, and interactive maps — built for how you actually plan your day.',
  keywords: [
    'weather',
    'AI weather',
    'weather intelligence',
    'forecast',
    'air quality',
    'severe weather alerts',
    'Mausam AI',
  ],
  authors: [{ name: 'Mausam AI' }],
  openGraph: {
    title: 'Mausam AI — AI-Powered Weather Intelligence',
    description:
      'Real-time forecasts, AI daily briefs, air quality, and severe-weather alerts in one premium platform.',
    type: 'website',
    siteName: 'Mausam AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mausam AI — AI-Powered Weather Intelligence',
    description:
      'Real-time forecasts, AI daily briefs, air quality, and severe-weather alerts in one premium platform.',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#080b12' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-center" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
