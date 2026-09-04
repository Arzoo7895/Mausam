export type IconKey =
  | 'rocket'
  | 'user'
  | 'cloud'
  | 'sparkles'
  | 'bell'
  | 'shield'
  | 'wrench'
  | 'lifebuoy'
  | 'activity'

export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'steps'; items: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; variant: 'tip' | 'info' | 'warning'; text: string }

export type Faq = { q: string; a: string }

export type Article = {
  slug: string
  title: string
  summary: string
  category: string
  readMinutes: number
  updated: string
  tags: string[]
  blocks: Block[]
  faqs: Faq[]
  related: string[]
}

export type Category = {
  slug: string
  title: string
  description: string
  icon: IconKey
}

export const categories: Category[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Set up Mausam AI and learn the essentials in minutes.',
    icon: 'rocket',
  },
  {
    slug: 'account-profile',
    title: 'Account & Profile',
    description: 'Manage sign-in, saved locations, units, and preferences.',
    icon: 'user',
  },
  {
    slug: 'forecasts-maps',
    title: 'Forecasts & Maps',
    description: 'Read forecasts and explore interactive weather maps.',
    icon: 'cloud',
  },
  {
    slug: 'ai-daily-brief',
    title: 'AI Daily Brief',
    description: 'Understand how your personalized brief is generated.',
    icon: 'sparkles',
  },
  {
    slug: 'notifications-alerts',
    title: 'Notifications & Alerts',
    description: 'Configure severe weather alerts and daily nudges.',
    icon: 'bell',
  },
  {
    slug: 'privacy-security',
    title: 'Privacy & Security',
    description: 'Learn how your data and location are protected.',
    icon: 'shield',
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Fix common issues with data, location, and sync.',
    icon: 'wrench',
  },
  {
    slug: 'contact-support',
    title: 'Contact Support',
    description: 'Reach our team and check platform status.',
    icon: 'lifebuoy',
  },
]

export const articles: Article[] = [
  // ---------- Getting Started ----------
  {
    slug: 'welcome-to-mausam-ai',
    title: 'Welcome to Mausam AI',
    summary:
      'A quick tour of the dashboard, forecasts, maps, and your AI Daily Brief.',
    category: 'getting-started',
    readMinutes: 3,
    updated: '2026-08-20',
    tags: ['overview', 'dashboard', 'basics'],
    blocks: [
      {
        type: 'paragraph',
        text: 'Mausam AI turns raw meteorological data into clear, human answers. Instead of scanning numbers, you get a plain-language read on what the weather means for your day — plus the depth of charts and maps when you want them.',
      },
      { type: 'heading', text: 'The three surfaces you will use most' },
      {
        type: 'list',
        items: [
          'Dashboard — current conditions, hourly and 16-day outlook, and your AI Daily Brief at the top.',
          'Maps — radar, precipitation, temperature, and wind layers you can scrub through time.',
          'Alerts — severe weather warnings and daily nudges tuned to the locations you care about.',
        ],
      },
      { type: 'heading', text: 'Get oriented in a minute' },
      {
        type: 'steps',
        items: [
          'Add your first location using the search bar at the top of the dashboard.',
          'Allow location access to auto-detect where you are (optional).',
          'Open the AI Daily Brief card to read today’s summary.',
          'Switch between light and dark mode from the top-right toggle.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Star a location to pin it to the top of your dashboard and receive its alerts.',
      },
    ],
    faqs: [
      {
        q: 'Do I need an account to see the forecast?',
        a: 'No. You can view forecasts and maps without an account. An account is only needed to save locations, sync preferences, and receive alerts.',
      },
      {
        q: 'Is Mausam AI free?',
        a: 'Core forecasts, maps, and the AI Daily Brief are free. Some advanced alerting and history features may require a plan.',
      },
    ],
    related: ['create-your-account', 'reading-the-forecast', 'what-is-daily-brief'],
  },
  {
    slug: 'add-your-first-location',
    title: 'Add and manage your locations',
    summary: 'Search for a place, save it, and set your default location.',
    category: 'getting-started',
    readMinutes: 2,
    updated: '2026-08-18',
    tags: ['location', 'search', 'setup'],
    blocks: [
      {
        type: 'paragraph',
        text: 'Locations power everything in Mausam AI — forecasts, maps, alerts, and your brief. You can save as many as you like and reorder them to match your routine.',
      },
      { type: 'heading', text: 'Add a location' },
      {
        type: 'steps',
        items: [
          'Click the search bar at the top of the dashboard.',
          'Type a city, town, or landmark — suggestions appear as you type.',
          'Select the correct result from the dropdown.',
          'Click the star icon to save it to your locations.',
        ],
      },
      { type: 'heading', text: 'Set a default location' },
      {
        type: 'steps',
        items: [
          'Open the location list from the sidebar.',
          'Hover the location you want as default.',
          'Click the menu (⋯) and choose “Set as default”.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Place search is powered by OpenStreetMap Nominatim, so most named places worldwide are available.',
      },
    ],
    faqs: [
      {
        q: 'Why does my town not appear?',
        a: 'Try a nearby larger town or add the region name (for example, “Bandra, Mumbai”). If it still does not appear, the place may not be in the OpenStreetMap gazetteer yet.',
      },
      {
        q: 'How many locations can I save?',
        a: 'You can save a generous number of locations on the free tier — enough for home, work, family, and travel.',
      },
    ],
    related: ['welcome-to-mausam-ai', 'location-not-detected', 'change-units'],
  },

  // ---------- Account & Profile ----------
  {
    slug: 'create-your-account',
    title: 'Create your account',
    summary: 'Sign up with email and password to save locations and preferences.',
    category: 'account-profile',
    readMinutes: 2,
    updated: '2026-08-22',
    tags: ['account', 'sign up', 'email'],
    blocks: [
      {
        type: 'paragraph',
        text: 'An account lets Mausam AI sync your locations, units, and alert preferences across every device you use.',
      },
      { type: 'heading', text: 'Sign up' },
      {
        type: 'steps',
        items: [
          'Click “Sign in” in the top navigation, then choose “Create account”.',
          'Enter your email address and a strong password.',
          'Check your inbox and click the confirmation link we email you.',
          'Return to Mausam AI — you are now signed in.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'You must confirm your email before saved locations and alerts sync. If the email has not arrived in a few minutes, check spam or request a new link.',
      },
    ],
    faqs: [
      {
        q: 'I did not receive a confirmation email.',
        a: 'Check your spam folder first. If it is not there, wait a minute and use “Resend confirmation” on the sign-in screen. Corporate mail filters occasionally delay delivery.',
      },
      {
        q: 'Can I change my email later?',
        a: 'Yes. Go to Account & Profile settings and update your email; you will confirm the new address before it becomes active.',
      },
    ],
    related: ['reset-your-password', 'change-units', 'manage-your-data'],
  },
  {
    slug: 'reset-your-password',
    title: 'Reset your password',
    summary: 'Recover access if you forget your password.',
    category: 'account-profile',
    readMinutes: 1,
    updated: '2026-08-10',
    tags: ['password', 'login', 'security'],
    blocks: [
      {
        type: 'steps',
        items: [
          'On the sign-in screen, click “Forgot password?”.',
          'Enter the email associated with your account.',
          'Open the reset link we email you.',
          'Choose a new password and sign in.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Use a unique password of at least 12 characters. A password manager makes this effortless.',
      },
    ],
    faqs: [
      {
        q: 'The reset link expired.',
        a: 'Reset links are time-limited for security. Simply request a new one from the “Forgot password?” screen.',
      },
    ],
    related: ['create-your-account', 'manage-your-data'],
  },
  {
    slug: 'change-units',
    title: 'Change units and preferences',
    summary: 'Switch between °C/°F, km/h/mph, 24-hour time, and language.',
    category: 'account-profile',
    readMinutes: 2,
    updated: '2026-08-15',
    tags: ['units', 'preferences', 'language'],
    blocks: [
      {
        type: 'paragraph',
        text: 'Tune measurement units and display preferences so forecasts read the way you expect.',
      },
      {
        type: 'steps',
        items: [
          'Open Settings from your profile menu.',
          'Choose temperature (°C or °F) and wind speed (km/h, mph, or m/s).',
          'Pick a time format (12-hour or 24-hour) and your language.',
          'Changes save automatically and sync to your other devices.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do unit changes affect the AI Daily Brief?',
        a: 'Yes. Your brief is written using your chosen units and language, so it always matches the rest of the app.',
      },
    ],
    related: ['create-your-account', 'what-is-daily-brief', 'multilingual-support'],
  },

  // ---------- Forecasts & Maps ----------
  {
    slug: 'reading-the-forecast',
    title: 'Reading the forecast',
    summary: 'How to interpret current conditions, hourly, and 16-day outlooks.',
    category: 'forecasts-maps',
    readMinutes: 4,
    updated: '2026-08-24',
    tags: ['forecast', 'hourly', 'daily', 'charts'],
    blocks: [
      {
        type: 'paragraph',
        text: 'Mausam AI forecasts are built on Open-Meteo model data, refreshed regularly. Here is how to read each part of the dashboard with confidence.',
      },
      { type: 'heading', text: 'Current conditions' },
      {
        type: 'paragraph',
        text: 'The hero card shows the temperature now, what it feels like, and the headline condition. “Feels like” blends humidity and wind to reflect what your body actually experiences.',
      },
      { type: 'heading', text: 'Hourly outlook' },
      {
        type: 'list',
        items: [
          'Precipitation probability shows the chance of rain in each hour, not how much.',
          'The temperature line reveals the daily curve — useful for planning outdoor time.',
          'Scrub the timeline to preview conditions later today and tomorrow.',
        ],
      },
      { type: 'heading', text: '16-day outlook' },
      {
        type: 'paragraph',
        text: 'Longer-range days carry more uncertainty. Treat the first 3–5 days as reliable, and the tail of the range as a trend rather than a promise.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'A wider confidence band on a chart means the models disagree more — plan with a little extra flexibility.',
      },
    ],
    faqs: [
      {
        q: 'How often is the forecast updated?',
        a: 'Forecast data refreshes on a regular cycle throughout the day. The “updated” time on the dashboard reflects the latest model run we have pulled.',
      },
      {
        q: 'Why does the forecast differ from another app?',
        a: 'Different apps use different weather models and blending methods. Mausam AI is transparent about its source (Open-Meteo) so you always know where numbers come from.',
      },
    ],
    related: ['using-weather-maps', 'what-is-daily-brief', 'forecast-looks-wrong'],
  },
  {
    slug: 'using-weather-maps',
    title: 'Using interactive maps',
    summary: 'Explore radar, precipitation, temperature, and wind layers over time.',
    category: 'forecasts-maps',
    readMinutes: 3,
    updated: '2026-08-19',
    tags: ['maps', 'radar', 'layers'],
    blocks: [
      {
        type: 'paragraph',
        text: 'The map view renders weather layers on top of an interactive base map so you can see patterns move across a region.',
      },
      {
        type: 'steps',
        items: [
          'Open Maps from the main navigation.',
          'Choose a layer: precipitation, temperature, wind, or cloud cover.',
          'Use the time slider at the bottom to animate the layer forward or back.',
          'Pinch or scroll to zoom; drag to pan to another area.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Press play on the time slider to watch a storm’s projected track over the next hours.',
      },
    ],
    faqs: [
      {
        q: 'The map is slow or blank.',
        a: 'Map tiles need a stable connection. On a weak network, switch to a single layer and a lower zoom, or reload the page.',
      },
    ],
    related: ['reading-the-forecast', 'maps-not-loading'],
  },

  // ---------- AI Daily Brief ----------
  {
    slug: 'what-is-daily-brief',
    title: 'What is the AI Daily Brief?',
    summary:
      'A plain-language summary of your day’s weather, generated from live forecast data.',
    category: 'ai-daily-brief',
    readMinutes: 3,
    updated: '2026-08-25',
    tags: ['ai', 'daily brief', 'summary'],
    blocks: [
      {
        type: 'paragraph',
        text: 'The AI Daily Brief reads your forecast and writes a short, practical summary: what to wear, whether to carry an umbrella, and anything notable coming your way. It is the fastest way to know what the weather means without reading a single chart.',
      },
      { type: 'heading', text: 'How it is generated' },
      {
        type: 'list',
        items: [
          'We pull the live forecast for your selected location from Open-Meteo.',
          'Key signals — temperature swing, rain windows, wind, and alerts — are extracted.',
          'A language model turns those signals into a concise, friendly brief in your language and units.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'The brief is grounded in your actual forecast data. It summarizes real numbers rather than inventing them.',
      },
      { type: 'heading', text: 'When it refreshes' },
      {
        type: 'paragraph',
        text: 'Your brief regenerates each morning and again if conditions change significantly during the day, so it stays relevant.',
      },
    ],
    faqs: [
      {
        q: 'Can I trust the brief for safety decisions?',
        a: 'The brief is a helpful summary, not an official warning. For life-safety decisions during severe weather, always follow official meteorological authorities and local alerts.',
      },
      {
        q: 'Can I turn the brief off?',
        a: 'Yes. You can hide the brief card from the dashboard in Settings, or collapse it any time.',
      },
    ],
    related: ['reading-the-forecast', 'brief-not-updating', 'multilingual-support'],
  },
  {
    slug: 'multilingual-support',
    title: 'Multilingual briefs and interface',
    summary: 'Read your brief and use Mausam AI in your preferred language.',
    category: 'ai-daily-brief',
    readMinutes: 2,
    updated: '2026-08-12',
    tags: ['language', 'localization', 'ai'],
    blocks: [
      {
        type: 'paragraph',
        text: 'Mausam AI supports multiple languages across the interface and the AI Daily Brief. Set your language once and everything follows.',
      },
      {
        type: 'steps',
        items: [
          'Open Settings from your profile menu.',
          'Select your language from the language list.',
          'Your interface and next AI Daily Brief update to that language.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which languages are supported?',
        a: 'We support several major languages including English and Hindi, and are actively expanding coverage. If yours is missing, let us know from Contact Support.',
      },
    ],
    related: ['what-is-daily-brief', 'change-units'],
  },

  // ---------- Notifications & Alerts ----------
  {
    slug: 'set-up-alerts',
    title: 'Set up weather alerts',
    summary: 'Get notified about severe weather and daily conditions that matter.',
    category: 'notifications-alerts',
    readMinutes: 3,
    updated: '2026-08-21',
    tags: ['alerts', 'notifications', 'severe weather'],
    blocks: [
      {
        type: 'paragraph',
        text: 'Alerts keep you ahead of changing conditions. Choose which locations and event types trigger a notification.',
      },
      {
        type: 'steps',
        items: [
          'Open Notifications & Alerts from Settings.',
          'Enable alerts for each saved location you care about.',
          'Choose event types: severe weather, heavy rain, heat, or a daily summary.',
          'Allow browser or device notifications when prompted.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'If notifications are blocked at the browser or OS level, Mausam AI cannot deliver them until you re-enable permission.',
      },
    ],
    faqs: [
      {
        q: 'Will I be woken up at night?',
        a: 'You can set quiet hours so only the most severe, life-safety alerts come through overnight while routine nudges wait until morning.',
      },
      {
        q: 'How fast are severe alerts?',
        a: 'Severe weather alerts are delivered as soon as we detect a qualifying condition or receive an official warning for your location.',
      },
    ],
    related: ['notifications-not-arriving', 'privacy-and-location', 'set-quiet-hours'],
  },
  {
    slug: 'set-quiet-hours',
    title: 'Quiet hours and alert frequency',
    summary: 'Control when and how often alerts reach you.',
    category: 'notifications-alerts',
    readMinutes: 2,
    updated: '2026-08-11',
    tags: ['quiet hours', 'frequency', 'notifications'],
    blocks: [
      {
        type: 'steps',
        items: [
          'Open Notifications & Alerts in Settings.',
          'Toggle on “Quiet hours” and set a start and end time.',
          'Choose whether life-safety alerts may override quiet hours.',
          'Set a daily cap if you prefer fewer, batched notifications.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Leaving “override for severe weather” on is recommended so critical warnings still reach you.',
      },
    ],
    faqs: [
      {
        q: 'Do quiet hours sync across devices?',
        a: 'Yes. Quiet hours are part of your account preferences and apply everywhere you are signed in.',
      },
    ],
    related: ['set-up-alerts', 'notifications-not-arriving'],
  },

  // ---------- Privacy & Security ----------
  {
    slug: 'privacy-and-location',
    title: 'How your location data is used',
    summary: 'What we collect, why, and the controls you have.',
    category: 'privacy-security',
    readMinutes: 3,
    updated: '2026-08-23',
    tags: ['privacy', 'location', 'data'],
    blocks: [
      {
        type: 'paragraph',
        text: 'Your location is used to deliver accurate forecasts, maps, and alerts — nothing more. You stay in control of what is shared and can revoke access at any time.',
      },
      { type: 'heading', text: 'What we use location for' },
      {
        type: 'list',
        items: [
          'Fetching the forecast for where you are or the places you save.',
          'Centering maps and targeting alerts to the right area.',
          'Personalizing your AI Daily Brief.',
        ],
      },
      { type: 'heading', text: 'Your controls' },
      {
        type: 'list',
        items: [
          'Deny precise location and search for places manually instead.',
          'Remove any saved location at any time.',
          'Revoke browser or device location permission in your system settings.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'You can use Mausam AI fully with manual search only — precise location is always optional.',
      },
    ],
    faqs: [
      {
        q: 'Do you sell my data?',
        a: 'No. We do not sell your personal data. Location is used to provide the service you asked for.',
      },
      {
        q: 'Is my data encrypted?',
        a: 'Data is transmitted over encrypted connections, and access is protected by authentication and row-level security on our database.',
      },
    ],
    related: ['manage-your-data', 'set-up-alerts'],
  },
  {
    slug: 'manage-your-data',
    title: 'Manage or delete your data',
    summary: 'Export or permanently remove your account data.',
    category: 'privacy-security',
    readMinutes: 2,
    updated: '2026-08-09',
    tags: ['data', 'delete account', 'export'],
    blocks: [
      {
        type: 'steps',
        items: [
          'Open Account & Profile settings.',
          'Scroll to “Your data”.',
          'Choose “Export data” to download a copy, or “Delete account” to remove everything.',
          'Confirm deletion — this is permanent and cannot be undone.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Deleting your account removes saved locations, preferences, and alert settings permanently.',
      },
    ],
    faqs: [
      {
        q: 'How long does deletion take?',
        a: 'Account data is removed promptly after you confirm. Backup copies age out on a short, defined retention schedule.',
      },
    ],
    related: ['privacy-and-location', 'create-your-account'],
  },

  // ---------- Troubleshooting ----------
  {
    slug: 'location-not-detected',
    title: 'My location is not detected',
    summary: 'Fix auto-detection and permission problems.',
    category: 'troubleshooting',
    readMinutes: 2,
    updated: '2026-08-16',
    tags: ['location', 'permission', 'fix'],
    blocks: [
      {
        type: 'steps',
        items: [
          'Check that location permission is allowed for Mausam AI in your browser or device settings.',
          'Reload the page after granting permission.',
          'If auto-detect still fails, search for your place manually and save it.',
          'On desktop, ensure system location services are turned on.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Some browsers reduce location accuracy in private/incognito windows.',
      },
    ],
    faqs: [
      {
        q: 'It works on mobile but not desktop.',
        a: 'Desktops estimate location from the network and can be less precise. Manual search is the most reliable option on desktop.',
      },
    ],
    related: ['add-your-first-location', 'privacy-and-location'],
  },
  {
    slug: 'forecast-looks-wrong',
    title: 'The forecast looks wrong',
    summary: 'Why numbers may differ and how to make sure yours are fresh.',
    category: 'troubleshooting',
    readMinutes: 2,
    updated: '2026-08-14',
    tags: ['forecast', 'accuracy', 'refresh'],
    blocks: [
      {
        type: 'list',
        items: [
          'Confirm the location on screen is the one you meant — a nearby saved place may be selected.',
          'Refresh to pull the latest model run; check the “updated” time.',
          'Remember that “feels like” differs from the raw temperature by design.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Weather models update several times a day. A brief mismatch with the sky outside usually resolves at the next refresh.',
      },
    ],
    faqs: [
      {
        q: 'Rain was forecast but it stayed dry.',
        a: 'Precipitation probability is a chance, not a guarantee. A 40% chance means rain is expected in about 4 of 10 similar situations.',
      },
    ],
    related: ['reading-the-forecast', 'brief-not-updating'],
  },
  {
    slug: 'notifications-not-arriving',
    title: 'Notifications are not arriving',
    summary: 'Restore alert delivery on web and mobile.',
    category: 'troubleshooting',
    readMinutes: 2,
    updated: '2026-08-13',
    tags: ['notifications', 'alerts', 'fix'],
    blocks: [
      {
        type: 'steps',
        items: [
          'Confirm notifications are enabled in Mausam AI’s Notifications & Alerts settings.',
          'Allow notification permission in your browser or device system settings.',
          'Check that quiet hours are not currently suppressing alerts.',
          'Send a test notification if the option is available.',
        ],
      },
    ],
    faqs: [
      {
        q: 'I blocked notifications by accident.',
        a: 'Open your browser’s site settings for Mausam AI and switch notifications back to “Allow”, then reload.',
      },
    ],
    related: ['set-up-alerts', 'set-quiet-hours'],
  },
  {
    slug: 'maps-not-loading',
    title: 'Maps are not loading',
    summary: 'Resolve blank tiles and slow map performance.',
    category: 'troubleshooting',
    readMinutes: 1,
    updated: '2026-08-08',
    tags: ['maps', 'performance', 'fix'],
    blocks: [
      {
        type: 'list',
        items: [
          'Check your internet connection — map tiles are network-heavy.',
          'Disable strict content blockers that may block tile requests.',
          'Reduce to a single layer and reload the page.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Maps work on Wi-Fi but not on mobile data.',
        a: 'A weak mobile signal can stall tile downloads. Try a single layer at a lower zoom level.',
      },
    ],
    related: ['using-weather-maps'],
  },
  {
    slug: 'brief-not-updating',
    title: 'My AI Daily Brief is not updating',
    summary: 'Make sure your brief reflects the latest conditions.',
    category: 'troubleshooting',
    readMinutes: 1,
    updated: '2026-08-07',
    tags: ['ai', 'daily brief', 'fix'],
    blocks: [
      {
        type: 'steps',
        items: [
          'Confirm the correct location is selected on the dashboard.',
          'Refresh the page to trigger a new brief for the latest forecast.',
          'Check that the brief card is not collapsed or hidden in Settings.',
        ],
      },
    ],
    faqs: [
      {
        q: 'The brief still shows yesterday.',
        a: 'Briefs regenerate in the morning and after major condition changes. A manual refresh will pull a fresh one immediately.',
      },
    ],
    related: ['what-is-daily-brief', 'reading-the-forecast'],
  },
]

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug)
}

export function articlesByCategory(slug: string) {
  return articles.filter((a) => a.category === slug)
}

export function relatedArticles(slugs: string[]) {
  return slugs
    .map((s) => getArticle(s))
    .filter((a): a is Article => Boolean(a))
}

export type SearchDoc = {
  slug: string
  title: string
  summary: string
  category: string
  categoryTitle: string
  tags: string[]
}

export const searchIndex: SearchDoc[] = articles.map((a) => ({
  slug: a.slug,
  title: a.title,
  summary: a.summary,
  category: a.category,
  categoryTitle: getCategory(a.category)?.title ?? '',
  tags: a.tags,
}))
