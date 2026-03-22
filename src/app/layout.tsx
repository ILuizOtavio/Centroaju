import './globals.css'
import Navbar from '@/navbar'
import MainTabs from '@/components/MainTabs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen min-h-[100dvh] antialiased">
        <Navbar />
        <MainTabs />
        <main className="pb-8 pb-[max(2rem,env(safe-area-inset-bottom))]">{children}</main>
      </body>
    </html>
  )
}
