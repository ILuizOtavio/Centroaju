"use client"
import React from "react";
import Link from "next/link";
import type { Product } from "@/data/products";

function Stars({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span className="flex items-center gap-0.5 text-amber-500" aria-label={`${value.toFixed(1)} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? "★" : i === full && half ? "⯪" : "☆"}</span>
      ))}
    </span>
  )
}

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd?: (p: Product) => void;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--bege)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/produtos/${product.id}`} className="block flex-1 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[var(--cinza-q)] text-4xl">
            {product.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-snug text-[var(--texto)]">{product.name}</h3>
            <p className="text-xs uppercase tracking-wide text-[var(--terracota)]">{product.store}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--texto-sub)]">
              <Stars value={product.rating} />
              <span className="tabular-nums">({product.reviewCount})</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-[var(--ardosia)]">R$ {product.price.toFixed(2)}</span>
              {product.badge ? (
                <span className="rounded bg-[var(--ouro)]/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--ardosia)]">
                  {product.badge === "promo"
                    ? "Promo"
                    : product.badge === "novo"
                      ? "Novo"
                      : "Destaque"}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col gap-2 border-t border-[var(--bege)] bg-[var(--cinza-q)]/70 p-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => onAdd?.(product)}
          className="min-h-10 flex-1 touch-manipulation rounded-md bg-[var(--terracota)] py-2 text-sm font-semibold text-white transition hover:bg-[var(--ml-blue-hover)] sm:min-h-0"
        >
          Adicionar
        </button>
        <a
          href={`https://wa.me/?text=Quero%20comprar%20${encodeURIComponent(product.name)}%20da%20loja%20${encodeURIComponent(product.store)}%20-%20preço%20R$%20${product.price.toFixed(2)}`}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-10 items-center justify-center rounded-md border border-[var(--bege)] bg-white px-3 py-2 text-center text-sm font-medium text-[var(--ardosia)] transition hover:bg-[var(--offwhite)] touch-manipulation sm:min-h-0"
        >
          WhatsApp
        </a>
      </div>
    </article>
  );
}
