import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Fenix Car Hire - For All Your Rental Needs in Eswatini',
  description: 'Fenix Car Hire: Reliable car rentals in Mbabane, Eswatini. Toyota sedans, SUVs, double-cab pickups. Airport transfers, self-drive, chauffeur services.',
  openGraph: {
    title: 'Fenix Car Hire',
    description: 'Reliable car rentals in Eswatini',
    url: 'https://fenixcarhire.com',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a2e5e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
