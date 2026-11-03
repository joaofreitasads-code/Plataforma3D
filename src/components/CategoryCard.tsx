import React, { useState } from 'react';
import { Category } from '../data/modelsData';
import { ChevronRight, Folder } from 'lucide-react';

interface Props {
  category: Category;
  onClick: (catId: string) => void;
}

const loadedCategoryCovers = new Set<string>();

export const CategoryCard: React.FC<Props> = ({ category, onClick }) => {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const sources = [
    `/img/${category.capa}.jpg`,
    `https://euphonious-babka-f812f1.netlify.app/img/${encodeURIComponent(category.capa)}.jpg`
  ];

  const currentSrc = sources[currentSrcIndex];
  const [isLoaded, setIsLoaded] = useState(() => loadedCategoryCovers.has(currentSrc));

  const handleImgError = () => {
    if (currentSrcIndex < sources.length - 1) {
      setCurrentSrcIndex((prev) => prev + 1);
      setIsLoaded(false);
    } else {
      setHasFailedAll(true);
    }
  };

  const handleImgLoad = () => {
    loadedCategoryCovers.add(currentSrc);
    setIsLoaded(true);
  };

  return (
    <button
      onClick={() => onClick(category.id)}
      className="group flex flex-col text-left bg-[#15181d] border border-[#262b33] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#3a414c] hover:shadow-xl hover:shadow-black/40 focus:outline-none focus:ring-2 focus:ring-[#ff6a1f]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1b1f25]">
        {/* Skeleton while loading */}
        {!isLoaded && !hasFailedAll && (
          <div className="absolute inset-0 bg-[#1b1f25] flex items-center justify-center animate-pulse z-0">
            <div className="w-10 h-10 rounded-xl bg-[#262b33]/40 flex items-center justify-center">
              <Folder className="w-5 h-5 text-[#9aa1ac]/30" />
            </div>
          </div>
        )}

        {!hasFailedAll ? (
          <img
            src={currentSrc}
            alt={category.nome}
            loading="lazy"
            decoding="async"
            onLoad={handleImgLoad}
            onError={handleImgError}
            className={`w-full h-full object-cover object-[center_30%] transition-all duration-300 group-hover:scale-105 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#1b1f25] to-[#111418]"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${category.cor || '#ff6a1f'}25, ${category.cor || '#ff6a1f'}50)`,
                color: category.cor || '#ff6a1f'
              }}
            >
              <Folder className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs uppercase text-white/80 tracking-wide text-center">
              {category.nome}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 w-full">
        <span className="font-display font-bold text-sm tracking-wide text-white uppercase group-hover:text-[#ff6a1f] transition-colors">
          {category.nome}
        </span>
        <span className="flex items-center gap-0.5 text-xs font-extrabold text-[#ff6a1f] tracking-wider whitespace-nowrap">
          ACESSAR <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
};
