import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)] text-[var(--text)]">
      <div className="glass-card max-w-md w-full p-8 text-center relative overflow-hidden">
        <span className="eyebrow mb-4 inline-block">404 — ERROR</span>
        <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Node Not Found
        </h1>
        <p className="text-[15px] text-[--text-muted] mb-8 leading-relaxed">
          The requested system route does not exist or has been relocated to another neural pathway.
        </p>
        <Link href="/" className="btn btn-primary inline-flex">
          &gt; Return to Base_
        </Link>
      </div>
    </div>
  )
}
