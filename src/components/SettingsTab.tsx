import React, { useState } from 'react';
import { User, ShieldCheck, Download, Sliders, CheckCircle2, HardDrive, Printer, Sparkles, RefreshCw, Key } from 'lucide-react';
import { VIP_DRIVE_MAIN_URL } from '../data/modelsData';

interface SettingsTabProps {
  favoriteCount: number;
  onClearFavorites: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ favoriteCount, onClearFavorites }) => {
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClear = () => {
    if (window.confirm("Deseja realmente limpar sua lista de favoritos?")) {
      onClearFavorites();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 2500);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      {/* Profile Header */}
      <section className="bg-[#13151a] border border-[#262933] p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6600] to-[#ea580c] flex items-center justify-center font-black text-white text-2xl shadow-xl shrink-0">
              C3D
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase text-white font-sans">
                  MEMBRO VIP CENTRAL <span className="text-[#ff6600]">3D</span>
                </h1>
                <span className="bg-[#ff6600]/20 text-[#ff6600] border border-[#ff6600]/40 text-[9px] font-mono font-black px-2 py-0.5 rounded">
                  ATIVO ✅
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Licença Comercial Autorizada • Acesso Vitalício Irrestrito
              </p>
            </div>
          </div>

          <a
            href={VIP_DRIVE_MAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-[#ff6600] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-black text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md shadow-[#ff6600]/30"
          >
            <HardDrive className="w-4 h-4" />
            <span>ACESSAR PASTA OFICIAL DRIVE</span>
          </a>
        </div>
      </section>

      {/* Slicer Settings Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#13151a] border border-[#262933] rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-black uppercase text-white font-mono flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#ff6600]" />
            Configurações Recomendadas de Slicer
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Parâmetros ideais testados para obter o melhor acabamento sem linha de emenda visível em estátuas e articulações.
          </p>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#181a20] border border-[#262933] flex justify-between items-center">
              <span className="text-neutral-400">Figuras Articuladas 500%:</span>
              <span className="text-[#ff6600] font-bold">0.20mm • 3 Paredes • Gyroid 15%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#181a20] border border-[#262933] flex justify-between items-center">
              <span className="text-neutral-400">Funkos e Chibis (10-12cm):</span>
              <span className="text-[#ff6600] font-bold">0.16mm • 3 Paredes • Gyroid 12%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#181a20] border border-[#262933] flex justify-between items-center">
              <span className="text-neutral-400">Suporte Recomendado:</span>
              <span className="text-[#ff6600] font-bold">Tree Slim (Árvore Estrita 25º)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#181a20] border border-[#262933] flex justify-between items-center">
              <span className="text-neutral-400">Velocidade Externa de Parede:</span>
              <span className="text-white font-bold">60 - 80 mm/s (para acabamento liso)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#13151a] border border-[#262933] rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-black uppercase text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ff6600]" />
            Termos de Uso e Licenciamento
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Informações sobre o que você pode e não pode fazer com os arquivos do acervo:
          </p>

          <div className="space-y-2 text-xs text-neutral-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ff6600] shrink-0 mt-0.5" />
              <span><strong>Permitido:</strong> Imprimir e vender peças físicas ilimitadamente em lojas, feiras e marketplaces.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ff6600] shrink-0 mt-0.5" />
              <span><strong>Permitido:</strong> Pintar, customizar e modificar a escala dos modelos conforme o seu projeto.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ff6600] shrink-0 mt-0.5" />
              <span><strong>Permitido:</strong> Utilizar as fotos de divulgação incluídas nas pastas para anunciar suas vendas.</span>
            </div>
            <div className="flex items-start gap-2 text-rose-300">
              <span className="font-bold">❌ Proibido:</span>
              <span>Revender ou redistribuir os arquivos digitais .STL ou o link de acesso ao Google Drive VIP.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage and Favorites Management */}
      <div className="bg-[#131418] border border-[#1F2127] rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-black uppercase text-white font-mono flex items-center gap-2">
          <Sliders className="w-4 h-4 text-yellow-400" />
          Gerenciamento da Conta & Dados Locais
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#1F2127]">
          <div>
            <span className="text-xs font-bold text-white block">Lista de Modelos Favoritados</span>
            <span className="text-xs text-zinc-400">Atualmente você tem {favoriteCount} modelo(s) salvos na sua biblioteca rápida.</span>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="py-2 px-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold rounded-xl transition cursor-pointer"
          >
            {clearedNotice ? "Favoritos Limpos!" : "Limpar Lista de Favoritos"}
          </button>
        </div>
      </div>
    </div>
  );
};
