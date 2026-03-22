// src/lib/geo.ts
// Funções PURAS — sem Supabase, sem useEffect, sem side effects.
// Testável isoladamente com qualquer lat/lng.

// ------------------------------------------------------------
// Bounds do centro de Aracaju
// Ajuste os valores se o polígono precisar ser refinado.
// ------------------------------------------------------------
export const CENTRO_BOUNDS = {
  lat_min: -10.9230,
  lat_max: -10.9050,
  lng_min: -37.0620,
  lng_max: -37.0430,
}

// ------------------------------------------------------------
// XP por minuto por tipo de perfil
// ------------------------------------------------------------
export const XP_RATE = {
  explorador: 5,
  guardiao: 9,
} as const

// ------------------------------------------------------------
// Verifica se uma coordenada está dentro do centro
// ------------------------------------------------------------
export function isInsideCentro(lat: number, lng: number): boolean {
  const b = CENTRO_BOUNDS
  return (
    lat >= b.lat_min &&
    lat <= b.lat_max &&
    lng >= b.lng_min &&
    lng <= b.lng_max
  )
}

// ------------------------------------------------------------
// Detecta o perfil do usuário baseado no histórico de sessões
// Guardião = 3 ou mais sessões com >= 6h (21600s)
// ------------------------------------------------------------
export function detectProfile(
  sessions: { duration_sec: number }[]
): 'guardiao' | 'explorador' {
  const longSessions = sessions.filter((s) => s.duration_sec >= 21600)
  return longSessions.length >= 3 ? 'guardiao' : 'explorador'
}

// ------------------------------------------------------------
// Calcula o XP ganho em uma sessão
// ------------------------------------------------------------
export function calcXP(
  durationSec: number,
  profileType: 'guardiao' | 'explorador'
): number {
  const minutes = Math.floor(durationSec / 60)
  return minutes * XP_RATE[profileType]
}