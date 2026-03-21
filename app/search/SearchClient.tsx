'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import PlotCard from '@/components/PlotCard';
import { publicApi } from '@/lib/api-client';

interface Project {
  id: string;
  name: string;
  location?: string;
}

interface Plot {
  id: string;
  plotNumber: string;
  title?: string;
  status: string;
  areaSqm?: string;
  totalPrice?: string;
  finalPrice?: string;
  project?: { name: string };
  imageUrl?: string;
}

interface Filters {
  projectId: string;
  search: string;
  priceMin: string;
  priceMax: string;
  sizeMin: string;
  sizeMax: string;
  direction: string;
  type: string;
  page: number;
}

const DIRECTIONS = ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'];
const PLOT_TYPES = ['residential', 'commercial', 'industrial', 'agricultural'];
const PLOT_TYPE_LABELS: Record<string, string> = {
  residential: 'ທີ່ດິນທີ່ຢູ່ອາໄສ',
  commercial: 'ທີ່ດິນການຄ້າ',
  industrial: 'ອຸດສາຫະກຳ',
  agricultural: 'ກະສິກຳ',
};

export default function SearchClient({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<Filters>({
    projectId: searchParams.get('projectId') || '',
    search: searchParams.get('search') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    sizeMin: searchParams.get('sizeMin') || '',
    sizeMax: searchParams.get('sizeMax') || '',
    direction: searchParams.get('direction') || '',
    type: searchParams.get('type') || '',
    page: Number(searchParams.get('page') || 1),
  });

  const fetchPlots = useCallback(async (f: Filters) => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page: f.page, limit: 12 };
      if (f.projectId) params.projectId = f.projectId;
      if (f.search) params.search = f.search;
      if (f.priceMin) params.priceMin = Number(f.priceMin);
      if (f.priceMax) params.priceMax = Number(f.priceMax);
      if (f.sizeMin) params.sizeMin = Number(f.sizeMin);
      if (f.sizeMax) params.sizeMax = Number(f.sizeMax);
      if (f.direction) params.direction = f.direction;
      if (f.type) params.type = f.type;

      const res = await publicApi.getPlots(params);
      const data = (res as any)?.data ?? res;
      setPlots(Array.isArray(data) ? data : []);
      setTotal((res as any)?.total ?? 0);
      setTotalPages((res as any)?.totalPages ?? 1);
    } catch {
      setPlots([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlots(filters);
  }, [filters, fetchPlots]);

  function updateFilter(key: keyof Filters, value: string | number) {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : prev.page }));
  }

  function clearFilters() {
    setFilters({
      projectId: '',
      search: '',
      priceMin: '',
      priceMax: '',
      sizeMin: '',
      sizeMax: '',
      direction: '',
      type: '',
      page: 1,
    });
  }

  const hasActiveFilters =
    filters.projectId ||
    filters.priceMin ||
    filters.priceMax ||
    filters.sizeMin ||
    filters.sizeMax ||
    filters.direction ||
    filters.type;

  return (
    <div className="py-10">
      <div className="container">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">ຊອກຫາດິນ</h1>

        {/* Search + Filter Toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="ຊອກຫາດ້ວຍໝາຍເລກດິນ, ຊື່..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-sm"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            {filters.search && (
              <button onClick={() => updateFilter('search', '')} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
              showFilters || hasActiveFilters
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
            }`}
          >
            <SlidersHorizontal size={16} />
            ຟິລເຕີ
            {hasActiveFilters && (
              <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ໂຄງການ</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white"
                  value={filters.projectId}
                  onChange={(e) => updateFilter('projectId', e.target.value)}
                >
                  <option value="">ທຸກໂຄງການ</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ລາຄາ (LAK)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="ຕ່ຳສຸດ"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={filters.priceMin}
                    onChange={(e) => updateFilter('priceMin', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="ສູງສຸດ"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={filters.priceMax}
                    onChange={(e) => updateFilter('priceMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Size Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ຂະໜາດ (m²)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="ຕ່ຳສຸດ"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={filters.sizeMin}
                    onChange={(e) => updateFilter('sizeMin', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="ສູງສຸດ"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={filters.sizeMax}
                    onChange={(e) => updateFilter('sizeMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Direction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ທິດທາງ</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={filters.direction}
                  onChange={(e) => updateFilter('direction', e.target.value)}
                >
                  <option value="">ທຸກທິດ</option>
                  {DIRECTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Plot Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ປະເພດດິນ</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                >
                  <option value="">ທຸກປະເພດ</option>
                  {PLOT_TYPES.map((t) => (
                    <option key={t} value={t}>{PLOT_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <X size={14} />
                ລ້າງ filter ທັງໝົດ
              </button>
            )}
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-gray-500 text-sm">
            {loading ? 'ກຳລັງໂຫຼດ...' : `ພົບ ${total} ແປງດິນ`}
          </p>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : plots.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={48} className="mx-auto mb-3 text-gray-200" />
            <p className="text-lg">ບໍ່ພົບດິນທີ່ຕ້ອງການ</p>
            <p className="text-sm mt-2">ລອງ filter ຢ່າງອື່ນ</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {plots.map((plot) => (
                <PlotCard
                  key={plot.id}
                  id={plot.id}
                  plotNumber={plot.plotNumber}
                  title={plot.title}
                  status={plot.status}
                  areaSqm={plot.areaSqm}
                  totalPrice={plot.finalPrice || plot.totalPrice}
                  projectName={(plot as any).project?.name}
                  imageUrl={(plot as any).imageUrl}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => updateFilter('page', filters.page - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  ← ກ່ອນໜ້າ
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  {filters.page} / {totalPages}
                </span>
                <button
                  disabled={filters.page >= totalPages}
                  onClick={() => updateFilter('page', filters.page + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  ຕໍ່ໄປ →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
