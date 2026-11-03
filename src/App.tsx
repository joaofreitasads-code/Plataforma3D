import React, { useState, useEffect, useMemo } from 'react';
import { 
  CATS, 
  MODELS, 
  Model3D, 
  Category, 
  getCategory 
} from './data/modelsData';
import { Sidebar, ViewType } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ModelCard } from './components/ModelCard';
import { CategoryCard } from './components/CategoryCard';
import { ModelModal } from './components/ModelModal';
import { ProfitCalculator } from './components/ProfitCalculator';
import { ProfileModal } from './components/ProfileModal';
import { ConfigView } from './components/ConfigView';
import { 
  Box, 
  Folder, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  Star, 
  Layers, 
  Download, 
  Clock, 
  Filter,
  CheckCircle2,
  Trophy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sliders,
  Gamepad2
} from 'lucide-react';

export default function App() {
  // Navigation & Category State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Storage State
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('c3d_favs');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const [downloads, setDownloads] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('c3d_downloads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentes, setRecentes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('c3d_recentes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modals & Panels
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState(36);
  const observerTarget = React.useRef<HTMLDivElement | null>(null);

  // Reset pagination when switching view or format
  useEffect(() => {
    setVisibleCount(36);
  }, [currentView, formatFilter, selectedCatId]);

  // Infinite scroll observer for 'todos' view
  useEffect(() => {
    if (currentView !== 'todos') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => prev + 36);
        }
      },
      { rootMargin: '350px' }
    );
    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [currentView, visibleCount]);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem('c3d_favs', JSON.stringify(Array.from(favorites)));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('c3d_downloads', JSON.stringify(downloads));
    } catch {}
  }, [downloads]);

  useEffect(() => {
    try {
      localStorage.setItem('c3d_recentes', JSON.stringify(recentes));
    } catch {}
  }, [recentes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  // Handlers
  const handleToggleFavorite = (modelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
        showToast('Removido dos favoritos');
      } else {
        next.add(modelId);
        showToast('Adicionado aos favoritos! ★');
      }
      return next;
    });
  };

  const handleRecordDownload = (modelId: string) => {
    setDownloads((prev) => [modelId, ...prev.filter((id) => id !== modelId)]);
    setRecentes((prev) => [modelId, ...prev.filter((id) => id !== modelId)].slice(0, 30));
    showToast('Download registrado nos seus arquivos');
  };

  const handleOpenModel = (model: Model3D) => {
    setSelectedModel(model);
    setRecentes((prev) => [model.id, ...prev.filter((id) => id !== model.id)].slice(0, 30));
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    setCurrentView('categoria');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'busca') {
      setSearchQuery('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('busca');
    } else if (currentView === 'busca') {
      setCurrentView('dashboard');
    }
  };

  const handleClearHistory = () => {
    setFavorites(new Set());
    setDownloads([]);
    setRecentes([]);
    try {
      localStorage.removeItem('c3d_favs');
      localStorage.removeItem('c3d_downloads');
      localStorage.removeItem('c3d_recentes');
    } catch {}
    showToast('Histórico e favoritos limpos');
  };

  // Filtered lists
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return MODELS.filter((m) => {
      const cat = getCategory(m.cat);
      return (
        m.nome.toLowerCase().includes(q) ||
        cat.nome.toLowerCase().includes(q) ||
        m.fmt.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const topModels = useMemo(() => MODELS.filter((m) => m.top), []);
  const newModels = useMemo(() => MODELS.filter((m) => m.novo), []);
  const canecasTimesModels = useMemo(
    () => MODELS.filter((m) => m.cat === 'canecas-times'),
    []
  );
  const canecasGamerModels = useMemo(
    () => MODELS.filter((m) => m.cat === 'canecas'),
    []
  );
  const favoriteModels = useMemo(
    () => MODELS.filter((m) => favorites.has(m.id)),
    [favorites]
  );
  const downloadModels = useMemo(
    () => downloads.map((id) => MODELS.find((m) => m.id === id)).filter(Boolean) as Model3D[],
    [downloads]
  );
  const recentModels = useMemo(
    () => recentes.map((id) => MODELS.find((m) => m.id === id)).filter(Boolean) as Model3D[],
    [recentes]
  );

  // Filter all models by format if in "todos" view
  const allModelsFiltered = useMemo(() => {
    if (formatFilter === 'ALL') return MODELS;
    return MODELS.filter((m) => m.fmt === formatFilter);
  }, [formatFilter]);

  // Current Category details
  const activeCategory = selectedCatId ? getCategory(selectedCatId) : null;
  const activeCategoryModels = selectedCatId
    ? MODELS.filter((m) => m.cat === selectedCatId)
    : [];

  return (
    <div className="min-h-screen bg-[#0c0e11] text-[#f2f3f5] flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1b1f25] border border-[#ff6a1f]/40 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl shadow-black/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#ff6a1f]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        isOpen={mobileMenuOpen}
        favoritesCount={favorites.size}
        downloadsCount={downloads.length}
        onNavigate={handleNavigate}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8">
          {/* VIEW: DASHBOARD */}
          {currentView === 'dashboard' && (
            <>
              {/* Hero Section */}
              <section className="relative overflow-hidden border border-[#262b33] rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#15181d] via-[#15181d] to-[#1e1714] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                {/* Radial Glow */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#ff6a1f]/15 blur-3xl pointer-events-none" />

                <div className="flex-1 text-left z-10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider text-[#ff6a1f] bg-[#ff6a1f]/15 border border-[#ff6a1f]/30 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ACESSO VITALÍCIO ATIVO
                  </span>

                  <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white mt-3.5 mb-2 leading-tight">
                    BEM-VINDO À <span className="text-[#ff6a1f]">CENTRAL 3D</span>
                  </h1>

                  <p className="text-[#c9ced6] text-sm md:text-base max-w-xl leading-relaxed">
                    Acesse a biblioteca completa de modelos 3D selecionados e testados, organizados por categorias. Encontre seus arquivos favoritos, faça o download direto no Google Drive e descubra novas oportunidades para imprimir e faturar.
                  </p>
                </div>

                {/* Visual Preview Stack featuring the flagship 500ml Canecas */}
                <div className="relative flex items-center justify-center flex-shrink-0 z-10">
                  <div className="flex -space-x-7 sm:-space-x-8 items-center">
                    <img
                      src="/img/caneca-time-flamengo.jpg"
                      alt="Caneca Flamengo 500ml"
                      loading="eager"
                      decoding="async"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-[#15181d] shadow-2xl shadow-black/80 transform -rotate-3 hover:rotate-0 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://i.imgur.com/SXVgYYU.png';
                      }}
                    />
                    <img
                      src="/img/cg-playstation.jpg"
                      alt="Caneca PlayStation 500ml"
                      loading="eager"
                      decoding="async"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-[#15181d] shadow-2xl shadow-black/80 transform -translate-y-2.5 scale-105 z-10 hover:scale-110 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://i.imgur.com/GmbWHg3.png';
                      }}
                    />
                    <img
                      src="/img/caneca-time-corinthians.jpg"
                      alt="Caneca Corinthians 500ml"
                      loading="eager"
                      decoding="async"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-[#15181d] shadow-2xl shadow-black/80 transform rotate-3 hover:rotate-0 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://i.imgur.com/DVTTgjK.png';
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* SECTION: CANECAS DE TIMES DE FUTEBOL (500ML) - BEM NA FRENTE */}
              <section className="flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#ff6a1f]/15 text-[#ff6a1f] border border-[#ff6a1f]/30">
                        DESTAQUE PRINCIPAL • 500ML
                      </span>
                    </div>
                    <h2 className="font-display font-black text-xl sm:text-2xl text-white flex items-center gap-2 mt-1">
                      <Trophy className="w-6 h-6 text-[#ff6a1f]" />
                      Canecas Térmicas de Times de Futebol (500ml)
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9aa1ac]">
                      Modelos 3MF em altíssima resolução com acabamento na mesa e base personalizada para fatiar e imprimir.
                    </p>
                  </div>
                  <a
                    href="https://drive.google.com/drive/folders/1tpBFimhoZYUsYECJTCLZBvFTgzkxzx1m?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-white bg-[#ff6a1f] hover:bg-[#e55914] px-4 py-2.5 rounded-xl shadow-lg shadow-[#ff6a1f]/20 transition-all"
                  >
                    <span>Pasta Completa no Google Drive</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {canecasTimesModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={favorites.has(model.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectModel={handleOpenModel}
                      onRecordDownload={handleRecordDownload}
                    />
                  ))}
                </div>
              </section>

              {/* Stats Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleNavigate('categorias')}
                  className="bg-[#15181d] hover:bg-[#1b1f25] border border-[#262b33] hover:border-[#5b5cf0]/60 rounded-2xl p-5 flex items-center justify-between text-left transition-all duration-150 group"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9aa1ac]">
                      Categorias Principais
                    </span>
                    <div className="font-display font-extrabold text-2xl text-white font-mono my-1">
                      {CATS.length}
                    </div>
                    <span className="text-xs font-semibold text-[#5b5cf0]">
                      Nichos para explorar ›
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5b5cf0] to-[#7c3aed] flex items-center justify-center text-white shadow-lg shadow-[#5b5cf0]/20 group-hover:scale-110 transition-transform flex-shrink-0">
                    <Folder className="w-7 h-7" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('fichas')}
                  className="bg-[#15181d] hover:bg-[#1b1f25] border border-[#262b33] hover:border-emerald-500/60 rounded-2xl p-5 flex items-center justify-between text-left transition-all duration-150 group"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Módulo Especial
                    </span>
                    <div className="font-display font-extrabold text-lg text-white my-1">
                      Fichas de Configuração
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">
                      +100 perfis prontos ›
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#059669] flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                    <Sliders className="w-7 h-7" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('lucrativos')}
                  className="bg-[#15181d] hover:bg-[#1b1f25] border border-[#262b33] hover:border-[#2fbf8f]/60 rounded-2xl p-5 flex items-center justify-between text-left transition-all duration-150 group"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9aa1ac]">
                      Recomendações de Venda
                    </span>
                    <div className="font-display font-extrabold text-lg text-white my-1">
                      Produtos Lucrativos
                    </div>
                    <span className="text-xs font-semibold text-[#2fbf8f]">
                      Calcule custo e lucro ›
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2fbf8f] to-[#10b981] flex items-center justify-center text-white shadow-lg shadow-[#2fbf8f]/20 group-hover:scale-110 transition-transform flex-shrink-0">
                    <Sparkles className="w-7 h-7" />
                  </div>
                </button>
              </section>

              {/* SECTION 4: CANECAS TÉRMICAS GAMER (500ML) */}
              <section className="flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30">
                        DESTAQUE GAMER • 500ML
                      </span>
                    </div>
                    <h2 className="font-display font-black text-xl sm:text-2xl text-white flex items-center gap-2 mt-1">
                      <Gamepad2 className="w-6 h-6 text-[#818cf8]" />
                      Canecas Térmicas Gamer (500ml)
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9aa1ac]">
                      Modelos 3MF temáticos de jogos e consoles para fatiamento multicolor e altíssima conversão.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectCategory('canecas')}
                      className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-white bg-[#6366f1] hover:bg-[#4f46e5] px-4 py-2.5 rounded-xl shadow-lg shadow-[#6366f1]/20 transition-all"
                    >
                      <span>Ver Categoria Canecas</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <a
                      href="https://drive.google.com/drive/folders/1AgAlhTUq1nxLj1ZZjSRisxgDd4a2Ue-p?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#c9ced6] hover:text-white bg-[#1b1f25] hover:bg-[#262b33] border border-[#262b33] px-3.5 py-2.5 rounded-xl transition-all"
                    >
                      <Download className="w-4 h-4 text-[#818cf8]" />
                      <span className="hidden sm:inline">Pasta Gamer</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9aa1ac]" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {canecasGamerModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={favorites.has(model.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectModel={handleOpenModel}
                      onRecordDownload={handleRecordDownload}
                    />
                  ))}
                </div>
              </section>

              {/* Section: Novidades & Colecionáveis (com Looney Tunes Peaky Blinders na frente) */}
              <section className="flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg md:text-xl text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#2fbf8f]" />
                      Novidades & Colecionáveis em Destaque
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9aa1ac]">
                      Bonecos colecionáveis e lançamentos mais procurados nos marketplaces prontos para fatiar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavigate('novidades')}
                    className="flex items-center gap-1 text-xs md:text-sm font-bold text-[#ff6a1f] hover:underline whitespace-nowrap"
                  >
                    Ver todas <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newModels.slice(0, 8).map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={favorites.has(model.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectModel={handleOpenModel}
                      onRecordDownload={handleRecordDownload}
                    />
                  ))}
                </div>
              </section>

              {/* Section: Categorias Principais */}
              <section className="flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg md:text-xl text-white flex items-center gap-2">
                      <Folder className="w-5 h-5 text-[#ff6a1f]" />
                      Categorias em Destaque
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9aa1ac]">
                      Escolha um nicho e explore todos os arquivos correspondentes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavigate('categorias')}
                    className="flex items-center gap-1 text-xs md:text-sm font-bold text-[#ff6a1f] hover:underline whitespace-nowrap"
                  >
                    Ver todas ({CATS.length}) <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {CATS.slice(0, 8).map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      onClick={handleSelectCategory}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {/* VIEW: CATEGORIA ESPECÍFICA */}
          {currentView === 'categoria' && activeCategory && (
            <div className="flex flex-col gap-6 text-left">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <button
                    type="button"
                    onClick={() => handleNavigate('categorias')}
                    className="hover:text-white"
                  >
                    Categorias
                  </button>
                  <span>›</span>
                  <span className="text-[#ff6a1f] font-bold">{activeCategory.nome}</span>
                </div>

                <div className="flex items-center justify-between">
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
                    {activeCategory.nome}
                  </h1>
                </div>
              </div>

              {activeCategoryModels.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeCategoryModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={favorites.has(model.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectModel={handleOpenModel}
                      onRecordDownload={handleRecordDownload}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl border border-dashed border-[#262b33] text-[#9aa1ac]">
                  Nenhum modelo encontrado nesta categoria.
                </div>
              )}
            </div>
          )}

          {/* VIEW: TODAS CATEGORIAS */}
          {currentView === 'categorias' && (
            <div className="flex flex-col gap-6 text-left">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <span className="text-[#ff6a1f] font-bold">Todas Categorias</span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
                  Todas as Categorias ({CATS.length})
                </h1>
                <p className="text-sm text-[#9aa1ac]">
                  Navegue pelos nichos organizados e encontre exatamente o que o seu cliente procura.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {CATS.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    onClick={handleSelectCategory}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: FICHAS DE CONFIGURAÇÃO 3D */}
          {currentView === 'fichas' && (
            <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto w-full pb-10">
              {/* Breadcrumb & Navigation */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <span className="text-emerald-400 font-bold">Módulos</span>
                  <span>›</span>
                  <span className="text-white font-bold">Fichas de Configuração 3D</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
                      <Sliders className="w-7 h-7 text-emerald-400 flex-shrink-0" />
                      <span>+100 Fichas de Configuração 3D</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1">
                      Perfis recomendados para impressão 3D perfeita sem erros, warping ou desperdício de filamento.
                    </p>
                  </div>
                  <span className="self-start sm:self-auto text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Acesso Imediato
                  </span>
                </div>
              </div>

              {/* Main Card with Image and CTA */}
              <div className="rounded-2xl overflow-hidden border border-[#262b33] bg-[#121519] shadow-2xl flex flex-col">
                <div className="p-3 sm:p-5 bg-[#0a0c0e] flex items-center justify-center">
                  <img
                    src="https://i.imgur.com/zTyyfqT.png"
                    alt="+100 Fichas de Configuração 3D para Impressão Perfeita"
                    className="w-full max-w-2xl h-auto rounded-xl object-contain shadow-2xl"
                    loading="eager"
                  />
                </div>

                {/* Call to action panel */}
                <div className="p-6 sm:p-8 bg-gradient-to-b from-[#15181d] to-[#0c0e11] border-t border-[#262b33] flex flex-col items-center text-center gap-5">
                  <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
                      <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                      Acelere seus Resultados
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Domine as configurações de todos os filamentos
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9aa1ac] mt-2">
                      Perfis prontos com temperatura de bico, mesa, retração, velocidade e ventilação para PLA, ABS, PETG, TPU Flexível, ASA e Fibra de Carbono.
                    </p>
                  </div>

                  {/* Big Green Button */}
                  <a
                    href="https://appdigitalhub.com.br/c/A786C89B"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-md py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-[#10b981] hover:from-emerald-400 hover:to-[#059669] active:from-emerald-600 active:to-[#047857] text-black font-extrabold text-base sm:text-lg tracking-wider uppercase text-center flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <span>ACESSAR AGORA</span>
                    <ExternalLink className="w-5 h-5 stroke-[2.5]" />
                  </a>

                  {/* Trust badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl pt-2 border-t border-[#262b33]/60 text-xs text-[#c9ced6]">
                    <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#15181d] border border-[#262b33]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold">100% Seguro</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#15181d] border border-[#262b33]">
                      <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold">Envio Imediato</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#15181d] border border-[#262b33]">
                      <Star className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold">Cartões & PIX</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#15181d] border border-[#262b33]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold">14 Dias Garantia</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#15181d] border border-[#262b33] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Perfis Prontos</h3>
                  <p className="text-xs text-[#9aa1ac]">
                    Copie e cole os parâmetros de fatiamento no Cura, PrusaSlicer, Bambu Studio ou OrcaSlicer sem dor de cabeça.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#15181d] border border-[#262b33] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Menos Erros & Desperdício</h3>
                  <p className="text-xs text-[#9aa1ac]">
                    Economize quilos de filamento evitando peças soltas, descolamento da mesa ou camadas frágeis.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#15181d] border border-[#262b33] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Acabamento Profissional</h3>
                  <p className="text-xs text-[#9aa1ac]">
                    Impressões limpas, sem fiapos e com encaixes perfeitos prontas para venda ou clientes exigentes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: TODOS OS MODELOS */}
          {currentView === 'todos' && (
            <div className="flex flex-col gap-6 text-left">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                    <button
                      type="button"
                      onClick={() => handleNavigate('dashboard')}
                      className="hover:text-white"
                    >
                      Início
                    </button>
                    <span>›</span>
                    <span className="text-[#ff6a1f] font-bold">Todos os Modelos</span>
                  </div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
                    Catálogo Completo
                  </h1>
                </div>

                {/* Format Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-[#9aa1ac] mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    Filtrar:
                  </span>
                  {['ALL', 'STL', '3MF', 'ZIP', 'RAR'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormatFilter(fmt)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        formatFilter === fmt
                          ? 'bg-[#ff6a1f] text-white'
                          : 'bg-[#1b1f25] text-[#9aa1ac] hover:text-white border border-[#262b33]'
                      }`}
                    >
                      {fmt === 'ALL' ? 'Todos' : fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allModelsFiltered.slice(0, visibleCount).map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isFavorite={favorites.has(model.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectModel={handleOpenModel}
                    onRecordDownload={handleRecordDownload}
                  />
                ))}
              </div>

              {/* Infinite Scroll Trigger & Load More */}
              {visibleCount < allModelsFiltered.length && (
                <div 
                  ref={observerTarget}
                  className="flex flex-col items-center justify-center gap-2 pt-6 pb-8"
                >
                  <p className="text-xs font-semibold text-[#9aa1ac]">
                    Exibindo {Math.min(visibleCount, allModelsFiltered.length)} de {allModelsFiltered.length} modelos
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 36)}
                    className="bg-[#1b1f25] hover:bg-[#ff6a1f] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl border border-[#262b33] hover:border-[#ff6a1f] shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Carregar mais modelos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW: MAIS VENDIDOS */}
          {currentView === 'vendidos' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <span className="text-[#ff6a1f] font-bold">Mais Vendidos</span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
                  Modelos Mais Vendidos nos Marketplaces
                </h1>
                <p className="text-sm text-[#9aa1ac]">
                  Esses modelos possuem a maior taxa de conversão e volume de vendas na Shopee e Mercado Livre.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {topModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isFavorite={favorites.has(model.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectModel={handleOpenModel}
                    onRecordDownload={handleRecordDownload}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: NOVIDADES */}
          {currentView === 'novidades' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <span className="text-[#ff6a1f] font-bold">Novidades</span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
                  Lançamentos Recentes ({newModels.length})
                </h1>
                <p className="text-sm text-[#9aa1ac]">
                  Arquivos adicionados recentemente à Central 3D.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isFavorite={favorites.has(model.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectModel={handleOpenModel}
                    onRecordDownload={handleRecordDownload}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: FAVORITOS */}
          {currentView === 'favoritos' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <span className="text-[#ff6a1f] font-bold">Favoritos</span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
                  Seus Modelos Favoritos ({favoriteModels.length})
                </h1>
              </div>

              {favoriteModels.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favoriteModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={true}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectModel={handleOpenModel}
                      onRecordDownload={handleRecordDownload}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center rounded-3xl border border-dashed border-[#262b33] bg-[#15181d]/50 flex flex-col items-center gap-3">
                  <Star className="w-10 h-10 text-[#9aa1ac]/50" />
                  <p className="text-base font-bold text-white">Nenhum modelo favoritado ainda</p>
                  <p className="text-xs text-[#9aa1ac] max-w-sm">
                    Clique na estrela no canto de qualquer modelo do catálogo para salvar e acessá-lo rapidamente por aqui.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavigate('todos')}
                    className="mt-2 text-xs font-bold text-white bg-[#ff6a1f] px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Explorar Modelos
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW: DOWNLOADS */}
          {currentView === 'downloads' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <span className="text-[#ff6a1f] font-bold">Downloads</span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
                  Histórico de Downloads ({downloadModels.length})
                </h1>
                <p className="text-sm text-[#9aa1ac]">
                  Arquivos acessados e baixados recentemente no Google Drive.
                </p>
              </div>

              {downloadModels.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {downloadModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={favorites.has(model.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectModel={handleOpenModel}
                      onRecordDownload={handleRecordDownload}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center rounded-3xl border border-dashed border-[#262b33] bg-[#15181d]/50 flex flex-col items-center gap-3">
                  <Download className="w-10 h-10 text-[#9aa1ac]/50" />
                  <p className="text-base font-bold text-white">Nenhum download registrado</p>
                  <p className="text-xs text-[#9aa1ac] max-w-sm">
                    Quando você clicar em "Baixar no Drive" em qualquer modelo, ele será registrado aqui para acesso imediato.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIEW: RECENTES */}
          {currentView === 'recentes' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <span className="text-[#ff6a1f] font-bold">Recentes</span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
                  Vistos Recentemente ({recentModels.length})
                </h1>
              </div>

              {recentModels.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recentModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={favorites.has(model.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectModel={handleOpenModel}
                      onRecordDownload={handleRecordDownload}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center rounded-3xl border border-dashed border-[#262b33] bg-[#15181d]/50 flex flex-col items-center gap-3">
                  <Clock className="w-10 h-10 text-[#9aa1ac]/50" />
                  <p className="text-base font-bold text-white">Nenhum modelo visto recentemente</p>
                </div>
              )}
            </div>
          )}

          {/* VIEW: BUSCA */}
          {currentView === 'busca' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9aa1ac]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                  <span>›</span>
                  <span className="text-[#ff6a1f] font-bold">Pesquisa</span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
                  Resultados para “{searchQuery}”
                </h1>
                <p className="text-sm text-[#9aa1ac]">
                  {searchResults.length} {searchResults.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isFavorite={favorites.has(model.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectModel={handleOpenModel}
                      onRecordDownload={handleRecordDownload}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center rounded-3xl border border-dashed border-[#262b33] bg-[#15181d]/50 flex flex-col items-center gap-3">
                  <Box className="w-10 h-10 text-[#9aa1ac]/50" />
                  <p className="text-base font-bold text-white">Nenhum modelo encontrado</p>
                  <p className="text-xs text-[#9aa1ac]">
                    Tente buscar por outro termo, como "Sonic", "Chaveiro", "Mortal Kombat" ou "Lego".
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIEW: PRODUTOS LUCRATIVOS (CALCULADORA) */}
          {currentView === 'lucrativos' && <ProfitCalculator />}

          {/* VIEW: CONFIGURAÇÕES */}
          {currentView === 'config' && (
            <ConfigView
              favoritesCount={favorites.size}
              downloadsCount={downloads.length}
              recentCount={recentes.length}
              onClearHistory={handleClearHistory}
            />
          )}
        </main>
      </div>

      {/* Model Modal */}
      <ModelModal
        model={selectedModel}
        isFavorite={selectedModel ? favorites.has(selectedModel.id) : false}
        onClose={() => setSelectedModel(null)}
        onToggleFavorite={handleToggleFavorite}
        onRecordDownload={handleRecordDownload}
        onSelectCategory={handleSelectCategory}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        favoritesCount={favorites.size}
        downloadsCount={downloads.length}
        recentCount={recentes.length}
        onNavigateTo={(view) => handleNavigate(view)}
      />
    </div>
  );
}
