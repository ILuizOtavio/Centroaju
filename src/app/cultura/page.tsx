import { culturaSections } from '@/data/cultura'

export default function CulturaPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-8">
      <header className="mb-8 text-center sm:mb-10">
        <h1 className="text-2xl font-bold text-[#333] sm:text-3xl">Cultura & costumes</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Identidade sergipana — o que torna o CentroAju mais que um marketplace.
        </p>
      </header>

      <div className="space-y-6 sm:space-y-8">
        {culturaSections.map((s) => (
          <article
            key={s.id}
            className="rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:p-6"
          >
            <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-[#333] sm:text-xl">
              <span className="text-3xl" aria-hidden>
                {s.icon}
              </span>
              {s.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-700">{s.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
