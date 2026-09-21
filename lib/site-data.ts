import {
  Bell,
  Bookmark,
  Brain,
  CloudSun,
  Gauge,
  Languages,
  type LucideIcon,
  Map,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react'

export type Feature = {
  icon: LucideIcon
  title: string
  description: string
  accent?: boolean
}

export const features: Feature[] = [
  {
    icon: CloudSun,
    title: 'Real-time weather',
    description:
      'Minute-by-minute conditions streamed from Open-Meteo, refreshed continuously so what you see is what is happening outside.',
    accent: true,
  },
  {
    icon: Brain,
    title: 'AI daily brief',
    description:
      'A concise, human-readable summary of your day — generated from raw model data and tuned to your location and habits.',
  },
  {
    icon: Bell,
    title: 'Severe weather alerts',
    description:
      'Proactive notifications for storms, heatwaves, and air-quality spikes before they reach you, not after.',
  },
  {
    icon: Thermometer,
    title: 'Hourly & 7-day forecasts',
    description:
      'Interactive temperature, precipitation, and wind timelines with the precision to plan an hour or a week ahead.',
  },
  {
    icon: Map,
    title: 'Interactive maps',
    description:
      'MapLibre-powered radar, precipitation, and temperature layers you can pan, zoom, and scrub through time.',
  },
  {
    icon: Wind,
    title: 'Air quality index',
    description:
      'Live AQI with pollutant breakdowns and clear guidance on when to mask up, ventilate, or head outside.',
  },
  {
    icon: Sun,
    title: 'UV index',
    description:
      'Real-time UV exposure with personalized protection windows so you know exactly when to reach for the sunscreen.',
  },
  {
    icon: Bookmark,
    title: 'Saved locations',
    description:
      'Pin home, work, and everywhere in between. Switch between them instantly with synced, cross-device state.',
  },
  {
    icon: Languages,
    title: 'Multi-language support',
    description:
      'Forecasts and AI briefs delivered in your language, built for a country of many.',
  },
  {
    icon: Gauge,
    title: 'Personalized recommendations',
    description:
      'Should you carry an umbrella, run at dawn, or delay a commute? Mausam turns data into decisions.',
  },
]

export type Step = {
  index: string
  title: string
  description: string
}

export const steps: Step[] = [
  {
    index: '01',
    title: 'Set your location',
    description:
      'Search any place with OpenStreetMap or drop a pin. Mausam instantly pulls hyper-local atmospheric data.',
  },
  {
    index: '02',
    title: 'AI reads the atmosphere',
    description:
      'Our models fuse dozens of signals — pressure, humidity, wind, AQI, UV — into a single, coherent picture.',
  },
  {
    index: '03',
    title: 'Get a plan, not just numbers',
    description:
      'Receive a clear daily brief, timely alerts, and recommendations tailored to how you live and move.',
  },
]

export type Stat = {
  value: number
  suffix: string
  label: string
}

export const stats: Stat[] = [
  { value: 4.2, suffix: 'B+', label: 'Weather updates processed' },
  { value: 12500, suffix: '+', label: 'Cities covered' },
  { value: 38, suffix: 'M+', label: 'AI recommendations generated' },
]

export type Comparison = {
  label: string
  traditional: string
  mausam: string
}

export const comparisons: Comparison[] = [
  {
    label: 'What you get',
    traditional: 'A wall of numbers to decode yourself',
    mausam: 'A clear brief that tells you what to do',
  },
  {
    label: 'Alerts',
    traditional: 'Generic, region-wide, often too late',
    mausam: 'Proactive, hyper-local, and personalized',
  },
  {
    label: 'Air & UV',
    traditional: 'Buried in menus, if present at all',
    mausam: 'Front and center with clear guidance',
  },
  {
    label: 'Design',
    traditional: 'Cluttered, ad-heavy, dated',
    mausam: 'Fast, free, and distraction-free',
  },
  {
    label: 'Intelligence',
    traditional: 'Static data pull',
    mausam: 'Adaptive AI that learns your patterns',
  },
]

export type Faq = {
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    question: 'Where does Mausam AI get its weather data?',
    answer:
      'We source high-resolution atmospheric data from Open-Meteo and geocode locations via OpenStreetMap Nominatim. Our AI layer fuses these signals into forecasts, briefs, and recommendations.',
  },
  {
    question: 'How accurate are the forecasts?',
    answer:
      'Mausam blends multiple numerical weather models and continuously calibrates against observed conditions. Hourly forecasts are typically reliable within a narrow margin, and confidence indicators are shown where uncertainty is higher.',
  },
  {
    question: 'Is Mausam AI free to use?',
    answer:
      'Mausam AI is completely free to use. All weather features, AI-powered insights, alerts, saved locations, air quality information, forecasts, and personalization features are available to everyone at no cost.',
  },
  {
    question: 'Does it work outside major cities?',
    answer:
      'Yes. Because we use gridded model data rather than station-only readings, Mausam delivers hyper-local forecasts for towns and rural areas, not just metros.',
  },
  {
    question: 'How is my location data handled?',
    answer:
      'Your locations are encrypted and stored securely in Supabase. We never sell personal data, and you can delete your saved locations at any time from your account.',
  },
  {
    question: 'Can I use Mausam AI in my own language?',
    answer:
      'Absolutely. Forecasts and AI-generated briefs are available in multiple languages, with more added regularly to serve a linguistically diverse audience.',
  },
]
