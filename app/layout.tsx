import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
