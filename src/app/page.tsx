import Link from 'next/link'
import { products } from '@/data/products'
import HomeSecondaryCta from '@/components/HomeSecondaryCta'

export default function Home() {
  const featured = products.slice(0, 4)

  return (
    <div>
      <section className="bg-gradient-to-b from-white to-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-[#666] sm:text-sm">
              Marketplace local
            </p>
            <h1 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-tight text-[#333] sm:text-4xl md:text-5xl">
              Tudo do centro num só lugar
            </h1>
            <p className="mt-4 text-base text-neutral-600 sm:text-lg">
              Gastronomia, artesanato, moda e muito mais — com a praticidade que você já conhece.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/produtos"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--ml-blue)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--ml-blue-hover)] touch-manipulation"
              >
                Ver ofertas
              </Link>
              <div className="w-full sm:w-auto [&>*]:w-full">
                <HomeSecondaryCta />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#333] sm:text-xl">Destaques</h2>
            <p className="text-sm text-neutral-500">Seleção do momento no CentroAju</p>
          </div>
          <Link
            href="/produtos"
            className="text-sm font-medium text-[var(--ml-blue)] hover:underline sm:self-end"
          >
            Ver tudo
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/produtos/${p.id}`}
              className="group rounded-lg border border-[var(--border-subtle)] bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="text-4xl">{p.emoji}</div>
              <h3 className="mt-3 font-semibold text-[#333] group-hover:text-[var(--ml-blue)]">
                {p.name}
              </h3>
              <p className="text-xs text-neutral-500">{p.store}</p>
              <p className="mt-2 text-lg font-bold text-[#00a650]">R$ {p.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h2 className="text-lg font-bold text-[#333]">Venda no CentroAju</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-600">
            Conecte sua loja a milhares de pessoas que circulam pelo centro todos os dias.
          </p>
          <Link
            href="/produtos"
            className="mt-6 inline-flex rounded-md bg-[var(--ml-yellow)] px-5 py-2.5 text-sm font-semibold text-[#333] transition hover:bg-[var(--ml-yellow-hover)]"
          >
            Explorar categorias
          </Link>
        </div>
      </section>
    </div>
  )
}
