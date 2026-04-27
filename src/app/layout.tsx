import type { Metadata, Viewport } from 'next'
import {
  Playfair_Display,
  DM_Sans,
  Cormorant_Garamond,
  JetBrains_Mono,
} from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

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
    other: [{ rel: 'mask-icon', url: '/favicon.svg', color: '#4f7fff' }],
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
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#080810' },
    { media: '(prefers-color-scheme: light)', color: '#f5f4ff' },
  ],
  width: 'device-width',
  initialScale: 1,
}

/**
 * This script runs synchronously before React hydrates.
 * It reads localStorage / system preference and sets the correct
 * class on <html> so the server-rendered markup never mismatches.
 * Because it is inline and blocking it causes zero flash.
 */
const themeScript = `
(function(){
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved === 'light' ? 'light' : saved === 'dark' ? 'dark' : prefersDark ? 'dark' : 'light';
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch(e){}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [
    playfair.variable,
    dmSans.variable,
    cormorant.variable,
    jetbrains.variable,
  ].join(' ')

  return (
    /*
     * suppressHydrationWarning on <html> is intentional:
     * the inline script above may change the 'class' attribute
     * between server render and client hydration.
     * This tells React to ignore that specific attribute mismatch.
     */
    <html
      lang="en"
      className={`dark scroll-smooth ${fontVars}`}
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
