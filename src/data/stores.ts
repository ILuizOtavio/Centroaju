import { products } from './products'
import { storeLocationsByName, type StoreLocation } from './store-locations'

export type PartnerStore = {
  id: string
  name: string
  category: string
  emoji: string
  rating: number
  reviewCount: number
  productCount: number
  salesTotal: number
  blurb: string
  /** Bairro Centro de Aracaju */
  neighborhood: 'Centro'
} & StoreLocation

function aggregate(): PartnerStore[] {
  const map = new Map<string, { products: typeof products; sales: number }>()
  for (const p of products) {
    const cur = map.get(p.store) ?? { products: [] as typeof products, sales: 0 }
    cur.products.push(p)
    cur.sales += Math.round(15 + p.price * 3)
    map.set(p.store, cur)
  }
  const emojis = ['🏪', '🧵', '🍯', '🎶', '🎏', '🙏', '👕', '🥥']
  let i = 0
  return [...map.entries()].map(([name, v], idx) => {
    const avg =
      v.products.reduce((s, p) => s + p.rating, 0) / Math.max(1, v.products.length)
    const reviews = v.products.reduce((s, p) => s + p.reviewCount, 0)
    const loc = storeLocationsByName[name]
    if (!loc) {
      throw new Error(`[stores] Falta coordenada para a loja: ${name}`)
    }
    return {
      id: `loja-${idx + 1}`,
      name,
      category: v.products[0]?.category ?? 'Geral',
      emoji: emojis[i++ % emojis.length],
      rating: Math.round(avg * 10) / 10,
      reviewCount: reviews,
      productCount: v.products.length,
      salesTotal: v.sales,
      blurb: `Loja parceira do CentroAju no coração de Aracaju.`,
      neighborhood: 'Centro' as const,
      ...loc,
    }
  })
}

export const partnerStores: PartnerStore[] = aggregate()
