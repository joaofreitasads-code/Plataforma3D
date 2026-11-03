import React from 'react';
import { Model3D, getCategory, getDriveUrl } from '../data/modelsData';
import { ModelThumbnail } from './ModelThumbnail';
import { Star, ExternalLink, ArrowRight } from 'lucide-react';

interface Props {
  model: Model3D;
  isFavorite: boolean;
  onToggleFavorite: (modelId: string, e: React.MouseEvent) => void;
  onSelectModel: (model: Model3D) => void;
  onRecordDownload: (modelId: string) => void;
}

export const ModelCard: React.FC<Props> = ({
  model,
  isFavorite,
  onToggleFavorite,
  onSelectModel,
  onRecordDownload,
}) => {
  const category = getCategory(model.cat);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRecordDownload(model.id);
  };

  return (
    <div className="group relative flex flex-col bg-[#15181d] border border-[#262b33] rounded-2xl overflow-hidden text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#3a414c] hover:shadow-2xl hover:shadow-black/60">
      {/* Clickable Area for modal */}
      <div 
        onClick={() => onSelectModel(model)}
        className="cursor-pointer flex flex-col flex-1"
      >
        {/* Thumbnail + Flags */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#1b1f25]">
          <ModelThumbnail model={model} />

          {/* TOP / NOVO Flag */}
          {model.top && (
            <span className="absolute top-3 right-3 text-[11px] font-extrabold tracking-wider bg-[#e5132b] text-white px-2.5 py-1 rounded-md shadow-lg shadow-black/40">
              TOP
            </span>
          )}
          {model.novo && (
            <span className="absolute top-3 right-3 text-[11px] font-extrabold tracking-wider bg-[#2fbf8f] text-[#0c0e11] px-2.5 py-1 rounded-md shadow-lg shadow-black/40">
              NOVO
            </span>
          )}
          {model.capacidade && (
            <span className="absolute bottom-2.5 left-2.5 text-[11px] font-black tracking-wider bg-black/80 backdrop-blur-md text-[#38bdf8] border border-[#38bdf8]/40 px-2 py-0.5 rounded shadow-lg shadow-black/80">
              {model.capacidade}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <h3 className="font-semibold text-[14.5px] leading-snug text-[#f2f3f5] group-hover:text-white transition-colors line-clamp-2">
              {model.nome}
            </h3>
            <p className="text-xs font-medium text-[#9aa1ac] mt-1 flex items-center gap-1.5 flex-wrap">
              <span>{category.nome}</span>
              <span>·</span>
              <span className="font-semibold text-[#c9ced6]">{model.fmt}</span>
              {model.capacidade && (
                <>
                  <span>·</span>
                  <span className="font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-1.5 py-0.2 rounded text-[11px]">
                    {model.capacidade}
                  </span>
                </>
              )}
              {model.mb && (
                <>
                  <span>·</span>
                  <span>{model.mb} MB</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#262b33]/60">
            <a
              href={getDriveUrl(model)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#ff6a1f] tracking-wide hover:underline focus:outline-none"
            >
              BAIXAR NO DRIVE
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectModel(model);
              }}
              className="text-[11px] font-semibold text-[#9aa1ac] hover:text-white transition-colors"
            >
              Ver detalhes
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Button (floating in corner) */}
      <button
        type="button"
        onClick={(e) => onToggleFavorite(model.id, e)}
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-150 z-10 ${
          isFavorite
            ? 'bg-[#ffc94d]/20 text-[#ffc94d] border border-[#ffc94d]/40 shadow-lg'
            : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80 border border-white/10'
        }`}
      >
        <Star
          className={`w-4 h-4 transition-transform active:scale-125 ${
            isFavorite ? 'fill-[#ffc94d]' : ''
          }`}
        />
      </button>
    </div>
  );
};
