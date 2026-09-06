import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/data/projects'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SocialIcon from '@/components/SocialIcon'

// ─── Static params — pre-render all at build time ────────────────────────────
export function generateStaticParams() {
  return projects.map(p => ({ id: p.id }))
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const project = projects.find(p => p.id === id)
  if (!project) return {}
  return {
    title:       `${project.title} — Mehedi Hasan`,
    description: project.description,
    openGraph: {
      title:       project.title,
      description: project.description,
      images:      [{ url: project.image, width: 1200, height: 630, alt: project.title }],
    },
  }
}

// ─── Tiny inline SVGs (no client bundle cost) ─────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProjectPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const project = projects.find(p => p.id === id)
  if (!project) notFound()

  const related = projects
    .filter(p => p.id !== project.id && p.category === project.category)
    .slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">

        {/* ── Hero ── */}
        <section className="relative h-[60vh] min-h-[420px] overflow-hidden" aria-label="Project hero">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            fetchPriority="high"
            quality={85}
            className="object-cover scale-105"   /* slight scale so the gradient fade looks deeper */
            sizes="100vw"
          />
          {/* Two-layer gradient: strong bottom fade + subtle dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[--bg] via-[--bg]/40 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-[--bg]/20" aria-hidden="true" />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-14 w-full">

              {/* Back link */}
              <Link
                href="/#projects"
                className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
              >
                <BackArrow />
                Back to Projects
              </Link>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-[0.1em] backdrop-blur-sm" style={{ borderRadius: 'var(--r-sm)', background: 'rgb(2 8 5 / 0.62)', border: '1px solid rgb(var(--accent-rgb) / 0.5)', color: 'var(--accent)' }}>
                  {project.category}
                </span>
                <span className="px-3 py-1 text-[11px] font-mono text-white/85 backdrop-blur-sm" style={{ borderRadius: 'var(--r-sm)', background: 'rgb(0 0 0 / 0.42)' }}>
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-3 max-w-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {project.title}
              </h1>
              <p
                className="text-lg sm:text-xl italic text-white/75 max-w-xl"
                style={{ fontFamily: 'var(--font-italic)' }}
              >
                {project.tagline}
              </p>
            </div>
          </div>
        </section>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* ── Main column ── */}
            <div className="lg:col-span-2 space-y-14">

              {/* Overview */}
              <section aria-labelledby="overview-heading">
                <h2
                  id="overview-heading"
                  className="text-2xl font-bold mb-5 flex items-center gap-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                  Project Overview
                </h2>
                <div className="space-y-4">
                  {project.longDescription.split('\n\n').map((para, i) => (
                    <p key={i} className="text-base sm:text-lg text-[--text-muted] leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </section>

              {/* Stats strip — moved here for immediate visual impact */}
              {project.stats.length > 0 && (
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.stats.map(s => (
                    <div
                      key={s.label}
                      className="glass-card glass-card-hover spotlight p-4 text-center"
                    >
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

              {/* Gallery */}
              {project.gallery?.length > 0 && (
                <section aria-labelledby="gallery-heading">
                  <h2
                    id="gallery-heading"
                    className="text-2xl font-bold mb-5 flex items-center gap-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} aria-hidden="true" />
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
                          quality={80}
                          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                          sizes="(max-width:640px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Features */}
              <section aria-labelledby="features-heading">
                <h2
                  id="features-heading"
                  className="text-2xl font-bold mb-5 flex items-center gap-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                  Key Features
                </h2>
                <ol className="space-y-3">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 glass-card glass-card-hover spotlight group">
                      <div
                        className="w-8 h-8 rounded-md grid place-items-center text-[12px] font-mono font-semibold flex-shrink-0"
                        style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', color: 'var(--accent)' }}
                        aria-hidden="true"
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

              {/* Tech Stack */}
              <section aria-labelledby="tech-heading">
                <h2
                  id="tech-heading"
                  className="text-2xl font-bold mb-5 flex items-center gap-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} aria-hidden="true" />
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

            {/* ── Sticky Sidebar ── */}
            <aside className="space-y-5 lg:sticky lg:top-28 self-start">

              {/* CTA buttons */}
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

              {/* Project Meta */}
              <div className="glass-card p-5">
                <h2
                  className="text-[11px] font-semibold mb-4 font-mono uppercase tracking-[0.18em] flex items-center gap-2 text-[--text-muted]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="inline-block w-1 h-3.5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                  Project Info
                </h2>
                <dl className="space-y-3">
                  {[
                    { label: 'Category', value: project.category },
                    { label: 'Year',     value: project.year     },
                    { label: 'Type',     value: 'Personal / Client' },
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

              {/* Stats */}
              {project.stats.length > 0 && (
                <div className="glass-card p-5">
                  <h2
                    className="text-[11px] font-semibold mb-4 font-mono uppercase tracking-[0.18em] flex items-center gap-2 text-[--text-muted]"
                  >
                    <span className="inline-block w-1 h-3.5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                    Stats
                  </h2>
                  <dl className="grid grid-cols-2 gap-2.5">
                    {project.stats.map(s => (
                      <div key={s.label} className="text-center p-3" style={{ borderRadius: 'var(--r-sm)', background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                        <dd
                          className="text-xl font-bold"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                        >
                          {s.value}
                        </dd>
                        <dt className="text-xs text-[--text-muted] font-mono mt-0.5 uppercase tracking-wide">
                          {s.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </aside>
          </div>

          {/* ── Related Projects ── */}
          {related.length > 0 && (
            <section className="mt-24" aria-labelledby="related-heading">
              <div className="flex items-center gap-4 mb-8">
                <h2
                  id="related-heading"
                  className="text-2xl sm:text-3xl font-bold whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Related <span style={{ color: 'var(--accent)' }}>Projects</span>
                </h2>
                <div className="flex-1 h-px bg-[--border]" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map(p => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    prefetch      /* prefetch on hover — feels instant */
                    className="group glass-card glass-card-hover spotlight overflow-hidden flex flex-col"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        loading="lazy"
                        quality={75}
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                      <span className="absolute bottom-3 left-3 text-xs font-bold text-white/80 font-mono">
                        {p.year}
                      </span>
                    </div>
                    <div className="p-4">
                      <div
                        className="font-bold group-hover:text-[--accent] transition-colors text-[14px] leading-snug mb-1"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
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
      <Footer />
    </>
  )
}