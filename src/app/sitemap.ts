import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'

const BASE_URL = 'https://mehediswpu.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = projects.map(p => ({
    url: `${BASE_URL}/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectPages,
  ]
}
