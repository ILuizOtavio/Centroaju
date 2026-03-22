'use client'

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  id: string
  total_xp: number
  tier: string
  streak: number
  email?: string
}

export default function Perfil() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) {
        router.replace('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data ? { ...data, email: user.email } : null)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-sm text-neutral-500">
        Carregando perfil…
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-sm text-neutral-500">
        Perfil não encontrado.{' '}
        <Link href="/login" className="text-[var(--ml-blue)] hover:underline">
          Entrar
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-[#333]">Meu perfil</h1>
      {profile.email && (
        <p className="mt-1 text-sm text-neutral-500">{profile.email}</p>
      )}
      <div className="mt-6 grid gap-4">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-500">XP Total</p>
          <p className="mt-1 text-2xl font-bold text-[#333]">{profile.total_xp ?? 0}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Nível</p>
          <p className="mt-1 text-2xl font-bold text-[#333] capitalize">{profile.tier ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Streak</p>
          <p className="mt-1 text-2xl font-bold text-[#333]">{profile.streak ?? 0} dias</p>
        </div>
      </div>
    </div>
  )
}
