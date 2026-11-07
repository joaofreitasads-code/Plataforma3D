import React from 'react';
import { X, User, ShieldCheck, Download, Star, Award, CheckCircle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoritesCount: number;
  downloadsCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  favoritesCount,
  downloadsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#13151c] border border-[#232838] rounded-3xl p-6 text-left shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#202534] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5500] to-[#e63300] flex items-center justify-center text-white shadow-lg shadow-[#ff5500]/30">
              <User className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">João Vitor</h3>
              <p className="text-xs text-neutral-400">joao.freitas.ads@gmail.com</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-[#262933] text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VIP Status Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1c1712] to-[#171318] border border-[#ff5500]/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff5500]" />
              <span className="text-xs font-black uppercase text-[#ff5500] tracking-wider">
                ACESSO VITALÍCIO VIP
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00e575]/20 text-[#00e575] border border-[#00e575]/30">
              ATIVO
            </span>
          </div>
          <p className="text-xs text-neutral-300">
            Você possui acesso total e ilimitado a todos os arquivos STL, 3MF multipartes, novas atualizações e fichas técnicas de impressão.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-[#0e1017] border border-[#202534]">
            <Download className="w-4 h-4 text-[#ff5500] mx-auto mb-1" />
            <span className="text-lg font-black text-white">{downloadsCount}</span>
            <span className="text-[10px] text-neutral-400 block">Downloads</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#0e1017] border border-[#202534]">
            <Star className="w-4 h-4 text-amber-400 mx-auto mb-1 fill-amber-400" />
            <span className="text-lg font-black text-white">{favoritesCount}</span>
            <span className="text-[10px] text-neutral-400 block">Favoritos</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#0e1017] border border-[#202534]">
            <Award className="w-4 h-4 text-[#00e575] mx-auto mb-1" />
            <span className="text-lg font-black text-white">42+</span>
            <span className="text-[10px] text-neutral-400 block">Coleções</span>
          </div>
        </div>

        {/* VIP Features included */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-300">Benefícios Inclusos:</span>
          <div className="space-y-1.5 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Download direto sem encurtador no Google Drive</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Arquivos 3MF pré-pintados prontos para fatiar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Novos lançamentos adicionados semanalmente</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#1e2332] hover:bg-[#282f44] text-white font-bold text-xs uppercase tracking-wider transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
