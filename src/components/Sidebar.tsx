import React from 'react';
import {
  Box,
  House,
  Folder,
  SlidersVertical,
  Flame,
  Star,
  Download,
  Clock,
  TrendingUp,
  Settings,
  LogOut,
  X
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'all-files'
  | 'fichas'
  | 'hot'
  | 'favorites'
  | 'downloads'
  | 'recent'
  | 'lucrativos'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  favoritesCount: number;
  downloadsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  downloadsCount,
  isOpenMobile,
  onCloseMobile,
  onOpenProfile,
}) => {
  const handleNavClick = (tab: TabType) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const content = (
    <aside className="w-64 shrink-0 bg-[#0d0f14] border-r border-[#1a1d26] flex flex-col h-full select-none text-left">
      {/* Brand Header */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-[#181a22]">
        <div
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
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

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-[#161922] border border-[#232734] text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
            VITALÍCIO
          </div>
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 scrollbar-none font-sans">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm transition-all text-left cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#ff441f] text-white shadow-[0_8px_20px_rgba(255,68,31,0.35)] font-extrabold'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720] font-medium'
          }`}
        >
          <House className="w-4 h-4 stroke-[2.5]" />
          <span>Dashboard</span>
        </button>

        {/* Todas Categorias */}
        <button
          type="button"
          onClick={() => handleNavClick('all-files')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'all-files'
              ? 'text-white bg-[#161922] font-bold border border-[#ff5500]/30'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <Folder className="w-4 h-4 text-neutral-400 stroke-[2]" />
          <span>Todas Categorias</span>
        </button>

        {/* Fichas de Custo */}
        <button
          type="button"
          onClick={() => handleNavClick('fichas')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'fichas'
              ? 'text-white bg-[#161922] font-bold border border-[#ff5500]/30'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <SlidersVertical className="w-4 h-4 text-neutral-400 stroke-[2] shrink-0" />
            <span className="truncate">Fichas de Custo</span>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#003822] text-[#00e575] border border-[#005a38] uppercase tracking-wider shrink-0">
            ACESSO VIP
          </span>
        </button>

        {/* Mais Vendidos */}
        <button
          type="button"
          onClick={() => handleNavClick('hot')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'hot'
              ? 'text-white bg-[#161922] font-bold border border-[#ff5500]/30'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4 text-neutral-400 stroke-[2]" />
            <span>Mais Vendidos</span>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#e60026] text-white uppercase tracking-wider">
            NOVO
          </span>
        </button>

        {/* Favoritos */}
        <button
          type="button"
          onClick={() => handleNavClick('favorites')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'favorites'
              ? 'text-white bg-[#161922] font-bold border border-[#ff5500]/30'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Star
              className={`w-4 h-4 stroke-[2] ${
                activeTab === 'favorites' ? 'text-[#ff5500] fill-[#ff5500]' : 'text-neutral-400'
              }`}
            />
            <span>Favoritos</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#161922] text-neutral-400 border border-[#222736]">
            {favoritesCount}
          </span>
        </button>

        {/* Downloads */}
        <button
          type="button"
          onClick={() => handleNavClick('downloads')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'downloads'
              ? 'text-white bg-[#161922] font-bold border border-[#ff5500]/30'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-neutral-400 stroke-[2]" />
            <span>Downloads</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#161922] text-neutral-400 border border-[#222736]">
            {downloadsCount}
          </span>
        </button>

        {/* Recentes */}
        <button
          type="button"
          onClick={() => handleNavClick('recent')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#141720] transition-colors text-left cursor-pointer ${
            activeTab === 'recent' ? 'text-white bg-[#161922] font-bold border border-[#ff5500]/30' : ''
          }`}
        >
          <Clock className="w-4 h-4 text-neutral-400 stroke-[2]" />
          <span>Recentes</span>
        </button>

        {/* Produtos Lucrativos */}
        <button
          type="button"
          onClick={() => handleNavClick('lucrativos')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'lucrativos'
              ? 'text-white bg-[#161922] font-bold border border-[#ff5500]/30'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-neutral-400 stroke-[2]" />
          <span>Produtos Lucrativos</span>
        </button>

        {/* Configurações */}
        <button
          type="button"
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'settings'
              ? 'text-white bg-[#161922] font-bold border border-[#ff5500]/30'
              : 'text-neutral-300 hover:text-white hover:bg-[#141720]'
          }`}
        >
          <Settings className="w-4 h-4 text-neutral-400 stroke-[2]" />
          <span>Configurações</span>
        </button>
      </div>

      {/* User Footer */}
      <div className="p-3.5 border-t border-[#181a22] bg-[#090b0f] text-left">
        <div className="flex items-center justify-between gap-2">
          <div
            onClick={onOpenProfile}
            className="min-w-0 cursor-pointer hover:opacity-80 transition"
          >
            <span className="text-xs font-bold text-white block truncate">João Vitor</span>
            <span className="text-[10px] text-neutral-400 block truncate">
              joao.freitas.ads@gmail.com
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenProfile}
            title="Sair da conta"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">{content}</div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 h-full bg-[#0d0f14] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
