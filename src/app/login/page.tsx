import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="rounded-2xl border border-[var(--bege)] bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--terracota)]">Perfil simulado</p>
        <h1 className="mt-2 text-3xl text-[var(--ardosia)]">CentroAju</h1>
        <p className="mt-3 text-sm text-[var(--texto-sub)]">
          O login foi desativado nesta versão. O perfil e a gamificação funcionam em modo simulado.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/produtos"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--terracota)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--ml-blue-hover)]"
          >
            Ir para produtos
          </Link>
          <Link
            href="/zona-xp"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--bege)] px-4 py-2 text-sm font-medium text-[var(--ardosia)] transition hover:bg-[var(--offwhite)]"
          >
            Abrir Zona XP
          </Link>
        </div>
      </div>
    </div>
  )
}
