import { Suspense } from 'react';
import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'ທຸກໂຄງການ | ໄລຍະລາວ Marketplace',
  description: 'ລາຍການໂຄງການດິນຈັດສັນທັງໝົດໃນລາວ — ເລືອກໂຄງການ, ກວດລາຄາ, ຈອງ online',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://land.booky-la.cloud';

async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/public/projects`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="py-10">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ທຸກໂຄງການ</h1>
          <p className="text-gray-500 mt-2">
            ພົບ <span className="font-semibold text-gray-700">{projects.length}</span> ໂຄງການ
          </p>
        </div>
        <ProjectsClient projects={projects} />
      </div>
    </div>
  );
}
