'use client'

import dynamic from 'next/dynamic'
import type { PartnerStore } from '@/data/stores'

const CentroStoresMap = dynamic(() => import('@/components/CentroStoresMap'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-neutral-100 text-sm text-neutral-600">
      Carregando mapa…
    </div>
  ),
})

export default function LojasMapSection({ stores }: { stores: PartnerStore[] }) {
  return <CentroStoresMap stores={stores} />
}
