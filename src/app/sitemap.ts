import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://monsoonbooks.com.np',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
      images: ['https://www.monsoonbooks.com.np/Monsoon_Books_Logo_Black_&_White.jpeg'],
    },
    {
      url: 'https://monsoonbooks.com.np/books',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://monsoonbooks.com.np/search',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://monsoonbooks.com.np/contact-us',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}