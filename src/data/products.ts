export type Product = {
  id: string
  name: string
  price: number
  emoji: string
  store: string
  category: string
  badge?: 'novo' | 'promo' | 'destaque'
  /** 0–5 */
  rating: number
  reviewCount: number
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Panelada do Zé',
    price: 25.0,
    emoji: '🥘',
    store: 'Cantinho do Zé',
    category: 'Gastronomia Típica',
    badge: 'novo',
    rating: 4.8,
    reviewCount: 62,
  },
  {
    id: 'p2',
    name: 'Renda Renascença (mini)',
    price: 45.0,
    emoji: '🧵',
    store: 'Ateliê Maria',
    category: 'Moda & Renda',
    rating: 4.9,
    reviewCount: 34,
  },
  {
    id: 'p3',
    name: 'Cocada Cremosa',
    price: 8.5,
    emoji: '🥥',
    store: 'Doces da Praça',
    category: 'Doces & Quitutes',
    rating: 4.7,
    reviewCount: 128,
  },
  {
    id: 'p4',
    name: 'Cerâmica Artesanal',
    price: 70.0,
    emoji: '🪴',
    store: 'Cerâmica do Centro',
    category: 'Artesanato',
    badge: 'promo',
    rating: 4.6,
    reviewCount: 41,
  },
  {
    id: 'p5',
    name: 'Tapioca Recheada',
    price: 12.0,
    emoji: '🥞',
    store: 'Banca do Chico',
    category: 'Gastronomia Típica',
    rating: 4.5,
    reviewCount: 210,
  },
  {
    id: 'p6',
    name: 'Forró Mix (CD)',
    price: 20.0,
    emoji: '🎶',
    store: 'Música do Povo',
    category: 'Música & Arte',
    rating: 4.4,
    reviewCount: 19,
  },
  {
    id: 'p7',
    name: 'Bandeira de São João',
    price: 35.0,
    emoji: '🎏',
    store: 'Armazém do Sertão',
    category: 'Festa Junina',
    badge: 'destaque',
    rating: 4.8,
    reviewCount: 55,
  },
  {
    id: 'p8',
    name: 'Garrafada Tradicional',
    price: 18.0,
    emoji: '🍯',
    store: 'Ervas da Praça',
    category: 'Natureza & Saúde',
    rating: 4.3,
    reviewCount: 88,
  },
  {
    id: 'p9',
    name: 'Terço de Balão + Imagem',
    price: 22.0,
    emoji: '🙏',
    store: 'Casa de Artigos Religiosos',
    category: 'Religiosidade',
    rating: 4.9,
    reviewCount: 72,
  },
  {
    id: 'p10',
    name: 'Bolo de Fubá Cremoso',
    price: 16.0,
    emoji: '🍰',
    store: 'Confeitaria da Matriz',
    category: 'Doces & Quitutes',
    badge: 'novo',
    rating: 4.6,
    reviewCount: 44,
  },
  {
    id: 'p11',
    name: 'Miniatura Boi de Mamão',
    price: 95.0,
    emoji: '🐂',
    store: 'Arte Popular Sergipe',
    category: 'Artesanato',
    badge: 'destaque',
    rating: 5.0,
    reviewCount: 12,
  },
  {
    id: 'p12',
    name: 'Camisa Xadrez Forró',
    price: 59.9,
    emoji: '👕',
    store: 'Moda Nordeste',
    category: 'Moda & Renda',
    rating: 4.2,
    reviewCount: 27,
  },
]

export const categories = [
  'Artesanato',
  'Gastronomia Típica',
  'Moda & Renda',
  'Festa Junina',
  'Música & Arte',
  'Natureza & Saúde',
  'Doces & Quitutes',
  'Religiosidade',
] as const
