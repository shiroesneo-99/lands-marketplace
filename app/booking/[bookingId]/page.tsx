'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Copy, Phone, MessageCircle, Clock, Building2, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

const BCEL_ACCOUNT = {
  bank: 'ທະນາຄານ BCEL',
  accountNumber: '010-12-00-001234-501',
  accountName: 'ບໍລິສັດ ໄລຍະລາວ ຈຳກັດ',
};

const BANK_ACCOUNTS = [
  { bank: 'BCEL', number: '010-12-00-001234-501', name: 'ບໍລິສັດ ໄລຍະລາວ ຈຳກັດ' },
  { bank: 'LDB', number: '090-01-00-009876-401', name: 'ບໍລິສັດ ໄລຍະລາວ ຈຳກັດ' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-blue-600 hover:text-blue-800 transition"
      title="ຄັດລອກ"
    >
      {copied ? (
        <CheckCircle size={15} className="text-green-500" />
      ) : (
        <Copy size={15} />
      )}
    </button>
  );
}

function PaymentInstructions({ method, deposit }: { method: string; deposit: number }) {
  if (method === 'bcel_transfer') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">ໂອນເງິນມັດຈຳ <span className="font-bold text-blue-600">{formatPrice(deposit)}</span> ໄປໃສ່ບັນຊີດ່ຽວນີ້:</p>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">ທະນາຄານ</span>
            <span className="font-bold">{BCEL_ACCOUNT.bank}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">ເລກບັນຊີ</span>
            <span className="font-bold font-mono flex items-center">
              {BCEL_ACCOUNT.accountNumber}
              <CopyButton text={BCEL_ACCOUNT.accountNumber} />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">ຊື່ບັນຊີ</span>
            <span className="font-bold">{BCEL_ACCOUNT.accountName}</span>
          </div>
          <div className="flex justify-between items-center border-t border-blue-100 pt-3">
            <span className="text-gray-500 font-medium">ຈຳນວນ</span>
            <span className="font-bold text-blue-600 text-base flex items-center">
              {formatPrice(deposit)}
              <CopyButton text={String(deposit)} />
            </span>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-xs text-yellow-800">
          ຫຼັງໂອນ ກະລຸນາສົ່ງ slip ໃຫ້ທີມ sales ຜ່ານ WhatsApp ຫຼື ໂທໂດຍກົງ
        </div>
      </div>
    );
  }

  if (method === 'bank_transfer') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">ໂອນເງິນມັດຈຳ <span className="font-bold text-blue-600">{formatPrice(deposit)}</span> ໄປໃສ່ບັນຊີໃດໜຶ່ງ:</p>
        <div className="space-y-3">
          {BANK_ACCOUNTS.map((acc) => (
            <div key={acc.bank} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm space-y-2">
              <div className="font-bold text-gray-800">{acc.bank}</div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">ເລກບັນຊີ</span>
                <span className="font-mono font-bold flex items-center">
                  {acc.number}
                  <CopyButton text={acc.number} />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">ຊື່ບັນຊີ</span>
                <span className="font-bold">{acc.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-xs text-yellow-800">
          ຫຼັງໂອນ ກະລຸນາສົ່ງ slip ໃຫ້ທີມ sales ຜ່ານ WhatsApp ຫຼື ໂທໂດຍກົງ
        </div>
      </div>
    );
  }

  // cash
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm space-y-2">
      <p className="font-semibold text-gray-800">ຊຳລະເງິນສົດທີ່ຫ້ອງການ</p>
      <p className="text-gray-600">ທີມ sales ຈະຕິດຕໍ່ຫາທ່ານ ເພື່ອນັດຊຳລະເງິນ ພາຍໃນ 24 ຊ/ມ</p>
    </div>
  );
}

export default function BookingConfirmPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const bookingId = params.bookingId as string;
  const bookingNumber = searchParams.get('num') || 'N/A';
  const deposit = Number(searchParams.get('deposit') || 0);
  const method = searchParams.get('method') || 'bcel_transfer';
  const plotNumber = searchParams.get('plot') || '';

  const methodLabel: Record<string, string> = {
    bcel_transfer: 'BCEL One Pay',
    bank_transfer: 'ໂອນທະນາຄານ',
    cash: 'ເງິນສົດ',
  };

  return (
    <div className="container py-12 max-w-lg mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">ຈອງສຳເລັດ!</h1>
        <p className="text-gray-500 text-sm">ທີມ sales ຈະຕິດຕໍ່ຄືນຫາທ່ານ ພາຍໃນ 24 ຊ/ມ</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gray-400">ສະຫຼຸບການຈອງ</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">ໝາຍເລກການຈອງ</span>
            <span className="font-bold text-blue-600 flex items-center">
              {bookingNumber}
              <CopyButton text={bookingNumber} />
            </span>
          </div>
          {plotNumber && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ດິນ</span>
              <span className="font-semibold">{plotNumber}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-500">ມັດຈຳ</span>
            <span className="font-bold text-green-600">{formatPrice(deposit)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">ວິທີຊຳລະ</span>
            <span className="font-semibold">{methodLabel[method] || method}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
            <span className="text-gray-500 flex items-center gap-1">
              <Clock size={13} />
              ສະຖານະ
            </span>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">
              ລໍຖ້າຊຳລະ
            </span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">ຂັ້ນຕອນຊຳລະ</h2>
        <PaymentInstructions method={method} deposit={deposit} />
      </div>

      {/* Contact Sales */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">ຕິດຕໍ່ທີມ Sales</h2>
        <div className="flex gap-3">
          <a
            href="tel:+85620xxxxxxxx"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition text-sm"
          >
            <Phone size={16} />
            ໂທດ່ວນ
          </a>
          <a
            href="https://wa.me/85620xxxxxxxx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition text-sm"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          ກະລຸນາແຈ້ງ ໝາຍເລກການຈອງ <span className="font-bold text-gray-600">{bookingNumber}</span> ໃຫ້ທີມ sales
        </p>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-3 text-sm">ຂັ້ນຕອນຕໍ່ໄປ</h2>
        <ol className="space-y-2 text-sm text-gray-700">
          {[
            'ຊຳລະເງິນມັດຈຳຕາມວິທີທີ່ເລືອກ',
            'ສົ່ງ slip ໃຫ້ທີມ sales ທາງ WhatsApp',
            'ທີມ sales ຢືນຢັນ ແລະ ນັດລົງນາມສັນຍາ',
            'ຮັບເອກະສານສິດໃຊ້ດິນ',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
        >
          <Building2 size={16} />
          ຊອກຫາດິນເພີ່ມເຕີມ
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
