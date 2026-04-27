import { useEffect, useState } from 'react'

export function useTypewriter(phrases: string[], typeSpeed = 75, deleteSpeed = 38, pauseMs = 2200) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[idx]
    let t: ReturnType<typeof setTimeout>

    if (!deleting && text.length < current.length) {
      t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed)
    } else if (!deleting && text.length === current.length) {
      t = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && text.length > 0) {
      t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed)
    } else {
      setDeleting(false)
      setIdx(i => (i + 1) % phrases.length)
    }

    return () => clearTimeout(t)
  }, [text, deleting, idx, phrases, typeSpeed, deleteSpeed, pauseMs])

  return text
}
