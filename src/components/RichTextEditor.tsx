'use client'
import React, { useState, useRef, useMemo } from 'react'

interface RichTextEditorProps {
  label?: string
  value: string
  onChange: (nextValue: string) => void
  onUploadImage?: (file: File) => Promise<string | null>
  placeholder?: string
  minHeight?: number
  rows?: number
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  onUploadImage,
  placeholder = 'Write your content here...',
  minHeight = 360,
  rows,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<'write' | 'split' | 'preview'>('split')
  const [uploading, setUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const stats = useMemo(() => {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0
    const chars = value.length
    const readMin = Math.max(1, Math.ceil(words / 200))
    return { words, chars, readMin }
  }, [value])

  const insertAtCursor = (before: string, after = '', defaultText = '') => {
    const el = textareaRef.current
    if (!el) {
      onChange(value + '\n' + before + defaultText + after)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end) || defaultText
    const replacement = before + selected + after
    const next = value.slice(0, start) + replacement + value.slice(end)
    onChange(next)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 10)
  }

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onUploadImage) return
    setUploading(true)
    try {
      const url = await onUploadImage(file)
      if (url) {
        insertAtCursor(`\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n`, '', '')
      }
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // Simple live Markdown preview renderer
  const renderPreview = (md: string) => {
    const lines = md.split('\n')
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3) || 'code'
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(
          <div key={i} className="my-4 rounded-xl overflow-hidden border border-[--border]" style={{ background: 'var(--bg)' }}>
            <div className="px-3.5 py-1.5 text-[10.5px] font-mono uppercase tracking-wider text-[--accent] border-b border-[--border]" style={{ background: 'var(--bg-2)' }}>
              {lang}
            </div>
            <pre className="p-3.5 text-xs font-mono overflow-x-auto leading-relaxed" style={{ color: 'var(--text)' }}>
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        )
        i++
        continue
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-extrabold mt-6 mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            <span className="w-1.5 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
            {line.slice(3)}
          </h2>
        )
        i++
        continue
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg font-bold mt-4 mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            {line.slice(4)}
          </h3>
        )
        i++
        continue
      }

      if (line.trim().startsWith('![')) {
        const match = line.match(/!\[(.*?)\]\((.*?)\)/)
        if (match) {
          elements.push(
            <figure key={i} className="my-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={match[2]} alt={match[1]} className="rounded-xl max-h-72 object-cover border border-[--border]" />
              {match[1] && <figcaption className="text-xs font-mono text-[--text-dim] mt-1">{match[1]}</figcaption>}
            </figure>
          )
          i++
          continue
        }
      }

      if (line.trim().startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="my-3 pl-4 py-2 border-l-4 italic text-sm" style={{ borderColor: 'var(--accent)', color: 'var(--text)' }}>
            {line.trim().slice(2)}
          </blockquote>
        )
        i++
        continue
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <li key={i} className="ml-4 list-disc text-sm text-[--text-muted] my-1">
            {line.trim().slice(2)}
          </li>
        )
        i++
        continue
      }

      if (line.trim() === '---') {
        elements.push(<hr key={i} className="my-5 border-[--border]" />)
        i++
        continue
      }

      if (line.trim()) {
        elements.push(
          <p key={i} className="text-sm leading-relaxed text-[--text-muted] my-2">
            {line}
          </p>
        )
      }
      i++
    }
    return elements
  }

  const tools = [
    { label: 'H2', title: 'Section Heading', action: () => insertAtCursor('\n## ', '\n', 'Section Heading') },
    { label: 'H3', title: 'Subheading', action: () => insertAtCursor('\n### ', '\n', 'Subheading') },
    { label: 'B', title: 'Bold (**text**)', action: () => insertAtCursor('**', '**', 'bold text') },
    { label: 'I', title: 'Italic (*text*)', action: () => insertAtCursor('*', '*', 'italic text') },
    { label: '</>', title: 'Inline Code', action: () => insertAtCursor('`', '`', 'code') },
    { label: 'Code Block', title: 'Insert Python/TS Code Block', action: () => insertAtCursor('\n```python\n', '\n```\n', 'async def main():\n    pass') },
    { label: '• List', title: 'Bullet List', action: () => insertAtCursor('\n- ', '', 'List item') },
    { label: '❝ Quote', title: 'Blockquote', action: () => insertAtCursor('\n> ', '\n', 'Key architectural insight...') },
    { label: '🔗 Link', title: 'Insert Link', action: () => insertAtCursor('[', '](https://)', 'Link Title') },
    { label: '— Rule', title: 'Horizontal Divider', action: () => insertAtCursor('\n---\n', '', '') },
  ]

  const effectiveMinHeight = rows ? Math.max(rows * 22, 180) : minHeight

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[--text-dim]">
          {label}
        </label>
      )}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          background: 'var(--bg-2)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Editor Toolbar */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border-b"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex flex-wrap items-center gap-1">
            {tools.map(t => (
              <button
                key={t.label}
                type="button"
                onClick={t.action}
                title={t.title}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer hover:text-[--accent]"
                style={{
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                {t.label}
              </button>
            ))}

            {onUploadImage && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  style={{
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--accent-line)',
                    color: 'var(--accent)',
                  }}
                >
                  <span>{uploading ? '⏳ Uploading...' : '🖼️ Upload & Insert Image'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            {(
              [
                { id: 'write', label: '✍️ Write' },
                { id: 'split', label: '👁️ Split View' },
                { id: 'preview', label: '📖 Preview' },
              ] as const
            ).map(m => {
              const on = mode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer"
                  style={{
                    background: on ? 'var(--accent)' : 'transparent',
                    color: on ? 'var(--on-accent)' : 'var(--text-muted)',
                  }}
                >
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Editor Body */}
        <div className={`grid ${mode === 'split' ? 'lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[--border]' : 'grid-cols-1'}`}>
          {(mode === 'write' || mode === 'split') && (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              style={{ minHeight: effectiveMinHeight, color: 'var(--text)', background: 'transparent' }}
              className="w-full p-4 sm:p-5 text-sm font-mono leading-relaxed outline-none resize-y"
            />
          )}

          {(mode === 'preview' || mode === 'split') && (
            <div
              style={{ minHeight: effectiveMinHeight, maxHeight: effectiveMinHeight + 180 }}
              className="p-4 sm:p-5 overflow-y-auto"
            >
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-[--text-dim] mb-3 pb-2 border-b border-[--border]">
                Live Formatted Preview
              </div>
              {value.trim() ? (
                renderPreview(value)
              ) : (
                <p className="text-xs font-mono text-[--text-dim] italic">
                  Start typing on the left to see your formatted article preview here...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Status Footer */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px] font-mono border-t"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-dim)' }}
        >
          <span>Markdown &amp; Rich Code Blocks Supported</span>
          <div className="flex items-center gap-4">
            <span>{stats.words} words</span>
            <span>{stats.chars} chars</span>
            <span style={{ color: 'var(--accent)' }}>~{stats.readMin} min read</span>
          </div>
        </div>
      </div>
    </div>
  )
}
