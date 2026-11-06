import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Box } from 'lucide-react';
import { SECTIONS, ALL_MODELS } from '../data/modelsData';
import { getOptimizedCardImageUrl } from '../utils/imageOptimizer';

interface CategoryShowcaseGridProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

// Precompute section preview map once for O(1) instant lookup without searching 1200+ models
const SECTION_PREVIEWS: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const sec of SECTIONS) {
    const modelWithPhoto = ALL_MODELS.find(
      m => m.sectionId === sec.id && (m.thumbnailUrl || m.imageUrl || (m.images && m.images.length > 0))
    );
    const raw = modelWithPhoto?.thumbnailUrl || modelWithPhoto?.imageUrl || modelWithPhoto?.images?.[0] || '';
    if (raw) {
      map[sec.id] = getOptimizedCardImageUrl(raw, 0, 220);
    }
  }
  return map;
})();

export const CategoryShowcaseGrid: React.FC<CategoryShowcaseGridProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayedSections = showAll ? SECTIONS : SECTIONS.slice(0, 12);

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-4 bg-[#00A3FF] shadow-[0_0_8px_#00A3FF]" />
          <h3 className="text-sm font-black font-mono text-white uppercase tracking-wider">
            Coleções & Pastas Oficiais
          </h3>
          <span className="text-[11px] font-mono text-[#00A3FF] font-black">
            ({SECTIONS.length} pastas • {ALL_MODELS.length} modelos)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {SECTIONS.length > 12 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-mono text-[#00A3FF] hover:text-white transition cursor-pointer flex items-center gap-1 font-black"
            >
              <span>{showAll ? 'Mostrar Menos' : `Ver Todas (${SECTIONS.length})`}</span>
              <ChevronDown className={`w-3.5 h-3.5 stroke-[2.5] transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          )}

          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-mono text-[#00A3FF] hover:underline transition cursor-pointer flex items-center gap-1 font-black"
            >
              <span>Todas as Pastas</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Category Cards (Bem quadradinhos, fundo #080808, borda neon #00A3FF, brilho azul/roxo, fonte grossa) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayedSections.map((section) => {
          const isSelected = selectedCategory === section.id;
          const previewImg = SECTION_PREVIEWS[section.id] || '';

          return (
            <div
              key={section.id}
              onClick={() => onSelectCategory(section.id)}
              className={`relative rounded-none overflow-hidden cursor-pointer group transition-all duration-300 border-2 flex flex-col justify-end p-3 h-36 ${
                isSelected
                  ? 'border-[#00A3FF] ring-2 ring-[#00A3FF] bg-[#080808] shadow-[0_0_20px_rgba(0,163,255,0.5)] scale-[1.02]'
                  : 'border-[#00A3FF]/50 hover:border-[#00A3FF] bg-[#080808] hover:shadow-[0_0_15px_rgba(0,163,255,0.4)]'
              }`}
            >
              {/* Brilho leve: azul / roxo atrás dos bonecos */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
                <div
                  className="w-[85%] h-[85%] rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(0, 163, 255, 0.4) 0%, rgba(147, 51, 234, 0.3) 45%, transparent 75%)'
                  }}
                />
              </div>

              {/* Background Image / Render */}
              {previewImg ? (
                <img
                  src={previewImg}
                  alt={section.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-85 select-none"
                />
              ) : (
                <div className="absolute inset-0 bg-[#071120] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-[#10203a] border border-[#1b3560] flex items-center justify-center">
                    <Box className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                </div>
              )}

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent pointer-events-none z-10" />

              {/* Category Content */}
              <div className="relative z-20 space-y-0.5">
                <span className="text-[10px] font-mono font-black text-[#00A3FF] uppercase tracking-wider block">
                  COLEÇÃO EXCLUSIVA
                </span>
                <h4 className="text-xs font-black text-white group-hover:text-[#00A3FF] transition leading-tight line-clamp-1">
                  {section.shortTitle}
                </h4>
              </div>

              {/* Active Indicator Pin */}
              {isSelected && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-none bg-[#00A3FF] shadow-[0_0_8px_#00A3FF] ring-1 ring-black z-20" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
