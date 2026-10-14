'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AgentNode3D {
  id: string
  label: string
  role: string
  metric: string
  desc: string
  x: number
  y: number
  z: number
  color: string
}

const AGENT_NODES: AgentNode3D[] = [
  {
    id: 'supervisor',
    label: 'Supervisor DAG',
    role: 'Central State Router',
    metric: '99.4% Convergence',
    desc: 'Pydantic-typed LangGraph state orchestrator routing tasks across specialized workers with strict step budgets.',
    x: 0,
    y: 0,
    z: 0,
    color: '#3ddc84',
  },
  {
    id: 'rag',
    label: 'Hybrid RAG Engine',
    role: 'BM25 + Dense + Rerank',
    metric: '38ms p95 · 97.4% Recall',
    desc: 'Reciprocal Rank Fusion over Qdrant dense embeddings and lexical BM25, filtered by Cross-Encoder reranking.',
    x: 1.05,
    y: 0.45,
    z: 0.55,
    color: '#38bdf8',
  },
  {
    id: 'sandbox',
    label: 'Tool Sandbox',
    role: 'Isolated Code & SQL',
    metric: '99.1% Schema Valid',
    desc: 'Self-healing tool execution runtime with Pydantic V2 validation, idempotency guards, and error reflection loops.',
    x: -1.05,
    y: 0.5,
    z: 0.45,
    color: '#a78bfa',
  },
  {
    id: 'evals',
    label: 'Ragas & Judge CI',
    role: 'Continuous Evaluation',
    metric: '500+ Golden Cases',
    desc: 'Automated Faithfulness, Answer Relevance, and Context Precision scoring gating every pull request.',
    x: 0.85,
    y: -0.68,
    z: -0.6,
    color: '#ffa657',
  },
  {
    id: 'guardrails',
    label: 'NeMo Guardrails',
    role: 'Security & PII Shield',
    metric: '99.8% Injection Block',
    desc: 'Multi-tier defense against indirect prompt injection, jailbreaks, and sensitive PII leakage at the wire.',
    x: -0.9,
    y: -0.62,
    z: -0.55,
    color: '#2dd4bf',
  },
  {
    id: 'gateway',
    label: 'LiteLLM Gateway',
    role: 'Multi-Model Failover',
    metric: '99.99% Uptime SLA',
    desc: 'Latency-based routing across OpenAI, Anthropic Claude, and AWS Bedrock with Redis semantic caching.',
    x: 0,
    y: 1.08,
    z: -0.75,
    color: '#a3e635',
  },
]

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 3], [2, 4], [5, 1], [5, 2], [3, 4],
]

export default function AgenticHolodeck3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selectedId, setSelectedId] = useState<string>('supervisor')
  const [autoRotate, setAutoRotate] = useState(true)

  const rotRef = useRef({ x: 0.24, y: 0.45, vx: 0, vy: 0.0055, dragging: false, lastX: 0, lastY: 0 })
  const projectedRef = useRef<Array<{ id: string; sx: number; sy: number; r: number; z: number }>>([])
  const selectedRef = useRef(selectedId)
  const autoRotateRef = useRef(autoRotate)

  useEffect(() => {
    selectedRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    autoRotateRef.current = autoRotate
  }, [autoRotate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let animId = 0

    const pulses = EDGES.map(([from, to], idx) => ({
      from,
      to,
      t: (idx * 0.19) % 1,
      speed: 0.006 + (idx % 3) * 0.0025,
    }))

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      width = rect ? rect.width : 540
      height = 340
      dpr = 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      const isDark = document.documentElement.classList.contains('dark')
      const rot = rotRef.current

      if (!rot.dragging) {
        if (autoRotateRef.current) {
          rot.y += 0.0055
          rot.x = 0.22 + Math.sin(now * 0.0007) * 0.12
        } else {
          rot.y += rot.vy
          rot.x += rot.vx
          rot.vy *= 0.94
          rot.vx *= 0.94
        }
      }

      const cx = width * 0.5
      const cy = height * 0.5
      const scaleRadius = Math.min(width, height) * 0.34
      const fov = 3.0

      const proj = AGENT_NODES.map(n => {
        const cosY = Math.cos(rot.y), sinY = Math.sin(rot.y)
        const x1 = n.x * cosY - n.z * sinY
        const z1 = n.z * cosY + n.x * sinY

        const cosX = Math.cos(rot.x), sinX = Math.sin(rot.x)
        const y2 = n.y * cosX - z1 * sinX
        const z2 = z1 * cosX + n.y * sinX

        const persp = fov / (fov + z2)
        const sx = cx + x1 * scaleRadius * persp
        const sy = cy + y2 * scaleRadius * persp
        const r = (n.id === 'supervisor' ? 16 : 11.5) * persp

        return { ...n, sx, sy, z: z2, persp, r }
      })

      projectedRef.current = proj.map(p => ({ id: p.id, sx: p.sx, sy: p.sy, r: p.r + 12, z: p.z }))

      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(1, Math.max(0.28, Math.abs(Math.sin(rot.x)) * 0.65 + 0.25))
      ctx.beginPath()
      ctx.arc(0, 0, scaleRadius * 1.12, 0, Math.PI * 2)
      ctx.strokeStyle = isDark ? 'rgba(61, 220, 132, 0.14)' : 'rgba(45, 55, 72, 0.12)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 6])
      ctx.stroke()
      ctx.restore()

      for (const [i, j] of EDGES) {
        const p1 = proj[i]
        const p2 = proj[j]
        const isHighlighted = p1.id === selectedRef.current || p2.id === selectedRef.current
        const alpha = isHighlighted ? (isDark ? 0.58 : 0.45) : (isDark ? 0.20 : 0.14)

        ctx.strokeStyle = isHighlighted
          ? (isDark ? '#3ddc84' : '#16a34a')
          : (isDark ? `rgba(148, 163, 184, ${alpha})` : `rgba(45, 55, 72, ${alpha})`)
        ctx.lineWidth = isHighlighted ? 1.8 : 1.1
        ctx.beginPath()
        ctx.moveTo(p1.sx, p1.sy)
        ctx.lineTo(p2.sx, p2.sy)
        ctx.stroke()
      }

      for (const pulse of pulses) {
        pulse.t = (pulse.t + pulse.speed) % 1
        const p1 = proj[pulse.from]
        const p2 = proj[pulse.to]
        const px = p1.sx + (p2.sx - p1.sx) * pulse.t
        const py = p1.sy + (p2.sy - p1.sy) * pulse.t

        ctx.fillStyle = isDark ? '#3ddc84' : '#16a34a'
        ctx.beginPath()
        ctx.arc(px, py, 2.6, 0, Math.PI * 2)
        ctx.fill()
      }

      const sorted = [...proj].sort((a, b) => b.z - a.z)

      for (const node of sorted) {
        const isSel = node.id === selectedRef.current

        if (isSel) {
          const halo = ctx.createRadialGradient(node.sx, node.sy, 2, node.sx, node.sy, node.r * 2.8)
          halo.addColorStop(0, isDark ? 'rgba(61, 220, 132, 0.42)' : 'rgba(22, 163, 74, 0.28)')
          halo.addColorStop(1, 'transparent')
          ctx.fillStyle = halo
          ctx.beginPath()
          ctx.arc(node.sx, node.sy, node.r * 2.8, 0, Math.PI * 2)
          ctx.fill()
        }

        const sphereGrad = ctx.createRadialGradient(
          node.sx - node.r * 0.3,
          node.sy - node.r * 0.3,
          node.r * 0.1,
          node.sx,
          node.sy,
          node.r
        )
        sphereGrad.addColorStop(0, '#ffffff')
        sphereGrad.addColorStop(0.35, node.color)
        sphereGrad.addColorStop(1, isDark ? '#06140d' : '#1e293b')

        ctx.fillStyle = sphereGrad
        ctx.beginPath()
        ctx.arc(node.sx, node.sy, node.r, 0, Math.PI * 2)
        ctx.fill()

        ctx.lineWidth = isSel ? 2.2 : 1.2
        ctx.strokeStyle = isSel ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.35)' : '#1e293b')
        ctx.stroke()

        ctx.font = `${isSel ? '700' : '600'} ${Math.round(11 * node.persp)}px ui-monospace, monospace`
        ctx.textAlign = 'center'
        ctx.fillStyle = isSel
          ? (isDark ? '#3ddc84' : '#15803d')
          : (isDark ? 'rgba(226, 232, 240, 0.88)' : 'rgba(17, 24, 39, 0.88)')
        ctx.fillText(node.label, node.sx, node.sy + node.r + 14)
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hit = [...projectedRef.current]
      .sort((a, b) => a.z - b.z)
      .find(n => Math.hypot(n.sx - x, n.sy - y) <= n.r + 6)

    if (hit) {
      setSelectedId(hit.id)
    }

    rotRef.current.dragging = true
    rotRef.current.lastX = e.clientX
    rotRef.current.lastY = e.clientY
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!rotRef.current.dragging) return
    const dx = e.clientX - rotRef.current.lastX
    const dy = e.clientY - rotRef.current.lastY
    rotRef.current.lastX = e.clientX
    rotRef.current.lastY = e.clientY
    rotRef.current.y += dx * 0.008
    rotRef.current.x = Math.max(-0.85, Math.min(0.85, rotRef.current.x + dy * 0.008))
    rotRef.current.vy = dx * 0.001
    rotRef.current.vx = dy * 0.001
  }

  const handlePointerUp = () => {
    rotRef.current.dragging = false
  }

  const activeNode = AGENT_NODES.find(n => n.id === selectedId) || AGENT_NODES[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-16 glass-card spotlight border-beam p-6 sm:p-8 overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow mb-2">Interactive 3D Topology</span>
          <h3
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
          >
            Production Multi-Agent &amp; Hybrid RAG <span style={{ color: 'var(--accent)' }}>3D Holodeck</span>
          </h3>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-[--text-dim] hidden sm:inline">
            Drag to rotate 3D · Click nodes to inspect
          </span>
          <button
            type="button"
            onClick={() => setAutoRotate(v => !v)}
            className="px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-colors cursor-pointer"
            style={{
              background: autoRotate ? 'var(--accent-soft)' : 'var(--bg-2)',
              color: autoRotate ? 'var(--accent)' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            {autoRotate ? '⟳ 3D Orbit: ON' : '⏸ 3D Orbit: PAUSED'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-center">
        <div
          className="lg:col-span-7 relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="block w-full h-[340px] touch-none"
          />
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between pointer-events-none text-[11px] font-mono text-[--text-dim]">
            <span>3D Spatial DAG Projection · 60 FPS</span>
            <span style={{ color: 'var(--accent)' }}>Active Node: {activeNode.label}</span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
            {AGENT_NODES.map(node => {
              const on = node.id === selectedId
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  className="text-left px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                  style={{
                    background: on ? 'var(--accent-soft)' : 'var(--bg-2)',
                    border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                    color: on ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: node.color, boxShadow: on ? `0 0 8px ${node.color}` : 'none' }}
                  />
                  <span className="truncate">{node.label}</span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-5 rounded-2xl"
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border-hi)',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: activeNode.color }}>
                  {activeNode.role}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold"
                  style={{
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent-line)',
                  }}
                >
                  {activeNode.metric}
                </span>
              </div>
              <h4
                className="text-lg font-extrabold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
              >
                {activeNode.label}
              </h4>
              <p className="text-[14.5px] leading-relaxed text-[--text-muted]">
                {activeNode.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
