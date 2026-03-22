'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cart from '../../components/Cart'
import { supabase } from '@/lib/supabase/client'
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
  const [user, setUser] = useState<{ id: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadCart = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)

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

      if (data.user) {
        const { data: userCart, error } = await supabase
          .from('carts')
          .select('items')
          .eq('user_id', data.user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user cart from Supabase', error)
        } else if (userCart) {
          loadedCart = userCart.items as Product[]
          localStorage.setItem('ca_cart', JSON.stringify(loadedCart))
        }
      }
      setCartItems(loadedCart)
    }

    loadCart()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.refresh()
      } else {
        setUser(null)
        setCartItems([])
        localStorage.removeItem('ca_cart')
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router])

  async function handleCartChange(newItems: Product[]) {
    setCartItems(newItems)
    localStorage.setItem('ca_cart', JSON.stringify(newItems))
    notifyCartChanged()

    if (user) {
      try {
        await supabase.from('carts').upsert({ user_id: user.id, items: newItems })
      } catch (e) {
        console.warn('Failed to persist cart to Supabase', e)
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#333] sm:text-2xl">Carrinho de compras</h1>
          <p className="text-sm text-neutral-600">Revise seus itens antes de finalizar</p>
        </div>
        <Link
          href="/produtos"
          className="text-sm font-medium text-[var(--ml-blue)] hover:underline sm:shrink-0"
        >
          Continuar comprando
        </Link>
      </div>
      <Cart items={cartItems} onChange={handleCartChange} />
    </div>
  )
}
