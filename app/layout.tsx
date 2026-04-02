import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import PWAProvider from '@/components/PWAProvider'
import CompareBar from '@/components/CompareBar'

const phetsarath = localFont({
  src: [
    { path: '../public/fonts/Phetsarath-OT.ttf',      weight: '400', style: 'normal' },
    { path: '../public/fonts/Phetsarath-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Phetsarath-Bold.ttf',    weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-phetsarath',
})

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://admins.kd-realestate.la';

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/public/settings`, { next: { revalidate: 3600 } });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      const s = await res.json();
      const name = s.marketplaceName || 'KD Real Estate';
      const tagline = s.marketplaceTagline || 'ຊື້ ຂາຍ ດິນຈັດສັນໃນລາວ ງ່າຍດາຍ ໂປ່ງໃສ';
      return {
        title: `${name} — ${tagline}`,
        description: tagline,
        manifest: '/manifest.webmanifest',
        appleWebApp: { capable: true, statusBarStyle: 'default', title: name },
        openGraph: {
          title: name,
          description: tagline,
          type: 'website',
          ...(s.marketplaceLogoUrl ? { images: [{ url: s.marketplaceLogoUrl }] } : {}),
        },
      };
    }
  } catch {
    // fall through to defaults
  }
  return {
    title: 'KD Real Estate — ຊື້ ຂາຍ ດິນຈັດສັນໃນລາວ',
    description: 'ຊື້ ຂາຍ ດິນຈັດສັນ ໂຄງການຊັ້ນນຳ ໃນລາວ. ລາຄາໂປ່ງໃສ ຈອງ online ໄດ້ທັນທີ.',
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, statusBarStyle: 'default', title: 'KD Real Estate' },
    openGraph: {
      title: 'KD Real Estate',
      description: 'ຊື້ ຂາຍ ດິນຈັດສັນ ໂຄງການຊັ້ນນຳ ໃນລາວ',
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="lo" className={phetsarath.variable}>
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <CompareBar />
        <PWAProvider />
      </body>
    </html>
  )
}
