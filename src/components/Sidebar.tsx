import React from 'react';
import { 
  Home, 
  Folder, 
  Flame, 
  Star, 
  Download, 
  Clock, 
  TrendingUp, 
  Settings, 
  Box, 
  X,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import { CATS } from '../data/modelsData';

export type ViewType = 
  | 'dashboard' 
  | 'categorias' 
  | 'fichas'
  | 'categoria' 
  | 'vendidos' 
  | 'novidades'
  | 'todos'
  | 'favoritos' 
  | 'downloads' 
  | 'recentes' 
  | 'lucrativos' 
  | 'config'
  | 'busca';

interface Props {
  currentView: ViewType;
  isOpen: boolean;
  favoritesCount: number;
  downloadsCount: number;
  onNavigate: (view: ViewType) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentView,
  isOpen,
  favoritesCount,
  downloadsCount,
  onNavigate,
  onClose,
}) => {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: Home },
    { 
      id: 'categorias' as ViewType, 
      label: 'Todas Categorias', 
      icon: Folder, 
      pill: CATS.length.toString() 
    },
    { 
      id: 'fichas' as ViewType, 
      label: 'Fichas de Configuração', 
      icon: Sliders, 
      pill: 'ACESSO VIP', 
      pillColor: 'emerald' 
    },
    { 
      id: 'vendidos' as ViewType, 
      label: 'Mais Vendidos', 
      icon: Flame, 
      pill: 'NOVO', 
      pillColor: 'red' 
    },
    { 
      id: 'favoritos' as ViewType, 
      label: 'Favoritos', 
      icon: Star, 
      pill: favoritesCount > 0 ? favoritesCount.toString() : undefined 
    },
    { 
      id: 'downloads' as ViewType, 
      label: 'Downloads', 
      icon: Download, 
      pill: downloadsCount > 0 ? downloadsCount.toString() : undefined 
    },
    { id: 'recentes' as ViewType, label: 'Recentes', icon: Clock },
    { id: 'lucrativos' as ViewType, label: 'Produtos Lucrativos', icon: TrendingUp },
    { id: 'config' as ViewType, label: 'Configurações', icon: Settings },
  ];

  const activeId = currentView === 'categoria' ? 'categorias' : currentView;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0c0e11] border-r border-[#262b33] flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#262b33]">
          <button 
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6a1f] to-[#ff3d2e] flex items-center justify-center shadow-lg shadow-[#ff6a1f]/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Box className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <b className="font-display font-bold text-base tracking-wider text-white">
                CENTRAL 3D
              </b>
              <span className="text-[10px] font-extrabold tracking-widest text-[#9aa1ac]">
                ÁREA DE MEMBROS
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-extrabold tracking-widest bg-[#1b1f25] border border-[#262b33] text-[#c9ced6] px-2 py-0.5 rounded-md">
              VITALÍCIO
            </span>
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1 text-[#9aa1ac] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 flex-1 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left w-full transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff6a1f] to-[#ff3d2e] text-white shadow-lg shadow-[#ff6a1f]/30 font-bold'
                    : 'text-[#c9ced6] hover:text-white hover:bg-[#15181d]'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#9aa1ac]'}`} />
                <span className="truncate">{item.label}</span>

                {item.pill && (
                  <span
                    className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-black/25 text-white'
                        : item.pillColor === 'red'
                        ? 'bg-[#e5132b] text-white font-extrabold text-[10px]'
                        : item.pillColor === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-extrabold text-[9px]'
                        : 'bg-[#1b1f25] text-[#9aa1ac] border border-[#262b33]'
                    }`}
                  >
                    {item.pill}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Status Footer */}
        <div className="p-3 border-t border-[#262b33]">
          <div className="bg-[#15181d] border border-[#262b33] rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ff6a1f]/15 border border-[#ff6a1f]/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#ff6a1f]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Acesso Vitalício</p>
              <p className="text-[11px] text-[#2fbf8f] font-medium truncate">Membro Verificado</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
