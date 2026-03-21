'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, FileText, MapPin } from 'lucide-react';
import { publicApi, type PublicBooking } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: 'ລໍຖ້າ', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'ຢືນຢັນແລ້ວ', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ຍົກເລີກ', color: 'bg-red-100 text-red-700' },
  completed: { label: 'ສຳເລັດ', color: 'bg-blue-100 text-blue-700' },
};

const METHOD_LABEL: Record<string, string> = {
  bcel_transfer: 'BCEL One Pay',
  bank_transfer: 'ໂອນທະນາຄານ',
  cash: 'ເງິນສົດ',
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.color}`}>
      {s.label}
    </span>
  );
}

function MyBookingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get('phone') || '';

  const [bookings, setBookings] = useState<PublicBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!phone) {
      router.replace('/my-account');
      return;
    }
    publicApi.getMyBookings(phone)
      .then(setBookings)
      .catch(() => setError('ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້ ກະລຸນາລອງໃໝ່'))
      .finally(() => setLoading(false));
  }, [phone, router]);

  return (
    <div className="container py-10 max-w-lg mx-auto">
      <Link
        href="/my-account"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm"
      >
        <ArrowLeft size={16} />
        ຄົ້ນຫາໃໝ່
      </Link>

      <h1 className="text-xl font-bold text-gray-900 mb-1">ການຈອງຂອງຂ້ອຍ</h1>
      <p className="text-sm text-gray-400 mb-6">{phone}</p>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-16">
          <FileText size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">ບໍ່ພົບການຈອງ</p>
          <p className="text-gray-400 text-sm mt-1">ກວດສອບວ່າເບີໂທຖືກຕ້ອງ ຫຼື ຍັງບໍ່ທັນໄດ້ຈອງ</p>
          <Link
            href="/search"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            ຊອກຫາດິນ
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{b.bookingNumber}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(b.createdAt).toLocaleDateString('lo-LA', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              {/* Plot & Project */}
              <div className="border-t border-gray-50 pt-3 space-y-2 text-sm">
                {b.plotNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">ດິນ</span>
                    <span className="font-semibold">{b.plotNumber}</span>
                  </div>
                )}
                {b.projectName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin size={12} />
                      ໂຄງການ
                    </span>
                    <span className="font-semibold text-right max-w-[60%]">{b.projectName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">ລາຄາ</span>
                  <span className="font-semibold">{formatPrice(b.agreedPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ມັດຈຳ</span>
                  <span className="font-bold text-blue-600">{formatPrice(b.depositAmount)}</span>
                </div>
                {b.depositMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">ວິທີຊຳລະ</span>
                    <span className="font-semibold">{METHOD_LABEL[b.depositMethod] || b.depositMethod}</span>
                  </div>
                )}
              </div>

              {/* Pending payment reminder */}
              {b.status === 'pending' && (
                <Link
                  href={`/booking/${b.id}?num=${encodeURIComponent(b.bookingNumber)}&deposit=${b.depositAmount}&method=${b.depositMethod || ''}&plot=${encodeURIComponent(b.plotNumber || '')}`}
                  className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition"
                >
                  <Clock size={15} />
                  ຂັ້ນຕອນຊຳລະ
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-center text-gray-400">ກຳລັງໂຫລດ...</div>}>
      <MyBookingsContent />
    </Suspense>
  );
}
