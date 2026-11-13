export interface CategoryItem {
  id: string;
  title: string;
  image: string;
  filterQuery: string;
  sectionId?: string;
}

export const OFFICIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'gta-6-3d',
    title: 'GTA 6 & VICE CITY 3D',
    image: '/gta6/002-gta-vi-lightbox.webp',
    filterQuery: 'gta 6 gta vi vice city lucia jason macca',
    sectionId: 'sec-gta6'
  },
  // ROW 1 (cat_ref1)
  {
    id: 'action-figures-3d',
    title: 'ACTION FIGURES & GEEK',
    image: '/front_models/thumb_front-model-sonic-vermelho-1.webp',
    filterQuery: 'sonic goku mario wolverine batman spawn',
    sectionId: 'sec-destaques-dashboard'
  },
  {
    id: 'canecas-gamer',
    title: 'CANECAS GAMER',
    image: '/categories/canecas-gamer.webp',
    filterQuery: 'caneca gamer playstation gta minecraft call of duty',
    sectionId: 'sec-canecas-gamer'
  },
  {
    id: 'canecas-de-times',
    title: 'CANECAS DE TIMES',
    image: '/canecas_times/thumb_guXbpbS.webp',
    filterQuery: 'caneca time times futebol flamengo corinthians palmeiras são paulo santos vasco grêmio internacional cruzeiro atlético bahia fortaleza ceará sport',
    sectionId: 'sec-canecas'
  },
  {
    id: 'street-fighter',
    title: 'STREET FIGHTER',
    image: '/categories/street-fighter.webp',
    filterQuery: 'street fighter ryu chun li akuma'
  },
  {
    id: 'mortal-kombat',
    title: 'MORTAL KOMBAT',
    image: '/categories/mortal-kombat.webp',
    filterQuery: 'mortal kombat sheeva scorpion sub-zero'
  },

  // ROW 2 (cat_ref1)
  {
    id: 'sonic',
    title: 'SONIC',
    image: '/categories/sonic.webp',
    filterQuery: 'sonic tails knuckles shadow'
  },
  {
    id: 'herois',
    title: 'HERÓIS',
    image: '/categories/herois.webp',
    filterQuery: 'herói herois batman homem aranha pantera negra capitão américa homem de ferro vingadores'
  },
  {
    id: 'terror',
    title: 'TERROR',
    image: '/categories/terror.webp',
    filterQuery: 'terror chucky freddy jason pânico'
  },
  {
    id: 'pokemon',
    title: 'POKÉMON',
    image: '/categories/pokemon.webp',
    filterQuery: 'pokémon pokemon pikachu charizard gengar squirtle',
    sectionId: 'sec-pokemon'
  },

  // ROW 3 (cat_ref1)
  {
    id: 'bichinhos-fofos',
    title: 'BICHINHOS FOFOS',
    image: '/categories/bichinhos-fofos.webp',
    filterQuery: 'bichinho fofo capivara gato cão coelho raposa tartaruga',
    sectionId: 'sec-pocket-pals'
  },
  {
    id: 'desenhos-e-animacoes',
    title: 'DESENHOS E ANIMAÇÕES',
    image: '/categories/desenhos-e-animacoes.webp',
    filterQuery: 'banguela fúria da noite dragão animação cartoon'
  },
  {
    id: 'disney',
    title: 'DISNEY',
    image: '/categories/disney.webp',
    filterQuery: 'disney mickey minnie pato donald stitch'
  },
  {
    id: 'looney-tunes',
    title: 'LOONEY TUNES',
    image: '/categories/looney-tunes.webp',
    filterQuery: 'looney tunes pernalonga patolino frajola piu-piu'
  },

  // ROW 4 (cat_ref1)
  {
    id: 'hanna-barbera',
    title: 'HANNA-BARBERA',
    image: '/categories/hanna-barbera.webp',
    filterQuery: 'hanna-barbera dick vigarista muttley scooby-doo fred flintstone'
  },
  {
    id: 'os-simpsons',
    title: 'OS SIMPSONS',
    image: '/categories/os-simpsons.webp',
    filterQuery: 'simpsons homer bart krusty lisa'
  },
  {
    id: 'desenhos-classicos',
    title: 'DESENHOS CLÁSSICOS',
    image: '/categories/desenhos-classicos.webp',
    filterQuery: 'desenho clássico coragem o cão covarde tom e jerry laboratório de dexter'
  },
  {
    id: 'tim-burton',
    title: 'TIM BURTON',
    image: '/categories/tim-burton.webp',
    filterQuery: 'tim burton jack skellington noiva cadáver estranho mundo de jack'
  },

  // ROW 5 (cat_ref2)
  {
    id: 'yu-gi-oh',
    title: 'YU-GI-OH!',
    image: '/categories/yu-gi-oh.webp',
    filterQuery: 'yu-gi-oh yugioh dragão branco olhos azuis mago negro'
  },
  {
    id: 'anime',
    title: 'ANIME',
    image: '/categories/anime.webp',
    filterQuery: 'anime goku naruto luffy one piece dragon ball demon slayer zoro'
  },
  {
    id: 'tekken',
    title: 'TEKKEN',
    image: '/categories/tekken.webp',
    filterQuery: 'tekken heihachi mishima jin kazuya'
  },
  {
    id: 'filmes',
    title: 'FILMES',
    image: '/categories/filmes.webp',
    filterQuery: 'filme arnold schwarzenegger predador rambo exterminador'
  },

  // ROW 6 (cat_ref2)
  {
    id: 'futebol',
    title: 'FUTEBOL',
    image: '/categories/futebol.webp',
    filterQuery: 'futebol haaland messi cr7 neymar estádio maracanã',
    sectionId: 'sec-estadios'
  },
  {
    id: 'super-mario',
    title: 'SUPER MARIO',
    image: '/categories/super-mario.webp',
    filterQuery: 'super mario mario luigi bowser peach yoshi nintendo'
  },
  {
    id: 'chaveiros',
    title: 'CHAVEIROS',
    image: '/categories/chaveiros.webp',
    filterQuery: 'chaveiro keychain chaveiros',
    sectionId: 'sec-chaveiros'
  },
  {
    id: 'mascotes-de-futebol',
    title: 'MASCOTES DE FUTEBOL',
    image: '/categories/mascotes-de-futebol.webp',
    filterQuery: 'mascote futebol urubu gavião porco tigre saci',
    sectionId: 'sec-mascotes'
  },

  // ROW 7 (cat_ref2)
  {
    id: 'bonecos-de-trico',
    title: 'BONECOS DE TRICÔ',
    image: '/categories/bonecos-de-trico.webp',
    filterQuery: 'tricô crochê amigurumi lã'
  },
  {
    id: 'pokebolas-pokemon',
    title: 'POKÉBOLAS POKÉMON',
    image: '/categories/pokebolas-pokemon.webp',
    filterQuery: 'pokebola pokébola pokeball charizard pikachu'
  },
  {
    id: 'natal',
    title: 'NATAL',
    image: '/categories/natal.webp',
    filterQuery: 'natal papai noel árvore de natal presépio guirlanda',
    sectionId: 'sec-natal'
  },
  {
    id: 'lego',
    title: 'LEGO',
    image: '/categories/lego.webp',
    filterQuery: 'lego homem aranha batman 500% minifigura',
    sectionId: 'sec-minifiguras'
  },

  // ROW 8 (cat_ref2)
  {
    id: 'brinquedos-educativos',
    title: 'BRINQUEDOS EDUCATIVOS',
    image: '/categories/brinquedos-educativos.webp',
    filterQuery: 'brinquedo educativo labirinto pista montessori gravidade'
  },
  {
    id: 'minecraft',
    title: 'MINECRAFT',
    image: '/categories/minecraft.webp',
    filterQuery: 'minecraft ender dragon steve creeper espada picareta'
  },
  {
    id: 'utensilios-e-casa',
    title: 'UTENSÍLIOS & CASA',
    image: '/categories/utensilios-e-casa.webp',
    filterQuery: 'utensílio casa esponja suporte porta copos organizador',
    sectionId: 'sec-portacopos'
  },
  {
    id: 'aeromodels',
    title: 'AEROMODELS (AVIÕES & DRONES)',
    image: '/categories/aeromodels.webp',
    filterQuery: 'avião drone aeromodel jacto caça asa'
  },

  // ROW 9 (cat_ref3)
  {
    id: 'bustos-colecionaveis',
    title: 'BUSTOS COLECIONÁVEIS',
    image: '/categories/bustos-colecionaveis.webp',
    filterQuery: 'busto ayrton senna estátua bustos'
  },
  {
    id: 'dc-comics',
    title: 'DC COMICS',
    image: '/categories/dc-comics.webp',
    filterQuery: 'dc comics batman coringa superman flash mulher maravilha'
  },
  {
    id: 'armas-e-props',
    title: 'ARMAS & PROPS',
    image: '/categories/armas-e-props.webp',
    filterQuery: 'arma prop ak47 rifle réplica cosplay'
  },
  {
    id: 'arte-sacra-e-religiao',
    title: 'ARTE SACRA & RELIGIÃO',
    image: '/categories/arte-sacra-e-religiao.webp',
    filterQuery: 'sacra religião cristo jesus nossa senhora cruz santo'
  },

  // ROW 10 (cat_ref3)
  {
    id: 'vingadores-e-marvel',
    title: 'VINGADORES & MARVEL',
    image: '/categories/vingadores-e-marvel.webp',
    filterQuery: 'marvel vingadores thor capitão américa hulk homem de ferro thanos'
  },
  {
    id: 'animais-e-pets',
    title: 'ANIMAIS & PETS',
    image: '/categories/animais-e-pets.webp',
    filterQuery: 'animal pet cachorro gato dragão fúria'
  },
  {
    id: 'modelos-dobraveis',
    title: 'MODELOS DOBRÁVEIS (FAB365)',
    image: '/categories/modelos-dobraveis.webp',
    filterQuery: 'fab365 dobrável fold star wars tie fighter x-wing'
  },
  {
    id: 'minimundo-e-monumentos',
    title: 'MINIMUNDO & MONUMENTOS',
    image: '/categories/minimundo-e-monumentos.webp',
    filterQuery: 'monumento arco do triunfo torre eiffel estádio'
  },

  // ROW 11 (cat_ref3)
  {
    id: 'trofeus-e-copas',
    title: 'TROFÉUS & COPAS',
    image: '/categories/trofeus-e-copas.webp',
    filterQuery: 'troféu copa do mundo taça champions libertadores'
  },
  {
    id: 'aramados',
    title: 'ARAMADOS & DESIGN ORGÂNICO',
    image: '/categories/aramados.webp',
    filterQuery: 'aramado vaso luminária orgânico voronoi design'
  }
];
