'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { I18nProvider } from '@/lib/i18n'
import { LocationProvider } from '@/lib/location-context'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <I18nProvider>
        <LocationProvider>
          {children}
          <Toaster position="bottom-center" />
        </LocationProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
