'use client'
import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/data/blogs'
import me from '@/../images/professional-mehedi.png'

/* ─── Copy Button for Code Blocks ─── */
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }, [code])

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
      className="px-2.5 py-1 text-[11px] font-mono rounded transition-colors duration-200"
      style={{
        background: copied ? 'var(--accent)' : 'rgb(255 255 255 / 0.08)',
        color: copied ? 'var(--on-accent)' : 'var(--text-muted)',
        border: '1px solid rgb(255 255 255 / 0.12)',
      }}
    >
      {copied ? 'Copied ✓' : 'Copy Code'}
    </button>
  )
}

/* ─── Share Button Component ─── */
function ShareControls({ title, slug }: { title: string; slug: string }) {
  const [copiedLink, setCopiedLink] = useState(false)

  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : `https://mehediswpu.vercel.app/blog/${slug}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2200)
    } catch {}
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copyLink}
        className="btn btn-ghost text-xs py-1.5 px-3"
        title="Copy article link"
      >
        {copiedLink ? 'Link Copied ✓' : 'Share Link 🔗'}
      </button>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-md glass-card grid place-items-center text-xs text-[--text-muted] hover:text-[--accent]"
        aria-label="Share on X / Twitter"
      >
        𝕏
      </a>

      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-md glass-card grid place-items-center text-xs text-[--text-muted] hover:text-[--accent]"
        aria-label="Share on LinkedIn"
      >
        in
      </a>
    </div>
  )
}

/* ─── Markdown Content Parser Component ─── */
function MarkdownRenderer({ content }: { content: string }) {
  // Parse markdown content into structured blocks
  const blocks = useMemo(() => {
    const rawLines = content.trim().split('\n')
    const result: Array<
      | { type: 'h2'; text: string; id: string }
      | { type: 'h3'; text: string; id: string }
      | { type: 'p'; text: string }
      | { type: 'list'; items: string[] }
      | { type: 'code'; lang: string; code: string }
      | { type: 'quote'; text: string }
      | { type: 'hr' }
    > = []

    let i = 0
    while (i < rawLines.length) {
      const line = rawLines[i]

      // Code block
      if (line.trim().startsWith('```')) {
        const lang = line.trim().replace(/^```/, '') || 'text'
        const codeLines: string[] = []
        i++
        while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
          codeLines.push(rawLines[i])
          i++
        }
        result.push({ type: 'code', lang, code: codeLines.join('\n') })
        i++
        continue
      }

      // H2
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim()
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        result.push({ type: 'h2', text, id })
        i++
        continue
      }

      // H3
      if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim()
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        result.push({ type: 'h3', text, id })
        i++
        continue
      }

      // Horizontal rule
      if (line.trim() === '---') {
        result.push({ type: 'hr' })
        i++
        continue
      }

      // Unordered list item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const items: string[] = []
        while (i < rawLines.length && (rawLines[i].trim().startsWith('- ') || rawLines[i].trim().startsWith('* '))) {
          items.push(rawLines[i].trim().replace(/^[-*]\s+/, ''))
          i++
        }
        result.push({ type: 'list', items })
        continue
      }

      // Blockquote
      if (line.trim().startsWith('> ')) {
        result.push({ type: 'quote', text: line.trim().replace(/^>\s+/, '') })
        i++
        continue
      }

      // Paragraph (accumulate non-empty lines)
      if (line.trim().length > 0) {
        const paraLines: string[] = [line]
        i++
        while (
          i < rawLines.length &&
          rawLines[i].trim().length > 0 &&
          !rawLines[i].startsWith('#') &&
          !rawLines[i].startsWith('```') &&
          !rawLines[i].startsWith('---') &&
          !rawLines[i].trim().startsWith('- ') &&
          !rawLines[i].trim().startsWith('> ')
        ) {
          paraLines.push(rawLines[i])
          i++
        }
        result.push({ type: 'p', text: paraLines.join(' ') })
        continue
      }

      i++
    }

    return result
  }, [content])

  return (
    <div className="space-y-6 text-[15.5px] leading-relaxed text-[--text-muted]">
      {blocks.map((block, idx) => {
        if (block.type === 'h2') {
          return (
            <h2
              key={idx}
              id={block.id}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[--text] mt-12 mb-4 scroll-mt-28 flex items-center gap-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              {block.text}
            </h2>
          )
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={idx}
              id={block.id}
              className="text-xl font-bold tracking-tight text-[--text] mt-8 mb-3 scroll-mt-28"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {block.text}
            </h3>
          )
        }

        if (block.type === 'hr') {
          return (
            <hr
              key={idx}
              className="my-8 border-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }}
            />
          )
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="space-y-2.5 my-4 pl-2">
              {block.items.map((item, liIdx) => (
                <li key={liIdx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: 'var(--accent)' }} />
                  <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={idx}
              className="my-6 pl-5 py-2 italic glass-card border-l-4"
              style={{ borderLeftColor: 'var(--accent)' }}
            >
              <p className="text-[16px] text-[--text] leading-relaxed">&ldquo;{block.text}&rdquo;</p>
            </blockquote>
          )
        }

        if (block.type === 'code') {
          return (
            <div
              key={idx}
              className="my-6 rounded-lg overflow-hidden glass-card"
              style={{ border: '1px solid var(--border)', boxShadow: 'var(--sh-2)' }}
            >
              {/* Header bar */}
              <div
                className="flex items-center justify-between px-4 py-2 text-xs font-mono border-b"
                style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 uppercase tracking-wider text-[--text-dim] text-[10.5px]">
                    {block.lang}
                  </span>
                </div>
                <CopyButton code={block.code} />
              </div>

              {/* Code block */}
              <div
                className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed"
                style={{ background: 'var(--bg)' }}
              >
                <pre style={{ margin: 0 }}>
                  <code style={{ color: 'var(--text)' }}>{block.code}</code>
                </pre>
              </div>
            </div>
          )
        }

        // Paragraph
        return (
          <p
            key={idx}
            className="text-[15.5px] leading-relaxed text-[--text-muted]"
            dangerouslySetInnerHTML={{ __html: formatInline(block.text) }}
          />
        )
      })}
    </div>
  )
}

/* Format bold, inline code, and links in markdown text */
function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[--text]">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded text-[12px] font-mono bg-[var(--bg-2)] text-[var(--accent)] border border-[var(--border)]">$1</code>')
}

/* ─── Main Client Component ─── */
export default memo(function BlogPostClient({
  blog,
  related,
}: {
  blog: BlogPost
  related: BlogPost[]
}) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [readingProgress, setReadingProgress] = useState(0)

  // Track scroll position to update reading progress & active TOC item
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)))
      }

      const headings = blog.tableOfContents.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i]
        if (el.getBoundingClientRect().top <= 140) {
          setActiveSection(el.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [blog.tableOfContents])

  return (
    <>
      {/* ── Reading Progress Bar ── */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none transition-all duration-75"
        style={{
          background: 'linear-gradient(90deg, var(--accent-deep), var(--accent) 70%, var(--signal))',
          width: `${readingProgress}%`,
          boxShadow: '0 0 10px rgb(var(--accent-rgb) / 0.65)',
        }}
        aria-hidden="true"
      />

      {/* ── Hero Section ── */}
      <header className="relative w-full pt-6 pb-12 overflow-hidden border-b border-[--border]">
        <div className="container-x">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs font-mono text-[--text-dim] mb-6">
            <Link href="/" className="hover:text-[--text] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[--text] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[--accent] truncate max-w-[260px] sm:max-w-md">{blog.category}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider"
                  style={{
                    borderRadius: 'var(--r-sm)',
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--accent-line)',
                    color: 'var(--accent)',
                  }}
                >
                  {blog.category}
                </span>
                <span className="text-xs font-mono text-[--text-dim]">
                  Published {blog.publishedAt}
                </span>
                <span className="text-xs font-mono text-[--text-dim]">•</span>
                <span className="text-xs font-mono text-[--text-dim]">
                  {blog.readingTime}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12] mb-4 text-[--text]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {blog.title}
              </h1>

              <p
                className="text-lg sm:text-xl italic text-[--text-muted] leading-relaxed mb-6"
                style={{ fontFamily: 'var(--font-italic)' }}
              >
                {blog.tagline}
              </p>

              {/* Author & Share row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[--border]">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[--accent-line]">
                    <Image
                      src={me}
                      alt="Md Mehedi Hasan"
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[--text]">Md Mehedi Hasan</div>
                    <div className="text-[11px] font-mono text-[--text-dim]">
                      Senior AI/LLM Engineer · 5+ Yrs Exp
                    </div>
                  </div>
                </div>

                <ShareControls title={blog.title} slug={blog.slug} />
              </div>
            </div>

            {/* Hero image preview */}
            <div className="lg:col-span-4 relative h-64 sm:h-72 rounded-xl overflow-hidden glass-card border border-[--border]">
              <Image
                src={blog.image}
                alt={blog.imageAlt}
                fill
                priority
                quality={85}
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 33vw"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-[--bg]/80 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout: Sidebar + Content ── */}
      <div className="container-x py-14">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-start">

          {/* ══ Sticky Sidebar (TOC + Scorecard) ══ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 order-2 lg:order-1">
            {/* Executive Key Takeaways */}
            <div className="glass-card spotlight p-5 rounded-lg border border-[--border]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[--accent] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-[--accent]" />
                Executive Takeaways
              </h3>
              <ul className="space-y-2.5">
                {blog.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[--text-muted] leading-relaxed">
                    <span className="text-[--accent] font-mono font-bold mt-0.5">0{i + 1}</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Performance Metrics Scorecard */}
            {blog.metrics && blog.metrics.length > 0 && (
              <div className="glass-card spotlight p-5 rounded-lg border border-[--border]">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[--text-dim] mb-3">
                  // Production Benchmarks
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {blog.metrics.map(metric => (
                    <div
                      key={metric.label}
                      className="p-3 text-center rounded-md"
                      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
                    >
                      <div className="text-lg font-mono font-bold" style={{ color: 'var(--accent)' }}>
                        {metric.value}
                      </div>
                      <div className="text-[10px] text-[--text-dim] uppercase tracking-wider font-mono mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Table of Contents */}
            {blog.tableOfContents.length > 0 && (
              <nav aria-label="Table of contents" className="glass-card p-5 rounded-lg border border-[--border]">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[--text-dim] mb-3">
                  Table of Contents
                </h3>
                <ul className="space-y-2 text-xs font-mono">
                  {blog.tableOfContents.map(toc => {
                    const isActive = activeSection === toc.id
                    return (
                      <li key={toc.id}>
                        <a
                          href={`#${toc.id}`}
                          className="block py-1 px-2 rounded transition-colors duration-150"
                          style={{
                            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                            background: isActive ? 'var(--accent-soft)' : 'transparent',
                            borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                          }}
                        >
                          {toc.title}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            )}

            {/* Author Profile Card */}
            <div className="glass-card spotlight p-5 rounded-lg border border-[--border] text-center">
              <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 border-2 border-[--accent]">
                <Image src={me} alt="Mehedi Hasan" fill className="object-cover" sizes="64px" />
              </div>
              <div className="font-bold text-sm text-[--text]">Md Mehedi Hasan</div>
              <div className="text-xs font-mono text-[--accent] mt-0.5">Sr. AI/LLM Engineer</div>
              <p className="text-xs text-[--text-muted] mt-2 leading-relaxed">
                Specialized in multi-agent systems, RAG pipelines, agent orchestration, and scalable Python backends.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <a
                  href="https://www.linkedin.com/in/mehedihasan555552/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost text-xs py-1.5 px-3"
                >
                  LinkedIn
                </a>
                <a
                  href="/#contact"
                  className="btn btn-primary text-xs py-1.5 px-3"
                >
                  Hire Me
                </a>
              </div>
            </div>
          </aside>

          {/* ══ Main Column (Article Content) ══ */}
          <main className="lg:col-span-8 order-1 lg:order-2">
            <MarkdownRenderer content={blog.content} />

            {/* Tags row */}
            <div className="mt-12 pt-6 border-t border-[--border] flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[--text-dim]">Tags:</span>
              {blog.tags.map(t => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-mono rounded"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Back to Blog CTA */}
            <div className="mt-8 p-6 glass-card rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base text-[--text]">Enjoyed this engineering playbook?</h4>
                <p className="text-xs text-[--text-muted] mt-0.5">Explore our other in-depth articles on production AI.</p>
              </div>
              <Link href="/blog" className="btn btn-primary text-xs">
                View All 10 Playbooks →
              </Link>
            </div>
          </main>
        </div>

        {/* ── Related Articles ── */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[--border]" aria-labelledby="related-heading">
            <div className="flex items-center justify-between mb-8">
              <h2
                id="related-heading"
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Related <span style={{ color: 'var(--accent)' }}>Articles</span>
              </h2>
              <Link href="/blog" className="text-xs font-mono text-[--accent] hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {related.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  prefetch
                  className="group glass-card glass-card-hover spotlight rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.imageAlt}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-white">
                      {rel.category}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3
                      className="font-bold text-sm leading-snug group-hover:text-[--accent] transition-colors line-clamp-2 mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {rel.title}
                    </h3>
                    <p className="text-xs text-[--text-muted] line-clamp-2 mt-auto">
                      {rel.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
})
