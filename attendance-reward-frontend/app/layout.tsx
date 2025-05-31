import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stellar Eğitim Ödül Sistemi',
  description: 'Eğitime katılım gösteren kullanıcılara otomatik ödül veren Stellar DApp',
  keywords: ['Stellar', 'Soroban', 'DApp', 'Eğitim', 'Ödül', 'Blockchain'],
  authors: [{ name: 'Stellar Education Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-stellar-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">
                    Stellar Eğitim Ödül
                  </h1>
                </div>
                <div className="text-sm text-gray-400">
                  Powered by Soroban
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="text-center text-gray-400 text-sm">
                <p>© 2025 Stellar Eğitim Ödül Sistemi. Tüm hakları saklıdır.</p>
                <p className="mt-2">
                  Stellar Network üzerinde çalışan merkezi olmayan uygulama
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}