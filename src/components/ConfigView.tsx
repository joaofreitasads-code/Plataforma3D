import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  Check, 
  HardDrive, 
  Layers, 
  Printer, 
  ExternalLink, 
  Info,
  ShieldCheck
} from 'lucide-react';

interface Props {
  favoritesCount: number;
  downloadsCount: number;
  recentCount: number;
  onClearHistory: () => void;
}

export const ConfigView: React.FC<Props> = ({
  favoritesCount,
  downloadsCount,
  recentCount,
  onClearHistory,
}) => {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    if (window.confirm('Deseja realmente limpar seus favoritos, histórico de downloads e recentes deste navegador?')) {
      onClearHistory();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff6a1f] mb-1">
          <Settings className="w-4 h-4" />
          Painel de Preferências
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
          Configurações da Conta
        </h1>
        <p className="text-sm text-[#9aa1ac] mt-1">
          Gerencie os dados salvos localmente no seu dispositivo e consulte orientações para suas impressões 3D.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Storage Management */}
        <div className="bg-[#15181d] border border-[#262b33] rounded-2xl p-6 flex flex-col justify-between gap-5">
          <div>
            <h2 className="font-display font-bold text-base text-white mb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#ff6a1f]" />
              Dados Armazenados no Navegador
            </h2>
            <p className="text-xs text-[#9aa1ac] leading-relaxed mb-4">
              Seus favoritos, downloads realizados e modelos recentes ficam guardados localmente no navegador deste dispositivo para acesso rápido.
            </p>

            <div className="bg-[#0c0e11] border border-[#262b33] rounded-xl p-3.5 flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-[#c9ced6]">
                <span>Favoritos salvos:</span>
                <b className="font-mono text-white">{favoritesCount}</b>
              </div>
              <div className="flex justify-between text-[#c9ced6]">
                <span>Downloads registrados:</span>
                <b className="font-mono text-white">{downloadsCount}</b>
              </div>
              <div className="flex justify-between text-[#c9ced6]">
                <span>Modelos recentes:</span>
                <b className="font-mono text-white">{recentCount}</b>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#1b1f25] hover:bg-[#222730] text-[#e5132b] hover:text-white border border-[#e5132b]/40 hover:border-[#e5132b] transition-colors"
          >
            {cleared ? (
              <>
                <Check className="w-4 h-4 text-[#2fbf8f]" />
                <span className="text-[#2fbf8f]">Dados limpos com sucesso!</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Limpar favoritos, downloads e recentes</span>
              </>
            )}
          </button>
        </div>

        {/* 3D Slicing Reference */}
        <div className="bg-[#15181d] border border-[#262b33] rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#ff6a1f]" />
            Dicas Recomendadas de Fatiamento
          </h2>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="bg-[#0c0e11] border border-[#262b33] rounded-xl p-3">
              <span className="font-bold text-[#ff6a1f] block mb-0.5">Bonecos e Colecionáveis (Alta Definição)</span>
              <p className="text-[#9aa1ac] leading-relaxed">
                Altura de camada: 0.12mm a 0.16mm · Preenchimento: 10% Gyroid · Paredes: 3 perímetros · Suportes: Árvore (Tree Supports).
              </p>
            </div>

            <div className="bg-[#0c0e11] border border-[#262b33] rounded-xl p-3">
              <span className="font-bold text-[#ff6a1f] block mb-0.5">Chaveiros e Utilitários Rápidos</span>
              <p className="text-[#9aa1ac] leading-relaxed">
                Altura de camada: 0.20mm · Preenchimento: 15% Grid · Paredes: 2 a 3 · Sem suporte na maioria dos designs planos.
              </p>
            </div>

            <div className="bg-[#0c0e11] border border-[#262b33] rounded-xl p-3">
              <span className="font-bold text-[#ff6a1f] block mb-0.5">Arquivos 3MF (Bambu Studio / Orca)</span>
              <p className="text-[#9aa1ac] leading-relaxed">
                Para modelos em .3MF, basta arrastar o arquivo diretamente para o Bambu Studio ou OrcaSlicer para carregar as placas já configuradas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Useful tools links */}
      <div className="bg-[#15181d] border border-[#262b33] rounded-2xl p-6 flex flex-col gap-3">
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
          Softwares Recomendados para Impressão 3D
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://bambulab.com/en/download/studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-[#0c0e11] border border-[#262b33] hover:border-[#ff6a1f]/60 text-xs font-semibold text-[#c9ced6] hover:text-white transition-colors"
          >
            <span>Bambu Studio</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ff6a1f]" />
          </a>
          <a
            href="https://github.com/SoftFever/OrcaSlicer/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-[#0c0e11] border border-[#262b33] hover:border-[#ff6a1f]/60 text-xs font-semibold text-[#c9ced6] hover:text-white transition-colors"
          >
            <span>OrcaSlicer</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ff6a1f]" />
          </a>
          <a
            href="https://www.7-zip.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-[#0c0e11] border border-[#262b33] hover:border-[#ff6a1f]/60 text-xs font-semibold text-[#c9ced6] hover:text-white transition-colors"
          >
            <span>7-Zip / WinRAR</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ff6a1f]" />
          </a>
        </div>
      </div>
    </div>
  );
};
