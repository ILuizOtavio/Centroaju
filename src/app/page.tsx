import Link from 'next/link'
import { products } from '@/data/products'
import HomeSecondaryCta from '@/components/HomeSecondaryCta'

export default function Home() {
  const featured = products.slice(0, 4)

  return (
    <div>
      <section className="bg-[var(--ardosia)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full border border-[var(--ouro)]/30 bg-[var(--ouro)]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[var(--ouro-v)] sm:text-sm">
              O pulso do centro de Aracaju
            </p>
            <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-tight text-[var(--offwhite)] sm:text-5xl md:text-6xl">
              O melhor do centro,
              <br />
              <span className="text-[var(--terracota-v)]">CentroAju</span>
            </h1>
            <p className="mt-4 text-base text-[var(--offwhite)]/70 sm:text-lg">
              Produtos autênticos de Sergipe, das melhores lojas do centro de Aracaju. Artesanato,
              moda, gastronomia, cultura e muito mais.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/produtos"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--terracota)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-[var(--ml-blue-hover)] touch-manipulation"
              >
                Explorar produtos
              </Link>
              <div className="w-full sm:w-auto [&>*]:w-full">
                <HomeSecondaryCta />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--terracota)]">
              Mais vendidos agora
            </p>
            <h2 className="text-2xl text-[var(--ardosia)] sm:text-3xl">Destaques do Centro</h2>
          </div>
          <Link
            href="/produtos"
            className="text-sm font-semibold uppercase tracking-wide text-[var(--ardosia)] underline decoration-[var(--terracota)] decoration-2 underline-offset-4 sm:self-end"
          >
            Ver tudo
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/produtos/${p.id}`}
              className="group rounded-xl border border-[var(--bege)] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl">{p.emoji}</div>
              <h3 className="mt-3 font-semibold text-[var(--texto)] group-hover:text-[var(--terracota)]">
                {p.name}
              </h3>
              <p className="text-xs uppercase tracking-wide text-[var(--terracota)]">{p.store}</p>
              <p className="mt-2 text-lg font-bold text-[var(--ardosia)]">R$ {p.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--bege)] bg-[var(--creme-f)]">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h2 className="text-2xl text-[var(--ardosia)]">Venda no CentroAju</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--texto-sub)]">
            Conecte sua loja a milhares de pessoas que circulam pelo centro todos os dias.
          </p>
          <Link
            href="/produtos"
            className="mt-6 inline-flex rounded-md bg-[var(--ouro)] px-5 py-2.5 text-sm font-semibold text-[var(--ardosia)] transition hover:bg-[var(--ouro-v)]"
          >
            Explorar categorias
          </Link>
        </div>
      </section>
    </div>
  )
}
