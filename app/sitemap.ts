import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://land.booky-la.cloud';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lands.booky-la.cloud';

async function fetchProjects() {
  try {
    const res = await fetch(`${API_URL}/public/projects`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchPlots() {
  try {
    const res = await fetch(`${API_URL}/public/plots?limit=500&page=1`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, plots] = await Promise.all([fetchProjects(), fetchPlots()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p: any) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const plotRoutes: MetadataRoute.Sitemap = plots.map((p: any) => ({
    url: `${SITE_URL}/plots/${p.id}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...plotRoutes];
}
