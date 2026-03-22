'use client'

import { supabase } from '@/lib/supabase/client'

export default function Home() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CentroAju</h1>
      <button onClick={handleLogin}>
        Login com Google
      </button>
    </div>
  )
}