'use client'

// src/components/ZonaXP.tsx
// Lógica de GPS + timer + XP embutida no componente.
// Usa funções puras de geo.ts — sem hook separado.

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { isInsideCentro, calcXP, XP_RATE, CENTRO_BOUNDS } from '@/lib/geo'

// ------------------------------------------------------------
// Tipos locais
// ------------------------------------------------------------
type SessionStatus = 'idle' | 'inside' | 'outside' | 'denied' | 'demo'

interface ZonaXPProps {
  userId: string
  profileType: 'guardiao' | 'explorador'
}

// ------------------------------------------------------------
// Helpers de formatação
// ------------------------------------------------------------
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

const STATUS_LABEL: Record<SessionStatus, string> = {
  idle:    'Clique para iniciar check-in',
  inside:  '✅ Você está no centro!',
  outside: '📍 Você está fora do centro',
  denied:  '🎮 Modo demo ativo',
  demo:    '🎮 Modo demo ativo',
}

const TIER_LABEL: Record<string, string> = {
  iniciante:  '🌱 Iniciante',
  explorador: '🧭 Explorador',
  guardiao:   '🛡️ Guardião',
}

// ------------------------------------------------------------
// Componente
// ------------------------------------------------------------
export default function ZonaXP({ userId, profileType }: ZonaXPProps) {
  const [status, setStatus]               = useState<SessionStatus>('idle')
  const [isRunning, setIsRunning]         = useState(false)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [totalXP, setTotalXP]             = useState(0)
  const [tier, setTier]                   = useState('iniciante')

  const sessionIdRef    = useRef<string | null>(null)
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastSaveRef     = useRef(0)
  const profileTypeRef  = useRef(profileType)

  // Mantém ref atualizada se prop mudar
  useEffect(() => { profileTypeRef.current = profileType }, [profileType])

  // ----------------------------------------------------------
  // Busca tier atual do perfil
  // ----------------------------------------------------------
  useEffect(() => {
    supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single()
      .then(({ data }) => { if (data?.tier) setTier(data.tier) })
  }, [userId, totalXP])

  // ----------------------------------------------------------
  // Salva XP no banco (chamado a cada 60s)
  // ----------------------------------------------------------
  const saveXP = useCallback(async (seconds: number, sessionId: string) => {
    await supabase
      .from('geo_sessions')
      .update({ duration_sec: seconds, xp_earned: calcXP(seconds, profileTypeRef.current) })
      .eq('id', sessionId)

    await supabase.rpc('add_xp', {
      p_user_id: userId,
      p_amount:  XP_RATE[profileTypeRef.current],
      p_reason:  'checkin',
      p_ref_id:  sessionId,
    })
  }, [userId])

  // ----------------------------------------------------------
  // Inicia sessão no banco
  // ----------------------------------------------------------
  const startSession = useCallback(async (): Promise<string | null> => {
    const { data, error } = await supabase
      .from('geo_sessions')
      .insert({ user_id: userId })
      .select('id')
      .single()
    if (error) { console.error(error); return null }
    return data.id
  }, [userId])

  // ----------------------------------------------------------
  // Timer — 1s por tick, save a cada 60s
  // ----------------------------------------------------------
  const startTimer = useCallback((sessionId: string) => {
    timerRef.current = setInterval(() => {
      setSessionSeconds((prev) => {
        const next = prev + 1
        setTotalXP(calcXP(next, profileTypeRef.current))
        if (next - lastSaveRef.current >= 60) {
          lastSaveRef.current = next
          saveXP(next, sessionId)
        }
        return next
      })
    }, 1000)
  }, [saveXP])

  // ----------------------------------------------------------
  // Modo DEMO — GPS negado ou indisponível
  // ----------------------------------------------------------
  const startDemo = useCallback(async () => {
    const sessionId = await startSession()
    if (!sessionId) return
    sessionIdRef.current = sessionId
    setStatus('demo')
    setIsRunning(true)
    startTimer(sessionId)
  }, [startSession, startTimer])

  // ----------------------------------------------------------
  // Para sessão e salva no banco
  // ----------------------------------------------------------
  const stopSession = useCallback(async () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (sessionIdRef.current) {
      setSessionSeconds((sec) => {
        saveXP(sec, sessionIdRef.current!)
        return sec
      })
      await supabase
        .from('geo_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', sessionIdRef.current)
      sessionIdRef.current = null
    }
    lastSaveRef.current = 0
    setStatus('idle')
    setIsRunning(false)
    setSessionSeconds(0)
    setTotalXP(0)
  }, [saveXP])

  // ----------------------------------------------------------
  // Solicita GPS e inicia
  // ----------------------------------------------------------
  const handleCheckIn = useCallback(async () => {
    if (isRunning) { await stopSession(); return }

    if (!navigator.geolocation) { await startDemo(); return }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lng } }) => {
        if (!isInsideCentro(lat, lng)) { setStatus('outside'); return }
        const sessionId = await startSession()
        if (!sessionId) return
        sessionIdRef.current = sessionId
        setStatus('inside')
        setIsRunning(true)
        startTimer(sessionId)
      },
      async () => { await startDemo() },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [isRunning, stopSession, startDemo, startSession, startTimer])

  // ----------------------------------------------------------
  // Cleanup
  // ----------------------------------------------------------
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  const xpRate = XP_RATE[profileType]

  return (
    <div className="flex flex-col items-center gap-6 p-6">

      {/* Status */}
      <p className="text-sm font-medium text-gray-500">{STATUS_LABEL[status]}</p>

      {/* Timer */}
      <div className="text-6xl font-mono font-bold tracking-tight">
        {formatTime(sessionSeconds)}
      </div>

      {/* XP da sessão */}
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-yellow-500">+{totalXP} XP</span>
        <span className="text-xs text-gray-400">{xpRate} XP/min · {profileType}</span>
      </div>

      {/* Tier */}
      <span className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
        {TIER_LABEL[tier] ?? tier}
      </span>

      {/* Botão principal */}
      <button
        onClick={handleCheckIn}
        className={`w-full max-w-xs rounded-2xl py-4 text-lg font-bold text-white transition-all ${
          isRunning
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isRunning ? 'Encerrar sessão' : 'Fazer check-in'}
      </button>

      {/* Modo demo aviso */}
      {(status === 'demo') && (
        <p className="text-xs text-gray-400 text-center">
          GPS indisponível — simulando localização dentro do centro.
        </p>
      )}

      {/* Fora do centro aviso */}
      {status === 'outside' && (
        <p className="text-xs text-red-400 text-center">
          Você precisa estar no centro de Aracaju para fazer check-in.
        </p>
      )}
    </div>
  )
}