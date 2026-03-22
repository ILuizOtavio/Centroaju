export interface Product {
  id: string
  name: string
  price: number
  store_id: string
}

export interface Store {
  id: string
  name: string
  category: string
  whatsapp: string
}

export interface UserProfile {
  id: string
  total_xp: number
  tier: string
  streak: number
  profile_type: 'explorador' | 'guardiao'
}

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  date: string;
}