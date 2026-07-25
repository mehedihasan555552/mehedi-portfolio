import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'

// Single font family for the whole terminal-mono theme — everything in
// globals.css (--font-display / --font-body / --font-italic / --font-mono)
// resolves to this. Previously three more Google Font families (Playfair
// Display, DM Sans, Cormorant Garamond) were loaded here but never
// referenced anywhere, so Next.js was preloading ~24 unused font-file
// variants on every page load.
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mehediswpu.vercel.app'),
  title: {
    default: 'Md Mehedi Hasan | Sr. Full-Stack & LLM Engineer',
    template: '%s | Mehedi Hasan',
  },
  description:
    'Full-Stack Python Django Developer & AI/ML Engineer based in Dhaka, Bangladesh. Expert in Machine Learning, Deep Learning, NLP, and intelligent web applications.',
  keywords: [
    'Mehedi Hasan',
    'Full-Stack Developer',
    'Python Django',
    'AI ML Engineer',
    'LLM Engineer',
    'Bangladesh Developer',
    'Machine Learning',
    'React Next.js',
  ],
  authors: [{ name: 'Md Mehedi Hasan', url: 'https://mehediswpu.vercel.app' }],
  creator: 'Md Mehedi Hasan',
  icons: {
    icon: [
      { url: '/favicon.ico',  sizes: '48x48',   type: 'image/x-icon' },
      { url: '/icon-32.png',  sizes: '32x32',   type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png',     sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg',  type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/favicon.svg', color: '#6c8fff' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mehediswpu.vercel.app',
    title: 'Md Mehedi Hasan | Sr. Full-Stack & LLM Engineer',
    description: 'Building smart solutions with code & AI. Full-Stack · AI/ML · LLM.',
    siteName: 'Mehedi Hasan Portfolio',
    images: [{ url: '/icon.png', width: 512, height: 512, alt: 'Mehedi Hasan Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Md Mehedi Hasan | Sr. Full-Stack & LLM Engineer',
    creator: '@ridoy123439',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: 'https://mehediswpu.vercel.app' },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  // Always use dark theme color since we default to dark
  themeColor: '#080810',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Runs synchronously before React hydrates.
 * Defaults to DARK if no preference is saved — ignores system preference.
 * Saved preference ('light' or 'dark') is always respected on return visits.
 */
const themeScript = `
(function(){
  try {
    var saved = localStorage.getItem('theme');
    var theme = saved === 'light' ? 'light' : 'dark';
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch(e){}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking theme script — must run before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}