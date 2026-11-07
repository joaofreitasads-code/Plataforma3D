import React from 'react';
import { CATEGORIES, Category } from '../data/categories';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';

interface CategoryChipsBarProps {
  selectedCategoryId: string;
  onSelectCategory: (category: Category | null) => void;
  onOpenAllCategories: () => void;
}

export const CategoryChipsBar: React.FC<CategoryChipsBarProps> = ({
  selectedCategoryId,
  onSelectCategory,
  onOpenAllCategories,
}) => {
  // Curated list of popular categories for the quick chips
  const popularChips = React.useMemo(() => {
    const featuredIds = [
      'canecas-de-times',
      'canecas-gamer',
      'action-figures-3d',
      'street-fighter',
      'mortal-kombat',
      'sonic',
      'herois',
      'pokemon',
      'minecraft',
      'lego',
      'terror',
      'bichinhos-fofos',
      'desenhos-e-animacoes',
      'chaveiros',
      'mascotes-de-futebol',
      'natal'
    ];

    return CATEGORIES.filter((c) => featuredIds.includes(c.id));
  }, []);

  return (
    <div className="space-y-3 pt-2 text-left select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#ff5500]" />
          <span className="text-xs font-black uppercase text-white tracking-wider">
            Explorar Categorias &amp; Coleções
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenAllCategories}
          className="text-xs font-bold text-[#ff5500] hover:text-[#ff7733] flex items-center gap-1 transition cursor-pointer"
        >
          <span>Ver todas as categorias</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* All / Todas Button */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
            selectedCategoryId === 'all'
              ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-lg shadow-[#ff5500]/25'
              : 'bg-[#141720] hover:bg-[#1a1e2b] text-neutral-300 hover:text-white border-[#222736]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Todas as Peças</span>
        </button>

        {/* Popular Category Chips */}
        {popularChips.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-lg shadow-[#ff5500]/25'
                  : 'bg-[#141720] hover:bg-[#1a1e2b] text-neutral-300 hover:text-white border-[#222736]'
              }`}
            >
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
