'use client'
import { useEffect, useRef } from 'react'

interface SphereTag {
  label: string
  catIndex: number
  x: number
  y: number
  z: number
}

const SPHERE_SKILLS: Array<{ label: string; cat: number }> = [
  { label: 'LangGraph', cat: 0 },
  { label: 'Multi-Agent', cat: 0 },
  { label: 'Supervisor', cat: 0 },
  { label: 'Pydantic V2', cat: 0 },
  { label: 'AutoGen', cat: 0 },
  { label: 'Hybrid RAG', cat: 1 },
  { label: 'BM25 + RRF', cat: 1 },
  { label: 'Qdrant', cat: 1 },
  { label: 'Cohere Rerank', cat: 1 },
  { label: 'Pinecone', cat: 1 },
  { label: 'Ragas Evals', cat: 2 },
  { label: 'Guardrails', cat: 2 },
  { label: 'Langfuse', cat: 2 },
  { label: 'TruLens', cat: 2 },
  { label: 'Python 3.12', cat: 3 },
  { label: 'FastAPI', cat: 3 },
  { label: 'AsyncIO', cat: 3 },
  { label: 'Django DRF', cat: 3 },
  { label: 'Celery', cat: 3 },
  { label: 'SSE Streams', cat: 3 },
  { label: 'Docker', cat: 4 },
  { label: 'vLLM', cat: 4 },
  { label: 'CI/CD', cat: 4 },
  { label: 'AWS', cat: 4 },
  { label: 'PostgreSQL', cat: 5 },
  { label: 'Redis', cat: 5 },
  { label: 'OpenAI', cat: 0 },
  { label: 'Claude 3.5', cat: 0 },
  { label: 'LiteLLM', cat: 4 },
  { label: 'TypeScript', cat: 3 },
]

const CAT_COLORS_DARK = ['#3ddc84', '#2dd4bf', '#ffa657', '#56b6f7', '#a3e635', '#a78bfa']
const CAT_COLORS_LIGHT = ['#16a34a', '#0284c7', '#d97706', '#2563eb', '#15803d', '#7c3aed']

export default function SkillSphere3D({ activeCategory }: { activeCategory: number | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const activeCatRef = useRef<number | null>(activeCategory)

  useEffect(() => {
    activeCatRef.current = activeCategory
  }, [activeCategory])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let animId = 0

    const n = SPHERE_SKILLS.length
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    const tags: SphereTag[] = SPHERE_SKILLS.map((item, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i
      return {
        label: item.label,
        catIndex: item.cat,
        x: Math.cos(theta) * radiusAtY,
        y,
        z: Math.sin(theta) * radiusAtY,
      }
    })

    const edges: [number, number][] = []
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        const d = Math.hypot(tags[i].x - tags[j].x, tags[i].y - tags[j].y, tags[i].z - tags[j].z)
        if (d < 0.68) edges.push([i, j])
      }
    }

    const rot = {
      x: 0.18,
      y: 0,
      vx: 0.002,
      vy: 0.0065,
      dragging: false,
      lastX: 0,
      lastY: 0,
    }

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      width = rect ? rect.width : 480
      height = 380
      dpr = 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onPointerDown = (e: PointerEvent) => {
      rot.dragging = true
      rot.lastX = e.clientX
      rot.lastY = e.clientY
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!rot.dragging) {
        const rect = canvas.getBoundingClientRect()
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
          const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
          rot.vy = nx * 0.014
          rot.vx = -ny * 0.01
        }
        return
      }
      const dx = e.clientX - rot.lastX
      const dy = e.clientY - rot.lastY
      rot.lastX = e.clientX
      rot.lastY = e.clientY
      rot.y += dx * 0.009
      rot.x += dy * 0.009
      rot.vy = dx * 0.002
      rot.vx = dy * 0.002
    }

    const onPointerUp = () => {
      rot.dragging = false
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      const isDark = document.documentElement.classList.contains('dark')
      const palette = isDark ? CAT_COLORS_DARK : CAT_COLORS_LIGHT
      const activeCat = activeCatRef.current

      if (!rot.dragging) {
        rot.y += rot.vy
        rot.x += rot.vx
        rot.vy = rot.vy * 0.98 + 0.0055 * 0.02
        rot.vx = rot.vx * 0.98 + 0.0015 * 0.02
      }

      const cx = width * 0.5
      const cy = height * 0.5
      const radius = Math.min(width, height) * 0.36
      const fov = 2.6

      const proj = tags.map(t => {
        const cosY = Math.cos(rot.y), sinY = Math.sin(rot.y)
        const x1 = t.x * cosY - t.z * sinY
        const z1 = t.z * cosY + t.x * sinY

        const cosX = Math.cos(rot.x), sinX = Math.sin(rot.x)
        const y2 = t.y * cosX - z1 * sinX
        const z2 = z1 * cosX + t.y * sinX

        const scale = fov / (fov + z2)
        return {
          ...t,
          sx: cx + x1 * radius * scale,
          sy: cy + y2 * radius * scale,
          z: z2,
          scale,
        }
      })

      for (const [i, j] of edges) {
        const p1 = proj[i]
        const p2 = proj[j]
        const avgZ = (p1.z + p2.z) * 0.5
        if (avgZ > 0.65) continue
        const matchCat = activeCat !== null && (p1.catIndex === activeCat || p2.catIndex === activeCat)
        const baseAlpha = Math.max(0.03, (1 - avgZ) * (isDark ? 0.16 : 0.10))
        ctx.strokeStyle = matchCat
          ? palette[activeCat]
          : (isDark ? `rgba(61, 220, 132, ${baseAlpha.toFixed(3)})` : `rgba(45, 55, 72, ${baseAlpha.toFixed(3)})`)
        ctx.lineWidth = matchCat ? 1.4 : 0.85
        ctx.beginPath()
        ctx.moveTo(p1.sx, p1.sy)
        ctx.lineTo(p2.sx, p2.sy)
        ctx.stroke()
      }

      const sorted = [...proj].sort((a, b) => b.z - a.z)

      for (const p of sorted) {
        const isHighlighted = activeCat === null || p.catIndex === activeCat
        const depthAlpha = Math.max(0.18, Math.min(1, (1.35 - p.z) * 0.68))
        const finalAlpha = isHighlighted ? depthAlpha : depthAlpha * 0.25
        const color = palette[p.catIndex % palette.length]

        ctx.globalAlpha = finalAlpha
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 3.2 * p.scale, 0, Math.PI * 2)
        ctx.fill()

        const fontSize = Math.max(9.5, Math.round(12 * p.scale))
        ctx.font = `700 ${fontSize}px ui-monospace, monospace`
        ctx.textAlign = 'center'
        ctx.fillStyle = isHighlighted
          ? (p.z < 0 ? (isDark ? '#ffffff' : '#0f172a') : color)
          : (isDark ? '#64748b' : '#94a3b8')
        ctx.fillText(p.label, p.sx, p.sy - 7 * p.scale)
      }
      ctx.globalAlpha = 1

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  return (
    <div className="glass-card spotlight border-beam p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between h-full">
      <div className="flex items-center justify-between px-2 pt-1">
        <span className="text-[11.5px] font-mono font-bold uppercase tracking-[0.16em] text-[--accent] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[--accent] animate-pulse" />
          3D Interactive Skill Sphere
        </span>
        <span className="text-[11px] font-mono text-[--text-dim]">
          Drag or hover to spin 3D
        </span>
      </div>
      <div className="relative w-full h-[360px] cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="block w-full h-full touch-none" />
      </div>
    </div>
  )
}
