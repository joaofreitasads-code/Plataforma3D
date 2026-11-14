import React from 'react';
import { Folder, ExternalLink, HardDrive, Download, ChevronRight, Sparkles } from 'lucide-react';
import { BONUS_SECTIONS, BonusSection } from '../data/bonusSections';
import { ResilientImg } from './ResilientImg';

interface BonusSectionsGridProps {
  onSelectSection: (categoryId: string) => void;
  onOpenDrive?: (url: string) => void;
}

export const BonusSectionsGrid: React.FC<BonusSectionsGridProps> = ({
  onSelectSection,
  onOpenDrive
}) => {
  return (
    <div className="space-y-4 text-left">
      {/* Grid of 14 Sections matching ref3.png (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {BONUS_SECTIONS.map((section, index) => (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.categoryFilter)}
            className="bg-[#13151a] hover:bg-[#181a20] border-2 border-[#ff6600]/40 hover:border-[#ff6600] rounded-2xl p-3.5 sm:p-4.5 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_12px_32px_rgba(255,102,0,0.25)] group relative overflow-hidden select-none"
          >
            {/* Ambient orange glow on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6600]/5 group-hover:bg-[#ff6600]/15 rounded-full blur-2xl transition-all duration-300 pointer-events-none" />

            {/* Left: Square Thumbnail (Encaixada perfeitamente, sem sobrar borda e sem cortar) */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 aspect-square rounded-xl overflow-hidden shrink-0 bg-[#090a0d] border border-[#ff6600]/30 group-hover:border-[#ff6600] relative shadow-inner">
              <ResilientImg
                rawSrc={section.image}
                alt={section.title}
                loading={index < 6 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Right: Section Details & Actions */}
            <div className="flex-1 flex flex-col justify-between text-left min-w-0 space-y-2">
              <div className="space-y-1">
                {/* Bonus Badge Kicker */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase text-[#ff6600] tracking-wider bg-[#ff6600]/15 border border-[#ff6600]/30 px-2 py-0.5 rounded-md">
                    {section.bonusNumber}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                    ARQUIVOS STL & 3MF
                  </span>
                </div>

                {/* Section Title */}
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#ff6600] uppercase tracking-tight transition-colors line-clamp-2 leading-snug">
                  {section.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-400 font-medium line-clamp-2 leading-relaxed">
                  {section.description}
                </p>
              </div>

              {/* Action Buttons in Black & Orange */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection(section.categoryFilter);
                  }}
                  className="flex-1 bg-[#ff6600] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-black text-xs uppercase tracking-wider py-2.5 px-3.5 rounded-xl shadow-md shadow-[#ff6600]/25 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Folder className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ACESSAR ARQUIVOS</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <a
                  href={section.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Abrir pasta no Google Drive"
                  className="p-2.5 rounded-xl bg-[#1c1f26] hover:bg-[#252933] text-neutral-300 hover:text-white border border-[#2d313d] hover:border-[#ff6600]/50 transition cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-4 h-4 stroke-[2]" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
