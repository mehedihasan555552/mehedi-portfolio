'use client'
import { useEffect, useRef, memo } from 'react'
import { useTheme } from '@/context/ThemeContext'

const AI_NODE_LABELS = [
  'LLM::Core',
  'LangGraph',
  'Hybrid_RAG',
  'Attn(Q,K,V)',
  'Multi-Agent',
  'Ragas::0.98',
  'vLLM',
  'Embed[1536]',
  'Guardrail',
  'Qdrant_DB',
  'FastAPI',
  'Token_Stream',
]

interface AINode {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  radius: number
  colorIdx: number
  label: string | null
  isHub: boolean
}

interface TokenPulse {
  fromIdx: number
  toIdx: number
  progress: number
  speed: number
  colorIdx: number
}

/**
 * LiveBackground — Ultra-Smooth, Zero-Lag Live AI Neural & Token Network
 * Engineered for 60fps performance:
 *   • Uses 1x native CSS resolution (no 4x Retina pixel fill overhead)
 *   • Lean 24-node AI topology (14 on mobile) with zero per-frame gradient allocations
 *   • Crisp, luminous Light Mode (Alabaster Pearl + Emerald/Sky wash) & Obsidian Dark Mode
 */
function LiveBackgroundComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isDarkRef = useRef(isDark)

  useEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let animFrame = 0
    let isVisible = true

    let nodes: AINode[] = []
    let pulses: TokenPulse[] = []
    let maxDist = 210
    let pulseTimer = 0

    const initCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight

      // 1x resolution keeps GPU fill-rate minimal and eliminates scroll/animation lag
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const isMobile = width < 768
      maxDist = isMobile ? 150 : 225
      const count = isMobile ? 14 : 24
      const hubCount = isMobile ? 6 : 11

      nodes = []
      for (let i = 0; i < count; i++) {
        const isHub = i < hubCount
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: isHub ? 1 : 0.72,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          radius: isHub ? 3.2 : 2.0,
          colorIdx: i % 3,
          label: isHub ? AI_NODE_LABELS[i % AI_NODE_LABELS.length] : null,
          isHub,
        })
      }
      pulses = []
    }

    initCanvas()
    window.addEventListener('resize', initCanvas, { passive: true })

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible && !prefersReducedMotion) {
        lastTime = performance.now()
        animFrame = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    let lastTime = performance.now()

    const render = (now: number) => {
      if (!isVisible) return

      const dt = Math.min(now - lastTime, 50)
      lastTime = now
      const step = dt / 16.666

      ctx.clearRect(0, 0, width, height)

      const dark = isDarkRef.current

      // Pre-computed palette strings (zero string/gradient allocation overhead)
      const nodePalette = dark
        ? ['rgba(61, 220, 132, 0.85)', 'rgba(56, 189, 248, 0.82)', 'rgba(167, 139, 250, 0.80)']
        : ['rgba(16, 185, 129, 0.72)', 'rgba(14, 165, 233, 0.68)', 'rgba(99, 102, 241, 0.65)']

      const ringColor = dark ? 'rgba(61, 220, 132, 0.26)' : 'rgba(16, 185, 129, 0.24)'
      const labelColor = dark ? 'rgba(110, 231, 183, 0.52)' : 'rgba(15, 23, 42, 0.46)'
      const pulseColors = dark
        ? ['#3ddc84', '#38bdf8', '#a78bfa']
        : ['#10b981', '#0284c7', '#6366f1']

      // 1. Update positions
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx * step
        n.y += n.vy * step

        if (n.x < -20) n.x = width + 20
        else if (n.x > width + 20) n.x = -20
        if (n.y < -20) n.y = height + 20
        else if (n.y > height + 20) n.y = -20
      }

      // 2. Draw AI neural edges (O(N^2) on N=24 is only 276 checks — <0.1ms!)
      const connectedPairs: Array<[number, number]> = []
      ctx.lineWidth = 1

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const dx = n2.x - n1.x
          const dy = n2.y - n1.y
          const dist = Math.hypot(dx, dy)

          if (dist < maxDist) {
            connectedPairs.push([i, j])
            const alpha = (1 - dist / maxDist) * (dark ? 0.18 : 0.14)
            ctx.strokeStyle = dark
              ? `rgba(61, 220, 132, ${alpha.toFixed(3)})`
              : `rgba(16, 185, 129, ${alpha.toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()
          }
        }
      }

      // 3. Spawn & draw live AI token pulses along edges
      pulseTimer += step
      if (pulseTimer > 22 && connectedPairs.length > 0 && pulses.length < 8) {
        pulseTimer = 0
        const pair = connectedPairs[Math.floor(Math.random() * connectedPairs.length)]
        const flip = Math.random() > 0.5
        pulses.push({
          fromIdx: flip ? pair[0] : pair[1],
          toIdx: flip ? pair[1] : pair[0],
          progress: 0,
          speed: 0.012 + Math.random() * 0.012,
          colorIdx: Math.floor(Math.random() * 3),
        })
      }

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pkt = pulses[p]
        pkt.progress += pkt.speed * step
        if (pkt.progress >= 1) {
          pulses.splice(p, 1)
          continue
        }
        const nFrom = nodes[pkt.fromIdx]
        const nTo = nodes[pkt.toIdx]
        if (!nFrom || !nTo) {
          pulses.splice(p, 1)
          continue
        }

        const px = nFrom.x + (nTo.x - nFrom.x) * pkt.progress
        const py = nFrom.y + (nTo.y - nFrom.y) * pkt.progress

        ctx.fillStyle = pulseColors[pkt.colorIdx]
        ctx.beginPath()
        ctx.arc(px, py, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }

      // 4. Draw AI nodes and subtle telemetry labels
      ctx.font = '600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.textAlign = 'left'

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]

        if (n.isHub) {
          ctx.strokeStyle = ringColor
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.radius * 2.3, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.fillStyle = nodePalette[n.colorIdx]
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fill()

        if (n.label) {
          ctx.fillStyle = labelColor
          ctx.fillText(n.label, n.x + 9, n.y + 3)
        }
      }

      if (!prefersReducedMotion) {
        animFrame = requestAnimationFrame(render)
      }
    }

    if (prefersReducedMotion) {
      render(performance.now())
    } else {
      animFrame = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', initCanvas)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Layer 1: Zero-Lag GPU-Composited Ambient Mesh Wash (Dark & Light Modes) ── */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 14% 16%, rgba(61, 220, 132, 0.11) 0%, transparent 42%), ' +
              'radial-gradient(circle at 86% 24%, rgba(56, 189, 248, 0.09) 0%, transparent 42%), ' +
              'radial-gradient(circle at 22% 82%, rgba(167, 139, 250, 0.07) 0%, transparent 45%), ' +
              'radial-gradient(circle at 82% 84%, rgba(45, 212, 191, 0.08) 0%, transparent 42%)'
            : 'radial-gradient(circle at 12% 14%, rgba(16, 185, 129, 0.11) 0%, transparent 44%), ' +
              'radial-gradient(circle at 88% 18%, rgba(14, 165, 233, 0.10) 0%, transparent 44%), ' +
              'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.90) 0%, transparent 65%), ' +
              'radial-gradient(circle at 18% 85%, rgba(99, 102, 241, 0.07) 0%, transparent 45%), ' +
              'radial-gradient(circle at 85% 86%, rgba(16, 185, 129, 0.09) 0%, transparent 45%)',
        }}
      />

      {/* ── Layer 2: Subtle Architectural Dot/Grid Matrix ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(rgba(61, 220, 132, 0.12) 1px, transparent 1px)'
            : 'radial-gradient(rgba(15, 23, 42, 0.075) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, #000 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, #000 30%, transparent 90%)',
        }}
      />

      {/* ── Layer 3: Lightweight 60fps Live AI Neural & Token Stream Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none block"
      />
    </div>
  )
}

export default memo(LiveBackgroundComponent)
