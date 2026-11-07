import React from 'react';
import { Menu, Search, X, Bell, User } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onClearSearch: () => void;
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
  onToggleNotifications: () => void;
  hasUnreadNotifications: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onToggleSidebar,
  onOpenProfile,
  onToggleNotifications,
  hasUnreadNotifications,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d0f14]/95 backdrop-blur-md border-b border-[#181a24] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#181a24] transition cursor-pointer"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Central Search Bar */}
      <div className="flex-1 max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-neutral-500 absolute left-4 pointer-events-none stroke-[2]" />
          <input
            placeholder="Pesquisar modelos STL, 3MF, personagens..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#13161f] text-neutral-200 text-xs sm:text-sm pl-11 pr-10 py-2.5 sm:py-3 rounded-2xl border border-[#202534] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 outline-none transition placeholder:text-neutral-500 font-medium shadow-inner"
            type="text"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3.5 text-neutral-400 hover:text-white cursor-pointer p-0.5"
              title="Limpar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Notifications & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleNotifications}
          className="w-10 h-10 rounded-full bg-[#131620] hover:bg-[#1a1e2b] text-neutral-300 hover:text-white border border-[#222736] flex items-center justify-center transition cursor-pointer relative"
          title="Notificações"
        >
          <Bell className="w-4 h-4 stroke-[2]" />
          {hasUnreadNotifications && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ff5500] ring-2 ring-[#131620]" />
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#131620] hover:bg-[#1a1e2b] border border-[#222736] text-white transition cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff5500]/25 to-[#ff4400]/10 border border-[#ff5500]/40 flex items-center justify-center text-[#ff5500]">
              <User className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white pr-1">Meu Perfil</span>
          </button>
        </div>
      </div>
    </header>
  );
};
