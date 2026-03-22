export type EventItem = {
  id: string
  title: string
  type: string
  date: string
  time: string
  place: string
  description: string
  tags: string[]
  confirmed: number
  past: boolean
  galleryUrl?: string
}

export const events: EventItem[] = [
  {
    id: 'ev1',
    title: 'Arraiá da Praça Fausto Cardoso',
    type: 'Festa Junina',
    date: '2025-06-24',
    time: '18:00',
    place: 'Praça Fausto Cardoso',
    description: 'Quadrilha, comidas típicas e forró pé de serra com artistas locais.',
    tags: ['Forró', 'Gastronomia', 'Família'],
    confirmed: 428,
    past: true,
    galleryUrl: '#',
  },
  {
    id: 'ev2',
    title: 'Feira do Artesanato Sergipano',
    type: 'Artesanato',
    date: '2026-04-12',
    time: '09:00',
    place: 'Calçadão da Orla',
    description: 'Exposição de cerâmica, renda e esculturas com oficinas abertas ao público.',
    tags: ['Renda', 'Barro', 'Cultura'],
    confirmed: 156,
    past: false,
  },
  {
    id: 'ev3',
    title: 'Roda de Repente — Pátio do Forró',
    type: 'Música & Arte',
    date: '2026-03-28',
    time: '19:30',
    place: 'Centro Histórico',
    description: 'Repentistas convidados e mistura com xote e baião.',
    tags: ['Repente', 'Forró', 'Tradição'],
    confirmed: 89,
    past: false,
  },
  {
    id: 'ev4',
    title: 'Passeio Patrimônio & Culinária',
    type: 'Patrimônio',
    date: '2026-04-05',
    time: '08:00',
    place: 'Igrejas do Centro',
    description: 'Circuito guiado com paradas em quitutes típicos e histórias do centro.',
    tags: ['História', 'Gastronomia', 'Turismo'],
    confirmed: 42,
    past: false,
  },
]
