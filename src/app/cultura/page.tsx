import { culturaSections } from '@/data/cultura'

export default function CulturaPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-8">
      <header className="mb-8 text-center sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--terracota)]">Raízes sergipanas</p>
        <h1 className="text-2xl text-[var(--ardosia)] sm:text-3xl">Cultura & costumes</h1>
        <p className="mt-2 text-sm text-[var(--texto-sub)]">
          Identidade sergipana — o que torna o CentroAju mais que um marketplace.
        </p>
      </header>

      <div className="space-y-6 sm:space-y-8">
        {culturaSections.map((s) => (
          <article
            key={s.id}
            className="rounded-xl border border-[var(--bege)] bg-white p-4 shadow-sm sm:p-6"
          >
            <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-[var(--ardosia)] sm:text-xl">
              <span className="text-3xl" aria-hidden>
                {s.icon}
              </span>
              {s.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--texto-sub)]">{s.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
