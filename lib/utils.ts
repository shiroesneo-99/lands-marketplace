export const formatPrice = (price: number | string | undefined) => {
  if (!price) return '₭0';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

export const formatArea = (area: number | string | undefined) => {
  if (!area) return '0 m²';
  const numArea = typeof area === 'string' ? parseFloat(area) : area;
  return `${numArea.toLocaleString()} m²`;
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'reserved':
      return 'bg-yellow-100 text-yellow-800';
    case 'booked':
      return 'bg-blue-100 text-blue-800';
    case 'sold':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    available: 'ວ່າງ',
    reserved: 'ສະຫຼັກໃຫ້ແລ້ວ',
    booked: 'ຈອງໄວ້ແລ້ວ',
    sold: 'ຂາຍແລ້ວ',
    pending_approval: 'ລໍຖ້າອະນຸມັດ',
    mortgaged: 'ຈຳນອງແລ້ວ',
    disputed: 'ມີການສົງໂຫວົ່',
    cancelled: 'ຍົກເລີກ',
  };
  return labels[status] || status;
};
