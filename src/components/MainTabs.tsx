'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/produtos', label: 'Marketplace', icon: '🛍' },
  { href: '/zona-xp', label: 'Zona XP', icon: '📍' },
  { href: '/eventos', label: 'Eventos', icon: '📅' },
  { href: '/lojas', label: 'Lojas', icon: '🏪' },
  { href: '/cultura', label: 'Cultura', icon: '🎭' },
] as const

export default function MainTabs() {
  const pathname = usePathname()

  return (
    <div className="border-b border-[var(--ardosia-borda)] bg-[var(--ardosia)] shadow-sm">
      <div className="touch-pan-x mx-auto flex max-w-7xl gap-0 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-3 [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const active =
            tab.href === '/produtos'
              ? pathname === '/produtos' || pathname?.startsWith('/produtos/')
              : pathname === tab.href || pathname?.startsWith(`${tab.href}/`)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex shrink-0 items-center gap-1 border-b-2 px-2.5 py-2.5 text-xs font-medium transition touch-manipulation sm:gap-1.5 sm:px-4 sm:py-3 sm:text-sm ${
                active
                  ? 'border-[var(--terracota)] text-[var(--terracota-v)]'
                  : 'border-transparent text-[var(--offwhite)]/55 hover:border-[var(--offwhite)]/20 hover:text-[var(--offwhite)]'
              }`}
            >
              <span className="text-base sm:text-[1.05rem]" aria-hidden>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
