import React, { useState, useMemo, useEffect, useRef, useDeferredValue, useCallback, lazy, Suspense } from 'react';
import {
  Search, Bell, Heart, Menu, X, Box, LogOut,
  Crown, Download, ExternalLink, User, Trophy, Lock, Rocket, ArrowRight
} from 'lucide-react';
import { ModelItem, VIP_DRIVE_MAIN_URL } from '../data/catalogMeta';
import { FRONT_DASHBOARD_MODELS } from '../data/frontDashboardModels';
import { ModelCard } from './ModelCard';
import { ResilientImg } from './ResilientImg';
import { CategoryItem } from '../data/categoriesData';
import { Sidebar, TabKey } from './Sidebar';
import { MemberUser } from '../types/auth';

// Lazy-load secondary tabs and modals so initial catalog render is ultra-light
const ModelDetailModal = lazy(() => import('./ModelDetailModal').then(m => ({ default: m.ModelDetailModal })));
const NotificationsModal = lazy(() => import('./NotificationsModal').then(m => ({ default: m.NotificationsModal })));
const DownloadsTab = lazy(() => import('./DownloadsTab').then(m => ({ default: m.DownloadsTab })));
const BonusSectionsGrid = lazy(() => import('./BonusSectionsGrid').then(m => ({ default: m.BonusSectionsGrid })));
const CategoriesTab = lazy(() => import('./CategoriesTab').then(m => ({ default: m.CategoriesTab })));
const ProfitCalculator = lazy(() => import('./ProfitCalculator').then(m => ({ default: m.ProfitCalculator })));
const SettingsTab = lazy(() => import('./SettingsTab').then(m => ({ default: m.SettingsTab })));

interface MembersAreaProps {
  currentUser: MemberUser;
  onLogout: () => void;
}

const PILL_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'gta6', label: 'GTA 6' },
  { id: 'estadios', label: 'Estádios 3D' },
  { id: 'canecas', label: 'Canecas de Time' },
  { id: 'mascotes', label: 'Mascotes' },
  { id: 'action-figures', label: 'Action Figures' },
  { id: 'chaveiros', label: 'Chaveiros' },
  { id: 'pokemon', label: 'Pokémon' },
  { id: 'articulados', label: 'Articulados' },
  { id: 'geek', label: 'Geek & Gamer' },
  { id: 'carros', label: 'Carros & Veículos' },
];

// Progressive background loader for the full 1,355-model catalog via fast static JSON (205KB gzipped, off-main-thread JSON parse)
let cachedFullModels: ModelItem[] | null = null;
let fullModelsPromise: Promise<ModelItem[]> | null = null;

function loadFullCatalog(): Promise<ModelItem[]> {
  if (cachedFullModels) return Promise.resolve(cachedFullModels);
  if (!fullModelsPromise) {
    fullModelsPromise = fetch('/catalog-extra.json')
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json() as Promise<ModelItem[]>;
      })
      .then((extra) => {
        cachedFullModels = [...FRONT_DASHBOARD_MODELS, ...extra];
        return cachedFullModels;
      })
      .catch(() =>
        import('../data/modelsData').then((mod) => {
          cachedFullModels = mod.ALL_MODELS;
          return mod.ALL_MODELS;
        })
      );
  }
  return fullModelsPromise;
}

// WeakMap cache of pre-lowercased search haystacks to avoid repeated allocations during filtering
const searchHaystackCache = new WeakMap<ModelItem, { title: string; category: string; full: string }>();

function getSearchEntry(m: ModelItem) {
  let entry = searchHaystackCache.get(m);
  if (!entry) {
    const title = m.title.toLowerCase();
    const category = m.category.toLowerCase();
    const full = `${title} ${category} ${(m.description || '').toLowerCase()} ${(m.badge || '').toLowerCase()}`;
    entry = { title, category, full };
    searchHaystackCache.set(m, entry);
  }
  return entry;
}

const TabLoadingFallback = (
  <div className="py-16 flex items-center justify-center text-xs font-bold text-neutral-400">
    Carregando...
  </div>
);

export const MembersArea: React.FC<MembersAreaProps> = ({ currentUser, onLogout }) => {
  const [modelsList, setModelsList] = useState<ModelItem[]>(() => cachedFullModels || FRONT_DASHBOARD_MODELS);
  const [isFullCatalogLoaded, setIsFullCatalogLoaded] = useState<boolean>(() => Boolean(cachedFullModels));

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedPill, setSelectedPill] = useState<string>('all');
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryItem | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'margin' | 'printTime'>('recent');
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showAcceleratorNotice, setShowAcceleratorNotice] = useState(false);

  const firstName = useMemo(() => {
    const clean = (currentUser?.name || '').trim();
    return clean ? clean.split(/\s+/)[0] : 'Membro';
  }, [currentUser?.name]);

  // Envia notificação de boas-vindas convidando a conhecer os Aceleradores de Resultados assim que o membro entra
  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setShowAcceleratorNotice(true);
    }, 450);
    return () => globalThis.clearTimeout(timer);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const ensureFullCatalog = useCallback(() => {
    if (cachedFullModels) {
      if (!isFullCatalogLoaded) {
        setModelsList(cachedFullModels);
        setIsFullCatalogLoaded(true);
      }
      return;
    }
    loadFullCatalog()
      .then((all) => {
        setModelsList(all);
        setIsFullCatalogLoaded(true);
      })
      .catch(() => {});
  }, [isFullCatalogLoaded]);

  // Hydrate full catalog in background only AFTER page finishes initial load/paint
  useEffect(() => {
    if (isFullCatalogLoaded) return;
    let idleId: number | null = null;
    const scheduleFetch = () => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(ensureFullCatalog, { timeout: 2500 });
      } else {
        ensureFullCatalog();
      }
    };
    const timer = globalThis.setTimeout(scheduleFetch, 900);
    return () => {
      globalThis.clearTimeout(timer);
      if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, [isFullCatalogLoaded, ensureFullCatalog]);

  // Global Ctrl + K shortcut to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        ensureFullCatalog();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ensureFullCatalog]);

  // Close user profile dropdown on click outside
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Favorites state + O(1) lookup set
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('universo3d_favorites');
      return saved ? JSON.parse(saved) : ['poke-charizard', 'poke-gengar', 'front-model-sonic-vermelho-1'];
    } catch {
      return ['poke-charizard'];
    }
  });

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  // Downloads history state
  const [downloads, setDownloads] = useState<ModelItem[]>(() => {
    try {
      const saved = localStorage.getItem('universo3d_downloads');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback below
    }
    return [];
  });

  // Seed default sample downloads once full catalog hydrates if user has no saved history yet
  const seededDownloadsRef = useRef(false);
  useEffect(() => {
    if (!isFullCatalogLoaded || seededDownloadsRef.current) return;
    seededDownloadsRef.current = true;
    try {
      if (localStorage.getItem('universo3d_downloads') !== null) return;
    } catch {
      return;
    }
    const s1 = modelsList.find(m => m.id === 'poke-charizard');
    const s2 = modelsList.find(m => m.id === 'poke-blastoise');
    const defaults = [s1, s2].filter(Boolean) as ModelItem[];
    if (defaults.length > 0) {
      setDownloads(prev => (prev.length === 0 ? defaults : prev));
    }
  }, [isFullCatalogLoaded, modelsList]);

  // Modals state
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('universo3d_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Filter catalog independently of favorites/downloads state so starring a card is O(1)
  const catalogFilteredModels = useMemo(() => {
    let list = modelsList;

    if (selectedSessionFilter !== 'all') {
      const sf = selectedSessionFilter.toLowerCase();
      list = list.filter(m => {
        const { category: cat, full: titleAndDesc } = getSearchEntry(m);
        if (sf === 'sec-gta6' || sf === 'gta6') return m.sectionId === 'sec-gta6' || cat.includes('gta');
        if (sf === 'sec-chaveiros' || sf === 'chaveiros') return m.sectionId === 'sec-chaveiros' || cat.includes('chaveir');
        if (sf === 'sec-canecas' || sf === 'canecas') return m.sectionId === 'sec-canecas' || cat.includes('caneca');
        if (sf === 'sec-portacopos' || sf === 'utilitarios') return m.sectionId === 'sec-portacopos' || cat.includes('copos') || cat.includes('latas') || titleAndDesc.includes('organizador');
        if (sf === 'sec-canecas-gamer') return m.sectionId === 'sec-canecas-gamer' || cat.includes('gamer');
        if (sf === 'sec-estadios' || sf === 'estadios') return m.sectionId === 'sec-estadios' || cat.includes('estádios') || cat.includes('arenas');
        if (sf === 'sec-destaques-dashboard') return m.sectionId === 'sec-destaques-dashboard' || cat.includes('figure');
        if (sf === 'sec-mascotes' || sf === 'mascotes') return m.sectionId === 'sec-mascotes' || cat.includes('mascote');
        if (sf === 'sec-carros' || sf === 'carros') return m.sectionId === 'sec-carros' || m.sectionId === 'sec-veiculos' || cat.includes('carros') || cat.includes('veículos');
        if (sf === 'sec-pocket-pals' || sf === 'pocket-pals') return m.sectionId === 'sec-pocket-pals' || cat.includes('pocket') || cat.includes('articulado') || titleAndDesc.includes('articulad');
        if (sf === 'sec-pokemon' || sf === 'pokemon') return m.sectionId === 'sec-pokemon' || cat.includes('pokémon') || titleAndDesc.includes('pokemon');
        if (sf === 'sec-minifiguras' || sf === 'sec-lego') return m.sectionId === 'sec-minifiguras' || cat.includes('lego');
        if (sf === 'sec-rpg') return m.sectionId === 'sec-rpg' || cat.includes('rpg');
        if (sf === 'filmes') return titleAndDesc.includes('marvel') || titleAndDesc.includes('dc') || titleAndDesc.includes('batman') || titleAndDesc.includes('herói');
        if (sf === 'desenhos') return titleAndDesc.includes('desenho') || titleAndDesc.includes('clássico') || titleAndDesc.includes('simpsons') || titleAndDesc.includes('disney');
        if (sf === 'vip') return titleAndDesc.includes('cosplay') || titleAndDesc.includes('máscara') || m.isHot;
        if (sf === 'iluminacao') return titleAndDesc.includes('luminária') || titleAndDesc.includes('abajur') || m.sectionId === 'sec-luminarias';
        if (sf === 'monster') return m.sectionId === 'sec-monster' || titleAndDesc.includes('minecraft') || titleAndDesc.includes('monster');
        return m.sectionId === selectedSessionFilter || cat.includes(sf);
      });
    }

    if (activeCategoryFilter && !activeCategoryFilter.sectionId) {
      const terms = activeCategoryFilter.filterQuery
        .toLowerCase()
        .split(/\s+/)
        .filter(t => t.length >= 2);
      if (terms.length > 0) {
        list = list.filter(m => {
          const { full: haystack } = getSearchEntry(m);
          return terms.some(term => haystack.includes(term));
        });
      }
    }

    if (selectedPill !== 'all') {
      list = list.filter(m => {
        const { full: titleAndCat } = getSearchEntry(m);
        if (selectedPill === 'gta6') return m.sectionId === 'sec-gta6' || titleAndCat.includes('gta 6') || titleAndCat.includes('gta vi') || titleAndCat.includes('vice city');
        if (selectedPill === 'estadios') return m.sectionId === 'sec-estadios' || titleAndCat.includes('estádio') || titleAndCat.includes('arena') || titleAndCat.includes('maracanã') || titleAndCat.includes('allianz');
        if (selectedPill === 'canecas') return m.sectionId === 'sec-canecas' || m.sectionId === 'sec-canecas-gamer' || titleAndCat.includes('caneca');
        if (selectedPill === 'mascotes') return m.sectionId === 'sec-mascotes' || titleAndCat.includes('mascote');
        if (selectedPill === 'action-figures') return m.sectionId === 'sec-destaques-dashboard' || titleAndCat.includes('sonic') || titleAndCat.includes('goku') || titleAndCat.includes('mario') || titleAndCat.includes('wolverine') || titleAndCat.includes('batman') || titleAndCat.includes('sub zero') || titleAndCat.includes('spawn') || titleAndCat.includes('figure');
        if (selectedPill === 'chaveiros') return m.sectionId === 'sec-chaveiros' || titleAndCat.includes('chaveir') || titleAndCat.includes('keychain') || titleAndCat.includes('apertável');
        if (selectedPill === 'geek') return titleAndCat.includes('geek') || titleAndCat.includes('gamer') || titleAndCat.includes('playstation') || titleAndCat.includes('mario');
        if (selectedPill === 'pokemon') return m.sectionId === 'sec-pokemon' || titleAndCat.includes('pokémon') || titleAndCat.includes('pokemon') || titleAndCat.includes('pikachu') || titleAndCat.includes('charizard');
        if (selectedPill === 'articulados') return m.sectionId === 'sec-pocket-pals' || titleAndCat.includes('articulado') || titleAndCat.includes('pocket') || titleAndCat.includes('flex');
        if (selectedPill === 'carros') return m.sectionId === 'sec-carros' || m.sectionId === 'sec-veiculos' || titleAndCat.includes('carro') || titleAndCat.includes('veículo') || titleAndCat.includes('fusca') || titleAndCat.includes('mustang');
        return true;
      });
    }

    if (deferredSearchQuery.trim()) {
      const q = deferredSearchQuery.toLowerCase();
      list = list.filter(m => getSearchEntry(m).full.includes(q));
    }

    if (sortBy === 'recent') return list;

    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'margin') return (b.suggestedPrice || 0) - (a.suggestedPrice || 0);
      if (sortBy === 'printTime') return (a.printTimeHours || 0) - (b.printTimeHours || 0);
      return 0;
    });
  }, [modelsList, selectedSessionFilter, activeCategoryFilter, selectedPill, deferredSearchQuery, sortBy]);

  const favoriteModels = useMemo(() => {
    if (activeTab !== 'favorites') return [];
    return modelsList.filter(m => favoriteSet.has(m.id));
  }, [activeTab, modelsList, favoriteSet]);

  const filteredModels = activeTab === 'favorites'
    ? favoriteModels
    : activeTab === 'downloads'
    ? downloads
    : catalogFilteredModels;

  // Displayed Models for Pagination
  const displayedModels = useMemo(() => {
    return filteredModels.slice(0, visibleCount);
  }, [filteredModels, visibleCount]);

  // Reset pagination on filter changes
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedSessionFilter, activeCategoryFilter, selectedPill, deferredSearchQuery, sortBy, activeTab]);

  // Infinite Scroll Observer
  useEffect(() => {
    const cur = loadMoreRef.current;
    if (!cur) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          ensureFullCatalog();
          setVisibleCount(prev => (prev < filteredModels.length ? prev + 25 : prev));
        }
      },
      { rootMargin: '250px' }
    );
    observer.observe(cur);
    return () => observer.disconnect();
  }, [filteredModels.length, ensureFullCatalog]);

  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const handleOpenModel = useCallback((model: ModelItem) => {
    setSelectedModel(model);
    setIsDetailModalOpen(true);
  }, []);

  const handleDirectDownload = useCallback((model: ModelItem) => {
    setDownloads(prev => {
      if (prev.some(d => d.id === model.id)) return prev;
      return [model, ...prev];
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSessionFilter('all');
    setActiveCategoryFilter(null);
    setSelectedPill('all');
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white flex flex-col font-sans select-none antialiased">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#0d0f14]/95 backdrop-blur-md border-b border-[#181a24] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
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

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 pointer-events-none stroke-[2]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={ensureFullCatalog}
              onChange={(e) => {
                ensureFullCatalog();
                setSearchQuery(e.target.value);
              }}
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

        {/* Right: Notifications & Meu Perfil Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsNotificationsModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[#131620] hover:bg-[#1a1e2b] text-neutral-300 hover:text-white border border-[#222736] flex items-center justify-center transition cursor-pointer relative"
            title="Notificações"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ff5500] ring-2 ring-[#131620]" />
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#131620] hover:bg-[#1a1e2b] border border-[#222736] text-white transition cursor-pointer select-none max-w-[200px] sm:max-w-[260px]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff5500]/25 to-[#ff4400]/10 border border-[#ff5500]/40 flex items-center justify-center text-[#ff5500] shrink-0">
                <User className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white pr-1 truncate">
                {currentUser.name}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#12141a] border border-[#22252e] rounded-2xl shadow-2xl py-2 z-50 text-left">
                <div className="px-4 py-2 border-b border-[#1e2129]">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      ensureFullCatalog();
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

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex overflow-x-clip">
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              if (tab === 'favorites') ensureFullCatalog();
              setActiveTab(tab);
              if (tab === 'catalog') {
                setSelectedSessionFilter('all');
                setSelectedPill('all');
                setActiveCategoryFilter(null);
              }
            }}
            selectedCategoryFilter={selectedSessionFilter}
            onSelectCategoryFilter={(catId) => {
              if (catId !== 'all') ensureFullCatalog();
              setSelectedSessionFilter(catId);
              setSelectedPill('all');
              setActiveCategoryFilter(null);
              setActiveTab('catalog');
            }}
            favoritesCount={favorites.length}
            downloadsCount={downloads.length}
            currentUser={currentUser}
            onLogout={onLogout}
            onOpenSettings={() => setActiveTab('settings')}
            onOpenCalculator={() => setActiveTab('calculator')}
          />
        </div>

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
                  if (tab === 'favorites') ensureFullCatalog();
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                selectedCategoryFilter={selectedSessionFilter}
                onSelectCategoryFilter={(catId) => {
                  if (catId !== 'all') ensureFullCatalog();
                  setSelectedSessionFilter(catId);
                  setSelectedPill('all');
                  setActiveCategoryFilter(null);
                  setActiveTab('catalog');
                  setIsMobileSidebarOpen(false);
                }}
                favoritesCount={favorites.length}
                downloadsCount={downloads.length}
                currentUser={currentUser}
                onLogout={onLogout}
                onOpenSettings={() => {
                  setActiveTab('settings');
                  setIsMobileSidebarOpen(false);
                }}
                onOpenCalculator={() => {
                  setActiveTab('calculator');
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Viewport Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
          {/* Top Locked Promotional Banners: Vitrine 3D PRO, Aceleração de Resultados & PrintMaster 3D */}
          <section aria-label="Ferramentas Exclusivas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
            <a
              href="https://vitrine3dpro.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar Vitrine 3D PRO"
              className="block rounded-2xl sm:rounded-3xl overflow-hidden border border-[#222736] hover:border-[#ff5500]/70 bg-[#0d0f15] shadow-2xl transition-all duration-200 group cursor-pointer"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-[#0d0f15]">
                <ResilientImg
                  rawSrc="/vitrine-3d-pro-banner.webp"
                  externalFallback="https://i.imgur.com/sEYpBeF.png"
                  alt="Vitrine 3D PRO - Gerador de Anúncios com IA"
                  width={1280}
                  height={720}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.015]"
                />

                {/* Transparent Glass Padlock Overlay */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 backdrop-blur-[1px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/55 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[11px] font-bold uppercase tracking-wider shadow-lg transition-colors">
                    Vitrine 3D PRO • Clique para Acessar
                  </span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 border-t border-[#1c2130] bg-[#11141c] text-left">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Plataforma para criar títulos, descrições, imagens comerciais e anúncios para Shopee, Mercado Livre e Instagram, a partir das informações dos modelos 3D.
                </p>
              </div>
            </a>

            <a
              href="https://financeiraa.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar Dashboard Financeiro - Aceleração de Resultados"
              className="block rounded-2xl sm:rounded-3xl overflow-hidden border border-[#222736] hover:border-[#ff5500]/70 bg-[#0d0f15] shadow-2xl transition-all duration-200 group cursor-pointer"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-[#0d0f15]">
                <ResilientImg
                  rawSrc="/aceleracao-financeira-banner.webp"
                  externalFallback="https://i.imgur.com/DUHRDeh.png"
                  alt="Aceleração de Resultados - Dashboard Financeiro"
                  width={1280}
                  height={720}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.015]"
                />

                {/* Transparent Glass Padlock Overlay */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 backdrop-blur-[1px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/55 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[11px] font-bold uppercase tracking-wider shadow-lg transition-colors">
                    Aceleração de Resultados • Clique para Acessar
                  </span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 border-t border-[#1c2130] bg-[#11141c] text-left">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Tenha controle total das suas vendas, lucros e despesas em um só lugar! Conte com IA 24 horas, relatórios inteligentes e ferramentas para tomar decisões mais rápidas, evitar prejuízos e aumentar sua lucratividade.
                </p>
              </div>
            </a>

            <a
              href="https://master3d.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar PrintMaster 3D"
              className="block rounded-2xl sm:rounded-3xl overflow-hidden border border-[#222736] hover:border-[#ff5500]/70 bg-[#0d0f15] shadow-2xl transition-all duration-200 group cursor-pointer md:col-span-2 lg:col-span-1"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-[#060908]">
                <ResilientImg
                  rawSrc="/printmaster-3d-banner.webp"
                  externalFallback="https://i.imgur.com/B0Vf3LJ.png"
                  alt="PrintMaster 3D - Configurador Inteligente"
                  width={1280}
                  height={853}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.015]"
                />

                {/* Transparent Glass Padlock Overlay */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 backdrop-blur-[1px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/55 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[11px] font-bold uppercase tracking-wider shadow-lg transition-colors">
                    PrintMaster 3D • Clique para Acessar
                  </span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 border-t border-[#1c2130] bg-[#11141c] text-left">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  O <strong className="text-white font-bold">PrintMaster 3D</strong> é uma plataforma inteligente que ajuda você a configurar sua impressora 3D com mais facilidade. Consulte temperaturas, filamentos, suportes e perfis de impressão, resolva falhas e evite desperdícios para produzir peças com mais qualidade e precisão!
                </p>
              </div>
            </a>
          </section>

          {/* VIEW: CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-8">
              {/* Top Hero Banner */}
              <div className="relative rounded-3xl bg-gradient-to-r from-[#141720] via-[#12151e] to-[#181b24] border border-[#222736] p-6 sm:p-8 overflow-hidden shadow-xl">
                <div className="absolute left-1/3 -top-24 w-96 h-96 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3 max-w-2xl text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/40 text-[#ff5500] text-xs font-bold uppercase tracking-wider">
                      <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] font-black">✓</span>
                      <span>ACESSO VITALÍCIO ATIVO • {firstName.toUpperCase()}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-sans">
                      BEM-VINDO À CENTRAL 3D, <span className="text-[#ff5500]">{firstName}</span>
                    </h1>

                    <p className="text-neutral-400 text-xs sm:text-sm font-normal leading-relaxed">
                      Olá, <strong className="text-white font-semibold">{currentUser.name}</strong>! Acesse a biblioteca completa de modelos 3D selecionados e testados, organizados por categorias. Encontre seus arquivos favoritos, faça o download direto no Google Drive e descubra novas oportunidades para imprimir e faturar.
                    </p>
                  </div>

                  {/* Right Column: 3 Floating Preview Figures */}
                  <div className="shrink-0 flex items-center justify-center lg:justify-end">
                    <div className="relative w-72 sm:w-80 h-36 sm:h-40 flex items-center justify-center select-none pointer-events-none">
                      <div className="absolute left-2 w-28 h-32 rounded-2xl overflow-hidden border border-[#2a2f40] shadow-2xl -rotate-6 transform scale-95 opacity-90 bg-[#0d0f15]">
                        <ResilientImg
                          rawSrc="/front_models/thumb_front-model-sonic-vermelho-1.webp"
                          alt="Sonic Vermelho"
                          width={112}
                          height={128}
                          decoding="async"
                          fetchPriority="high"
                          className="w-full h-full object-contain p-1"
                        />
                      </div>

                      <div className="absolute z-10 w-32 h-36 rounded-2xl overflow-hidden border-2 border-[#ff5500]/60 shadow-[0_12px_32px_rgba(0,0,0,0.8)] transform scale-105 bg-[#0d0f15]">
                        <ResilientImg
                          rawSrc="/front_models/thumb_front-model-sonic-azul-2.webp"
                          alt="Sonic Azul"
                          width={128}
                          height={144}
                          decoding="async"
                          fetchPriority="high"
                          className="w-full h-full object-contain p-1"
                        />
                      </div>

                      <div className="absolute right-2 w-28 h-32 rounded-2xl overflow-hidden border border-[#2a2f40] shadow-2xl rotate-6 transform scale-95 opacity-90 bg-[#0d0f15]">
                        <ResilientImg
                          rawSrc="/front_models/thumb_front-model-sub-zero-3.webp"
                          alt="Sub Zero"
                          width={112}
                          height={128}
                          decoding="async"
                          fetchPriority="high"
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
                  {PILL_FILTERS.map((pill) => {
                    const isActive = selectedPill === pill.id && selectedSessionFilter === 'all' && !activeCategoryFilter;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => {
                          if (pill.id !== 'all') ensureFullCatalog();
                          setSelectedPill(pill.id);
                          setSelectedSessionFilter('all');
                          setActiveCategoryFilter(null);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                          isActive
                            ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-md shadow-[#ff5500]/25'
                            : 'bg-[#131620] hover:bg-[#1a1e2b] text-neutral-300 hover:text-white border-[#222736]'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      ensureFullCatalog();
                      setSortBy(e.target.value as 'recent' | 'name' | 'margin' | 'printTime');
                    }}
                    aria-label="Ordenar modelos"
                    className="bg-[#131620] border border-[#222736] focus:border-[#ff5500] text-neutral-200 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="recent">Mais Recentes</option>
                    <option value="name">Nome (A - Z)</option>
                    <option value="margin">Maior Valor Sugerido</option>
                    <option value="printTime">Menor Tempo</option>
                  </select>
                </div>
              </div>

              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
                <div className="space-y-1.5 text-left">
                  <div className="inline-block bg-[#3b170b] text-[#ff7733] border border-[#ff5500]/30 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    {searchQuery
                      ? `RESULTADOS DA BUSCA: ${searchQuery.toUpperCase()}`
                      : (selectedSessionFilter !== 'all' || activeCategoryFilter || selectedPill !== 'all')
                        ? 'COLEÇÃO FILTRADA'
                        : 'DESTAQUE PRINCIPAL'}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-6 h-6 text-[#ff5500] stroke-[2.5]" />
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                      {searchQuery
                        ? `Modelos para "${searchQuery}"`
                        : activeCategoryFilter
                        ? activeCategoryFilter.title
                        : selectedPill !== 'all'
                        ? PILL_FILTERS.find(p => p.id === selectedPill)?.label || 'Catálogo Filtrado'
                        : selectedSessionFilter === 'sec-gta6' ? 'Coleção GTA 6 & Vice City 3D'
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

                  <p className="text-neutral-400 text-xs sm:text-sm font-normal">
                    Modelos 3MF e STL em altíssima resolução fotografados na bancada de estúdio e prontos para fatiar e imprimir.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(searchQuery || selectedSessionFilter !== 'all' || activeCategoryFilter || selectedPill !== 'all') && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
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

              {(searchQuery || selectedSessionFilter !== 'all' || activeCategoryFilter || selectedPill !== 'all') && (
                <div className="flex items-center justify-between text-xs text-neutral-300 bg-[#131620] px-4 py-2.5 rounded-xl border border-[#222736]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
                    <span>Filtro ativo:</span>
                    <strong className="text-white">
                      {searchQuery
                        ? `"${searchQuery}"`
                        : activeCategoryFilter
                        ? activeCategoryFilter.title
                        : selectedPill !== 'all'
                        ? PILL_FILTERS.find(p => p.id === selectedPill)?.label
                        : selectedSessionFilter}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[#ff5500] hover:underline font-bold text-xs cursor-pointer"
                  >
                    Limpar filtro
                  </button>
                </div>
              )}

              {/* 5-COLUMN CARDS GRID */}
              {displayedModels.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-[#131620] rounded-2xl border border-[#222736] p-8">
                  <Box className="w-10 h-10 text-neutral-600 mx-auto stroke-[1.5]" />
                  <h3 className="text-base font-bold text-white">Nenhum modelo encontrado</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Tente buscar por outro termo para explorar o acervo completo.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-[#ff5500] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    Ver Todos os Modelos
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
                    {displayedModels.map((model, index) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        priority={index < 8}
                        isFavorite={favoriteSet.has(model.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDetails={handleOpenModel}
                        onDirectDownload={handleDirectDownload}
                      />
                    ))}
                  </div>

                  {visibleCount < filteredModels.length && (
                    <div ref={loadMoreRef} className="h-6 w-full pointer-events-none" />
                  )}

                  {visibleCount < filteredModels.length && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          ensureFullCatalog();
                          setVisibleCount(prev => prev + 30);
                        }}
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

          {/* VIEW: TODAS CATEGORIAS */}
          {activeTab === 'all-files' && (
            <Suspense fallback={TabLoadingFallback}>
              <CategoriesTab
                onSelectCategory={(cat: CategoryItem) => {
                  ensureFullCatalog();
                  setSelectedPill('all');
                  setSearchQuery('');
                  if (cat.sectionId) {
                    setSelectedSessionFilter(cat.sectionId);
                    setActiveCategoryFilter(null);
                  } else {
                    setSelectedSessionFilter('all');
                    setActiveCategoryFilter(cat);
                  }
                  setActiveTab('catalog');
                }}
                onOpenDrive={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
              />
            </Suspense>
          )}

          {/* VIEW: ACELERADORES DE RESULTADOS */}
          {activeTab === 'aceleradores' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#181a22] pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] text-[10px] font-black uppercase tracking-wider">
                    <Rocket className="w-3 h-3" />
                    <span>ACELERADORES DE RESULTADOS</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    Aceleradores de Resultados
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                    Materiais exclusivos para transformar seus arquivos 3D em vendas reais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs text-[#ff5500] hover:underline font-bold cursor-pointer self-start sm:self-auto"
                >
                  ← Voltar à Biblioteca
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <a
                  href="https://appdigitalhub.com.br/c/F98F7A31"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden bg-[#141720] hover:bg-[#181c27] border border-[#202534] hover:border-[#ff5500]/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-200 flex flex-col justify-between text-left cursor-pointer select-none"
                >
                  {/* Top Square Visual Preview (1:1) with Transparent Padlock Overlay */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#0d0f14]">
                    <ResilientImg
                      rawSrc="/acelerador-venda-mais-3d.webp"
                      externalFallback="https://i.imgur.com/MJYpTio.png"
                      alt="Venda Mais com Impressão 3D"
                      width={800}
                      height={800}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-[#ff5500] text-white text-xs font-black tracking-wide shadow-lg">
                      R$ 5,90
                    </div>

                    {/* Transparent Glass Padlock Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/30 backdrop-blur-[0.5px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/60 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
                        <Lock className="w-6 h-6 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors">
                        Clique para Desbloquear
                      </span>
                    </div>
                  </div>

                  {/* Card Copy & Checkout CTA */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3.5">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-white group-hover:text-[#ff5500] transition-colors leading-snug">
                        Venda Mais com Impressão 3D
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Descubra como transformar arquivos simples em produtos que realmente vendem.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1e2330] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Acesso imediato
                        </span>
                        <span className="text-base font-black text-white">
                          R$ 5,90
                        </span>
                      </div>

                      <span className="px-3.5 py-2 rounded-xl bg-[#ff5500] group-hover:bg-[#ff661a] text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-[#ff5500]/25 flex items-center gap-1.5 transition-colors">
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Desbloquear</span>
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href="https://appdigitalhub.com.br/c/0BD366A8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden bg-[#141720] hover:bg-[#181c27] border border-[#202534] hover:border-[#ff5500]/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-200 flex flex-col justify-between text-left cursor-pointer select-none"
                >
                  {/* Top Square Visual Preview (1:1) with Transparent Padlock Overlay */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#0d0f14]">
                    <ResilientImg
                      rawSrc="/acelerador-impressao-sem-erros.webp"
                      externalFallback="https://i.imgur.com/waVmrwu.png"
                      alt="Impressão 3D Sem Erros"
                      width={800}
                      height={800}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-[#ff5500] text-white text-xs font-black tracking-wide shadow-lg">
                      R$ 5,90
                    </div>

                    {/* Transparent Glass Padlock Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/30 backdrop-blur-[0.5px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/60 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
                        <Lock className="w-6 h-6 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors">
                        Clique para Desbloquear
                      </span>
                    </div>
                  </div>

                  {/* Card Copy & Checkout CTA */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3.5">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-white group-hover:text-[#ff5500] transition-colors leading-snug">
                        Impressão 3D Sem Erros - R$5,90
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Guia técnico completo para evitar erros e otimizar suas impressões.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1e2330] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Acesso imediato
                        </span>
                        <span className="text-base font-black text-white">
                          R$ 5,90
                        </span>
                      </div>

                      <span className="px-3.5 py-2 rounded-xl bg-[#ff5500] group-hover:bg-[#ff661a] text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-[#ff5500]/25 flex items-center gap-1.5 transition-colors">
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Desbloquear</span>
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href="https://appdigitalhub.com.br/c/AD5147CE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden bg-[#141720] hover:bg-[#181c27] border border-[#202534] hover:border-[#ff5500]/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-200 flex flex-col justify-between text-left cursor-pointer select-none"
                >
                  {/* Top Square Visual Preview (1:1) with Transparent Padlock Overlay */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#0d0f14]">
                    <ResilientImg
                      rawSrc="/acelerador-novos-arquivos.webp"
                      externalFallback="https://i.imgur.com/ocOmzTW.png"
                      alt="Receba Novos Arquivos Para Sempre"
                      width={800}
                      height={800}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-[#ff5500] text-white text-xs font-black tracking-wide shadow-lg">
                      R$ 6,90
                    </div>

                    {/* Transparent Glass Padlock Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/30 backdrop-blur-[0.5px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/60 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
                        <Lock className="w-6 h-6 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors">
                        Clique para Desbloquear
                      </span>
                    </div>
                  </div>

                  {/* Card Copy & Checkout CTA */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3.5">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-white group-hover:text-[#ff5500] transition-colors leading-snug">
                        Receba Novos Arquivos Para Sempre
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Sua biblioteca sempre atualizada com novos arquivos e oportunidades de venda.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1e2330] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Acesso imediato
                        </span>
                        <span className="text-base font-black text-white">
                          R$ 6,90
                        </span>
                      </div>

                      <span className="px-3.5 py-2 rounded-xl bg-[#ff5500] group-hover:bg-[#ff661a] text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-[#ff5500]/25 flex items-center gap-1.5 transition-colors">
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Desbloquear</span>
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href="https://appdigitalhub.com.br/c/9A977CCB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden bg-[#141720] hover:bg-[#181c27] border border-[#202534] hover:border-[#ff5500]/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-200 flex flex-col justify-between text-left cursor-pointer select-none"
                >
                  {/* Top Square Visual Preview (1:1) with Transparent Padlock Overlay */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#0d0f14]">
                    <ResilientImg
                      rawSrc="/acelerador-15-nichos.webp"
                      externalFallback="https://i.imgur.com/ChR5l5B.png"
                      alt="15 Nichos Mais Lucrativos - Pare de Perder Tempo"
                      width={800}
                      height={800}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-[#ff5500] text-white text-xs font-black tracking-wide shadow-lg">
                      R$ 6,90
                    </div>

                    {/* Transparent Glass Padlock Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/30 backdrop-blur-[0.5px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/60 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
                        <Lock className="w-6 h-6 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors">
                        Clique para Desbloquear
                      </span>
                    </div>
                  </div>

                  {/* Card Copy & Checkout CTA */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3.5">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-white group-hover:text-[#ff5500] transition-colors leading-snug">
                        15 Nichos Mais Lucrativos - Pare de Perder Tempo
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Evite falhas, desperdício de filamento e impressões ruins com ajustes práticos.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1e2330] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Acesso imediato
                        </span>
                        <span className="text-base font-black text-white">
                          R$ 6,90
                        </span>
                      </div>

                      <span className="px-3.5 py-2 rounded-xl bg-[#ff5500] group-hover:bg-[#ff661a] text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-[#ff5500]/25 flex items-center gap-1.5 transition-colors">
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Desbloquear</span>
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href="https://appdigitalhub.com.br/c/46C5304F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden bg-[#141720] hover:bg-[#181c27] border border-[#202534] hover:border-[#ff5500]/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-200 flex flex-col justify-between text-left cursor-pointer select-none"
                >
                  {/* Top Square Visual Preview (1:1) with Transparent Padlock Overlay */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#0d0f14]">
                    <ResilientImg
                      rawSrc="/acelerador-calculadora-precificacao.webp"
                      externalFallback="https://i.imgur.com/6MmRnCj.png"
                      alt="Calculadora - Pare de Vender Sem Lucro"
                      width={640}
                      height={640}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-[#ff5500] text-white text-xs font-black tracking-wide shadow-lg">
                      R$ 7,90
                    </div>

                    {/* Transparent Glass Padlock Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/30 backdrop-blur-[0.5px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/60 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
                        <Lock className="w-6 h-6 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors">
                        Clique para Desbloquear
                      </span>
                    </div>
                  </div>

                  {/* Card Copy & Checkout CTA */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3.5">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-white group-hover:text-[#ff5500] transition-colors leading-snug">
                        Calculadora - Pare de Vender Sem Lucro
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Descubra seu lucro real sem errar no preço e sem perder dinheiro.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1e2330] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Acesso imediato
                        </span>
                        <span className="text-base font-black text-white">
                          R$ 7,90
                        </span>
                      </div>

                      <span className="px-3.5 py-2 rounded-xl bg-[#ff5500] group-hover:bg-[#ff661a] text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-[#ff5500]/25 flex items-center gap-1.5 transition-colors">
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Desbloquear</span>
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href="https://appdigitalhub.com.br/c/A6C9B8F7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden bg-[#141720] hover:bg-[#181c27] border border-[#ff5500]/40 hover:border-[#ff5500] hover:shadow-[0_12px_32px_rgba(255,85,0,0.25)] transition-all duration-200 flex flex-col justify-between text-left cursor-pointer select-none"
                >
                  {/* Top Square Visual Preview (1:1) with Transparent Padlock Overlay */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#0d0f14]">
                    <ResilientImg
                      rawSrc="/acelerador-pacote-completo.webp"
                      externalFallback="https://i.imgur.com/ELGKt81.png"
                      alt="Leve Todos os Produtos Acima - 60% OFF"
                      width={640}
                      height={640}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Discount & Price Badge */}
                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-[#003822] text-[#00e575] border border-[#005a38] text-[10px] font-black uppercase tracking-wider shadow-lg">
                      60% OFF
                    </div>
                    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-[#ff5500] text-white text-xs font-black tracking-wide shadow-lg">
                      R$ 21,90
                    </div>

                    {/* Transparent Glass Padlock Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/30 backdrop-blur-[0.5px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/25 group-hover:border-[#ff5500]/80 group-hover:bg-black/60 group-hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
                        <Lock className="w-6 h-6 text-white/90 group-hover:text-[#ff5500] stroke-[2] transition-colors" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 group-hover:text-white group-hover:border-[#ff5500]/50 text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors">
                        Clique para Desbloquear
                      </span>
                    </div>
                  </div>

                  {/* Card Copy & Checkout CTA */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3.5">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-white group-hover:text-[#ff5500] transition-colors leading-snug">
                        Leve Todos os Produtos Acima - 60% OFF
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Tenha o pacote completo para vender mais, errar menos e lucrar antes.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1e2330] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Pacote completo
                        </span>
                        <span className="text-base font-black text-white">
                          R$ 21,90
                        </span>
                      </div>

                      <span className="px-3.5 py-2 rounded-xl bg-[#ff5500] group-hover:bg-[#ff661a] text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-[#ff5500]/25 flex items-center gap-1.5 transition-colors">
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Desbloquear</span>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* VIEW: PLANOS E BÔNUS */}
          {activeTab === 'bonus' && (
            <Suspense fallback={TabLoadingFallback}>
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

                <BonusSectionsGrid
                  onSelectSection={(catId) => {
                    ensureFullCatalog();
                    setSelectedSessionFilter(catId);
                    setActiveTab('catalog');
                  }}
                  onOpenDrive={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
                />
              </div>
            </Suspense>
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
            <Suspense fallback={TabLoadingFallback}>
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
            </Suspense>
          )}

          {/* VIEW: CALCULADORA */}
          {activeTab === 'calculator' && (
            <Suspense fallback={TabLoadingFallback}>
              <ProfitCalculator
                onSelectProduct={(title) => {
                  ensureFullCatalog();
                  setSearchQuery(title.split(' ')[0]);
                  setActiveTab('catalog');
                }}
              />
            </Suspense>
          )}

          {/* VIEW: CONFIGURAÇÕES */}
          {activeTab === 'settings' && (
            <Suspense fallback={TabLoadingFallback}>
              <SettingsTab
                favoriteCount={favorites.length}
                onClearFavorites={() => setFavorites([])}
              />
            </Suspense>
          )}
        </main>
      </div>

      {/* 3. MODAIS (Lazy-loaded on open) */}
      {isDetailModalOpen && selectedModel && (
        <Suspense fallback={null}>
          <ModelDetailModal
            model={selectedModel}
            isOpen={isDetailModalOpen}
            isFavorite={favoriteSet.has(selectedModel.id)}
            onClose={() => setIsDetailModalOpen(false)}
            onToggleFavorite={handleToggleFavorite}
            onRecordDownload={handleDirectDownload}
          />
        </Suspense>
      )}

      {isNotificationsModalOpen && (
        <Suspense fallback={null}>
          <NotificationsModal
            isOpen={isNotificationsModalOpen}
            onClose={() => setIsNotificationsModalOpen(false)}
            onOpenAccelerators={() => {
              setActiveTab('aceleradores');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Suspense>
      )}

      {/* Notificação automática ao entrar: Aceleradores de Resultados */}
      {showAcceleratorNotice && activeTab !== 'aceleradores' && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl bg-[#131620]/95 backdrop-blur-xl border border-[#ff5500]/65 shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_28px_rgba(255,85,0,0.2)] p-4 sm:p-5 text-left transition-all duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#ea580c] flex items-center justify-center text-white shadow-lg shadow-[#ff5500]/30 shrink-0">
                <Rocket className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#ff7733]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse" />
                  <span>Nova Notificação</span>
                </span>
                <h4 className="text-sm font-black text-white leading-tight">
                  Conheça os Aceleradores de Resultados
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAcceleratorNotice(false)}
              aria-label="Fechar notificação"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1e2330] transition cursor-pointer shrink-0"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <p className="mt-2.5 text-xs text-neutral-300 leading-relaxed">
            Olá, <strong className="text-white font-bold">{firstName}</strong>! Confira os guias práticos, a calculadora de lucro, os 15 nichos mais lucrativos e o pacote completo com 60% OFF para acelerar suas vendas.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('aceleradores');
                setShowAcceleratorNotice(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-[#ff5500]/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>Conhecer Agora</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => setShowAcceleratorNotice(false)}
              className="py-2.5 px-3 rounded-xl bg-[#1a1e2b] hover:bg-[#232838] border border-[#2a3042] text-neutral-300 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              Depois
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersArea;
