'use client'

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
  const [cartCount, setCartCount] = useState(0)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()

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

  useEffect(() => {
    if (!profileOpen) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [profileOpen])

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
      <div className="border-b border-[var(--ardosia-borda)] bg-[var(--ardosia)]">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] gap-x-2 gap-y-2 px-3 py-2.5 sm:px-4 sm:py-3 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-3">
          <Link
            href="/"
            className="col-start-1 row-start-1 shrink-0 text-xl font-bold tracking-tight text-[var(--offwhite)] sm:text-2xl"
            style={{ fontFamily: 'inherit' }}
          >
            Centro<span className="text-[var(--terracota-v)]">Aju</span>
          </Link>

          <div className="col-start-2 row-start-1 flex items-center justify-end gap-1.5 sm:gap-2 md:col-start-3 md:justify-end md:gap-3">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="touch-manipulation inline-flex items-center gap-2 rounded-md bg-[var(--terracota)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--ml-blue-hover)] sm:text-sm"
            >
              <span aria-hidden>👤</span> Meu Perfil
            </button>

            <Link
              href="/carrinho"
              className="touch-manipulation flex items-center gap-1 rounded-md bg-white/8 px-1.5 py-1.5 text-sm font-medium text-[var(--offwhite)] transition hover:bg-white/15 sm:gap-1.5 sm:px-2"
            >
              <CartIcon className="text-[var(--offwhite)]" />
              <span className="hidden sm:inline">Carrinho</span>
              <span className="rounded-full bg-[var(--terracota)] px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
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
              className="min-h-11 min-w-0 flex-1 rounded-l-md border-0 bg-white/8 px-3 py-2 text-base text-[var(--offwhite)] outline-none placeholder:text-[var(--offwhite)]/45 focus:ring-2 focus:ring-[var(--terracota)] sm:min-h-10 sm:text-sm"
              enterKeyHint="search"
            />
            <button
              type="submit"
              className="touch-manipulation flex shrink-0 items-center gap-1 rounded-r-md bg-[var(--terracota)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[var(--ml-blue-hover)] sm:px-4"
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

      {toast ? (
        <div
          className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[100] max-w-[min(92vw,24rem)] -translate-x-1/2 px-3 sm:bottom-6 sm:px-4"
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-auto rounded-lg border border-[var(--terracota)]/35 bg-[var(--ardosia)] px-4 py-3 text-center text-sm text-white shadow-lg">
            <span className="text-[#7ed957]">✓</span> {toast}
          </div>
        </div>
      ) : null}

      {profileOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setProfileOpen(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Perfil do usuário"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[var(--offwhite)] shadow-2xl">
            <div className="relative bg-[var(--ardosia)] px-6 pb-6 pt-8 text-center">
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/15 text-[var(--offwhite)] transition hover:bg-white/25"
                aria-label="Fechar perfil"
              >
                ✕
              </button>
              <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-[var(--terracota)] text-4xl">
                👤
              </div>
              <h3 className="text-2xl text-[var(--offwhite)]">Maria da Silva</h3>
              <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-[var(--verde-xp)]/35 bg-[var(--verde-xp)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--verde-xp-v)]">
                🗺 Exploradora do Centro
              </p>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="rounded-xl border border-[var(--bege)] bg-white p-4">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-[var(--texto-sub)]">
                  <span>Progresso XP</span>
                  <span>1.240 / 2.000 XP</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--bege)]">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[var(--verde-xp)] to-[var(--ouro)]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-[var(--bege)] bg-white p-3">
                  <div className="text-xl font-bold text-[var(--ardosia)]">1.240</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--texto-sub)]">XP Total</div>
                </div>
                <div className="rounded-lg border border-[var(--bege)] bg-white p-3">
                  <div className="text-xl font-bold text-[var(--ardosia)]">18</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--texto-sub)]">Compras</div>
                </div>
                <div className="rounded-lg border border-[var(--bege)] bg-white p-3">
                  <div className="text-xl font-bold text-[var(--ardosia)]">🔥 3</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--texto-sub)]">Streak</div>
                </div>
              </div>

              <Link
                href="/zona-xp"
                onClick={() => setProfileOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--terracota)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--ml-blue-hover)]"
              >
                📍 Ir para Zona XP
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
