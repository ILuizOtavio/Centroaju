'use client'

import Link from 'next/link'

export default function HomeSecondaryCta() {
  return (
    <Link
      href="/zona-xp"
      className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--offwhite)]/35 bg-transparent px-6 py-3 text-sm font-semibold text-[var(--offwhite)] shadow-sm transition hover:border-[var(--terracota)] hover:text-[var(--terracota-v)] touch-manipulation sm:w-auto"
    >
      Ganhar XP agora
    </Link>
  )
}
