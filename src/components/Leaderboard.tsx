'use client'

// src/components/Leaderboard.tsx
// Ranking em tempo real via Supabase Realtime.
// Subscribe em postgres_changes na tabela profiles.

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

// ------------------------------------------------------------
// Tipos
// ------------------------------------------------------------
interface LeaderboardEntry {
  id:           string
  username:     string
  avatar_url:   string | null
  total_xp:     number
  tier:         string
  profile_type: 'guardiao' | 'explorador'
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const TIER_ICON: Record<string, string> = {
  iniciante:  '🌱',
  explorador: '🧭',
  guardiao:   '🛡️',
}

const PROFILE_BADGE: Record<string, string> = {
  guardiao:   'bg-yellow-100 text-yellow-700',
  explorador: 'bg-blue-100 text-blue-700',
}

// ------------------------------------------------------------
// Componente
// ------------------------------------------------------------
export default function Leaderboard({ currentUserId }: { currentUserId: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  // ----------------------------------------------------------
  // Subscribe no Realtime — atualiza quando qualquer perfil mudar
  // ----------------------------------------------------------
  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, total_xp, tier, profile_type')
        .order('total_xp', { ascending: false })
        .limit(20)

      if (data) setEntries(data as LeaderboardEntry[])
      setLoading(false)
    }

    fetchLeaderboard()

    const channel = supabase
      .channel('leaderboard')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        () => fetchLeaderboard()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="text-gray-400 text-sm">Carregando ranking...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-2">🏆 Ranking ao vivo</h2>

      {entries.map((entry, index) => {
        const isCurrentUser = entry.id === currentUserId
        const position = index + 1

        return (
          <div
            key={entry.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              isCurrentUser
                ? 'bg-indigo-50 border border-indigo-200'
                : 'bg-white border border-gray-100'
            }`}
          >
            {/* Posição */}
            <span className={`w-7 text-center font-bold text-sm ${
              position === 1 ? 'text-yellow-500' :
              position === 2 ? 'text-gray-400' :
              position === 3 ? 'text-amber-600' :
              'text-gray-400'
            }`}>
              {position <= 3 ? ['🥇','🥈','🥉'][position - 1] : position}
            </span>

            {/* Avatar */}
            {entry.avatar_url ? (
              <img
                src={entry.avatar_url}
                alt={entry.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                {entry.username?.charAt(0).toUpperCase() ?? '?'}
              </div>
            )}

            {/* Nome + badges */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${isCurrentUser ? 'text-indigo-700' : 'text-gray-800'}`}>
                {entry.username ?? 'Usuário'} {isCurrentUser && <span className="text-xs font-normal">(você)</span>}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs">{TIER_ICON[entry.tier] ?? '🌱'}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${PROFILE_BADGE[entry.profile_type]}`}>
                  {entry.profile_type}
                </span>
              </div>
            </div>

            {/* XP */}
            <span className="text-sm font-bold text-yellow-600 whitespace-nowrap">
              {entry.total_xp.toLocaleString('pt-BR')} XP
            </span>
          </div>
        )
      })}

      {entries.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">
          Nenhum usuário no ranking ainda. Faça o primeiro check-in!
        </p>
      )}
    </div>
  )
}