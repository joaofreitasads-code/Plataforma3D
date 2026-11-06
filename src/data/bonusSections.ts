import { VIP_DRIVE_MAIN_URL } from './modelsData';

export interface BonusSection {
  id: string;
  bonusNumber: string;
  title: string;
  description: string;
  image: string;
  categoryFilter: string;
  driveUrl: string;
}

export const BONUS_SECTIONS: BonusSection[] = [
  {
    id: 'veiculos-3d',
    bonusNumber: 'BÔNUS 01',
    title: 'PACK DE VEÍCULOS 3D PROFISSIONAIS',
    description: 'Miniaturas de carros (do Fusca ao Mustang, veículos colecionáveis). Categoria para testar colecionáveis com público adulto e fãs de automobilismo.',
    image: '/bonus/bonus_1.png',
    categoryFilter: 'carros',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'herois-marvel',
    bonusNumber: 'BÔNUS 02',
    title: 'COLEÇÃO HERÓIS DA MARVEL',
    description: 'Action figures de heróis, filmes e desenhos. Categoria com forte apelo visual para o público geek e diferentes possibilidades de produto.',
    image: '/bonus/bonus_2.png',
    categoryFilter: 'filmes',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'chaveiros-rapidos',
    bonusNumber: 'BÔNUS 03',
    title: 'PACK DE CHAVEIROS RÁPIDOS',
    description: 'Chaveiros de times, geek, animais, heróis e a nova linha Chaveiros Cabeça Lego Apertáveis (Deadpool, Homem-Aranha, Venom, Capitão América, Múmia e Skeleton). Peças pequenas e rápidas de imprimir.',
    image: '/bonus/bonus_3.png',
    categoryFilter: 'sec-chaveiros',
    driveUrl: 'https://drive.google.com/drive/folders/1z6kfc6DL60BvHp7rOnYZelOqo8GykSVh?usp=drive_link'
  },
  {
    id: 'flexiveis-articulados',
    bonusNumber: 'BÔNUS 04',
    title: 'MODELOS FLEXÍVEIS E ARTICULADOS',
    description: 'Modelos articulados de heróis, personagens e animais. Categoria com efeito visual imediato, útil para testes presenciais e online.',
    image: '/bonus/bonus_4.png',
    categoryFilter: 'pocket-pals',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'classicos-desenhos',
    bonusNumber: 'BÔNUS 05',
    title: 'COLEÇÃO CLÁSSICOS DOS DESENHOS',
    description: 'Coleção nostálgica de personagens clássicos. Uma opção para ampliar seu catálogo e testar o público infantil e colecionador.',
    image: '/bonus/bonus_5.png',
    categoryFilter: 'desenhos',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'cosplay-3d',
    bonusNumber: 'BÔNUS 06',
    title: 'COSPLAY 3D',
    description: 'Peças e máscaras detalhadas para cosplay ou decoração. Permite testar produtos de maior tamanho e ticket mais alto.',
    image: '/bonus/bonus_6.png',
    categoryFilter: 'vip',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'pokemon-3d',
    bonusNumber: 'BÔNUS 07',
    title: 'COLEÇÃO POKÉMON 3D',
    description: 'Modelos clássicos da franquia. Categoria conhecida, interessante para explorar o público colecionador e fãs.',
    image: '/bonus/bonus_7.png',
    categoryFilter: 'pokemon',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'natal-3d',
    bonusNumber: 'BÔNUS 08',
    title: 'COLEÇÃO 3D DE NATAL',
    description: 'Decorações temáticas de fim de ano. Uma forma de testar produtos sazonais sem depender de uma única linha durante o ano.',
    image: '/bonus/bonus_8.png',
    categoryFilter: 'canecas',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'copa-do-mundo',
    bonusNumber: 'BÔNUS 09',
    title: 'COLEÇÃO COPA DO MUNDO',
    description: 'Modelos ligados a eventos esportivos. Categoria para explorar datas e temas com maior atenção do público.',
    image: '/bonus/bonus_9.png',
    categoryFilter: 'estadios',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'mascotes-esportivos',
    bonusNumber: 'BÔNUS 10',
    title: 'MASCOTE ESPORTIVO EXCLUSIVOS',
    description: 'Mascotes de times como Cruzeiro, Palmeiras, Santos e São Paulo. Uma opção para testar um público local e regional bem definido.',
    image: '/bonus/bonus_10.png',
    categoryFilter: 'estadios',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'luminarias-stl',
    bonusNumber: 'BÔNUS 11',
    title: 'LUMINÁRIAS STL',
    description: 'Peças decorativas com luz. Categoria de decoração para quem quer testar produtos de apresentação mais elaborada.',
    image: '/bonus/bonus_11.png',
    categoryFilter: 'iluminacao',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'amigurumi-3d',
    bonusNumber: 'BÔNUS 12',
    title: 'BICHINHOS AMIGURUMI IMPRESSÃO 3D',
    description: 'Itens em estilo crochê 3D: chaveiros, decoração, heróis e Pokémon. Categoria com apelo visual fofo e várias possibilidades de produto.',
    image: '/bonus/bonus_12.png',
    categoryFilter: 'pocket-pals',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'lego-3d',
    bonusNumber: 'BÔNUS 13',
    title: 'COLEÇÃO LEGO 3D',
    description: 'Minifiguras articuladas, blocos gigantes, porta-trecos, organizadores de mesa e peças customizadas estilo Lego. Nicho com alta procura entre crianças e colecionadores.',
    image: '/bonus/bonus_13.png',
    categoryFilter: 'utilitarios',
    driveUrl: VIP_DRIVE_MAIN_URL
  },
  {
    id: 'minecraft-3d',
    bonusNumber: 'BÔNUS 14',
    title: 'UNIVERSO MINECRAFT 3D',
    description: 'Personagens pixelados, espadas, ferramentas, blocos colecionáveis e luminárias temáticas de Minecraft. Um dos universos mais lucrativos para vendas rápidas em marketplaces.',
    image: '/bonus/bonus_14.png',
    categoryFilter: 'monster',
    driveUrl: VIP_DRIVE_MAIN_URL
  }
];
