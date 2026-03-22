'use client'

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { categories } from '@/data/products'
import { CART_CHANGE_EVENT, type CartChangeDetail } from '@/lib/cart-events'

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM1 4h2l.68 3.39a1 1 0 0 0 .99.81H19a1 1 0 0 0 .96-.76l2.5-8H5.21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const router = useRouter()
  const userName = user?.email?.split('@')[0] ?? 'usuário'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCartCount(0)
    localStorage.removeItem('ca_cart')
  }

  // Auth — onAuthStateChange já dispara imediatamente com a sessão atual
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Carrinho inicial
  useEffect(() => {
    const raw = localStorage.getItem('ca_cart') || '[]'
    try {
      const arr = JSON.parse(raw)
      setCartCount(Array.isArray(arr) ? arr.length : 0)
    } catch {
      setCartCount(0)
    }
  }, [])

  // Carrinho — escuta eventos de mudança
  useEffect(() => {
    let hideToast: ReturnType<typeof setTimeout>
    const refreshCartCount = () => {
      const raw = localStorage.getItem('ca_cart') || '[]'
      try {
        const arr = JSON.parse(raw)
        setCartCount(Array.isArray(arr) ? arr.length : 0)
      } catch {
        setCartCount(0)
      }
    }
    const onCartChanged = (e: Event) => {
      refreshCartCount()
      const detail = (e as CustomEvent<CartChangeDetail>).detail
      if (detail?.productName) {
        setToast(`"${detail.productName}" adicionado ao carrinho`)
        clearTimeout(hideToast)
        hideToast = setTimeout(() => setToast(null), 4000)
      }
    }
    window.addEventListener(CART_CHANGE_EVENT, onCartChanged)
    return () => {
      clearTimeout(hideToast)
      window.removeEventListener(CART_CHANGE_EVENT, onCartChanged)
    }
  }, [])

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push(`/produtos?q=${encodeURIComponent(q)}`)
    } else {
      router.push('/produtos')
    }
  }

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-[var(--ml-yellow)]">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] gap-x-2 gap-y-2 px-3 py-2.5 sm:px-4 sm:py-3 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-3">
          <Link
            href="/"
            className="col-start-1 row-start-1 shrink-0 text-xl font-bold tracking-tight text-[#333] sm:text-2xl"
            style={{ fontFamily: 'inherit' }}
          >
            CentroAju
          </Link>

          <div className="col-start-2 row-start-1 flex items-center justify-end gap-1.5 sm:gap-2 md:col-start-3 md:justify-end md:gap-3">
            {authReady && user ? (
              <div className="flex max-w-[min(160px,40vw)] items-center gap-1.5 sm:max-w-[220px] md:max-w-[260px]">
                <span className="truncate text-xs text-[#333]/80" title={user.email}>
                  Olá, {userName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="touch-manipulation rounded border border-[#333]/25 bg-white/80 px-2 py-1.5 text-xs font-medium text-[#333] transition hover:bg-white"
                >
                  Sair
                </button>
              </div>
            ) : authReady && !user ? (
              <div className="hidden items-center gap-1.5 sm:flex md:gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#333] underline-offset-2 hover:underline"
                >
                  Entre
                </Link>
                <span className="text-[#333]/50">|</span>
                <Link
                  href="/login?mode=signup"
                  className="text-sm font-medium text-[#333] underline-offset-2 hover:underline"
                >
                  Crie conta
                </Link>
              </div>
            ) : (
              <div className="hidden h-8 w-[100px] animate-pulse rounded bg-black/5 sm:block md:w-[140px]" aria-hidden />
            )}

            <Link
              href="/carrinho"
              className="touch-manipulation flex items-center gap-1 rounded-sm px-1.5 py-1.5 text-sm font-medium text-[#333] transition hover:bg-black/5 sm:gap-1.5 sm:px-2"
            >
              <CartIcon className="text-[#333]" />
              <span className="hidden sm:inline">Carrinho</span>
              <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-[#333]">
                {cartCount}
              </span>
            </Link>
          </div>

          <form
            onSubmit={onSearch}
            className="col-span-2 row-start-2 flex min-w-0 md:col-span-1 md:row-start-1 md:col-start-2"
            role="search"
            aria-label="Buscar produtos"
          >
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar no CentroAju…"
              className="min-h-11 min-w-0 flex-1 rounded-l-sm border-0 bg-white px-3 py-2 text-base text-[#333] shadow-inner outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[var(--ml-blue)] sm:min-h-10 sm:text-sm"
              enterKeyHint="search"
            />
            <button
              type="submit"
              className="touch-manipulation flex shrink-0 items-center gap-1 rounded-r-sm bg-[#333] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#222] sm:px-4"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </form>
        </div>
      </div>

      <nav
        className="border-b border-[var(--border-subtle)] bg-white"
        aria-label="Categorias"
      >
        <div className="touch-pan-x mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2.5 text-sm [-ms-overflow-style:none] [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden">
          <Link
            href="/produtos"
            className="shrink-0 whitespace-nowrap rounded px-2 py-1 text-[var(--ml-blue)] hover:bg-neutral-100"
          >
            Todos
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/produtos?category=${encodeURIComponent(c)}`}
              className="shrink-0 whitespace-nowrap rounded px-2 py-1 text-[#666] hover:bg-neutral-100 hover:text-[#333]"
            >
              {c}
            </Link>
          ))}
          <Link
            href="/lojas"
            className="ml-auto shrink-0 whitespace-nowrap px-2 py-1 text-[var(--ml-blue)] hover:underline"
          >
            Ver lojas
          </Link>
        </div>
      </nav>

      {authReady && !user ? (
        <div className="flex items-center justify-center gap-3 border-b border-[var(--border-subtle)] bg-white py-2 sm:hidden">
          <Link href="/login" className="text-sm font-medium text-[var(--ml-blue)]">
            Entre
          </Link>
          <span className="text-neutral-300">|</span>
          <Link href="/login?mode=signup" className="text-sm font-medium text-[var(--ml-blue)]">
            Crie sua conta
          </Link>
        </div>
      ) : null}

      {toast ? (
        <div
          className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[100] max-w-[min(92vw,24rem)] -translate-x-1/2 px-3 sm:bottom-6 sm:px-4"
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-auto rounded-lg border border-[#00a650]/30 bg-[#333] px-4 py-3 text-center text-sm text-white shadow-lg">
            <span className="text-[#7ed957]">✓</span> {toast}
          </div>
        </div>
      ) : null}
    </header>
  )
}
