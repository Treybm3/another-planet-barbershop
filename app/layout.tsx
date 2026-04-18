import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['300', '400', '500', '600', '700', '800', '900'] })

export const metadata: Metadata = {
  title: "Another Planet Barbershop | Lansing, Michigan",
  description: "Premium barbershop in Lansing, Michigan. Expert fades, clean cuts, and beard work by Will. Walk-ins welcome at Another Planet Barbershop.",
  keywords: "barbershop lansing michigan, fade haircut lansing, barber near me, another planet barbershop, will barber lansing",
  openGraph: {
    title: "Another Planet Barbershop | Lansing, Michigan",
    description: "Expert fades, clean cuts, and beard work in Lansing, Michigan.",
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
