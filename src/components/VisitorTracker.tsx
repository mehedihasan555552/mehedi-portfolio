'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const VISITOR_ID_KEY = 'mehedi_unique_visitor_id_v1'
const VISITOR_GEO_CACHE = 'mehedi_visitor_geo_cache_v2'
const VISITOR_SESSION_KEY = 'mehedi_visitor_session_logged'

function toFiniteCoord(val: unknown, fallback: number): number {
  const n = typeof val === 'number' ? val : parseFloat(String(val ?? ''))
  return Number.isFinite(n) ? n : fallback
}

function detectDeviceAndBrowser() {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'Desktop' as const,
      os: 'Unknown',
      browser: 'Unknown',
      screen: '1920x1080',
      language: 'en-US',
      timezone: 'UTC',
    }
  }

  const ua = navigator.userAgent || ''
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop'
  if (/Tablet|iPad/i.test(ua)) deviceType = 'Tablet'
  else if (/Mobi|Android|iPhone|iPod/i.test(ua)) deviceType = 'Mobile'

  let os = 'Linux / Unix'
  if (/Windows NT 10/i.test(ua)) os = 'Windows 10/11'
  else if (/Windows/i.test(ua)) os = 'Windows'
  else if (/Mac OS X|Macintosh/i.test(ua)) os = /iPhone|iPad/i.test(ua) ? 'iOS' : 'macOS'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'

  let browser = 'Browser'
  if (/Edg\//i.test(ua)) browser = 'Microsoft Edge'
  else if (/OPR\//i.test(ua)) browser = 'Opera'
  else if (/Chrome\//i.test(ua)) browser = 'Google Chrome'
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Apple Safari'
  else if (/Firefox\//i.test(ua)) browser = 'Mozilla Firefox'

  const screen = `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`
  const language = navigator.language || 'en-US'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dhaka'

  return { deviceType, os, browser, screen, language, timezone }
}

export default function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    let visitorId = ''
    let isNewSession = false
    try {
      visitorId = localStorage.getItem(VISITOR_ID_KEY) || ''
      if (!visitorId) {
        visitorId =
          'vis-' +
          Math.random().toString(36).slice(2, 10) +
          '-' +
          Date.now().toString(36)
        localStorage.setItem(VISITOR_ID_KEY, visitorId)
      }
      if (!sessionStorage.getItem(VISITOR_SESSION_KEY)) {
        sessionStorage.setItem(VISITOR_SESSION_KEY, '1')
        isNewSession = true
      }
    } catch {
      visitorId = 'vis-anon'
    }

    const env = detectDeviceAndBrowser()

    const sendTelemetry = async () => {
      let geo: any = null
      try {
        const cached = sessionStorage.getItem(VISITOR_GEO_CACHE)
        if (cached) geo = JSON.parse(cached)
      } catch {}

      if (!geo) {
        try {
          const ctrl = new AbortController()
          const timer = setTimeout(() => ctrl.abort(), 2500)
          const res = await fetch('https://ipapi.co/json/', { signal: ctrl.signal })
          clearTimeout(timer)
          if (res.ok) {
            const data = await res.json()
            if (data && data.ip) {
              geo = {
                ip: String(data.ip),
                city: String(data.city || 'Dhaka'),
                region: String(data.region || 'Dhaka Division'),
                country: String(data.country_name || 'Bangladesh'),
                countryCode: String(data.country_code || 'BD').toUpperCase(),
                latitude: toFiniteCoord(data.latitude, 23.8103),
                longitude: toFiniteCoord(data.longitude, 90.4125),
                isp: String(data.org || 'Broadband Network'),
              }
              try {
                sessionStorage.setItem(VISITOR_GEO_CACHE, JSON.stringify(geo))
              } catch {}
            }
          }
        } catch {}
      }

      const tzParts = env.timezone.split('/')
      const fallbackCity =
        tzParts.length > 1 ? tzParts[tzParts.length - 1].replace(/_/g, ' ') : 'Dhaka'

      let refHost = 'Direct'
      try {
        if (document.referrer) {
          refHost = new URL(document.referrer).hostname || 'Direct'
        }
      } catch {}

      try {
        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            path: pathname,
            isNewSession,
            ip: geo?.ip || undefined,
            city: geo?.city || fallbackCity,
            region: geo?.region || tzParts[0] || 'Dhaka Division',
            country:
              geo?.country ||
              (env.timezone.includes('Dhaka') ? 'Bangladesh' : 'Global Network'),
            countryCode:
              geo?.countryCode || (env.timezone.includes('Dhaka') ? 'BD' : 'US'),
            latitude: toFiniteCoord(geo?.latitude, 23.8103),
            longitude: toFiniteCoord(geo?.longitude, 90.4125),
            isp: geo?.isp || 'Broadband / Fiber Network',
            ...env,
            referrer: refHost,
          }),
        })
      } catch {}
    }

    sendTelemetry()
  }, [pathname])

  return null
}
