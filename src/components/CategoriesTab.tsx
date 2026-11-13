import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Sparkles, Folder, ArrowLeft } from 'lucide-react';
import { OFFICIAL_CATEGORIES, CategoryItem } from '../data/categoriesData';
import { VIP_DRIVE_MAIN_URL } from '../data/catalogMeta';

interface CategoriesTabProps {
  onSelectCategory: (category: CategoryItem) => void;
  onOpenDrive?: (url: string) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  onSelectCategory,
  onOpenDrive
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return OFFICIAL_CATEGORIES;
    const q = searchQuery.toLowerCase().trim();
    return OFFICIAL_CATEGORIES.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.filterQuery.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6 text-left font-sans select-none pb-12">
      {/* Header with Title and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c202d] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] text-xs font-bold uppercase tracking-wider">
            <Folder className="w-3.5 h-3.5" />
            <span>COLEÇÕES COMPLETAS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            TODAS AS <span className="text-[#ff5500]">CATEGORIAS</span> 3D
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Navegue por todas as {OFFICIAL_CATEGORIES.length} coleções temáticas oficiais prontas para fatiar e imprimir.
          </p>
        </div>

        {/* Search inside Categories */}
        <div className="w-full md:w-80">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar categoria por tema..."
              className="w-full bg-[#131620] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#222736] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 outline-none transition placeholder:text-neutral-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Grid of 4 columns matching exact user reference cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="group relative rounded-2xl overflow-hidden bg-[#12151e] border border-[#1e2332] hover:border-[#ff5500]/70 hover:shadow-[0_12px_28px_rgba(0,0,0,0.7)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Top Visual Image Banner (16:9 / 3:2 ratio) */}
            <div className="w-full aspect-[16/10] relative overflow-hidden bg-[#090b10] flex items-center justify-center">
              {!failedImages[category.id] ? (
                <img
                  src={category.image}
                  alt={category.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailedImages(prev => ({ ...prev, [category.id]: true }))}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 text-[#ff5500]">
                  <Folder className="w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {category.title}
                  </span>
                </div>
              )}
              {/* Subtle top/bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151e] via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
            </div>

            {/* Bottom Bar: CATEGORY TITLE on Left, ACESSAR > in Orange on Right */}
            <div className="px-4 py-3 bg-[#12151e] border-t border-[#1a1e2b] flex items-center justify-between gap-2">
              <h3 
                className="text-xs sm:text-[13px] font-black text-white group-hover:text-[#ff5500] uppercase tracking-wide truncate transition-colors"
                title={category.title}
              >
                {category.title}
              </h3>

              <div className="flex items-center gap-1 text-[11px] font-bold text-[#ff5500] uppercase tracking-wider shrink-0 transition-transform group-hover:translate-x-0.5">
                <span>ACESSAR</span>
                <span className="text-sm font-black leading-none">›</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
