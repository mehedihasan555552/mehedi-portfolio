'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { VisitorRecord } from '@/app/api/visitors/route'

function flagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function formatCoord(val: unknown, fallback = 0): string {
  const num = typeof val === 'number' ? val : parseFloat(String(val ?? ''))
  return Number.isFinite(num) ? num.toFixed(4) : fallback.toFixed(4)
}

function safePages(pages: unknown): string[] {
  return Array.isArray(pages) && pages.length > 0
    ? pages.map(p => String(p || '/'))
    : ['/']
}

export default function UniqueVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deviceFilter, setDeviceFilter] = useState<'All' | 'Desktop' | 'Mobile' | 'Tablet'>('All')
  const [copiedIp, setCopiedIp] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(prev => (prev === msg ? null : prev)), 4000)
  }

  const fetchVisitors = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/visitors', { cache: 'no-store' })
      const data = await res.json()
      if (data?.ok && Array.isArray(data.visitors)) {
        setVisitors(data.visitors)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVisitors()
  }, [fetchVisitors])

  const handleSimulateVisitor = async () => {
    const mocks = [
      {
        visitorId: `vis-sim-${Date.now()}`,
        ip: `104.28.${Math.floor(Math.random() * 200) + 15}.${Math.floor(Math.random() * 230) + 10}`,
        city: 'Toronto',
        region: 'Ontario',
        country: 'Canada',
        countryCode: 'CA',
        latitude: 43.6532,
        longitude: -79.3832,
        timezone: 'America/Toronto',
        isp: 'Cloudflare Warp / Bell Canada',
        deviceType: 'Desktop',
        os: 'macOS Sequoia',
        browser: 'Chrome 131',
        screen: '2560x1440',
        referrer: 'news.ycombinator.com',
        path: '/blog/production-multi-agent-orchestration',
      },
      {
        visitorId: `vis-sim-${Date.now()}`,
        ip: `118.179.${Math.floor(Math.random() * 200) + 15}.${Math.floor(Math.random() * 230) + 10}`,
        city: 'Dhaka',
        region: 'Dhaka Division',
        country: 'Bangladesh',
        countryCode: 'BD',
        latitude: 23.8103,
        longitude: 90.4125,
        timezone: 'Asia/Dhaka',
        isp: 'Amber IT Limited',
        deviceType: 'Mobile',
        os: 'iOS 18.1',
        browser: 'Mobile Safari',
        screen: '430x932',
        referrer: 'linkedin.com',
        path: '/',
      },
      {
        visitorId: `vis-sim-${Date.now()}`,
        ip: `35.198.${Math.floor(Math.random() * 200) + 15}.${Math.floor(Math.random() * 230) + 10}`,
        city: 'Tokyo',
        region: 'Tokyo',
        country: 'Japan',
        countryCode: 'JP',
        latitude: 35.6762,
        longitude: 139.6503,
        timezone: 'Asia/Tokyo',
        isp: 'NTT Communications',
        deviceType: 'Desktop',
        os: 'Windows 11',
        browser: 'Edge 131',
        screen: '1920x1080',
        referrer: 'github.com',
        path: '/visitors',
      },
    ]
    const pick = mocks[Math.floor(Math.random() * mocks.length)]
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pick),
      })
      const data = await res.json()
      if (data?.ok && Array.isArray(data.visitors)) {
        setVisitors(data.visitors)
        notify(`Logged live visitor from ${pick.city}, ${pick.country} (${pick.ip})`)
      }
    } catch {}
  }

  const handleExportCsv = () => {
    const headers = [
      'Visitor ID',
      'IP Address',
      'City',
      'Region',
      'Country',
      'Latitude',
      'Longitude',
      'Timezone',
      'ISP',
      'Device',
      'OS',
      'Browser',
      'Screen',
      'Visits',
      'Pages Visited',
      'Last Active',
    ]
    const rows = visitors.map(v => [
      v.visitorId,
      v.ip,
      v.city,
      v.region,
      v.country,
      formatCoord(v.latitude, 23.8103),
      formatCoord(v.longitude, 90.4125),
      v.timezone,
      `"${String(v.isp || '').replace(/"/g, '""')}"`,
      v.deviceType,
      v.os,
      v.browser,
      v.screen,
      v.visitCount || 1,
      `"${safePages(v.pagesVisited).join(' | ')}"`,
      v.lastActive,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `unique-visitors-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify('Downloaded unique-visitors CSV report!')
  }

  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      if (deviceFilter !== 'All' && v.deviceType !== deviceFilter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        String(v.ip || '').toLowerCase().includes(q) ||
        String(v.city || '').toLowerCase().includes(q) ||
        String(v.country || '').toLowerCase().includes(q) ||
        String(v.region || '').toLowerCase().includes(q) ||
        String(v.isp || '').toLowerCase().includes(q) ||
        String(v.os || '').toLowerCase().includes(q) ||
        String(v.browser || '').toLowerCase().includes(q) ||
        safePages(v.pagesVisited).some(p => p.toLowerCase().includes(q))
      )
    })
  }, [visitors, search, deviceFilter])

  const stats = useMemo(() => {
    const totalUnique = visitors.length
    const totalViews = visitors.reduce((acc, v) => acc + (Number(v.visitCount) || 1), 0)
    const countries = new Set(visitors.map(v => v.country)).size
    const desktop = visitors.filter(v => v.deviceType === 'Desktop').length
    const mobile = visitors.filter(v => v.deviceType !== 'Desktop').length

    const countryMap = new Map<string, { country: string; code: string; count: number }>()
    visitors.forEach(v => {
      const cName = v.country || 'Bangladesh'
      const existing = countryMap.get(cName) || {
        country: cName,
        code: v.countryCode || 'BD',
        count: 0,
      }
      existing.count += 1
      countryMap.set(cName, existing)
    })
    const topCountries = Array.from(countryMap.values()).sort((a, b) => b.count - a.count)

    return { totalUnique, totalViews, countries, desktop, mobile, topCountries }
  }, [visitors])

  return (
    <div className="min-h-screen flex flex-col bg-[--bg] text-[--text]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-8 max-w-[1540px] w-full mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[--bg-2] border border-[--accent-line] text-[--accent] mb-3">
              <span className="w-2 h-2 rounded-full bg-[--accent] animate-ping" />
              <span>Real-Time Visitor IP &amp; Geolocation Telemetry</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[--text]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Unique Visitors &amp; <span className="grad-text">Device Locations</span>
            </h1>
            <p className="text-base font-semibold text-[--text-muted] mt-2 max-w-3xl">
              Live telemetry inspecting unique visitor IP addresses, City &amp; Country geolocation, GPS coordinates, ISP network providers, operating systems, and visited pages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSimulateVisitor}
              className="btn btn-primary text-xs py-2.5 px-4 font-bold"
            >
              + Simulate Live Visitor
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="btn btn-ghost text-xs py-2.5 px-4 font-mono font-bold"
            >
              ⬇ Export CSV
            </button>
            <button
              type="button"
              onClick={fetchVisitors}
              className="btn btn-ghost text-xs py-2.5 px-4 font-mono font-bold"
            >
              {loading ? '⏳ Refreshing...' : '↻ Refresh'}
            </button>
            <Link href="/admin" className="btn btn-ghost text-xs py-2.5 px-4 font-mono font-bold">
              Admin Studio →
            </Link>
          </div>
        </div>

        {toast && (
          <div
            className="p-4 rounded-2xl text-sm font-mono font-bold flex items-center justify-between"
            style={{
              background: 'var(--accent-soft)',
              border: '1.5px solid var(--accent-line)',
              color: 'var(--accent)',
            }}
          >
            <span>✓ {toast}</span>
            <button onClick={() => setToast(null)} className="text-xs font-bold">
              ✕
            </button>
          </div>
        )}

        {/* 4 Bold KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-2xl border border-[--border]">
            <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
              01 // Unique Visitor IPs
            </div>
            <div
              className="text-4xl font-black mt-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
            >
              {stats.totalUnique}
            </div>
            <div className="text-xs font-semibold text-[--text-muted] mt-1">
              Deduplicated by IP &amp; Device ID
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-[--border]">
            <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
              02 // Total Page Sessions
            </div>
            <div
              className="text-4xl font-black mt-2 text-[--text]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {stats.totalViews}
            </div>
            <div className="text-xs font-semibold text-[--text-muted] mt-1">
              Cumulative Portfolio Route Views
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-[--border]">
            <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
              03 // Countries Reached
            </div>
            <div
              className="text-4xl font-black mt-2 text-[--text]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {stats.countries}
            </div>
            <div className="text-xs font-semibold text-[--text-muted] mt-1">
              Verified Geo-IP Regions
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-[--border]">
            <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
              04 // Device Form Factor
            </div>
            <div
              className="text-3xl font-black mt-2 text-[--text]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              💻 {stats.desktop} <span className="text-base font-mono text-[--text-dim]">/</span> 📱{' '}
              {stats.mobile}
            </div>
            <div className="text-xs font-semibold text-[--text-muted] mt-1">
              Desktop vs Mobile &amp; Tablet
            </div>
          </div>
        </div>

        {/* Country Distribution + Search/Filter */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="glass-card p-6 rounded-2xl border border-[--border]">
            <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent] mb-4">
              🌍 Top Visitor Countries
            </div>
            <div className="space-y-3">
              {stats.topCountries.slice(0, 5).map(c => {
                const pct = Math.round((c.count / Math.max(1, stats.totalUnique)) * 100)
                return (
                  <div key={c.country} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[--text]">
                        {flagEmoji(c.code)} {c.country}
                      </span>
                      <span className="font-mono text-[--text-muted]">
                        {c.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[--bg-2] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-[--border] flex flex-col justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent]">
                🔎 Filter &amp; Inspect Visitor Telemetry
              </div>
              <p className="text-sm font-semibold text-[--text-muted] mt-1">
                Search across IP addresses, cities, countries, ISPs, operating systems, browsers, or visited URLs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search IP address, city, country, ISP, OS, browser, or page..."
                className="flex-1 min-w-[240px] px-4 py-3 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
              />
              <div className="flex items-center gap-1.5 bg-[--bg-2] p-1.5 rounded-xl border border-[--border]">
                {(['All', 'Desktop', 'Mobile', 'Tablet'] as const).map(dev => (
                  <button
                    key={dev}
                    type="button"
                    onClick={() => setDeviceFilter(dev)}
                    className="px-3.5 py-2 rounded-lg text-xs font-mono font-extrabold transition-all"
                    style={{
                      background: deviceFilter === dev ? 'var(--accent)' : 'transparent',
                      color: deviceFilter === dev ? 'var(--on-accent)' : 'var(--text)',
                    }}
                  >
                    {dev}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* High-Contrast Visitor Table */}
        <div className="glass-card rounded-2xl border border-[--border] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="border-b border-[--border] text-xs font-mono font-extrabold uppercase tracking-wider text-[--text]"
                  style={{ background: 'var(--bg-2)' }}
                >
                  <th className="py-4 px-5">IP Address &amp; Network ISP</th>
                  <th className="py-4 px-5">Device Location (City / Country / GPS)</th>
                  <th className="py-4 px-5">Hardware, OS &amp; Browser</th>
                  <th className="py-4 px-5">Visited Pages</th>
                  <th className="py-4 px-5 text-center">Sessions</th>
                  <th className="py-4 px-5">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--border] text-sm">
                {filteredVisitors.map(v => (
                  <tr key={v.visitorId} className="hover:bg-[--bg-2]/60 transition-colors">
                    <td className="py-4 px-5 align-top">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-lg font-mono font-extrabold text-xs"
                          style={{
                            background: 'var(--accent-soft)',
                            color: 'var(--accent)',
                            border: '1.5px solid var(--accent-line)',
                          }}
                        >
                          {v.ip}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(v.ip)
                            setCopiedIp(v.ip)
                            setTimeout(() => setCopiedIp(null), 1800)
                          }}
                          className="text-xs font-mono font-bold text-[--text-dim] hover:text-[--accent]"
                          title="Copy IP Address"
                        >
                          {copiedIp === v.ip ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <div className="text-xs font-mono font-semibold text-[--text-muted] mt-2">
                        ISP: {v.isp}
                      </div>
                      <div className="text-[11px] font-mono text-[--text-dim] mt-0.5">
                        ID: {v.visitorId}
                      </div>
                    </td>

                    <td className="py-4 px-5 align-top">
                      <div className="font-extrabold text-[--text] text-sm flex items-center gap-1.5">
                        <span className="text-base">{flagEmoji(v.countryCode)}</span>
                        <span>
                          {v.city}, {v.region}
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-[--accent] mt-0.5">
                        {v.country} ({v.countryCode})
                      </div>
                      <div className="text-xs font-mono font-semibold text-[--text-muted] mt-1">
                        📍 {formatCoord(v.latitude, 23.8103)}°, {formatCoord(v.longitude, 90.4125)}° • 🕒{' '}
                        {v.timezone}
                      </div>
                    </td>

                    <td className="py-4 px-5 align-top">
                      <div className="font-extrabold text-[--text] text-sm">
                        {v.deviceType === 'Mobile'
                          ? '📱'
                          : v.deviceType === 'Tablet'
                          ? '📟'
                          : '💻'}{' '}
                        {v.deviceType} • {v.os}
                      </div>
                      <div className="text-xs font-mono font-semibold text-[--text-muted] mt-1">
                        🌐 {v.browser} • 🖥️ {v.screen}
                      </div>
                      <div className="text-xs font-mono text-[--text-dim] mt-0.5">
                        Referrer: {v.referrer || 'Direct'}
                      </div>
                    </td>

                    <td className="py-4 px-5 align-top">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {safePages(v.pagesVisited).map(p => (
                          <span
                            key={p}
                            className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[--bg-2] border border-[--border] text-[--text]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-5 align-top text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-[--bg-2] border border-[--border] text-[--accent]">
                        {v.visitCount || 1}x
                      </span>
                    </td>

                    <td className="py-4 px-5 align-top font-mono text-xs">
                      <div className="text-[--text] font-extrabold">
                        {new Date(v.lastActive).toLocaleString()}
                      </div>
                      <div className="text-[11px] font-semibold text-[--text-dim] mt-1">
                        First: {new Date(v.firstSeen).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
