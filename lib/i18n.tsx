'use client'

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { translations, getTranslation, type TranslationKey } from '@/lib/i18n/translations'

export const languageOptions = [
  ['en', 'English', 'English'],
  ['hi', 'हिन्दी', 'Hindi'],
  ['bn', 'বাংলা', 'Bengali'],
  ['mr', 'मराठी', 'Marathi'],
  ['gu', 'ગુજરાતી', 'Gujarati'],
  ['pa', 'ਪੰਜਾਬੀ', 'Punjabi'],
  ['ta', 'தமிழ்', 'Tamil'],
  ['te', 'తెలుగు', 'Telugu'],
  ['kn', 'ಕನ್ನಡ', 'Kannada'],
  ['ml', 'മലയാളം', 'Malayalam'],
  ['or', 'ଓଡ଼ିଆ', 'Odia'],
  ['as', 'অসমীয়া', 'Assamese'],
  ['ur', 'اردو', 'Urdu'],
  ['kok', 'कोंकणी', 'Konkani'],
  ['mai', 'मैथिली', 'Maithili'],
  ['sa', 'संस्कृतम्', 'Sanskrit'],
  ['ne', 'नेपाली', 'Nepali'],
  ['sd', 'सिन्धी', 'Sindhi'],
] as const

export type Language = (typeof languageOptions)[number][0]

type I18nContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  options: typeof languageOptions
  isRTL: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('mausam-language') as Language | null
      if (stored && languageOptions.some(([code]) => code === stored)) {
        setLanguageState(stored)
        document.documentElement.lang = stored
        document.documentElement.dir = stored === 'ur' ? 'rtl' : 'ltr'
      }
    } catch {}
  }, [])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      window.localStorage.setItem('mausam-language', next)
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next
      document.documentElement.dir = next === 'ur' ? 'rtl' : 'ltr'
    }
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return getTranslation(language, key, params)
    },
    [language]
  )

  const isRTL = language === 'ur'

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      options: languageOptions,
      isRTL,
    }),
    [language, setLanguage, t, isRTL]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}

