'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Home } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  name: string;
  location?: string;
  totalPlots?: number;
  imageUrl?: string;
}

export default function ProjectCard({
  id,
  name,
  location,
  totalPlots,
  imageUrl,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
        {/* Image */}
        <div className="relative h-40 bg-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50">
              <div className="text-4xl">🏘️</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{name}</h3>
          
          {location && (
            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
              <MapPin size={12} />
              {location}
            </p>
          )}

          {totalPlots && (
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
              <Home size={14} />
              <span>{totalPlots} ແປງດິນ</span>
            </div>
          )}

          {/* CTA */}
          <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm">
            ເບິ່ງແປງ
          </button>
        </div>
      </div>
    </Link>
  );
}
