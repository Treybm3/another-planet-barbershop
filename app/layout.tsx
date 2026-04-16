import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['300', '400', '500', '600', '700', '800', '900'] })

export const metadata: Metadata = {
  title: "Kris Professional Cuts | Barbershop in Lansing, Michigan",
  description: "Premium barbershop in Lansing, Michigan. Precision fades, clean cuts, beard trims and more. Book your appointment today with Kris Professional Cuts.",
  keywords: "barbershop lansing michigan, fade haircut lansing, barber near me, professional cuts, beard trim, kris professional cuts",
  openGraph: {
    title: "Kris Professional Cuts | Barbershop in Lansing, Michigan",
    description: "Precision fades, clean cuts, and expert grooming in Lansing, Michigan.",
    type: "website",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
