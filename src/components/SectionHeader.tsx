/**
 * Shared section masthead: index, title with an emphasised tail, a rule that
 * draws itself in on reveal, and an optional standfirst.
 */
export default function SectionHeader({
  index,
  title,
  emphasis,
  standfirst,
}: {
  index: string
  title: string
  emphasis: string
  standfirst?: string
}) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="flex items-center gap-4 reveal">
        <span className="eyebrow flex-shrink-0">{index}</span>
        <h2
          className="text-[clamp(1.85rem,4.2vw,3rem)] font-bold tracking-[-0.035em] flex-shrink-0"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}{' '}
          <span style={{ color: 'var(--accent)' }}>{emphasis}</span>
        </h2>
        <span className="rule" aria-hidden="true" />
      </div>
      {standfirst && (
        <p className="mt-4 text-[15px] max-w-2xl text-[--text-muted] reveal">
          {standfirst}
        </p>
      )}
    </header>
  )
}
