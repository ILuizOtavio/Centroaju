"use client"
import React, { useMemo, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { products, type Product } from '@/data/products'
import { notifyCartChanged } from '@/lib/cart-events'
import { grantPurchaseXp } from '@/lib/zona-xp/client-actions'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [cartCount, setCartCount] = useState(0)

  const product = useMemo(() => products.find((p) => p.id === productId), [productId])

  const reviews = useMemo(
    () => [
      { id: 'r1', author: 'Ana', rating: 5, comment: 'Adorei! Entrega rápida e produto de qualidade.' },
      { id: 'r2', author: 'João', rating: 4, comment: 'Bom produto, mas demorou um pouco para chegar.' },
    ],
    []
  )

  useEffect(() => {
    const raw = localStorage.getItem('ca_cart') || '[]'
    try {
      const arr = JSON.parse(raw)
      setCartCount(Array.isArray(arr) ? arr.length : 0)
    } catch {
      setCartCount(0)
    }
  }, [])

  async function handleAdd(product: Product) {
    const raw = localStorage.getItem('ca_cart') || '[]'
    const arr = JSON.parse(raw)
    arr.push(product)
    localStorage.setItem('ca_cart', JSON.stringify(arr))
    setCartCount(arr.length)
    notifyCartChanged({ productName: product.name })
    grantPurchaseXp(product.id)
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-[var(--ardosia)]">Produto não encontrado.</p>
        <Link href="/produtos" className="mt-4 inline-block text-[var(--terracota)] hover:underline">
          Voltar aos produtos
        </Link>
      </div>
    )
  }

  const waMessage = encodeURIComponent(
    `Olá, gostaria de saber mais sobre o produto ${product.name} da loja ${product.store} (R$ ${product.price.toFixed(2)}).`
  )
  const waLink = `https://wa.me/?text=${waMessage}`

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
      <nav className="mb-4 text-sm text-[var(--texto-sub)] sm:mb-6">
        <Link href="/produtos" className="text-[var(--terracota)] hover:underline">
          Produtos
        </Link>
        <span className="mx-2 text-[var(--texto-sub)]/70">/</span>
        <span className="line-clamp-2 text-[var(--ardosia)]">{product.name}</span>
      </nav>

      <div className="overflow-hidden rounded-xl border border-[var(--bege)] bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 md:flex-row md:p-10">
          <div className="flex flex-shrink-0 items-center justify-center rounded-lg bg-[var(--cinza-q)] p-6 sm:p-8 md:w-[280px]">
            <span className="text-[88px] leading-none sm:text-[120px] md:text-[140px]" aria-hidden>
              {product.emoji}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            {product.badge ? (
              <span className="mb-2 inline-block rounded bg-[var(--ouro)]/90 px-2 py-0.5 text-xs font-semibold uppercase text-[var(--ardosia)]">
                {product.badge === 'promo' ? 'Promo' : product.badge === 'novo' ? 'Novo' : 'Destaque'}
              </span>
            ) : null}
            <h1 className="text-2xl font-bold leading-tight text-[var(--ardosia)] sm:text-3xl md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-amber-600">
              ★ {product.rating.toFixed(1)} · {product.reviewCount} avaliações
            </p>
            <p className="mt-3 text-3xl font-light text-[var(--verde-xp)]">R$ {product.price.toFixed(2)}</p>
            <p className="mt-2 text-sm text-[var(--texto-sub)]">
              Vendido por <span className="font-medium text-[var(--ardosia)]">{product.store}</span>
            </p>
            <p className="mt-1 text-xs text-[var(--texto-sub)]">{product.category}</p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <button
                type="button"
                onClick={() => handleAdd(product)}
                className="min-h-12 flex-1 touch-manipulation rounded-md bg-[var(--terracota)] py-3.5 text-center text-base font-semibold text-white transition hover:bg-[var(--ml-blue-hover)]"
              >
                Adicionar ao carrinho
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 flex-1 items-center justify-center rounded-md border-2 border-[var(--verde-xp)] py-3.5 text-center text-base font-semibold text-[var(--verde-xp)] transition hover:bg-[var(--verde-xp)]/5 touch-manipulation"
              >
                Perguntar no WhatsApp
              </a>
            </div>
            <p className="mt-4 text-xs text-[var(--texto-sub)]">{cartCount} item(ns) no carrinho</p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-[var(--ardosia)]">Avaliações</h2>
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-[var(--bege)] bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--ardosia)]">{review.author}</span>
                <span className="text-yellow-500" aria-label={`${review.rating} de 5 estrelas`}>
                  {'★'.repeat(review.rating)}
                  <span className="text-[var(--texto-sub)]/40">{'★'.repeat(5 - review.rating)}</span>
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--texto-sub)]">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
