import type { RankTier } from './types'

export const RANK_ORDER: RankTier[] = ['visitante', 'frequente', 'ouro', 'diamante', 'lenda']

export const RANK_THRESHOLDS: Record<RankTier, number> = {
  visitante: 0,
  frequente: 800,
  ouro: 3500,
  diamante: 9000,
  lenda: 20000,
}

export const RANK_LABELS: Record<RankTier, string> = {
  visitante: 'Visitante',
  frequente: 'Frequente',
  ouro: 'Ouro',
  diamante: 'Diamante',
  lenda: 'Lenda',
}

/** Do maior para o menor — evita que qualquer XP ≥ 0 caia em “Lenda”. */
const HIGH_TO_LOW: RankTier[] = ['lenda', 'diamante', 'ouro', 'frequente', 'visitante']

export function tierFromTotalXp(totalXp: number): RankTier {
  for (const t of HIGH_TO_LOW) {
    if (totalXp >= RANK_THRESHOLDS[t]) return t
  }
  return 'visitante'
}

export function nextTierProgress(totalXp: number): {
  tier: RankTier
  next: RankTier | null
  currentMin: number
  nextMin: number | null
  pct: number
} {
  const tier = tierFromTotalXp(totalXp)
  const idx = RANK_ORDER.indexOf(tier)
  const next = idx < RANK_ORDER.length - 1 ? RANK_ORDER[idx + 1] : null
  const currentMin = RANK_THRESHOLDS[tier]
  const nextMin = next ? RANK_THRESHOLDS[next] : null
  let pct = 1
  if (next && nextMin !== null) {
    pct = (totalXp - currentMin) / (nextMin - currentMin)
    pct = Math.min(1, Math.max(0, pct))
  }
  return { tier, next, currentMin, nextMin, pct }
}
