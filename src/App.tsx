import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryChipsBar } from './components/CategoryChipsBar';
import { ModelCard } from './components/ModelCard';
import { ModelDetailModal } from './components/ModelDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { CostCalculatorView } from './components/CostCalculatorView';
import { CategoriesView } from './components/CategoriesView';
import { ProfitableProductsView } from './components/ProfitableProductsView';
import { SettingsView } from './components/SettingsView';
import { MODELS, CANECAS, searchModels } from './data/models';
import { CATEGORIES, Category } from './data/categories';
import { Model3D } from './types/model';
import { Trophy, ExternalLink, Star, Download, Flame, Clock, Layers, X, ChevronDown } from 'lucide-react';

const GOOGLE_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1kJEzOZ-fOMzN31i8GMKR-hjxgWCHib4M?usp=sharing';

export default function App() {
  // Search query initially empty so user lands directly on the 51 VIP models
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [visibleCount, setVisibleCount] = useState(40);

  // Favorites stored with initial 3 items to match sidebar count (3)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('central3d_favorites');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['sec-caneca-america-mg', 'sec-caneca-flamengo', 'sec-caneca-corinthians'];
  });

  // Downloads stored with initial 2 items to match sidebar count (2)
  const [downloads, setDownloads] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('central3d_downloads');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['sec-caneca-flamengo', 'sec-canecas-gamer-playstation'];
  });

  // Modals & Drawers
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Sync favorites & downloads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('central3d_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('central3d_downloads', JSON.stringify(downloads));
    } catch {}
  }, [downloads]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDownloadDrive = (model: Model3D) => {
    if (!downloads.includes(model.id)) {
      setDownloads((prev) => [model.id, ...prev]);
    }
    const targetUrl = model.driveUrl || model.downloadUrl || GOOGLE_DRIVE_FOLDER_URL;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenDetails = (model: Model3D) => {
    setSelectedModel(model);
    setIsDetailOpen(true);
  };

  const handleSelectCategory = (category: Category | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchQuery('');
    }
    setActiveTab('dashboard');
  };

  // Filtered models logic
  const filteredModels = useMemo(() => {
    if (activeTab === 'favorites') {
      return MODELS.filter((m) => favorites.includes(m.id));
    }
    if (activeTab === 'downloads') {
      return MODELS.filter((m) => downloads.includes(m.id));
    }
    if (activeTab === 'hot') {
      return MODELS.filter(
        (m) => m.isHot || m.badge?.includes('DESTAQUE') || m.badge?.includes('NOVO')
      ).slice(0, 50);
    }
    if (activeTab === 'recent') {
      return MODELS.slice(0, 50);
    }

    // If a category from the CategoryBar or CategoriesView is selected
    if (selectedCategory) {
      const terms = (selectedCategory.filterQuery || selectedCategory.title)
        .toLowerCase()
        .split(' ')
        .filter((w) => w.length > 2);

      const matched = MODELS.filter((m) => {
        if (selectedCategory.sectionId && m.sectionId === selectedCategory.sectionId) {
          return true;
        }
        const mText = `${m.title} ${m.category} ${m.badge || ''} ${m.description || ''}`.toLowerCase();
        return (
          terms.some((t) => mText.includes(t)) ||
          m.category.toLowerCase().includes(selectedCategory.title.toLowerCase())
        );
      });

      if (matched.length > 0) return matched;
      return MODELS.filter((m) =>
        m.category.toLowerCase().includes(selectedCategory.title.toLowerCase())
      );
    }

    // Default search
    return searchModels(searchQuery);
  }, [searchQuery, selectedCategory, activeTab, favorites, downloads]);

  // Reset pagination limit when filters change
  useEffect(() => {
    setVisibleCount(40);
  }, [searchQuery, selectedCategory, activeTab]);

  // Progressive displayed models slice
  const displayedModels = useMemo(() => {
    return filteredModels.slice(0, visibleCount);
  }, [filteredModels, visibleCount]);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white flex flex-col font-sans select-none antialiased">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setSelectedCategory(null);
          if (activeTab !== 'dashboard') {
            setActiveTab('dashboard');
          }
        }}
        onClearSearch={() => {
          setSearchQuery('');
          setSelectedCategory(null);
        }}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        hasUnreadNotifications={hasUnreadNotifications}
      />

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'all-files') {
              setSelectedCategory(null);
            }
          }}
          favoritesCount={favorites.length}
          downloadsCount={downloads.length}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
          {/* VIEW: Todas Categorias (Full 43 Categories View) */}
          {activeTab === 'all-files' && (
            <CategoriesView onSelectCategory={handleSelectCategory} />
          )}

          {/* VIEW: Fichas de Custo */}
          {activeTab === 'fichas' && (
            <CostCalculatorView models={MODELS} selectedModel={selectedModel} />
          )}

          {/* VIEW: Produtos Lucrativos */}
          {activeTab === 'lucrativos' && (
            <ProfitableProductsView
              onOpenModelDetails={handleOpenDetails}
              canecas={CANECAS}
            />
          )}

          {/* VIEW: Configurações */}
          {activeTab === 'settings' && <SettingsView />}

          {/* VIEW: Dashboard, Favoritos, Downloads, Hot, Recentes */}
          {['dashboard', 'favorites', 'downloads', 'hot', 'recent'].includes(activeTab) && (
            <div className="space-y-8">
              {/* Hero Banner only shown on Dashboard */}
              {activeTab === 'dashboard' && <HeroBanner />}

              {/* Interactive Category Chips Bar on Dashboard */}
              {activeTab === 'dashboard' && (
                <CategoryChipsBar
                  selectedCategoryId={selectedCategory ? selectedCategory.id : 'all'}
                  onSelectCategory={handleSelectCategory}
                  onOpenAllCategories={() => setActiveTab('all-files')}
                />
              )}

              {/* Header Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
                <div className="space-y-1.5 text-left">
                  {/* Badge */}
                  {selectedCategory ? (
                    <div className="inline-block bg-[#3b170b] text-[#ff7733] border border-[#ff5500]/30 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      COLEÇÃO: {selectedCategory.title}
                    </div>
                  ) : searchQuery ? (
                    <div className="inline-block bg-[#3b170b] text-[#ff7733] border border-[#ff5500]/30 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      RESULTADOS DA BUSCA: {searchQuery.toUpperCase()}
                    </div>
                  ) : activeTab === 'favorites' ? (
                    <div className="inline-block bg-[#3b170b] text-[#ff7733] border border-[#ff5500]/30 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      MEUS MODELOS SALVOS
                    </div>
                  ) : activeTab === 'downloads' ? (
                    <div className="inline-block bg-[#16271c] text-[#00e575] border border-[#00e575]/30 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      HISTÓRICO DE DOWNLOADS
                    </div>
                  ) : activeTab === 'hot' ? (
                    <div className="inline-block bg-[#3b0d13] text-[#ff4d6d] border border-[#e60026]/30 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      MODELOS MAIS PROCURADOS
                    </div>
                  ) : (
                    <div className="inline-block bg-[#3b170b] text-[#ff7733] border border-[#ff5500]/30 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      ÁREA DE MEMBROS VIP · MODELOS EXCLUSIVOS
                    </div>
                  )}

                  {/* Main Header Title */}
                  <div className="flex items-center gap-2.5">
                    {selectedCategory ? (
                      <>
                        <Layers className="w-6 h-6 text-[#ff5500] stroke-[2.5]" />
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                          {selectedCategory.title}
                        </h2>
                      </>
                    ) : searchQuery ? (
                      <>
                        <Trophy className="w-6 h-6 text-[#ff5500] stroke-[2.5]" />
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                          Modelos para "{searchQuery}"
                        </h2>
                      </>
                    ) : activeTab === 'favorites' ? (
                      <>
                        <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                          Seus Modelos Favoritos
                        </h2>
                      </>
                    ) : activeTab === 'downloads' ? (
                      <>
                        <Download className="w-6 h-6 text-[#00e575]" />
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                          Downloads Realizados
                        </h2>
                      </>
                    ) : activeTab === 'hot' ? (
                      <>
                        <Flame className="w-6 h-6 text-[#e60026]" />
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                          Mais Vendidos &amp; Destaques
                        </h2>
                      </>
                    ) : activeTab === 'recent' ? (
                      <>
                        <Clock className="w-6 h-6 text-neutral-300" />
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                          Adicionados Recentemente
                        </h2>
                      </>
                    ) : (
                      <>
                        <Trophy className="w-6 h-6 text-[#ff5500] stroke-[2.5]" />
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                          Modelos VIP &amp; Action Figures em Destaque
                        </h2>
                      </>
                    )}
                  </div>

                  <p className="text-neutral-400 text-xs sm:text-sm font-normal">
                    Modelos 3MF e STL multipartes em altíssima resolução com link direto para cada pasta no Google Drive, prontos para fatiar e imprimir.
                  </p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('all-files');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#1a1e2b] hover:bg-[#222736] text-neutral-300 text-xs font-bold transition border border-[#2a3042] cursor-pointer"
                  >
                    Ver Todas
                  </button>

                  <a
                    href={GOOGLE_DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] active:bg-[#e64400] text-white text-xs font-bold tracking-wide transition shadow-lg shadow-[#ff5500]/25 flex items-center justify-center gap-2 cursor-pointer select-none shrink-0"
                  >
                    <span>Pasta Completa no Google Drive</span>
                    <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  </a>
                </div>
              </div>

              {/* Active Filter Bar (shown if search or category is active) */}
              {(searchQuery || selectedCategory) && (
                <div className="flex items-center justify-between text-xs text-neutral-300 bg-[#131620] px-4 py-2.5 rounded-xl border border-[#222736]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
                    <span>Filtro ativo:</span>
                    <strong className="text-white">
                      {selectedCategory ? `Coleção "${selectedCategory.title}"` : `"${searchQuery}"`}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="text-[#ff5500] hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpar filtro</span>
                  </button>
                </div>
              )}

              {/* Grid of 3D Models */}
              {displayedModels.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
                    {displayedModels.map((model) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        isFavorite={favorites.includes(model.id)}
                        onToggleFavorite={toggleFavorite}
                        onOpenDetails={handleOpenDetails}
                        onDownloadDrive={handleDownloadDrive}
                      />
                    ))}
                  </div>

                  {visibleCount < filteredModels.length && (
                    <div className="pt-8 pb-4 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 40)}
                        className="px-8 py-3.5 rounded-2xl bg-[#141720] hover:bg-[#ff5500] hover:text-white text-neutral-200 border border-[#222736] hover:border-[#ff5500] font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl cursor-pointer inline-flex items-center gap-2.5 group"
                      >
                        <span>Carregar Mais Modelos</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-[#141720] border border-[#202534] space-y-3">
                  <p className="text-base font-bold text-white">Nenhum modelo encontrado</p>
                  <p className="text-xs text-neutral-400">
                    Tente buscar por outro termo ou explore as categorias temáticas.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#ff5500] text-white font-bold text-xs cursor-pointer"
                  >
                    Ver Todos os Modelos
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Model Detail Modal */}
      <ModelDetailModal
        model={selectedModel}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isFavorite={selectedModel ? favorites.includes(selectedModel.id) : false}
        onToggleFavorite={toggleFavorite}
        onDownloadDrive={handleDownloadDrive}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        favoritesCount={favorites.length}
        downloadsCount={downloads.length}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClear={() => setHasUnreadNotifications(false)}
      />
    </div>
  );
}
