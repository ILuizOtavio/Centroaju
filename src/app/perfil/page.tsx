'use client'

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Perfil() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
    }

    loadProfile()
  }, [])

  if (!profile) return <p>Carregando...</p>

  return (
    <div>
      <h1>Perfil</h1>
      <p>XP: {profile.total_xp}</p>
      <p>Nível: {profile.tier}</p>
      <p>Streak: {profile.streak}</p>
    </div>
  )
}