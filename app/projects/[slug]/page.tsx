import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Home, ArrowLeft, CheckCircle } from 'lucide-react';
import PlotCard from '@/components/PlotCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://land.booky-la.cloud';

async function getProject(id: string) {
  try {
    const res = await fetch(`${API_URL}/public/projects`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const projects = await res.json();
    return Array.isArray(projects) ? projects.find((p: any) => p.id === id) || null : null;
  } catch {
    return null;
  }
}

async function getProjectPlots(projectId: string) {
  try {
    const res = await fetch(`${API_URL}/public/plots?projectId=${projectId}&limit=50`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const plots = data?.data ?? data;
    return Array.isArray(plots) ? plots : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) return { title: 'ໂຄງການ | ໄລຍະລາວ' };
  return {
    title: `${project.name} | ໄລຍະລາວ Marketplace`,
    description: project.description || `ດິນຈັດສັນໂຄງການ ${project.name} — ເບິ່ງລາຄາ ແລະ ຈອງ online`,
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, plots] = await Promise.all([
    getProject(params.slug),
    getProjectPlots(params.slug),
  ]);

  if (!project) notFound();

  const availablePlots = plots.filter((p: any) => p.status === 'available');
  const soldPlots = plots.filter((p: any) => p.status === 'sold' || p.status === 'booked');

  return (
    <div className="py-10">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/projects" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16} />
            ທຸກໂຄງການ
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{project.name}</span>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8">
          {/* Banner */}
          <div className="h-52 md:h-72 relative bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-8xl">🏘️</div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
              <h1 className="text-white text-2xl md:text-3xl font-bold">{project.name}</h1>
              {project.location && (
                <p className="text-white/80 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {project.location}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{plots.length}</p>
              <p className="text-sm text-gray-500">ທັງໝົດ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{availablePlots.length}</p>
              <p className="text-sm text-gray-500">ວ່າງ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{soldPlots.length}</p>
              <p className="text-sm text-gray-500">ຂາຍແລ້ວ</p>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="p-6">
              <h2 className="font-bold text-gray-900 mb-2">ກ່ຽວກັບໂຄງການ</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>

        {/* Plots Grid */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            ແປງດິນທີ່ວ່າງ ({availablePlots.length} ແປງ)
          </h2>
          <Link
            href={`/search?projectId=${project.id}`}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            ຟິລເຕີເພີ່ມ →
          </Link>
        </div>

        {availablePlots.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Home size={48} className="mx-auto mb-3 text-gray-200" />
            <p>ບໍ່ມີດິນທີ່ວ່າງໃນຂະນະນີ້</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {availablePlots.map((plot: any) => (
              <PlotCard
                key={plot.id}
                id={plot.id}
                plotNumber={plot.plotNumber}
                title={plot.title}
                status={plot.status}
                areaSqm={plot.areaSqm}
                totalPrice={plot.finalPrice || plot.totalPrice}
                projectName={project.name}
                imageUrl={plot.imageUrl}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">ສົນໃຈໂຄງການນີ້?</h3>
          <p className="text-gray-500 mb-5 text-sm">
            ຕິດຕໍ່ sales team ເພື່ອຮັບຂໍ້ມູນເພີ່ມເຕີມ ຫຼື ນັດຢ້ຽມຊົມໂຄງການ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+85620xxxxxxxx"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
            >
              ໂທຫາ Sales
            </a>
            <Link
              href={`/search?projectId=${project.id}`}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition text-sm"
            >
              ຊອກຫາດິນໃນໂຄງການ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
