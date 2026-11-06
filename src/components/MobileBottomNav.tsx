import React from 'react';
import { Home, Folder, Heart, Download, Calculator } from 'lucide-react';
import { TabKey } from './Sidebar';

interface MobileBottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  favoritesCount: number;
  downloadsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  downloadsCount
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0d0e12]/95 backdrop-blur-md border-t border-[#1e2129] flex items-center justify-around z-40 px-2">
      <button
        type="button"
        onClick={() => onSelectTab('catalog')}
        className={`flex flex-col items-center justify-center h-full w-14 transition duration-150 cursor-pointer ${
          activeTab === 'catalog'
            ? 'text-[#ff6600] font-black'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px] font-bold tracking-wide mt-1 uppercase text-center block">
          Início
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('all-files')}
        className={`flex flex-col items-center justify-center h-full w-14 transition duration-150 cursor-pointer ${
          activeTab === 'all-files'
            ? 'text-[#ff6600] font-black'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Folder className="w-5 h-5" />
        <span className="text-[9px] font-bold tracking-wide mt-1 uppercase text-center block">
          Arquivos
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('favorites')}
        className={`flex flex-col items-center justify-center h-full w-14 transition duration-150 cursor-pointer relative ${
          activeTab === 'favorites'
            ? 'text-[#ff6600] font-black'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#ff6600] text-white text-[9px] font-black flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-bold tracking-wide mt-1 uppercase text-center block">
          Favoritos
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('downloads')}
        className={`flex flex-col items-center justify-center h-full w-14 transition duration-150 cursor-pointer relative ${
          activeTab === 'downloads'
            ? 'text-[#ff6600] font-black'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <Download className="w-5 h-5" />
          {downloadsCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#ff6600] text-white text-[9px] font-black flex items-center justify-center">
              {downloadsCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-bold tracking-wide mt-1 uppercase text-center block">
          Downloads
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('calculator')}
        className={`flex flex-col items-center justify-center h-full w-14 transition duration-150 cursor-pointer ${
          activeTab === 'calculator'
            ? 'text-[#ff6600] font-black'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Calculator className="w-5 h-5" />
        <span className="text-[9px] font-bold tracking-wide mt-1 uppercase text-center block">
          Calculadora
        </span>
      </button>
    </div>
  );
};
