'use client'
import { useState, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { useReveal } from '@/hooks/useReveal'

const FILTERS = ['All', 'AI/ML', 'Full-Stack', 'Backend']

const GitHubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

const ProjectCard = memo(function ProjectCard({
  project, delay,
}: {
  project: typeof projects[0]
  delay: number
}) {
  return (
    <article
      className={`reveal group glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col d${Math.min(delay + 1, 6)}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={`${project.title} — ${project.tagline}`}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#4f7fff]/75 backdrop-blur-sm">
          {project.category}
        </span>
        <span className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-mono text-white bg-black/40 backdrop-blur-sm">
          {project.year}
        </span>
      </div>
      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold dark:text-white text-[#1a1830] mb-1 group-hover:text-[--accent] transition-colors leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          {project.title}
        </h3>
        <p className="text-sm italic text-[--accent] mb-3" style={{ fontFamily: 'var(--font-italic)' }}>{project.tagline}</p>
        <p className="text-sm dark:text-white/70 text-[#1a1640] leading-relaxed mb-4 flex-1 line-clamp-2 font-medium">{project.description}</p>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {project.stats.slice(0, 2).map(s => (
            <div key={s.label} className="text-center p-2 rounded-xl dark:bg-[#0f0f1a] bg-[#f0eeff]">
              <div className="text-base font-bold text-[--accent]">{s.value}</div>
              <div className="text-xs text-[--text-muted]">{s.label}</div>
            </div>
          ))}
        </div>
        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 4).map(t => (
            <span key={t} className="px-2.5 py-1 rounded-lg dark:bg-[#0f0f1a] bg-[#f0eeff] text-xs font-mono text-[--text-muted] border border-[--border]">{t}</span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2.5 py-1 rounded-lg dark:bg-[#0f0f1a] bg-[#f0eeff] text-xs font-mono text-[--text-dim] border border-[--border]">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-[--border]">
          <Link
            href={`/projects/${project.id}`}
            className="flex-1 py-2.5 text-center text-sm font-semibold bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] text-white rounded-xl transition-[transform,box-shadow] duration-200 hover:shadow-lg hover:shadow-[#4f7fff]/25 hover:-translate-y-0.5"
            prefetch={false}
          >
            View Details →
          </Link>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            aria-label={`${project.title} source code on GitHub`}
            className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-[--text-muted] hover:text-white hover:border-[--border] transition-colors">
            <GitHubIcon />
          </a>
          <a href={project.live} target="_blank" rel="noopener noreferrer"
            aria-label={`${project.title} live demo`}
            className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-[--text-muted] hover:text-[--accent] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
      </div>
    </article>
  )
})

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const ref = useReveal(0.05)

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" ref={ref as React.RefObject<HTMLDivElement>} className="py-28 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-[0.04] bg-[#4f7fff] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-4 mb-6 reveal">
          <span className="font-mono text-sm text-[--accent]">04.</span>
          <h2 className="text-4xl md:text-5xl font-black dark:text-white text-[#1a1830]" style={{ fontFamily: 'var(--font-display)' }}>
            Featured <em className="italic text-[--accent]">Projects</em>
          </h2>
          <div className="flex-1 h-px bg-[--border]" />
        </div>
        <p className="text-lg italic dark:text-white/55 text-[#3b3860] font-semibold mb-10 reveal" style={{ fontFamily: 'var(--font-italic)' }}>
          Showcasing innovative solutions built with cutting-edge technologies
        </p>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12 reveal" role="tablist" aria-label="Filter projects by category">
          {FILTERS.map(f => (
            <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-base font-semibold transition-[background,box-shadow,transform] duration-200 ${
                filter === f
                  ? 'bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] text-white shadow-lg shadow-[#4f7fff]/20'
                  : 'glass-card glass-card-hover text-[--text-muted] hover:text-[--text]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => <ProjectCard key={p.id} project={p} delay={i % 6} />)}
        </div>

        <div className="text-center mt-14 reveal">
          <a href="https://github.com/mehedihasan555552" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 glass-card glass-card-hover rounded-2xl text-base font-semibold text-[--text-muted] hover:text-[--text]">
            <GitHubIcon />
            View all repositories on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  )
}
