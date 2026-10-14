'use client'
import { useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import me from '../../images/professional-mehedi.png'

export interface TechBadgeItem {
  label: string
  angle: number
  index: number
  delay: number
  isSpecial?: boolean
}

export const TECH_STACK: TechBadgeItem[] = [
  { label: 'Python',      angle: -38, index: 0, delay: 0 },
  { label: 'LangGraph',   angle:  22, index: 1, delay: 0.5 },
  { label: 'FastAPI',     angle: 142, index: 2, delay: 1.0 },
  { label: 'Hybrid RAG',  angle: 192, index: 3, delay: 1.5 },
  { label: 'Multi-Agent', angle: 238, index: 4, delay: 2.0 },
  { label: 'Agentic AI',  angle: 292, index: 5, delay: 2.5, isSpecial: true },
]

function GeodesicCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 380
    canvas.width = size
    canvas.height = size

    const t = (1 + Math.sqrt(5)) / 2
    const rawVertices = [
      [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
      [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
      [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1],
    ].map(([x, y, z]) => {
      const len = Math.hypot(x, y, z)
      return [x / len, y / len, z / len] as [number, number, number]
    })

    const edges: [number, number][] = []
    for (let i = 0; i < rawVertices.length; i++) {
      for (let j = i + 1; j < rawVertices.length; j++) {
        const d = Math.hypot(
          rawVertices[i][0] - rawVertices[j][0],
          rawVertices[i][1] - rawVertices[j][1],
          rawVertices[i][2] - rawVertices[j][2]
        )
        if (d < 1.15) edges.push([i, j])
      }
    }

    let animId = 0
    let isInView = true
    let angleY = 0
    let angleX = 0.35

    const render = () => {
      if (!isInView) return
      ctx.clearRect(0, 0, size, size)
      const isDark = document.documentElement.classList.contains('dark')
      angleY += 0.008
      angleX += 0.004

      const cx = size * 0.5
      const cy = size * 0.5
      const radius = 152

      const cosY = Math.cos(angleY), sinY = Math.sin(angleY)
      const cosX = Math.cos(angleX), sinX = Math.sin(angleX)

      const proj = rawVertices.map(([vx, vy, vz]) => {
        const x1 = vx * cosY - vz * sinY
        const z1 = vz * cosY + vx * sinY
        const y2 = vy * cosX - z1 * sinX
        const z2 = z1 * cosX + vy * sinX
        const scale = 2.8 / (2.8 + z2)
        return {
          sx: cx + x1 * radius * scale,
          sy: cy + y2 * radius * scale,
          z: z2,
          scale,
        }
      })

      ctx.lineWidth = 1.3
      ctx.strokeStyle = isDark ? 'rgba(61, 220, 132, 0.32)' : 'rgba(16, 185, 129, 0.28)'
      ctx.beginPath()
      for (const [i, j] of edges) {
        ctx.moveTo(proj[i].sx, proj[i].sy)
        ctx.lineTo(proj[j].sx, proj[j].sy)
      }
      ctx.stroke()

      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.78)' : 'rgba(16, 185, 129, 0.75)'
      for (const p of proj) {
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 2.8 * p.scale, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
        if (isInView) {
          cancelAnimationFrame(animId)
          animId = requestAnimationFrame(render)
        } else {
          cancelAnimationFrame(animId)
        }
      },
      { threshold: 0.05 }
    )
    obs.observe(canvas)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] pointer-events-none"
      aria-hidden="true"
    />
  )
}

function OrbitingBadge({ item }: { item: TechBadgeItem }) {
  const rad = (item.angle * Math.PI) / 180
  const x = 50 + 50 * Math.cos(rad)
  const y = 50 + 50 * Math.sin(rad)

  return (
    <div
      className="hero-orbit-counter absolute pointer-events-auto"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <div
        style={{
          animation: `badgeFloat ${4.2 + item.index * 0.35}s ease-in-out ${item.delay}s infinite`,
        }}
      >
        <span
          className={`skill-pill orbit-pill orbit-pill-${item.index} inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] px-3.5 py-1.5 whitespace-nowrap shadow-lg`}
        >
          {item.isSpecial ? (
            <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'currentColor' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'currentColor' }} />
            </span>
          ) : (
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: 'currentColor' }}
              aria-hidden="true"
            />
          )}
          <span className="font-extrabold tracking-[-0.01em]">{item.label}</span>
        </span>
      </div>
    </div>
  )
}

export default function HeroAvatar3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { db } = usePortfolioData()
  const { profile } = db

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { stiffness: 180, damping: 24 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig)

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mouseX, mouseY])

  const handlePointerLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const customAvatar =
    profile.avatarImage && profile.avatarImage !== '/images/professional-mehedi.png'
      ? profile.avatarImage
      : null

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="hero-orbit-stage relative flex flex-col items-center w-full pt-8 select-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative flex flex-col items-center"
      >
        <div
          className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Layer 0: 3D Rotating Geodesic Icosahedron Wireframe */}
          <GeodesicCoreCanvas />

          {/* Layer 1: Expanding Live Sonar Pulse Rings */}
          <div
            className="hero-sonar-ring absolute -inset-4 rounded-full pointer-events-none"
            style={{ border: '1.5px solid rgb(var(--accent-rgb) / 0.38)' }}
            aria-hidden="true"
          />
          <div
            className="hero-sonar-ring-delayed absolute -inset-4 rounded-full pointer-events-none"
            style={{ border: '1.5px solid rgb(var(--cyber-rgb) / 0.32)' }}
            aria-hidden="true"
          />

          {/* Layer 2: Live Spinning Conic Energy Halo */}
          <div
            className="absolute -inset-3 rounded-full animate-spin-slow pointer-events-none opacity-75"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, var(--accent) 90deg, var(--cyber) 180deg, transparent 260deg, var(--signal) 330deg, transparent 360deg)',
              maskImage: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
              WebkitMaskImage: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
            }}
            aria-hidden="true"
          />

          {/* Layer 3: Outer Dashed Orbital Track with Travelling Satellites */}
          <div
            className="absolute rounded-full border border-dashed animate-spin-slow pointer-events-none"
            style={{
              inset: '-38px',
              borderColor: 'rgb(var(--accent-rgb) / 0.32)',
            }}
            aria-hidden="true"
          >
            <span
              className="absolute w-3 h-3 rounded-full -top-1.5 left-1/2 -translate-x-1/2"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 0 12px var(--accent)',
              }}
            />
            <span
              className="absolute w-2.5 h-2.5 rounded-full -bottom-1.5 left-1/2 -translate-x-1/2"
              style={{
                background: 'var(--cyber)',
                boxShadow: '0 0 10px var(--cyber)',
              }}
            />
          </div>

          {/* Layer 4: Inner Counter-Rotating Dashed Track */}
          <div
            className="absolute rounded-full border border-dashed animate-spin-rev pointer-events-none"
            style={{
              inset: '-18px',
              borderColor: 'rgb(var(--cyber-rgb) / 0.24)',
            }}
            aria-hidden="true"
          >
            <span
              className="absolute w-2 h-2 rounded-full top-1/2 -left-1 -translate-y-1/2"
              style={{
                background: 'var(--signal)',
                boxShadow: '0 0 8px var(--signal)',
              }}
            />
          </div>

          {/* Layer 5: Live Floating Central Portrait Frame */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full h-full rounded-full overflow-hidden hero-photo-ring cursor-pointer group"
            style={{
              border: '3px solid var(--border-hi)',
              boxShadow: 'var(--sh-3), 0 0 0 7px rgb(var(--accent-rgb) / 0.12)',
              transform: 'translateZ(30px)',
            }}
          >
            {customAvatar ? (
              <Image
                src={customAvatar}
                alt={`${profile.name} — ${profile.currentRole}`}
                fill
                priority
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 224px, (max-width:1024px) 256px, 288px"
              />
            ) : (
              <Image
                src={me}
                alt={`${profile.name} — ${profile.currentRole}`}
                fill
                priority
                fetchPriority="high"
                quality={90}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 224px, (max-width:1024px) 256px, 288px"
              />
            )}

            {/* Subtle animated scanning light sheen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-45 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 220, 132, 0.22) 0%, transparent 50%, rgba(56, 189, 248, 0.22) 100%)',
              }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Layer 6: Continuously Revolving 360° Orbital Tech Badges */}
          <div
            className="hero-orbit-ring absolute pointer-events-none"
            style={{
              inset: '-44px',
            }}
          >
            {TECH_STACK.map(item => (
              <OrbitingBadge key={item.label} item={item} />
            ))}
          </div>
        </div>

        {/* Floating Nameplate */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="relative z-10 -mt-5 px-6 py-2.5 glass-card border-beam text-center"
          style={{
            borderColor: 'var(--border-hi)',
            boxShadow: 'var(--sh-3)',
            transform: 'translateZ(50px)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="status-dot" aria-hidden="true" />
            <span
              className="font-extrabold text-[13.5px] sm:text-[14.5px] tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
            >
              {profile.name}
            </span>
          </div>
          <div
            className="font-mono text-[10.5px] sm:text-[11.5px] font-extrabold tracking-wide"
            style={{ color: 'var(--accent)' }}
          >
            {profile.currentRole} @ {profile.currentCompany}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
