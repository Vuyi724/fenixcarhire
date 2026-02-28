import type { Metadata, Viewport } from 'next'
import './globals.css'

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
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
