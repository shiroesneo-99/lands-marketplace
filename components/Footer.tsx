'use client';

import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-bold text-white text-lg">ໄລຍະລາວ</span>
            </div>
            <p className="text-sm text-gray-400">
              ທາງເລືອກທີ່ງ່າຍທີ່ສຸດສໍາລັບການຊື້ ​​ຂາຍ ແລະ ເຊົ່າທີ່ດິນເພື່ອ​ຂອບຂ່າຍໃນ​ລາວ.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-white mb-4">ຜະລິດຕະພັນ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="hover:text-white transition">
                  ໂຄງການ
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition">
                  ຊອກຫາ
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-white transition">
                  ເຄື່ອງຄິດໄລ່
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">ບໍລິສັດ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  ກ່ຽວກັບ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  ບົດ​ຄວາມ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  ຕິດຕໍ່
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">ຕິດຕໍ່</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+85620xxxx" className="hover:text-white transition">
                  +856 20 xxxx xxxx
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@marketplace.com" className="hover:text-white transition">
                  info@marketplace.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 ໄລຍະລາວ Marketplace. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
