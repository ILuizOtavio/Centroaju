"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type Props = {
  defaultMode?: 'signin' | 'signup'
}

export default function AuthForm({ defaultMode = 'signin' }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-[#333]">
          {mode === 'signup' ? 'Crie sua conta' : 'Entre na sua conta'}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {mode === 'signup'
            ? 'Compre com segurança no marketplace do centro.'
            : 'Digite seu e-mail e senha para continuar.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="auth-form">
        <div>
          <label htmlFor="auth-email" className="mb-1 block text-sm font-medium text-[#333]">
            E-mail
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="min-h-11 w-full rounded-md border border-[var(--border-subtle)] bg-white px-3 py-2.5 text-base text-[#333] outline-none transition focus:border-[var(--ml-blue)] focus:ring-2 focus:ring-[var(--ml-blue)]/25 sm:min-h-10 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="auth-password" className="mb-1 block text-sm font-medium text-[#333]">
            Senha
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="min-h-11 w-full rounded-md border border-[var(--border-subtle)] bg-white px-3 py-2.5 text-base text-[#333] outline-none transition focus:border-[var(--ml-blue)] focus:ring-2 focus:ring-[var(--ml-blue)]/25 sm:min-h-10 sm:text-sm"
          />
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full touch-manipulation rounded-md bg-[var(--ml-blue)] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--ml-blue-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Aguarde…' : mode === 'signup' ? 'Criar conta' : 'Entrar'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup')
            setError(null)
          }}
          className="text-center text-sm text-[var(--ml-blue)] hover:underline"
        >
          {mode === 'signup' ? 'Já tenho conta' : 'Criar conta'}
        </button>
      </form>
    </div>
  )
}
