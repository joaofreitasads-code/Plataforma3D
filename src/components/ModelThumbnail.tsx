import React, { useState } from 'react';
import { Model3D, getCategory } from '../data/modelsData';
import { Box, Layers, Cpu, Sparkles } from 'lucide-react';

interface Props {
  model: Model3D;
  aspectRatio?: 'square' | 'wide';
}

// Module-level in-memory cache of successfully loaded URLs so returning to cards doesn't flash
const loadedImagesCache = new Set<string>();

export const ModelThumbnail: React.FC<Props> = ({ model, aspectRatio = 'square' }) => {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);
  const category = getCategory(model.cat);

  const sources = [
    `/img/${model.id}.jpg`,
    `https://euphonious-babka-f812f1.netlify.app/img/${encodeURIComponent(model.id)}.jpg`
  ];

  const currentSrc = sources[currentSrcIndex];
  const [isLoaded, setIsLoaded] = useState(() => loadedImagesCache.has(currentSrc));

  const handleImgError = () => {
    if (currentSrcIndex < sources.length - 1) {
      setCurrentSrcIndex((prev) => prev + 1);
      setIsLoaded(false);
    } else {
      setHasFailedAll(true);
    }
  };

  const handleImgLoad = () => {
    loadedImagesCache.add(currentSrc);
    setIsLoaded(true);
  };

  if (model.semFoto || hasFailedAll) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none bg-gradient-to-br from-[#1b1f25] via-[#15181d] to-[#0c0e11] border-b border-[#262b33]"
        style={{ aspectRatio: aspectRatio === 'wide' ? '16/10' : '1/1' }}
      >
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${category.cor || '#ff6a1f'} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        <div 
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: category.cor || '#ff6a1f' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-[90%]">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${category.cor || '#ff6a1f'}22, ${category.cor || '#ff6a1f'}44)`,
              border: `1px solid ${category.cor || '#ff6a1f'}55`,
              color: category.cor || '#ff6a1f'
            }}
          >
            {model.fmt === '3MF' ? (
              <Layers className="w-7 h-7" />
            ) : model.semAms ? (
              <Cpu className="w-7 h-7" />
            ) : (
              <Box className="w-7 h-7" />
            )}
          </div>

          <span className="font-bold text-xs uppercase tracking-wider text-[#9aa1ac] line-clamp-1 mb-0.5">
            {category.nome}
          </span>
          <p className="font-bold text-xs text-white/90 line-clamp-2 px-1 leading-snug">
            {model.nome}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#262b33] text-[#c9ced6]">
              {model.fmt}
            </span>
            {model.mb && (
              <span className="text-[10px] font-semibold text-[#9aa1ac]">
                {model.mb} MB
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] font-bold text-white/50 tracking-wider">
          <Sparkles className="w-2.5 h-2.5 text-[#ff6a1f]" />
          3D MODEL
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-[#15181d]"
      style={{ aspectRatio: aspectRatio === 'wide' ? '16/10' : '1/1' }}
    >
      {/* Skeleton Pulse Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1b1f25] flex items-center justify-center animate-pulse z-0">
          <div className="w-10 h-10 rounded-xl bg-[#262b33]/40 flex items-center justify-center">
            <Box className="w-5 h-5 text-[#9aa1ac]/30" />
          </div>
        </div>
      )}

      <img
        src={currentSrc}
        alt={model.nome}
        loading="lazy"
        decoding="async"
        onLoad={handleImgLoad}
        onError={handleImgError}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        }`}
      />
    </div>
  );
};
