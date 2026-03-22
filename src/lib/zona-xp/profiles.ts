import type { UserProfileKind, VisitRecord } from './types'

/** Guardião: 3+ visitas com ≥6h em dias úteis */
export function detectProfile(visits: VisitRecord[]): UserProfileKind {
  const longWeekday = visits.filter((v) => v.isWeekday && v.durationMinutes >= 360)
  if (longWeekday.length >= 3) return 'guardiao'
  return 'explorador'
}

export function xpPerMinute(profile: UserProfileKind): number {
  return profile === 'guardiao' ? 9 : 5
}
