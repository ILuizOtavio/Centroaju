'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function HomeSecondaryCta() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user)
    })

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loggedIn === null) {
    return (
      <span
        className="inline-flex h-11 min-h-[44px] w-full max-w-md animate-pulse rounded-md bg-neutral-200/80 sm:h-[42px] sm:min-w-[200px] sm:w-auto"
        aria-hidden
      />
    )
  }

  if (loggedIn) {
    return (
      <Link
        href="/produtos"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--border-subtle)] bg-white px-6 py-3 text-sm font-semibold text-[#333] shadow-sm transition hover:bg-neutral-50 touch-manipulation sm:w-auto"
      >
        Continuar comprando
      </Link>
    )
  }

  return (
    <Link
      href="/login"
      className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--border-subtle)] bg-white px-6 py-3 text-sm font-semibold text-[#333] shadow-sm transition hover:bg-neutral-50 touch-manipulation sm:w-auto"
    >
      Entrar ou criar conta
    </Link>
  )
}
