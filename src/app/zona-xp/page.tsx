'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  ACHIEVEMENTS,
  accumulateXp,
  buildDailyLeaderboard,
  effectiveProfile,
  isInsideCentroZone,
  loadState,
  nextTierProgress,
  RANK_LABELS,
  recordVisitEnd,
  saveState,
  xpPerMinute,
  type UserProfileKind,
  type ZonaXPState,
} from '@/lib/zona-xp'

const ZonaXPMap = dynamic(() => import('@/components/ZonaXPMap'), { ssr: false })

const DOW = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export default function ZonaXPPage() {
  const [state, setState] = useState<ZonaXPState | null>(null)
  const [inside, setInside] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const insideRef = useRef(false)

  const refresh = useCallback(() => {
    setState(loadState())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    insideRef.current = inside
  }, [inside])

  useEffect(() => {
    if (!state?.sessionActive) return
    const id = window.setInterval(() => {
      setState((prev) => {
        if (!prev?.sessionActive) return prev
        const demo = prev.demoMode
        const now = Date.now()
        const next = accumulateXp(prev, now, insideRef.current || demo, demo)
        saveState(next)
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [state?.sessionActive])

  function startGeo() {
    if (!navigator.geolocation) {
      setGeoError('Geolocalização não disponível neste aparelho.')
      return
    }
    setGeoError(null)
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const ok = isInsideCentroZone(latitude, longitude)
        setInside(ok)
        setCoords({ lat: latitude, lng: longitude })
      },
      () => {
        setGeoError('Permissão negada ou GPS indisponível — modo demonstração ativado.')
        setInside(false)
        const s = loadState()
        const next = { ...s, demoMode: true }
        saveState(next)
        setState(next)
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 }
    )
    setWatchId(id)
  }

  function stopGeo() {
    if (watchId != null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }

  function activateSession() {
    const s = loadState()
    const demo = !!geoError || !navigator.geolocation
    const next: ZonaXPState = {
      ...s,
      sessionActive: true,
      sessionStartedAt: Date.now(),
      lastAccumulatedAt: Date.now(),
      demoMode: demo || s.demoMode,
    }
    saveState(next)
    setState(next)
    startGeo()
  }

  function endSession() {
    const s = loadState()
    if (s.sessionActive && s.sessionStartedAt) {
      const ended = recordVisitEnd(s, s.sessionStartedAt, Date.now())
      const next: ZonaXPState = {
        ...ended,
        sessionActive: false,
        sessionStartedAt: null,
        lastAccumulatedAt: null,
      }
      saveState(next)
      setState(next)
    }
    stopGeo()
    setInside(false)
    setCoords(null)
  }

  function enableDemo() {
    const s = loadState()
    const next = { ...s, demoMode: true }
    saveState(next)
    setState(next)
    setGeoError(null)
  }

  function setManualProfile(p: UserProfileKind) {
    const s = loadState()
    const next = { ...s, profile: p, profileManual: true }
    saveState(next)
    setState(next)
  }

  function resetManual() {
    const s = loadState()
    const next = { ...s, profileManual: false }
    saveState(next)
    setState(next)
  }

  if (!state) {
    return (
      <div className="mx-auto max-w-4xl px-3 py-12 text-center text-sm text-neutral-500 sm:px-4 sm:py-16">
        Carregando Zona XP…
      </div>
    )
  }

  const profile = effectiveProfile(state)
  const xpm = xpPerMinute(profile)
  const prog = nextTierProgress(state.totalXp)
  const board = buildDailyLeaderboard(state.todayXp)

  const sessionRunning = state.sessionActive
  const paused = sessionRunning && !inside && !state.demoMode

  return (
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-[#333] sm:text-3xl">Zona XP</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Gamificação por geolocalização no centro de Aracaju — ganhe XP enquanto circula pela área
          oficial (polígono GPS).
        </p>
      </header>

      {/* Mapa */}
      <div className="mb-6 sm:mb-8">
        <ZonaXPMap
          userLat={state.demoMode ? -10.9114 : coords?.lat ?? null}
          userLng={state.demoMode ? -37.049 : coords?.lng ?? null}
          inside={inside || state.demoMode}
        />
        <p className="mt-1.5 text-center text-xs text-neutral-400">
          {state.demoMode
            ? 'Modo demonstração — posição simulada no centro'
            : coords
              ? inside
                ? '✅ Você está dentro da zona XP'
                : '📍 Você está fora da zona XP'
              : 'Inicie uma sessão para ver sua posição no mapa'}
        </p>
      </div>

      <section className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[#333]">Sessão de presença</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {state.demoMode ? (
            <span className="font-medium text-amber-700">Modo demonstração ativo (XP como se estivesse na zona).</span>
          ) : null}{' '}
          Polígono: lat −10,923° a −10,905° · long −37,062° a −37,043°.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          {!sessionRunning ? (
            <button
              type="button"
              onClick={activateSession}
              className="min-h-11 touch-manipulation rounded-lg bg-[var(--ml-blue)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--ml-blue-hover)]"
            >
              Ativar Zona XP
            </button>
          ) : (
            <button
              type="button"
              onClick={endSession}
              className="min-h-11 touch-manipulation rounded-lg bg-neutral-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Encerrar sessão
            </button>
          )}
          {!state.demoMode ? (
            <button
              type="button"
              onClick={enableDemo}
              className="min-h-11 touch-manipulation rounded-lg border border-[var(--border-subtle)] px-4 py-2.5 text-sm font-medium text-[#333] hover:bg-neutral-50"
            >
              Modo demonstração
            </button>
          ) : null}
        </div>

        {geoError ? <p className="mt-3 text-sm text-amber-800">{geoError}</p> : null}

        <div className="mt-4 grid gap-2 text-sm">
          <p>
            <strong>Status GPS:</strong>{' '}
            {!sessionRunning
              ? '—'
              : state.demoMode
                ? 'Demonstração (sempre conta XP)'
                : inside
                  ? 'Dentro da zona ✓'
                  : 'Fora da zona — XP pausado até voltar'}
          </p>
          {paused ? (
            <p className="text-amber-800">Você saiu da área: acumulação pausada. Volte ao centro para retomar.</p>
          ) : null}
          <p>
            <strong>Taxa base:</strong> {xpm} XP/min ({profile === 'guardiao' ? 'Guardião' : 'Explorador'})
            {state.streakDays >= 7 ? ' · Streak 7+ dias: +50% neste dia' : ''}
          </p>
          <p>
            <strong>XP hoje:</strong> {Math.floor(state.todayXp)} · <strong>Total:</strong>{' '}
            {Math.floor(state.totalXp)}
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[#333]">Perfil</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Detecção automática por histórico: <strong>Guardião</strong> = 3+ visitas longas (≥6h) em dias úteis.
        </p>
        <p className="mt-2 text-sm">
          Atual: <strong>{profile === 'guardiao' ? '🏛 Guardião' : '🗺 Explorador'}</strong>
          {state.profileManual ? ' (manual)' : ' (automático)'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setManualProfile('explorador')}
            className="rounded-md border px-3 py-1.5 text-sm"
          >
            Fixar Explorador
          </button>
          <button
            type="button"
            onClick={() => setManualProfile('guardiao')}
            className="rounded-md border px-3 py-1.5 text-sm"
          >
            Fixar Guardião
          </button>
          <button type="button" onClick={resetManual} className="rounded-md border px-3 py-1.5 text-sm">
            Voltar ao automático
          </button>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[#333]">Streak semanal</h2>
        <div className="mt-4 flex gap-0.5 sm:gap-1">
          {state.weekPresence.map((on, i) => (
            <div
              key={DOW[i]}
              title={DOW[i]}
              className={`flex h-9 min-w-0 flex-1 items-center justify-center rounded px-0.5 text-[10px] font-medium leading-tight sm:h-10 sm:px-1 sm:text-xs ${
                on ? 'bg-[#00a650] text-white' : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              <span className="hidden sm:inline">{DOW[i]}</span>
              <span className="sm:hidden">{DOW[i].slice(0, 1)}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-neutral-600">
          Dias consecutivos com presença: <strong>{state.streakDays}</strong>
        </p>
      </section>

      <section className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[#333]">Rank</h2>
        <p className="mt-1 text-sm">
          Nível: <strong>{RANK_LABELS[prog.tier]}</strong>
          {prog.next ? (
            <>
              {' '}
              → próximo: {RANK_LABELS[prog.next]} ({prog.nextMin} XP)
            </>
          ) : null}
        </p>
        {prog.next ? (
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-[var(--ml-blue)] transition-all"
              style={{ width: `${prog.pct * 100}%` }}
            />
          </div>
        ) : null}
      </section>

      <section className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[#333]">Ranking hoje (demo local)</h2>
        <ul className="mt-4 divide-y divide-[var(--border-subtle)]">
          {board.map((row) => (
            <li
              key={`${row.rank}-${row.name}`}
              className={`flex min-w-0 items-center justify-between gap-2 py-2 text-sm ${
                row.isYou ? 'rounded-md bg-[#ffe600]/40 px-2 font-semibold' : ''
              }`}
            >
              <span className="min-w-0 truncate">
                {row.rank}. {row.name}{' '}
                <span className="text-neutral-500">
                  {row.kind === 'guardiao' ? '🏛' : '🗺'}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{Math.round(row.xpToday)} XP</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-[#333]">Conquistas</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => {
            const ok = state.achievementsUnlocked.includes(a.id)
            return (
              <div
                key={a.id}
                className={`flex gap-3 rounded-lg border p-3 text-sm ${
                  ok ? 'border-[#00a650]/40 bg-green-50/50' : 'border-neutral-200 bg-neutral-50 opacity-80'
                }`}
              >
                <span className="text-2xl">{ok ? a.icon : '🔒'}</span>
                <div>
                  <div className="font-semibold text-[#333]">{a.title}</div>
                  <div className="text-xs text-neutral-600">{a.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-neutral-500">
        Dados de XP e visitas salvos no seu navegador (localStorage). Em produção, o ideal é sincronizar
        com Supabase + PostGIS.
      </p>
    </div>
  )
}