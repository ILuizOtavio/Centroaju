import { ACHIEVEMENTS } from './achievements'
import { detectProfile } from './profiles'
import { tierFromTotalXp } from './ranks'
import type { UserProfileKind, VisitRecord, ZonaXPState } from './types'
import { STORAGE_KEY } from './types'

function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function todayKey(): string {
  return localDateKey(new Date())
}

/** Segunda-feira da semana local (YYYY-MM-DD) */
function weekKey(d = new Date()): string {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dow = t.getDay()
  const diff = dow === 0 ? 6 : dow - 1
  t.setDate(t.getDate() - diff)
  return localDateKey(t)
}

function emptyWeek(): [boolean, boolean, boolean, boolean, boolean, boolean, boolean] {
  return [false, false, false, false, false, false, false]
}

export function defaultState(): ZonaXPState {
  const d = new Date()
  return {
    version: 1,
    totalXp: 0,
    todayXp: 0,
    todayKey: todayKey(),
    sessionActive: false,
    sessionStartedAt: null,
    lastAccumulatedAt: null,
    demoMode: false,
    profile: 'explorador',
    profileManual: false,
    visits: [],
    streakDays: 0,
    lastPresenceDate: null,
    weekPresence: emptyWeek(),
    weekKey: weekKey(d),
    achievementsUnlocked: [],
    confirmedEventIds: [],
    purchaseBonusIds: [],
  }
}

export function loadState(): ZonaXPState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as ZonaXPState
    if (parsed.version !== 1) return defaultState()
    const wp =
      Array.isArray(parsed.weekPresence) && parsed.weekPresence.length === 7
        ? (parsed.weekPresence as ZonaXPState['weekPresence'])
        : emptyWeek()
    return {
      ...defaultState(),
      ...parsed,
      weekPresence: wp,
    }
  } catch {
    return defaultState()
  }
}

export function saveState(s: ZonaXPState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function resetDayIfNeeded(s: ZonaXPState): ZonaXPState {
  const tk = todayKey()
  if (s.todayKey === tk) return s
  return { ...s, todayKey: tk, todayXp: 0 }
}

function resetWeekIfNeeded(s: ZonaXPState): ZonaXPState {
  const wk = weekKey()
  if (s.weekKey === wk) return s
  return { ...s, weekKey: wk, weekPresence: emptyWeek() }
}

/** Seg=0 ... Dom=6 */
export function mondayIndexFromDate(d: Date): number {
  let day = d.getDay()
  if (day === 0) day = 7
  return day - 1
}

export function effectiveProfile(s: ZonaXPState): UserProfileKind {
  if (s.profileManual) return s.profile
  return detectProfile(s.visits)
}

export function applyAchievementChecks(s: ZonaXPState): ZonaXPState {
  const ids = new Set(s.achievementsUnlocked)
  const totalMin = s.visits.reduce((a, v) => a + v.durationMinutes, 0)
  const maxDay =
    s.visits.length === 0 ? 0 : Math.max(...s.visits.map((v) => v.durationMinutes))

  const push = (id: string) => {
    if (ACHIEVEMENTS.some((a) => a.id === id)) ids.add(id)
  }

  if (s.visits.length > 0) push('first')
  if (s.streakDays >= 3) push('chama')
  if (maxDay >= 120) push('maratonista')
  if (totalMin >= 600) push('guardiao_mestre')
  if (s.streakDays >= 7) {
    push('rei')
    push('streak7')
  }
  if (s.purchaseBonusIds.length > 0) push('comprador')
  if (s.confirmedEventIds.length > 0) push('festivo')
  if (tierFromTotalXp(s.totalXp) === 'diamante') push('diamante')
  if (tierFromTotalXp(s.totalXp) === 'lenda') push('lenda')
  if (effectiveProfile(s) === 'explorador' && s.visits.length >= 2) push('explorador')
  if (effectiveProfile(s) === 'guardiao') push('guardiao')

  return { ...s, achievementsUnlocked: [...ids] }
}

export function addPurchaseBonusXp(s: ZonaXPState, purchaseId: string): ZonaXPState {
  if (s.purchaseBonusIds.includes(purchaseId)) return s
  const bonus = effectiveProfile(s) === 'explorador' ? 100 : 500
  const next = {
    ...s,
    totalXp: s.totalXp + bonus,
    todayXp: s.todayXp + bonus,
    purchaseBonusIds: [...s.purchaseBonusIds, purchaseId],
  }
  return applyAchievementChecks(resetDayIfNeeded(resetWeekIfNeeded(next)))
}

export function addEventConfirmXp(s: ZonaXPState, eventId: string): ZonaXPState {
  if (s.confirmedEventIds.includes(eventId)) return s
  const bonus = effectiveProfile(s) === 'explorador' ? 50 : 50
  const next = {
    ...s,
    totalXp: s.totalXp + bonus,
    todayXp: s.todayXp + bonus,
    confirmedEventIds: [...s.confirmedEventIds, eventId],
  }
  return applyAchievementChecks(resetDayIfNeeded(resetWeekIfNeeded(next)))
}

/** Acumula XP desde lastAccumulatedAt até now (ms). */
export function accumulateXp(
  s: ZonaXPState,
  now: number,
  insideZone: boolean,
  demoMode: boolean
): ZonaXPState {
  let state = resetDayIfNeeded(resetWeekIfNeeded({ ...s }))
  if (!state.sessionActive || (!insideZone && !demoMode)) {
    return { ...state, lastAccumulatedAt: now }
  }

  const profile = effectiveProfile(state)
  const basePerMin = profile === 'guardiao' ? 9 : 5
  let mult = 1
  if (state.streakDays >= 7) mult *= 1.5
  const xpPerMs = (basePerMin * mult) / 60_000

  const last = state.lastAccumulatedAt ?? state.sessionStartedAt ?? now
  const delta = Math.max(0, now - last)
  const gained = xpPerMs * delta

  const next: ZonaXPState = {
    ...state,
    totalXp: state.totalXp + gained,
    todayXp: state.todayXp + gained,
    lastAccumulatedAt: now,
    demoMode,
  }
  return applyAchievementChecks(next)
}

export function recordVisitEnd(s: ZonaXPState, sessionStart: number, sessionEnd: number): ZonaXPState {
  const minutes = Math.max(0, (sessionEnd - sessionStart) / 60_000)
  if (minutes < 0.5) return s

  const d = new Date(sessionStart)
  const date = localDateKey(d)
  const dayOfWeek = d.getDay()
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5

  const visit: VisitRecord = {
    id: `${sessionStart}-${sessionEnd}`,
    date,
    durationMinutes: Math.round(minutes),
    dayOfWeek,
    isWeekday,
  }

  let streakDays = s.streakDays
  let lastPresence = s.lastPresenceDate
  if (lastPresence !== date) {
    const prevDay = new Date(d)
    prevDay.setDate(prevDay.getDate() - 1)
    const yKey = localDateKey(prevDay)
    if (lastPresence === yKey) streakDays += 1
    else streakDays = 1
    lastPresence = date
  }

  const week = [...s.weekPresence] as boolean[]
  const wi = mondayIndexFromDate(d)
  if (wi >= 0 && wi < 7) week[wi] = true

  let next: ZonaXPState = {
    ...s,
    visits: [...s.visits, visit].slice(-200),
    streakDays,
    lastPresenceDate: lastPresence,
    weekPresence: week as ZonaXPState['weekPresence'],
  }

  if (!next.profileManual) {
    next = { ...next, profile: detectProfile(next.visits) }
  }
  return applyAchievementChecks(next)
}

export { todayKey, weekKey }
