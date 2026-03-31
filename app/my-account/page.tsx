'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Loader2, ShieldCheck, KeyRound } from 'lucide-react';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://admins.kd-realestate.la';

type Step = 'phone' | 'otp' | 'done';

export default function MyAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState(''); // dev mode only

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed || trimmed.length < 6) {
      setError('ກະລຸນາໃສ່ເບີໂທໃຫ້ຖືກຕ້ອງ');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/public/my-bookings/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'ເກີດຂໍ້ຜິດພາດ'); return; }
      if (data.code) setDevCode(data.code); // dev mode
      setStep('otp');
    } catch {
      setError('ບໍ່ສາມາດເຊື່ອມຕໍ່ server ໄດ້');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('ກະລຸນາໃສ່ OTP 6 ຕົວເລກ');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/public/my-bookings/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone: phone.trim(), code: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'OTP ບໍ່ຖືກຕ້ອງ'); return; }
      router.push('/my-bookings');
    } catch {
      setError('ບໍ່ສາມາດ verify OTP ໄດ້');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-16 max-w-md mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {step === 'otp' ? <KeyRound size={28} className="text-blue-600" /> : <Phone size={28} className="text-blue-600" />}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 'otp' ? 'ໃສ່ລະຫັດ OTP' : 'ຕິດຕາມການຈອງ'}
        </h1>
        <p className="text-gray-500 text-sm">
          {step === 'otp'
            ? `ສົ່ງ OTP ໄປທີ່ ${phone} ແລ້ວ`
            : 'ກວດສອບສະຖານະການຈອງດ້ວຍ OTP ທາງ SMS'}
        </p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleRequestOtp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">ເບີໂທ</label>
          <input
            type="tel"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 mb-4"
            placeholder="020 XXXX XXXX"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading || !phone.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (<>ຮັບ OTP <ArrowRight size={18} /></>)}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">ລະຫັດ OTP (6 ຕົວ)</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center tracking-widest text-xl font-bold focus:outline-none focus:border-blue-400 mb-4"
            placeholder="_ _ _ _ _ _"
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
            autoFocus
          />
          {devCode && (
            <p className="text-amber-600 text-xs mb-3 text-center bg-amber-50 py-2 rounded-lg">
              Dev mode OTP: <strong>{devCode}</strong>
            </p>
          )}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (<><ShieldCheck size={18} />ຢືນຢັນ OTP</>)}
          </button>
          <button
            type="button"
            onClick={() => { setStep('phone'); setOtp(''); setError(''); setDevCode(''); }}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 py-2"
          >
            ← ປ່ຽນເບີ
          </button>
        </form>
      )}

      <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
        <ShieldCheck size={12} />
        ຂໍ້ມູນປອດໄພ — OTP ໝົດອາຍຸໃນ 5 ນາທີ
      </p>
    </div>
  );
}
