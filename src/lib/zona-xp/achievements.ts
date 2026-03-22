export type AchievementDef = {
  id: string
  title: string
  description: string
  icon: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first', title: 'Primeira Chegada', description: 'Primeira sessão na Zona XP', icon: '👋' },
  { id: 'chama', title: 'Chama Nordestina', description: 'Streak de 3 dias no centro', icon: '🔥' },
  { id: 'maratonista', title: 'Maratonista', description: '2h ou mais em um único dia', icon: '🏃' },
  { id: 'guardiao_mestre', title: 'Guardião Mestre', description: '10h acumuladas na zona', icon: '🏛' },
  { id: 'rei', title: 'Rei do Centro', description: '7 dias consecutivos de presença', icon: '👑' },
  { id: 'comprador', title: 'Cliente da Praça', description: 'Primeira compra contabilizada em XP', icon: '🛍' },
  { id: 'festivo', title: 'Vivo o Arraial', description: 'Confirmou presença em um evento', icon: '🎉' },
  { id: 'diamante', title: 'Brilho Diamante', description: 'Alcançou o rank Diamante', icon: '💎' },
  { id: 'lenda', title: 'Lenda Viva', description: 'Alcançou o rank Lenda', icon: '⭐' },
  { id: 'explorador', title: 'Olhar de Forasteiro', description: 'Perfil Explorador confirmado', icon: '🗺' },
  { id: 'guardiao', title: 'Filho do Centro', description: 'Perfil Guardião detectado', icon: '🏛' },
  { id: 'streak7', title: 'Semana Santa do Comércio', description: 'Streak de 7 dias (bônus ativo)', icon: '📅' },
]
