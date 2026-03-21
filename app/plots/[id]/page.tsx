import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Maximize2, Compass, Tag, Phone, CheckCircle } from 'lucide-react';
import { formatPrice, formatArea, getStatusBadgeColor, getStatusLabel } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://land.booky-la.cloud';

async function getPlot(id: string) {
  try {
    const res = await fetch(`${API_URL}/public/plots/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedPlots(projectId: string, currentId: string) {
  try {
    const res = await fetch(`${API_URL}/public/plots?projectId=${projectId}&limit=4`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const plots = data?.data ?? data;
    return Array.isArray(plots) ? plots.filter((p: any) => p.id !== currentId).slice(0, 3) : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const plot = await getPlot(params.id);
  if (!plot) return { title: 'ດິນ | ໄລຍະລາວ' };
  return {
    title: `ດິນ ${plot.plotNumber} | ໄລຍະລາວ Marketplace`,
    description: `ດິນ ${plot.plotNumber} ຂະໜາດ ${plot.areaSqm} m² — ລາຄາ ${plot.finalPrice || plot.totalPrice} LAK`,
    openGraph: {
      title: `ດິນ ${plot.plotNumber} — ${plot.project?.name || ''}`,
      description: `ຂະໜາດ ${plot.areaSqm} m² | ລາຄາ ${plot.finalPrice || plot.totalPrice} LAK`,
      images: plot.imageUrl ? [{ url: plot.imageUrl }] : [],
    },
  };
}

export default async function PlotDetailPage({ params }: { params: { id: string } }) {
  const plot = await getPlot(params.id);
  if (!plot) notFound();

  const relatedPlots = plot.projectId
    ? await getRelatedPlots(plot.projectId, plot.id)
    : [];

  const pricePerSqm =
    plot.areaSqm && (plot.finalPrice || plot.totalPrice)
      ? Number(plot.finalPrice || plot.totalPrice) / Number(plot.areaSqm)
      : null;

  const isAvailable = plot.status === 'available';

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `ດິນ ${plot.plotNumber}`,
    description: `ດິນຈັດສັນ ຂະໜາດ ${plot.areaSqm} m²`,
    offers: {
      '@type': 'Offer',
      price: plot.finalPrice || plot.totalPrice || 0,
      priceCurrency: 'LAK',
      availability: isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-10">
        <div className="container">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            {plot.projectId && (
              <>
                <Link href="/projects" className="hover:text-blue-600">ໂຄງການ</Link>
                <span>/</span>
                <Link href={`/projects/${plot.projectId}`} className="hover:text-blue-600">
                  {plot.project?.name || 'ໂຄງການ'}
                </Link>
                <span>/</span>
              </>
            )}
            <Link href="/search" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft size={14} />
              ຄືນໄປຊອກຫາ
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">ດິນ {plot.plotNumber}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="rounded-2xl overflow-hidden bg-gray-100 mb-6">
                {plot.imageUrl ? (
                  <img
                    src={plot.imageUrl}
                    alt={`ດິນ ${plot.plotNumber}`}
                    className="w-full h-72 md:h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-72 md:h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-center text-blue-300">
                      <div className="text-7xl mb-2">🏡</div>
                      <p className="text-sm">ດິນ {plot.plotNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Plot Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {plot.title || `ດິນ ${plot.plotNumber}`}
                    </h1>
                    {plot.project?.name && (
                      <p className="text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {plot.project.name}
                        {plot.project?.location && ` — ${plot.project.location}`}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusBadgeColor(plot.status)}`}
                  >
                    {getStatusLabel(plot.status)}
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="font-bold text-gray-900 mb-4">ລາຍລະອຽດດິນ</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {plot.areaSqm && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Maximize2 size={12} />
                        ຂະໜາດ
                      </p>
                      <p className="font-bold text-gray-900">{formatArea(plot.areaSqm)}</p>
                    </div>
                  )}
                  {plot.direction && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Compass size={12} />
                        ທິດທາງ
                      </p>
                      <p className="font-bold text-gray-900">{plot.direction}</p>
                    </div>
                  )}
                  {plot.plotType && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Tag size={12} />
                        ປະເພດ
                      </p>
                      <p className="font-bold text-gray-900 capitalize">{plot.plotType}</p>
                    </div>
                  )}
                  {plot.plotNumber && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">ໝາຍເລກດິນ</p>
                      <p className="font-bold text-gray-900">{plot.plotNumber}</p>
                    </div>
                  )}
                  {pricePerSqm && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">ລາຄາ/m²</p>
                      <p className="font-bold text-gray-900">{formatPrice(pricePerSqm)}</p>
                    </div>
                  )}
                  {plot.zone?.name && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">ໂຊນ</p>
                      <p className="font-bold text-gray-900">{plot.zone.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Why buy this plot */}
              <div className="bg-blue-50 rounded-2xl p-5 mb-6">
                <h2 className="font-bold text-gray-900 mb-3">ຂໍ້ດີ</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    ດິນຈາກໂຄງການທີ່ໄດ້ຮັບການຢັ້ງຢືນ — ເອກະສານຄົບຖ້ວນ
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    ຈອງ online ໄດ້ທັນທີ — ທີມ sales ຕິດຕໍ່ຄືນ 24 ຊ/ມ
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    ລາຄາໂປ່ງໃສ — ບໍ່ມີຄ່າດຳເນີນການລັບ
                  </li>
                </ul>
              </div>

              {/* Related Plots */}
              {relatedPlots.length > 0 && (
                <div>
                  <h2 className="font-bold text-gray-900 mb-4">ດິນໃກ້ຄຽງ</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedPlots.map((rp: any) => (
                      <Link
                        key={rp.id}
                        href={`/plots/${rp.id}`}
                        className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
                      >
                        <p className="font-semibold text-sm text-gray-900">ດິນ {rp.plotNumber}</p>
                        {rp.areaSqm && (
                          <p className="text-xs text-gray-500">{formatArea(rp.areaSqm)}</p>
                        )}
                        {(rp.finalPrice || rp.totalPrice) && (
                          <p className="text-sm font-bold text-blue-600 mt-1">
                            {formatPrice(rp.finalPrice || rp.totalPrice)}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Booking CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  {/* Price */}
                  <div className="mb-5 pb-5 border-b border-gray-100">
                    {(plot.finalPrice || plot.totalPrice) && (
                      <>
                        <p className="text-xs text-gray-500 mb-1">ລາຄາທັງໝົດ</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatPrice(plot.finalPrice || plot.totalPrice)}
                        </p>
                        {plot.pricePerSqm && (
                          <p className="text-sm text-gray-500 mt-1">
                            {formatPrice(plot.pricePerSqm)} / m²
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  {isAvailable ? (
                    <>
                      <Link
                        href={`/plots/${plot.id}/book`}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition text-center block mb-3"
                      >
                        ຈອງດິນນີ້
                      </Link>
                      <a
                        href="tel:+85620xxxxxxxx"
                        className="w-full border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition text-center flex items-center justify-center gap-2"
                      >
                        <Phone size={16} />
                        ໂທຫາ Sales
                      </a>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-gray-500 font-medium">ດິນນີ້ {getStatusLabel(plot.status)} ແລ້ວ</p>
                      <Link
                        href="/search"
                        className="text-blue-600 text-sm hover:underline mt-2 block"
                      >
                        ຊອກຫາດິນທີ່ວ່າງ →
                      </Link>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm">
                    {plot.areaSqm && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ຂະໜາດ</span>
                        <span className="font-medium">{formatArea(plot.areaSqm)}</span>
                      </div>
                    )}
                    {plot.plotNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ໝາຍເລກ</span>
                        <span className="font-medium">{plot.plotNumber}</span>
                      </div>
                    )}
                    {plot.direction && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ທິດ</span>
                        <span className="font-medium">{plot.direction}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
