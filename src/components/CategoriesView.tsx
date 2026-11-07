import React, { useState, useMemo } from 'react';
import { CATEGORIES, Category } from '../data/categories';
import { Folder, Search, ArrowRight, Sparkles, X } from 'lucide-react';

interface CategoriesViewProps {
  onSelectCategory: (category: Category) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return CATEGORIES;
    const term = searchTerm.toLowerCase().trim();
    return CATEGORIES.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.filterQuery.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6 text-left font-sans select-none pb-12">
      {/* Header with Title & Search */}
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
            Navegue por todas as coleções temáticas oficiais prontas para fatiar e imprimir.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar categoria por tema..."
              className="w-full bg-[#131620] text-white text-xs pl-10 pr-9 py-2.5 rounded-xl border border-[#222736] focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/20 outline-none transition placeholder:text-neutral-500 font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Category Cards (Exact layout from user screenshot) */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="group relative rounded-2xl overflow-hidden bg-[#141720] hover:bg-[#181b26] border border-[#222736] hover:border-[#ff5500]/70 hover:shadow-[0_12px_28px_rgba(255,85,0,0.18)] transition-all duration-200 cursor-pointer p-3 flex flex-col justify-between text-left select-none"
            >
              {/* Cover Image Container with Inner Border */}
              <div className="w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-[#0d0f15] border border-[#1f2330] flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('6wgowqT')) {
                      target.src = 'https://i.imgur.com/6wgowqT.png';
                    }
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Bottom Info: Title on top, ACESSAR > underneath */}
              <div className="pt-3 pb-1 flex flex-col gap-1">
                <h3
                  className="text-sm font-black text-white group-hover:text-[#ff5500] uppercase tracking-wide truncate transition-colors font-sans"
                  title={cat.title}
                >
                  {cat.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-black text-[#ff5500] group-hover:text-[#ff7733] uppercase tracking-wider transition-colors pt-0.5">
                  <span>ACESSAR</span>
                  <span className="text-sm font-black transition-transform group-hover:translate-x-1">›</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#131620] border border-[#222736] space-y-3">
          <p className="text-sm font-bold text-white">Nenhuma categoria encontrada para "{searchTerm}"</p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-xs text-[#ff5500] hover:underline font-bold"
          >
            Limpar busca de categorias
          </button>
        </div>
      )}
    </div>
  );
};
