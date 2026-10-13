'use client'
import { motion } from 'framer-motion'

/**
 * Shared section masthead with framer-motion reveals: index, title with an emphasised tail,
 * an animated expanding rule, and an optional standfirst.
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
    <motion.header
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12 md:mb-16"
    >
      <div className="flex items-center gap-4">
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="eyebrow flex-shrink-0"
        >
          {index}
        </motion.span>
        <h2
          className="text-[clamp(2.2rem,4.8vw,3.6rem)] font-extrabold tracking-[-0.018em] flex-shrink-0"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}{' '}
          <span style={{ color: 'var(--accent)' }}>{emphasis}</span>
        </h2>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'left' }}
          className="rule"
          aria-hidden="true"
        />
      </div>
      {standfirst && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-[17px] sm:text-[18.5px] font-medium leading-relaxed max-w-2xl text-[--text-muted]"
        >
          {standfirst}
        </motion.p>
      )}
    </motion.header>
  )
}
