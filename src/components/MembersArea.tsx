import React, { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import { 
  Search, Bell, Heart,
  ChevronDown, Menu, X, ArrowUpDown, Box, Check, LogOut,
  Sparkles, Crown, Download, ExternalLink, Folder, BarChart3,
  SlidersHorizontal, User, Trophy
} from 'lucide-react';
import { 
  ALL_MODELS, VIP_DRIVE_MAIN_URL,
  ModelItem 
} from '../data/modelsData';
import { preloadPriorityImages, preloadImageBatch } from '../utils/imageOptimizer';
import { ModelCard } from './ModelCard';
import { ModelDetailModal } from './ModelDetailModal';
import { NotificationsModal } from './NotificationsModal';
import { DownloadsTab } from './DownloadsTab';
import { BonusSectionsGrid } from './BonusSectionsGrid';
import { CategoriesTab } from './CategoriesTab';
import { CategoryItem } from '../data/categoriesData';
import { Sidebar, TabKey } from './Sidebar';
import { MemberUser } from '../types/auth';

interface MembersAreaProps {
  currentUser: MemberUser;
  onLogout: () => void;
}

// Filter pills matching the real 3D printing catalog in the ref4.png style
const PILL_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'action-figures', label: 'Action Figures' },
  { id: 'geek', label: 'Geek & Gamer' },
  { id: 'chaveiros', label: 'Chaveiros' },
  { id: 'pokemon', label: 'Pokémon' },
  { id: 'articulados', label: 'Articulados' },
  { id: 'estadios', label: 'Estádios' },
  { id: 'carros', label: 'Carros & Veículos' },
];

export const MembersArea: React.FC<MembersAreaProps> = ({ currentUser, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedPill, setSelectedPill] = useState<string>('all');
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'margin' | 'printTime'>('recent');
  const [visibleCount, setVisibleCount] = useState<number>(35);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const moreFiltersRef = useRef<HTMLDivElement | null>(null);

  // Global Ctrl + K shortcut to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close user profile & more filters dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (moreFiltersRef.current && !moreFiltersRef.current.contains(e.target as Node)) {
        setIsMoreFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('universo3d_favorites');
      return saved ? JSON.parse(saved) : ['poke-charizard', 'poke-gengar', 'funko-oferta-10'];
    } catch {
      return ['poke-charizard'];
    }
  });

  // Downloads history state
  const [downloads, setDownloads] = useState<ModelItem[]>(() => {
    try {
      const saved = localStorage.getItem('universo3d_downloads');
      if (saved) return JSON.parse(saved);
      const s1 = ALL_MODELS.find(m => m.id === 'poke-charizard');
      const s2 = ALL_MODELS.find(m => m.id === 'poke-blastoise');
      return [s1, s2].filter(Boolean) as ModelItem[];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('universo3d_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const modelsList = useMemo(() => {
    return ALL_MODELS;
  }, []);

  // Proactive background preloading of image assets for zero delay
  useEffect(() => {
    if (modelsList.length > 0) {
      const topUrls = modelsList.slice(0, 35).map(m => m.thumbnailUrl || m.imageUrl || '').filter(Boolean);
      preloadPriorityImages(topUrls);

      const restUrls = modelsList.slice(35, 100).map(m => m.thumbnailUrl || m.imageUrl || '').filter(Boolean);
      preloadImageBatch(restUrls, 65);
    }
  }, [modelsList]);

  // Filter models
  const filteredModels = useMemo(() => {
    let list = modelsList;

    // Tab favorites
    if (activeTab === 'favorites') {
      return list.filter(m => favorites.includes(m.id));
    }

    // Tab downloads
    if (activeTab === 'downloads') {
      return downloads;
    }

    // Sidebar Category Filter
    if (selectedSessionFilter !== 'all') {
      list = list.filter(m => {
        if (selectedSessionFilter === 'sec-chaveiros') return m.sectionId === 'sec-chaveiros' || m.category.toLowerCase().includes('chaveir');
        if (selectedSessionFilter === 'sec-canecas') return m.sectionId === 'sec-canecas' || m.category.toLowerCase().includes('caneca');
        if (selectedSessionFilter === 'sec-portacopos') return m.sectionId === 'sec-portacopos' || m.category.toLowerCase().includes('copos') || m.category.toLowerCase().includes('latas');
        if (selectedSessionFilter === 'sec-canecas-gamer') return m.sectionId === 'sec-canecas-gamer' || m.category.toLowerCase().includes('gamer');
        if (selectedSessionFilter === 'sec-estadios') return m.sectionId === 'sec-estadios' || m.category.toLowerCase().includes('estádios') || m.category.toLowerCase().includes('arenas');
        if (selectedSessionFilter === 'sec-destaques-dashboard') return m.sectionId === 'sec-destaques-dashboard' || m.category.toLowerCase().includes('figure');
        if (selectedSessionFilter === 'sec-mascotes') return m.sectionId === 'sec-mascotes' || m.category.toLowerCase().includes('mascote');
        if (selectedSessionFilter === 'sec-carros') return m.sectionId === 'sec-carros' || m.category.toLowerCase().includes('carros') || m.category.toLowerCase().includes('veículos');
        if (selectedSessionFilter === 'sec-pocket-pals') return m.sectionId === 'sec-pocket-pals' || m.category.toLowerCase().includes('pocket') || m.category.toLowerCase().includes('articulados');
        if (selectedSessionFilter === 'sec-pokemon') return m.sectionId === 'sec-pokemon' || m.category.toLowerCase().includes('pokémon') || m.category.toLowerCase().includes('anime');
        if (selectedSessionFilter === 'sec-minifiguras') return m.sectionId === 'sec-minifiguras' || m.category.toLowerCase().includes('lego');
        if (selectedSessionFilter === 'sec-rpg') return m.sectionId === 'sec-rpg' || m.category.toLowerCase().includes('rpg');
        return m.sectionId === selectedSessionFilter || m.category.toLowerCase().includes(selectedSessionFilter.toLowerCase());
      });
    }

    // Pill filter
    if (selectedPill !== 'all') {
      list = list.filter(m => {
        const titleAndCat = (m.title + ' ' + m.category + ' ' + (m.description || '')).toLowerCase();
        if (selectedPill === 'action-figures') return m.sectionId === 'sec-destaques-dashboard' || titleAndCat.includes('sonic') || titleAndCat.includes('goku') || titleAndCat.includes('mario') || titleAndCat.includes('wolverine') || titleAndCat.includes('batman') || titleAndCat.includes('sub zero') || titleAndCat.includes('spawn') || titleAndCat.includes('figure');
        if (selectedPill === 'chaveiros') return titleAndCat.includes('chaveir') || titleAndCat.includes('keychain') || titleAndCat.includes('apertável');
        if (selectedPill === 'geek') return titleAndCat.includes('geek') || titleAndCat.includes('gamer') || titleAndCat.includes('playstation') || titleAndCat.includes('mario');
        if (selectedPill === 'pokemon') return titleAndCat.includes('pokémon') || titleAndCat.includes('pokemon') || titleAndCat.includes('pikachu') || titleAndCat.includes('charizard');
        if (selectedPill === 'articulados') return titleAndCat.includes('articulado') || titleAndCat.includes('pocket') || titleAndCat.includes('flex');
        if (selectedPill === 'estadios') return titleAndCat.includes('estádio') || titleAndCat.includes('arena') || titleAndCat.includes('maracanã') || titleAndCat.includes('allianz');
        if (selectedPill === 'carros') return titleAndCat.includes('carro') || titleAndCat.includes('veículo') || titleAndCat.includes('fusca') || titleAndCat.includes('mustang');
        return true;
      });
    }

    // Text Search
    if (deferredSearchQuery.trim()) {
      const q = deferredSearchQuery.toLowerCase();
      list = list.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        (m.badge && m.badge.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'margin') return (b.suggestedPrice || 0) - (a.suggestedPrice || 0);
      if (sortBy === 'printTime') return (a.printTimeHours || 0) - (b.printTimeHours || 0);
      return 0; // recent default
    });
  }, [modelsList, activeTab, favorites, downloads, selectedSessionFilter, selectedPill, deferredSearchQuery, sortBy]);

  // Displayed Models for Pagination
  const displayedModels = useMemo(() => {
    return filteredModels.slice(0, visibleCount);
  }, [filteredModels, visibleCount]);

  // Reset pagination on filter changes
  useEffect(() => {
    setVisibleCount(35);
  }, [selectedSessionFilter, selectedPill, deferredSearchQuery, sortBy, activeTab]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => (prev < filteredModels.length ? prev + 28 : prev));
        }
      },
      { rootMargin: '400px' }
    );
    const cur = loadMoreRef.current;
    if (cur) observer.observe(cur);
    return () => {
      if (cur) observer.unobserve(cur);
    };
  }, [filteredModels.length]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenModel = (model: ModelItem) => {
    setSelectedModel(model);
    setIsDetailModalOpen(true);
  };

  const handleDirectDownload = (model: ModelItem) => {
    setDownloads(prev => {
      if (prev.some(d => d.id === model.id)) return prev;
      return [model, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white flex flex-col font-sans select-none antialiased">
      {/* 1. TOP NAVBAR (EXACT MATCH TO new_ref.png) */}
      <header className="sticky top-0 z-40 bg-[#0d0f14]/95 backdrop-blur-md border-b border-[#181a24] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle if needed */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#181a24] transition cursor-pointer"
            title="Abrir Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: Search Bar (Exact match to new_ref.png) */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 pointer-events-none stroke-[2]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar modelos STL, 3MF, personagens..."
              className="w-full bg-[#13161f] text-neutral-200 text-xs sm:text-sm pl-11 pr-10 py-2.5 sm:py-3 rounded-2xl border border-[#202534] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 outline-none transition placeholder:text-neutral-500 font-medium shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-neutral-400 hover:text-white cursor-pointer p-0.5"
                title="Limpar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Notifications & Meu Perfil Pill (Exact match to new_ref.png) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell with bright orange dot */}
          <button
            type="button"
            onClick={() => setIsNotificationsModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[#131620] hover:bg-[#1a1e2b] text-neutral-300 hover:text-white border border-[#222736] flex items-center justify-center transition cursor-pointer relative"
            title="Notificações"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ff5500] ring-2 ring-[#131620]" />
          </button>

          {/* User Profile Pill ("Meu Perfil" with circular avatar icon) */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#131620] hover:bg-[#1a1e2b] border border-[#222736] text-white transition cursor-pointer select-none"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff5500]/25 to-[#ff4400]/10 border border-[#ff5500]/40 flex items-center justify-center text-[#ff5500]">
                <User className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white pr-1">
                Meu Perfil
              </span>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#12141a] border border-[#22252e] rounded-2xl shadow-2xl py-2 z-50 text-left">
                <div className="px-4 py-2 border-b border-[#1e2129]">
                  <p className="text-xs font-bold text-white">{currentUser?.name || 'João Luiz'}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{currentUser?.email || 'joao.freitas.ads@gmail.com'}</p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('favorites');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-[#181a22] flex items-center gap-2 text-left"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#e5a95d]" />
                    <span>Meus Favoritos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('downloads');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-[#181a22] flex items-center gap-2 text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Meus Downloads</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('bonus');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-[#181a22] flex items-center gap-2 text-left"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#e5a95d]" />
                    <span>14 Seções de Bônus</span>
                  </button>
                </div>

                <div className="border-t border-[#1e2129] pt-1 mt-1">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT (EXACT MATCH TO ref4.png) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'catalog') setSelectedSessionFilter('all');
            }}
            selectedCategoryFilter={selectedSessionFilter}
            onSelectCategoryFilter={(catId) => {
              setSelectedSessionFilter(catId);
              setActiveTab('catalog');
            }}
            favoritesCount={favorites.length}
            downloadsCount={downloads.length}
            currentUser={currentUser}
            onLogout={onLogout}
          />
        </div>

        {/* Mobile Left Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-xs" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-64 bg-[#0c0d11] h-full shadow-2xl">
              <Sidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                selectedCategoryFilter={selectedSessionFilter}
                onSelectCategoryFilter={(catId) => {
                  setSelectedSessionFilter(catId);
                  setActiveTab('catalog');
                  setIsMobileSidebarOpen(false);
                }}
                favoritesCount={favorites.length}
                downloadsCount={downloads.length}
                currentUser={currentUser}
                onLogout={onLogout}
              />
            </div>
          </div>
        )}

        {/* Main Viewport Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
          {/* VIEW: CATALOG (DASHBOARD - EXACT MATCH TO new_ref.png) */}
          {activeTab === 'catalog' && (
            <div className="space-y-8">
              {/* Top Hero Banner: "BEM-VINDO À CENTRAL 3D" (Exact match new_ref.png) */}
              <div className="relative rounded-3xl bg-gradient-to-r from-[#141720] via-[#12151e] to-[#181b24] border border-[#222736] p-6 sm:p-8 overflow-hidden shadow-xl">
                {/* Subtle orange ambient radial flare in background */}
                <div className="absolute left-1/3 -top-24 w-96 h-96 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  {/* Left Column: Welcome text and description */}
                  <div className="space-y-3 max-w-2xl text-left">
                    {/* Badge: ACESSO VITALÍCIO ATIVO */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/40 text-[#ff5500] text-xs font-bold uppercase tracking-wider">
                      <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] font-black">✓</span>
                      <span>ACESSO VITALÍCIO ATIVO</span>
                    </div>

                    {/* Headline: BEM-VINDO À CENTRAL 3D */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-sans">
                      BEM-VINDO À <span className="text-[#ff5500]">CENTRAL 3D</span>
                    </h1>

                    {/* Body Paragraph */}
                    <p className="text-neutral-400 text-xs sm:text-sm font-normal leading-relaxed">
                      Acesse a biblioteca completa de modelos 3D selecionados e testados, organizados por categorias. Encontre seus arquivos favoritos, faça o download direto no Google Drive e descubra novas oportunidades para imprimir e faturar.
                    </p>
                  </div>

                  {/* Right Column: 3 Floating Preview Figures (Sonic Vermelho, Sonic Azul, Sub Zero) */}
                  <div className="shrink-0 flex items-center justify-center lg:justify-end">
                    <div className="relative w-72 sm:w-80 h-36 sm:h-40 flex items-center justify-center select-none pointer-events-none">
                      {/* Left tilted card: Sonic Vermelho */}
                      <div className="absolute left-2 w-28 h-32 rounded-2xl overflow-hidden border border-[#2a2f40] shadow-2xl -rotate-6 transform scale-95 opacity-90 bg-[#0d0f15]">
                        <img 
                          src="https://lh3.googleusercontent.com/d/1aPKlJEHTwKUyuzBqPi32OfxK6vjg9nPN" 
                          alt="Sonic Vermelho" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Center card: Sonic Azul (Dominant) */}
                      <div className="absolute z-10 w-32 h-36 rounded-2xl overflow-hidden border-2 border-[#ff5500]/60 shadow-[0_12px_32px_rgba(0,0,0,0.8)] transform scale-105 bg-[#0d0f15]">
                        <img 
                          src="https://lh3.googleusercontent.com/d/1U2gs8uDv8s-Ue2BJ8AJa23XpLzT5ee7j" 
                          alt="Sonic Azul" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Right tilted card: Sub Zero */}
                      <div className="absolute right-2 w-28 h-32 rounded-2xl overflow-hidden border border-[#2a2f40] shadow-2xl rotate-6 transform scale-95 opacity-90 bg-[#0d0f15]">
                        <img 
                          src="https://lh3.googleusercontent.com/d/1iobUId4HNPpHQKDMtVTksE-VEWGh2ZHy" 
                          alt="Sub Zero" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Header: Dynamic based on selected category or default Front Models */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
                <div className="space-y-1.5 text-left">
                  {/* Badge */}
                  <div className="inline-block bg-[#3b170b] text-[#ff7733] border border-[#ff5500]/30 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    {searchQuery ? `RESULTADOS DA BUSCA: ${searchQuery.toUpperCase()}` : selectedSessionFilter !== 'all' ? 'COLEÇÃO FILTRADA' : 'DESTAQUE PRINCIPAL • 51 NOVOS MODELOS'}
                  </div>

                  {/* Trophy Icon + Section Title */}
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-6 h-6 text-[#ff5500] stroke-[2.5]" />
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                      {searchQuery 
                        ? `Modelos para "${searchQuery}"`
                        : selectedSessionFilter === 'sec-chaveiros' ? 'Chaveiros & Keychains 3D'
                        : selectedSessionFilter === 'sec-canecas' ? 'Canecas Térmicas de Time 3D'
                        : selectedSessionFilter === 'sec-canecas-gamer' ? 'Canecas Gamer 3D'
                        : selectedSessionFilter === 'sec-pokemon' ? 'Coleção Pokémon 3D'
                        : selectedSessionFilter === 'sec-pocket-pals' ? 'Pocket Pals Articulados'
                        : selectedSessionFilter === 'sec-estadios' ? 'Estádios de Futebol 3D'
                        : selectedSessionFilter === 'sec-portacopos' ? 'Porta Copos & Utensílios'
                        : selectedSessionFilter === 'sec-mascotes' ? 'Mascotes de Futebol 3D'
                        : selectedSessionFilter === 'sec-destaques-dashboard' ? 'Action Figures & Colecionáveis Geek 3D'
                        : 'Action Figures, Geek & Colecionáveis 3D'}
                    </h2>
                  </div>

                  {/* Subtitle */}
                  <p className="text-neutral-400 text-xs sm:text-sm font-normal">
                    Modelos 3MF e STL em altíssima resolução fotografados na bancada de estúdio e prontos para fatiar e imprimir.
                  </p>
                </div>

                {/* Right Orange Action Button: Pasta Completa no Google Drive -> */}
                <div className="flex items-center gap-2">
                  {(searchQuery || selectedSessionFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSessionFilter('all');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#1a1e2b] hover:bg-[#222736] text-neutral-300 text-xs font-bold transition border border-[#2a3042] cursor-pointer"
                    >
                      Ver Todas
                    </button>
                  )}
                  <a
                    href={VIP_DRIVE_MAIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] active:bg-[#e64400] text-white text-xs font-bold tracking-wide transition shadow-lg shadow-[#ff5500]/25 flex items-center justify-center gap-2 cursor-pointer select-none shrink-0"
                  >
                    <span>Pasta Completa no Google Drive</span>
                    <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  </a>
                </div>
              </div>

              {/* Search or Active Filter Indicator if filtered */}
              {(searchQuery || selectedSessionFilter !== 'all') && (
                <div className="flex items-center justify-between text-xs text-neutral-300 bg-[#131620] px-4 py-2.5 rounded-xl border border-[#222736]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
                    <span>Filtro ativo:</span>
                    <strong className="text-white">
                      {searchQuery ? `"${searchQuery}"` : selectedSessionFilter}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSessionFilter('all');
                    }}
                    className="text-[#ff5500] hover:underline font-bold text-xs cursor-pointer"
                  >
                    Limpar filtro
                  </button>
                </div>
              )}

              {/* 5-COLUMN CARDS GRID (EXACT MATCH TO new_ref.png) */}
              {displayedModels.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-[#131620] rounded-2xl border border-[#222736] p-8">
                  <Box className="w-10 h-10 text-neutral-600 mx-auto stroke-[1.5]" />
                  <h3 className="text-base font-bold text-white">Nenhum modelo encontrado</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Tente buscar por outro termo para explorar o acervo completo.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-[#ff5500] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    Ver Todos os Modelos
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Grid of exactly 5 cards per row matching new_ref.png */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
                    {displayedModels.map((model, index) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        priority={index < 25}
                        isFavorite={favorites.includes(model.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDetails={handleOpenModel}
                        onDirectDownload={handleDirectDownload}
                      />
                    ))}
                  </div>

                  {/* Sentinel for infinite scroll */}
                  {visibleCount < filteredModels.length && (
                    <div ref={loadMoreRef} className="h-6 w-full pointer-events-none" />
                  )}

                  {/* Load more button */}
                  {visibleCount < filteredModels.length && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setVisibleCount(prev => prev + 25)}
                        className="px-6 py-2.5 bg-[#141720] hover:bg-[#1a1e2b] text-neutral-300 hover:text-white border border-[#232838] hover:border-[#ff5500] text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Carregar Mais Modelos
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW: TODAS CATEGORIAS (EXACT MATCH TO USER IMAGES cat_ref1, cat_ref2, cat_ref3) */}
          {activeTab === 'all-files' && (
            <CategoriesTab
              onSelectCategory={(cat: CategoryItem) => {
                if (cat.sectionId) {
                  setSelectedSessionFilter(cat.sectionId);
                } else {
                  setSelectedSessionFilter('all');
                }
                setSearchQuery(cat.filterQuery.split(' ')[0]);
                setActiveTab('catalog');
              }}
              onOpenDrive={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
            />
          )}

          {/* VIEW: PLANOS E BÔNUS (14 SEÇÕES DE BÔNUS NO ESTILO ref3.png) */}
          {activeTab === 'bonus' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#181a22] pb-4">
                <div className="space-y-1">
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                    Planos & Bônus Exclusivos
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                    Acesse as 14 coleções de arquivos STL e 3MF com imagens quadradas e temas organizados.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs text-[#e5a95d] hover:underline font-bold cursor-pointer"
                >
                  ← Voltar à Biblioteca
                </button>
              </div>

              {/* 14 Blocos em 2 Colunas */}
              <BonusSectionsGrid
                onSelectSection={(catId) => {
                  setSelectedSessionFilter(catId);
                  setActiveTab('catalog');
                }}
                onOpenDrive={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
              />
            </div>
          )}

          {/* VIEW: MEUS FAVORITOS */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#181a22] pb-4">
                <div className="space-y-1">
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                    Meus Favoritos
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                    Modelos 3D que você salvou para download rápido.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs text-[#e5a95d] hover:underline font-bold cursor-pointer"
                >
                  ← Voltar à Biblioteca
                </button>
              </div>

              {filteredModels.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-[#111318] rounded-2xl border border-[#1e2128] p-8">
                  <Heart className="w-10 h-10 text-neutral-600 mx-auto stroke-[1.5]" />
                  <h3 className="text-base font-bold text-white">Nenhum favorito salvo ainda</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Clique no coração em qualquer modelo para adicioná-lo aos seus favoritos.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="px-4 py-2 bg-[#e5a95d] text-neutral-950 font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    Explorar Modelos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-3.5">
                  {filteredModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={true}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDetails={handleOpenModel}
                      onDirectDownload={handleDirectDownload}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: MEUS DOWNLOADS */}
          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#181a22] pb-4">
                <div className="space-y-1">
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                    Meus Downloads
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                    Histórico de arquivos e pastas STL acessados recentemente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs text-[#e5a95d] hover:underline font-bold cursor-pointer"
                >
                  ← Voltar à Biblioteca
                </button>
              </div>

              <DownloadsTab
                downloadedModels={downloads}
                onClearDownloads={() => setDownloads([])}
                onOpenModel={handleOpenModel}
                onReDownload={handleDirectDownload}
                onBrowseCatalog={() => setActiveTab('catalog')}
              />
            </div>
          )}
        </main>
      </div>

      {/* 3. MODAIS: Detalhes 3D e Notificações */}
      {isDetailModalOpen && selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          isOpen={isDetailModalOpen}
          isFavorite={favorites.includes(selectedModel.id)}
          onClose={() => setIsDetailModalOpen(false)}
          onToggleFavorite={handleToggleFavorite}
          onRecordDownload={handleDirectDownload}
        />
      )}

      {isNotificationsModalOpen && (
        <NotificationsModal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MembersArea;
