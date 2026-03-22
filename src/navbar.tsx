'use client'

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

 const handleLogin = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline'
      }
    }
  })
}
const handleLogout = async () => {
  await supabase.auth.signOut()
  setUser(null)
}
  useEffect(() => {
    const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) return

  setUser(user)

  await supabase.from('profiles').upsert({
    id: user.id
  })
}

getUser()
  }, [])

  return (
    <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
      {user ? (
  <div>
    <p>Logado: {user.email}</p>
    <button onClick={handleLogout}>
      Sair
    </button>
  </div>
) : (
        <button onClick={handleLogin}>
          Login com Google
        </button>
      )}
    </nav>
  )
}