import React, { useState } from 'react';
import { Model3D } from '../types/model';
import { CARD_BG_URL, resolveImageUrl } from '../data/models';
import {
  X,
  Star,
  ExternalLink,
  Download,
  Clock,
  Weight,
  Layers,
  Sparkles,
  CheckCircle2,
  FileBox,
  DollarSign
} from 'lucide-react';

interface ModelDetailModalProps {
  model: Model3D | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDownloadDrive: (model: Model3D) => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onDownloadDrive,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setSelectedImgIndex(0);
    setImgError(false);
  }, [model?.id]);

  const images = React.useMemo(() => {
    if (!model) return [];
    const list: string[] = [];
    if (model.imageUrl) {
      const resolved = resolveImageUrl(model.imageUrl, model);
      if (resolved && resolved !== CARD_BG_URL) list.push(resolved);
    }
    if (model.images && Array.isArray(model.images)) {
      model.images.forEach((img) => {
        const resolved = resolveImageUrl(img, model);
        if (resolved && resolved !== CARD_BG_URL && !list.includes(resolved)) {
          list.push(resolved);
        }
      });
    }
    return list;
  }, [model]);

  if (!isOpen || !model) return null;

  const hasForeground = images.length > 0 && images[selectedImgIndex] && images[selectedImgIndex] !== CARD_BG_URL && !imgError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#14161f] border border-[#262c3e] rounded-3xl shadow-2xl my-6 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#202534] bg-[#0d0f15]">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-black">
            <span className="text-[#ff5500]">CENTRAL 3D</span>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-300 truncate max-w-xs">{model.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(model.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-md shadow-[#ff5500]/30'
                  : 'bg-[#181a20] border-[#262933] text-neutral-300 hover:text-white hover:border-[#ff5500]'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-[#262933] bg-[#181a20] text-neutral-300 hover:bg-white hover:text-black transition-all cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-[#13151a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Image & Thumbnails */}
            <div className="space-y-3">
              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-[#262933] bg-[#0d0e12] flex items-center justify-center relative shadow-inner">
                <img
                  src={CARD_BG_URL}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,85,0,0.12)_0%,_transparent_75%)] pointer-events-none z-[1]" />
                
                {hasForeground ? (
                  <img
                    src={images[selectedImgIndex]}
                    alt={model.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full ${(model.category || '').toLowerCase().includes('caneca') ? 'object-contain p-4' : 'object-cover object-center'} relative z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]`}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl bg-black/60 backdrop-blur-md border border-[#ff5500]/50 flex items-center justify-center shadow-2xl">
                      <FileBox className="w-8 h-8 text-[#ff5500]" />
                    </div>
                    <span className="mt-3 text-xs font-black tracking-widest uppercase text-white bg-black/80 px-3 py-1 rounded-lg border border-white/10 shadow-md">
                      PACOTE COMPLETO 3MF &amp; STL
                    </span>
                  </div>
                )}

                {model.badge && (
                  <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-[#ff5500] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                    {model.badge}
                  </div>
                )}
              </div>

              {/* Gallery thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                        selectedImgIndex === idx
                          ? 'border-[#ff5500] scale-95 shadow-md shadow-[#ff5500]/30'
                          : 'border-[#262933] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center bg-[#0d0e12]"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Commercial License Pill */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#002b1a] border border-[#005a38] text-[#00e575] text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Uso comercial autorizado para venda das peças impressas</span>
              </div>
            </div>

            {/* Right: Technical Details & Download */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#38bdf8] px-2 py-0.5 rounded-md bg-[#0f2438] border border-[#0284c7]/30">
                  {model.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 leading-snug">
                  {model.title}
                </h2>
                {model.scale && (
                  <p className="text-xs text-neutral-400 mt-1 font-mono">{model.scale}</p>
                )}
              </div>

              {model.description && (
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#171a23] p-3.5 rounded-xl border border-[#232736]">
                  {model.description}
                </p>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {model.filamentGrams && (
                  <div className="bg-[#171a23] p-2.5 rounded-xl border border-[#232736]">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                      <Weight className="w-3.5 h-3.5 text-[#ff5500]" />
                      <span>Filamento Estimado</span>
                    </div>
                    <span className="font-bold text-white text-sm block mt-0.5">
                      ~{model.filamentGrams} g
                    </span>
                  </div>
                )}

                {model.printTimeHours && (
                  <div className="bg-[#171a23] p-2.5 rounded-xl border border-[#232736]">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#ff5500]" />
                      <span>Tempo de Impressão</span>
                    </div>
                    <span className="font-bold text-white text-sm block mt-0.5">
                      ~{model.printTimeHours} horas
                    </span>
                  </div>
                )}

                {model.suggestedPrice && (
                  <div className="bg-[#171a23] p-2.5 rounded-xl border border-[#232736]">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                      <DollarSign className="w-3.5 h-3.5 text-[#00e575]" />
                      <span>Preço Sugerido de Venda</span>
                    </div>
                    <span className="font-bold text-[#00e575] text-sm block mt-0.5">
                      R$ {model.suggestedPrice.toFixed(2)}
                    </span>
                  </div>
                )}

                {model.infill && (
                  <div className="bg-[#171a23] p-2.5 rounded-xl border border-[#232736]">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-[#ff5500]" />
                      <span>Preenchimento (Infill)</span>
                    </div>
                    <span className="font-semibold text-white block mt-0.5">{model.infill}</span>
                  </div>
                )}

                {model.walls && (
                  <div className="bg-[#171a23] p-2.5 rounded-xl border border-[#232736]">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Paredes (Walls)</span>
                    </div>
                    <span className="font-semibold text-white block mt-0.5">{model.walls} loops</span>
                  </div>
                )}

                {model.amsSupport !== undefined && (
                  <div className="bg-[#171a23] p-2.5 rounded-xl border border-[#232736]">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
                      <span>Multicolor / AMS</span>
                    </div>
                    <span className="font-semibold text-white block mt-0.5">
                      {model.amsSupport ? '✓ Otimizado Multicolor' : 'Impressão Monocolor'}
                    </span>
                  </div>
                )}
              </div>

              {model.supports && (
                <div className="text-xs bg-[#171a23] p-3 rounded-xl border border-[#232736]">
                  <span className="text-neutral-400 block text-[11px]">Suportes recomendados:</span>
                  <span className="font-medium text-white">{model.supports}</span>
                </div>
              )}

              {/* STL & 3MF Files List */}
              {model.stlFiles && model.stlFiles.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-neutral-300 block">Arquivos do Pacote:</span>
                  <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-none">
                    {model.stlFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#0e1017] border border-[#202534] text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileBox className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                          <span className="truncate text-white font-mono">{file.name}</span>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded bg-[#1e2332] hover:bg-[#ff5500] text-white text-[11px] font-bold transition shrink-0"
                        >
                          Baixar ({file.size})
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Download Button */}
              <button
                type="button"
                onClick={() => onDownloadDrive(model)}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#ff5500] hover:bg-[#ff661a] active:bg-[#e64400] text-white font-extrabold text-sm tracking-wide transition shadow-xl shadow-[#ff5500]/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>BAIXAR PASTA NO GOOGLE DRIVE</span>
                <ExternalLink className="w-4 h-4 ml-1 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
