'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, ArrowRight, Loader2, User, CreditCard, Check } from 'lucide-react';
import { publicApi } from '@/lib/api-client';
import { formatPrice, formatArea } from '@/lib/utils';

interface PlotInfo {
  id: string;
  plotNumber: string;
  title?: string;
  areaSqm?: string;
  totalPrice?: string;
  projectName?: string;
  projectLocation?: string;
  imageUrl?: string;
}

interface CustomerForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  idCardNumber: string;
}

const PAYMENT_METHODS = [
  { value: 'bcel_transfer', label: 'BCEL — ໂອນຜ່ານ One Pay', icon: '🏦' },
  { value: 'bank_transfer', label: 'ໂອນທະນາຄານ', icon: '💳' },
  { value: 'cash', label: 'ຊຳລະເປັນເງິນສົດ', icon: '💵' },
];

const DEPOSIT_PERCENT = 0.1; // 10% deposit

export default function BookingClient({ plot }: { plot: PlotInfo }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState<CustomerForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idCardNumber: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('bcel_transfer');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = plot.totalPrice ? Number(plot.totalPrice) : 0;
  const depositAmount = Math.round(totalPrice * DEPOSIT_PERCENT);

  // Validation
  const step2Valid = customer.firstName.trim() && customer.phone.trim() && customer.phone.length >= 8;
  const step3Valid = paymentMethod && termsAccepted;

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const result = await publicApi.createBooking({
        plotId: plot.id,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          email: customer.email || undefined,
        },
        agreedPrice: totalPrice,
        depositAmount,
        depositMethod: paymentMethod,
      });
      const bookingId = result.booking?.id;
      const bookingNumber = result.booking?.bookingNumber || '';
      router.push(
        `/booking/${bookingId}?num=${encodeURIComponent(bookingNumber)}&deposit=${depositAmount}&method=${paymentMethod}&plot=${encodeURIComponent(plot.plotNumber)}`
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || 'ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່');
      setLoading(false);
    }
  }

  // Step indicator
  const steps = [
    { num: 1, label: 'ຢືນຢັນດິນ' },
    { num: 2, label: 'ຂໍ້ມູນລູກຄ້າ' },
    { num: 3, label: 'ການຊຳລະ' },
  ];

  return (
    <div className="py-10">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link
            href={`/plots/${plot.id}`}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm"
          >
            <ArrowLeft size={16} />
            ກັບໄປດິນ {plot.plotNumber}
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">ຈອງດິນ</h1>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    step > s.num
                      ? 'bg-green-500 text-white'
                      : step === s.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span
                  className={`text-sm hidden sm:inline ${
                    step === s.num ? 'font-semibold text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${step > s.num ? 'bg-green-400' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Plot Summary Card (always visible) */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-2xl overflow-hidden">
              {plot.imageUrl ? (
                <img src={plot.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                '🏡'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{plot.title || `ດິນ ${plot.plotNumber}`}</p>
              {plot.projectName && (
                <p className="text-sm text-gray-500">{plot.projectName}</p>
              )}
              <p className="text-blue-600 font-bold mt-1">{formatPrice(plot.totalPrice)}</p>
            </div>
          </div>

          {/* Step 1: Confirm Plot */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <CheckCircle size={20} className="text-blue-600" />
                ຢືນຢັນຂໍ້ມູນດິນ
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">ໝາຍເລກດິນ</span>
                  <span className="font-semibold">{plot.plotNumber}</span>
                </div>
                {plot.areaSqm && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">ຂະໜາດ</span>
                    <span className="font-semibold">{formatArea(plot.areaSqm)}</span>
                  </div>
                )}
                {plot.projectName && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">ໂຄງການ</span>
                    <span className="font-semibold">{plot.projectName}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">ລາຄາທັງໝົດ</span>
                  <span className="font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">ມັດຈຳ (10%)</span>
                  <span className="font-bold text-green-600">{formatPrice(depositAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                ຕໍ່ໄປ
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Customer Info */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                ຂໍ້ມູນລູກຄ້າ
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ຊື່ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                      placeholder="ຊື່"
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ນາມສະກຸນ</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                      placeholder="ນາມສະກຸນ"
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ເບີໂທ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="+856 20 xxxx xxxx"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ອີເມລ</label>
                  <input
                    type="email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="email@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ເລກບັດປະຊາຊົນ</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="(ທາງເລືອກ)"
                    value={customer.idCardNumber}
                    onChange={(e) => setCustomer({ ...customer, idCardNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  ກັບ
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!step2Valid}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  ຕໍ່ໄປ
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                ວິທີຊຳລະ
              </h2>

              <div className="space-y-3 mb-5">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === m.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{m.icon}</span>
                    <span className="font-medium text-gray-900">{m.label}</span>
                    {paymentMethod === m.value && (
                      <Check size={18} className="text-blue-600 ml-auto" />
                    )}
                  </label>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ລາຄາທັງໝົດ</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-700">ມັດຈຳ 10%</span>
                  <span className="text-blue-600 text-base">{formatPrice(depositAmount)}</span>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-600">
                  ຂ້ອຍຮັບຮູ້ ແລະ ຍອມຮັບ{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    ເງື່ອນໄຂ ແລະ ຂໍ້ຕົກລົງ
                  </Link>{' '}
                  ຂອງ ໄລຍະລາວ Marketplace
                </span>
              </label>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  ກັບ
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!step3Valid || loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      ກຳລັງດຳເນີນ...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      ຢືນຢັນການຈອງ
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
