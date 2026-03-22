export type UserProfileKind = 'explorador' | 'guardiao'

export type RankTier = 'visitante' | 'frequente' | 'ouro' | 'diamante' | 'lenda'

export type VisitRecord = {
  id: string
  date: string
  /** minutos na zona naquele dia */
  durationMinutes: number
  /** 0 = dom ... 6 = sáb */
  dayOfWeek: number
  /** se dia útil (seg-sex) */
  isWeekday: boolean
}

export type ZonaXPState = {
  version: 1
  totalXp: number
  /** XP acumulado no dia (reset por data) */
  todayXp: number
  todayKey: string
  sessionActive: boolean
  sessionStartedAt: number | null
  lastAccumulatedAt: number | null
  demoMode: boolean
  /** perfil efetivo após detecção / override */
  profile: UserProfileKind
  profileManual: boolean
  visits: VisitRecord[]
  /** streak de dias consecutivos com presença */
  streakDays: number
  lastPresenceDate: string | null
  /** presença nesta semana (índice 0 = segunda) */
  weekPresence: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
  weekKey: string
  achievementsUnlocked: string[]
  confirmedEventIds: string[]
  /** compras contabilizadas para XP bônus (id produto+timestamp) */
  purchaseBonusIds: string[]
}

export const STORAGE_KEY = 'ca_zona_xp_v1'

export const CENTRO_ZONE = {
  latMin: -10.923,
  latMax: -10.905,
  lngMin: -37.062,
  lngMax: -37.043,
} as const
