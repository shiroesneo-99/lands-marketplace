import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Search, TrendingUp, Shield, Clock } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import PlotCard from '@/components/PlotCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://land.booky-la.cloud';

async function getFeaturedProjects() {
  try {
    const res = await fetch(`${API_URL}/public/projects`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 4) : [];
  } catch {
    return [];
  }
}

async function getLatestPlots() {
  try {
    const res = await fetch(`${API_URL}/public/plots?limit=8&page=1`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const plots = data?.data ?? data;
    return Array.isArray(plots) ? plots.slice(0, 8) : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [projects, plots] = await Promise.all([getFeaturedProjects(), getLatestPlots()]);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-20 md:py-28">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            ຊອກຫາ ແລະ ຈອງດິນ
            <br />
            <span className="text-blue-200">ໃນລາວ ງ່າຍດາຍ</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            ດິນຈັດສັນຈາກໂຄງການຊັ້ນນຳ — ເລືອກດິນ, ກວດສອບລາຄາ, ຈອງ online ໄດ້ທັນທີ
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-3 md:p-4 shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="ຊອກຫາໂຄງການ, ເຂດ, ລາຄາ..."
                className="w-full text-gray-900 placeholder-gray-400 outline-none text-base"
              />
            </div>
            <Link
              href="/search"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center"
            >
              ຊອກຫາ
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            <Link href="/search?type=residential" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition">
              ທີ່ດິນທີ່ຢູ່ອາໄສ
            </Link>
            <Link href="/search?type=commercial" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition">
              ທີ່ດິນການຄ້າ
            </Link>
            <Link href="/projects" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition">
              ທຸກໂຄງການ
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border-b border-gray-100">
        <div className="container py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{projects.length}+</p>
              <p className="text-gray-500 text-sm">ໂຄງການ</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{plots.length}+</p>
              <p className="text-gray-500 text-sm">ແປງດິນ</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">100%</p>
              <p className="text-gray-500 text-sm">ຄວາມໄວ້ໃຈ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-14">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">ໂຄງການດ່ຽວ</h2>
                <p className="text-gray-500 mt-1">ໂຄງການທີ່ຖືກຄັດເລືອກໂດຍ editor</p>
              </div>
              <Link href="/projects" className="text-blue-600 hover:underline font-semibold text-sm">
                ເບິ່ງທັງໝົດ →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {projects.map((project: any) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  location={project.location}
                  totalPlots={project.totalPlots}
                  imageUrl={project.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Plots */}
      {plots.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">ແປງດິນຫຼ້າສຸດ</h2>
                <p className="text-gray-500 mt-1">ດິນທີ່ຈັດສັນ ຫາກໍ່ publish ເຂົ້າ marketplace</p>
              </div>
              <Link href="/search" className="text-blue-600 hover:underline font-semibold text-sm">
                ເບິ່ງທັງໝົດ →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {plots.map((plot: any) => (
                <PlotCard
                  key={plot.id}
                  id={plot.id}
                  plotNumber={plot.plotNumber}
                  title={plot.title}
                  status={plot.status}
                  areaSqm={plot.areaSqm}
                  totalPrice={plot.finalPrice || plot.totalPrice}
                  projectName={plot.project?.name}
                  imageUrl={plot.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-14 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">ຂັ້ນຕອນການຈອງ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1. ຊອກຫາດິນ</h3>
              <p className="text-gray-500 text-sm">Filter ຕາມລາຄາ, ຂະໜາດ, ໂຄງການ ແລະ ສະຖານທີ່</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">2. ກວດລາຄາ ແລະ ຂໍ້ມູນ</h3>
              <p className="text-gray-500 text-sm">ເບິ່ງຮູບ, ແຜນທີ່, ລາຍລະອຽດ ແລະ ເງື່ອນໄຂ</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. ຈອງ ແລະ ຊຳລະ</h3>
              <p className="text-gray-500 text-sm">ຈອງ online ໄດ້ທັນທີ — ທີມ sales ຈະຕິດຕໍ່ຄືນ</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">ພ້ອມຊອກຫາດິນຂອງທ່ານ?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            ດິນຈັດສັນຫຼາຍຮ້ອຍແປງ ທົ່ວລາວ — ລາຄາໂປ່ງໃສ, ຈອງໄດ້ online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
            >
              ຊອກຫາດິນ
            </Link>
            <Link
              href="/projects"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition"
            >
              ເບິ່ງໂຄງການ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
