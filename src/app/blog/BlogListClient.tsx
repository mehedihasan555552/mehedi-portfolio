'use client'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { blogs, BLOG_CATEGORIES } from '@/data/blogs'

const ClockIcon = () => (
  <svg className="w-3.5 h-3.5 inline-block mr-1 opacity-70" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 7v5l3 2" />
  </svg>
)

export default function BlogListClient() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [search, setSearch] = useState('')

  const featuredPost = useMemo(() => blogs[0], [])

  const filteredPosts = useMemo(() => {
    return blogs.filter(b => {
      const matchCat = activeCategory === 'All' || b.category === activeCategory
      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  return (
    <div className="container-x">
      {/* ── Page Header ── */}
      <div className="max-w-3xl mb-12">
        <div className="announce-badge mb-4" style={{ borderColor: 'var(--accent-line)', color: 'var(--accent)' }}>
          <span className="status-dot" aria-hidden="true" />
          Technical Engineering Notebook · 10 Production Playbooks
        </div>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Agentic AI &amp; <span className="gradient-text">Systems Architecture</span>
        </h1>

        <p className="text-base sm:text-lg text-[--text-muted] leading-relaxed">
          Deep architectural breakdowns by a Senior AI/LLM Engineer with 5+ years building production AI systems and scalable Python backends. Exploring multi-agent orchestration, hybrid RAG, tool-enabled agents, guardrails, and evaluation frameworks.
        </p>
      </div>

      {/* ── Featured Spotlight (Hero Post) ── */}
      {featuredPost && activeCategory === 'All' && !search && (
        <section aria-label="Featured Article" className="mb-16">
          <div
            className="group relative glass-card glass-card-hover spotlight overflow-hidden grid lg:grid-cols-12 gap-0"
            style={{ borderRadius: 'var(--r-xl)' }}
          >
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="absolute inset-0 z-10 focus-visible:outline-none"
              aria-label={`Read featured article: ${featuredPost.title}`}
              prefetch
            />

            {/* Image side */}
            <div className="relative lg:col-span-7 h-64 sm:h-80 lg:h-full min-h-[280px] overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.imageAlt}
                fill
                priority
                quality={90}
                className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 60vw"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-[--card] via-transparent to-transparent lg:hidden"
                aria-hidden="true"
              />
              <span
                className="absolute top-4 left-4 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-[0.1em] backdrop-blur-md"
                style={{
                  borderRadius: 'var(--r-sm)',
                  background: 'rgb(2 8 5 / 0.75)',
                  border: '1px solid rgb(var(--accent-rgb) / 0.55)',
                  color: 'var(--accent)',
                }}
              >
                ★ Featured Deep-Dive
              </span>
            </div>

            {/* Content side */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono text-[--text-dim] mb-3">
                  <span className="text-[--accent] font-semibold">{featuredPost.category}</span>
                  <span>•</span>
                  <span>{featuredPost.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center"><ClockIcon />{featuredPost.readingTime}</span>
                </div>

                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 leading-snug group-hover:text-[--accent] transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {featuredPost.title}
                </h2>

                <p className="text-sm text-[--text-muted] leading-relaxed mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Key Takeaways snippet */}
                <div className="space-y-2 mb-6">
                  {featuredPost.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[--text-muted]">
                      <span className="text-[--accent] font-mono font-bold mt-0.5">✓</span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[--border] flex items-center justify-between">
                <span className="btn btn-primary text-xs py-2 px-4">
                  Read Full Architecture Playbook →
                </span>
                <span className="text-xs font-mono text-[--text-dim]">
                  {featuredPost.metrics?.length ? `${featuredPost.metrics[0].label}: ${featuredPost.metrics[0].value}` : ''}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Search and Filter Controls ── */}
      <div className="space-y-4 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
            role="tablist"
            aria-label="Filter blog posts"
          >
            {BLOG_CATEGORIES.map(category => {
              const active = activeCategory === category
              const count = category === 'All' ? blogs.length : blogs.filter(b => b.category === category).length
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className="px-3.5 py-1.5 text-xs font-mono font-medium rounded-md whitespace-nowrap transition-all duration-200"
                  style={{
                    background: active ? 'var(--accent)' : 'var(--card)',
                    color: active ? 'var(--on-accent)' : 'var(--text-muted)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    boxShadow: active ? '0 4px 14px -4px rgb(var(--accent-rgb) / 0.55)' : 'none',
                  }}
                >
                  {category} <span className="opacity-70 ml-1">({count})</span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] md:w-80">
            <input
              type="text"
              placeholder="Search across all 10 articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-9 text-xs font-mono rounded-md outline-none transition-all duration-200"
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[--text-dim]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[--text-dim] hover:text-[--text]"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Articles Grid ── */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <article
              key={post.slug}
              className="group relative glass-card glass-card-hover spotlight overflow-hidden flex flex-col h-full"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="absolute inset-0 z-10 focus-visible:outline-none"
                aria-label={`Read ${post.title}`}
                prefetch
              />

              {/* Cover image */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  loading="lazy"
                  quality={80}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                />
                <span
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgb(3 8 6 / 0.88), rgb(3 8 6 / 0.22) 55%, transparent)' }}
                  aria-hidden="true"
                />

                <span
                  className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-[0.08em] backdrop-blur-md"
                  style={{
                    borderRadius: 'var(--r-sm)',
                    background: 'rgb(2 8 5 / 0.72)',
                    border: '1px solid rgb(var(--accent-rgb) / 0.45)',
                    color: 'var(--accent)',
                  }}
                >
                  {post.category}
                </span>

                <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/85">
                  <span>{post.publishedAt}</span>
                  <span className="flex items-center"><ClockIcon />{post.readingTime}</span>
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-[2px] text-[10px] font-mono text-[--text-dim]"
                      style={{
                        borderRadius: 'var(--r-xs)',
                        background: 'var(--bg-2)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h3
                  className="text-base sm:text-lg font-bold leading-snug tracking-[-0.02em] transition-colors duration-200 group-hover:text-[--accent] line-clamp-2 mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {post.title}
                </h3>

                <p className="text-xs sm:text-[13px] leading-relaxed text-[--text-muted] line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                {/* Metrics */}
                {post.metrics && post.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4 pt-1">
                    {post.metrics.slice(0, 2).map(m => (
                      <div
                        key={m.label}
                        className="py-1 px-1.5 text-center"
                        style={{
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--bg-2)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div className="text-xs font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                          {m.value}
                        </div>
                        <div className="text-[9px] text-[--text-dim] truncate font-mono uppercase">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer action */}
                <div
                  className="pt-3.5 mt-auto flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <span
                    className="text-xs font-mono font-semibold transition-colors duration-200 flex items-center gap-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    Read Playbook
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                  <span className="text-[11px] font-mono text-[--text-dim]">
                    {post.keyTakeaways.length} Takeaways
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card p-8">
          <p className="text-base text-[--text-muted] mb-3">
            No articles found matching &quot;{search}&quot;
          </p>
          <button
            onClick={() => { setActiveCategory('All'); setSearch('') }}
            className="btn btn-ghost text-xs"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
