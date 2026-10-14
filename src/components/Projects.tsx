'use client'
import { useState, memo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import type { ProjectItem } from '@/data/defaultDb'
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

const ProjectCard = memo(function ProjectCard({
  project,
  onQuickView,
}: {
  project: ProjectItem
  onQuickView: (p: ProjectItem) => void
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group relative glass-card glass-card-hover spotlight overflow-hidden flex flex-col tilt-3d h-full"
    >
      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 z-0 focus-visible:outline-none"
        aria-label={`View details for ${project.title}`}
      />

      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image
          src={project.image || 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80'}
          alt={`${project.title} — ${project.tagline}`}
          fill
          loading="lazy"
          unoptimized={!project.image?.includes('images.unsplash.com')}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
        />
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgb(3 8 6 / 0.82), rgb(3 8 6 / 0.15) 55%, transparent)' }}
          aria-hidden="true"
        />
        <span className="card-category-badge absolute top-3.5 left-3.5 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-[0.1em]">
          {project.category}
        </span>
        <span className="card-year-badge absolute top-3.5 right-3.5 px-2.5 py-1 text-[11px] font-mono text-white/90">
          {project.year}
        </span>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3
          className="text-[19px] sm:text-[21px] font-extrabold leading-snug tracking-[-0.015em] transition-colors duration-200 group-hover:text-[--accent]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {project.title}
        </h3>
        <p className="text-[13.5px] sm:text-[14px] font-mono font-bold mt-1 mb-3" style={{ color: 'var(--accent)' }}>
          {project.tagline}
        </p>
        <p className="text-[15px] sm:text-[15.5px] font-medium leading-relaxed text-[--text-muted] mb-4 line-clamp-2">
          {project.description}
        </p>

        {project.stats?.length > 0 && (
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
                <div className="text-[15.5px] sm:text-[16.5px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                  {s.value}
                </div>
                <div className="text-[11.5px] font-bold text-[--text-dim] mt-0.5 truncate uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 4).map(t => (
            <span
              key={t}
              className="px-2.5 py-1 text-[12px] font-mono font-bold text-[--text-muted]"
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
              className="px-2.5 py-1 text-[12px] font-mono font-bold text-[--text-dim]"
              style={{
                borderRadius: 'var(--r-xs)',
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
              }}
            >
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-2 pt-4 mt-auto border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <Link
            href={`/projects/${project.id}`}
            className="btn btn-primary text-xs flex-1 text-center py-2 relative z-10"
          >
            Case Study →
          </Link>

          <button
            type="button"
            onClick={e => { e.stopPropagation(); onQuickView(project) }}
            className="relative z-10 px-3 h-10 rounded-md glass-card text-[11px] font-mono font-bold text-[--text-muted] hover:text-[--accent] transition-colors cursor-pointer"
          >
            Specs
          </button>

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source code on GitHub`}
            onClick={e => e.stopPropagation()}
            className="relative z-10 w-10 h-10 rounded-md glass-card grid place-items-center text-[--text-muted] hover:text-[--accent] transition-colors"
          >
            <GitHubIcon />
          </a>

          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live demo`}
            onClick={e => e.stopPropagation()}
            className="relative z-10 w-10 h-10 rounded-md glass-card grid place-items-center text-[--text-muted] hover:text-[--accent] transition-colors"
          >
            <ExternalIcon />
          </a>
        </div>
      </div>
    </motion.article>
  )
})

export default function Projects() {
  const { db } = usePortfolioData()
  const projects = db.projects
  const [filter, setFilter] = useState('All')
  const [quickProject, setQuickProject] = useState<ProjectItem | null>(null)
  const ref = useReveal(0.05)

  const handleFilter = useCallback((f: string) => {
    setFilter(f)
  }, [])

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter)

  return (
    <section
      id="projects"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div className="container-x">
        <SectionHeader
          index="04 —"
          title="Featured"
          emphasis="Projects"
          standfirst="Showcasing production AI systems, RAG pipelines, and full-stack platforms."
        />

        <div className="flex flex-wrap gap-2.5 mb-10" role="tablist" aria-label="Filter projects by category">
          {FILTERS.map(f => {
            const on = filter === f
            const count = f === 'All' ? projects.length : projects.filter(p => p.category === f).length
            return (
              <button
                key={f}
                role="tab"
                aria-selected={on}
                onClick={() => handleFilter(f)}
                className="relative px-5 py-2 text-[13.5px] font-bold rounded-full transition-colors duration-200 cursor-pointer"
                style={{
                  background: on ? 'var(--accent)' : 'var(--card)',
                  color: on ? 'var(--on-accent)' : 'var(--text-muted)',
                  border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {f} <span className="opacity-75 font-mono text-xs ml-0.5">({count})</span>
              </button>
            )
          })}
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} onQuickView={setQuickProject} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-10">
          <a
            href={db.profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost inline-flex items-center gap-2"
          >
            <GitHubIcon />
            View all repositories on GitHub ↗
          </a>
        </div>
      </div>

      <AnimatePresence>
        {quickProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickProject(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              onClick={e => e.stopPropagation()}
              className="glass-card max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="eyebrow mb-2">{quickProject.category} · {quickProject.year}</span>
                  <h3
                    className="text-2xl sm:text-3xl font-extrabold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
                  >
                    {quickProject.title}
                  </h3>
                  <p className="text-sm font-mono font-bold mt-1" style={{ color: 'var(--accent)' }}>
                    {quickProject.tagline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickProject(null)}
                  className="w-9 h-9 rounded-full glass-card grid place-items-center text-sm font-mono cursor-pointer hover:text-[--accent]"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <p className="text-[15px] text-[--text-muted] leading-relaxed mb-5">
                {quickProject.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                {quickProject.stats.map(s => (
                  <div
                    key={s.label}
                    className="p-3 rounded-xl text-center"
                    style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
                  >
                    <div className="text-lg font-mono font-extrabold" style={{ color: 'var(--accent)' }}>
                      {s.value}
                    </div>
                    <div className="text-[10.5px] font-mono uppercase tracking-wider text-[--text-dim]">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 mb-6">
                {quickProject.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[--text-muted]">
                    <span className="text-[--accent] font-mono font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[--border]">
                <Link
                  href={`/projects/${quickProject.id}`}
                  onClick={() => setQuickProject(null)}
                  className="btn btn-primary text-xs py-2.5 px-5"
                >
                  Open Full Case Study →
                </Link>
                <a
                  href={quickProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost text-xs py-2.5 px-4"
                >
                  <GitHubIcon /> GitHub Repository
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
