import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { DEFAULT_DB, type PortfolioDatabase } from '@/data/defaultDb'

const LOCAL_DB_PATH = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  'src',
  'data',
  'local-db.json'
)
const TMP_DB_PATH = '/tmp/mehedi-local-db.json'

const ADMIN_EMAIL = 'mehedi@gmail.com'
const ADMIN_PASS = 'Mehedihasan1.###'

async function readDbFromDisk(): Promise<PortfolioDatabase> {
  // 1. Check /tmp first (if written during a Vercel serverless session)
  try {
    const tmpRaw = await fs.readFile(/*turbopackIgnore: true*/ TMP_DB_PATH, 'utf-8')
    const parsed = JSON.parse(tmpRaw)
    if (
      parsed &&
      parsed.profile &&
      Array.isArray(parsed.projects) &&
      Array.isArray(parsed.blogs)
    ) {
      return parsed
    }
  } catch {}

  // 2. Check src/data/local-db.json in project root
  try {
    const localRaw = await fs.readFile(/*turbopackIgnore: true*/ LOCAL_DB_PATH, 'utf-8')
    const parsed = JSON.parse(localRaw)
    if (
      parsed &&
      parsed.profile &&
      Array.isArray(parsed.projects) &&
      Array.isArray(parsed.blogs)
    ) {
      return parsed
    }
  } catch {}

  return DEFAULT_DB
}

export async function GET() {
  const data = await readDbFromDisk()
  return NextResponse.json(
    { ok: true, data },
    {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    }
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, action, data } = body || {}

    if (
      String(email || '').trim().toLowerCase() !== ADMIN_EMAIL ||
      String(password || '') !== ADMIN_PASS
    ) {
      return NextResponse.json(
        { ok: false, error: 'Invalid admin email or password.' },
        { status: 401 }
      )
    }

    if (action === 'login') {
      const current = await readDbFromDisk()
      return NextResponse.json({ ok: true, data: current })
    }

    const nextDb: PortfolioDatabase = action === 'reset' ? DEFAULT_DB : data
    if (
      !nextDb ||
      !nextDb.profile ||
      !Array.isArray(nextDb.projects) ||
      !Array.isArray(nextDb.blogs)
    ) {
      return NextResponse.json(
        { ok: false, error: 'Invalid database payload.' },
        { status: 400 }
      )
    }

    const serialized = JSON.stringify(nextDb, null, 2)
    let savedLocation = 'local-db.json'

    try {
      await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(LOCAL_DB_PATH), {
        recursive: true,
      })
      await fs.writeFile(/*turbopackIgnore: true*/ LOCAL_DB_PATH, serialized, 'utf-8')
    } catch {
      savedLocation = 'vercel-tmp-cache'
    }

    try {
      await fs.writeFile(/*turbopackIgnore: true*/ TMP_DB_PATH, serialized, 'utf-8')
    } catch {}

    return NextResponse.json({
      ok: true,
      savedLocation,
      data: nextDb,
    })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to update database.' },
      { status: 500 }
    )
  }
}
