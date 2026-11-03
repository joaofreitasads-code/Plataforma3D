import React from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Mail, 
  Star, 
  Download, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { MODELS } from '../data/modelsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  favoritesCount: number;
  downloadsCount: number;
  recentCount: number;
  onNavigateTo: (view: 'favoritos' | 'downloads' | 'recentes') => void;
}

export const ProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  favoritesCount,
  downloadsCount,
  recentCount,
  onNavigateTo,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#15181d] border border-[#262b33] rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl text-left flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1b1f25] hover:bg-[#262b33] flex items-center justify-center text-[#9aa1ac] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Member Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6a1f] to-[#ff3d2e] p-0.5 shadow-lg shadow-[#ff6a1f]/20 flex items-center justify-center text-white text-xl font-bold font-display">
            JF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-bold text-lg text-white">João Freitas</h2>
              <CheckCircle2 className="w-4 h-4 text-[#2fbf8f]" />
            </div>
            <p className="text-xs text-[#9aa1ac] flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              joao.freitas.ads@gmail.com
            </p>
            <span className="inline-block mt-1 text-[10px] font-extrabold tracking-wider bg-[#ff6a1f]/15 text-[#ff6a1f] border border-[#ff6a1f]/30 px-2 py-0.5 rounded-md">
              ACESSO VITALÍCIO ATIVO
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateTo('favoritos');
            }}
            className="bg-[#0c0e11] border border-[#262b33] hover:border-[#ff6a1f]/50 rounded-xl p-3 text-center transition-colors group"
          >
            <Star className="w-4 h-4 mx-auto mb-1 text-[#ffc94d] group-hover:scale-110 transition-transform" />
            <div className="font-display font-bold text-lg text-white font-mono">{favoritesCount}</div>
            <span className="text-[10px] font-bold text-[#9aa1ac] uppercase">Favoritos</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateTo('downloads');
            }}
            className="bg-[#0c0e11] border border-[#262b33] hover:border-[#ff6a1f]/50 rounded-xl p-3 text-center transition-colors group"
          >
            <Download className="w-4 h-4 mx-auto mb-1 text-[#2fbf8f] group-hover:scale-110 transition-transform" />
            <div className="font-display font-bold text-lg text-white font-mono">{downloadsCount}</div>
            <span className="text-[10px] font-bold text-[#9aa1ac] uppercase">Downloads</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateTo('recentes');
            }}
            className="bg-[#0c0e11] border border-[#262b33] hover:border-[#ff6a1f]/50 rounded-xl p-3 text-center transition-colors group"
          >
            <Clock className="w-4 h-4 mx-auto mb-1 text-[#5b5cf0] group-hover:scale-110 transition-transform" />
            <div className="font-display font-bold text-lg text-white font-mono">{recentCount}</div>
            <span className="text-[10px] font-bold text-[#9aa1ac] uppercase">Recentes</span>
          </button>
        </div>

        {/* Membership Details */}
        <div className="bg-[#1b1f25] border border-[#262b33] rounded-2xl p-4 flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between items-center text-[#c9ced6]">
            <span>Status do Plano:</span>
            <span className="font-bold text-[#2fbf8f]">Vitalício &amp; Ilimitado</span>
          </div>
          <div className="flex justify-between items-center text-[#c9ced6]">
            <span>Acesso aos Arquivos:</span>
            <span className="font-bold text-white">Biblioteca Completa STL/3MF</span>
          </div>
          <div className="flex justify-between items-center text-[#c9ced6]">
            <span>Armazenamento:</span>
            <span className="font-bold text-white">Google Drive Oficial</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#262b33] hover:bg-[#323944] text-white font-bold text-xs transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
