import React, { useState } from 'react';
import { Model3D } from '../types/model';
import { CARD_BG_URL, resolveImageUrl } from '../data/models';
import { ChevronLeft, ChevronRight, Star, Box } from 'lucide-react';

interface ModelCardProps {
  model: Model3D;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (model: Model3D) => void;
  onDownloadDrive: (model: Model3D) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onDownloadDrive,
}) => {
  // Collect available images
  const allImages = React.useMemo(() => {
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

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgError(false);
    setActiveImgIndex(0);
  }, [model.id]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const badgeText = model.badge || (model.category ? model.category.toUpperCase() : 'VIP EXCLUSIVO');
  const specText =
    model.scale ||
    model.dimensions ||
    (model.weightGrams ? `Aprox. ${model.weightGrams}g` : 'Arquivo 3MF / STL Otimizado');

  const hasForegroundImage = allImages.length > 0 && !imgError;
  const isCaneca = (model.category || '').toLowerCase().includes('caneca') || (model.title || '').toLowerCase().includes('caneca');
  const imgFitClass = isCaneca
    ? 'w-full h-full object-contain p-2'
    : 'w-full h-full object-cover object-center';

  return (
    <article
      onClick={() => onOpenDetails(model)}
      className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between text-left bg-[#141720] hover:bg-[#181c27] border border-[#202534] hover:border-[#ff5500]/60 hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] relative will-change-transform select-none"
    >
      {/* Image container */}
      <div className="w-full aspect-square relative overflow-hidden bg-[#0d0f14] flex items-center justify-center group/image select-none">
        {/* Background texture/grid */}
        <img
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0 transition-transform duration-500 group-hover:scale-105"
          src={CARD_BG_URL}
        />

        {/* Model 3D Image */}
        {hasForegroundImage ? (
          <img
            alt={model.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className={`${imgFitClass} relative z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)]`}
            src={allImages[activeImgIndex]}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-md border border-[#ff5500]/40 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Box className="w-6 h-6 text-[#ff5500]" />
            </div>
            <span className="mt-2 text-[10px] font-black tracking-widest uppercase text-white/95 bg-black/75 px-2.5 py-0.5 rounded-md border border-white/10 shadow-sm">
              STL · 3MF VIP
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(model.id);
          }}
          className={`absolute top-2.5 left-2.5 w-7 h-7 rounded-full backdrop-blur-md transition-all z-20 flex items-center justify-center border cursor-pointer ${
            isFavorite
              ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-md shadow-[#ff5500]/40'
              : 'bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border-white/10'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Category tag badge */}
        <div className="absolute bottom-2.5 left-2.5 z-20 bg-black/75 backdrop-blur-md text-[#38bdf8] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#0284c7]/40 pointer-events-none shadow-sm">
          {badgeText}
        </div>

        {/* Carousel controls if more than 1 image */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 opacity-0 group-hover/image:opacity-100 transition-all z-20 cursor-pointer"
              title="Foto anterior"
            >
              <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 opacity-0 group-hover/image:opacity-100 transition-all z-20 cursor-pointer"
              title="Próxima foto"
            >
              <ChevronRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5 bg-[#141720]">
        <div className="space-y-1">
          <h3
            className="text-sm font-bold text-white group-hover:text-[#ff5500] transition-colors line-clamp-2 leading-snug"
            title={model.title}
          >
            {model.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium truncate">
            <span>{model.category}</span>
            <span>·</span>
            <span>{badgeText}</span>
            <span>·</span>
          </div>

          <div className="pt-0.5">
            <span className="inline-block bg-[#0f2438] text-[#38bdf8] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#0284c7]/30">
              {specText}
            </span>
          </div>
        </div>

        {/* Action footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1e2330] text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadDrive(model);
            }}
            className="text-[#ff5500] hover:text-[#ff7733] font-bold tracking-wide uppercase flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
          >
            <span>BAIXAR NO DRIVE</span>
            <span className="text-sm">→</span>
          </button>
          <span className="text-neutral-400 hover:text-neutral-200 transition-colors text-xs font-normal">
            Ver detalhes
          </span>
        </div>
      </div>
    </article>
  );
};
