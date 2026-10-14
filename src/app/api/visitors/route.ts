import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export interface VisitorRecord {
  visitorId: string
  ip: string
  city: string
  region: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
  deviceType: 'Desktop' | 'Mobile' | 'Tablet'
  os: string
  browser: string
  screen: string
  language?: string
  referrer: string
  pagesVisited: string[]
  visitCount: number
  firstSeen: string
  lastActive: string
}

const LOCAL_VISITORS_PATH = path.join(process.cwd(), 'src', 'data', 'visitors-db.json')
const TMP_VISITORS_PATH = '/tmp/mehedi-visitors-db.json'

function toSafeCoord(val: unknown, fallback: number): number {
  const num = typeof val === 'number' ? val : parseFloat(String(val ?? ''))
  return Number.isFinite(num) ? num : fallback
}

function normalizeRecord(raw: any, idx = 0): VisitorRecord {
  const pages = Array.isArray(raw?.pagesVisited)
    ? raw.pagesVisited.map((p: any) => String(p || '/')).filter(Boolean)
    : ['/']

  const deviceRaw = String(raw?.deviceType || 'Desktop')
  const deviceType: 'Desktop' | 'Mobile' | 'Tablet' =
    deviceRaw === 'Mobile' || deviceRaw === 'Tablet' ? deviceRaw : 'Desktop'

  return {
    visitorId: String(raw?.visitorId || `vis-node-${idx + 1}`),
    ip: String(raw?.ip || '103.148.15.42'),
    city: String(raw?.city || 'Dhaka'),
    region: String(raw?.region || 'Dhaka Division'),
    country: String(raw?.country || 'Bangladesh'),
    countryCode: String(raw?.countryCode || 'BD')
      .toUpperCase()
      .slice(0, 2),
    latitude: toSafeCoord(raw?.latitude, 23.8103),
    longitude: toSafeCoord(raw?.longitude, 90.4125),
    timezone: String(raw?.timezone || 'Asia/Dhaka'),
    isp: String(raw?.isp || 'Direct Broadband Network'),
    deviceType,
    os: String(raw?.os || 'macOS / Windows'),
    browser: String(raw?.browser || 'Chrome 131'),
    screen: String(raw?.screen || '1920x1080'),
    language: String(raw?.language || 'en-US'),
    referrer: String(raw?.referrer || 'Direct'),
    pagesVisited: pages.length > 0 ? pages : ['/'],
    visitCount: Math.max(1, parseInt(String(raw?.visitCount ?? '1'), 10) || 1),
    firstSeen: String(raw?.firstSeen || new Date().toISOString()),
    lastActive: String(raw?.lastActive || new Date().toISOString()),
  }
}

const SEED_VISITORS: VisitorRecord[] = [
  {
    visitorId: 'vis-dhaka-bd-01',
    ip: '103.148.15.42',
    city: 'Dhaka',
    region: 'Dhaka Division',
    country: 'Bangladesh',
    countryCode: 'BD',
    latitude: 23.8103,
    longitude: 90.4125,
    timezone: 'Asia/Dhaka (UTC+6)',
    isp: 'Link3 Technologies / BTCL Fiber',
    deviceType: 'Desktop',
    os: 'macOS Sequoia',
    browser: 'Chrome 131',
    screen: '2560x1440',
    language: 'en-US',
    referrer: 'Direct',
    pagesVisited: ['/', '/blog', '/blog/production-multi-agent-orchestration', '/admin'],
    visitCount: 6,
    firstSeen: '2026-10-14T18:10:00.000Z',
    lastActive: '2026-10-14T20:25:00.000Z',
  },
  {
    visitorId: 'vis-sf-us-02',
    ip: '64.233.160.142',
    city: 'San Francisco',
    region: 'California',
    country: 'United States',
    countryCode: 'US',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
    isp: 'Cloudflare Warp / Sonic Fiber',
    deviceType: 'Desktop',
    os: 'macOS Sonoma',
    browser: 'Arc / Chrome 131',
    screen: '3024x1964',
    language: 'en-US',
    referrer: 'github.com',
    pagesVisited: ['/', '/blog/production-multi-agent-orchestration', '/visitors'],
    visitCount: 4,
    firstSeen: '2026-10-14T15:22:10.000Z',
    lastActive: '2026-10-14T19:48:12.000Z',
  },
  {
    visitorId: 'vis-lon-uk-03',
    ip: '81.2.69.142',
    city: 'London',
    region: 'England',
    country: 'United Kingdom',
    countryCode: 'GB',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    isp: 'British Telecom (BT Broadband)',
    deviceType: 'Desktop',
    os: 'Windows 11 Pro',
    browser: 'Edge 131',
    screen: '1920x1080',
    language: 'en-GB',
    referrer: 'linkedin.com',
    pagesVisited: ['/', '/blog/hybrid-rag-reranking-at-scale'],
    visitCount: 3,
    firstSeen: '2026-10-14T12:05:44.000Z',
    lastActive: '2026-10-14T17:19:30.000Z',
  },
  {
    visitorId: 'vis-sg-04',
    ip: '116.88.42.91',
    city: 'Singapore',
    region: 'Central Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: 'Asia/Singapore',
    isp: 'Singtel Fibre Broadband',
    deviceType: 'Mobile',
    os: 'iOS 18.1',
    browser: 'Mobile Safari',
    screen: '430x932',
    language: 'en-SG',
    referrer: 'x.com',
    pagesVisited: ['/', '/blog'],
    visitCount: 2,
    firstSeen: '2026-10-14T14:11:05.000Z',
    lastActive: '2026-10-14T16:30:22.000Z',
  },
  {
    visitorId: 'vis-ber-de-05',
    ip: '91.64.188.23',
    city: 'Berlin',
    region: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    latitude: 52.52,
    longitude: 13.405,
    timezone: 'Europe/Berlin',
    isp: 'Deutsche Telekom AG',
    deviceType: 'Tablet',
    os: 'iPadOS 18',
    browser: 'Safari',
    screen: '1024x1366',
    language: 'de-DE',
    referrer: 'google.com',
    pagesVisited: ['/', '/blog/llm-evals-guardrails-production'],
    visitCount: 2,
    firstSeen: '2026-10-13T21:40:00.000Z',
    lastActive: '2026-10-14T16:05:19.000Z',
  },
]

async function readVisitors(): Promise<VisitorRecord[]> {
  for (const p of [TMP_VISITORS_PATH, LOCAL_VISITORS_PATH]) {
    try {
      const raw = await fs.readFile(p, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => normalizeRecord(item, idx))
      }
    } catch {}
  }
  return SEED_VISITORS
}

async function writeVisitors(list: VisitorRecord[]) {
  const normalized = list.slice(0, 250).map((item, idx) => normalizeRecord(item, idx))
  const raw = JSON.stringify(normalized, null, 2)
  try {
    await fs.mkdir(path.dirname(LOCAL_VISITORS_PATH), { recursive: true })
    await fs.writeFile(LOCAL_VISITORS_PATH, raw, 'utf-8')
  } catch {}
  try {
    await fs.writeFile(TMP_VISITORS_PATH, raw, 'utf-8')
  } catch {}
}

export async function GET() {
  const visitors = await readVisitors()
  return NextResponse.json(
    { ok: true, visitors },
    {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    }
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const headers = request.headers

    const headerIp =
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      headers.get('cf-connecting-ip') ||
      ''

    const ip =
      body.ip && body.ip !== '127.0.0.1' && body.ip !== '::1'
        ? String(body.ip)
        : headerIp && headerIp !== '::1' && headerIp !== '127.0.0.1'
        ? headerIp
        : String(body.ip || '103.148.15.101 (Local Dev)')

    const city =
      body.city ||
      decodeURIComponent(headers.get('x-vercel-ip-city') || '') ||
      'Dhaka'
    const region =
      body.region ||
      decodeURIComponent(headers.get('x-vercel-ip-country-region') || '') ||
      'Dhaka Division'
    const country =
      body.country ||
      decodeURIComponent(headers.get('x-vercel-ip-country') || '') ||
      'Bangladesh'
    const countryCode = String(
      body.countryCode || headers.get('x-vercel-ip-country') || 'BD'
    )
      .toUpperCase()
      .slice(0, 2)

    const latitude = toSafeCoord(
      body.latitude ?? headers.get('x-vercel-ip-latitude'),
      23.8103
    )
    const longitude = toSafeCoord(
      body.longitude ?? headers.get('x-vercel-ip-longitude'),
      90.4125
    )

    const visitorId = String(body.visitorId || `vis-${ip}`).trim()
    const pagePath = String(body.path || '/').trim()
    const nowIso = new Date().toISOString()

    const list = await readVisitors()
    const existingIdx = list.findIndex(
      v =>
        v.visitorId === visitorId ||
        (v.ip === ip && !ip.includes('Local Dev'))
    )

    if (existingIdx >= 0) {
      const prev = list[existingIdx]
      const pages = Array.from(new Set([pagePath, ...(prev.pagesVisited || [])])).slice(
        0,
        15
      )
      const updated = normalizeRecord({
        ...prev,
        ip: ip || prev.ip,
        city: city || prev.city,
        region: region || prev.region,
        country: country || prev.country,
        countryCode: countryCode || prev.countryCode,
        latitude: latitude || prev.latitude,
        longitude: longitude || prev.longitude,
        timezone: body.timezone || prev.timezone,
        isp: body.isp || prev.isp,
        deviceType: body.deviceType || prev.deviceType,
        os: body.os || prev.os,
        browser: body.browser || prev.browser,
        screen: body.screen || prev.screen,
        language: body.language || prev.language,
        pagesVisited: pages,
        visitCount: (prev.visitCount || 1) + (body.isNewSession ? 1 : 0),
        lastActive: nowIso,
      })
      list.splice(existingIdx, 1)
      list.unshift(updated)
    } else {
      const fresh = normalizeRecord({
        visitorId,
        ip,
        city,
        region,
        country,
        countryCode,
        latitude,
        longitude,
        timezone: body.timezone || 'Asia/Dhaka',
        isp: body.isp || 'Direct Broadband Network',
        deviceType: body.deviceType || 'Desktop',
        os: body.os || 'macOS / Windows',
        browser: body.browser || 'Chrome 131',
        screen: body.screen || '1920x1080',
        language: body.language || 'en-US',
        referrer: body.referrer || 'Direct',
        pagesVisited: [pagePath],
        visitCount: 1,
        firstSeen: nowIso,
        lastActive: nowIso,
      })
      list.unshift(fresh)
    }

    await writeVisitors(list)
    return NextResponse.json({ ok: true, visitors: list })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function DELETE() {
  await writeVisitors(SEED_VISITORS)
  return NextResponse.json({ ok: true, visitors: SEED_VISITORS })
}
