'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { formatPrice, formatArea, getStatusBadgeColor, getStatusLabel } from '@/lib/utils';

interface PlotCardProps {
  id: string;
  plotNumber: string;
  title?: string;
  status: string;
  areaSqm?: string;
  totalPrice?: string;
  projectName?: string;
  imageUrl?: string;
}

export default function PlotCard({
  id,
  plotNumber,
  title,
  status,
  areaSqm,
  totalPrice,
  projectName,
  imageUrl,
}: PlotCardProps) {
  return (
    <Link href={`/plots/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || plotNumber}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
              <div className="text-4xl font-bold text-blue-200">
                {plotNumber.slice(0, 1)}
              </div>
            </div>
          )}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(status)}`}>
            {getStatusLabel(status)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1">{title || plotNumber}</h3>
          {projectName && (
            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
              <MapPin size={12} />
              {projectName}
            </p>
          )}

          {/* Specs */}
          <div className="flex justify-between items-end mb-3">
            {areaSqm && (
              <div>
                <p className="text-xs text-gray-500">ຂະໜາດ</p>
                <p className="font-semibold text-gray-900">{formatArea(areaSqm)}</p>
              </div>
            )}
            {totalPrice && (
              <div>
                <p className="text-xs text-gray-500">ລາຄາ</p>
                <p className="font-semibold text-blue-600">{formatPrice(totalPrice)}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
            ກາ​ລົມ​ເພີ່ມ​ເຕີມ
          </button>
        </div>
      </div>
    </Link>
  );
}
