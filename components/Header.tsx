'use client';

import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">ໄລຍະລາວ</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8">
          <Link href="/projects" className="text-gray-700 hover:text-blue-600">
            ໂຄງການ
          </Link>
          <Link href="/search" className="text-gray-700 hover:text-blue-600">
            ຊອກຫາ
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            ກ່ຽວກັບ
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-gray-700 hover:text-blue-600">
            <Search size={20} />
          </Link>
          <Link href="/my-account" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <User size={20} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden border-t border-gray-200 py-4">
          <div className="container flex flex-col gap-3">
            <Link href="/projects" className="text-gray-700 hover:text-blue-600 py-2">
              ໂຄງການ
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-blue-600 py-2">
              ຊອກຫາ
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 py-2">
              ກ່ຽວກັບ
            </Link>
            <Link href="/my-account" className="text-gray-700 hover:text-blue-600 py-2">
              ການຈອງຂອງຂ້ອຍ
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
