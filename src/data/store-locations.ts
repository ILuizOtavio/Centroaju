/**
 * Coordenadas aproximadas no bairro Centro de Aracaju/SE (área comercial histórica).
 * Ajuste endereços reais quando houver cadastro oficial.
 */
export type StoreLocation = {
  lat: number
  lng: number
  /** Endereço de referência no Centro */
  address: string
}

/** Limites da “zona centro” usada no mapa (alinhado à Zona XP). */
export const CENTRO_ARACAJU_BOUNDS = {
  south: -10.923,
  north: -10.905,
  west: -37.062,
  east: -37.043,
} as const

export const storeLocationsByName: Record<string, StoreLocation> = {
  'Cantinho do Zé': {
    lat: -10.9108,
    lng: -37.0486,
    address: 'Rua do Comércio — Centro',
  },
  'Ateliê Maria': {
    lat: -10.9115,
    lng: -37.0502,
    address: 'Travessa lateral — Centro',
  },
  'Doces da Praça': {
    lat: -10.9123,
    lng: -37.0491,
    address: 'Praça Fausto Cardoso — Centro',
  },
  'Cerâmica do Centro': {
    lat: -10.9131,
    lng: -37.051,
    address: 'Rua José do Prado Franco — Centro',
  },
  'Banca do Chico': {
    lat: -10.9102,
    lng: -37.0478,
    address: 'Feira / calçadão — Centro',
  },
  'Música do Povo': {
    lat: -10.914,
    lng: -37.0505,
    address: 'Galeria comercial — Centro',
  },
  'Armazém do Sertão': {
    lat: -10.9128,
    lng: -37.048,
    address: 'Rua Itabaiana — Centro',
  },
  'Ervas da Praça': {
    lat: -10.9119,
    lng: -37.0495,
    address: 'Mercado municipal — Centro',
  },
  'Casa de Artigos Religiosos': {
    lat: -10.9135,
    lng: -37.052,
    address: 'Proximidades da Matriz — Centro',
  },
  'Confeitaria da Matriz': {
    lat: -10.9138,
    lng: -37.0523,
    address: 'Rua da Matriz — Centro',
  },
  'Arte Popular Sergipe': {
    lat: -10.9142,
    lng: -37.0512,
    address: 'Centro histórico — Centro',
  },
  'Moda Nordeste': {
    lat: -10.9105,
    lng: -37.0508,
    address: 'Rua do Imperador — Centro',
  },
}
