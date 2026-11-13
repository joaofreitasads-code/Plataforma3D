export interface ModelItem {
  id: string;
  title: string;
  category: string;
  sectionId: string;
  badge?: string;
  isHot?: boolean;
  driveUrl: string;
  downloadUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  images?: string[];
  imageId?: string;
  stlId?: string;
  fileSize?: string;
  weightGrams?: number;
  filamentGrams?: number;
  printTimeHours?: number;
  suggestedPrice?: number;
  scale?: string;
  dimensions?: string;
  infill?: string;
  walls?: number;
  supports?: string;
  amsSupport?: boolean;
  colorTheme?: string;
  description?: string;
  commercialPermitted?: boolean;
  stlFiles?: Array<{ name: string; url: string; size?: string }>;
}

export interface SectionCategory {
  id: string;
  title: string;
  shortTitle: string;
  iconType: 'box' | 'zap' | 'shield' | 'sparkles' | 'sword' | 'trophy' | 'key' | 'gamepad' | 'bot' | 'lightbulb' | 'cup';
  accentColor: string;
  description: string;
  count: number;
  driveFolderUrl: string;
}

export interface LucrativeProduct {
  id: string;
  title: string;
  category: string;
  filamentGrams: number;
  salePrice: number;
  printHours: number;
  marginPercent: number;
}

export const TOTAL_CATALOG_MODELS_COUNT = 1441;

export const LUCRATIVE_PRODUCTS: LucrativeProduct[] = [
  {
    id: "luc-01",
    title: "Charizard 3D",
    category: "Pokémon 3D",
    filamentGrams: 160,
    salePrice: 120,
    printHours: 7.5,
    marginPercent: 78
  },
  {
    id: "luc-02",
    title: "Gengar 3D",
    category: "Pokémon 3D",
    filamentGrams: 140,
    salePrice: 95,
    printHours: 6.0,
    marginPercent: 75
  },
  {
    id: "luc-03",
    title: "Lego Batman 500%",
    category: "Lego 500%",
    filamentGrams: 320,
    salePrice: 180,
    printHours: 14.0,
    marginPercent: 68
  },
  {
    id: "luc-04",
    title: "Funko Exclusivo",
    category: "Funkos Exclusivos",
    filamentGrams: 85,
    salePrice: 65,
    printHours: 4.5,
    marginPercent: 82
  }
];

export const VIP_DRIVE_MAIN_URL = "https://drive.google.com/drive/folders/1kJEzOZ-fOMzN31i8GMKR-hjxgWCHib4M?usp=sharing";
export const MONSTER_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1csS_HO7mk8XdzW6rJnAeVEBetT0_YSC1?usp=drive_link";

export const SECTIONS: SectionCategory[] = [
  {
    id: "sec-gta6",
    title: "SESSÃO GTA 6 & VICE CITY 3D (FIGURES, DOCKS, LIGHTBOXES & CHAVEIROS)",
    shortTitle: "GTA 6 3D",
    iconType: "gamepad",
    accentColor: "text-pink-400",
    description: "Coleção completa GTA 6 & Vice City 3D com 86 modelos exclusivos (Lucia, Jason, Macca the Gator, Lightboxes Neon, Docks de Controle PS5/Xbox, Chaveiros e Estação Vice Sunset) com arquivos STL/3MF reais.",
    count: 86,
    driveFolderUrl: "https://drive.google.com/drive/folders/1pA4_qQOCfwNHHUhDGyjo_VlojZMBfEuo?usp=sharing",
  },
  {
    id: "sec-portacopos",
    title: "SESSÃO PORTA COPOS & SUPORTES DE LATA 3D (MONSTER, CERVEJA, GEEK & MOTORES)",
    shortTitle: "PORTA COPOS & LATAS",
    iconType: "cup",
    accentColor: "text-amber-400",
    description: "Coleção exclusiva com 36 porta copos e suportes de latas 3D (Monster Energy, Motores V6/V8, Cerveja, Coca-Cola, Geek, Spiderman, Bakugou, Alien e muito mais) com imagens reais individuais sem repetição e arquivos STL/3MF para impressão 3D.",
    count: 36,
    driveFolderUrl: "https://drive.google.com/drive/folders/1gpQozpi8r-D7BbaZ2Qi6zx4bRihnwu3q?usp=sharing",
  },
  {
    id: "sec-canecas-gamer",
    title: "SESSÃO CANECAS GAMER 3D (PLAYSTATION, GTA, CALL OF DUTY, MORTAL KOMBAT & MINECRAFT)",
    shortTitle: "CANECAS GAMER",
    iconType: "gamepad",
    accentColor: "text-purple-400",
    description: "Coleção de canecas temáticas gamer 3D multipartes com logos e relevos de games e consoles (PlayStation, Mortal Kombat, COD, GTA e Minecraft) com arquivos 3MF/STL completos para impressão 3D.",
    count: 5,
    driveFolderUrl: "https://drive.google.com/drive/folders/1uPhqdIyEli7Ih58lmmRMirUejzMkF5Q9?usp=sharing",
  },
  {
    id: "sec-estadios",
    title: "SESSÃO ESTÁDIOS DE FUTEBOL 3D (ARENAS & TEMPLOS DO FUTEBOL)",
    shortTitle: "ESTÁDIOS DE FUTEBOL",
    iconType: "trophy",
    accentColor: "text-emerald-400",
    description: "Coleção de maquetes 3D e réplicas fiéis de estádios de futebol (Maracanã, Neo Química Arena, Allianz Parque, Morumbi, Mineirão, Vila Belmiro, Arena MRV, Beira-Rio, Arena do Grêmio, São Januário e Monumental de Núñez) com arquivos STL e 3MF prontos para impressão 3D.",
    count: 11,
    driveFolderUrl: "https://drive.google.com/drive/folders/1Nm88DufMOS3XPtEwU1BW3DiMYjVISgdD?usp=drive_link",
  },
  {
    id: "sec-virais",
    title: "SESSÃO MODELOS VIRAIS 3D (TENDÊNCIAS, PERSONAGENS & REDES SOCIAIS)",
    shortTitle: "MODELOS VIRAIS 3D",
    iconType: "zap",
    accentColor: "text-amber-400",
    description: "Coleção de 49 modelos 3D virais de alto engajamento nas redes sociais (Akuma, Alien, Arnold, Bart, Batman, Baymax, Blanka, Chucky, Demolidor, Goku, Mario, Meninas Superpoderosas e muito mais) com arquivos STL/3MF e fotos reais individuais.",
    count: 49,
    driveFolderUrl: "https://drive.google.com/drive/folders/1267CCso-VTh9r5rXAzTsbHD25gx85yhY?usp=drive_link",
  },
  {
    id: "sec-pocketpals",
    title: "SESSÃO POCKET PALS 3D (ANIMAIS ARTICULADOS & MINIATURAS)",
    shortTitle: "POCKET PALS",
    iconType: "sparkles",
    accentColor: "text-amber-400",
    description: "Coleção completa Pocket Pals 3D com 9 animais articulados colecionáveis (Cão, Capivara, Coelho, Gato, Girafa, Papagaio, Raposa, Tartaruga e Vaca) com arquivos 3MF/STL individuais oficiais.",
    count: 9,
    driveFolderUrl: "https://drive.google.com/drive/folders/1A06ElbuCLm--vF3l3EINTMKYsk8UEf-b?usp=sharing",
  },
  {
    id: "sec-rpg",
    title: "SESSÃO RPG & MINIATURAS FANTASIA (FINAL FANTASY, WARHAMMER, MONSTROS & HERÓIS)",
    shortTitle: "RPG & MINIATURAS",
    iconType: "sword",
    accentColor: "text-purple-400",
    description: "Mais de 460 miniaturas e estátuas de RPG de mesa, wargames e universos de fantasia épica com STLs dedicados e fotos exclusivas.",
    count: 467,
    driveFolderUrl: "https://drive.google.com/drive/folders/1JfdAhzEim1pPst3DHRCo9XQATqj8zSue?usp=drive_link",
  },
  {
    id: "sec-cenarios",
    title: "SESSÃO CENÁRIOS & DIORAMAS 3D (CASTELOS, RUÍNAS, CASAS & MASMORRAS)",
    shortTitle: "CENÁRIOS & DIORAMAS",
    iconType: "box",
    accentColor: "text-emerald-400",
    description: "Mais de 140 maquetes, edifícios modulares, castelos medievais, masmorras e trincheiras góticas prontas para impressão 3D.",
    count: 141,
    driveFolderUrl: "https://drive.google.com/drive/folders/1x_CmWOShR1rXF3f3R1jN8Be0Y4EiLwqt?usp=drive_link",
  },
  {
    id: "sec-disney",
    title: "SESSÃO DISNEY & ANIMAÇÃO 3D (TOY STORY, MICKEY, CINDERELA, ALICE & CLÁSSICOS)",
    shortTitle: "DISNEY & ANIMAÇÃO",
    iconType: "sparkles",
    accentColor: "text-pink-400",
    description: "Mais de 140 personagens lendários dos clássicos Disney, Pixar e DreamWorks com fotos exclusivas sem repetição e arquivos STL.",
    count: 142,
    driveFolderUrl: "https://drive.google.com/drive/folders/187M6Mgh24dGzWykaeEejhUs0PWBkZLhf?usp=drive_link",
  },
  {
    id: "sec-chaveiros",
    title: "SESSÃO CHAVEIROS & KEYCHAINS 3D (LEGO APERTÁVEIS, RELIGIOSOS, POKÉMON & GEEK)",
    shortTitle: "CHAVEIROS & KEYCHAINS",
    iconType: "key",
    accentColor: "text-amber-400",
    description: "Coleção comercial de altíssima saída e margem de lucro. Inclui linha exclusiva de Chaveiros Cabeça Lego Apertáveis (Deadpool, Homem-Aranha, Venom, Capitão América, Múmia e Skeleton), além de linhas religiosas, Pokémon e pets com imagens reais sem repetição e arquivos STL dedicados.",
    count: 104,
    driveFolderUrl: "https://drive.google.com/drive/folders/1z6kfc6DL60BvHp7rOnYZelOqo8GykSVh?usp=drive_link",
  },
  {
    id: "sec-mascotes",
    title: "SESSÃO MASCOTES DE FUTEBOL & CLUBES BRASILEIROS 3D (STLS EXCLUSIVOS)",
    shortTitle: "MASCOTES FUTEBOL",
    iconType: "sword",
    accentColor: "text-amber-400",
    description: "Coleção completa com 31 mascotes 3D dos maiores clubes do Brasil (Flamengo, Corinthians, Palmeiras, São Paulo, Santos, Grêmio, Inter, Vasco, Botafogo, Fluminense, Cruzeiro, Galo, Ceará, Goiás, Sport, Ponte Preta, Vila Nova) e Seleção Brasileira (Canarinho Furioso & Canarinha Feliz), além de edições temáticas Super Mario torcedor. Arquivos STL, 3MF multicolor e fotos exclusivas sem repetição.",
    count: 31,
    driveFolderUrl: "https://drive.google.com/drive/folders/1D8yBzLyaUmnhVl1i_nsRjEUHPGInYHzD?usp=sharing",
  },
  {
    id: "sec-natal",
    title: "SESSÃO ESPECIAL NATAL 3D (ÁRVORES GIRATÓRIAS, PAPAI NOEL, RENAS & ENFEITES)",
    shortTitle: "ESPECIAL DE NATAL",
    iconType: "sparkles",
    accentColor: "text-neutral-400",
    description: "Coleção temática natalina completa: árvores giratórias, Papai Noel de tricô, bonecos de neve, renas, enfeites e decorações festivas com arquivos STL e fotos reais.",
    count: 41,
    driveFolderUrl: "https://drive.google.com/drive/folders/16gu8zi8f9gRikuUl64BfmGnkTMQHzPE6?usp=drive_link",
  },
  {
    id: "sec-series",
    title: "SESSÃO SÉRIES & TV 3D (GAME OF THRONES, BREAKING BAD, STRANGER THINGS, ROUND 6, LA CASA DE PAPEL)",
    shortTitle: "SÉRIES & CINEMA",
    iconType: "gamepad",
    accentColor: "text-neutral-400",
    description: "148 estatuetas colecionáveis e bustos detalhados de personagens icônicos da TV mundial com fotos de estúdio e arquivos STL completos.",
    count: 148,
    driveFolderUrl: "https://drive.google.com/drive/folders/1m5RkHJtlzZJu4-ZvVWgCn5VC0KXMoS9x?usp=drive_link",
  },
  {
    id: "sec-religiao",
    title: "SESSÃO RELIGIÃO & ARTE SACRA (CRISTO, MÃE MARIA, SÃO FRANCISCO & SAGRADA FAMÍLIA)",
    shortTitle: "ARTE SACRA",
    iconType: "shield",
    accentColor: "text-neutral-400",
    description: "Esculturas religiosas e sacras em alta resolução com fotos reais e STLs: São Francisco, Santo Cristo, Mãe Maria, Leão de Judá e Cruz Sagrada.",
    count: 7,
    driveFolderUrl: "https://drive.google.com/drive/folders/1B7KfNkQyk1Tc0kIPk2yAp4wrXgt1Kr_4?usp=drive_link",
  },
  {
    id: "sec-veiculos",
    title: "SESSÃO VEÍCULOS & CARROS 3D (SUPERESPORTIVOS, CLÁSSICOS NACIONAIS, F1 & CAMINHÕES)",
    shortTitle: "VEÍCULOS & CARROS",
    iconType: "bot",
    accentColor: "text-neutral-400",
    description: "Coleção completa de 178 veículos em alta resolução 3D: superesportivos Ferrari, Porsche e Lamborghini, clássicos brasileiros Opala, Gol e Fusca, muscle cars Mustang e Camaro, Fórmula 1, caminhões pesados e motos com arquivos STL e fotos reais.",
    count: 178,
    driveFolderUrl: "https://drive.google.com/drive/folders/1KTrGsqUpiDFPYPqVq12C2Qe5j-hZ1Wey?usp=drive_link",
  },
  {
    id: "sec-minifiguras",
    title: "SESSÃO MINIFIGURAS LEGO 500% (PERSONAGENS & ÍCONES POP)",
    shortTitle: "MINIFIGURAS",
    iconType: "sparkles",
    accentColor: "text-neutral-400",
    description: "Acervo monumental de 99 minifiguras em escala 500% (~22cm): Ayrton Senna, Harry Potter, Michael Jackson, Luffy, Goku, Darth Vader, Bob Ross, Homem-Aranha e muito mais.",
    count: 99,
    driveFolderUrl: "https://drive.google.com/drive/folders/1Mxm7HJ_K3tEUVGdbut92nwkJg-rNQI8o?usp=drive_link",
  },
  {
    id: "sec-bobesponja",
    title: "SESSÃO BOB ESPONJA & FENDA DO BIQUÍNI (18 MODELOS LEGO 500%)",
    shortTitle: "BOB ESPONJA",
    iconType: "sparkles",
    accentColor: "text-neutral-400",
    description: "Coleção completa dos personagens da Fenda do Biquíni em escala 500%: Bob Esponja, Patrick, Sandy Cheeks, Lula Molusco, Plankton, Sr. Sirigueijo e variantes.",
    count: 18,
    driveFolderUrl: "https://drive.google.com/drive/folders/1rygm1EbJD51DEaTdBMLzxQioV3J4NbXm?usp=drive_link",
  },
  {
    id: "sec-dragonball",
    title: "SESSÃO DRAGON BALL 3D (GOKU ULTRA INSTINCT, MAJIN BUU, PICCOLO & VEGETA)",
    shortTitle: "DRAGON BALL 3D",
    iconType: "zap",
    accentColor: "text-neutral-400",
    description: "Action figures e suportes de parede temáticos de Dragon Ball Super & Z com alta definição e suporte AMS.",
    count: 7,
    driveFolderUrl: "https://drive.google.com/drive/folders/1S8b4xW0COG80vEoGFVHKIo4Ev0_ZMXWs?usp=drive_link",
  },
  {
    id: "sec-minecraft",
    title: "SESSÃO MINECRAFT 3D (ZOMBIE, ESQUELETO, RAPOSA & TOCHA LED)",
    shortTitle: "MINECRAFT 3D",
    iconType: "box",
    accentColor: "text-neutral-400",
    description: "Figuras articuladas do universo Minecraft: Zombie 500%, Esqueleto, Raposa Laranja, Tocha funcional e mobs em blocos.",
    count: 13,
    driveFolderUrl: "https://drive.google.com/drive/folders/1VXWqYw1UzwB8jtOSTS5TGDpnrjqlF_cF?usp=drive_link",
  },
  {
    id: "sec-fallout",
    title: "SESSÃO FALLOUT 3D (CAVALEIRO TITUS, DOGMEAT & POWER ARMOR)",
    shortTitle: "FALLOUT 3D",
    iconType: "shield",
    accentColor: "text-neutral-400",
    description: "Figuras oficiais da franquia Fallout: Cavaleiro Titus em Power Armor T-60 em escala 500% (22cm), Dogmeat e guerreiros da Irmandade do Aço.",
    count: 7,
    driveFolderUrl: "https://drive.google.com/drive/folders/1_TW61QfVLdRX9sv7O8YReWkwe-cpc7qs?usp=drive_link",
  },
  {
    id: "sec-mistas",
    title: "SESSÃO COLEÇÕES MISTAS & ESPECIAIS (WEDNESDAY ADDAMS, MEDUSA & MASTER CHIEF)",
    shortTitle: "COLEÇÕES MISTAS",
    iconType: "sword",
    accentColor: "text-neutral-400",
    description: "Wandinha Addams 500%, Medusa mitológica, Master Chief Mecha, Soldado Toy Story, Ninjas e figuras exclusivas.",
    count: 23,
    driveFolderUrl: "https://drive.google.com/drive/folders/1mDsdUmRKH5MbxcZz0-AAfV0vixWAm78R?usp=drive_link",
  },
  {
    id: "sec-dc-comics",
    title: "SESSÃO DC COMICS & LEGO 500% (BATMAN, SUPERMAN, FLASH, CORINGA • STLS & FOTOS REAIS)",
    shortTitle: "DC COMICS LEGO",
    iconType: "shield",
    accentColor: "text-neutral-400",
    description: "Coleção completa com fotos reais individuais e arquivos STL/3MF: Batman (todas as versões), Superman 2025 David Corenswet, The Flash, Coringa, Espantalho, Godspeed, Zoom e Invencível.",
    count: 28,
    driveFolderUrl: "https://drive.google.com/drive/folders/1Ckgw6mkDto3yC8mhd0hxqbFiQajly2iL?usp=drive_link",
  },
  {
    id: "sec-pokemon",
    title: "SESSÃO POKÉMON 3D • 1ª GERAÇÃO COMPLETA (STL & FOTOS REAIS)",
    shortTitle: "POKÉMON 3D",
    iconType: "zap",
    accentColor: "text-neutral-400",
    description: "38 modelos clássicos da 1ª geração com fotos reais e arquivos STL completos: Ivysaur Pokébola, Charizard, Blastoise, Gengar, Gyarados, Abra, Haunter, Eeveelutions, Onix e muito mais.",
    count: 38,
    driveFolderUrl: "https://drive.google.com/drive/folders/11w8N3fu5M4Vg3Avy8nvKn8dybPaqA9Uf?usp=sharing",
  },
  {
    id: "sec-monster",
    title: "SESSÃO MONSTER ENERGY • PORTA LATAS, COPOS & DISPENSADORES (STL)",
    shortTitle: "MONSTER PORTA COPOS",
    iconType: "zap",
    accentColor: "text-neutral-400",
    description: "Coleção completa com imagens reais de cada modelo: porta latas moletom, caixa expositora dobrável, dispensador 16oz, copos multipartes e chaveiros abridores.",
    count: 19,
    driveFolderUrl: MONSTER_DRIVE_FOLDER_URL,
  },
  {
    id: "sec-aeromodelos",
    title: "SESSÃO AEROMODELOS RC & JATOS DE COMBATE (STL)",
    shortTitle: "AEROMODELOS",
    iconType: "bot",
    accentColor: "text-neutral-400",
    description: "Caças F-14, F-15, F-16, SR-71 Blackbird, caças da Segunda Guerra, jatos EDF e modelos rádio-controlados funcionais com aerodinâmica real.",
    count: 42,
    driveFolderUrl: "https://drive.google.com/drive/folders/1Y_vY_plXGWCl5M_cPc2SVNTaT4LxAxyx",
  },
  {
    id: "sec-animais",
    title: "SESSÃO ANIMAIS 3D ARTICULADOS & REALISTAS",
    shortTitle: "ANIMAIS 3D",
    iconType: "box",
    accentColor: "text-neutral-400",
    description: "Animais flexíveis print-in-place, réplicas realistas, leões, dragões articulados, polvos, dinossauros e fauna colecionável sem suportes.",
    count: 65,
    driveFolderUrl: "https://drive.google.com/drive/folders/1daOHhLdpwbkTLCAO-xLwesIe79X689sa",
  },
  {
    id: "sec-animes-vip",
    title: "SESSÃO ANIMES 3D VIP (NARUTO, DRAGON BALL, ONE PIECE & HEROES)",
    shortTitle: "ANIMES VIP",
    iconType: "sparkles",
    accentColor: "text-neutral-400",
    description: "Personagens em escala colecionável de Naruto, Dragon Ball Z, One Piece, Bleach, Cavaleiros do Zodíaco e ícones da animação japonesa.",
    count: 146,
    driveFolderUrl: "https://drive.google.com/drive/folders/1UAEzplPgeSiZKwHe7c86aL7H60nL0a_s",
  },
  {
    id: "sec-articulados",
    title: "SESSÃO ARTICULADOS & MINIATURAS PRINT-IN-PLACE",
    shortTitle: "ARTICULADOS",
    iconType: "zap",
    accentColor: "text-neutral-400",
    description: "Criaturas com juntas mecânicas móveis de impressão direta na mesa, dragões de cristal, lagartixas, robôs e action figures.",
    count: 100,
    driveFolderUrl: "https://drive.google.com/drive/folders/1y1z-M18VbL0p29V2oB0q-996Nq713H_1",
  },
  {
    id: "sec-brinquedos",
    title: "SESSÃO BRINQUEDOS EDUCATIVOS, PUZZLES & JOGOS DE TABULEIRO",
    shortTitle: "BRINQUEDOS",
    iconType: "gamepad",
    accentColor: "text-neutral-400",
    description: "Engrenagens cinemáticas, quebra-cabeças 3D, jogos de lógica, labirintos e brinquedos pedagógicos para montagem e diversão.",
    count: 12,
    driveFolderUrl: "https://drive.google.com/drive/folders/1w5m7gG4vQ1g9M-979144wP53805V6G9N",
  },
  {
    id: "sec-bustos",
    title: "SESSÃO BUSTOS COLECIONÁVEIS HQ & CINEMA (A-Z)",
    shortTitle: "BUSTOS HQ",
    iconType: "sword",
    accentColor: "text-neutral-400",
    description: "Galeria premium de bustos com alta contagem de polígonos: heróis da Marvel, DC Comics, monstros clássicos e personagens lendários.",
    count: 89,
    driveFolderUrl: "https://drive.google.com/drive/folders/1z6V-P0w3M9_N0l4P9_4vQ-Qv649N_B8",
  },
  {
    id: "sec-funkos",
    title: "SESSÃO FUNKOS OFERTA VIP (25 MODELOS • FOTOS & STLS REAIS)",
    shortTitle: "FUNKOS POP",
    iconType: "sparkles",
    accentColor: "text-neutral-400",
    description: "25 modelos Funko Pop clássicos com fotos reais: Goku, Chaves, Hulk, Homem de Ferro, Batman, Toy Story e mais.",
    count: 25,
    driveFolderUrl: "https://drive.google.com/drive/folders/175F3xYnU59y-0G9N6v5M8P-39714qV5N",
  }
];
