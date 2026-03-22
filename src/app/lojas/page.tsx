import Link from 'next/link'
import { partnerStores } from '@/data/stores'
import LojasMapSection from '@/components/LojasMapSection'

export default function LojasPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--terracota)]">Parceiros do Centro</p>
        <h1 className="text-2xl text-[var(--ardosia)] sm:text-3xl">Lojas parceiras</h1>
        <p className="mt-1 text-sm text-[var(--texto-sub)]">
          Lojas cadastradas no <strong>Centro de Aracaju</strong> — mapa interativo com Google Maps.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-[var(--ardosia)]">Mapa do Centro</h2>
        <p className="mb-4 text-sm text-[var(--texto-sub)]">
          A área destacada em amarelo/azul corresponde à zona central usada na Zona XP. Marcadores: lojas
          parceiras com endereço de referência no bairro Centro.
        </p>
        <LojasMapSection stores={partnerStores} />
      </section>

      <h2 className="mb-4 text-lg font-semibold text-[var(--ardosia)]">Todas as lojas</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partnerStores.map((loja) => (
          <article
            key={loja.id}
            className="flex flex-col rounded-xl border border-[var(--bege)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ouro)]/80 text-2xl">
                {loja.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-[var(--ardosia)]">{loja.name}</h2>
                <p className="text-xs text-[var(--texto-sub)]">
                  {loja.category} · {loja.neighborhood}
                </p>
                <p className="mt-1 text-xs text-[var(--texto-sub)]">{loja.address}</p>
                <p className="mt-1 text-sm text-amber-600">
                  ★ {loja.rating.toFixed(1)} <span className="text-[var(--texto-sub)]/70">({loja.reviewCount})</span>
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--texto-sub)]">{loja.blurb}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-[var(--texto-sub)]">
              <div>
                <dt className="font-medium text-[var(--ardosia)]">Produtos</dt>
                <dd>{loja.productCount}</dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--ardosia)]">Vendas (est.)</dt>
                <dd>{loja.salesTotal}</dd>
              </div>
            </dl>
            <Link
              href="/produtos"
              className="mt-4 text-center text-sm font-medium text-[var(--terracota)] hover:underline"
            >
              Ver produtos desta loja →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
