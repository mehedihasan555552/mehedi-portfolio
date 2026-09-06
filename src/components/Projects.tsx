'use client'
import { useState, memo, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { useReveal } from '@/hooks/useReveal'
import SectionHeader from './SectionHeader'

const FILTERS = ['All', 'AI/ML', 'Full-Stack', 'Backend']

const GitHubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

const ExternalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

/* ─── Card ─────────────────────────────────────────────────────────────── */
const ProjectCard = memo(function ProjectCard({
  project,
}: { project: typeof projects[0] }) {
  return (
    <article
      data-reveal="scale"
      className="group relative glass-card glass-card-hover spotlight overflow-hidden flex flex-col"
    >
      {/* Whole-card link; the action buttons sit above it on z-10 */}
      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 z-0 focus-visible:outline-none"
        aria-label={`View details for ${project.title}`}
        prefetch
      />

      {/* Media */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <Image
          src={project.image}
          alt={`${project.title} — ${project.tagline}`}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
        />
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgb(3 8 6 / 0.82), rgb(3 8 6 / 0.15) 55%, transparent)' }}
          aria-hidden="true"
        />
        <span
          className="absolute top-3.5 left-3.5 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] backdrop-blur-sm"
          style={{
            borderRadius: 'var(--r-sm)',
            background: 'rgb(2 8 5 / 0.62)',
            border: '1px solid rgb(var(--accent-rgb) / 0.5)',
            color: 'var(--accent)',
          }}
        >
          {project.category}
        </span>
        <span
          className="absolute top-3.5 right-3.5 px-2 py-1 text-[10px] font-mono backdrop-blur-sm text-white/85"
          style={{ borderRadius: 'var(--r-sm)', background: 'rgb(0 0 0 / 0.42)' }}
        >
          {project.year}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-[16.5px] font-bold leading-snug tracking-[-0.02em] transition-colors duration-200 group-hover:text-[--accent]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {project.title}
        </h3>
        <p className="text-[12.5px] font-mono mt-1 mb-3" style={{ color: 'var(--accent)' }}>
          {project.tagline}
        </p>
        {/* No flex-1 here: growing the box lets every line fit, which stops
            -webkit-line-clamp from ever kicking in. The actions row uses
            mt-auto to take up the slack instead. */}
        <p className="text-[13.5px] leading-relaxed text-[--text-muted] mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {project.stats.slice(0, 2).map(s => (
            <div
              key={s.label}
              className="text-center py-2 px-1"
              style={{
                borderRadius: 'var(--r-sm)',
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="text-[14px] font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                {s.value}
              </div>
              <div className="text-[10px] text-[--text-dim] mt-0.5 truncate">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tech */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 4).map(t => (
            <span
              key={t}
              className="px-2 py-[3px] text-[10.5px] font-mono text-[--text-dim]"
              style={{
                borderRadius: 'var(--r-xs)',
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
              }}
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span
              className="px-2 py-[3px] text-[10.5px] font-mono text-[--text-dim]"
              style={{ borderRadius: 'var(--r-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)' }}
            >
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-2.5 pt-4 mt-auto"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span
            className="flex-1 py-2 text-center text-[12.5px] font-mono font-semibold pointer-events-none select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:gap-2"
            style={{
              borderRadius: 'var(--r-sm)',
              background: 'var(--accent-soft)',
              border: '1px solid var(--accent-line)',
              color: 'var(--accent)',
            }}
          >
            View Details{' '}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source code on GitHub`}
            onClick={e => e.stopPropagation()}
            className="relative z-10 w-9 h-9 rounded-md glass-card grid place-items-center text-[--text-muted] hover:text-[--accent] hover:border-[--accent-line] transition-colors duration-200"
          >
            <GitHubIcon />
          </a>

          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live demo`}
            onClick={e => e.stopPropagation()}
            className="relative z-10 w-9 h-9 rounded-md glass-card grid place-items-center text-[--text-muted] hover:text-[--accent] hover:border-[--accent-line] transition-colors duration-200"
          >
            <ExternalIcon />
          </a>
        </div>
      </div>
    </article>
  )
})

/* Remount on filter change so the reveal cascade replays */
function ProjectGrid({ filtered }: { filtered: typeof projects }) {
  const gridRef = useReveal(0.05, 65)
  return (
    <div
      ref={gridRef as React.RefObject<HTMLDivElement>}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {filtered.map(p => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  )
}

/* ─── Main ─────────────────────────────────────────────────────────────── */
export default function Projects() {
  const [filter, setFilter]             = useState('All')
  const [visible, setVisible]           = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ref = useReveal(0.05)

  const handleFilter = useCallback((f: string) => {
    if (f === filter) return
    setFilter(f)
    setVisible(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setActiveFilter(f)
      setVisible(true)
    }, 200)
  }, [filter])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  return (
    <section
      id="projects"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div
        data-parallax
        className="absolute bottom-0 right-0 w-[420px] aspect-square rounded-full opacity-[0.05] blur-[100px] pointer-events-none"
        style={{ ['--par' as string]: '60px', background: 'var(--accent)' }}
        aria-hidden="true"
      />

      <div className="container-x">
        <SectionHeader
          index="04 —"
          title="Featured"
          emphasis="Projects"
          standfirst="Showcasing innovative solutions built with cutting-edge technologies."
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10 reveal" role="tablist" aria-label="Filter projects by category">
          {FILTERS.map(f => {
            const on = filter === f
            return (
              <button
                key={f}
                role="tab"
                aria-selected={on}
                onClick={() => handleFilter(f)}
                className="px-4 py-2 text-[13px] font-mono font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  borderRadius: 'var(--r-md)',
                  background: on ? 'var(--accent)' : 'var(--card)',
                  color:      on ? 'var(--on-accent)' : 'var(--text-muted)',
                  border:     `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                  boxShadow:  on ? '0 6px 18px -6px rgb(var(--accent-rgb) / 0.55)' : 'none',
                  transform:  on ? 'translateY(-1px)' : 'none',
                }}
              >
                {f}
              </button>
            )
          })}
        </div>

        <div
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(10px)',
            transition: 'opacity 260ms cubic-bezier(0.16,1,0.3,1), transform 260ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <ProjectGrid key={activeFilter} filtered={filtered} />
        </div>

        <p className="text-center mt-8 text-[12.5px] font-mono text-[--text-dim]">
          Showing <span style={{ color: 'var(--accent)' }}>{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'project' : 'projects'}
          {activeFilter !== 'All' && (
            <> in <span style={{ color: 'var(--accent)' }}>{activeFilter}</span></>
          )}
        </p>

        <div className="text-center mt-9 reveal">
          <a
            href="https://github.com/mehedihasan555552"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <GitHubIcon />
            View all repositories on GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
