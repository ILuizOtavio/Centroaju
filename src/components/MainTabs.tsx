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
  if (pathname?.startsWith('/login')) return null

  return (
    <div className="border-b border-[var(--border-subtle)] bg-white shadow-sm">
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
                  ? 'border-[var(--ml-blue)] text-[var(--ml-blue)]'
                  : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-[#333]'
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
