import Link from 'next/link'
import { partnerStores } from '@/data/stores'
import LojasMapSection from '@/components/LojasMapSection'

export default function LojasPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-[#333] sm:text-3xl">Lojas parceiras</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Lojas cadastradas no <strong>Centro de Aracaju</strong> — mapa interativo com Google Maps.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-[#333]">Mapa do Centro</h2>
        <p className="mb-4 text-sm text-neutral-600">
          A área destacada em amarelo/azul corresponde à zona central usada na Zona XP. Marcadores: lojas
          parceiras com endereço de referência no bairro Centro.
        </p>
        <LojasMapSection stores={partnerStores} />
      </section>

      <h2 className="mb-4 text-lg font-semibold text-[#333]">Todas as lojas</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partnerStores.map((loja) => (
          <article
            key={loja.id}
            className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ml-yellow)]/80 text-2xl">
                {loja.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-[#333]">{loja.name}</h2>
                <p className="text-xs text-neutral-500">
                  {loja.category} · {loja.neighborhood}
                </p>
                <p className="mt-1 text-xs text-neutral-600">{loja.address}</p>
                <p className="mt-1 text-sm text-amber-600">
                  ★ {loja.rating.toFixed(1)} <span className="text-neutral-400">({loja.reviewCount})</span>
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-600">{loja.blurb}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <div>
                <dt className="font-medium text-[#333]">Produtos</dt>
                <dd>{loja.productCount}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#333]">Vendas (est.)</dt>
                <dd>{loja.salesTotal}</dd>
              </div>
            </dl>
            <Link
              href="/produtos"
              className="mt-4 text-center text-sm font-medium text-[var(--ml-blue)] hover:underline"
            >
              Ver produtos desta loja →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
