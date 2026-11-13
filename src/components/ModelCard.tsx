import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { ModelItem, VIP_DRIVE_MAIN_URL } from '../data/catalogMeta';
import { getOptimizedCardImageUrl } from '../utils/imageOptimizer';
import { ThematicSVGPreview } from './ThematicSVGPreview';

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
}) => {
  const allImages = useMemo(() => {
    const list: string[] = [];
    if (model.thumbnailUrl) list.push(model.thumbnailUrl);
    if (model.imageUrl && !list.includes(model.imageUrl)) list.push(model.imageUrl);
    if (model.images && model.images.length > 0) {
      for (let i = 0; i < model.images.length; i++) {
        const img = model.images[i];
        if (img && !list.includes(img)) list.push(img);
      }
    }
    return list;
  }, [model.thumbnailUrl, model.imageUrl, model.images]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const retryTimerRef = useRef<number | null>(null);

  const rawSrc = currentImageIndex < allImages.length
    ? allImages[currentImageIndex]
    : (model.thumbnailUrl || model.imageUrl || '');

  const currentSrc = useMemo(() => {
    return getOptimizedCardImageUrl(rawSrc, fallbackAttempt, 240);
  }, [rawSrc, fallbackAttempt]);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearRetryTimer();
  }, [clearRetryTimer]);

  useEffect(() => {
    setImageError(false);
  }, [currentSrc]);

  // Fast failure recovery: max 2 resized CDN attempts per URL before falling back cleanly to SVG preview
  const handleImageError = useCallback(() => {
    const advanceFallback = () => {
      if (fallbackAttempt < 1) {
        setFallbackAttempt(prev => prev + 1);
        return;
      }
      if (currentImageIndex < allImages.length - 1) {
        setFallbackAttempt(0);
        setCurrentImageIndex(prev => prev + 1);
        return;
      }
      setImageError(true);
    };

    if (currentSrc && !currentSrc.startsWith('/')) {
      clearRetryTimer();
      retryTimerRef.current = window.setTimeout(advanceFallback, 150);
    } else {
      advanceFallback();
    }
  }, [fallbackAttempt, currentImageIndex, allImages.length, currentSrc, clearRetryTimer]);

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    clearRetryTimer();
    setImageError(false);
    setFallbackAttempt(0);
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  }, [clearRetryTimer, allImages.length]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    clearRetryTimer();
    setImageError(false);
    setFallbackAttempt(0);
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  }, [clearRetryTimer, allImages.length]);

  const handleAccessFolder = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDirectDownload) onDirectDownload(model);
    window.open(model.driveUrl || VIP_DRIVE_MAIN_URL, '_blank', 'noopener,noreferrer');
  }, [onDirectDownload, model]);

  const isVipCheckout = model.id === 'produto-vip-vitalicio-cadeado';
  const hasPhoto = Boolean(currentSrc && !imageError);
  const badgeText = model.badge || (model.stlFiles?.some(f => f.name.endsWith('.3mf')) ? '3MF' : 'STL');

  const isCutoutOrSvg = Boolean(
    currentSrc && (
      currentSrc.endsWith('.svg') ||
      currentSrc.includes('pocket-pals') ||
      currentSrc.includes('canecas_times') ||
      currentSrc.includes('front_models') ||
      currentSrc.includes('chaveiros') ||
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
      className="group rounded-2xl overflow-hidden cursor-pointer transition-colors duration-150 flex flex-col justify-between text-left bg-[#141720] hover:bg-[#181c27] border border-[#202534] hover:border-[#ff5500]/60 hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] relative [contain:layout_style_paint] select-none"
    >
      {/* Top Image Container with CSS Studio Wooden Table Background (avoids 2x <img> DOM nodes) */}
      <div className="w-full aspect-square relative overflow-hidden bg-[#0d0f14] bg-[url('/model_card_bg.webp')] bg-cover bg-center flex items-center justify-center group/image select-none">
        {hasPhoto ? (
          <img
            src={currentSrc}
            alt={model.title}
            width={300}
            height={300}
            referrerPolicy="no-referrer"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onError={handleImageError}
            className={
              isCutoutOrSvg
                ? "w-full h-full object-contain p-2 relative z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_6px_12px_rgba(0,0,0,0.55)]"
                : "w-full h-full object-cover object-center relative z-10 transition-transform duration-300 group-hover:scale-[1.03]"
            }
          />
        ) : (
          <ThematicSVGPreview
            sectionId={model.sectionId}
            title={model.title}
            colorTheme={model.colorTheme}
            isHot={model.isHot}
          />
        )}

        {/* VIP Badge for VIP Checkout only */}
        {isVipCheckout && (
          <div className="absolute top-2.5 left-2.5 z-20 bg-[#ff5500] text-white font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md uppercase tracking-wider pointer-events-none">
            <Lock className="w-3 h-3 stroke-[2.5]" />
            <span>ACESSO VIP</span>
          </div>
        )}

        {/* Top-Left: Circular Star Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(model.id);
          }}
          className={`absolute top-2.5 left-2.5 w-7 h-7 rounded-full transition-all z-20 flex items-center justify-center ${
            isFavorite
              ? 'bg-[#ff5500] text-white shadow-md scale-105'
              : 'bg-black/65 hover:bg-black/85 text-white/90 hover:text-white border border-white/15'
          }`}
          title={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          aria-label={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
        >
          <span className="text-xs leading-none">★</span>
        </button>

        {/* Bottom-Left: Format / Badge Pill */}
        <div className="absolute bottom-2.5 left-2.5 z-20 bg-black/80 text-[#38bdf8] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#0284c7]/40 pointer-events-none shadow-sm">
          {model.badge || badgeText}
        </div>

        {/* Multi-Image Controls if available */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 opacity-0 group-hover/image:opacity-100 transition-opacity z-20 cursor-pointer"
              title="Foto anterior"
            >
              <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 opacity-0 group-hover/image:opacity-100 transition-opacity z-20 cursor-pointer"
              title="Próxima foto"
            >
              <ChevronRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5 bg-[#141720]">
        <div className="space-y-1">
          <h3
            className="text-sm font-bold text-white group-hover:text-[#ff5500] transition-colors line-clamp-2 leading-snug"
            title={model.title}
          >
            {model.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium truncate">
            <span>{model.category.replace(' 3D', '')}</span>
            <span>·</span>
            <span>{badgeText}</span>
            <span>·</span>
          </div>

          <div className="pt-0.5">
            <span className="inline-block bg-[#0f2438] text-[#38bdf8] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#0284c7]/30">
              {model.scale || model.dimensions || 'Escala 1:10'}
            </span>
          </div>
        </div>

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
