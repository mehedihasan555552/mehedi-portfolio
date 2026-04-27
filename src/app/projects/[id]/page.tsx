import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/data/projects'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Pre-render all project pages at build time
export function generateStaticParams() {
  return projects.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = projects.find(p => p.id === params.id)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description, images: [{ url: project.image }] },
  }
}

const GitHubIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id)
  if (!project) notFound()

  const related = projects.filter(p => p.id !== project.id && p.category === project.category).slice(0, 2)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {/* Hero banner */}
        <section className="relative h-[50vh] min-h-[380px] overflow-hidden" aria-label="Project hero">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[--bg] via-[--bg]/50 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-12 w-full">
              <Link href="/#projects"
                className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Projects
              </Link>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-[#4f7fff]/75 backdrop-blur-sm">{project.category}</span>
                <span className="px-3 py-1 rounded-full text-sm font-mono text-white bg-black/35 backdrop-blur-sm">{project.year}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {project.title}
              </h1>
              <p className="text-xl italic text-white/80" style={{ fontFamily: 'var(--font-italic)' }}>{project.tagline}</p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              <section aria-label="Project overview">
                <h2 className="text-2xl font-bold dark:text-white text-[#1a1830] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Project Overview
                </h2>
                {project.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="text-lg text-[--text-muted] leading-relaxed mb-4">{para}</p>
                ))}
              </section>

              {project.gallery?.length > 0 && (
                <section aria-label="Project gallery">
                  <h2 className="text-2xl font-bold dark:text-white text-[#1a1830] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Gallery</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="relative h-52 rounded-2xl overflow-hidden group">
                        <Image src={img} alt={`${project.title} screenshot ${i + 1}`} fill loading="lazy"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width:640px) 100vw,50vw" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section aria-label="Key features">
                <h2 className="text-2xl font-bold dark:text-white text-[#1a1830] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Key Features</h2>
                <ol className="space-y-3">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 glass-card rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f7fff] to-[#9b5de5] flex items-center justify-center text-sm font-bold text-white flex-shrink-0" aria-hidden="true">{i + 1}</div>
                      <span className="text-base dark:text-[#e8e6ff] text-[#1a1830] font-medium">{h}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-label="Technology stack">
                <h2 className="text-2xl font-bold dark:text-white text-[#1a1830] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Technology Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map(tech => <span key={tech} className="skill-pill">{tech}</span>)}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="glass-card rounded-3xl p-6">
                <h2 className="text-lg font-bold dark:text-white text-[#1a1830] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Project Stats</h2>
                <dl className="grid grid-cols-2 gap-3">
                  {project.stats.map(s => (
                    <div key={s.label} className="text-center p-3 rounded-xl dark:bg-[#0f0f1a] bg-[#f5f4ff]">
                      <dt className="text-xs text-[--text-muted] order-last block mt-1">{s.label}</dt>
                      <dd className="text-2xl font-black gradient-text" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="glass-card rounded-3xl p-6 space-y-3">
                <h2 className="text-lg font-bold dark:text-white text-[#1a1830] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Links</h2>
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-3 dark:bg-[#0f0f1a] bg-[#f5f4ff] rounded-xl dark:text-[#e8e6ff] text-[#1a1830] hover:text-[--accent] transition-colors font-medium">
                  <GitHubIcon /> View Source Code
                </a>
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-3 bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-[#4f7fff]/25 transition-[box-shadow]">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  Live Demo
                </a>
              </div>

              <div className="glass-card rounded-3xl p-6">
                <dl className="space-y-3">
                  {[
                    { label:'Category', value:project.category },
                    { label:'Year', value:project.year },
                    { label:'Type', value:'Personal / Client' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <dt className="text-sm text-[--text-muted]">{item.label}</dt>
                      <dd className="text-sm font-semibold dark:text-white text-[#1a1830]">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-20" aria-label="Related projects">
              <h2 className="text-3xl font-bold dark:text-white text-[#1a1830] mb-8" style={{ fontFamily: 'var(--font-display)' }}>Related Projects</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {related.map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} prefetch={false}
                    className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex gap-5 p-4"
                  >
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={p.image} alt={p.title} fill loading="lazy" className="object-cover" sizes="96px" />
                    </div>
                    <div>
                      <div className="font-bold dark:text-white text-[#1a1830] group-hover:text-[--accent] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>{p.title}</div>
                      <div className="text-sm text-[--text-muted] mt-1 line-clamp-2">{p.tagline}</div>
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
