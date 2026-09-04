'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={
        mounted
          ? `Switch to ${isDark ? 'light' : 'dark'} mode`
          : 'Toggle color theme'
      }
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative overflow-hidden"
    >
      {mounted ? (
        <>
          <Sun
            className={`transition-all duration-300 ${isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
          />
          <Moon
            className={`absolute transition-all duration-300 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}`}
          />
        </>
      ) : (
        <Sun />
      )}
    </Button>
  )
}
