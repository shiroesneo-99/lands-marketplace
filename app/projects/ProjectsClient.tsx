'use client';

import { useState, useMemo } from 'react';
import { Search, Grid, List } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';

interface Project {
  id: string;
  name: string;
  location?: string;
  totalPlots?: number;
  imageUrl?: string;
  isActive: boolean;
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.location && p.location.toLowerCase().includes(q))
    );
  }, [projects, search]);

  return (
    <>
      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="ຊອກຫາໂຄງການ ຫຼື ສະຖານທີ່..."
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">ບໍ່ພົບໂຄງການທີ່ຕ້ອງການ</p>
          <p className="text-sm mt-2">ລອງຊອກຫາດ້ວຍຄຳໃໝ່</p>
        </div>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
          }
        >
          {filtered.map((project) =>
            view === 'grid' ? (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                location={project.location}
                totalPlots={project.totalPlots}
                imageUrl={project.imageUrl}
              />
            ) : (
              <a
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition flex gap-4 items-center"
              >
                <div className="w-20 h-20 rounded-lg bg-green-50 flex items-center justify-center shrink-0 text-2xl">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    '🏘️'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{project.name}</h3>
                  {project.location && (
                    <p className="text-sm text-gray-500">{project.location}</p>
                  )}
                  {project.totalPlots && (
                    <p className="text-sm text-gray-600 mt-1">{project.totalPlots} ແປງດິນ</p>
                  )}
                </div>
                <span className="text-blue-600 font-semibold text-sm shrink-0">ເບິ່ງ →</span>
              </a>
            )
          )}
        </div>
      )}
    </>
  );
}
