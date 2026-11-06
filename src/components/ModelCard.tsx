import React, { useState, useEffect } from 'react';
import { Heart, Box, ChevronLeft, ChevronRight, Images, Lock, Download, ArrowUpRight, Check, Link2 } from 'lucide-react';
import { ModelItem, VIP_DRIVE_MAIN_URL } from '../data/modelsData';
import { getOptimizedCardImageUrl, isImageCached, markImageCached } from '../utils/imageOptimizer';

interface ModelCardProps {
  model: ModelItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (model: ModelItem) => void;
  onDirectDownload?: (model: ModelItem) => void;
  priority?: boolean;
  orangeVariant?: boolean;
}

const ModelCardComponent: React.FC<ModelCardProps> = ({
  model,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onDirectDownload,
  priority = false,
  orangeVariant = false
}) => {
  // Deduplicate all images strictly without repetition
  const allImages = React.useMemo(() => {
    return Array.from(
      new Set(
        model.images && model.images.length > 0
          ? model.images
          : ([model.imageUrl, model.thumbnailUrl].filter(Boolean) as string[])
      )
    );
  }, [model]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const [copied, setCopied] = useState(false);

  const rawSrc = currentImageIndex === 0
    ? (model.thumbnailUrl || (allImages.length > 0 ? allImages[0] : model.imageUrl))
    : (allImages[currentImageIndex] || model.imageUrl || model.thumbnailUrl);
  
  const currentSrc = React.useMemo(() => {
    return getOptimizedCardImageUrl(rawSrc, fallbackAttempt, 240);
  }, [rawSrc, fallbackAttempt]);

  const isCached = React.useMemo(() => (currentSrc ? isImageCached(currentSrc) : false), [currentSrc]);
  const [isLoaded, setIsLoaded] = useState(() => (currentSrc ? isImageCached(currentSrc) : false));

  // Instant detection callback when browser already has image in cache
  const imgRef = React.useCallback((node: HTMLImageElement | null) => {
    if (node && (node.complete && node.naturalWidth > 0)) {
      markImageCached(currentSrc);
      setIsLoaded(true);
    }
  }, [currentSrc]);

  // Reset loaded state when src changes unless already in session cache
  useEffect(() => {
    if (currentSrc && isImageCached(currentSrc)) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
    setImageError(false);
  }, [currentSrc]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false);
    setFallbackAttempt(0);
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false);
    setFallbackAttempt(0);
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  };

  const handleAccessFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDirectDownload) onDirectDownload(model);
    window.open(model.driveUrl || VIP_DRIVE_MAIN_URL, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = model.driveUrl || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isVipCheckout = model.id === 'produto-vip-vitalicio-cadeado';
  const hasPhoto = Boolean(currentSrc && !imageError);
  const badgeText = model.badge || (model.stlFiles?.some(f => f.name.endsWith('.3mf')) ? '3MF' : 'STL');
  const sizeText = model.fileSize || 'STL';

  const isCutoutOrSvg = Boolean(
    currentSrc && (
      currentSrc.endsWith('.svg') ||
      currentSrc.includes('pocket-pals') ||
      currentSrc.toLowerCase().includes('.png') ||
      currentSrc.includes('imgur.com')
    )
  );

  return (
    <article
      onClick={() => {
        if (isVipCheckout) {
          window.open(model.driveUrl || 'https://checkout.wiven.com.br/checkout/cmupyvej300i601pll6oi9cj1?offer=BX0N8TV', '_blank', 'noopener,noreferrer');
        } else {
          onOpenDetails(model);
        }
      }}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '380px' }}
      className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between text-left bg-[#141720] hover:bg-[#181c27] border border-[#202534] hover:border-[#ff5500]/60 hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] relative will-change-transform select-none"
    >
      {/* Top Image Container matching new_ref.png with realistic wooden table studio background */}
      <div className="w-full aspect-square relative overflow-hidden bg-[#0d0f14] flex items-center justify-center group/image select-none">
        {/* Photorealistic Studio Wooden Table Background (User Template) */}
        <img
          src="/model_card_bg.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Studio wooden table background always displays cleanly underneath */}

        {hasPhoto ? (
          <img
            ref={imgRef}
            src={currentSrc}
            alt={model.title}
            referrerPolicy="no-referrer"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => {
              markImageCached(currentSrc);
              setIsLoaded(true);
            }}
            onError={() => {
              if (fallbackAttempt < 3) {
                setFallbackAttempt(prev => prev + 1);
              } else {
                setImageError(true);
              }
            }}
            className={
              isCutoutOrSvg
                ? "w-full h-full object-contain p-2 relative z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)]"
                : "w-full h-full object-cover object-center relative z-10 transition-transform duration-300 group-hover:scale-[1.03]"
            }
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 text-neutral-200 p-3 text-center max-w-[85%] bg-black/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
            <Box className="w-6 h-6 text-[#ff5500] stroke-[2]" />
            <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-200 font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
              {model.category || 'MODELO 3D'}
            </span>
          </div>
        )}

        {/* VIP Badge for VIP Checkout only */}
        {isVipCheckout && (
          <div className="absolute top-2.5 left-2.5 z-20 bg-[#ff5500] text-white font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md uppercase tracking-wider pointer-events-none">
            <Lock className="w-3 h-3 stroke-[2.5]" />
            <span>ACESSO VIP</span>
          </div>
        )}

        {/* Top-Left: Translucent Circular Star Favorite Button (Exact match new_ref.png) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(model.id);
          }}
          className={`absolute top-2.5 left-2.5 w-7 h-7 rounded-full backdrop-blur-md transition-all z-20 flex items-center justify-center ${
            isFavorite
              ? 'bg-[#ff5500] text-white shadow-md scale-105'
              : 'bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/10'
          }`}
          title={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          aria-label={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
        >
          <span className="text-xs leading-none">★</span>
        </button>

        {/* Bottom-Left: Format / Badge Pill */}
        <div className="absolute bottom-2.5 left-2.5 z-20 bg-black/75 backdrop-blur-md text-[#38bdf8] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#0284c7]/40 pointer-events-none shadow-sm">
          {model.badge || badgeText}
        </div>

        {/* Multi-Image Controls if available */}
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

      {/* Card Body - Title, Category + Format Row, Badge Pill, Actions Row (Exact match new_ref.png) */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5 bg-[#141720]">
        <div className="space-y-1">
          {/* Title: Bold white text matching new_ref.png */}
          <h3
            className="text-sm font-bold text-white group-hover:text-[#ff5500] transition-colors line-clamp-2 leading-snug"
            title={model.title}
          >
            {model.title}
          </h3>

          {/* Subtitle Row: "Categoria · 3MF / STL · " */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium truncate">
            <span>{model.category.replace(' 3D', '')}</span>
            <span>·</span>
            <span>{badgeText}</span>
            <span>·</span>
          </div>

          {/* Tag Pill: Scale / Dimensions */}
          <div className="pt-0.5">
            <span className="inline-block bg-[#0f2438] text-[#38bdf8] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#0284c7]/30">
              {model.scale || model.dimensions || 'Escala 1:10'}
            </span>
          </div>
        </div>

        {/* Bottom Actions Row: BAIXAR NO DRIVE -> on left, Ver detalhes on right */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1e2330] text-xs">
          <button
            type="button"
            onClick={handleAccessFolder}
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

export const ModelCard = React.memo(ModelCardComponent, (prev, next) => {
  return (
    prev.model.id === next.model.id &&
    prev.isFavorite === next.isFavorite &&
    prev.priority === next.priority
  );
});
