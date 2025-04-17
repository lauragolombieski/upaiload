import './globals.css'
import { Inter } from 'next/font/google'
import {ClientProviders} from '@/components/clientProviders'
import {Header} from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <ClientProviders>
          <div className={inter.className}>
            <Header />
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}