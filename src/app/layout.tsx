import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { PortfolioDataProvider } from '@/context/PortfolioDataContext'
import SiteEffects from '@/components/SiteEffects'
import VisitorTracker from '@/components/VisitorTracker'
import LiveBackground from '@/components/LiveBackground'

export const metadata: Metadata = {
  metadataBase: new URL('https://mehediswpu.vercel.app'),

  title: {
    default: 'Md Mehedi Hasan | Senior AI/LLM Engineer & Multi-Agent Systems Architect',
    template: '%s | Mehedi Hasan',
  },

  description:
    'Senior AI/LLM Engineer with 5+ years building production AI systems and scalable Python backends. Specialised in LLM-powered multi-agent systems, RAG pipelines, agent orchestration, and AI evaluation frameworks.',

  keywords: [
    'Mehedi Hasan',
    'Senior AI Engineer',
    'Senior LLM Engineer',
    'Multi-Agent Systems',
    'Agentic AI',
    'LangGraph',
    'RAG Pipelines',
    'Hybrid Retrieval',
    'AI Evaluation Frameworks',
    'Ragas',
    'Guardrails',
    'LLM Observability',
    'Python Backends',
    'FastAPI',
    'Production AI',
  ],

  authors: [
    {
      name: 'Md Mehedi Hasan',
      url: 'https://mehediswpu.vercel.app',
    },
  ],

  creator: 'Md Mehedi Hasan',

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#3ddc84',
      },
    ],
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mehediswpu.vercel.app',
    title: 'Md Mehedi Hasan | Sr. Full-Stack & LLM Engineer',
    description: 'Building smart solutions with code & AI. Full-Stack · AI/ML · LLM.',
    siteName: 'Mehedi Hasan Portfolio',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Mehedi Hasan Portfolio',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Md Mehedi Hasan | Sr. Full-Stack & LLM Engineer',
    creator: '@ridoy123439',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },

  alternates: {
    canonical: 'https://mehediswpu.vercel.app',
  },

  manifest: '/site.webmanifest',
}

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

const reb2bScript = `
!function(key) {
  if (window.reb2b) return;

  window.reb2b = { loaded: true };

  var s = document.createElement("script");
  s.async = true;
  s.src =
    "https://ddwl4m2hdecbv.cloudfront.net/b/" +
    key +
    "/" +
    key +
    ".js.gz";

  document
    .getElementsByTagName("script")[0]
    .parentNode
    .insertBefore(s, document.getElementsByTagName("script")[0]);
}("9NMMZHXX8YNW");
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <PortfolioDataProvider>
            <LiveBackground />
            <SiteEffects />
            <VisitorTracker />
            {children}
          </PortfolioDataProvider>
        </ThemeProvider>

        <Script id="reb2b-snippet" strategy="beforeInteractive">
          {reb2bScript}
        </Script>
      </body>
    </html>
  )
}