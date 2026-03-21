import { notFound } from 'next/navigation';
import BookingClient from './BookingClient';
import { formatPrice, formatArea } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://land.booky-la.cloud';

async function getPlot(id: string) {
  try {
    const res = await fetch(`${API_URL}/public/plots/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BookingPage({ params }: { params: { id: string } }) {
  const plot = await getPlot(params.id);
  if (!plot) notFound();

  if (plot.status !== 'available') {
    return (
      <div className="container py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">ດິນນີ້ບໍ່ວ່າງ</h1>
          <p className="text-gray-500 mb-6">ດິນ {plot.plotNumber} ຖືກ{plot.status} ແລ້ວ</p>
          <a href="/search" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            ຊອກຫາດິນທີ່ວ່າງ
          </a>
        </div>
      </div>
    );
  }

  const plotInfo = {
    id: plot.id,
    plotNumber: plot.plotNumber,
    title: plot.title,
    areaSqm: plot.areaSqm,
    totalPrice: plot.finalPrice || plot.totalPrice,
    projectName: plot.project?.name,
    projectLocation: plot.project?.location,
    imageUrl: plot.imageUrl,
  };

  return <BookingClient plot={plotInfo} />;
}
