import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'ໄລຍະລາວ - ຊື້ ຂາຍ ໄລຍະ ອອນລາຍ | Lands Marketplace',
  description: 'ຊື້ ຂາຍ ດິນ ໃນລາວ ຜ່ານ web app. ລາຍການທີ່ຈະໄດ້ຂາຍ, ຄົ່າຍ, ເຮົາກໍາລັງສະໂຫລາດ 및ຟື້ນ ຂໍ້ມູນທີ່ຕົກລົງກັນກັບກັບ.',
  openGraph: {
    title: 'ໄລຍະລາວ Marketplace',
    description: 'Buy and sell land properties online in Laos',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="lo">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
