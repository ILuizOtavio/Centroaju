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
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const insideRef = useRef(false)
  const watchIdRef = useRef<number | null>(null)

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

  useEffect(() => {
    startGeo()
    return () => stopGeo()
  }, [])

  function beginSessionAuto() {
    const s = loadState()
    if (s.sessionActive) return
    const next: ZonaXPState = {
      ...s,
      sessionActive: true,
      sessionStartedAt: Date.now(),
      lastAccumulatedAt: Date.now(),
    }
    saveState(next)
    setState(next)
  }

  function startGeo() {
    if (watchIdRef.current != null) return
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
        if (ok) beginSessionAuto()
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
    watchIdRef.current = id
  }

  function stopGeo() {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
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
    const next = {
      ...s,
      demoMode: true,
      sessionActive: true,
      sessionStartedAt: s.sessionStartedAt ?? Date.now(),
      lastAccumulatedAt: Date.now(),
    }
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
      <div className="mx-auto max-w-4xl px-3 py-12 text-center text-sm text-[var(--texto-sub)] sm:px-4 sm:py-16">
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
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--verde-xp)]">Gamificação ao vivo</p>
        <h1 className="text-2xl text-[var(--ardosia)] sm:text-3xl">Zona XP</h1>
        <p className="mt-2 text-sm text-[var(--texto-sub)]">
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
        <p className="mt-1.5 text-center text-xs text-[var(--texto-sub)]/80">
          {state.demoMode
            ? 'Modo demonstração — posição simulada no centro'
            : coords
              ? inside
                ? '✅ Você está dentro da zona XP'
                : '📍 Você está fora da zona XP'
              : 'Inicie uma sessão para ver sua posição no mapa'}
        </p>
      </div>

      <section className="mb-6 rounded-xl border border-[var(--bege)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[var(--ardosia)]">Sessão de presença</h2>
        <p className="mt-1 text-sm text-[var(--texto-sub)]">
          {state.demoMode ? (
            <span className="font-medium text-amber-700">Modo demonstração ativo (XP como se estivesse na zona).</span>
          ) : null}{' '}
          A sessão inicia automaticamente ao entrar na zona. Polígono: lat −10,923° a −10,905° · long
          −37,062° a −37,043°.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          {sessionRunning ? (
            <button
              type="button"
              onClick={endSession}
              className="min-h-11 touch-manipulation rounded-lg bg-[var(--ardosia)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--ardosia-m)]"
            >
              Encerrar sessão
            </button>
          ) : null}
          {!state.demoMode ? (
            <button
              type="button"
              onClick={enableDemo}
              className="min-h-11 touch-manipulation rounded-lg border border-[var(--bege)] px-4 py-2.5 text-sm font-medium text-[var(--ardosia)] hover:bg-[var(--cinza-q)]"
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
              ? inside
                ? 'Dentro da zona — iniciando sessão...'
                : 'Aguardando entrada na zona'
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

      <section className="mb-6 rounded-xl border border-[var(--bege)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[var(--ardosia)]">Perfil</h2>
        <p className="mt-1 text-sm text-[var(--texto-sub)]">
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
            className="rounded-md border border-[var(--bege)] px-3 py-1.5 text-sm"
          >
            Fixar Explorador
          </button>
          <button
            type="button"
            onClick={() => setManualProfile('guardiao')}
            className="rounded-md border border-[var(--bege)] px-3 py-1.5 text-sm"
          >
            Fixar Guardião
          </button>
          <button type="button" onClick={resetManual} className="rounded-md border border-[var(--bege)] px-3 py-1.5 text-sm">
            Voltar ao automático
          </button>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-[var(--bege)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[var(--ardosia)]">Streak semanal</h2>
        <div className="mt-4 flex gap-0.5 sm:gap-1">
          {state.weekPresence.map((on, i) => (
            <div
              key={DOW[i]}
              title={DOW[i]}
              className={`flex h-9 min-w-0 flex-1 items-center justify-center rounded px-0.5 text-[10px] font-medium leading-tight sm:h-10 sm:px-1 sm:text-xs ${
                on ? 'bg-[var(--verde-xp)] text-white' : 'bg-[var(--cinza-q)] text-[var(--texto-sub)]'
              }`}
            >
              <span className="hidden sm:inline">{DOW[i]}</span>
              <span className="sm:hidden">{DOW[i].slice(0, 1)}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-[var(--texto-sub)]">
          Dias consecutivos com presença: <strong>{state.streakDays}</strong>
        </p>
      </section>

      <section className="mb-6 rounded-xl border border-[var(--bege)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[var(--ardosia)]">Rank</h2>
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
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[var(--bege)]">
            <div
              className="h-full bg-[var(--terracota)] transition-all"
              style={{ width: `${prog.pct * 100}%` }}
            />
          </div>
        ) : null}
      </section>

      <section className="mb-6 rounded-xl border border-[var(--bege)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[var(--ardosia)]">Ranking hoje (demo local)</h2>
        <ul className="mt-4 divide-y divide-[var(--bege)]">
          {board.map((row) => (
            <li
              key={`${row.rank}-${row.name}`}
              className={`flex min-w-0 items-center justify-between gap-2 py-2 text-sm ${
                row.isYou ? 'rounded-md bg-[var(--ouro)]/35 px-2 font-semibold' : ''
              }`}
            >
              <span className="min-w-0 truncate">
                {row.rank}. {row.name}{' '}
                <span className="text-[var(--texto-sub)]">
                  {row.kind === 'guardiao' ? '🏛' : '🗺'}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{Math.round(row.xpToday)} XP</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--bege)] bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-[var(--ardosia)]">Conquistas</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => {
            const ok = state.achievementsUnlocked.includes(a.id)
            return (
              <div
                key={a.id}
                className={`flex gap-3 rounded-lg border p-3 text-sm ${
                  ok ? 'border-[var(--verde-xp)]/40 bg-[var(--verde-xp)]/10' : 'border-[var(--bege)] bg-[var(--cinza-q)] opacity-80'
                }`}
              >
                <span className="text-2xl">{ok ? a.icon : '🔒'}</span>
                <div>
                  <div className="font-semibold text-[var(--ardosia)]">{a.title}</div>
                  <div className="text-xs text-[var(--texto-sub)]">{a.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-[var(--texto-sub)]">
        Dados de XP e visitas salvos no seu navegador (localStorage). Em produção, o ideal é sincronizar
        com Supabase + PostGIS.
      </p>
    </div>
  )
}