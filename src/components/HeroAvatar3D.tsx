'use client'
import { useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
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
  { label: 'LangGraph',   angle:  16, index: 1, delay: 0.8 },
  { label: 'FastAPI',     angle: 148, index: 2, delay: 1.6 },
  { label: 'Hybrid RAG',  angle: 190, index: 3, delay: 2.4 },
  { label: 'Multi-Agent', angle: 232, index: 4, delay: 3.2 },
  { label: 'Agentic AI',  angle: 288, index: 5, delay: 4.0, isSpecial: true },
]

/* ─── Individual Orbiting 3D Badge ─────────────────────────────── */
function OrbitingBadge({ item }: { item: TechBadgeItem }) {
  const rad = (item.angle * Math.PI) / 180
  const x = 50 + 50 * Math.cos(rad)
  const y = 50 + 50 * Math.sin(rad)

  // Floating oscillations unique to each badge
  const floatDurations = [5.6, 6.2, 5.0, 5.9, 6.5, 5.2]
  const duration = floatDurations[item.index] || 5.5

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        animate={{
          y: [0, -6, 2, -4, 0],
          x: [0, 3, -2, 1, 0],
          rotateZ: [0, 1.2, -1, 0.6, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: item.delay * 0.4,
        }}
        whileHover={{
          scale: 1.15,
          z: 75,
          transition: { type: 'spring', stiffness: 500, damping: 20 },
        }}
        whileTap={{ scale: 0.95 }}
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(55px)' }}
        className="cursor-pointer select-none group"
      >
        <span
          className={`skill-pill orbit-pill orbit-pill-${item.index} inline-flex items-center gap-1.5 text-[10px] sm:text-[11.5px] px-3.5 py-1.5 whitespace-nowrap shadow-md`}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {item.isSpecial ? (
            <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'currentColor' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'currentColor' }} />
            </span>
          ) : (
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ background: 'currentColor' }}
              aria-hidden="true"
            />
          )}
          <span className="font-extrabold tracking-[-0.01em]">{item.label}</span>
        </span>
      </motion.div>
    </div>
  )
}

/* ─── Main 3D Interactive Stage ────────────────────────────────── */
export default function HeroAvatar3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Spring physics for responsive 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { stiffness: 220, damping: 22 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig)

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handlePointerLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex flex-col items-center w-full pt-10 select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Tilted Wrapper */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative flex flex-col items-center"
      >
        {/* Avatar + Orbiting Ring Bounds */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">

          {/* ── Background Live Radar Beam ── */}
          <div
            className="absolute -inset-10 rounded-full pointer-events-none opacity-[0.14] dark:opacity-[0.22] animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--accent) 70deg, transparent 110deg)',
              filter: 'blur(16px)',
              transform: 'translateZ(5px)',
            }}
            aria-hidden="true"
          />

          {/* ── Outer Orbital Track (Dashed, Rotating Clockwise) ── */}
          <div
            className="absolute rounded-full border border-dashed animate-spin-slow pointer-events-none"
            style={{
              inset: '-36px',
              borderColor: 'rgb(var(--accent-rgb) / 0.22)',
              transform: 'translateZ(10px)',
            }}
            aria-hidden="true"
          >
            {/* Travelling orbital particle */}
            <span
              className="absolute w-2 h-2 rounded-full -top-1 left-1/2 -translate-x-1/2 shadow-sm"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)',
              }}
            />
          </div>

          {/* ── Inner Orbital Track (Dashed, Counter-Clockwise) ── */}
          <div
            className="absolute rounded-full border border-dashed animate-spin-rev pointer-events-none"
            style={{
              inset: '-18px',
              borderColor: 'rgb(var(--accent-rgb) / 0.14)',
              transform: 'translateZ(15px)',
            }}
            aria-hidden="true"
          >
            {/* Travelling secondary particle */}
            <span
              className="absolute w-1.5 h-1.5 rounded-full -bottom-1 left-1/3 shadow-sm"
              style={{
                background: 'var(--signal)',
                boxShadow: '0 0 8px var(--signal)',
              }}
            />
          </div>

          {/* ── Ambient Radial Halo Glow ── */}
          <div
            className="absolute inset-0 rounded-full blur-[64px] scale-125 animate-glow-pulse pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgb(var(--accent-rgb) / 0.28), transparent 72%)',
              transform: 'translateZ(18px)',
            }}
            aria-hidden="true"
          />

          {/* ── Central Photo Avatar with 3D Depth Rim ── */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden hero-photo-ring cursor-pointer group"
            style={{
              border: '2px solid var(--border-hi)',
              boxShadow: 'var(--sh-3), 0 0 0 6px rgb(var(--accent-rgb) / 0.08), 0 18px 45px -12px rgba(0,0,0,0.45)',
              transform: 'translateZ(35px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <Image
              src={me}
              alt="Mehedi Hasan — Senior AI/LLM & Systems Architect"
              fill
              priority
              fetchPriority="high"
              quality={95}
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              sizes="(max-width:640px) 224px, (max-width:1024px) 256px, 288px"
            />
            {/* 3D Specular Sheen Over Photo */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 40% 30%, rgb(255 255 255 / 0.18), transparent 60%)',
              }}
              aria-hidden="true"
            />
          </div>

          {/* ── Orbiting Tech Badges Layer ── */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: '-42px',
              transformStyle: 'preserve-3d',
            }}
          >
            {TECH_STACK.map(item => (
              <OrbitingBadge key={item.label} item={item} />
            ))}
          </div>

        </div>

        {/* ── 3D Elevated Name Plate ── */}
        <div
          className="relative z-10 -mt-6 px-6 py-2.5 glass-card text-center transition-transform duration-300 hover:scale-105 cursor-default"
          style={{
            borderColor: 'var(--border-hi)',
            boxShadow: 'var(--sh-3), 0 12px 32px -8px rgba(0,0,0,0.5)',
            transform: 'translateZ(55px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
            <span
              className="font-extrabold text-[13px] sm:text-[14px] tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
            >
              Md Mehedi Hasan
            </span>
          </div>
          <div
            className="font-mono text-[10px] sm:text-[11px] font-extrabold tracking-wide"
            style={{ color: 'var(--accent)' }}
          >
            Sr. AI/LLM &amp; Systems Architect
          </div>
        </div>

      </motion.div>
    </div>
  )
}
