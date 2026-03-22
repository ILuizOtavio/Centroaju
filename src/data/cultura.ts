export type CulturaSection = {
  id: string
  title: string
  icon: string
  body: string
}

export const culturaSections: CulturaSection[] = [
  {
    id: 'forro',
    title: 'Forró & Xote',
    icon: '🎶',
    body:
      'O forró e o xote atravessam gerações em Sergipe: pé de serra em festas de praça, triângulo e zabumba marcando o passo. No CentroAju, essa tradição aparece em produtos musicais, eventos e na própria forma de circular o centro.',
  },
  {
    id: 'culinaria',
    title: 'Culinária Típica',
    icon: '🍲',
    body:
      'Da panelada ao bolo de rolo, passando pela cocada e tapioca, o centro de Aracaju concentra sabores que contam história. Cada prato nas vitrines do marketplace é um convite a provar o Nordeste com calma.',
  },
  {
    id: 'boi',
    title: 'Boi de Mamão & Reisado',
    icon: '🐂',
    body:
      'Manifestações que misturam teatro, música e fé — o Boi de Mamão é patrimônio vivo. Artesãos reproduzem miniaturas e referências nas lojas parceiras, mantendo visível uma cultura que é identidade.',
  },
  {
    id: 'barro',
    title: 'Artesanato em Barro',
    icon: '🏺',
    body:
      'O barro moldado à mão segue forte no centro: vasos, santos populares e peças utilitárias. O marketplace valoriza quem produz localmente e conecta o visitante ao ofício.',
  },
  {
    id: 'renda',
    title: 'Renda & Bordado',
    icon: '🧵',
    body:
      'A renda renascença e os bordados carregam memória de mulheres que sustentam o comércio com técnica e paciência. Moda & Renda no CentroAju celebra esse legado com peças autorais.',
  },
  {
    id: 'sjoao',
    title: 'São João Sergipano',
    icon: '🎆',
    body:
      'Junho invade as ruas com bandeirinhas, fogueira simbólica e muito forró. A categoria Festa Junina reúne o que há de mais típico para viver o arraial o ano inteiro, onde o centro pulsa.',
  },
]
