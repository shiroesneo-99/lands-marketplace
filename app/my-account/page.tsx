'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function MyAccountPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed || trimmed.length < 6) {
      setError('ກະລຸນາໃສ່ເບີໂທໃຫ້ຖືກຕ້ອງ');
      return;
    }
    setLoading(true);
    setError('');
    router.push(`/my-bookings?phone=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="container py-16 max-w-md mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone size={28} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ຕິດຕາມການຈອງ</h1>
        <p className="text-gray-500 text-sm">ກວດສອບສະຖານະການຈອງດ້ວຍເບີໂທຂອງທ່ານ</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ເບີໂທທີ່ໃຊ້ຈອງ
        </label>
        <input
          type="tel"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 mb-4"
          placeholder="+856 20 xxxx xxxx"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setError(''); }}
          autoFocus
        />

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !phone.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              ຄົ້ນຫາການຈອງ
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        ຂໍ້ມູນຈະສະແດງສະເພາະການຈອງທີ່ໃຊ້ເບີໂທນີ້ເທົ່ານັ້ນ
      </p>
    </div>
  );
}
