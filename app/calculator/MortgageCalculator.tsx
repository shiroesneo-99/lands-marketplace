'use client';

import { useState, useMemo } from 'react';
import { formatPrice } from '@/lib/utils';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState('500000000');
  const [interestRate, setInterestRate] = useState('8');
  const [termMonths, setTermMonths] = useState('60');
  const [downPaymentPct, setDownPaymentPct] = useState('20');
  const [showTable, setShowTable] = useState(false);

  const calc = useMemo(() => {
    const principal = Number(loanAmount) * (1 - Number(downPaymentPct) / 100);
    const monthlyRate = Number(interestRate) / 100 / 12;
    const n = Number(termMonths);

    if (!principal || !n || n <= 0) return null;

    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = principal / n;
    } else {
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1);
    }

    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - principal;
    const downPayment = Number(loanAmount) * (Number(downPaymentPct) / 100);

    // Amortization table (first 12 months shown)
    const table: AmortizationRow[] = [];
    let balance = principal;
    for (let i = 1; i <= Math.min(n, 24); i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      table.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    return { monthlyPayment, totalPayment, totalInterest, downPayment, principal, table };
  }, [loanAmount, interestRate, termMonths, downPaymentPct]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">ປ້ອນຂໍ້ມູນ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ລາຄາດິນ (LAK)
            </label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              min={0}
              step={1000000}
            />
            <p className="text-xs text-gray-400 mt-1">{formatPrice(loanAmount)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ເງິນດາວ (%)
            </label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(e.target.value)}
              min={0}
              max={100}
            />
            {calc && (
              <p className="text-xs text-gray-400 mt-1">
                ເງິນດາວ: {formatPrice(calc.downPayment)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ດອກເບ້ຍ / ປີ (%)
            </label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              min={0}
              max={100}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ຈຳນວນງວດ (ເດືອນ)
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-400"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
            >
              <option value="12">12 ເດືອນ (1 ປີ)</option>
              <option value="24">24 ເດືອນ (2 ປີ)</option>
              <option value="36">36 ເດືອນ (3 ປີ)</option>
              <option value="60">60 ເດືອນ (5 ປີ)</option>
              <option value="84">84 ເດືອນ (7 ປີ)</option>
              <option value="120">120 ເດືອນ (10 ປີ)</option>
              <option value="180">180 ເດືອນ (15 ປີ)</option>
              <option value="240">240 ເດືອນ (20 ປີ)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {calc && (
        <>
          <div className="bg-blue-600 rounded-2xl p-6 text-white text-center">
            <p className="text-blue-200 text-sm mb-1">ຄ່າງວດ / ເດືອນ</p>
            <p className="text-4xl font-bold">{formatPrice(calc.monthlyPayment)}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">ຍອດກູ້</p>
              <p className="font-bold text-gray-900 text-sm">{formatPrice(calc.principal)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">ດອກເບ້ຍທັງໝົດ</p>
              <p className="font-bold text-red-500 text-sm">{formatPrice(calc.totalInterest)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">ຈ່າຍທັງໝົດ</p>
              <p className="font-bold text-gray-900 text-sm">{formatPrice(calc.totalPayment)}</p>
            </div>
          </div>

          {/* Amortization Toggle */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowTable(!showTable)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-gray-900">ຕາຕະລາງການຜ່ອນ (24 ງວດທຳອິດ)</span>
              <span className="text-gray-400 text-sm">{showTable ? '▲ ປິດ' : '▼ ເປີດ'}</span>
            </button>

            {showTable && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">ງວດ</th>
                      <th className="px-4 py-3 text-right">ຄ່າງວດ</th>
                      <th className="px-4 py-3 text-right">ຕົ້ນທຶນ</th>
                      <th className="px-4 py-3 text-right">ດອກເບ້ຍ</th>
                      <th className="px-4 py-3 text-right">ຍອດຄ້າງ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.table.map((row) => (
                      <tr key={row.month} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-700">{row.month}</td>
                        <td className="px-4 py-2.5 text-right font-medium">
                          {formatPrice(row.payment)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-green-600">
                          {formatPrice(row.principal)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-red-500">
                          {formatPrice(row.interest)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-500">
                          {formatPrice(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
