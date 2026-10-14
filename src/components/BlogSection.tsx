'use client'
import { useState, useMemo, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BLOG_CATEGORIES, type BlogPost } from '@/data/blogs'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import { useReveal } from '@/hooks/useReveal'
import SectionHeader from './SectionHeader'

const ClockIcon = () => (
  <svg className="w-3.5 h-3.5 inline-block mr-1 opacity-70" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 7v5l3 2" />
  </svg>
)

const BlogCard = memo(function BlogCard({
  blog,
  priority = false,
}: {
  blog: BlogPost
  priority?: boolean
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group relative glass-card glass-card-hover spotlight overflow-hidden flex flex-col h-full tilt-3d"
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="absolute inset-0 z-0 focus-visible:outline-none"
        aria-label={`Read ${blog.title}`}
      />

      <div className="relative h-48 sm:h-52 overflow-hidden flex-shrink-0">
        <Image
          src={blog.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=85&auto=format'}
          alt={blog.imageAlt || blog.title}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          unoptimized={!blog.image?.includes('images.unsplash.com')}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        />
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgb(3 8 6 / 0.88), rgb(3 8 6 / 0.22) 55%, transparent)' }}
          aria-hidden="true"
        />

        <span className="blog-category-badge absolute top-3.5 left-3.5 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-[0.08em]">
          {blog.category}
        </span>

        <span className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[12px] font-mono text-white/85">
          <span>{blog.publishedAt}</span>
          <span className="flex items-center">
            <ClockIcon />
            {blog.readingTime}
          </span>
        </span>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {blog.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2.5 py-[3px] text-[11.5px] font-mono font-bold text-[--text-muted]"
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
          className="text-[19px] sm:text-[21px] font-extrabold leading-snug tracking-[-0.015em] transition-colors duration-200 group-hover:text-[--accent] line-clamp-2 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {blog.title}
        </h3>

        <p className="text-[15px] sm:text-[15.5px] font-medium leading-relaxed text-[--text-muted] line-clamp-2 mb-4">
          {blog.excerpt}
        </p>

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
                <div className="text-[15px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                  {m.value}
                </div>
                <div className="text-[11px] font-bold text-[--text-dim] truncate font-mono uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div
          className="pt-4 mt-auto flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span
            className="text-[14px] font-bold transition-colors duration-200 flex items-center gap-1.5"
            style={{ color: 'var(--accent)' }}
          >
            Read Article
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
          <span className="text-[12px] font-mono text-[--text-dim]">
            {blog.keyTakeaways?.length || 0} Key Takeaways
          </span>
        </div>
      </div>
    </motion.article>
  )
})

export default function BlogSection() {
  const { db } = usePortfolioData()
  const blogs = db.blogs
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
  }, [blogs, selectedCategory, searchQuery])

  return (
    <section
      id="blog"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div className="container-x">
        <SectionHeader
          index="05 —"
          title="Engineering"
          emphasis="Insights & Blog"
          standfirst="Deep technical playbooks on Multi-Agent Systems, Advanced RAG, Agent Orchestration, and Production LLM Reliability."
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-9 reveal">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
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
                  className="relative px-4 py-2 text-[13px] font-mono font-bold rounded-full whitespace-nowrap transition-colors duration-200 cursor-pointer"
                  style={{
                    background: on ? 'var(--accent)' : 'var(--card)',
                    color: on ? 'var(--on-accent)' : 'var(--text-muted)',
                    border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="relative min-w-[240px] md:w-80">
            <input
              type="text"
              placeholder="Search concepts (RAG, LangGraph)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 text-[14px] font-mono rounded-full outline-none transition-all duration-200"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[--text-dim]"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[--text-dim] hover:text-[--text]"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredBlogs.length > 0 ? (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBlogs.slice(0, 6).map((blog, idx) => (
                <BlogCard key={blog.slug} blog={blog} priority={idx < 2} />
              ))}
            </AnimatePresence>
          </motion.div>
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

        <div className="text-center mt-12 reveal flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/blog" className="btn btn-primary text-[13.5px]">
            &gt; Explore All {blogs.length} Technical Articles_
          </Link>
          <a
            href={db.profile.github}
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
