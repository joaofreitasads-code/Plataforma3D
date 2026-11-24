import React from 'react';
import { BookOpen, Download, FolderArchive, Layers, Lightbulb, Printer } from 'lucide-react';

interface StepByStepGuideTabProps {
  onBackToCatalog: () => void;
}

export const StepByStepGuideTab: React.FC<StepByStepGuideTabProps> = ({ onBackToCatalog }) => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#181a22] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] text-[10px] font-black uppercase tracking-wider">
            <BookOpen className="w-3 h-3" />
            <span>GUIA PRÁTICO</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Explicações Passo a Passo
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Aprenda de forma simples e rápida como baixar, extrair e abrir os arquivos STL no seu fatiador.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToCatalog}
          className="text-xs text-[#ff5500] hover:underline font-bold cursor-pointer self-start sm:self-auto"
        >
          ← Voltar à Biblioteca
        </button>
      </div>

      {/* Main Guide Card */}
      <section className="rounded-3xl bg-[#131620] border border-[#222736] p-5 sm:p-7 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-[#1e2330]">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff5500] to-[#e63300] flex items-center justify-center text-white shadow-lg shadow-[#ff5500]/25 shrink-0 text-xl">
            📦
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              📦 Como abrir o arquivo do STL
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Siga os 4 passos abaixo para preparar seus modelos para impressão 3D.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="space-y-4">
          {/* Passo 1 */}
          <div className="rounded-2xl bg-[#0e1017] border border-[#1e2330] p-4 sm:p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/35 flex items-center justify-center text-[#ff5500] shrink-0">
              <Download className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                1️⃣ Baixe o arquivo
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Abra o link do Drive, clique no arquivo <strong className="text-white font-semibold">.rar</strong> e depois em <strong className="text-white font-semibold">Baixar (⬇️)</strong>. Se aparecer o aviso <span className="text-neutral-200 italic">&ldquo;não foi possível verificar vírus&rdquo;</span>, clique em <strong className="text-[#ff7733] font-semibold">Baixar mesmo assim</strong>.
              </p>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="rounded-2xl bg-[#0e1017] border border-[#1e2330] p-4 sm:p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/35 flex items-center justify-center text-[#ff5500] shrink-0">
              <FolderArchive className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="space-y-3 min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                2️⃣ Instale um programa para extrair
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-start gap-2.5 bg-[#141720] border border-[#1f2433] rounded-xl px-3.5 py-2.5">
                  <span className="shrink-0">💻</span>
                  <span>
                    <strong className="text-white font-semibold">Windows:</strong> 7-Zip (grátis) ou WinRAR
                  </span>
                </li>
                <li className="flex items-start gap-2.5 bg-[#141720] border border-[#1f2433] rounded-xl px-3.5 py-2.5">
                  <span className="shrink-0">🍎</span>
                  <span>
                    <strong className="text-white font-semibold">Mac:</strong> The Unarchiver (grátis na App Store)
                  </span>
                </li>
                <li className="flex items-start gap-2.5 bg-[#141720] border border-[#1f2433] rounded-xl px-3.5 py-2.5">
                  <span className="shrink-0">📱</span>
                  <span>
                    <strong className="text-white font-semibold">Celular:</strong> ZArchiver (Android) ou o app Arquivos (iPhone)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="rounded-2xl bg-[#0e1017] border border-[#1e2330] p-4 sm:p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/35 flex items-center justify-center text-[#ff5500] shrink-0">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                3️⃣ Extraia
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Clique com o botão direito no arquivo → <strong className="text-white font-semibold">Extrair aqui</strong>. Vai aparecer uma pasta com os arquivos <strong className="text-white font-semibold">.stl</strong> dentro.
              </p>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="rounded-2xl bg-[#0e1017] border border-[#1e2330] p-4 sm:p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/35 flex items-center justify-center text-[#ff5500] shrink-0">
              <Printer className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                4️⃣ Abra no fatiador
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Arraste os <strong className="text-white font-semibold">.stl</strong> para o seu programa de impressão (<strong className="text-white font-semibold">Bambu Studio</strong>, <strong className="text-white font-semibold">Orca Slicer</strong>, <strong className="text-white font-semibold">Cura</strong> ou <strong className="text-white font-semibold">PrusaSlicer</strong>), fatie e mande imprimir! 🖨️
              </p>
            </div>
          </div>
        </div>

        {/* Highlighted Tip Box */}
        <div className="rounded-2xl bg-gradient-to-r from-[#ff5500]/15 via-[#ff5500]/10 to-amber-500/10 border border-[#ff5500]/35 p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#ff5500]/20 border border-[#ff5500]/40 flex items-center justify-center text-[#ff7733] shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 stroke-[2.5]" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-100 leading-relaxed">
            <strong className="text-[#ff8844] font-extrabold">💡 Dica:</strong> se vierem várias peças (cabeça, corpo, base), imprima separado e cole depois. Fica melhor acabado.
          </p>
        </div>
      </section>
    </div>
  );
};

export default StepByStepGuideTab;
