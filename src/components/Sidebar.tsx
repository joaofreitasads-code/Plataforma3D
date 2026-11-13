import React from 'react';
import { 
  Home, Folder, Sliders, Flame, Star, Download, Clock, TrendingUp, Settings, Box
} from 'lucide-react';
import { MemberUser } from '../types/auth';

export type TabKey = 'catalog' | 'all-files' | 'favorites' | 'downloads' | 'calculator' | 'video-aula' | 'bonus' | 'recentes' | 'settings';

interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  selectedCategoryFilter: string;
  onSelectCategoryFilter: (catId: string) => void;
  favoritesCount: number;
  downloadsCount: number;
  currentUser?: MemberUser | null;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  onOpenCalculator?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  favoritesCount,
  downloadsCount,
  currentUser,
  onLogout,
  onOpenSettings,
  onOpenCalculator
}) => {
  return (
    <aside className="w-64 shrink-0 bg-[#0d0f14] border-r border-[#1a1d26] flex flex-col h-full select-none text-left">
      {/* Top Header Logo Area (Exact match new_ref.png) */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-[#181a22]">
        <div 
          onClick={() => {
            onSelectTab('catalog');
            onSelectCategoryFilter('all');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Orange Vibrant App Icon (3D Cube) */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff5500] via-[#ff4400] to-[#e63300] flex items-center justify-center text-white shadow-lg shadow-[#ff4400]/30 transition-transform group-hover:scale-105">
            <Box className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-base font-black tracking-wider text-white font-sans uppercase">
              CENTRAL
            </span>
            <span className="text-base font-black tracking-wider text-white font-sans uppercase -mt-0.5">
              3D
            </span>
            <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase mt-0.5">
              ÁREA DE MEMBROS
            </span>
          </div>
        </div>

        {/* VITALÍCIO Badge Pill */}
        <div className="px-2.5 py-1 rounded-lg bg-[#161922] border border-[#232734] text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
          VITALÍCIO
        </div>
      </div>

      {/* Navigation Links (Exact match new_ref.png) */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 scrollbar-none font-sans">
        {/* 1. Dashboard (Active button with orange background and glow) */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('catalog');
            onSelectCategoryFilter('all');
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer ${
            activeTab === 'catalog' && selectedCategoryFilter === 'all'
              ? 'bg-[#ff441f] text-white shadow-[0_8px_20px_rgba(255,68,31,0.35)] font-extrabold'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <Home className="w-4 h-4 stroke-[2.5]" />
          <span>Dashboard</span>
        </button>

        {/* 2. Todas Categorias (with '46' badge) */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('all-files');
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'all-files'
              ? 'text-white bg-[#161922] font-bold'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Folder className="w-4 h-4 text-neutral-400 stroke-[2]" />
            <span>Todas Categorias</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#161922] text-neutral-400 border border-[#222736]">
            42
          </span>
        </button>

        {/* 3. Fichas de Co... (with 'ACESSO VIP' green badge) */}
        <button
          type="button"
          onClick={() => {
            window.open('https://checkout.wiven.com.br/checkout/cmupyvej300i601pll6oi9cj1?offer=BX0N8TV', '_blank', 'noopener,noreferrer');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#141720] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Sliders className="w-4 h-4 text-neutral-400 stroke-[2] shrink-0" />
            <span className="truncate">Fichas de Co...</span>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#003822] text-[#00e575] border border-[#005a38] uppercase tracking-wider shrink-0">
            ACESSO VIP
          </span>
        </button>

        {/* 4. Mais Vendidos (with 'NOVO' red badge) */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('catalog');
            onSelectCategoryFilter('all');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#141720] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4 text-neutral-400 stroke-[2]" />
            <span>Mais Vendidos</span>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#e60026] text-white uppercase tracking-wider">
            NOVO
          </span>
        </button>

        {/* 5. Favoritos (with star icon) */}
        <button
          type="button"
          onClick={() => onSelectTab('favorites')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'favorites'
              ? 'text-white bg-[#161922] font-bold'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Star className={`w-4 h-4 ${activeTab === 'favorites' ? 'text-[#ff5500] fill-current' : 'text-neutral-400 stroke-[2]'}`} />
            <span>Favoritos</span>
          </div>
          {favoritesCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#161922] text-neutral-400 border border-[#222736]">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* 6. Downloads */}
        <button
          type="button"
          onClick={() => onSelectTab('downloads')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'downloads'
              ? 'text-white bg-[#161922] font-bold'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-neutral-400 stroke-[2]" />
            <span>Downloads</span>
          </div>
          {downloadsCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#161922] text-neutral-400 border border-[#222736]">
              {downloadsCount}
            </span>
          )}
        </button>

        {/* 7. Recentes */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('catalog');
            onSelectCategoryFilter('all');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#141720] transition-colors text-left cursor-pointer"
        >
          <Clock className="w-4 h-4 text-neutral-400 stroke-[2]" />
          <span>Recentes</span>
        </button>

        {/* 8. Produtos Lucrativos */}
        <button
          type="button"
          onClick={() => {
            if (onOpenCalculator) onOpenCalculator();
            else onSelectTab('calculator');
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'calculator'
              ? 'text-white bg-[#161922] font-bold'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-neutral-400 stroke-[2]" />
          <span>Produtos Lucrativos</span>
        </button>

        {/* 9. Configurações */}
        <button
          type="button"
          onClick={() => {
            if (onOpenSettings) onOpenSettings();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#141720] transition-colors text-left cursor-pointer"
        >
          <Settings className="w-4 h-4 text-neutral-400 stroke-[2]" />
          <span>Configurações</span>
        </button>
      </div>

      {/* Footer Info if user is logged */}
      {currentUser && (
        <div className="p-3.5 border-t border-[#181a22] bg-[#090b0f] text-left">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-neutral-400 block truncate">
                {currentUser.email}
              </span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Sair da conta"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

