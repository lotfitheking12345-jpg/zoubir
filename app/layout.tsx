import { Analytics } from '@vercel/analytics/next'
import { Noto_Sans_Arabic } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const arabicFont = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic' })

export const metadata: Metadata = {
  title: 'Stock Manager | إدارة المخزون والمبيعات',
  description: 'نظام ذكي لإدارة مخزون ومبيعات متاجر الجملة',
  generator: 'Stock Manager',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f7fa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-[#f5f7fa]">
      <body className={`${arabicFont.variable} ${arabicFont.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
