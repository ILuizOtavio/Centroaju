'use client'

import dynamic from 'next/dynamic'
import type { PartnerStore } from '@/data/stores'

const CentroStoresMap = dynamic(() => import('@/components/CentroStoresMap'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-[var(--bege)] bg-[var(--cinza-q)] text-sm text-[var(--texto-sub)]">
      Carregando mapa…
    </div>
  ),
})

export default function LojasMapSection({ stores }: { stores: PartnerStore[] }) {
  return <CentroStoresMap stores={stores} />
}
