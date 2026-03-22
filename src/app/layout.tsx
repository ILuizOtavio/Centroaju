import './globals.css'
import Navbar from '@/navbar'
import MainTabs from '@/components/MainTabs'
import { Lora, Source_Sans_3 } from 'next/font/google'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={`${lora.variable} ${sourceSans.variable} min-h-screen min-h-[100dvh] antialiased`}>
        <Navbar />
        <MainTabs />
        <main className="pb-8 pb-[max(2rem,env(safe-area-inset-bottom))]">{children}</main>
      </body>
    </html>
  )
}
