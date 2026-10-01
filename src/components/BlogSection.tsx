'use client'
import { useState, useMemo, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { blogs, BLOG_CATEGORIES } from '@/data/blogs'
import { useReveal } from '@/hooks/useReveal'
import SectionHeader from './SectionHeader'

/* ─── Reading Time SVG Icon ─── */
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5 inline-block mr-1 opacity-70" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 7v5l3 2" />
  </svg>
)

/* ─── Article Card ─── */
const BlogCard = memo(function BlogCard({
  blog,
  priority = false,
}: {
  blog: typeof blogs[0]
  priority?: boolean
}) {
  return (
    <article
      data-reveal="scale"
      className="group relative glass-card glass-card-hover spotlight overflow-hidden flex flex-col h-full"
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="absolute inset-0 z-0 focus-visible:outline-none"
        aria-label={`Read ${blog.title}`}
        prefetch
      />

      {/* Media cover */}
      <div className="relative h-48 sm:h-52 overflow-hidden flex-shrink-0">
        <Image
          src={blog.image}
          alt={blog.imageAlt}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        />
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgb(3 8 6 / 0.88), rgb(3 8 6 / 0.22) 55%, transparent)' }}
          aria-hidden="true"
        />

        {/* Category tag */}
        <span
          className="absolute top-3.5 left-3.5 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.08em] backdrop-blur-md"
          style={{
            borderRadius: 'var(--r-sm)',
            background: 'rgb(2 8 5 / 0.72)',
            border: '1px solid rgb(var(--accent-rgb) / 0.45)',
            color: 'var(--accent)',
          }}
        >
          {blog.category}
        </span>

        {/* Date & read time */}
        <span
          className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-white/85"
        >
          <span>{blog.publishedAt}</span>
          <span className="flex items-center">
            <ClockIcon />
            {blog.readingTime}
          </span>
        </span>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {blog.tags.slice(0, 3).map(tag => (
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
          className="text-[17px] font-bold leading-snug tracking-[-0.02em] transition-colors duration-200 group-hover:text-[--accent] line-clamp-2 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {blog.title}
        </h3>

        <p className="text-[13px] leading-relaxed text-[--text-muted] line-clamp-2 mb-4">
          {blog.excerpt}
        </p>

        {/* Metric preview pills if present */}
        {blog.metrics && blog.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4 pt-1">
            {blog.metrics.slice(0, 2).map(m => (
              <div
                key={m.label}
                className="py-1.5 px-2 text-center"
                style={{
                  borderRadius: 'var(--r-sm)',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="text-[13px] font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                  {m.value}
                </div>
                <div className="text-[9.5px] text-[--text-dim] truncate font-mono uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Card action footer */}
        <div
          className="pt-3.5 mt-auto flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span
            className="text-[12.5px] font-mono font-semibold transition-colors duration-200 flex items-center gap-1.5"
            style={{ color: 'var(--accent)' }}
          >
            Read Article
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
          <span className="text-[11px] font-mono text-[--text-dim]">
            {blog.keyTakeaways.length} Key Takeaways
          </span>
        </div>
      </div>
    </article>
  )
})

export default function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const ref = useReveal(0.06)

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.tags.some(t => t.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <section
      id="blog"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      {/* Background ambient lighting */}
      <div
        data-parallax
        className="absolute top-1/4 right-0 w-[460px] aspect-square rounded-full opacity-[0.05] blur-[110px] pointer-events-none"
        style={{ ['--par' as string]: '50px', background: 'var(--accent)' }}
        aria-hidden="true"
      />

      <div className="container-x">
        <SectionHeader
          index="05 —"
          title="Engineering"
          emphasis="Insights & Blog"
          standfirst="Deep technical playbooks on Multi-Agent Systems, Advanced RAG, Agent Orchestration, and Production LLM Reliability."
        />

        {/* Filter controls row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-9 reveal">
          {/* Category tabs */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
            role="tablist"
            aria-label="Filter blog posts by category"
          >
            {BLOG_CATEGORIES.slice(0, 6).map(cat => {
              const on = selectedCategory === cat
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3.5 py-1.5 text-[12px] font-mono font-medium rounded-md whitespace-nowrap transition-all duration-200"
                  style={{
                    background: on ? 'var(--accent)' : 'var(--card)',
                    color: on ? 'var(--on-accent)' : 'var(--text-muted)',
                    border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                    boxShadow: on ? '0 4px 14px -4px rgb(var(--accent-rgb) / 0.55)' : 'none',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px] md:w-72">
            <input
              type="text"
              placeholder="Search concepts (RAG, LangGraph)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 text-[13px] font-mono rounded-md outline-none transition-all duration-200"
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <svg
              className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[--text-dim]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[--text-dim] hover:text-[--text]"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.slice(0, 6).map((blog, idx) => (
              <BlogCard key={blog.slug} blog={blog} priority={idx < 2} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card p-8">
            <p className="text-[15px] text-[--text-muted] mb-3">
              No articles found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery('') }}
              className="btn btn-ghost text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* View All / Explore More CTA */}
        <div className="text-center mt-12 reveal flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/blog" className="btn btn-primary text-[13.5px]">
            &gt; Explore All 10 Technical Articles_
          </Link>
          <a
            href="https://github.com/mehedihasan555552"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-[13px]"
          >
            Review AI System Code on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  )
}
