import MortgageCalculator from './MortgageCalculator';

export const metadata = {
  title: 'ເຄື່ອງຄຳນວນງວດຜ່ອນ | ໄລຍະລາວ Marketplace',
  description: 'ຄຳນວນຄ່າງວດຜ່ອນດິນ — ໃສ່ລາຄາ, ດອກເບ້ຍ, ລະຍະເວລາ ແລ້ວຮຽນຮູ້ຕາຕະລາງການຜ່ອນ',
};

export default function CalculatorPage() {
  return (
    <div className="py-10">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ເຄື່ອງຄຳນວນງວດຜ່ອນ</h1>
            <p className="text-gray-500 mt-2">
              ຄຳນວນຄ່າງວດຜ່ອນດິນ ຕາມລາຄາ, ດອກເບ້ຍ ແລະ ຈຳນວນງວດ
            </p>
          </div>
          <MortgageCalculator />
        </div>
      </div>
    </div>
  );
}
