import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../src/styles/globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mountain Mixology | Cocktail Catering',
  description: 'Premium cocktail experiences in the mountains',
  icons: {
    icon: '/images/branding/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        
        {/* Vercel Analytics/Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}