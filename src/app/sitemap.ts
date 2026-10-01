import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'
import { blogs } from '@/data/blogs'

const BASE_URL = 'https://mehediswpu.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = projects.map(p => ({
    url: `${BASE_URL}/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const blogPages = blogs.map(b => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectPages,
    ...blogPages,
  ]
}
