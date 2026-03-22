import { CENTRO_ZONE } from './types'

export function isInsideCentroZone(lat: number, lng: number): boolean {
  return (
    lat >= CENTRO_ZONE.latMin &&
    lat <= CENTRO_ZONE.latMax &&
    lng >= CENTRO_ZONE.lngMin &&
    lng <= CENTRO_ZONE.lngMax
  )
}
