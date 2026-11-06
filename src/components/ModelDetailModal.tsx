import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Download, Heart, Check, Copy, Box, ChevronLeft, ChevronRight, Images, Lock } from 'lucide-react';
import { ModelItem, VIP_DRIVE_MAIN_URL } from '../data/modelsData';
import { getOptimizedModalImageUrl, getOptimizedCardImageUrl, isImageCached, markImageCached } from '../utils/imageOptimizer';

interface ModelDetailModalProps {
  model: ModelItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onRecordDownload?: (model: ModelItem) => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onRecordDownload
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const [isMainLoaded, setIsMainLoaded] = useState(false);

  // Strictly deduplicate all images for this model without repetition
  const allImages = React.useMemo(() => {
    if (!model) return [];
    const set = new Set<string>();
    if (model.images && model.images.length > 0) {
      model.images.forEach(img => set.add(img));
    }
    if (model.imageUrl) set.add(model.imageUrl);
    if (model.thumbnailUrl) set.add(model.thumbnailUrl);
    return Array.from(set);
  }, [model]);

  useEffect(() => {
    setImageError(false);
    setFallbackAttempt(0);
    setSelectedImageIndex(0);
    setIsMainLoaded(false);
  }, [model]);

  if (!isOpen || !model) return null;

  const isVipCheckout = model.id === 'produto-vip-vitalicio-cadeado';
  const rawSrc = allImages.length > 0 ? allImages[selectedImageIndex] : (model.imageUrl || model.thumbnailUrl);

  const getImageSource = () => {
    return getOptimizedModalImageUrl(rawSrc, fallbackAttempt);
  };

  const currentSrc = getImageSource();
  const hasPhoto = Boolean(currentSrc && !imageError);

  const handlePrevImage = () => {
    setImageError(false);
    setFallbackAttempt(0);
    setSelectedImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = () => {
    setImageError(false);
    setFallbackAttempt(0);
    setSelectedImageIndex(prev => (prev + 1) % allImages.length);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(model.driveUrl || VIP_DRIVE_MAIN_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDrive = () => {
    if (onRecordDownload) onRecordDownload(model);
    window.open(model.driveUrl || VIP_DRIVE_MAIN_URL, '_blank', 'noopener,noreferrer');
  };

  const handleDirectDownload = () => {
    if (onRecordDownload) onRecordDownload(model);
    if (model.downloadUrl) {
      window.open(model.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(model.driveUrl || VIP_DRIVE_MAIN_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#141414] border border-[#333333] rounded-2xl shadow-2xl my-8 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Central 3D Style - Black & Orange) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#262933] bg-[#0d0e12]">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-black">
            <span className="text-[#ff6600]">CENTRAL 3D</span>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-300">{model.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(model.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#ff6600] text-white border-[#ff6600] shadow-md shadow-[#ff6600]/30'
                  : 'bg-[#181a20] border-[#262933] text-neutral-300 hover:text-white hover:border-[#ff6600]'
              }`}
              title={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white stroke-white' : ''}`} />
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto bg-[#13151a]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Visual with Full Gallery */}
            <div className="space-y-3">
              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-[#262933] bg-[#0d0e12] flex items-center justify-center relative group/modalImage shadow-inner">
                {/* Photorealistic Studio Wooden Table Background */}
                <img
                  src="/model_card_bg.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
                />

                {/* Subtle spotlight glow behind model */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_75%)] pointer-events-none z-[1]" />

                {hasPhoto && !isMainLoaded && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[2]">
                    <Box className="w-12 h-12 text-neutral-400 animate-pulse" />
                  </div>
                )}

                {hasPhoto ? (
                  <img
                    ref={(el) => {
                      if (el && el.complete && el.naturalWidth > 0 && !isMainLoaded) {
                        markImageCached(currentSrc);
                        setIsMainLoaded(true);
                      }
                    }}
                    src={currentSrc}
                    alt={model.title}
                    referrerPolicy="no-referrer"
                    decoding="async"
                    fetchPriority="high"
                    onLoad={() => {
                      markImageCached(currentSrc);
                      setIsMainLoaded(true);
                    }}
                    className={`w-full h-full ${
                      currentSrc.endsWith('.svg') || currentSrc.includes('pocket-pals') || currentSrc.toLowerCase().includes('.png') || currentSrc.includes('imgur.com')
                        ? 'object-contain p-4'
                        : 'object-cover'
                    } object-center relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)] transition-opacity duration-200 ${
                      isMainLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onError={() => {
                      if (fallbackAttempt < 3) {
                        setFallbackAttempt(prev => prev + 1);
                      } else {
                        setImageError(true);
                      }
                    }}
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-neutral-300 p-6 text-center max-w-[85%] bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff5500]/20 border border-[#ff5500]/40 flex items-center justify-center shadow-inner">
                      <Box className="w-8 h-8 text-[#ff5500] stroke-[2]" />
                    </div>
                    <span className="text-xs font-mono font-black tracking-widest uppercase text-white px-3 py-1 rounded bg-black/50 border border-white/15">
                      {model.category === 'Pocket Pals' ? 'COLEÇÃO POCKET PALS 3D' : (model.category || 'MODELO 3D STL')}
                    </span>
                    <span className="text-xs font-bold text-neutral-200">
                      {model.stlFiles?.[0]?.name || 'Arquivo 3MF/STL Oficial Pronto'}
                    </span>
                  </div>
                )}

                {/* Transparent Centered Lock for VIP checkout only */}
                {isVipCheckout && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <span className="p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                      <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] stroke-[1.8]" />
                    </span>
                  </div>
                )}

                {/* Counter Tag */}
                {allImages.length > 1 && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-black/85 backdrop-blur-sm text-white text-[11px] font-mono font-black px-2 py-0.5 rounded-md border border-white/20">
                    <Images className="w-3.5 h-3.5 text-white" />
                    <span>{selectedImageIndex + 1}/{allImages.length}</span>
                  </div>
                )}

                {/* Left/Right Carousel Controls */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 transition-all z-20 shadow-md cursor-pointer"
                      title="Foto anterior"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 transition-all z-20 shadow-md cursor-pointer"
                      title="Próxima foto"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </>
                )}

                {model.fileSize && (
                  <div className="absolute bottom-2.5 left-2.5 bg-black/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 z-20">
                    {model.fileSize}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-white font-black uppercase">Galeria de Fotos</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageError(false);
                          setFallbackAttempt(0);
                          setSelectedImageIndex(idx);
                        }}
                        className={`w-14 h-14 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                          idx === selectedImageIndex
                            ? 'border-2 border-white ring-2 ring-white/50 shadow-md'
                            : 'border-[#333333] opacity-70 hover:opacity-100 hover:border-white'
                        }`}
                      >
                        <img
                          src={getOptimizedCardImageUrl(imgUrl, 0, 160)}
                          alt=""
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain object-center p-1 bg-[#141414]"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Information Column */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1 font-bold">
                  <span className="text-white">{model.category}</span>
                  {model.scale && (
                    <>
                      <span>•</span>
                      <span>{model.scale}</span>
                    </>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-tight">
                  {model.title}
                </h2>
              </div>

              {model.description && (
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-medium">
                  {model.description}
                </p>
              )}

              {/* Technical Specifications */}
              <div className="p-3.5 rounded-xl bg-[#0c0c0c] border border-[#262626] space-y-2.5 text-xs">
                <span className="text-white font-extrabold uppercase tracking-wider block text-[10px]">
                  Ficha Técnica da Impressão 3D
                </span>
                <div className="grid grid-cols-2 gap-2 text-neutral-300 font-medium">
                  {model.printTimeHours && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] font-bold">TEMPO ESTIMADO</span>
                      <span className="text-white font-bold">{model.printTimeHours}h</span>
                    </div>
                  )}
                  {model.weightGrams && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] font-bold">PESO FILAMENTO</span>
                      <span className="text-white font-bold">~{model.weightGrams}g</span>
                    </div>
                  )}
                  {model.suggestedPrice && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] font-bold">VALOR SUGERIDO</span>
                      <span className="text-white font-extrabold">R$ {model.suggestedPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {model.infill && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] font-bold">PREENCHIMENTO</span>
                      <span className="text-white font-bold">{model.infill}</span>
                    </div>
                  )}
                  {model.walls && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] font-bold">PAREDES</span>
                      <span className="text-white font-bold">{model.walls} loops</span>
                    </div>
                  )}
                  {model.amsSupport !== undefined && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] font-bold">MULTICOLOR</span>
                      <span className="font-bold text-white">
                        {model.amsSupport ? 'Compatível com AMS' : 'Pintura/Mono'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* STL & 3MF Files List */}
              {model.stlFiles && model.stlFiles.length > 0 && (
                <div className="p-3 rounded-xl bg-[#0c0d11] border border-[#262933] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400">
                    <span className="text-white uppercase tracking-wider flex items-center gap-1.5 font-mono text-[10px]">
                      <Box className="w-3.5 h-3.5 text-[#ff6600]" />
                      Arquivos Inclusos ({model.stlFiles.length})
                    </span>
                    <span className="text-[10px] text-neutral-400">Download individual</span>
                  </div>
                  <div className="space-y-1.5">
                    {model.stlFiles.map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onRecordDownload && onRecordDownload(model)}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#14161d] hover:bg-[#1c1f29] border border-[#2b303c] hover:border-[#ff6600] transition group text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          <Download className="w-3.5 h-3.5 text-[#ff6600] group-hover:scale-110 transition shrink-0" />
                          <span className="text-neutral-200 group-hover:text-white font-medium truncate">
                            {file.name}
                          </span>
                        </div>
                        {file.size && (
                          <span className="text-[10px] text-neutral-400 font-mono font-bold shrink-0 ml-2">
                            {file.size}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Actions (Black & Orange Primary Button) */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleOpenDrive}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer ${
                    isVipCheckout
                      ? 'bg-amber-400 hover:bg-amber-300 text-black'
                      : 'bg-[#ff6600] hover:bg-[#ea580c] active:bg-[#c2410c] text-white shadow-md shadow-[#ff6600]/30 hover:shadow-[#ff6600]/50'
                  }`}
                >
                  {isVipCheckout && <Lock className="w-4 h-4 stroke-[2.5]" />}
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  <span>{isVipCheckout ? 'ACESSAR PRODUTO' : 'ACESSAR PASTA NO GOOGLE DRIVE'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDirectDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#181a20] hover:bg-[#20232a] text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-[#262933] hover:border-[#ff6600] transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Baixar STL</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2.5 bg-[#181a20] hover:bg-[#20232a] text-neutral-300 hover:text-white border border-[#262933] hover:border-[#ff6600] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Copiar link"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#ff6600] stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2]" />}
                    <span>{copied ? 'Copiado' : 'Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
