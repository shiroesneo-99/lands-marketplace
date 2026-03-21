import { Suspense } from 'react';
import SearchClient from './SearchClient';

export const metadata = {
  title: 'ຊອກຫາດິນ | ໄລຍະລາວ Marketplace',
  description: 'ຊອກຫາດິນຈັດສັນໃນລາວ — filter ຕາມລາຄາ, ຂະໜາດ, ໂຄງການ ແລະ ເຂດ',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://land.booky-la.cloud';

async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/public/projects`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function SearchPage() {
  const projects = await getProjects();
  return (
    <Suspense fallback={<div className="container py-10 text-gray-400">ກຳລັງໂຫຼດ...</div>}>
      <SearchClient projects={projects} />
    </Suspense>
  );
}
