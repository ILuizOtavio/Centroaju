'use client'
import React, { useEffect, useState } from 'react'
import Cart from '../../components/Cart'
import Link from 'next/link'
import { notifyCartChanged } from '@/lib/cart-events'

type Product = {
  id: string
  name: string
  price: number
  emoji?: string
  store: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Product[]>([])

  useEffect(() => {
    const loadCart = () => {
      let loadedCart: Product[] = []
      const raw = localStorage.getItem('ca_cart')
      if (raw) {
        try {
          loadedCart = JSON.parse(raw)
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e)
          localStorage.removeItem('ca_cart')
        }
      }

      setCartItems(loadedCart)
    }

    loadCart()
  }, [])

  async function handleCartChange(newItems: Product[]) {
    setCartItems(newItems)
    localStorage.setItem('ca_cart', JSON.stringify(newItems))
    notifyCartChanged()

  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--terracota)]">Compras</p>
          <h1 className="text-2xl text-[var(--ardosia)] sm:text-3xl">Carrinho</h1>
          <p className="text-sm text-[var(--texto-sub)]">Revise seus itens antes de finalizar</p>
        </div>
        <Link
          href="/produtos"
          className="text-sm font-medium text-[var(--terracota)] hover:underline sm:shrink-0"
        >
          Continuar comprando
        </Link>
      </div>
      <Cart items={cartItems} onChange={handleCartChange} />
    </div>
  )
}
