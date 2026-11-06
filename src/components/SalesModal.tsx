import React from 'react';
import { X, Check, ShieldCheck, Zap, HardDrive, Sparkles, HelpCircle, ArrowRight, Crown, Lock } from 'lucide-react';
import { VIP_DRIVE_MAIN_URL } from '../data/modelsData';

const CHECKOUT_VIP_URL = 'https://checkout.wiven.com.br/checkout/cmupyvej300i601pll6oi9cj1?offer=BX0N8TV';
const PRODUCT_IMG_URL = '/product_checkout.webp';

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalesModal: React.FC<SalesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#12131D] border border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E2132] bg-[#161825]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-md">
              <Crown className="w-4 h-4 text-black" />
            </span>
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-cinzel">
                UNIVERSO 3D • PLANO VIP VITALÍCIO
              </h3>
              <span className="text-[10px] text-amber-400 font-mono font-bold">ACESSO COMPLETO LIBERADO</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1C1E2D] text-zinc-400 hover:text-white hover:bg-[#25283A] transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-left max-h-[80vh] overflow-y-auto">
          {/* Highlight Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-transparent border border-amber-400/30">
            <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest block">
              STATUS ATUAL DA SUA CONTA
            </span>
            <h4 className="text-xl font-black text-white uppercase mt-0.5 font-cinzel">
              MEMBRO VIP PREMIUM ATIVO ✅
            </h4>
            <p className="text-xs text-zinc-300 mt-1">
              Você possui licença vitalícia e acesso irrestrito aos arquivos STL organizados por pastas oficiais com fotos reais no Google Drive.
            </p>
          </div>

          {/* Perks list */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono font-black text-zinc-400 uppercase tracking-wider">
              TUDO QUE ESTÁ INCLUSO NO SEU ACERVO:
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "25 Funkos com Fotos Reais", desc: "Arquivos STL e fotos oficiais de cada peça pronta para catálogo." },
                { title: "19 Modelos Monster Energy", desc: "Porta-latas moletom, tampas rosqueadas, expositor e copos." },
                { title: "Lego 500% Articulados", desc: "49 mega figuras modulares para impressão em PLA comum." },
                { title: "Pokémon 3D & Charizard", desc: "Coleção de monstrinhos com alta precisão e suportes fáceis." },
                { title: "Mascotes do Futebol", desc: "Clubes nacionais com alta procura para presentes e torcedores." },
                { title: "DC, Marvel, Games & TMNT", desc: "Batman, Homem de Ferro, Demon Slayer, Fallout e Sci-Fi." },
                { title: "Licença Comercial Total", desc: "Venda peças físicas impressas sem pagar royalties." },
                { title: "Google Drive Permanente", desc: "Acesso direto à nuvem, sem links expirados ou propagandas." },
              ].map((perk, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#161825] border border-[#232638] flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-amber-400/20 text-amber-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{perk.title}</span>
                    <span className="text-[11px] text-zinc-400 leading-snug block">{perk.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Callouts */}
          <div className="pt-4 border-t border-[#1E2132] flex flex-col sm:flex-row gap-3">
            <a
              href={CHECKOUT_VIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-white hover:bg-neutral-200 text-black font-black text-xs font-mono uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Comprar Acesso VIP (Checkout)</span>
            </a>
            <a
              href={VIP_DRIVE_MAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-[#1C1E2D] hover:bg-[#25283A] text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition cursor-pointer border border-[#232638]"
            >
              <HardDrive className="w-4 h-4 stroke-[2.5]" />
              <span>Drive Raiz</span>
            </a>
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-[#141414] hover:bg-[#25283A] text-zinc-300 text-xs font-mono font-bold uppercase transition cursor-pointer border border-[#232638]"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
