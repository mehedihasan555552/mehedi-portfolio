'use client'
import { useEffect, useRef } from 'react'

export default function GlobeBeacon3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 320
    const height = 220
    const dpr = 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const dots: [number, number, number][] = []
    for (let lat = -70; lat <= 70; lat += 14) {
      const phi = (lat * Math.PI) / 180
      const count = Math.max(8, Math.floor(Math.cos(phi) * 28))
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2
        dots.push([
          Math.cos(phi) * Math.cos(theta),
          Math.sin(phi),
          Math.cos(phi) * Math.sin(theta),
        ])
      }
    }

    const hubs: Array<{ lat: number; lon: number; name: string; isHome?: boolean }> = [
      { lat: 23.81, lon: 90.41, name: 'Dhaka HQ', isHome: true },
      { lat: 37.77, lon: -122.41, name: 'San Francisco' },
      { lat: 51.50, lon: -0.12, name: 'London' },
      { lat: 1.35, lon: 103.82, name: 'Singapore' },
      { lat: 35.67, lon: 139.65, name: 'Tokyo' },
    ]

    const toVec = (lat: number, lon: number): [number, number, number] => {
      const phi = (-lat * Math.PI) / 180
      const theta = (lon * Math.PI) / 180
      return [
        Math.cos(phi) * Math.cos(theta),
        Math.sin(phi),
        Math.cos(phi) * Math.sin(theta),
      ]
    }

    const hubVecs = hubs.map(h => ({ ...h, vec: toVec(h.lat, h.lon) }))

    let rotY = -1.4
    let animId = 0

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      const isDark = document.documentElement.classList.contains('dark')
      rotY += 0.0045

      const cx = width / 2
      const cy = height / 2 + 6
      const r = 84

      const project = ([x, y, z]: [number, number, number]) => {
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
        const x1 = x * cosY - z * sinY
        const z1 = z * cosY + x * sinY
        const tilt = 0.28
        const cosX = Math.cos(tilt), sinX = Math.sin(tilt)
        const y2 = y * cosX - z1 * sinX
        const z2 = z1 * cosX + y * sinX
        return { sx: cx + x1 * r, sy: cy + y2 * r, z: z2 }
      }

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = isDark ? 'rgba(61, 220, 132, 0.25)' : 'rgba(22, 163, 74, 0.25)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      for (const d of dots) {
        const p = project(d)
        if (p.z > 0.15) continue
        const alpha = Math.max(0.12, (0.2 - p.z) * (isDark ? 0.55 : 0.42))
        ctx.fillStyle = isDark ? `rgba(148, 163, 184, ${alpha})` : `rgba(71, 85, 105, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 1.35, 0, Math.PI * 2)
        ctx.fill()
      }

      const homeProj = project(hubVecs[0].vec)

      for (let i = 1; i < hubVecs.length; i++) {
        const target = project(hubVecs[i].vec)
        const midX = (homeProj.sx + target.sx) * 0.5
        const midY = Math.min(homeProj.sy, target.sy) - 26

        ctx.beginPath()
        ctx.moveTo(homeProj.sx, homeProj.sy)
        ctx.quadraticCurveTo(midX, midY, target.sx, target.sy)
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.38)' : 'rgba(2, 132, 199, 0.35)'
        ctx.lineWidth = 1.2
        ctx.stroke()

        const t = ((now * 0.0006 + i * 0.25) % 1)
        const px = (1 - t) * (1 - t) * homeProj.sx + 2 * (1 - t) * t * midX + t * t * target.sx
        const py = (1 - t) * (1 - t) * homeProj.sy + 2 * (1 - t) * t * midY + t * t * target.sy
        ctx.fillStyle = isDark ? '#3ddc84' : '#16a34a'
        ctx.beginPath()
        ctx.arc(px, py, 2.3, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const h of hubVecs) {
        const p = project(h.vec)
        if (p.z > 0.35 && !h.isHome) continue
        ctx.fillStyle = h.isHome ? (isDark ? '#3ddc84' : '#16a34a') : (isDark ? '#38bdf8' : '#0284c7')
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, h.isHome ? 4 : 2.5, 0, Math.PI * 2)
        ctx.fill()

        if (h.isHome) {
          const pulseR = 4 + ((now * 0.012) % 12)
          ctx.strokeStyle = isDark ? 'rgba(61, 220, 132, 0.5)' : 'rgba(22, 163, 74, 0.45)'
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, pulseR, 0, Math.PI * 2)
          ctx.stroke()

          ctx.font = '700 10px ui-monospace, monospace'
          ctx.fillStyle = isDark ? '#3ddc84' : '#15803d'
          ctx.fillText('● DHAKA, BD (UTC+6)', p.sx + 8, p.sy + 3)
        }
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="glass-card spotlight p-4 flex items-center justify-between gap-4 overflow-hidden">
      <div className="space-y-1.5 pl-1">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[--accent]">
          <span className="status-dot" />
          Global Remote Telemetry
        </div>
        <div className="text-[15px] font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
          Dhaka, BD → Worldwide
        </div>
        <p className="text-[12.5px] text-[--text-muted] leading-snug max-w-[210px]">
          Shipping production AI &amp; distributed systems for teams across US, EU, &amp; APAC timezones.
        </p>
      </div>
      <canvas
        ref={canvasRef}
        className="w-[160px] h-[110px] sm:w-[200px] sm:h-[135px] flex-shrink-0 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  )
}
