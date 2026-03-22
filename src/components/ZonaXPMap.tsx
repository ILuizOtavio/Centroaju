'use client'

import { useEffect, useRef } from 'react'

interface Props {
  userLat: number | null
  userLng: number | null
  inside: boolean
}

const CENTRO_POLYGON: [number, number][] = [
  [-10.923, -37.062],
  [-10.923, -37.043],
  [-10.905, -37.043],
  [-10.905, -37.062],
]

const CENTER: [number, number] = [-10.914, -37.0525]

export default function ZonaXPMap({ userLat, userLng, inside }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const circleRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        center: CENTER,
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      L.polygon(CENTRO_POLYGON, {
        color: '#3483FA',
        weight: 2,
        fillColor: '#FFE600',
        fillOpacity: 0.12,
      }).addTo(map)

      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      markerRef.current = null
      circleRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || userLat === null || userLng === null) return

    import('leaflet').then((L) => {
      const color = inside ? '#00a650' : '#ef4444'

      if (markerRef.current) {
        markerRef.current.setLatLng([userLat, userLng])
        circleRef.current?.setLatLng([userLat, userLng])
        circleRef.current?.setStyle({ color, fillColor: color })
      } else {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:16px;height:16px;border-radius:50%;
            background:${color};border:3px solid white;
            box-shadow:0 0 6px rgba(0,0,0,0.4)
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        markerRef.current = L.marker([userLat, userLng], { icon }).addTo(mapRef.current)

        circleRef.current = L.circle([userLat, userLng], {
          radius: 30,
          color,
          fillColor: color,
          fillOpacity: 0.2,
          weight: 1,
        }).addTo(mapRef.current)

        mapRef.current.setView([userLat, userLng], 16)
      }
    })
  }, [userLat, userLng, inside])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div
        ref={containerRef}
        className="h-[220px] w-full rounded-xl overflow-hidden border border-[var(--border-subtle)] sm:h-[260px]"
      />
    </>
  )
}