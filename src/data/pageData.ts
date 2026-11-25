export interface CarouselItem {
  name: string;
  img: string;
  tag: string;
  spriteIndex?: number;
  spriteCount?: number;
}

export interface BonusItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  imgClass?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const CHECKOUT_URLS = {
  premium: 'https://appdigitalhub.com.br/c/79F4D72A', // R$ 57,90
  specialOfferDiscount: 'https://appdigitalhub.com.br/c/0B7910C6', // R$ 27,90
  basicCheckout: 'https://appdigitalhub.com.br/c/A938F3E0', // R$ 10,90
};

export const SELECTED_MODELS: CarouselItem[] = [
  { name: 'GOTENKS KID', img: '/assets/models/gotenks.webp', tag: '📈 MARKETPLACE' },
  { name: 'MOON KNIGHT', img: '/assets/models/moon_knight.webp', tag: '📈 MARKETPLACE' },
  { name: 'FLASH KNUCKLES', img: '/assets/models/flash_knuckles.webp', tag: '📈 MARKETPLACE' },
  { name: 'SPAWN', img: '/assets/models/spawn.webp', tag: '📈 MARKETPLACE' },
  { name: 'SHADOW', img: '/assets/models/shadow.webp', tag: '📈 MARKETPLACE' },
  { name: 'VEGETA KID', img: '/assets/models/vegeta_kid.webp', tag: '📈 MARKETPLACE' },
  { name: 'MARIO CAPTAIN AMERICA', img: '/assets/models/mario_captain.webp', tag: '📈 MARKETPLACE' },
  { name: 'SUPER SONIC GOKU', img: '/assets/models/super_sonic_goku.webp', tag: '📈 MARKETPLACE' },
  { name: 'SUB-ZERO', img: '/assets/models/sub_zero.webp', tag: '📈 MARKETPLACE' },
];

export const SELECTED_MODELS_ROW2: CarouselItem[] = [
  { name: 'LEGO BATMAN (DARK KNIGHT)', img: '/assets/lego/model_1.webp', tag: '📈 MAIS VENDIDO' },
  { name: 'LEGO SUPERMAN', img: '/assets/lego/model_2.webp', tag: '🔥 POPULAR' },
  { name: 'LEGO HOMEM-ARANHA', img: '/assets/lego/model_3.webp', tag: '📈 TREND GEEK' },
  { name: 'LEGO HOMEM DE FERRO', img: '/assets/lego/model_4.webp', tag: '⭐ COLEÇÃO' },
  { name: 'LEGO DARTH VADER', img: '/assets/lego/model_5.webp', tag: '⚔️ STAR WARS' },
  { name: 'LEGO VENOM', img: '/assets/lego/model_6.webp', tag: '🔥 VILÃO' },
  { name: 'LEGO O MÁSCARA', img: '/assets/lego/model_7.webp', tag: '🎭 CLÁSSICO' },
  { name: 'LEGO ROBIN', img: '/assets/lego/model_8.webp', tag: '🎮 GEEK' },
  { name: 'LEGO BATMAN CLÁSSICO', img: '/assets/lego/model_9.webp', tag: '🦇 DC COMICS' },
];

export const SELECTED_MODELS_ROW3: CarouselItem[] = [
  { name: 'CANECA PLAYSTATION 3D', img: '/assets/row3/model_1.webp', tag: '🎮 PLAYSTATION' },
  { name: 'CANECA COD MODERN WARFARE', img: '/assets/row3/model_2.webp', tag: '💥 CALL OF DUTY' },
  { name: 'CANECA GTA VI 3D', img: '/assets/row3/model_3.webp', tag: '🌴 GTA VI TREND' },
  { name: 'CANECA MINECRAFT TNT 3D', img: '/assets/row3/model_4.webp', tag: '⛏️ MINECRAFT' },
  { name: 'CANECA MORTAL KOMBAT 3D', img: '/assets/row3/model_5.webp', tag: '🐉 MORTAL KOMBAT' },
];

export const SELECTED_MODELS_GTA6: CarouselItem[] = [
  {
    name: 'SUPORTE PS5 GTA VI',
    img: '/assets/models/gta6_collection.webp',
    tag: '🎮 GTA VI',
    spriteIndex: 0,
    spriteCount: 6,
  },
  {
    name: 'SUPORTE HEADSET GTA VI',
    img: '/assets/models/gta6_collection.webp',
    tag: '🎧 SETUP GAMER',
    spriteIndex: 1,
    spriteCount: 6,
  },
  {
    name: 'SUPORTE CELULAR GTA VI',
    img: '/assets/models/gta6_collection.webp',
    tag: '📱 DESK SETUP',
    spriteIndex: 2,
    spriteCount: 6,
  },
  {
    name: 'LIGHTBOX GTA VI',
    img: '/assets/models/gta6_collection.webp',
    tag: '💡 LUMINÁRIA',
    spriteIndex: 3,
    spriteCount: 6,
  },
  {
    name: 'PLACA NEON VICE CITY',
    img: '/assets/models/gta6_collection.webp',
    tag: '🌴 VICE CITY',
    spriteIndex: 4,
    spriteCount: 6,
  },
  {
    name: 'JACARÉ MACCA GTA VI',
    img: '/assets/models/gta6_collection.webp',
    tag: '🐊 COLECIONÁVEL',
    spriteIndex: 5,
    spriteCount: 6,
  },
];

export const NICHES: CarouselItem[] = [
  { name: 'LUMINÁRIAS DECORATIVAS', img: '/assets/niches/luminarias.webp', tag: '📈 MARKETPLACE' },
  { name: 'VEÍCULOS 3D', img: '/assets/niches/veiculos.webp', tag: '📈 MARKETPLACE' },
  { name: 'HERÓIS MARVEL', img: '/assets/niches/herois.webp', tag: '📈 MARKETPLACE' },
  { name: 'CHAVEIROS', img: '/assets/niches/chaveiros.webp', tag: '📈 MARKETPLACE' },
  { name: 'ARTICULADOS', img: '/assets/niches/articulados.webp', tag: '📈 MARKETPLACE' },
  { name: 'POKÉMON 3D', img: '/assets/niches/pokemon.webp', tag: '📈 MARKETPLACE' },
  { name: 'COSPLAY / MÁSCARAS', img: '/assets/niches/cosplay.webp', tag: '📈 MARKETPLACE' },
  { name: 'COPA DO MUNDO', img: '/assets/niches/copa.webp', tag: '📈 MARKETPLACE' },
  { name: 'MASCOTES ESPORTIVOS', img: '/assets/niches/mascotes.webp', tag: '📈 MARKETPLACE' },
  { name: 'CLÁSSICOS DOS DESENHOS', img: '/assets/niches/desenhos.webp', tag: '📈 MARKETPLACE' },
  { name: 'AMIGURUMI 3D', img: '/assets/niches/amigurumi.webp', tag: '📈 MARKETPLACE' },
];

export const PROOF_IMAGES = [
  '/assets/proofs/proof_1.webp',
  '/assets/proofs/proof_2.webp',
  '/assets/proofs/proof_3_moletom.webp',
  '/assets/proofs/proof_4_new.webp',
];

export const GALLERY_ROW1 = [
  '/assets/gallery/c1_1.webp',
  '/assets/gallery/c1_2.webp',
  '/assets/gallery/c1_3.webp',
  '/assets/gallery/c1_4.webp',
  '/assets/gallery/c1_5.webp',
  '/assets/gallery/c1_6.webp',
  '/assets/gallery/c1_7.webp',
];

export const GALLERY_ROW2 = [
  '/assets/gallery/c2_1.webp',
  '/assets/gallery/c2_2.webp',
  '/assets/gallery/c2_3.webp',
  '/assets/gallery/c2_4.webp',
  '/assets/gallery/c2_5.webp',
  '/assets/gallery/c2_6.webp',
  '/assets/gallery/c2_7.webp',
  '/assets/gallery/c2_8.webp',
  '/assets/gallery/c2_9.webp',
  '/assets/gallery/c2_10.webp',
];

export const GALLERY_ROW3 = [
  '/assets/gallery/c3_1.webp',
  '/assets/gallery/c3_2.webp',
  '/assets/gallery/c3_3.webp',
  '/assets/gallery/c3_4.webp',
  '/assets/gallery/c3_5.webp',
  '/assets/gallery/c3_6.webp',
  '/assets/gallery/c3_7.webp',
  '/assets/gallery/c3_8.webp',
];

export const BONUSES: BonusItem[] = [
  {
    id: 1,
    title: 'PACK DE VEÍCULOS 3D PROFISSIONAIS',
    desc: 'Miniaturas de carros (do Fusca ao Mustang, +172 veículos). Interessante para quem quer testar colecionáveis com público adulto e fãs de automobilismo.',
    img: '/assets/niches/veiculos.webp',
  },
  {
    id: 2,
    title: 'COLEÇÃO HERÓIS DA MARVEL',
    desc: 'Action figures de heróis, filmes e desenhos (+150 itens). Categoria com forte apelo visual para o público geek e diferentes possibilidades de produto.',
    img: '/assets/niches/herois.webp',
  },
  {
    id: 3,
    title: 'PACK DE CHAVEIROS RÁPIDOS',
    desc: '+500 chaveiros de times, geek, animais e heróis. Peças pequenas e rápidas de imprimir — uma opção para testar itens de baixo custo por unidade.',
    img: '/assets/niches/chaveiros.webp',
  },
  {
    id: 4,
    title: 'MODELOS FLEXÍVEIS E ARTICULADOS',
    desc: '+1.300 modelos articulados de heróis, personagens e animais. Categoria com efeito visual imediato, útil para testes presenciais e online.',
    img: '/assets/niches/articulados.webp',
  },
  {
    id: 5,
    title: 'COLEÇÃO CLÁSSICOS DOS DESENHOS',
    desc: 'Seleção nostálgica de personagens clássicos. Uma opção para ampliar seu catálogo e testar o público infantil e colecionador.',
    img: '/assets/niches/desenhos.webp',
  },
  {
    id: 6,
    title: 'COSPLAY 3D',
    desc: '+200 peças e máscaras detalhadas para cosplay ou decoração. Permite testar produtos de maior tamanho e ticket mais alto.',
    img: '/assets/niches/cosplay.webp',
  },
  {
    id: 7,
    title: 'COLEÇÃO POKÉMON 3D',
    desc: '+450 modelos clássicos da franquia. Categoria conhecida, interessante para explorar o público colecionador e fãs.',
    img: '/assets/niches/pokemon.webp',
  },
  {
    id: 8,
    title: 'COLEÇÃO 3D DE NATAL',
    desc: 'Decorações temáticas de fim de ano. Uma forma de testar produtos sazonais sem depender de uma única linha durante o ano.',
    img: '/assets/bonuses/natal.webp',
  },
  {
    id: 9,
    title: 'COLEÇÃO COPA DO MUNDO',
    desc: 'Modelos ligados a eventos esportivos. Categoria para explorar datas e temas com maior atenção do público.',
    img: '/assets/niches/copa.webp',
  },
  {
    id: 10,
    title: 'MASCOTE ESPORTIVO EXCLUSIVOS',
    desc: 'Mascotes de times como Cruzeiro, Palmeiras, Santos e São Paulo. Uma opção para testar um público local e regional bem definido.',
    img: '/assets/niches/mascotes.webp',
  },
  {
    id: 11,
    title: '+250 LUMINÁRIAS STL',
    desc: 'Peças decorativas com luz. Categoria de decoração para quem quer testar produtos de apresentação mais elaborada.',
    img: '/assets/bonuses/luminarias_bonus.webp',
    imgClass: 'object-contain object-center p-1',
  },
  {
    id: 12,
    title: 'BICHINHOS AMIGURUMI IMPRESSÃO 3D',
    desc: '+200 itens em estilo crochê 3D: chaveiros, decoração, heróis e Pokémon. Categoria com apelo visual fofo e várias possibilidades de produto.',
    img: '/assets/niches/amigurumi.webp',
  },
  {
    id: 13,
    title: 'COLEÇÃO LEGO 3D',
    desc: 'Minifiguras articuladas, blocos gigantes, porta-trecos, organizadores de mesa e peças customizadas estilo Lego. Nicho com alta procura entre crianças e colecionadores.',
    img: '/assets/bonuses/lego_bonus.webp',
  },
  {
    id: 14,
    title: 'UNIVERSO MINECRAFT 3D',
    desc: 'Personagens pixelados, espadas, ferramentas, blocos colecionáveis e luminárias temáticas de Minecraft. Um dos universos mais lucrativos para vendas rápidas em marketplaces.',
    img: '/assets/bonuses/minecraft_bonus.webp',
  },
  {
    id: 15,
    title: 'CANECAS GAMER 3D',
    desc: 'Modelos STL exclusivos de canecas, copos temáticos e suportes colecionáveis inspirados no universo gamer e geek. Uma das categorias mais lucrativas e procuradas para presentes criativos.',
    img: '/assets/bonuses/canecas_gamer.webp',
  },
  {
    id: 16,
    title: 'CANECAS DE TIMES DE FUTEBOL 3D',
    desc: 'Coleção exclusiva de canecas, suportes e copos temáticos com os maiores clubes de futebol. Nicho apaixonado e de altíssima procura para presentes e torcedores.',
    img: '/assets/bonuses/canecas_times.webp',
  },
  {
    id: 17,
    title: 'CANECA ESTILO MOLETOM 3D',
    desc: 'Design inovador e criativo de canecas 3D vestindo mini moletom com capuz e detalhes têxteis modelados, grande sucesso de procura para presentes.',
    img: '/assets/bonuses/caneca_moletom.webp',
    imgClass: 'object-contain object-center p-1',
  },
  {
    id: 18,
    title: 'RÉPLICAS DE ESTÁDIOS DE FUTEBOL EM 3D',
    desc: 'Coleção especial de maquetes e réplicas de grandes estádios e arenas do futebol modelados para impressão 3D, com riqueza de detalhes para decoração e colecionadores.',
    img: '/assets/bonuses/estadios_3d.webp',
    imgClass: 'object-contain object-center p-1',
  },
  {
    id: 19,
    title: 'PORTA COPOS MONSTER 3D',
    desc: 'Adicione ao seu catálogo uma coleção exclusiva de porta copos inspirados no tema Monster em 3D, com visual marcante, relevo detalhado e alta saída para venda.',
    img: '/assets/bonuses/porta_copos_monster.webp',
    imgClass: 'object-contain object-center p-1',
  },
  {
    id: 20,
    title: 'MODELOS GTA 6 & VICE CITY 3D',
    desc: 'Adicione ao seu catálogo uma coleção incrível de modelos 3D inspirados em GTA 6 e Vice City, com personagens, dioramas, suportes gamer e peças exclusivas, ricas em detalhes e com grande potencial para atrair colecionadores e gerar vendas.',
    img: '/assets/bonuses/gta6_vice_city.webp',
    imgClass: 'object-contain object-center p-1',
  },
];

export const TESTIMONIALS = [
  '/assets/testimonials/depoimento_1.webp',
  '/assets/testimonials/depoimento_2.webp',
  '/assets/testimonials/depoimento_3.webp',
  '/assets/testimonials/depoimento_4.webp',
  '/assets/testimonials/depoimento_5.webp',
  '/assets/testimonials/depoimento_6.webp',
];

export const FAQS: FaqItem[] = [
  {
    id: 1,
    question: 'Q1. Posso vender as peças impressas?',
    answer: 'Sim! Todos os modelos podem ser impressos e vendidos livremente em marketplaces como Shopee, Mercado Livre, Instagram, feiras presenciais e sua própria loja.',
  },
  {
    id: 2,
    question: 'Q2. Funciona para Shopee e Mercado Livre?',
    answer: 'Sim, os modelos foram minerados a partir de produtos que já têm demanda nestas plataformas.',
  },
  {
    id: 3,
    question: 'Q3. Preciso saber modelar?',
    answer: 'Não. Todos os arquivos STL já vêm prontos para impressão, sem necessidade de modelagem.',
  },
  {
    id: 4,
    question: 'Q4. Como funciona a Central Prime 3D™?',
    answer: 'Você recebe acesso a uma biblioteca online organizada por categorias, com download direto e vitalício.',
  },
  {
    id: 5,
    question: 'Q5. Recebo acesso imediato à Central?',
    answer: 'Sim, o acesso é liberado imediatamente após a confirmação do pagamento.',
  },
];

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const trackPixelEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, parameters);
  }
};

export const trackInitiateCheckout = (
  contentName: string,
  value: number,
  currency: string = 'BRL'
) => {
  trackPixelEvent('InitiateCheckout', {
    content_name: contentName,
    value,
    currency,
  });
};
