'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import { useTheme } from '@/context/ThemeContext'
import RichTextEditor from '@/components/RichTextEditor'
import type { BlogPost } from '@/data/blogs'
import type {
  ProjectItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
} from '@/data/defaultDb'
import type { VisitorRecord } from '@/app/api/visitors/route'

const DEFAULT_ADMIN_EMAIL = 'mehedi@gmail.com'
const DEFAULT_ADMIN_PASS = 'Mehedihasan1.###'
const AUTH_SESSION_KEY = 'mehedi_admin_session_v1'

type AdminTab =
  | 'overview'
  | 'blogs'
  | 'projects'
  | 'visitors'
  | 'media'
  | 'profile'
  | 'experience'
  | 'education'
  | 'skills'
  | 'database'

interface UploadedImageItem {
  name: string
  url: string
  size: number
  updatedAt: string
}

function flagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function formatCoord(val: unknown, fallback = 0): string {
  const num = typeof val === 'number' ? val : parseFloat(String(val ?? ''))
  return Number.isFinite(num) ? num.toFixed(4) : fallback.toFixed(4)
}

function safePages(pages: unknown): string[] {
  return Array.isArray(pages) && pages.length > 0
    ? pages.map(p => String(p || '/'))
    : ['/']
}

export default function AdminDashboardPage() {
  const { db, isLoaded, updateDb, resetToDefaults } = usePortfolioData()
  const { theme, toggle } = useTheme()

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
  } | null>(null)

  // Image upload state
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [mediaImages, setMediaImages] = useState<UploadedImageItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  // Visitors telemetry state
  const [visitors, setVisitors] = useState<VisitorRecord[]>([])
  const [loadingVisitors, setLoadingVisitors] = useState(false)
  const [visitorSearch, setVisitorSearch] = useState('')
  const [visitorDeviceFilter, setVisitorDeviceFilter] = useState<
    'All' | 'Desktop' | 'Mobile' | 'Tablet'
  >('All')
  const [copiedIp, setCopiedIp] = useState<string | null>(null)

  // Blog editor state
  const [editingBlogSlug, setEditingBlogSlug] = useState<string | null>(null)
  const [blogForm, setBlogForm] = useState<{
    slug: string
    title: string
    tagline: string
    excerpt: string
    category: BlogPost['category']
    publishedAt: string
    readingTime: string
    image: string
    imageAlt: string
    featured: boolean
    tagsText: string
    takeawaysText: string
    metricsText: string
    content: string
  }>({
    slug: '',
    title: '',
    tagline: '',
    excerpt: '',
    category: 'Multi-Agent Systems',
    publishedAt: 'Oct 2026',
    readingTime: '8 min read',
    image: '/images/professional-mehedi.png',
    imageAlt: 'Engineering architecture cover',
    featured: true,
    tagsText: 'Multi-Agent, LangGraph, Python, Production AI',
    takeawaysText:
      'Supervisor-worker topologies isolate context window pollution\nStrict Pydantic schemas prevent malformed tool invocations\nHybrid RRF retrieval boosts recall across technical corpora',
    metricsText: 'Success Rate: 94.8%\nP95 Latency: 1.8s\nToken Savings: -42%',
    content: `## 1. Architectural Problem Statement\n\nModern enterprise LLM systems require deterministic state transitions, strict schema validation, and observable execution traces.\n\n### Core Implementation Blueprint\n\n\`\`\`python\nfrom langgraph.graph import StateGraph, END\nfrom pydantic import BaseModel\n\nclass AgentState(BaseModel):\n    query: str\n    verified: bool = False\n\`\`\`\n\n- **Deterministic Routing**: Isolate specialized sub-agents behind typed state handoffs.\n- **Automated Guardrails**: Validate every tool call before execution.`,
  })
  const [showBlogModal, setShowBlogModal] = useState(false)

  // Project editor state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectForm, setProjectForm] = useState<{
    id: string
    title: string
    tagline: string
    category: string
    year: string
    description: string
    longDescription: string
    techText: string
    image: string
    galleryText: string
    github: string
    live: string
    featured: boolean
    statsText: string
    highlightsText: string
  }>({
    id: '',
    title: '',
    tagline: '',
    category: 'AI / LLM',
    year: '2026',
    description: '',
    longDescription: '',
    techText: 'Python, LangGraph, FastAPI, Qdrant, OpenAI, Docker',
    image: '/images/professional-mehedi.png',
    galleryText: '/images/professional-mehedi.png',
    github: 'https://github.com/mehedihasan555552',
    live: 'https://mehediswpu.vercel.app',
    featured: true,
    statsText: 'Accuracy: 96.4%\nLatency: <1.2s\nThroughput: 2.5k req/m',
    highlightsText:
      'Designed multi-agent orchestration layer with LangGraph\nImplemented hybrid dense + sparse BM25 vector retrieval\nBuilt real-time token streaming and OpenTelemetry tracing',
  })

  // Profile form state
  const [profileForm, setProfileForm] = useState(db.profile)
  const [rolesText, setRolesText] = useState(db.profile.roles.join('\n'))
  const [taglinesText, setTaglinesText] = useState(db.profile.navTaglines.join('\n'))
  const [statsText, setStatsText] = useState(
    db.profile.stats.map(s => `${s.label}: ${s.value}`).join('\n')
  )

  // Experience form state
  const [editingExpId, setEditingExpId] = useState<number | null>(null)
  const [showExpModal, setShowExpModal] = useState(false)
  const [expForm, setExpForm] = useState<{
    period: string
    role: string
    company: string
    type: string
    description: string
    highlightsText: string
    stackText: string
    tone: string
    companyUrl: string
  }>({
    period: '2026 – Present',
    role: 'Senior AI/LLM Engineer',
    company: '',
    type: 'Full-time',
    description: '',
    highlightsText: '',
    stackText: 'Python, LangGraph, FastAPI, RAG, Docker',
    tone: 'var(--accent)',
    companyUrl: '',
  })

  // Education & Certification form state
  const [eduForm, setEduForm] = useState<EducationItem>({
    period: '2018 – 2022',
    degree: 'Bachelor of Science (B.Sc.)',
    field: 'Computer Science & Engineering',
    institution: '',
    desc: '',
    tone: 'var(--accent)',
  })
  const [certForm, setCertForm] = useState<CertificationItem>({
    name: '',
    issuer: '',
    year: '2026',
  })

  // Skills form state
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(92)
  const [newCatTitle, setNewCatTitle] = useState('')
  const [newCatSkills, setNewCatSkills] = useState('')

  // Sync profile form when db loads
  useEffect(() => {
    setProfileForm(db.profile)
    setRolesText(db.profile.roles.join('\n'))
    setTaglinesText(db.profile.navTaglines.join('\n'))
    setStatsText(db.profile.stats.map(s => `${s.label}: ${s.value}`).join('\n'))
  }, [db.profile])

  // Restore session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(AUTH_SESSION_KEY)
      if (saved === 'authenticated') {
        setIsAuthenticated(true)
      }
    } catch {}
  }, [])

  const notify = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusBanner({ type, text })
    setTimeout(() => {
      setStatusBanner(prev => (prev?.text === text ? null : prev))
    }, 5500)
  }

  // Fetch images in project `images/` directory
  const fetchMediaLibrary = useCallback(async () => {
    setLoadingMedia(true)
    try {
      const res = await fetch('/api/upload', { cache: 'no-store' })
      const data = await res.json()
      if (data?.ok && Array.isArray(data.images)) {
        setMediaImages(data.images)
      }
    } catch {
      // ignore
    } finally {
      setLoadingMedia(false)
    }
  }, [])

  // Fetch unique visitors telemetry
  const fetchVisitors = useCallback(async () => {
    setLoadingVisitors(true)
    try {
      const res = await fetch('/api/visitors', { cache: 'no-store' })
      const data = await res.json()
      if (data?.ok && Array.isArray(data.visitors)) {
        setVisitors(data.visitors)
      }
    } catch {
      // ignore
    } finally {
      setLoadingVisitors(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMediaLibrary()
      fetchVisitors()
    }
  }, [isAuthenticated, fetchMediaLibrary, fetchVisitors])

  // Upload image helper (`POST /api/upload` -> saves to `images/` and `public/images/`)
  const uploadImageFile = async (
    file: File,
    fieldKey: string,
    onSuccessUrl: (url: string) => void
  ) => {
    setUploadingField(fieldKey)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data?.ok && data?.url) {
        onSuccessUrl(data.url)
        notify(
          'success',
          `Saved "${data.fileName}" directly to project images/ folder (${data.url})`
        )
        fetchMediaLibrary()
      } else {
        notify('error', data?.error || 'Image upload failed')
      }
    } catch {
      notify('error', 'Failed to upload image file')
    } finally {
      setUploadingField(null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    const cleanEmail = emailInput.trim().toLowerCase()
    const cleanPass = passwordInput

    if (
      cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() &&
      cleanPass === DEFAULT_ADMIN_PASS
    ) {
      setIsAuthenticated(true)
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'authenticated')
      } catch {}
      notify('success', 'Signed in to Full-Page Admin Studio (mehedi@gmail.com).')
    } else {
      setAuthError('Invalid credentials. Please check your admin email and password.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasswordInput('')
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY)
    } catch {}
  }

  /* ─── BLOG CRUD HANDLERS ─── */
  const openNewBlogModal = () => {
    setActiveTab('blogs')
    setEditingBlogSlug(null)
    setBlogForm({
      slug: '',
      title: '',
      tagline: '',
      excerpt: '',
      category: 'Multi-Agent Systems',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      readingTime: '8 min read',
      image: '/images/professional-mehedi.png',
      imageAlt: 'Technical architecture cover',
      featured: true,
      tagsText: 'Multi-Agent, LangGraph, Python, Production AI',
      takeawaysText:
        'Supervisor-worker topologies isolate context window pollution\nStrict Pydantic schemas prevent malformed tool invocations\nHybrid RRF retrieval boosts recall across technical corpora',
      metricsText: 'Success Rate: 94.8%\nP95 Latency: 1.8s\nToken Savings: -42%',
      content: `## 1. Architectural Problem Statement\n\nModern enterprise LLM systems require deterministic state transitions, strict schema validation, and observable execution traces.\n\n### Core Implementation Blueprint\n\n\`\`\`python\nfrom langgraph.graph import StateGraph, END\nfrom pydantic import BaseModel\n\nclass AgentState(BaseModel):\n    query: str\n    verified: bool = False\n\`\`\`\n\n- **Deterministic Routing**: Isolate specialized sub-agents behind typed state handoffs.\n- **Automated Guardrails**: Validate every tool call before execution.`,
    })
    setShowBlogModal(true)
  }

  const openEditBlogModal = (blog: BlogPost) => {
    setActiveTab('blogs')
    setEditingBlogSlug(blog.slug)
    setBlogForm({
      slug: blog.slug,
      title: blog.title,
      tagline: blog.tagline,
      excerpt: blog.excerpt,
      category: blog.category,
      publishedAt: blog.publishedAt,
      readingTime: blog.readingTime,
      image: blog.image,
      imageAlt: blog.imageAlt,
      featured: Boolean(blog.featured),
      tagsText: blog.tags.join(', '),
      takeawaysText: blog.keyTakeaways.join('\n'),
      metricsText: (blog.metrics || []).map(m => `${m.label}: ${m.value}`).join('\n'),
      content: blog.content,
    })
    setShowBlogModal(true)
  }

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blogForm.title.trim()) {
      notify('error', 'Blog title is required.')
      return
    }

    const generatedSlug =
      blogForm.slug.trim() ||
      blogForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const headings = Array.from(blogForm.content.matchAll(/^##\s+(.+)$/gm)).map(m => {
      const title = m[1].trim()
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      return { id, title }
    })

    const metrics = blogForm.metricsText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const idx = line.indexOf(':')
        if (idx === -1) return { label: line, value: '100%' }
        return {
          label: line.slice(0, idx).trim(),
          value: line.slice(idx + 1).trim(),
        }
      })

    const newPost: BlogPost = {
      slug: generatedSlug,
      title: blogForm.title.trim(),
      tagline: blogForm.tagline.trim() || blogForm.excerpt.trim(),
      excerpt: blogForm.excerpt.trim(),
      category: blogForm.category,
      publishedAt: blogForm.publishedAt.trim() || 'Oct 2026',
      readingTime: blogForm.readingTime.trim() || '8 min read',
      image: blogForm.image.trim() || '/images/professional-mehedi.png',
      imageAlt: blogForm.imageAlt.trim() || blogForm.title.trim(),
      featured: blogForm.featured,
      tags: blogForm.tagsText
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      keyTakeaways: blogForm.takeawaysText
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean),
      metrics,
      tableOfContents:
        headings.length > 0
          ? headings
          : [{ id: 'overview', title: '1. Architectural Overview' }],
      content: blogForm.content,
    }

    const res = await updateDb(prev => {
      const exists = prev.blogs.some(b => b.slug === (editingBlogSlug || generatedSlug))
      const updatedBlogs = exists
        ? prev.blogs.map(b => (b.slug === (editingBlogSlug || generatedSlug) ? newPost : b))
        : [newPost, ...prev.blogs]
      return { ...prev, blogs: updatedBlogs }
    })

    setShowBlogModal(false)
    setEditingBlogSlug(null)
    notify(
      'success',
      `Blog "${newPost.title}" published & saved (${res.savedLocation || 'localStorage'})!`
    )
  }

  const handleDeleteBlog = async (slug: string, title: string) => {
    if (!window.confirm(`Delete blog post "${title}"?`)) return
    await updateDb(prev => ({
      ...prev,
      blogs: prev.blogs.filter(b => b.slug !== slug),
    }))
    notify('info', `Deleted blog post "${title}".`)
  }

  /* ─── PROJECT CRUD HANDLERS ─── */
  const openNewProjectModal = () => {
    setActiveTab('projects')
    setEditingProjectId(null)
    setProjectForm({
      id: '',
      title: '',
      tagline: '',
      category: 'AI / LLM',
      year: '2026',
      description: '',
      longDescription: '',
      techText: 'Python, LangGraph, FastAPI, Qdrant, OpenAI, Docker',
      image: '/images/professional-mehedi.png',
      galleryText: '/images/professional-mehedi.png',
      github: 'https://github.com/mehedihasan555552',
      live: 'https://mehediswpu.vercel.app',
      featured: true,
      statsText: 'Accuracy: 96.4%\nLatency: <1.2s\nThroughput: 2.5k req/m',
      highlightsText:
        'Designed multi-agent orchestration layer with LangGraph\nImplemented hybrid dense + sparse BM25 vector retrieval\nBuilt real-time token streaming and OpenTelemetry tracing',
    })
    setShowProjectModal(true)
  }

  const openEditProjectModal = (proj: ProjectItem) => {
    setActiveTab('projects')
    setEditingProjectId(proj.id)
    setProjectForm({
      id: proj.id,
      title: proj.title,
      tagline: proj.tagline,
      category: proj.category,
      year: proj.year,
      description: proj.description,
      longDescription: proj.longDescription,
      techText: proj.tech.join(', '),
      image: proj.image,
      galleryText: (proj.gallery || [proj.image]).join('\n'),
      github: proj.github,
      live: proj.live,
      featured: proj.featured,
      statsText: (proj.stats || []).map(s => `${s.label}: ${s.value}`).join('\n'),
      highlightsText: (proj.highlights || []).join('\n'),
    })
    setShowProjectModal(true)
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectForm.title.trim()) {
      notify('error', 'Project title is required.')
      return
    }

    const genId =
      projectForm.id.trim() ||
      projectForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const stats = projectForm.statsText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const idx = line.indexOf(':')
        if (idx === -1) return { label: line, value: '100%' }
        return {
          label: line.slice(0, idx).trim(),
          value: line.slice(idx + 1).trim(),
        }
      })

    const gallery = projectForm.galleryText
      .split('\n')
      .map(u => u.trim())
      .filter(Boolean)

    const newProj: ProjectItem = {
      id: genId,
      title: projectForm.title.trim(),
      tagline: projectForm.tagline.trim() || projectForm.description.trim(),
      category: projectForm.category.trim() || 'AI / LLM',
      year: projectForm.year.trim() || '2026',
      description: projectForm.description.trim(),
      longDescription: projectForm.longDescription.trim() || projectForm.description.trim(),
      tech: projectForm.techText
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      image: projectForm.image.trim() || '/images/professional-mehedi.png',
      gallery: gallery.length > 0 ? gallery : [projectForm.image.trim()],
      github: projectForm.github.trim() || 'https://github.com/mehedihasan555552',
      live: projectForm.live.trim() || 'https://mehediswpu.vercel.app',
      featured: projectForm.featured,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
      stats,
      highlights: projectForm.highlightsText
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean),
    }

    const res = await updateDb(prev => {
      const exists = prev.projects.some(p => p.id === (editingProjectId || genId))
      const updated = exists
        ? prev.projects.map(p => (p.id === (editingProjectId || genId) ? newProj : p))
        : [newProj, ...prev.projects]
      return { ...prev, projects: updated }
    })

    setShowProjectModal(false)
    setEditingProjectId(null)
    notify(
      'success',
      `Project "${newProj.title}" saved to database (${res.savedLocation || 'localStorage'})!`
    )
  }

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Delete project "${title}"?`)) return
    await updateDb(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }))
    notify('info', `Deleted project "${title}".`)
  }

  /* ─── PROFILE SAVE HANDLER ─── */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedStats = statsText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const idx = line.indexOf(':')
        if (idx === -1) return { label: line, value: '100%' }
        return {
          label: line.slice(0, idx).trim(),
          value: line.slice(idx + 1).trim(),
        }
      })

    const updatedProfile = {
      ...profileForm,
      roles: rolesText
        .split('\n')
        .map(r => r.trim())
        .filter(Boolean),
      navTaglines: taglinesText
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean),
      stats: parsedStats.length > 0 ? parsedStats : db.profile.stats,
    }

    const res = await updateDb(prev => ({
      ...prev,
      profile: updatedProfile,
    }))

    notify(
      'success',
      `Profile, Hero Orbit Photo & Contact info saved (${res.savedLocation || 'localStorage'})!`
    )
  }

  /* ─── EXPERIENCE CRUD HANDLERS ─── */
  const openNewExpModal = () => {
    setEditingExpId(null)
    setExpForm({
      period: '2026 – Present',
      role: '',
      company: '',
      type: 'Full-time',
      description: '',
      highlightsText: '',
      stackText: 'Python, LangGraph, FastAPI, RAG',
      tone: 'var(--accent)',
      companyUrl: '',
    })
    setShowExpModal(true)
  }

  const openEditExpModal = (exp: ExperienceItem) => {
    setEditingExpId(exp.id)
    setExpForm({
      period: exp.period,
      role: exp.role,
      company: exp.company,
      type: exp.type,
      description: exp.description,
      highlightsText: exp.highlights.join('\n'),
      stackText: exp.stack.join(', '),
      tone: exp.tone || 'var(--accent)',
      companyUrl: exp.companyUrl || '',
    })
    setShowExpModal(true)
  }

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expForm.role.trim() || !expForm.company.trim()) {
      notify('error', 'Role and Company name are required.')
      return
    }

    await updateDb(prev => {
      const nextId =
        editingExpId !== null
          ? editingExpId
          : prev.experiences.reduce((m, x) => Math.max(m, x.id), 0) + 1

      const item: ExperienceItem = {
        id: nextId,
        period: expForm.period.trim(),
        role: expForm.role.trim(),
        company: expForm.company.trim(),
        type: expForm.type.trim(),
        description: expForm.description.trim(),
        highlights: expForm.highlightsText
          .split('\n')
          .map(h => h.trim())
          .filter(Boolean),
        stack: expForm.stackText
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        tone: expForm.tone,
        companyUrl: expForm.companyUrl.trim() || undefined,
      }

      const exists = prev.experiences.some(x => x.id === editingExpId)
      const experiences = exists
        ? prev.experiences.map(x => (x.id === editingExpId ? item : x))
        : [item, ...prev.experiences]

      return { ...prev, experiences }
    })

    setShowExpModal(false)
    setEditingExpId(null)
    notify('success', 'Work experience updated!')
  }

  const handleDeleteExperience = async (id: number, role: string) => {
    if (!window.confirm(`Delete experience "${role}"?`)) return
    await updateDb(prev => ({
      ...prev,
      experiences: prev.experiences.filter(x => x.id !== id),
    }))
    notify('info', `Deleted experience "${role}".`)
  }

  /* ─── EDUCATION & CERTIFICATIONS HANDLERS ─── */
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eduForm.degree.trim() || !eduForm.institution.trim()) return
    await updateDb(prev => ({
      ...prev,
      education: [eduForm, ...prev.education],
    }))
    setEduForm({
      period: '2022 – 2024',
      degree: '',
      field: '',
      institution: '',
      desc: '',
      tone: 'var(--accent)',
    })
    notify('success', 'Added academic degree!')
  }

  const handleDeleteEducation = async (idx: number) => {
    await updateDb(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }))
    notify('info', 'Removed education entry.')
  }

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certForm.name.trim()) return
    await updateDb(prev => ({
      ...prev,
      certifications: [certForm, ...prev.certifications],
    }))
    setCertForm({ name: '', issuer: '', year: '2026' })
    notify('success', 'Added certification!')
  }

  const handleDeleteCert = async (idx: number) => {
    await updateDb(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx),
    }))
    notify('info', 'Removed certification.')
  }

  /* ─── SKILLS HANDLERS ─── */
  const handleAddProficiency = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkillName.trim()) return
    await updateDb(prev => ({
      ...prev,
      proficiencies: [
        ...prev.proficiencies,
        {
          name: newSkillName.trim(),
          level: Number(newSkillLevel),
          delay: prev.proficiencies.length * 80,
        },
      ],
    }))
    setNewSkillName('')
    setNewSkillLevel(92)
    notify('success', 'Added skill proficiency bar!')
  }

  const handleDeleteProficiency = async (name: string) => {
    await updateDb(prev => ({
      ...prev,
      proficiencies: prev.proficiencies.filter(p => p.name !== name),
    }))
  }

  const handleAddSkillCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatTitle.trim() || !newCatSkills.trim()) return
    await updateDb(prev => ({
      ...prev,
      skillCategories: [
        ...prev.skillCategories,
        {
          title: newCatTitle.trim(),
          tone: 'var(--accent)',
          skills: newCatSkills
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
        },
      ],
    }))
    setNewCatTitle('')
    setNewCatSkills('')
    notify('success', 'Added skill category card!')
  }

  const handleDeleteSkillCategory = async (title: string) => {
    await updateDb(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.filter(c => c.title !== title),
    }))
  }

  /* ─── DATABASE EXPORT / IMPORT / RESET ─── */
  const handleExportJson = () => {
    const dataStr = JSON.stringify(db, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'local-db.json'
    a.click()
    URL.revokeObjectURL(url)
    notify(
      'success',
      'Downloaded local-db.json! Commit it to src/data/local-db.json for permanent Vercel builds.'
    )
  }

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async event => {
      try {
        const parsed = JSON.parse(String(event.target?.result || '{}'))
        if (parsed && parsed.profile && Array.isArray(parsed.blogs)) {
          await updateDb(parsed)
          notify('success', 'Imported local-db.json successfully!')
        } else {
          notify('error', 'Invalid JSON format.')
        }
      } catch {
        notify('error', 'Could not parse JSON file.')
      }
    }
    reader.readAsText(file)
  }

  /* ─── VISITOR ANALYTICS HELPERS ─── */
  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      if (visitorDeviceFilter !== 'All' && v.deviceType !== visitorDeviceFilter) return false
      if (!visitorSearch.trim()) return true
      const q = visitorSearch.toLowerCase()
      return (
        String(v.ip || '').toLowerCase().includes(q) ||
        String(v.city || '').toLowerCase().includes(q) ||
        String(v.country || '').toLowerCase().includes(q) ||
        String(v.region || '').toLowerCase().includes(q) ||
        String(v.isp || '').toLowerCase().includes(q) ||
        String(v.os || '').toLowerCase().includes(q) ||
        String(v.browser || '').toLowerCase().includes(q) ||
        safePages(v.pagesVisited).some(p => p.toLowerCase().includes(q))
      )
    })
  }, [visitors, visitorSearch, visitorDeviceFilter])

  const visitorStats = useMemo(() => {
    const totalUnique = visitors.length
    const totalPageViews = visitors.reduce((acc, v) => acc + (Number(v.visitCount) || 1), 0)
    const countries = new Set(visitors.map(v => v.country)).size
    const desktopCount = visitors.filter(v => v.deviceType === 'Desktop').length
    const mobileCount = visitors.filter(
      v => v.deviceType === 'Mobile' || v.deviceType === 'Tablet'
    ).length

    const countryMap = new Map<string, { country: string; code: string; count: number }>()
    visitors.forEach(v => {
      const cName = v.country || 'Bangladesh'
      const existing = countryMap.get(cName) || {
        country: cName,
        code: v.countryCode || 'BD',
        count: 0,
      }
      existing.count += 1
      countryMap.set(cName, existing)
    })
    const topCountries = Array.from(countryMap.values()).sort((a, b) => b.count - a.count)

    return {
      totalUnique,
      totalPageViews,
      countries,
      desktopCount,
      mobileCount,
      topCountries,
    }
  }, [visitors])

  const handleSimulateVisitor = async () => {
    const sampleMocks = [
      {
        visitorId: `v-sim-${Date.now()}`,
        ip: `104.28.${Math.floor(Math.random() * 220) + 10}.${Math.floor(Math.random() * 240) + 10}`,
        city: 'Toronto',
        region: 'Ontario',
        country: 'Canada',
        countryCode: 'CA',
        latitude: 43.6532,
        longitude: -79.3832,
        timezone: 'America/Toronto',
        isp: 'Cloudflare Warp / Bell Canada',
        deviceType: 'Desktop',
        os: 'macOS Sonoma',
        browser: 'Chrome 131',
        screen: '2560x1440',
        referrer: 'news.ycombinator.com',
        path: '/blog/production-multi-agent-orchestration',
      },
      {
        visitorId: `v-sim-${Date.now()}`,
        ip: `118.179.${Math.floor(Math.random() * 200) + 15}.${Math.floor(Math.random() * 240) + 10}`,
        city: 'Dhaka',
        region: 'Dhaka Division',
        country: 'Bangladesh',
        countryCode: 'BD',
        latitude: 23.8103,
        longitude: 90.4125,
        timezone: 'Asia/Dhaka',
        isp: 'Amber IT Limited',
        deviceType: 'Mobile',
        os: 'iOS 18',
        browser: 'Safari',
        screen: '430x932',
        referrer: 'linkedin.com',
        path: '/',
      },
      {
        visitorId: `v-sim-${Date.now()}`,
        ip: `35.198.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 240) + 10}`,
        city: 'Tokyo',
        region: 'Tokyo',
        country: 'Japan',
        countryCode: 'JP',
        latitude: 35.6762,
        longitude: 139.6503,
        timezone: 'Asia/Tokyo',
        isp: 'NTT Communications',
        deviceType: 'Desktop',
        os: 'Windows 11',
        browser: 'Edge',
        screen: '1920x1080',
        referrer: 'github.com',
        path: '/blog/hybrid-rag-reranking-at-scale',
      },
    ]
    const pick = sampleMocks[Math.floor(Math.random() * sampleMocks.length)]
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pick),
      })
      const data = await res.json()
      if (data?.ok && Array.isArray(data.visitors)) {
        setVisitors(data.visitors)
        notify('success', `Recorded live visitor from ${pick.city}, ${pick.country} (${pick.ip})`)
      }
    } catch {
      notify('error', 'Failed to simulate visitor')
    }
  }

  const handleExportVisitorsCsv = () => {
    const headers = [
      'Visitor ID',
      'IP Address',
      'City',
      'Region',
      'Country',
      'Latitude',
      'Longitude',
      'Timezone',
      'ISP',
      'Device',
      'OS',
      'Browser',
      'Screen',
      'Visits',
      'Pages Visited',
      'Last Active',
    ]
    const rows = visitors.map(v => [
      v.visitorId,
      v.ip,
      v.city,
      v.region,
      v.country,
      formatCoord(v.latitude, 23.8103),
      formatCoord(v.longitude, 90.4125),
      v.timezone,
      `"${String(v.isp || '').replace(/"/g, '""')}"`,
      v.deviceType,
      v.os,
      v.browser,
      v.screen,
      v.visitCount || 1,
      `"${safePages(v.pagesVisited).join(' | ')}"`,
      v.lastActive,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `unique-visitors-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify('success', 'Exported unique visitor telemetry CSV!')
  }

  const sidebarGroups: {
    groupTitle: string
    items: {
      id: AdminTab
      label: string
      sub: string
      icon: string
      badge?: number | string
    }[]
  }[] = [
    {
      groupTitle: '01 // COMMAND CENTER',
      items: [
        {
          id: 'overview',
          label: 'Dashboard Overview',
          sub: 'Step-by-Step Quick Start',
          icon: '📊',
        },
        {
          id: 'visitors',
          label: 'Unique Visitors & IPs',
          sub: 'Live Geo & Device Logs',
          icon: '🌍',
          badge: visitors.length,
        },
      ],
    },
    {
      groupTitle: '02 // CONTENT & MEDIA STUDIO',
      items: [
        {
          id: 'blogs',
          label: 'Technical Blogs',
          sub: 'Rich Text & Playbooks',
          icon: '📝',
          badge: db.blogs.length,
        },
        {
          id: 'projects',
          label: 'Projects & Case Studies',
          sub: '3D Showcase & Gallery',
          icon: '🚀',
          badge: db.projects.length,
        },
        {
          id: 'media',
          label: 'Image Folder (images/)',
          sub: 'Upload & Manage Photos',
          icon: '🖼️',
          badge: mediaImages.length,
        },
      ],
    },
    {
      groupTitle: '03 // PROFILE & RESUME DATA',
      items: [
        {
          id: 'profile',
          label: 'Profile & Hero Avatar',
          sub: 'Live Orbit Photo & Bio',
          icon: '👤',
        },
        {
          id: 'experience',
          label: 'Work Experience',
          sub: 'Career Timeline',
          icon: '💼',
          badge: db.experiences.length,
        },
        {
          id: 'education',
          label: 'Education & Certs',
          sub: 'Degrees & Credentials',
          icon: '🎓',
          badge: db.education.length + db.certifications.length,
        },
        {
          id: 'skills',
          label: 'Skills & AI Stack',
          sub: 'Proficiencies & Categories',
          icon: '⚡',
          badge: db.skillCategories.length,
        },
        {
          id: 'database',
          label: 'Local DB & Vercel Sync',
          sub: 'JSON Backup & Restore',
          icon: '💾',
        },
      ],
    },
  ]

  const allSidebarItems = sidebarGroups.flatMap(g => g.items)
  const currentTabMeta =
    allSidebarItems.find(i => i.id === activeTab) || allSidebarItems[0]

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {!isAuthenticated ? (
        /* ══════════════════════════════════════════════════════════════
           FULL-SCREEN ADMIN LOGIN PORTAL (HIGH CONTRAST & EASY TO READ)
           ══════════════════════════════════════════════════════════════ */
        <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
          <div className="w-full max-w-lg glass-card p-8 sm:p-10 rounded-3xl border border-[--border] shadow-2xl relative z-10">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="text-xs font-mono font-extrabold text-[--text] hover:text-[--accent] flex items-center gap-1.5"
              >
                ← Back to Live Portfolio
              </Link>
              <button
                onClick={toggle}
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold border border-[--border] bg-[--bg-2] text-[--text] hover:border-[--accent]"
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center font-mono font-black text-lg flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-deep), var(--accent) 60%, var(--signal))',
                  color: 'var(--on-accent)',
                  boxShadow: '0 10px 25px -5px rgb(var(--accent-rgb) / 0.5)',
                }}
              >
                M.AI
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[--accent] font-extrabold block">
                  // Full-Screen CMS &amp; Visitor Intelligence
                </span>
                <h1
                  className="text-2xl sm:text-3xl font-black tracking-tight text-[--text]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Portfolio Admin Studio
                </h1>
              </div>
            </div>

            <p className="text-sm font-semibold text-[--text-muted] mb-6 leading-relaxed">
              Sign in to publish articles with the Rich Text Editor, upload images directly to your{' '}
              <code className="px-2 py-0.5 rounded bg-[--bg-2] text-[--accent] font-mono font-bold text-xs">
                images/
              </code>{' '}
              folder, and inspect unique visitor IP &amp; device locations.
            </p>

            {authError && (
              <div
                className="mb-5 p-4 rounded-xl text-xs font-mono font-extrabold"
                style={{
                  background: 'rgb(239 68 68 / 0.14)',
                  border: '1.5px solid rgb(239 68 68 / 0.45)',
                  color: '#dc2626',
                }}
              >
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-[--text] mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="mehedi@gmail.com"
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold outline-none transition-all bg-[--bg-2] border border-[--border] text-[--text]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-extrabold uppercase tracking-wider text-[--text] mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-3.5 pr-16 rounded-xl text-sm font-bold outline-none transition-all bg-[--bg-2] border border-[--border] text-[--text]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-extrabold text-[--text-muted] hover:text-[--accent]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full justify-center py-4 text-sm font-extrabold mt-2"
              >
                Sign In to Admin Studio →
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[--border] flex items-center justify-between text-xs font-mono font-bold text-[--text-muted]">
              <span>Default Admin Credentials</span>
              <button
                type="button"
                onClick={() => {
                  setEmailInput(DEFAULT_ADMIN_EMAIL)
                  setPasswordInput(DEFAULT_ADMIN_PASS)
                }}
                className="text-[--accent] hover:underline font-extrabold"
              >
                1-Click Auto-Fill Login ⚡
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           FULL-PAGE ADMIN WORKSPACE (GROUPED SIDEBAR + TOPBAR + MAIN)
           ══════════════════════════════════════════════════════════════ */
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen w-full">
          {/* ── LEFT FULL-HEIGHT SIDEBAR ── */}
          <aside
            className="w-full lg:w-72 xl:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[--border] flex flex-col justify-between lg:sticky lg:top-0 lg:h-screen overflow-y-auto"
            style={{
              background: 'var(--bg-2)',
            }}
          >
            <div className="p-5 sm:p-6 space-y-6">
              {/* Brand Header */}
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-[--border]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl grid place-items-center font-mono font-black text-sm flex-shrink-0"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent-deep), var(--accent) 65%, var(--signal))',
                      color: 'var(--on-accent)',
                      boxShadow: '0 6px 18px -4px rgb(var(--accent-rgb) / 0.45)',
                    }}
                  >
                    M.AI
                  </div>
                  <div>
                    <div
                      className="font-black text-lg tracking-tight text-[--text] leading-none"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Admin <span style={{ color: 'var(--accent)' }}>Studio</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[--text-muted] flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-[--accent] animate-pulse" />
                      mehedi@gmail.com
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggle}
                  title="Switch Light / Dark Mode"
                  className="px-3 py-2 rounded-xl border border-[--border] text-xs font-mono font-extrabold hover:border-[--accent] bg-[--bg] text-[--text]"
                >
                  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>

              {/* Categorized Navigation Groups */}
              <div className="space-y-5">
                {sidebarGroups.map(group => (
                  <div key={group.groupTitle}>
                    <div className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[--text-dim] px-2 mb-2">
                      {group.groupTitle}
                    </div>
                    <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
                      {group.items.map(item => {
                        const active = activeTab === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTab(item.id)}
                            className="flex items-center justify-between gap-2.5 px-3.5 py-3 rounded-xl text-left transition-all"
                            style={{
                              background: active ? 'var(--accent)' : 'var(--bg)',
                              color: active ? 'var(--on-accent)' : 'var(--text)',
                              border: active
                                ? '1.5px solid var(--accent)'
                                : '1px solid var(--border)',
                              boxShadow: active
                                ? '0 8px 20px -6px rgb(var(--accent-rgb) / 0.45)'
                                : 'none',
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-lg flex-shrink-0">{item.icon}</span>
                              <div className="min-w-0">
                                <div className="text-xs font-extrabold truncate">
                                  {item.label}
                                </div>
                                <div
                                  className="text-[10.5px] font-mono font-semibold truncate hidden sm:block"
                                  style={{
                                    color: active
                                      ? 'color-mix(in oklch, var(--on-accent) 90%, transparent)'
                                      : 'var(--text-muted)',
                                  }}
                                >
                                  {item.sub}
                                </div>
                              </div>
                            </div>
                            {item.badge !== undefined && (
                              <span
                                className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold flex-shrink-0"
                                style={{
                                  background: active
                                    ? 'rgb(0 0 0 / 0.25)'
                                    : 'var(--bg-2)',
                                  color: active ? 'var(--on-accent)' : 'var(--accent)',
                                  border: active ? 'none' : '1px solid var(--border)',
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Footer Quick Actions */}
            <div className="p-5 sm:p-6 border-t border-[--border] space-y-2.5 bg-[--bg]">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="btn btn-ghost text-xs py-2.5 px-3 justify-center font-mono font-bold"
                >
                  Live Site ↗
                </Link>
                <Link
                  href="/visitors"
                  target="_blank"
                  className="btn btn-ghost text-xs py-2.5 px-3 justify-center font-mono font-bold"
                >
                  /visitors ↗
                </Link>
              </div>
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full btn btn-ghost text-xs py-2.5 px-3 justify-center font-mono font-bold"
              >
                ⬇ Export local-db.json
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-mono font-extrabold transition-all text-center"
                style={{
                  background: 'rgb(239 68 68 / 0.14)',
                  border: '1.5px solid rgb(239 68 68 / 0.35)',
                  color: '#dc2626',
                }}
              >
                Sign Out of Admin
              </button>
            </div>
          </aside>

          {/* ── FULL-WIDTH MAIN WORKSPACE ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Command Header */}
            <header
              className="sticky top-0 z-30 px-6 lg:px-10 py-5 border-b border-[--border] flex flex-wrap items-center justify-between gap-4"
              style={{
                background: 'var(--bg)',
              }}
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[--accent] font-extrabold">
                  <span>{currentTabMeta.sub}</span>
                  <span>•</span>
                  <span>{isLoaded ? '✓ Local Database Active' : 'Syncing...'}</span>
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-black tracking-tight text-[--text] mt-0.5"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {currentTabMeta.icon} {currentTabMeta.label}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={openNewBlogModal}
                  className="btn btn-primary text-xs py-2.5 px-4 font-extrabold"
                >
                  + Write Blog Post
                </button>
                <button
                  type="button"
                  onClick={openNewProjectModal}
                  className="btn btn-ghost text-xs py-2.5 px-4 font-mono font-extrabold"
                >
                  + Add Project
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('visitors')}
                  className="btn btn-ghost text-xs py-2.5 px-4 font-mono font-extrabold"
                >
                  🌍 Visitors ({visitors.length})
                </button>
                <Link
                  href="/"
                  className="btn btn-ghost text-xs py-2.5 px-4 font-mono font-extrabold"
                >
                  View Portfolio ↗
                </Link>
              </div>
            </header>

            {/* Workspace Content Area */}
            <main className="flex-1 w-full px-6 lg:px-10 py-8 space-y-8 max-w-[1600px]">
              {/* Status Notification Toast */}
              {statusBanner && (
                <div
                  className="p-4 rounded-2xl text-sm font-mono font-extrabold flex items-center justify-between"
                  style={{
                    background:
                      statusBanner.type === 'success'
                        ? 'var(--accent-soft)'
                        : statusBanner.type === 'error'
                        ? 'rgb(239 68 68 / 0.14)'
                        : 'var(--bg-2)',
                    border:
                      statusBanner.type === 'success'
                        ? '1.5px solid var(--accent-line)'
                        : statusBanner.type === 'error'
                        ? '1.5px solid rgb(239 68 68 / 0.4)'
                        : '1.5px solid var(--border)',
                    color:
                      statusBanner.type === 'success'
                        ? 'var(--accent)'
                        : statusBanner.type === 'error'
                        ? '#dc2626'
                        : 'var(--text)',
                  }}
                >
                  <span>
                    {statusBanner.type === 'success' ? '✓ ' : 'ℹ️ '}
                    {statusBanner.text}
                  </span>
                  <button
                    onClick={() => setStatusBanner(null)}
                    className="text-xs font-extrabold opacity-80 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 0: STEP-BY-STEP COMMAND CENTER OVERVIEW (`overview`)
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* 4 Interactive KPI Summary Cards */}
                  <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <div className="glass-card p-6 rounded-2xl border border-[--border] flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
                            01 // Engineering Blogs
                          </span>
                          <span className="text-2xl">📝</span>
                        </div>
                        <div
                          className="text-4xl font-black mt-2 text-[--text]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {db.blogs.length}
                        </div>
                        <p className="text-xs font-semibold text-[--text-muted] mt-1">
                          Technical playbooks with Rich Text &amp; code blocks
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-[--border]">
                        <button
                          type="button"
                          onClick={openNewBlogModal}
                          className="btn btn-primary text-xs py-2 px-3.5 flex-1 justify-center font-extrabold"
                        >
                          + Write New Blog
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('blogs')}
                          className="btn btn-ghost text-xs py-2 px-3 font-mono font-bold"
                        >
                          Manage
                        </button>
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-[--border] flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
                            02 // Featured Projects
                          </span>
                          <span className="text-2xl">🚀</span>
                        </div>
                        <div
                          className="text-4xl font-black mt-2 text-[--text]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {db.projects.length}
                        </div>
                        <p className="text-xs font-semibold text-[--text-muted] mt-1">
                          Production AI &amp; LLM system case studies
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-[--border]">
                        <button
                          type="button"
                          onClick={openNewProjectModal}
                          className="btn btn-primary text-xs py-2 px-3.5 flex-1 justify-center font-extrabold"
                        >
                          + Add Project
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('projects')}
                          className="btn btn-ghost text-xs py-2 px-3 font-mono font-bold"
                        >
                          Manage
                        </button>
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-[--border] flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
                            03 // Unique Visitors
                          </span>
                          <span className="text-2xl">🌍</span>
                        </div>
                        <div
                          className="text-4xl font-black mt-2"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                        >
                          {visitorStats.totalUnique}
                        </div>
                        <p className="text-xs font-semibold text-[--text-muted] mt-1">
                          {visitorStats.totalPageViews} total views across {visitorStats.countries}{' '}
                          countries
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-[--border]">
                        <button
                          type="button"
                          onClick={() => setActiveTab('visitors')}
                          className="btn btn-primary text-xs py-2 px-3.5 flex-1 justify-center font-extrabold"
                        >
                          Inspect IPs &amp; Geo
                        </button>
                        <Link
                          href="/visitors"
                          target="_blank"
                          className="btn btn-ghost text-xs py-2 px-3 font-mono font-bold"
                        >
                          /visitors ↗
                        </Link>
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-[--border] flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
                            04 // Image Folder
                          </span>
                          <span className="text-2xl">🖼️</span>
                        </div>
                        <div
                          className="text-4xl font-black mt-2 text-[--text]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {mediaImages.length}
                        </div>
                        <p className="text-xs font-semibold text-[--text-muted] mt-1">
                          Saved directly in project <code className="font-mono">images/</code> folder
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-[--border]">
                        <button
                          type="button"
                          onClick={() => setActiveTab('media')}
                          className="btn btn-primary text-xs py-2 px-3.5 flex-1 justify-center font-extrabold"
                        >
                          Upload / Manage Images
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Visual Guide */}
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[--accent-line]">
                    <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent]">
                      // Easy Step-by-Step Admin Workflow
                    </div>
                    <h2
                      className="text-xl sm:text-2xl font-black text-[--text] mt-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      How to Update Your Portfolio in 3 Simple Steps
                    </h2>

                    <div className="grid md:grid-cols-3 gap-5 mt-5">
                      <div className="p-5 rounded-2xl bg-[--bg-2] border border-[--border] space-y-2">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-mono font-extrabold"
                          style={{
                            background: 'var(--accent-soft)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-line)',
                          }}
                        >
                          STEP 01 • UPLOAD IMAGES
                        </span>
                        <h3 className="text-base font-extrabold text-[--text]">
                          Upload Photos to <code className="font-mono text-[--accent]">images/</code>
                        </h3>
                        <p className="text-xs font-semibold text-[--text-muted] leading-relaxed">
                          Upload cover images, project screenshots, or your Hero portrait from your computer. They save directly into your project&apos;s <code className="font-mono">images/</code> folder.
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('media')}
                          className="text-xs font-mono font-extrabold text-[--accent] hover:underline pt-1 inline-block"
                        >
                          Go to Image Folder →
                        </button>
                      </div>

                      <div className="p-5 rounded-2xl bg-[--bg-2] border border-[--border] space-y-2">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-mono font-extrabold"
                          style={{
                            background: 'var(--accent-soft)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-line)',
                          }}
                        >
                          STEP 02 • WRITE &amp; EDIT CONTENT
                        </span>
                        <h3 className="text-base font-extrabold text-[--text]">
                          Use the Rich Text &amp; Markdown Editor
                        </h3>
                        <p className="text-xs font-semibold text-[--text-muted] leading-relaxed">
                          Write technical blog posts or project case studies with 1-click formatting buttons, Python/TS code blocks, embedded images, and side-by-side live preview.
                        </p>
                        <button
                          type="button"
                          onClick={openNewBlogModal}
                          className="text-xs font-mono font-extrabold text-[--accent] hover:underline pt-1 inline-block"
                        >
                          Open Rich Text Editor →
                        </button>
                      </div>

                      <div className="p-5 rounded-2xl bg-[--bg-2] border border-[--border] space-y-2">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-mono font-extrabold"
                          style={{
                            background: 'var(--accent-soft)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-line)',
                          }}
                        >
                          STEP 03 • MONITOR VISITORS &amp; SYNC
                        </span>
                        <h3 className="text-base font-extrabold text-[--text]">
                          Track Visitor IPs &amp; Export Database
                        </h3>
                        <p className="text-xs font-semibold text-[--text-muted] leading-relaxed">
                          Inspect real-time visitor IP addresses, City/Country locations, GPS coordinates, and devices, or download <code className="font-mono">local-db.json</code> for Vercel deployment.
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('visitors')}
                          className="text-xs font-mono font-extrabold text-[--accent] hover:underline pt-1 inline-block"
                        >
                          View Unique Visitors →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Preview: Recent Visitors + Recent Blogs */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-2xl border border-[--border] space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-[--text]">
                          🌍 Latest Unique Visitors (IP &amp; Location)
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('visitors')}
                          className="text-xs font-mono font-extrabold text-[--accent] hover:underline"
                        >
                          View All ({visitors.length}) →
                        </button>
                      </div>
                      <div className="space-y-2.5">
                        {visitors.slice(0, 4).map(v => (
                          <div
                            key={v.visitorId}
                            className="p-3.5 rounded-xl bg-[--bg-2] border border-[--border] flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="text-xs font-extrabold text-[--text] flex items-center gap-2">
                                <span>{flagEmoji(v.countryCode)}</span>
                                <span>
                                  {v.city}, {v.country}
                                </span>
                                <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-[--bg] border border-[--border] text-[--accent]">
                                  {v.ip}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono font-semibold text-[--text-muted] mt-1">
                                📍 {formatCoord(v.latitude, 23.8103)}°,{' '}
                                {formatCoord(v.longitude, 90.4125)}° • {v.deviceType} ({v.os})
                              </div>
                            </div>
                            <span className="text-xs font-mono font-extrabold text-[--accent]">
                              {v.visitCount || 1}x
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-[--border] space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-[--text]">
                          📝 Recent Technical Blog Posts
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('blogs')}
                          className="text-xs font-mono font-extrabold text-[--accent] hover:underline"
                        >
                          Manage All ({db.blogs.length}) →
                        </button>
                      </div>
                      <div className="space-y-2.5">
                        {db.blogs.slice(0, 4).map(b => (
                          <div
                            key={b.slug}
                            className="p-3.5 rounded-xl bg-[--bg-2] border border-[--border] flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-extrabold text-[--text] truncate">
                                {b.title}
                              </div>
                              <div className="text-[11px] font-mono font-semibold text-[--text-muted] mt-0.5">
                                {b.category} • {b.publishedAt}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => openEditBlogModal(b)}
                              className="btn btn-ghost text-xs py-1.5 px-3 font-mono font-bold flex-shrink-0"
                            >
                              Edit
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 1: BLOGS MANAGEMENT + RICH TEXT EDITOR + IMAGE UPLOAD
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'blogs' && (
                <div className="space-y-6">
                  {showBlogModal && (
                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[--accent-line] shadow-2xl">
                      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[--border]">
                        <div>
                          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent]">
                            // Rich Text &amp; Markdown Engineering Editor
                          </span>
                          <h3
                            className="text-xl font-extrabold text-[--text]"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {editingBlogSlug
                              ? `Edit Blog: ${blogForm.title}`
                              : 'Publish New Technical Blog Post'}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBlogModal(false)}
                          className="btn btn-ghost text-xs py-1.5 px-3 font-mono font-bold"
                        >
                          ✕ Close Editor
                        </button>
                      </div>

                      <form onSubmit={handleSaveBlog} className="space-y-5">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Article Title *
                            </label>
                            <input
                              type="text"
                              required
                              value={blogForm.title}
                              onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                              placeholder="e.g. Architecting Multi-Agent Systems in Production"
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              URL Slug (auto-generated if blank)
                            </label>
                            <input
                              type="text"
                              value={blogForm.slug}
                              onChange={e => setBlogForm({ ...blogForm, slug: e.target.value })}
                              placeholder="multi-agent-systems-production"
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Category
                            </label>
                            <select
                              value={blogForm.category}
                              onChange={e =>
                                setBlogForm({
                                  ...blogForm,
                                  category: e.target.value as BlogPost['category'],
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            >
                              <option value="Multi-Agent Systems">Multi-Agent Systems</option>
                              <option value="Advanced RAG">Advanced RAG</option>
                              <option value="LLM Architecture">LLM Architecture</option>
                              <option value="AI Evals & Guardrails">AI Evals &amp; Guardrails</option>
                              <option value="Production Python">Production Python</option>
                              <option value="Tool Calling & Agents">Tool Calling &amp; Agents</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Published Date
                            </label>
                            <input
                              type="text"
                              value={blogForm.publishedAt}
                              onChange={e =>
                                setBlogForm({ ...blogForm, publishedAt: e.target.value })
                              }
                              placeholder="Oct 2026"
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Reading Time
                            </label>
                            <input
                              type="text"
                              value={blogForm.readingTime}
                              onChange={e =>
                                setBlogForm({ ...blogForm, readingTime: e.target.value })
                              }
                              placeholder="9 min read"
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                        </div>

                        {/* Cover Image URL + Direct Upload to images/ folder */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Cover Image (URL or Upload to project images/ folder)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={blogForm.image}
                                onChange={e => setBlogForm({ ...blogForm, image: e.target.value })}
                                placeholder="/images/my-cover.png or https://..."
                                className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                              />
                              <label className="btn btn-primary text-xs py-2.5 px-3.5 cursor-pointer flex-shrink-0 font-bold">
                                {uploadingField === 'blog-cover'
                                  ? '⏳ Uploading...'
                                  : '📤 Upload Image'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const f = e.target.files?.[0]
                                    if (f) {
                                      uploadImageFile(f, 'blog-cover', url =>
                                        setBlogForm(prev => ({ ...prev, image: url }))
                                      )
                                    }
                                    e.target.value = ''
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Tags (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={blogForm.tagsText}
                              onChange={e => setBlogForm({ ...blogForm, tagsText: e.target.value })}
                              placeholder="LangGraph, Multi-Agent, Python, FastAPI"
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                            Tagline / Subtitle
                          </label>
                          <input
                            type="text"
                            value={blogForm.tagline}
                            onChange={e => setBlogForm({ ...blogForm, tagline: e.target.value })}
                            placeholder="Moving beyond naive autonomous loops to deterministic state-machine architectures."
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                            Short Excerpt / Summary *
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={blogForm.excerpt}
                            onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            placeholder="1-2 sentence summary shown on blog cards..."
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Executive Takeaways (one per line)
                            </label>
                            <textarea
                              rows={3}
                              value={blogForm.takeawaysText}
                              onChange={e =>
                                setBlogForm({ ...blogForm, takeawaysText: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Benchmark Metrics (Label: Value, one per line)
                            </label>
                            <textarea
                              rows={3}
                              value={blogForm.metricsText}
                              onChange={e =>
                                setBlogForm({ ...blogForm, metricsText: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                        </div>

                        {/* RICH TEXT & MARKDOWN EDITOR */}
                        <RichTextEditor
                          label="Full Article Body (Rich Text / Markdown / Code / Image Upload)"
                          value={blogForm.content}
                          onChange={content => setBlogForm({ ...blogForm, content })}
                          rows={16}
                        />

                        <div className="flex items-center justify-end gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowBlogModal(false)}
                            className="btn btn-ghost text-xs py-2.5 px-5 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary text-xs py-2.5 px-6 font-extrabold"
                          >
                            💾 Save &amp; Publish Blog Post
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Blog Posts Grid */}
                  <div className="grid xl:grid-cols-2 gap-4">
                    {db.blogs.map(blog => (
                      <div
                        key={blog.slug}
                        className="glass-card p-5 rounded-2xl border border-[--border] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[--accent-line] transition-all"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded"
                              style={{
                                background: 'var(--accent-soft)',
                                color: 'var(--accent)',
                                border: '1px solid var(--accent-line)',
                              }}
                            >
                              {blog.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-[--text-dim]">
                              {blog.publishedAt} • {blog.readingTime}
                            </span>
                          </div>
                          <h3
                            className="text-base font-extrabold text-[--text] truncate"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {blog.title}
                          </h3>
                          <p className="text-xs font-semibold text-[--text-muted] line-clamp-2">
                            {blog.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="btn btn-ghost text-xs py-1.5 px-3 font-mono font-bold"
                          >
                            View ↗
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditBlogModal(blog)}
                            className="btn btn-ghost text-xs py-1.5 px-3 font-mono font-extrabold"
                            style={{
                              borderColor: 'var(--accent-line)',
                              color: 'var(--accent)',
                            }}
                          >
                            Edit in Rich Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlog(blog.slug, blog.title)}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold"
                            style={{
                              background: 'rgb(239 68 68 / 0.12)',
                              color: '#dc2626',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 2: PROJECTS MANAGEMENT + RICH EDITOR + IMAGE UPLOAD
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {showProjectModal && (
                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[--accent-line] shadow-2xl">
                      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[--border]">
                        <h3
                          className="text-xl font-extrabold text-[--text]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {editingProjectId
                            ? `Edit Project: ${projectForm.title}`
                            : 'Add New Featured Project'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowProjectModal(false)}
                          className="btn btn-ghost text-xs py-1.5 px-3 font-bold"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="space-y-5">
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Project Title *
                            </label>
                            <input
                              type="text"
                              required
                              value={projectForm.title}
                              onChange={e =>
                                setProjectForm({ ...projectForm, title: e.target.value })
                              }
                              placeholder="e.g. Autonomous Enterprise RAG Copilot"
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Category &amp; Year
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={projectForm.category}
                                onChange={e =>
                                  setProjectForm({ ...projectForm, category: e.target.value })
                                }
                                placeholder="AI / LLM"
                                className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                              />
                              <input
                                type="text"
                                value={projectForm.year}
                                onChange={e =>
                                  setProjectForm({ ...projectForm, year: e.target.value })
                                }
                                placeholder="2026"
                                className="w-full px-3 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                            Tagline / Subtitle
                          </label>
                          <input
                            type="text"
                            value={projectForm.tagline}
                            onChange={e =>
                              setProjectForm({ ...projectForm, tagline: e.target.value })
                            }
                            placeholder="Multi-Agent LLM Orchestration & Hybrid Vector Search"
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                            Short Card Description *
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={projectForm.description}
                            onChange={e =>
                              setProjectForm({ ...projectForm, description: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                          />
                        </div>

                        {/* Rich Text Editor for Project Case Study */}
                        <RichTextEditor
                          label="Detailed Case Study Description (Rich Text & Markdown)"
                          value={projectForm.longDescription}
                          onChange={longDescription =>
                            setProjectForm({ ...projectForm, longDescription })
                          }
                          rows={8}
                        />

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Cover Image (URL or Upload to images/)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={projectForm.image}
                                onChange={e =>
                                  setProjectForm({ ...projectForm, image: e.target.value })
                                }
                                className="flex-1 px-3 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                              />
                              <label className="btn btn-primary text-xs py-2.5 px-3 cursor-pointer flex-shrink-0 font-bold">
                                {uploadingField === 'proj-cover' ? '⏳' : '📤 Upload'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const f = e.target.files?.[0]
                                    if (f) {
                                      uploadImageFile(f, 'proj-cover', url =>
                                        setProjectForm(prev => ({
                                          ...prev,
                                          image: url,
                                          galleryText: prev.galleryText
                                            ? `${url}\n${prev.galleryText}`
                                            : url,
                                        }))
                                      )
                                    }
                                    e.target.value = ''
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              GitHub URL
                            </label>
                            <input
                              type="text"
                              value={projectForm.github}
                              onChange={e =>
                                setProjectForm({ ...projectForm, github: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Live Demo URL
                            </label>
                            <input
                              type="text"
                              value={projectForm.live}
                              onChange={e =>
                                setProjectForm({ ...projectForm, live: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                            Tech Stack (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={projectForm.techText}
                            onChange={e =>
                              setProjectForm({ ...projectForm, techText: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Key Highlights (one per line)
                            </label>
                            <textarea
                              rows={3}
                              value={projectForm.highlightsText}
                              onChange={e =>
                                setProjectForm({ ...projectForm, highlightsText: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                              Metrics (Label: Value, one per line)
                            </label>
                            <textarea
                              rows={3}
                              value={projectForm.statsText}
                              onChange={e =>
                                setProjectForm({ ...projectForm, statsText: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowProjectModal(false)}
                            className="btn btn-ghost text-xs py-2.5 px-5 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary text-xs py-2.5 px-6 font-extrabold"
                          >
                            💾 Save Project
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {db.projects.map(proj => (
                      <div
                        key={proj.id}
                        className="glass-card p-5 rounded-2xl border border-[--border] flex flex-col justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded"
                              style={{
                                background: 'var(--accent-soft)',
                                color: 'var(--accent)',
                              }}
                            >
                              {proj.category} • {proj.year}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditProjectModal(proj)}
                                className="btn btn-ghost text-xs py-1 px-2.5 font-mono font-bold"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj.id, proj.title)}
                                className="px-2.5 py-1 rounded text-xs font-mono font-extrabold"
                                style={{
                                  background: 'rgb(239 68 68 / 0.12)',
                                  color: '#dc2626',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <h3
                            className="text-base font-extrabold text-[--text]"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {proj.title}
                          </h3>
                          <p className="text-xs font-semibold text-[--text-muted] mt-1 line-clamp-2">
                            {proj.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[--border]">
                          {proj.tech.slice(0, 6).map(t => (
                            <span
                              key={t}
                              className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-[--bg-2] text-[--text-muted]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 3: UNIQUE VISITORS & DEVICE LOCATIONS (IP + GEO + DEVICE)
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'visitors' && (
                <div className="space-y-6">
                  {/* Top KPI Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-card p-6 rounded-2xl border border-[--border]">
                      <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
                        Unique Visitors (IPs)
                      </div>
                      <div
                        className="text-4xl font-black mt-1"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                      >
                        {visitorStats.totalUnique}
                      </div>
                      <div className="text-xs font-semibold text-[--text-muted] mt-1">
                        Deduplicated by IP &amp; Fingerprint
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-[--border]">
                      <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
                        Total Page Sessions
                      </div>
                      <div
                        className="text-4xl font-black mt-1 text-[--text]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {visitorStats.totalPageViews}
                      </div>
                      <div className="text-xs font-semibold text-[--text-muted] mt-1">
                        Across portfolio &amp; engineering blogs
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-[--border]">
                      <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
                        Countries Reached
                      </div>
                      <div
                        className="text-4xl font-black mt-1 text-[--text]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {visitorStats.countries}
                      </div>
                      <div className="text-xs font-semibold text-[--text-muted] mt-1">
                        With GPS Lat/Lon &amp; ISP telemetry
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-[--border]">
                      <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--text-dim]">
                        Device Breakdown
                      </div>
                      <div
                        className="text-3xl font-black mt-1 text-[--text]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        💻 {visitorStats.desktopCount}{' '}
                        <span className="text-sm font-mono text-[--text-dim]">/</span> 📱{' '}
                        {visitorStats.mobileCount}
                      </div>
                      <div className="text-xs font-semibold text-[--text-muted] mt-1">
                        Desktop vs Mobile/Tablet
                      </div>
                    </div>
                  </div>

                  {/* Country Breakdown Bar + Search Filter */}
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="glass-card p-6 rounded-2xl border border-[--border]">
                      <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent] mb-3.5">
                        🌍 Top Visitor Locations
                      </div>
                      <div className="space-y-3">
                        {visitorStats.topCountries.slice(0, 5).map(c => {
                          const pct = Math.round(
                            (c.count / Math.max(1, visitorStats.totalUnique)) * 100
                          )
                          return (
                            <div key={c.country} className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-extrabold text-[--text]">
                                  {flagEmoji(c.code)} {c.country}
                                </span>
                                <span className="font-bold text-[--text-muted]">
                                  {c.count} visitor{c.count > 1 ? 's' : ''} ({pct}%)
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-[--bg-2] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${pct}%`,
                                    background: 'var(--accent)',
                                  }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-[--border] flex flex-col justify-between gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent]">
                            // Real-Time Visitor IP &amp; Geolocation Inspector
                          </div>
                          <p className="text-xs font-semibold text-[--text-muted] mt-1">
                            Every visitor is automatically logged with IP address, City/Country, GPS coordinates, ISP, OS, Browser, and visited pages.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSimulateVisitor}
                            className="btn btn-primary text-xs py-2 px-3.5 font-extrabold"
                          >
                            + Simulate Visitor
                          </button>
                          <button
                            type="button"
                            onClick={handleExportVisitorsCsv}
                            className="btn btn-ghost text-xs py-2 px-3.5 font-mono font-bold"
                          >
                            ⬇ CSV
                          </button>
                          <button
                            type="button"
                            onClick={fetchVisitors}
                            className="btn btn-ghost text-xs py-2 px-3.5 font-mono font-bold"
                          >
                            {loadingVisitors ? '⏳' : '↻ Refresh'}
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm('Reset visitor logs to default sample records?'))
                                return
                              const res = await fetch('/api/visitors', { method: 'DELETE' })
                              const data = await res.json()
                              if (data?.ok) {
                                setVisitors(data.visitors || [])
                                notify('info', 'Reset visitor telemetry logs.')
                              }
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-mono font-extrabold"
                            style={{
                              background: 'rgb(239 68 68 / 0.12)',
                              color: '#dc2626',
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={visitorSearch}
                          onChange={e => setVisitorSearch(e.target.value)}
                          placeholder="Search by IP address, city, country, ISP, OS, browser, or page..."
                          className="flex-1 min-w-[240px] px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                        <div className="flex items-center gap-1 bg-[--bg-2] p-1 rounded-xl border border-[--border]">
                          {(['All', 'Desktop', 'Mobile', 'Tablet'] as const).map(dev => (
                            <button
                              key={dev}
                              type="button"
                              onClick={() => setVisitorDeviceFilter(dev)}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold transition-all"
                              style={{
                                background:
                                  visitorDeviceFilter === dev ? 'var(--accent)' : 'transparent',
                                color:
                                  visitorDeviceFilter === dev
                                    ? 'var(--on-accent)'
                                    : 'var(--text)',
                              }}
                            >
                              {dev}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full-Bleed Unique Visitors Table */}
                  <div className="glass-card rounded-2xl border border-[--border] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr
                            className="border-b border-[--border] text-xs font-mono font-extrabold uppercase tracking-wider text-[--text]"
                            style={{ background: 'var(--bg-2)' }}
                          >
                            <th className="py-4 px-5">IP Address &amp; ISP</th>
                            <th className="py-4 px-5">Device Location (City / Country / GPS)</th>
                            <th className="py-4 px-5">Device, OS &amp; Browser</th>
                            <th className="py-4 px-5">Pages Visited</th>
                            <th className="py-4 px-5 text-center">Visits</th>
                            <th className="py-4 px-5">Last Active</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[--border] text-xs">
                          {filteredVisitors.map(v => (
                            <tr
                              key={v.visitorId}
                              className="hover:bg-[--bg-2]/60 transition-colors"
                            >
                              {/* IP + ISP */}
                              <td className="py-4 px-5 align-top">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs"
                                    style={{
                                      background: 'var(--accent-soft)',
                                      color: 'var(--accent)',
                                      border: '1.5px solid var(--accent-line)',
                                    }}
                                  >
                                    {v.ip}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(v.ip)
                                      setCopiedIp(v.ip)
                                      setTimeout(() => setCopiedIp(null), 1800)
                                    }}
                                    className="text-xs font-mono font-bold text-[--text-dim] hover:text-[--accent]"
                                    title="Copy IP Address"
                                  >
                                    {copiedIp === v.ip ? '✓' : '📋'}
                                  </button>
                                </div>
                                <div className="text-xs font-mono font-semibold text-[--text-muted] mt-1.5">
                                  ISP: {v.isp}
                                </div>
                                <div className="text-[11px] font-mono text-[--text-dim] mt-0.5">
                                  ID: {v.visitorId}
                                </div>
                              </td>

                              {/* Device Location */}
                              <td className="py-4 px-5 align-top">
                                <div className="font-extrabold text-[--text] flex items-center gap-1.5 text-sm">
                                  <span>{flagEmoji(v.countryCode)}</span>
                                  <span>
                                    {v.city}, {v.region}
                                  </span>
                                </div>
                                <div className="text-xs font-extrabold text-[--accent] mt-0.5">
                                  {v.country} ({v.countryCode})
                                </div>
                                <div className="text-xs font-mono font-semibold text-[--text-muted] mt-1">
                                  📍 {formatCoord(v.latitude, 23.8103)}°,{' '}
                                  {formatCoord(v.longitude, 90.4125)}° • 🕒 {v.timezone}
                                </div>
                              </td>

                              {/* Device / OS / Browser */}
                              <td className="py-4 px-5 align-top">
                                <div className="font-extrabold text-[--text] flex items-center gap-1.5 text-sm">
                                  <span>
                                    {v.deviceType === 'Mobile'
                                      ? '📱'
                                      : v.deviceType === 'Tablet'
                                      ? '📟'
                                      : '💻'}
                                  </span>
                                  <span>
                                    {v.deviceType} • {v.os}
                                  </span>
                                </div>
                                <div className="text-xs font-mono font-semibold text-[--text-muted] mt-1">
                                  🌐 {v.browser} • 🖥️ {v.screen}
                                </div>
                                <div className="text-[11px] font-mono text-[--text-dim] mt-0.5">
                                  Ref: {v.referrer || 'Direct'}
                                </div>
                              </td>

                              {/* Pages Visited */}
                              <td className="py-4 px-5 align-top">
                                <div className="flex flex-wrap gap-1.5 max-w-xs">
                                  {safePages(v.pagesVisited).map(p => (
                                    <span
                                      key={p}
                                      className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[--bg-2] border border-[--border] text-[--text]"
                                    >
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </td>

                              {/* Visit Count */}
                              <td className="py-4 px-5 align-top text-center">
                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-[--bg-2] border border-[--border] text-[--accent]">
                                  {v.visitCount || 1}x
                                </span>
                              </td>

                              {/* Timestamps */}
                              <td className="py-4 px-5 align-top font-mono text-xs text-[--text-muted]">
                                <div className="text-[--text] font-extrabold">
                                  {new Date(v.lastActive).toLocaleString()}
                                </div>
                                <div className="text-[11px] font-semibold text-[--text-dim] mt-1">
                                  First: {new Date(v.firstSeen).toLocaleDateString()}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 4: MEDIA & PROJECT IMAGE FOLDER (`images/`)
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[--accent-line]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent]">
                          // Project Image Folder Manager (`images/` &amp; `public/images/`)
                        </span>
                        <h2
                          className="text-xl font-extrabold text-[--text] mt-1"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          Upload &amp; Manage Portfolio Images
                        </h2>
                        <p className="text-xs font-semibold text-[--text-muted] mt-1">
                          Images uploaded here are automatically saved into your project&apos;s{' '}
                          <code className="px-1.5 py-0.5 rounded bg-[--bg-2] text-[--accent] font-mono font-bold">
                            images/
                          </code>{' '}
                          folder and served immediately at{' '}
                          <code className="px-1.5 py-0.5 rounded bg-[--bg-2] text-[--accent] font-mono font-bold">
                            /images/&lt;filename&gt;
                          </code>
                          .
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="btn btn-primary text-xs py-3 px-5 font-extrabold cursor-pointer">
                          {uploadingField === 'media-library'
                            ? '⏳ Saving to images/...'
                            : '📤 Upload New Image to images/ Folder'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) {
                                uploadImageFile(file, 'media-library', () => {})
                              }
                              e.target.value = ''
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={fetchMediaLibrary}
                          className="btn btn-ghost text-xs py-3 px-4 font-mono font-bold"
                        >
                          {loadingMedia ? '⏳' : '↻ Refresh'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image Gallery Grid */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {mediaImages.map(img => (
                      <div
                        key={img.url}
                        className="glass-card rounded-2xl border border-[--border] overflow-hidden flex flex-col justify-between group"
                      >
                        <div className="relative h-48 w-full bg-[--bg-2] overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <div
                              className="text-xs font-extrabold text-[--text] truncate"
                              title={img.name}
                            >
                              {img.name}
                            </div>
                            <div className="text-xs font-mono font-bold text-[--accent] truncate mt-0.5">
                              {img.url}
                            </div>
                            <div className="text-[11px] font-mono font-semibold text-[--text-dim] mt-0.5">
                              {(img.size / 1024).toFixed(1)} KB
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[--border]">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(img.url)
                                setCopiedUrl(img.url)
                                setTimeout(() => setCopiedUrl(null), 2000)
                                notify('info', `Copied image path: ${img.url}`)
                              }}
                              className="btn btn-ghost text-xs py-1.5 px-2.5 justify-center font-mono font-bold"
                            >
                              {copiedUrl === img.url ? '✓ Copied!' : '📋 Copy Path'}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await updateDb(prev => ({
                                  ...prev,
                                  profile: {
                                    ...prev.profile,
                                    avatarImage: img.url,
                                  },
                                }))
                                notify(
                                  'success',
                                  `Set "${img.name}" as Hero Live Orbit Profile Image!`
                                )
                              }}
                              className="btn btn-primary text-xs py-1.5 px-2.5 justify-center font-mono font-bold"
                            >
                              👤 Set Hero Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 5: PROFILE, HERO AVATAR UPLOAD & CONTACT EDITOR
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'profile' && (
                <form
                  onSubmit={handleSaveProfile}
                  className="glass-card p-6 sm:p-8 rounded-3xl border border-[--border] space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[--border]">
                    <div>
                      <h2
                        className="text-xl font-extrabold text-[--text]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        Profile, Live Hero Avatar &amp; Contact Information
                      </h2>
                      <p className="text-xs font-semibold text-[--text-muted] mt-0.5">
                        Update your Hero orbital portrait, name, taglines, bio, stats, and social links.
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary text-xs py-2.5 px-6 font-extrabold"
                    >
                      💾 Save Profile Changes
                    </button>
                  </div>

                  {/* Hero Live Orbit Profile Photo Upload Card */}
                  <div className="p-5 rounded-2xl border border-[--accent-line] bg-[--bg-2] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[--accent] flex-shrink-0 bg-[--bg]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profileForm.avatarImage || '/images/professional-mehedi.png'}
                          alt="Hero Avatar Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent]">
                          // Live Moving Hero Profile Portrait
                        </span>
                        <h3 className="text-base font-extrabold text-[--text]">
                          Header Profile Image (360° Orbital Animation)
                        </h3>
                        <p className="text-xs font-semibold text-[--text-muted] mt-0.5">
                          Current path:{' '}
                          <code className="font-mono font-bold text-[--accent]">
                            {profileForm.avatarImage || '/images/professional-mehedi.png'}
                          </code>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                      <input
                        type="text"
                        value={profileForm.avatarImage || '/images/professional-mehedi.png'}
                        onChange={e =>
                          setProfileForm({ ...profileForm, avatarImage: e.target.value })
                        }
                        placeholder="/images/professional-mehedi.png"
                        className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-[--bg] border border-[--border] text-[--text] min-w-[220px]"
                      />
                      <label className="btn btn-primary text-xs py-2.5 px-4 font-extrabold cursor-pointer">
                        {uploadingField === 'hero-avatar'
                          ? '⏳ Uploading...'
                          : '📤 Upload New Hero Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const f = e.target.files?.[0]
                            if (f) {
                              uploadImageFile(f, 'hero-avatar', url =>
                                setProfileForm(prev => ({ ...prev, avatarImage: url }))
                              )
                            }
                            e.target.value = ''
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                        First Name (Hero Headline)
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={e =>
                          setProfileForm({ ...profileForm, firstName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                        Last Name (Hero Gradient)
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={e =>
                          setProfileForm({ ...profileForm, lastName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                        Hero Status Pill Badge
                      </label>
                      <input
                        type="text"
                        value={profileForm.heroBadge}
                        onChange={e =>
                          setProfileForm({ ...profileForm, heroBadge: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                        Hero Italic Subtitle
                      </label>
                      <input
                        type="text"
                        value={profileForm.heroSubtitle}
                        onChange={e =>
                          setProfileForm({ ...profileForm, heroSubtitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                      Hero Main Bio Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.heroBio}
                      onChange={e => setProfileForm({ ...profileForm, heroBio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                        Typewriter Roles (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={rolesText}
                        onChange={e => setRolesText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                        Navbar Taglines (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={taglinesText}
                        onChange={e => setTaglinesText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                        Hero KPI Stats (Label: Value)
                      </label>
                      <textarea
                        rows={4}
                        value={statsText}
                        onChange={e => setStatsText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[--border]">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <h3 className="text-sm font-mono font-extrabold uppercase tracking-wider text-[--accent]">
                        About Section &amp; Portrait Image
                      </h3>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={profileForm.aboutImage}
                          onChange={e =>
                            setProfileForm({ ...profileForm, aboutImage: e.target.value })
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                        <label className="btn btn-ghost text-xs py-1.5 px-3 cursor-pointer font-mono font-bold">
                          {uploadingField === 'about-img' ? '⏳' : '📤 Upload About Image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0]
                              if (f) {
                                uploadImageFile(f, 'about-img', url =>
                                  setProfileForm(prev => ({ ...prev, aboutImage: url }))
                                )
                              }
                              e.target.value = ''
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                          About Paragraph 1
                        </label>
                        <textarea
                          rows={3}
                          value={profileForm.aboutBio1}
                          onChange={e =>
                            setProfileForm({ ...profileForm, aboutBio1: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                          About Paragraph 2
                        </label>
                        <textarea
                          rows={3}
                          value={profileForm.aboutBio2}
                          onChange={e =>
                            setProfileForm({ ...profileForm, aboutBio2: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[--border]">
                    <h3 className="text-sm font-mono font-extrabold uppercase tracking-wider text-[--accent] mb-4">
                      Contact Details &amp; Social Links
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                          Public Email
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={e =>
                            setProfileForm({ ...profileForm, email: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                          Primary Phone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={profileForm.phonePrimary}
                          onChange={e =>
                            setProfileForm({ ...profileForm, phonePrimary: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={e =>
                            setProfileForm({ ...profileForm, location: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                          LinkedIn URL
                        </label>
                        <input
                          type="text"
                          value={profileForm.linkedin}
                          onChange={e =>
                            setProfileForm({ ...profileForm, linkedin: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                          GitHub URL
                        </label>
                        <input
                          type="text"
                          value={profileForm.github}
                          onChange={e =>
                            setProfileForm({ ...profileForm, github: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1.5">
                          X / Twitter URL
                        </label>
                        <input
                          type="text"
                          value={profileForm.twitter}
                          onChange={e =>
                            setProfileForm({ ...profileForm, twitter: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 6: WORK EXPERIENCE MANAGEMENT
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2
                        className="text-xl font-extrabold text-[--text]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        Manage Work Experience ({db.experiences.length})
                      </h2>
                      <p className="text-xs font-semibold text-[--text-muted]">
                        Add new roles or edit your career timeline.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openNewExpModal}
                      className="btn btn-primary text-xs py-2.5 px-5 font-extrabold"
                    >
                      + Add Experience Role
                    </button>
                  </div>

                  {showExpModal && (
                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[--accent-line]">
                      <h3 className="text-lg font-extrabold text-[--text] mb-4">
                        {editingExpId !== null ? 'Edit Experience' : 'Add Experience'}
                      </h3>
                      <form onSubmit={handleSaveExperience} className="space-y-4">
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1">
                              Role Title *
                            </label>
                            <input
                              type="text"
                              required
                              value={expForm.role}
                              onChange={e => setExpForm({ ...expForm, role: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1">
                              Company *
                            </label>
                            <input
                              type="text"
                              required
                              value={expForm.company}
                              onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1">
                              Period
                            </label>
                            <input
                              type="text"
                              value={expForm.period}
                              onChange={e => setExpForm({ ...expForm, period: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl text-sm font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1">
                              Type
                            </label>
                            <input
                              type="text"
                              value={expForm.type}
                              onChange={e => setExpForm({ ...expForm, type: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1">
                            Summary Description
                          </label>
                          <textarea
                            rows={2}
                            value={expForm.description}
                            onChange={e =>
                              setExpForm({ ...expForm, description: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl text-sm font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1">
                              Key Achievements (one per line)
                            </label>
                            <textarea
                              rows={4}
                              value={expForm.highlightsText}
                              onChange={e =>
                                setExpForm({ ...expForm, highlightsText: e.target.value })
                              }
                              className="w-full px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-extrabold uppercase text-[--text] mb-1">
                              Tech Stack (comma-separated)
                            </label>
                            <textarea
                              rows={4}
                              value={expForm.stackText}
                              onChange={e =>
                                setExpForm({ ...expForm, stackText: e.target.value })
                              }
                              className="w-full px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowExpModal(false)}
                            className="btn btn-ghost text-xs py-2 px-4 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary text-xs py-2 px-5 font-extrabold"
                          >
                            Save Experience
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-3">
                    {db.experiences.map(exp => (
                      <div
                        key={exp.id}
                        className="glass-card p-5 rounded-2xl border border-[--border] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="text-xs font-mono text-[--accent] font-extrabold">
                            {exp.period} • {exp.type}
                          </div>
                          <h3 className="text-base font-extrabold text-[--text]">
                            {exp.role} — <span className="text-[--text-muted]">{exp.company}</span>
                          </h3>
                          <p className="text-xs font-semibold text-[--text-muted] mt-1 line-clamp-2">
                            {exp.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditExpModal(exp)}
                            className="btn btn-ghost text-xs py-1.5 px-3 font-mono font-bold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExperience(exp.id, exp.role)}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold"
                            style={{
                              background: 'rgb(239 68 68 / 0.12)',
                              color: '#dc2626',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 7: EDUCATION & CERTIFICATIONS
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'education' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-3xl border border-[--border] space-y-5">
                    <h3 className="text-lg font-extrabold text-[--text]">
                      🎓 Academic Degrees ({db.education.length})
                    </h3>
                    <form onSubmit={handleAddEducation} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Degree (e.g. M.Sc. in CS)"
                          value={eduForm.degree}
                          onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                          className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                        <input
                          type="text"
                          placeholder="Period (e.g. 2022 - 2024)"
                          value={eduForm.period}
                          onChange={e => setEduForm({ ...eduForm, period: e.target.value })}
                          className="px-3 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Institution Name"
                        value={eduForm.institution}
                        onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={eduForm.field}
                        onChange={e => setEduForm({ ...eduForm, field: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description / Honors"
                        value={eduForm.desc}
                        onChange={e => setEduForm({ ...eduForm, desc: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary text-xs py-2 px-4 font-extrabold"
                      >
                        + Add Degree
                      </button>
                    </form>

                    <div className="space-y-2.5 pt-3 border-t border-[--border]">
                      {db.education.map((ed, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-[--bg-2] border border-[--border] flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-[--text]">{ed.degree}</div>
                            <div className="text-xs font-mono font-semibold text-[--text-muted]">
                              {ed.institution} • {ed.period}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteEducation(i)}
                            className="text-xs font-mono font-extrabold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border border-[--border] space-y-5">
                    <h3 className="text-lg font-extrabold text-[--text]">
                      🏅 Certifications ({db.certifications.length})
                    </h3>
                    <form onSubmit={handleAddCert} className="space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="Certification Name"
                        value={certForm.name}
                        onChange={e => setCertForm({ ...certForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Issuer (e.g. DeepLearning.AI)"
                          value={certForm.issuer}
                          onChange={e => setCertForm({ ...certForm, issuer: e.target.value })}
                          className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                        <input
                          type="text"
                          placeholder="Year (e.g. 2026)"
                          value={certForm.year}
                          onChange={e => setCertForm({ ...certForm, year: e.target.value })}
                          className="px-3 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary text-xs py-2 px-4 font-extrabold"
                      >
                        + Add Certification
                      </button>
                    </form>

                    <div className="space-y-2.5 pt-3 border-t border-[--border]">
                      {db.certifications.map((c, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-[--bg-2] border border-[--border] flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-[--text]">{c.name}</div>
                            <div className="text-xs font-mono font-semibold text-[--text-muted]">
                              {c.issuer} • {c.year}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCert(i)}
                            className="text-xs font-mono font-extrabold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 8: SKILLS & PROFICIENCIES
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'skills' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-3xl border border-[--border] space-y-5">
                    <h3 className="text-lg font-extrabold text-[--text]">
                      ⚡ Core Skill Bars ({db.proficiencies.length})
                    </h3>
                    <form onSubmit={handleAddProficiency} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Skill Name (e.g. LangGraph & Multi-Agent)"
                        value={newSkillName}
                        onChange={e => setNewSkillName(e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                      <input
                        type="number"
                        min={10}
                        max={100}
                        value={newSkillLevel}
                        onChange={e => setNewSkillLevel(Number(e.target.value))}
                        className="w-20 px-3 py-2.5 rounded-xl text-xs font-mono font-bold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary text-xs py-2 px-4 font-extrabold"
                      >
                        + Add
                      </button>
                    </form>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {db.proficiencies.map(p => (
                        <div
                          key={p.name}
                          className="p-3 rounded-xl bg-[--bg-2] border border-[--border] flex items-center justify-between"
                        >
                          <span className="text-xs font-extrabold text-[--text]">
                            {p.name} ({p.level}%)
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteProficiency(p.name)}
                            className="text-xs font-mono font-extrabold text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border border-[--border] space-y-5">
                    <h3 className="text-lg font-extrabold text-[--text]">
                      🗂️ Skill Category Cards ({db.skillCategories.length})
                    </h3>
                    <form onSubmit={handleAddSkillCategory} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Category Title (e.g. LLM & Agentic AI)"
                        value={newCatTitle}
                        onChange={e => setNewCatTitle(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                      <input
                        type="text"
                        placeholder="Comma-separated skills (LangGraph, CrewAI, AutoGen...)"
                        value={newCatSkills}
                        onChange={e => setNewCatSkills(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[--bg-2] border border-[--border] text-[--text]"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary text-xs py-2 px-4 font-extrabold"
                      >
                        + Add Category Card
                      </button>
                    </form>

                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                      {db.skillCategories.map(cat => (
                        <div
                          key={cat.title}
                          className="p-3.5 rounded-xl bg-[--bg-2] border border-[--border] flex items-start justify-between gap-3"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-[--text]">{cat.title}</div>
                            <div className="text-xs font-mono font-semibold text-[--text-muted] mt-1">
                              {cat.skills.join(' • ')}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSkillCategory(cat.title)}
                            className="text-xs font-mono font-extrabold text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  TAB 9: LOCAL DB & VERCEL DEPLOYMENT SYNC
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'database' && (
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[--border] space-y-6">
                  <div>
                    <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[--accent]">
                      // Zero-Config Local &amp; Vercel Database Architecture
                    </span>
                    <h2
                      className="text-xl font-extrabold text-[--text] mt-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Local Database &amp; Vercel Hosting Persistence
                    </h2>
                    <p className="text-sm font-semibold text-[--text-muted] mt-2 leading-relaxed">
                      Every change you make in this Admin Dashboard is saved in three layers simultaneously:
                    </p>
                    <ul className="mt-3 space-y-2 text-xs font-mono font-semibold text-[--text-muted]">
                      <li>
                        1. <strong className="text-[--text]">src/data/local-db.json</strong> — Written directly to disk when running locally (<code className="text-[--accent]">npm run dev</code>).
                      </li>
                      <li>
                        2. <strong className="text-[--text]">images/ &amp; public/images/</strong> — Uploaded images are saved directly into your project&apos;s <code className="text-[--accent]">images/</code> folder.
                      </li>
                      <li>
                        3. <strong className="text-[--text]">Browser localStorage + Serverless /tmp</strong> — Instant real-time persistence on Vercel without requiring paid external database keys.
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[--border]">
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="btn btn-primary text-xs py-3 px-5 font-extrabold"
                    >
                      ⬇ Download local-db.json
                    </button>

                    <label className="btn btn-ghost text-xs py-3 px-5 font-mono font-bold cursor-pointer">
                      📂 Import local-db.json
                      <input
                        type="file"
                        accept="application/json"
                        onChange={handleImportJson}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            'Reset all portfolio data back to factory defaults?'
                          )
                        )
                          return
                        await resetToDefaults({
                          email: DEFAULT_ADMIN_EMAIL,
                          password: DEFAULT_ADMIN_PASS,
                        })
                        notify('info', 'Database reset to default portfolio content.')
                      }}
                      className="px-4 py-3 rounded-xl text-xs font-mono font-extrabold ml-auto"
                      style={{
                        background: 'rgb(239 68 68 / 0.14)',
                        border: '1.5px solid rgb(239 68 68 / 0.4)',
                        color: '#dc2626',
                      }}
                    >
                      ⚠️ Reset to Factory Defaults
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  )
}
