"use client"
import React, { useMemo } from 'react'

type Product = {
  id: string
  name: string
  price: number
  emoji?: string
  store: string
}

export default function Cart({
  items,
  onChange,
}: {
  items: Product[]
  onChange: (items: Product[]) => void
}) {
  const total = useMemo(() => items.reduce((s, p) => s + Number(p.price || 0), 0), [items])

  function removeAt(i: number) {
    const next = items.slice()
    next.splice(i, 1)
    onChange(next)
  }

  function clear() {
    onChange([])
  }

  function buildMessage() {
    if (!items.length) return 'Carrinho vazio'

    const lines = ['Pedido CentroAju:']
    items.forEach((p, idx) => {
      lines.push(`${idx + 1}. ${p.name} (${p.store}) - R$ ${Number(p.price).toFixed(2)}`)
    })
    lines.push(`Total: R$ ${total.toFixed(2)}`)
    return lines.join('\n')
  }

  const message = encodeURIComponent(buildMessage())
  const waLink = `https://wa.me/?text=${message}`

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--bege)] bg-white shadow-sm">
      <div className="border-b border-[var(--bege)] bg-[var(--cinza-q)] px-4 py-3">
        <h2 className="font-semibold text-[var(--ardosia)]">Seu carrinho</h2>
      </div>

      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--texto-sub)]">Seu carrinho está vazio.</p>
        ) : (
          <ul className="divide-y divide-[var(--bege)]">
            {items.map((p, i) => (
              <li key={`${p.id}-${i}`} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[var(--ardosia)]">{p.name}</div>
                  <div className="text-xs text-[var(--texto-sub)]">
                    {p.store} • R$ {Number(p.price).toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="shrink-0 rounded-md border border-[var(--bege)] px-2 py-1 text-xs font-medium text-[var(--ardosia)] hover:bg-[var(--cinza-q)]"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--bege)] bg-[var(--cinza-q)] px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4">
        <div className="text-sm text-[var(--ardosia)]">
          Total: <strong className="text-lg text-[var(--verde-xp)]">R$ {total.toFixed(2)}</strong>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={clear}
            className="min-h-11 touch-manipulation rounded-md border border-[var(--bege)] bg-white px-3 py-2 text-sm font-medium text-[var(--ardosia)] hover:bg-[var(--offwhite)] sm:min-h-10"
          >
            Limpar
          </button>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center justify-center rounded-md bg-[var(--terracota)] px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[var(--ml-blue-hover)] touch-manipulation sm:min-h-10"
          >
            Enviar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
