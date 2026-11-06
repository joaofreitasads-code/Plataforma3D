import React, { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import { 
  Search, Folder, Download, ExternalLink, Filter, 
  ArrowUpDown, Box, Check, Sparkles, HardDrive, X, Heart,
  Grid, LayoutList, ChevronRight, ChevronLeft, Layers
} from 'lucide-react';
import { ALL_MODELS, SECTIONS, VIP_DRIVE_MAIN_URL, ModelItem } from '../data/modelsData';
import { ModelCard } from './ModelCard';
import { preloadImageBatch, preloadPriorityImages, getOptimizedCardImageUrl } from '../utils/imageOptimizer';

interface AllFilesTabProps {
  initialCategory?: string;
  onOpenModel: (model: ModelItem) => void;
  onDirectDownload: (model: ModelItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const AllFilesTab: React.FC<AllFilesTabProps> = ({
  initialCategory = 'all',
  onOpenModel,
  onDirectDownload,
  favorites,
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'margin' | 'printTime'>('recent');
  const [visibleCount, setVisibleCount] = useState<number>(36);
  // View mode: 'sections' (estilo exato da ref2.png com fileiras por categoria) ou 'grid' (grade completa)
  const [viewMode, setViewMode] = useState<'sections' | 'grid'>('sections');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync category if initialCategory changes from parent
  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Categories list for quick filtering pills (estilo da ref2.png)
  const categoriesList = useMemo(() => {
    const list = [
      { id: 'all', label: 'Todos os Arquivos', count: ALL_MODELS.length },
      { id: 'canecas', label: 'Canecas Gamer', count: 10 },
      { id: 'estadios', label: 'Estádios de Futebol', count: 10 },
      { id: 'pocket-pals', label: 'Pocket Pals', count: 10 },
      { id: 'pokemon', label: 'Coleção Pokémon', count: 38 },
      { id: 'monster', label: 'Porta Latas Monster', count: 19 },
      ...SECTIONS.map(s => ({
        id: s.id,
        label: s.shortTitle,
        count: s.count
      }))
    ];

    // Deduplicate by ID
    const seen = new Set<string>();
    return list.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, []);

  // Filter models based on search, category and sort
  const filteredModels = useMemo(() => {
    let list = [...ALL_MODELS];

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      const lowerCat = selectedCategory.toLowerCase();
      list = list.filter(m => {
        if (lowerCat === 'canecas') return m.sectionId === 'canecas' || m.category.toLowerCase().includes('caneca');
        if (lowerCat === 'estadios') return m.sectionId === 'estadios' || m.category.toLowerCase().includes('estádio') || m.category.toLowerCase().includes('estadio');
        if (lowerCat === 'pocket-pals') return m.sectionId === 'pocket-pals' || m.category.toLowerCase().includes('pocket');
        if (lowerCat === 'pokemon') return m.sectionId === 'pokemon' || m.category.toLowerCase().includes('pokémon') || m.category.toLowerCase().includes('pokemon');
        if (lowerCat === 'monster') return m.sectionId === 'monster' || m.category.toLowerCase().includes('monster');
        return m.sectionId === selectedCategory || m.category.toLowerCase().includes(lowerCat);
      });
    }

    // 2. Search Filter
    if (deferredSearch.trim()) {
      const query = deferredSearch.toLowerCase().trim();
      list = list.filter(m => {
        return (
          m.title.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query) ||
          (m.badge && m.badge.toLowerCase().includes(query)) ||
          (m.description && m.description.toLowerCase().includes(query)) ||
          (m.stlFiles && m.stlFiles.some(f => f.name.toLowerCase().includes(query)))
        );
      });
    }

    // 3. Sorting
    if (sortBy === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'margin') {
      list.sort((a, b) => (b.suggestedPrice || 0) - (a.suggestedPrice || 0));
    } else if (sortBy === 'printTime') {
      list.sort((a, b) => (a.printTimeHours || 99) - (b.printTimeHours || 99));
    }

    return list;
  }, [selectedCategory, deferredSearch, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(36);
  }, [selectedCategory, deferredSearch, sortBy]);

  // Infinite scroll observer for grid mode
  useEffect(() => {
    if (!sentinelRef.current || viewMode !== 'grid') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => (prev < filteredModels.length ? prev + 36 : prev));
      }
    }, { rootMargin: '600px' });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filteredModels.length, viewMode]);

  const displayedModels = useMemo(() => {
    return filteredModels.slice(0, visibleCount);
  }, [filteredModels, visibleCount]);

  // Defined sections for the 'sections' layout matching ref2.png
  const curatedSections = useMemo(() => {
    return [
      {
        id: 'canecas',
        title: 'Canecas Gamer & Geek',
        subtitle: 'Canecas temáticas personalizadas em STL com encaixe de lata de alumínio.',
        models: ALL_MODELS.filter(m => m.sectionId === 'canecas' || m.category.toLowerCase().includes('caneca')).slice(0, 8)
      },
      {
        id: 'estadios',
        title: 'Estádios de Futebol Brasileirão',
        subtitle: 'Réplicas 3D dos maiores estádios do futebol brasileiro prontas para impressão.',
        models: ALL_MODELS.filter(m => m.sectionId === 'estadios' || m.category.toLowerCase().includes('estádio') || m.category.toLowerCase().includes('estadio')).slice(0, 8)
      },
      {
        id: 'pocket-pals',
        title: 'Pocket Pals Articulados',
        subtitle: 'Coleção fofa de animais articulados print-in-place (sem suportes).',
        models: ALL_MODELS.filter(m => m.sectionId === 'pocket-pals' || m.category.toLowerCase().includes('pocket')).slice(0, 8)
      },
      {
        id: 'pokemon',
        title: 'Coleção Pokémon 3D',
        subtitle: 'Modelos STL de Pokémon para colecionadores e pintura.',
        models: ALL_MODELS.filter(m => m.sectionId === 'pokemon' || m.category.toLowerCase().includes('pokémon')).slice(0, 8)
      },
      {
        id: 'monster',
        title: 'Porta Latas Monster Energy',
        subtitle: 'Porta latas decorativos nos temas automotivo, anime, heróis e caveiras.',
        models: ALL_MODELS.filter(m => m.sectionId === 'monster' || m.category.toLowerCase().includes('monster')).slice(0, 8)
      },
      {
        id: 'mais-populares',
        title: 'Modelos Mais Baixados da Semana',
        subtitle: 'Os arquivos STL e 3MF com maior volume de downloads pelos membros VIP.',
        models: ALL_MODELS.slice(0, 8)
      }
    ];
  }, []);


  const handleSelectSection = (catId: string) => {
    setSelectedCategory(catId);
    setViewMode('grid');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 text-left max-w-7xl w-full mx-auto select-none">
      {/* 1. Header Hero Banner - Estilo Área de Membros Preto e Laranja */}
      <div className="bg-[#13151a] border-2 border-[#ff6600] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 text-left relative overflow-hidden">
        {/* Subtle orange ambient glow in background */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#ff6600]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6600]/20 border border-[#ff6600]/50 text-[#ff6600] text-xs font-black uppercase tracking-wider">
              <Folder className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>BIBLIOTECA COMPLETA DE ARQUIVOS VIP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-sans leading-tight">
              TODOS OS <span className="text-[#ff6600]">ARQUIVOS</span> & PASTAS STL
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm font-medium leading-relaxed">
              Explore o acervo completo de arquivos STL e 3MF organizados por coleções e categorias. Acesse diretamente a pasta oficial no Google Drive ou baixe individualmente cada modelo com os cards em laranja.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href={VIP_DRIVE_MAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff6600] via-[#ea580c] to-[#f59e0b] hover:brightness-110 active:scale-95 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-[#ff6600]/30 flex items-center justify-center gap-2.5 cursor-pointer select-none"
            >
              <HardDrive className="w-4 h-4 stroke-[2.5]" />
              <span>ABRIR DRIVE VIP (RAIZ)</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* 2. Barra de Pesquisa Rápida */}
        <div className="relative flex items-center pt-1 z-10">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (viewMode === 'sections' && e.target.value.trim().length > 0) {
                setViewMode('grid');
              }
            }}
            placeholder="Pesquisar arquivos por nome, coleção, categoria ou formato STL..."
            className="w-full bg-white text-neutral-900 text-sm sm:text-base pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl border border-neutral-300 focus:border-[#ff6600] focus:ring-4 focus:ring-[#ff6600]/25 outline-none transition placeholder:text-neutral-400 font-bold shadow-md"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
              title="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3. Pílulas de Categorias Rápidas (Estilo ref2.png com Botão Laranja) */}
        <div className="pt-2 z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'all') {
                      setViewMode('grid');
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer select-none flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#ff6600] text-white shadow-lg shadow-[#ff6600]/40 ring-2 ring-[#ff6600]'
                      : 'bg-[#181a20] hover:bg-[#22252e] text-neutral-300 hover:text-white border border-[#262933]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Barra de Modos de Visualização & Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold pt-1 border-b border-[#1e2129] pb-4">
        {/* Left: View Mode Buttons (Por Seções vs Grade Completa) */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-[11px] font-mono uppercase mr-1">Visualização:</span>
          <button
            type="button"
            onClick={() => {
              setViewMode('sections');
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'sections'
                ? 'bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/30'
                : 'bg-[#13151a] text-neutral-400 hover:text-white border border-[#262933]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Por Coleções</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/30'
                : 'bg-[#13151a] text-neutral-400 hover:text-white border border-[#262933]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grade Completa</span>
          </button>
        </div>

        {/* Right: Counter and Sort By */}
        <div className="flex items-center gap-3">
          <span className="text-white font-extrabold uppercase tracking-tight">
            Biblioteca de Arquivos
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 uppercase text-[11px] font-mono hidden md:inline">Ordem:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#13151a] border border-[#262933] text-white text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-[#ff6600] cursor-pointer"
            >
              <option value="recent">Mais Recentes</option>
              <option value="name">Nome (A - Z)</option>
              <option value="margin">Maior Valor Sugerido</option>
              <option value="printTime">Menor Tempo de Impressão</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. VISUALIZAÇÃO 1: POR CATEGORIAS / SEÇÕES (Layout exato da foto de referência ref2.png) */}
      {viewMode === 'sections' && !deferredSearch.trim() && selectedCategory === 'all' && (
        <div className="space-y-10">
          {curatedSections.map((sec) => (
            <section key={sec.id} className="space-y-4">
              <div className="flex items-end justify-between border-b border-[#1e2129] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff6600]" />
                    <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight font-sans">
                      {sec.title}
                    </h2>
                  </div>
                  <p className="text-neutral-400 text-xs sm:text-sm font-medium">
                    {sec.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectSection(sec.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#181a20] hover:bg-[#ff6600] text-neutral-300 hover:text-white border border-[#262933] hover:border-[#ff6600] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Ver todos ({sec.models.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid of Cards for this section */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-3.5">
                {sec.models.map((model, idx) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    priority={idx < 4}
                    isFavorite={favorites.includes(model.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetails={onOpenModel}
                    onDirectDownload={onDirectDownload}
                    orangeVariant={true}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* 6. VISUALIZAÇÃO 2: GRADE COMPLETA (Grid com Todos os Cards em Laranja e Infinite Scroll) */}
      {(viewMode === 'grid' || deferredSearch.trim() !== '' || selectedCategory !== 'all') && (
        <>
          {filteredModels.length === 0 ? (
            <div className="p-16 text-center border-2 border-[#262933] rounded-3xl bg-[#13151a] space-y-4">
              <Box className="w-12 h-12 text-neutral-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-white text-base font-black">Nenhum arquivo encontrado</p>
                <p className="text-neutral-400 text-xs">Tente buscar com outros termos ou limpar os filtros de categoria.</p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 bg-[#ff6600] hover:bg-[#ea580c] text-white text-xs font-black uppercase rounded-xl transition cursor-pointer shadow-md shadow-[#ff6600]/25"
              >
                Ver Todos os Arquivos
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-3.5">
                {displayedModels.map((model, index) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    priority={index < 24}
                    isFavorite={favorites.includes(model.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetails={onOpenModel}
                    onDirectDownload={onDirectDownload}
                    orangeVariant={true}
                  />
                ))}
              </div>

              {/* Sentinel for infinite scroll */}
              {visibleCount < filteredModels.length && (
                <div ref={sentinelRef} className="h-6 w-full pointer-events-none" />
              )}

              {/* Load More Button */}
              {visibleCount < filteredModels.length && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 36)}
                    className="px-8 py-3.5 bg-[#13151a] hover:bg-[#181a20] text-white border-2 border-[#ff6600] hover:border-[#ff8833] text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-[#ff6600]/20 cursor-pointer active:scale-95 flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>Carregar Mais Arquivos</span>
                    <span className="text-[#ff6600] font-bold">↓</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
