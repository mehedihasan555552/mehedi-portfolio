import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const PROJECT_IMAGES_DIR = path.join(process.cwd(), 'images')
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images')

const ALLOWED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'])

export async function GET() {
  try {
    const filesMap = new Map<string, { name: string; url: string; size: number; updatedAt: string }>()

    for (const dir of [PUBLIC_IMAGES_DIR, PROJECT_IMAGES_DIR]) {
      try {
        const entries = await fs.readdir(dir)
        for (const name of entries) {
          if (name.startsWith('.')) continue
          const ext = path.extname(name).toLowerCase()
          if (!ALLOWED_EXTS.has(ext)) continue
          const stat = await fs.stat(path.join(dir, name))
          filesMap.set(name, {
            name,
            url: `/images/${encodeURIComponent(name)}`,
            size: stat.size,
            updatedAt: stat.mtime.toISOString(),
          })
        }
      } catch {}
    }

    // Ensure public/images has copies of everything in images/ so /images/<name> always resolves
    try {
      await fs.mkdir(PUBLIC_IMAGES_DIR, { recursive: true })
      const projEntries = await fs.readdir(PROJECT_IMAGES_DIR)
      for (const name of projEntries) {
        if (name.startsWith('.')) continue
        const srcPath = path.join(PROJECT_IMAGES_DIR, name)
        const dstPath = path.join(PUBLIC_IMAGES_DIR, name)
        try {
          await fs.access(dstPath)
        } catch {
          await fs.copyFile(srcPath, dstPath)
        }
      }
    } catch {}

    const images = Array.from(filesMap.values()).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    )

    return NextResponse.json({ ok: true, images })
  } catch (err: any) {
    return NextResponse.json({ ok: false, images: [], error: err?.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No image file provided.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const origName = file.name || 'uploaded-image.png'
    const ext = path.extname(origName).toLowerCase() || '.png'
    const base = path
      .basename(origName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'image'

    const uniqueName = `${base}-${Date.now().toString().slice(-5)}${ext}`

    let savedToDisk = false
    try {
      // Save to project's root `images/` folder as requested
      await fs.mkdir(PROJECT_IMAGES_DIR, { recursive: true })
      await fs.writeFile(path.join(PROJECT_IMAGES_DIR, uniqueName), buffer)

      // Also save to `public/images/` so Next.js serves it immediately at `/images/<uniqueName>`
      await fs.mkdir(PUBLIC_IMAGES_DIR, { recursive: true })
      await fs.writeFile(path.join(PUBLIC_IMAGES_DIR, uniqueName), buffer)
      savedToDisk = true
    } catch {
      savedToDisk = false
    }

    if (savedToDisk) {
      return NextResponse.json({
        ok: true,
        name: uniqueName,
        url: `/images/${uniqueName}`,
        folder: 'images/ & public/images/',
        size: buffer.length,
      })
    }

    // Fallback for read-only serverless (Vercel): return Data URL so upload still works seamlessly
    const mime = file.type || 'image/png'
    const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`
    return NextResponse.json({
      ok: true,
      name: uniqueName,
      url: dataUrl,
      folder: 'serverless-inline',
      size: buffer.length,
    })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Image upload failed.' },
      { status: 500 }
    )
  }
}
