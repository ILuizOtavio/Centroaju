'use client'

import { useCallback, useMemo, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api'
import type { PartnerStore } from '@/data/stores'
import { CENTRO_ARACAJU_BOUNDS } from '@/data/store-locations'

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '360px',
}

const center = {
  lat: (CENTRO_ARACAJU_BOUNDS.south + CENTRO_ARACAJU_BOUNDS.north) / 2,
  lng: (CENTRO_ARACAJU_BOUNDS.west + CENTRO_ARACAJU_BOUNDS.east) / 2,
}

const polygonPath = [
  { lat: CENTRO_ARACAJU_BOUNDS.south, lng: CENTRO_ARACAJU_BOUNDS.west },
  { lat: CENTRO_ARACAJU_BOUNDS.south, lng: CENTRO_ARACAJU_BOUNDS.east },
  { lat: CENTRO_ARACAJU_BOUNDS.north, lng: CENTRO_ARACAJU_BOUNDS.east },
  { lat: CENTRO_ARACAJU_BOUNDS.north, lng: CENTRO_ARACAJU_BOUNDS.west },
]

// ✅ Fora do componente — referências estáveis, sem recriar a cada render
const libraries: ('geometry' | 'places')[] = []
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

type Props = {
  stores: PartnerStore[]
}

export default function CentroStoresMap({ stores }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'centroaju-maps',
    googleMapsApiKey: API_KEY,
    libraries,
  })

  const [activeId, setActiveId] = useState<string | null>(null)

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      restriction: {
        latLngBounds: {
          north: CENTRO_ARACAJU_BOUNDS.north + 0.02,
          south: CENTRO_ARACAJU_BOUNDS.south - 0.02,
          east: CENTRO_ARACAJU_BOUNDS.east + 0.02,
          west: CENTRO_ARACAJU_BOUNDS.west - 0.02,
        },
        strictBounds: false,
      },
    }),
    []
  )

  const onMapClick = useCallback(() => setActiveId(null), [])

  if (!API_KEY) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50/80 p-8 text-center text-sm text-amber-900">
        <p className="font-semibold">Mapa indisponível</p>
        <p className="mt-2 max-w-md">
          Defina a variável de ambiente{' '}
          <code className="rounded bg-white px-1 py-0.5 text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> com
          uma chave da Google Maps JavaScript API (Maps JavaScript API + Places opcional).
        </p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        Não foi possível carregar o Google Maps. Verifique a chave e a faturação do projeto Google Cloud.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-neutral-100 text-sm text-neutral-600">
        Carregando mapa…
      </div>
    )
  }

  return (
    <div className="h-[min(55dvh,480px)] min-h-[240px] w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-sm sm:min-h-[320px] md:h-[min(70vh,520px)] md:min-h-[360px]">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={mapOptions}
        onClick={onMapClick}
      >
        <Polygon
          paths={polygonPath}
          options={{
            fillColor: '#FFE600',
            fillOpacity: 0.12,
            strokeColor: '#3483FA',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
          }}
        />
        {stores.map((loja) => (
          <Marker
            key={loja.id}
            position={{ lat: loja.lat, lng: loja.lng }}
            title={`${loja.emoji} ${loja.name}`}
            onClick={() => setActiveId(loja.id)}
          />
        ))}
        {activeId
          ? (() => {
              const loja = stores.find((s) => s.id === activeId)
              if (!loja) return null
              return (
                <InfoWindow
                  position={{ lat: loja.lat, lng: loja.lng }}
                  onCloseClick={() => setActiveId(null)}
                >
                  <div className="max-w-[220px] p-1 text-[13px] text-[#333]">
                    <div className="font-bold">
                      {loja.emoji} {loja.name}
                    </div>
                    <div className="mt-1 text-xs text-neutral-600">{loja.address}</div>
                    <div className="mt-1 text-xs text-neutral-500">Bairro {loja.neighborhood}</div>
                    <div className="mt-1 text-xs">
                      ★ {loja.rating.toFixed(1)} · {loja.productCount} produtos no app
                    </div>
                  </div>
                </InfoWindow>
              )
            })()
          : null}
      </GoogleMap>
    </div>
  )
}