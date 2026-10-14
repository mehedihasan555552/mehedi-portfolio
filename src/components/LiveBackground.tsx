'use client'
import { useEffect, useRef, memo } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  colorIdx: number
  pulsePhase: number
  pulseSpeed: number
  rippleRadius: number
  rippleMax: number
  rippleActive: boolean
  rippleAlpha: number
}

interface SignalPacket {
  fromIdx: number
  toIdx: number
  progress: number // 0 -> 1
  speed: number
  color: string
}

/**
 * LiveBackground — Premium Dual-Mode Motion Engine:
 *   • Dark Mode: Deep phosphor obsidian constellation, electric data pulses, cyan/emerald aurora, cyberpunk scanline
 *   • Light Mode: Soft, sunny pastel liquid mesh (Mint, Azure, Apricot, Lilac with multiply blend), airy floating nodes, zero muddy spiderwebs
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

    // Honor user accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let animFrame = 0
    let isVisible = true

    // Mouse coordinates & state
    let mouseX = -9999
    let mouseY = -9999
    let mouseActive = false
    let mouseTimeout: number | undefined

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      mouseActive = true
      window.clearTimeout(mouseTimeout)
      mouseTimeout = window.setTimeout(() => {
        mouseActive = false
      }, 3500)
    }

    const onPointerLeave = () => {
      mouseActive = false
      mouseX = -9999
      mouseY = -9999
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave, { passive: true })

    // Node & Signal arrays
    let nodes: Node[] = []
    let packets: SignalPacket[] = []
    let maxDist = 130
    let packetTimer = 0

    // Resize & init canvas
    const initCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const dark = isDarkRef.current
      maxDist = width < 768 ? (dark ? 95 : 80) : (dark ? 130 : 105)

      // In dark mode: rich 72-particle constellation
      // In light mode: airy, clean, elegant 36-particle floating nodes
      const targetCount = dark
        ? Math.floor(Math.min(72, Math.max(26, (width * height) / 22000)))
        : Math.floor(Math.min(40, Math.max(18, (width * height) / 36000)))

      nodes = []
      for (let i = 0; i < targetCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (dark ? 0.45 : 0.32),
          vy: (Math.random() - 0.5) * (dark ? 0.45 : 0.32),
          radius: dark ? (1.2 + Math.random() * 1.6) : (1.4 + Math.random() * 1.8),
          colorIdx: Math.floor(Math.random() * 3),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.012 + Math.random() * 0.018,
          rippleRadius: 0,
          rippleMax: 12 + Math.random() * 8,
          rippleActive: false,
          rippleAlpha: 0,
        })
      }
      packets = []
    }

    initCanvas()
    window.addEventListener('resize', initCanvas, { passive: true })

    // Pause when tab is hidden to save 100% CPU/battery
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible && !prefersReducedMotion) {
        lastTime = performance.now()
        animFrame = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    let lastTime = performance.now()

    // ── Simulation and Render Loop ──
    const render = (now: number) => {
      if (!isVisible) return

      const dt = Math.min(now - lastTime, 64)
      lastTime = now
      const timeScale = dt / 16.666

      ctx.clearRect(0, 0, width, height)

      const dark = isDarkRef.current

      // Palette definition:
      // Dark: Electric phosphor, cyber sky, and cosmic violet neon tones
      // Light: Soft pastel water beads (gentle mint, sky blue, warm peach)
      const nodeColors = dark
        ? [
            'rgba(61, 220, 132, 0.95)',  // electric emerald
            'rgba(56, 189, 248, 0.90)',  // electric sky/cyan
            'rgba(167, 139, 250, 0.90)', // cosmic neon violet
          ]
        : [
            'rgba(34, 197, 94, 0.50)',   // soft LearnHub green
            'rgba(2, 132, 199, 0.45)',   // soft azure
            'rgba(245, 158, 11, 0.40)',  // soft warm peach
          ]

      const lineRgb = dark ? '61, 220, 132' : '34, 197, 94'
      const packetColor = dark ? '#3ddc84' : 'rgba(22, 163, 74, 0.65)'
      const packetGlow = dark ? 'rgba(61, 220, 132, 0.85)' : 'rgba(34, 197, 94, 0.25)'

      // 1. Update node physics
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]

        n.x += n.vx * timeScale
        n.y += n.vy * timeScale
        n.pulsePhase += n.pulseSpeed * timeScale

        // Wrap around boundaries with padding
        if (n.x < -15) n.x = width + 15
        else if (n.x > width + 15) n.x = -15
        if (n.y < -15) n.y = height + 15
        else if (n.y > height + 15) n.y = -15

        // Gentle interactive mouse gravity / deflection
        if (mouseActive) {
          const dx = n.x - mouseX
          const dy = n.y - mouseY
          const dist = Math.hypot(dx, dy)
          const mouseRadius = dark ? 160 : 130
          if (dist < mouseRadius && dist > 1) {
            const force = (1 - dist / mouseRadius) * (dark ? 0.45 : 0.35) * timeScale
            n.x += (dx / dist) * force * 2.0
            n.y += (dy / dist) * force * 2.0
          }
        }

        // Update ripple ring
        if (n.rippleActive) {
          n.rippleRadius += 0.45 * timeScale
          n.rippleAlpha -= 0.02 * timeScale
          if (n.rippleAlpha <= 0 || n.rippleRadius >= n.rippleMax) {
            n.rippleActive = false
            n.rippleAlpha = 0
          }
        }
      }

      // 2. Draw connections between nodes
      const activePairs: Array<[number, number]> = []

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const dx = n2.x - n1.x
          const dy = n2.y - n1.y
          const dist = Math.hypot(dx, dy)

          if (dist < maxDist) {
            activePairs.push([i, j])
            // In dark mode: elegant, soft cyber filaments (0.18) so text stays crystal clear
            // In light mode: ultra-subtle, airy lines (0.04)
            const alpha = (1 - dist / maxDist) * (dark ? 0.18 : 0.04)
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha.toFixed(3)})`
            ctx.lineWidth = dark ? 0.95 : 0.75
            ctx.beginPath()
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()
          }
        }

        // Draw connections to mouse pointer
        if (mouseActive) {
          const mdx = mouseX - n1.x
          const mdy = mouseY - n1.y
          const mdist = Math.hypot(mdx, mdy)
          const mMax = dark ? 165 : 130
          if (mdist < mMax) {
            const mAlpha = (1 - mdist / mMax) * (dark ? 0.48 : 0.16)
            ctx.strokeStyle = `rgba(${lineRgb}, ${mAlpha.toFixed(3)})`
            ctx.lineWidth = dark ? 1.3 : 0.85
            ctx.beginPath()
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(mouseX, mouseY)
            ctx.stroke()
          }
        }
      }

      // 3. Spawn and draw data packet pulses (Agentic communication)
      packetTimer += timeScale
      if (packetTimer > (dark ? 45 : 75) && activePairs.length > 0 && packets.length < (dark ? 8 : 4)) {
        packetTimer = 0
        const randomPair = activePairs[Math.floor(Math.random() * activePairs.length)]
        const forward = Math.random() > 0.5
        packets.push({
          fromIdx: forward ? randomPair[0] : randomPair[1],
          toIdx: forward ? randomPair[1] : randomPair[0],
          progress: 0,
          speed: 0.014 + Math.random() * 0.016,
          color: Math.random() > 0.35 ? packetColor : (dark ? '#56b6f7' : 'rgba(2, 132, 199, 0.6)'),
        })
      }

      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p]
        pkt.progress += pkt.speed * timeScale

        if (pkt.progress >= 1) {
          // Trigger node ripple upon arrival
          const targetNode = nodes[pkt.toIdx]
          if (targetNode) {
            targetNode.rippleActive = true
            targetNode.rippleRadius = targetNode.radius
            targetNode.rippleAlpha = dark ? 0.75 : 0.35
          }
          packets.splice(p, 1)
          continue
        }

        const nFrom = nodes[pkt.fromIdx]
        const nTo = nodes[pkt.toIdx]
        if (!nFrom || !nTo) {
          packets.splice(p, 1)
          continue
        }

        const px = nFrom.x + (nTo.x - nFrom.x) * pkt.progress
        const py = nFrom.y + (nTo.y - nFrom.y) * pkt.progress

        // Packet glow aura
        ctx.fillStyle = packetGlow
        ctx.beginPath()
        ctx.arc(px, py, dark ? 4.5 : 3, 0, Math.PI * 2)
        ctx.fill()

        // Packet core photon
        ctx.fillStyle = pkt.color
        ctx.beginPath()
        ctx.arc(px, py, dark ? 2.2 : 1.8, 0, Math.PI * 2)
        ctx.fill()
      }

      // 4. Draw Nodes and their ripples
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const pulse = 1 + Math.sin(n.pulsePhase) * (dark ? 0.22 : 0.15)
        const r = n.radius * pulse

        // Draw ripple ring if active
        if (n.rippleActive && n.rippleAlpha > 0) {
          ctx.strokeStyle = `rgba(${lineRgb}, ${n.rippleAlpha.toFixed(3)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.rippleRadius, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Draw node core
        ctx.fillStyle = nodeColors[n.colorIdx]
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw active cursor glow
      if (mouseActive) {
        if (dark) {
          const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 18)
          gradient.addColorStop(0, 'rgba(61, 220, 132, 0.45)')
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(mouseX, mouseY, 18, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#3ddc84'
          ctx.beginPath()
          ctx.arc(mouseX, mouseY, 2.5, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Light mode: soft radiant pastel bloom, clean and sunlit
          const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 24)
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.18)')
          gradient.addColorStop(0.5, 'rgba(186, 230, 253, 0.10)')
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(mouseX, mouseY, 24, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = 'rgba(22, 163, 74, 0.55)'
          ctx.beginPath()
          ctx.arc(mouseX, mouseY, 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (!prefersReducedMotion) {
        animFrame = requestAnimationFrame(render)
      }
    }

    if (prefersReducedMotion) {
      // Draw static frame for reduced motion preference
      render(performance.now())
    } else {
      animFrame = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', initCanvas)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.clearTimeout(mouseTimeout)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Layer 1: Hardware-Accelerated Floating Aurora Orbs ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700"
        style={{
          mixBlendMode: isDark ? 'screen' : 'multiply',
          opacity: isDark ? 0.95 : 0.85,
        }}
      >
        {/* Orb 1: Phosphor Emerald Aurora (Dark) / Soft Mint Emerald (Light) */}
        <div
          className="live-aurora-orb live-aurora-orb-1 absolute -top-32 -left-32 w-[680px] h-[680px] rounded-full blur-[130px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(61, 220, 132, 0.42) 0%, rgba(16, 185, 129, 0.20) 45%, transparent 72%)'
              : 'radial-gradient(circle, rgba(167, 243, 208, 0.55) 0%, rgba(110, 231, 183, 0.28) 45%, transparent 70%)',
            opacity: isDark ? 0.55 : 0.9,
          }}
        />

        {/* Orb 2: Cyber Cyan / Sky Blue (Dark) / Soft Ice Azure (Light) */}
        <div
          className="live-aurora-orb live-aurora-orb-2 absolute top-[26%] -right-28 w-[640px] h-[640px] rounded-full blur-[125px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(56, 189, 248, 0.40) 0%, rgba(45, 212, 191, 0.18) 48%, transparent 75%)'
              : 'radial-gradient(circle, rgba(186, 230, 253, 0.60) 0%, rgba(125, 211, 252, 0.28) 50%, transparent 75%)',
            opacity: isDark ? 0.50 : 0.85,
          }}
        />

        {/* Orb 3: Cosmic Neon Violet (Dark) / Sunlit Apricot Peach (Light) */}
        <div
          className="live-aurora-orb live-aurora-orb-3 absolute top-[60%] -left-20 w-[600px] h-[600px] rounded-full blur-[135px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(168, 85, 247, 0.38) 0%, rgba(99, 102, 241, 0.16) 48%, transparent 72%)'
              : 'radial-gradient(circle, rgba(254, 215, 170, 0.50) 0%, rgba(253, 186, 116, 0.25) 45%, transparent 70%)',
            opacity: isDark ? 0.45 : 0.8,
          }}
        />

        {/* Orb 4: Electric Jade Teal (Dark) / Soft Lavender Lilac (Light) */}
        <div
          className="live-aurora-orb live-aurora-orb-4 absolute -bottom-24 right-[10%] w-[620px] h-[620px] rounded-full blur-[140px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(45, 212, 191, 0.40) 0%, rgba(16, 185, 129, 0.18) 48%, transparent 72%)'
              : 'radial-gradient(circle, rgba(233, 213, 255, 0.45) 0%, rgba(196, 181, 253, 0.22) 50%, transparent 70%)',
            opacity: isDark ? 0.48 : 0.75,
          }}
        />
      </div>

      {/* ── Layer 2: Subtle Live Scanning Beam (Cyberpunk Dark Mode ONLY) ── */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="live-scan-beam" />
        </div>
      )}

      {/* ── Layer 3: Interactive Agentic Neural Particle Mesh Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none block"
      />
    </div>
  )
}

export default memo(LiveBackgroundComponent)
