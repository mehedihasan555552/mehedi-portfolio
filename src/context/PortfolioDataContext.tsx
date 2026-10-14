'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEFAULT_DB, type PortfolioDatabase } from '@/data/defaultDb'

const STORAGE_KEY = 'mehedi_portfolio_db_v1'
const STORAGE_TS_KEY = 'mehedi_portfolio_db_ts_v1'

interface PortfolioDataContextValue {
  db: PortfolioDatabase
  isLoaded: boolean
  updateDb: (
    updater: PortfolioDatabase | ((prev: PortfolioDatabase) => PortfolioDatabase),
    credentials?: { email: string; password: string }
  ) => Promise<{ ok: boolean; savedLocation?: string; error?: string }>
  resetToDefaults: (
    credentials?: { email: string; password: string }
  ) => Promise<{ ok: boolean; error?: string }>
}

const Ctx = createContext<PortfolioDataContextValue>({
  db: DEFAULT_DB,
  isLoaded: false,
  updateDb: async () => ({ ok: false }),
  resetToDefaults: async () => ({ ok: false }),
})

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<PortfolioDatabase>(DEFAULT_DB)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    // 1. Hydrate immediately from localStorage if available
    let hasLocalOverride = false
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed && parsed.profile && Array.isArray(parsed.projects) && Array.isArray(parsed.blogs)) {
          setDb(parsed)
          hasLocalOverride = true
        }
      }
    } catch {}

    // 2. Also fetch from /api/db (src/data/local-db.json)
    fetch('/api/db', { cache: 'no-store' })
      .then(r => r.json())
      .then(res => {
        if (!mounted) return
        if (res?.ok && res?.data) {
          // If no local override exists yet, use the server's local-db.json
          if (!hasLocalOverride) {
            setDb(res.data)
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data))
            } catch {}
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoaded(true)
      })

    // Listen to storage events across tabs (so editing in /admin in one tab updates / in another tab!)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed && parsed.profile) setDb(parsed)
        } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      mounted = false
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const updateDb = useCallback(
    async (
      updater: PortfolioDatabase | ((prev: PortfolioDatabase) => PortfolioDatabase),
      credentials?: { email: string; password: string }
    ) => {
      let nextState: PortfolioDatabase = DEFAULT_DB
      setDb(prev => {
        nextState = typeof updater === 'function' ? updater(prev) : updater
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
          localStorage.setItem(STORAGE_TS_KEY, String(Date.now()))
        } catch {}
        return nextState
      })

      if (credentials) {
        try {
          const res = await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              action: 'save',
              data: nextState,
            }),
          })
          const json = await res.json()
          if (!json.ok) {
            return { ok: false, error: json.error }
          }
          return { ok: true, savedLocation: json.savedLocation }
        } catch {
          // Even if serverless filesystem is read-only or offline, localStorage succeeded
          return { ok: true, savedLocation: 'browser-local-db' }
        }
      }

      return { ok: true, savedLocation: 'browser-local-db' }
    },
    []
  )

  const resetToDefaults = useCallback(
    async (credentials?: { email: string; password: string }) => {
      setDb(DEFAULT_DB)
      try {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(STORAGE_TS_KEY)
      } catch {}

      if (credentials) {
        try {
          await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              action: 'reset',
            }),
          })
        } catch {}
      }
      return { ok: true }
    },
    []
  )

  return (
    <Ctx.Provider value={{ db, isLoaded, updateDb, resetToDefaults }}>
      {children}
    </Ctx.Provider>
  )
}

export const usePortfolioData = () => useContext(Ctx)
