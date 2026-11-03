import React, { useEffect } from 'react';
import { Model3D, getCategory, getDriveUrl } from '../data/modelsData';
import { ModelThumbnail } from './ModelThumbnail';
import { 
  X, 
  ExternalLink, 
  Star, 
  Folder, 
  HardDrive, 
  Layers, 
  Printer, 
  Check, 
  Copy,
  FileCode,
  Coffee
} from 'lucide-react';

interface Props {
  model: Model3D | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (modelId: string) => void;
  onRecordDownload: (modelId: string) => void;
  onSelectCategory?: (catId: string) => void;
}

export const ModelModal: React.FC<Props> = ({
  model,
  isFavorite,
  onClose,
  onToggleFavorite,
  onRecordDownload,
  onSelectCategory
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!model) return null;

  const category = getCategory(model.cat);
  const driveUrl = getDriveUrl(model);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(driveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFormatTip = () => {
    if (model.id === 'looney-peaky') {
      return 'Pack completo de 82 MB com 13 personagens em STL de alta definição (média de ~6 MB por boneco). Você pode baixar a pasta inteira ou abrir o Google Drive e baixar apenas o personagem que for imprimir agora para economizar tempo e espaço!';
    }
    if (model.fmt === '3MF') {
      return 'Abra o arquivo .3MF direto no Bambu Studio ou OrcaSlicer, com as placas e suportes já calibrados e organizados.';
    }
    if (model.fmt === 'RAR') {
      return 'Baixe o arquivo RAR, extraia com WinRAR ou 7-Zip e importe as peças STL para o seu fatiador de preferência.';
    }
    if (model.fmt === 'STL') {
      return 'Abra a pasta no Google Drive, baixe os arquivos STL e carregue no fatiador (Cura, Prusa, Orca, Bambu). Você também pode baixar arquivos individuais dentro da pasta.';
    }
    return 'Baixe o pacote ZIP, descompacte no computador e abra as peças no seu fatiador favorito.';
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#15181d] border border-[#262b33] rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-2 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Thumbnail Preview Column */}
        <div className="relative aspect-square md:aspect-auto md:h-full bg-[#1b1f25] border-b md:border-b-0 md:border-r border-[#262b33]">
          <ModelThumbnail model={model} />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            {model.top && (
              <span className="text-xs font-extrabold tracking-wider bg-[#e5132b] text-white px-3 py-1 rounded-md shadow-lg">
                MAIS VENDIDO
              </span>
            )}
            {model.novo && (
              <span className="text-xs font-extrabold tracking-wider bg-[#2fbf8f] text-[#0c0e11] px-3 py-1 rounded-md shadow-lg">
                NOVO NA CENTRAL
              </span>
            )}
          </div>
        </div>

        {/* Details & Action Column */}
        <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] gap-6">
          <div className="flex flex-col gap-4">
            {/* Category Breadcrumb */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectCategory?.(category.id);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff6a1f] hover:underline"
              >
                <Folder className="w-3.5 h-3.5" />
                {category.nome}
              </button>
            </div>

            {/* Model Title */}
            <h2 className="font-display font-bold text-2xl text-white leading-tight">
              {model.nome}
            </h2>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="bg-[#0c0e11] border border-[#262b33] rounded-xl p-3">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#9aa1ac] uppercase tracking-wider mb-1">
                  <FileCode className="w-3.5 h-3.5 text-[#ff6a1f]" />
                  Formato
                </span>
                <span className="font-bold text-sm text-[#f2f3f5]">{model.fmt}</span>
              </div>

              <div className="bg-[#0c0e11] border border-[#262b33] rounded-xl p-3">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#9aa1ac] uppercase tracking-wider mb-1">
                  <HardDrive className="w-3.5 h-3.5 text-[#ff6a1f]" />
                  Tamanho
                </span>
                <span className="font-bold text-sm text-[#f2f3f5]">
                  {model.mb ? `${model.mb} MB` : 'Pasta Drive'}
                </span>
              </div>

              <div className="bg-[#0c0e11] border border-[#262b33] rounded-xl p-3">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#9aa1ac] uppercase tracking-wider mb-1">
                  <Layers className="w-3.5 h-3.5 text-[#ff6a1f]" />
                  Categoria
                </span>
                <span className="font-bold text-sm text-[#f2f3f5] truncate">{category.nome}</span>
              </div>

              <div className="bg-[#0c0e11] border border-[#262b33] rounded-xl p-3">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#9aa1ac] uppercase tracking-wider mb-1">
                  <Printer className="w-3.5 h-3.5 text-[#ff6a1f]" />
                  Impressão
                </span>
                <span className="font-bold text-sm text-[#f2f3f5]">
                  {model.semAms
                    ? 'Multipartes, sem AMS'
                    : model.fmt === '3MF'
                    ? 'Placas prontas'
                    : 'Peças separadas'}
                </span>
              </div>

              {model.capacidade && (
                <div className="bg-[#0c0e11] border border-[#38bdf8]/35 rounded-xl p-3 col-span-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider">
                    <Coffee className="w-3.5 h-3.5 text-[#38bdf8]" />
                    Capacidade / Volume
                  </span>
                  <span className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span className="text-[#38bdf8] bg-[#38bdf8]/15 px-2 py-0.5 rounded text-xs">
                      {model.capacidade}
                    </span>
                    <span className="text-[#9aa1ac] text-xs font-medium">Compatível c/ Copo Inox</span>
                  </span>
                </div>
              )}
            </div>

            {/* Format Instructions Box */}
            <div className="bg-[#1b1f25]/80 border border-[#262b33] rounded-xl p-3.5 text-xs text-[#c9ced6] leading-relaxed">
              <span className="font-bold text-white block mb-1">Instruções de Fatiamento:</span>
              {getFormatTip()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onRecordDownload(model.id)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#ff6a1f] to-[#ff3d2e] hover:opacity-95 shadow-lg shadow-[#ff6a1f]/25 transition-transform active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4" />
              Baixar Arquivos no Google Drive
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(model.id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs border transition-colors ${
                  isFavorite
                    ? 'bg-[#ffc94d]/15 text-[#ffc94d] border-[#ffc94d]/40'
                    : 'bg-[#1b1f25] hover:bg-[#222730] text-[#f2f3f5] border-[#262b33]'
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-[#ffc94d]' : ''}`} />
                {isFavorite ? 'Salvo nos Favoritos' : 'Favoritar Modelo'}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#1b1f25] hover:bg-[#222730] text-[#f2f3f5] border border-[#262b33] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#2fbf8f]" />
                    <span className="text-[#2fbf8f]">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
