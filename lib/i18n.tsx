'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

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
] as const

export type Language = (typeof languageOptions)[number][0]
type Messages = Record<string, string>

const messages: Record<Language, Messages> = {
  en: { dashboard: 'Dashboard', overview: 'Overview', insights: 'Insights', forecast: 'Forecast', locations: 'Locations', recommendations: 'AI Recommendations', alerts: 'Alerts', settings: 'Settings', help: 'Help Center', search: 'Search', refresh: 'Refresh', useLocation: 'Use my location', loading: 'Loading weather data', retry: 'Try again', language: 'Language', save: 'Save changes' },
  hi: { dashboard: 'डैशबोर्ड', overview: 'अवलोकन', insights: 'जानकारियाँ', forecast: 'पूर्वानुमान', locations: 'स्थान', recommendations: 'AI सुझाव', alerts: 'अलर्ट', settings: 'सेटिंग्स', help: 'सहायता केंद्र', search: 'खोजें', refresh: 'रिफ्रेश', useLocation: 'मेरा स्थान उपयोग करें', loading: 'मौसम डेटा लोड हो रहा है', retry: 'फिर प्रयास करें', language: 'भाषा', save: 'बदलाव सहेजें' },
  bn: { dashboard: 'ড্যাশবোর্ড', overview: 'ওভারভিউ', insights: 'অন্তর্দৃষ্টি', forecast: 'পূর্বাভাস', locations: 'অবস্থান', recommendations: 'AI পরামর্শ', alerts: 'সতর্কতা', settings: 'সেটিংস', help: 'সহায়তা কেন্দ্র', search: 'অনুসন্ধান', refresh: 'রিফ্রেশ', useLocation: 'আমার অবস্থান ব্যবহার করুন', loading: 'আবহাওয়ার তথ্য লোড হচ্ছে', retry: 'আবার চেষ্টা করুন', language: 'ভাষা', save: 'পরিবর্তন সংরক্ষণ করুন' },
  mr: { dashboard: 'डॅशबोर्ड', overview: 'आढावा', insights: 'अंतर्दृष्टी', forecast: 'अंदाज', locations: 'स्थाने', recommendations: 'AI शिफारसी', alerts: 'सूचना', settings: 'सेटिंग्ज', help: 'मदत केंद्र', search: 'शोधा', refresh: 'रिफ्रेश', useLocation: 'माझे स्थान वापरा', loading: 'हवामान डेटा लोड होत आहे', retry: 'पुन्हा प्रयत्न करा', language: 'भाषा', save: 'बदल जतन करा' },
  gu: { dashboard: 'ડેશબોર્ડ', overview: 'ઝાંખી', insights: 'આંતરદૃષ્ટિ', forecast: 'આગાહી', locations: 'સ્થાનો', recommendations: 'AI ભલામણો', alerts: 'ચેતવણીઓ', settings: 'સેટિંગ્સ', help: 'મદદ કેન્દ્ર', search: 'શોધો', refresh: 'રિફ્રેશ', useLocation: 'મારું સ્થાન વાપરો', loading: 'હવામાન ડેટા લોડ થઈ રહ્યો છે', retry: 'ફરી પ્રયાસ કરો', language: 'ભાષા', save: 'ફેરફારો સાચવો' },
  pa: { dashboard: 'ਡੈਸ਼ਬੋਰਡ', overview: 'ਸੰਖੇਪ', insights: 'ਝਲਕ', forecast: 'ਪੂਰਵ ਅਨੁਮਾਨ', locations: 'ਸਥਾਨ', recommendations: 'AI ਸੁਝਾਅ', alerts: 'ਚੇਤਾਵਨੀਆਂ', settings: 'ਸੈਟਿੰਗਾਂ', help: 'ਮਦਦ ਕੇਂਦਰ', search: 'ਖੋਜੋ', refresh: 'ਤਾਜ਼ਾ ਕਰੋ', useLocation: 'ਮੇਰਾ ਸਥਾਨ ਵਰਤੋ', loading: 'ਮੌਸਮ ਡਾਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ', retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ', language: 'ਭਾਸ਼ਾ', save: 'ਬਦਲਾਅ ਸੰਭਾਲੋ' },
  ta: { dashboard: 'டாஷ்போர்டு', overview: 'மேலோட்டம்', insights: 'நுண்ணறிவு', forecast: 'முன்னறிவிப்பு', locations: 'இடங்கள்', recommendations: 'AI பரிந்துரைகள்', alerts: 'எச்சரிக்கைகள்', settings: 'அமைப்புகள்', help: 'உதவி மையம்', search: 'தேடல்', refresh: 'புதுப்பி', useLocation: 'என் இருப்பிடத்தைப் பயன்படுத்து', loading: 'வானிலை தரவு ஏற்றப்படுகிறது', retry: 'மீண்டும் முயற்சி', language: 'மொழி', save: 'மாற்றங்களைச் சேமி' },
  te: { dashboard: 'డాష్‌బోర్డ్', overview: 'అవలోకనం', insights: 'అంతర్దృష్టులు', forecast: 'వాతావరణ అంచనా', locations: 'స్థానాలు', recommendations: 'AI సూచనలు', alerts: 'హెచ్చరికలు', settings: 'సెట్టింగ్‌లు', help: 'సహాయ కేంద్రం', search: 'వెతకండి', refresh: 'రిఫ్రెష్', useLocation: 'నా స్థానాన్ని ఉపయోగించు', loading: 'వాతావరణ డేటా లోడ్ అవుతోంది', retry: 'మళ్లీ ప్రయత్నించండి', language: 'భాష', save: 'మార్పులను సేవ్ చేయండి' },
  kn: { dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', overview: 'ಅವಲೋಕನ', insights: 'ಒಳನೋಟಗಳು', forecast: 'ಮುನ್ಸೂಚನೆ', locations: 'ಸ್ಥಳಗಳು', recommendations: 'AI ಶಿಫಾರಸುಗಳು', alerts: 'ಎಚ್ಚರಿಕೆಗಳು', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', help: 'ಸಹಾಯ ಕೇಂದ್ರ', search: 'ಹುಡುಕಿ', refresh: 'ರಿಫ್ರೆಶ್', useLocation: 'ನನ್ನ ಸ್ಥಳ ಬಳಸಿ', loading: 'ಹವಾಮಾನ ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ', retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', language: 'ಭಾಷೆ', save: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ' },
  ml: { dashboard: 'ഡാഷ്ബോർഡ്', overview: 'അവലോകനം', insights: 'ഇൻസൈറ്റുകൾ', forecast: 'പ്രവചനം', locations: 'ലൊക്കേഷനുകൾ', recommendations: 'AI നിർദ്ദേശങ്ങൾ', alerts: 'അറിയിപ്പുകൾ', settings: 'ക്രമീകരണങ്ങൾ', help: 'സഹായ കേന്ദ്രം', search: 'തിരയുക', refresh: 'പുതുക്കുക', useLocation: 'എന്റെ സ്ഥാനം ഉപയോഗിക്കുക', loading: 'കാലാവസ്ഥാ ഡാറ്റ ലോഡ് ചെയ്യുന്നു', retry: 'വീണ്ടും ശ്രമിക്കുക', language: 'ഭാഷ', save: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക' },
}

type I18nContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: string) => string; options: typeof languageOptions }
const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  useEffect(() => {
    const stored = window.localStorage.getItem('mausam-language') as Language | null
    if (stored && languageOptions.some(([code]) => code === stored)) setLanguageState(stored)
  }, [])
  const setLanguage = (next: Language) => {
    setLanguageState(next)
    window.localStorage.setItem('mausam-language', next)
    document.documentElement.lang = next
  }
  const value = useMemo(() => ({ language, setLanguage, t: (key: string) => messages[language][key] ?? messages.en[key] ?? key, options: languageOptions }), [language])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
