export type LeaderRow = {
  rank: number
  name: string
  xpToday: number
  kind: 'explorador' | 'guardiao'
  isYou?: boolean
}

const MOCK_NAMES = [
  'Ana do Mercado',
  'Zé da Tapioca',
  'Maria Renda',
  'João Forró',
  'Lúcia Artesanato',
  'Pedro Centro',
  'Carla Praça',
  'Rita Doces',
]

export function buildDailyLeaderboard(userXp: number, userLabel = 'Você'): LeaderRow[] {
  const base: LeaderRow[] = MOCK_NAMES.map((name, i) => ({
    rank: 0,
    name,
    xpToday: Math.max(80, Math.round(420 - i * 38 + (i % 3) * 17)),
    kind: (i % 4 === 0 ? 'guardiao' : 'explorador') as LeaderRow['kind'],
  }))

  base.push({
    rank: 0,
    name: userLabel,
    xpToday: Math.round(userXp),
    kind: 'explorador',
    isYou: true,
  })

  base.sort((a, b) => b.xpToday - a.xpToday)
  return base.map((row, i) => ({ ...row, rank: i + 1 }))
}
