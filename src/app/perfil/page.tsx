'use client'

export default function Perfil() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="overflow-hidden rounded-2xl border border-[var(--bege)] bg-[var(--offwhite)] shadow-sm">
        <div className="bg-[var(--ardosia)] px-6 pb-6 pt-8 text-center">
          <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-[var(--terracota)] text-4xl">
            👤
          </div>
          <h1 className="text-3xl text-[var(--offwhite)]">Maria da Silva</h1>
          <p className="mt-2 inline-flex items-center gap-1 rounded-full border border-[var(--verde-xp)]/35 bg-[var(--verde-xp)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--verde-xp-v)]">
            🗺 Exploradora do Centro
          </p>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div className="rounded-xl border border-[var(--bege)] bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-[var(--texto-sub)]">
              <span>Progresso XP</span>
              <span>1.240 / 2.000 XP</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--bege)]">
              <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[var(--verde-xp)] to-[var(--ouro)]" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--bege)] bg-white p-4 text-center">
              <div className="text-2xl font-bold text-[var(--ardosia)]">1.240</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--texto-sub)]">XP Total</div>
            </div>
            <div className="rounded-lg border border-[var(--bege)] bg-white p-4 text-center">
              <div className="text-2xl font-bold text-[var(--ardosia)]">Ouro</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--texto-sub)]">Nível</div>
            </div>
            <div className="rounded-lg border border-[var(--bege)] bg-white p-4 text-center">
              <div className="text-2xl font-bold text-[var(--ardosia)]">🔥 3</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--texto-sub)]">Streak</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
