'use client'
import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import type { ProjectItem } from '@/data/defaultDb'
import SocialIcon from '@/components/SocialIcon'

const ExternalIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
)

const BackArrow = () => (
  <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)

export default function ProjectDetailClient({
  id,
  initialProject,
}: {
  id: string
  initialProject: ProjectItem | null
}) {
  const { db } = usePortfolioData()
  const project = useMemo(
    () => db.projects.find(p => p.id === id) || initialProject || db.projects[0],
    [db.projects, id, initialProject]
  )
  const related = useMemo(
    () => db.projects.filter(p => p.id !== project?.id && p.category === project?.category).slice(0, 3),
    [db.projects, project]
  )

  if (!project) return null

  return (
    <main className="min-h-screen pt-20">
      <section className="relative h-[56vh] min-h-[400px] overflow-hidden" aria-label="Project hero">
        <Image
          src={project.image || 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80'}
          alt={project.title}
          fill
          priority
          unoptimized={!project.image?.includes('images.unsplash.com')}
          className="object-cover scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[--bg] via-[--bg]/40 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-14 w-full">
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-6"
            >
              <BackArrow />
              Back to Projects
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="card-category-badge px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-[0.1em]">
                {project.category}
              </span>
              <span className="card-year-badge px-3 py-1 text-[11px] font-mono text-white/90">
                {project.year}
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-3 max-w-3xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {project.title}
            </h1>
            <p className="text-lg sm:text-xl italic text-white/85 max-w-xl">
              {project.tagline}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-14">
            <section>
              <h2
                className="text-2xl font-bold mb-5 flex items-center gap-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                Project Overview
              </h2>
              <div className="space-y-4">
                {(project.longDescription || project.description).split('\n\n').map((para, i) => (
                  <p key={i} className="text-base sm:text-lg text-[--text-muted] leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>

            {project.stats?.length > 0 && (
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.stats.map(s => (
                  <div key={s.label} className="glass-card glass-card-hover spotlight p-4 text-center">
                    <dd
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                    >
                      {s.value}
                    </dd>
                    <dt className="text-xs text-[--text-muted] font-mono uppercase tracking-wide">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}

            {project.gallery?.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold mb-5 flex items-center gap-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                  Gallery
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="relative h-56 overflow-hidden group" style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                      <Image
                        src={img}
                        alt={`${project.title} screenshot ${i + 1}`}
                        fill
                        loading="lazy"
                        unoptimized={!img.includes('images.unsplash.com')}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width:640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2
                className="text-2xl font-bold mb-5 flex items-center gap-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                Key Features
              </h2>
              <ol className="space-y-3">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 glass-card glass-card-hover spotlight group">
                    <div
                      className="w-8 h-8 rounded-md grid place-items-center text-[12px] font-mono font-semibold flex-shrink-0"
                      style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', color: 'var(--accent)' }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-[15px] leading-relaxed pt-0.5 text-[--text-muted]">
                      {h}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2
                className="text-2xl font-bold mb-5 flex items-center gap-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {project.tech.map(tech => (
                  <span key={tech} className="skill-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 self-start">
            <div className="glass-card p-5 space-y-3">
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                <ExternalIcon />
                Live Demo
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost w-full"
              >
                <SocialIcon name="github" className="w-4 h-4" />
                View Source Code
              </a>
            </div>

            <div className="glass-card p-5">
              <h2
                className="text-[11px] font-semibold mb-4 font-mono uppercase tracking-[0.18em] flex items-center gap-2 text-[--text-muted]"
              >
                <span className="inline-block w-1 h-3.5 rounded-full" style={{ background: 'var(--accent)' }} />
                Project Info
              </h2>
              <dl className="space-y-3">
                {[
                  { label: 'Category', value: project.category },
                  { label: 'Year',     value: project.year     },
                  { label: 'Type',     value: 'Production System' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[--border] last:border-0">
                    <dt className="text-xs font-mono uppercase tracking-wider text-[--text-muted]">
                      {item.label}
                    </dt>
                    <dd className="text-[13.5px] font-medium" style={{ color: 'var(--text)' }}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold whitespace-nowrap" style={{ fontFamily: 'var(--font-display)' }}>
                Related <span style={{ color: 'var(--accent)' }}>Projects</span>
              </h2>
              <div className="flex-1 h-px bg-[--border]" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group glass-card glass-card-hover spotlight overflow-hidden flex flex-col"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      loading="lazy"
                      unoptimized={!p.image?.includes('images.unsplash.com')}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-bold text-white/80 font-mono">
                      {p.year}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="font-bold group-hover:text-[--accent] transition-colors text-[14px] leading-snug mb-1">
                      {p.title}
                    </div>
                    <p className="text-xs text-[--text-muted] line-clamp-2 leading-relaxed">
                      {p.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
