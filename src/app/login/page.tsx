'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import { supabase } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    // Garante a troca do código OAuth por sessão no retorno do Google (PKCE)
    if (typeof window !== 'undefined') {
      const hasOAuthParams =
        window.location.search.includes('code=') ||
        window.location.hash.includes('access_token=')
      if (hasOAuthParams) {
        void supabase.auth.exchangeCodeForSession({ currentUrl: window.location.href }).catch(() => {
          // ignore - fluxo continuará com getSession abaixo
        })
      }
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled && session?.user) {
        router.replace('/produtos')
      }
    })
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled && session?.user) {
        router.replace('/produtos')
      }
      if (!cancelled) setChecking(false)
    })
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [router])

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    })
  }

  if (checking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
        Carregando…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-10">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold text-[#333]">
          CentroAju
        </Link>
        <p className="mt-2 text-sm text-neutral-600">
          Marketplace do centro — entre para comprar com segurança.
        </p>
      </div>

      <AuthForm defaultMode={mode} />

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-[var(--border-subtle)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-[var(--background)] px-3 text-neutral-400">ou</span>
        </div>
      </div>

      <button
        type="button"
        onClick={loginWithGoogle}
        className="flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-md border border-[var(--border-subtle)] bg-white py-3 text-sm font-medium text-[#333] shadow-sm transition hover:bg-neutral-50"
      >
        <GoogleIcon />
        Continuar com Google
      </button>

      <p className="mt-8 text-center text-xs text-neutral-500">
        Ao continuar, você concorda com os termos de uso do CentroAju.
      </p>

      <div className="mt-6 text-center">
        <Link href="/produtos" className="text-sm text-[var(--ml-blue)] hover:underline">
          ← Voltar às compras
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
          Carregando…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
