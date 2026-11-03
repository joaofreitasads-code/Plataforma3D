import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  X, 
  Bell, 
  User, 
  Check, 
  Sparkles, 
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileMenu: () => void;
  onOpenProfile: () => void;
}

export const TopHeader: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onOpenProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: 1,
      title: 'Novos modelos adicionados!',
      text: 'Shadow e Sonic Azul em 3MF prontos para o Bambu Studio.',
      time: 'Hoje'
    },
    {
      id: 2,
      title: 'Pack Looney Tunes Peaky Blinders',
      text: 'Coleção completa com 13 personagens disponíveis.',
      time: 'Ontem'
    },
    {
      id: 3,
      title: 'Calculadora de Lucro atualizada',
      text: 'Simule taxas de marketplace para Shopee e Mercado Livre.',
      time: 'Esta semana'
    }
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-8 py-3.5 bg-[#0c0e11]/95 backdrop-blur-md border-b border-[#262b33]">
      {/* Left: Hamburger Button for mobile */}
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Abrir menu lateral"
        className="md:hidden w-11 h-11 rounded-full border border-[#262b33] bg-[#15181d] flex items-center justify-center text-white flex-shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-lg relative">
        <div className="flex items-center gap-2.5 bg-[#15181d] border border-[#262b33] focus-within:border-[#ff6a1f] rounded-full px-4 h-11 transition-colors">
          <Search className="w-4 h-4 text-[#9aa1ac] flex-shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar modelos STL, 3MF, personagens..."
            className="w-full bg-transparent text-sm text-white placeholder-[#9aa1ac] outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-[#9aa1ac] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Notification Bell & Profile Button */}
      <div className="flex items-center gap-2.5">
        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
            aria-label="Notificações"
            className="w-11 h-11 rounded-full border border-[#262b33] bg-[#15181d] hover:bg-[#1b1f25] flex items-center justify-center text-white relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#ff6a1f] ring-2 ring-[#0c0e11]" />
            )}
          </button>

          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#15181d] border border-[#262b33] rounded-2xl p-4 shadow-2xl z-50 text-left animate-in fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262b33] mb-3">
                <span className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ff6a1f]" />
                  Avisos & Atualizações
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#9aa1ac] hover:text-white"
                >
                  Fechar
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#0c0e11] border border-[#262b33]/60">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-xs text-white leading-tight">{n.title}</p>
                      <span className="text-[10px] text-[#9aa1ac] ml-2 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#9aa1ac] mt-1 leading-snug">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 px-3.5 sm:px-4 h-11 rounded-xl border border-[#262b33] bg-[#15181d] hover:bg-[#1b1f25] text-white text-xs sm:text-sm font-bold transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#ff6a1f]/20 border border-[#ff6a1f]/40 flex items-center justify-center text-[#ff6a1f]">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Meu Perfil</span>
        </button>
      </div>
    </header>
  );
};
