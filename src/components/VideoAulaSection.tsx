import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Laptop, Volume2, Play, 
  Download, FolderOpen, Eye, Key, Sparkles, ArrowRight, Lock, Zap, ShieldCheck, Crown
} from 'lucide-react';
import { ALL_MODELS, SECTIONS, ModelItem, VIP_DRIVE_MAIN_URL, VIP_CHECKOUT_MODEL } from '../data/modelsData';
import { getOptimizedCardImageUrl } from '../utils/imageOptimizer';

interface VideoAulaSectionProps {
  videoId?: string;
  videoUrl?: string;
  onOpenModel?: (model: ModelItem) => void;
  onDirectDownload?: (model: ModelItem) => void;
  onSelectCategoryFilter?: (sectionId: string) => void;
}

const DEFAULT_YOUTUBE_ID = 'ZL36Zx2pr2M';
const DEFAULT_WATCH_URL = 'https://youtu.be/ZL36Zx2pr2M';
const CHECKOUT_VIP_URL = 'https://checkout.wiven.com.br/checkout/cmupyvej300i601pll6oi9cj1?offer=BX0N8TV';

export const VideoAulaSection: React.FC<VideoAulaSectionProps> = ({
  videoId = DEFAULT_YOUTUBE_ID,
  videoUrl = DEFAULT_WATCH_URL,
  onOpenModel,
  onDirectDownload,
  onSelectCategoryFilter
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const localThumbnailUrl = '/youtube_video_aula_thumb.webp';
  const remoteThumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const [thumbSrc, setThumbSrc] = useState(localThumbnailUrl);

  const handleThumbError = () => {
    if (thumbSrc === localThumbnailUrl) {
      setThumbSrc(remoteThumbnailUrl);
    } else if (thumbSrc === remoteThumbnailUrl) {
      setThumbSrc(fallbackThumbnailUrl);
    }
  };

  const handleStartWithSound = () => {
    setIsPlaying(true);
  };

  const handleOpenVipCheckout = () => {
    window.open(CHECKOUT_VIP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-[#101010] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl transition-all font-sans">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-[#202020] bg-gradient-to-r from-[#141414] via-[#111111] to-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          {/* YouTube Iconic Red Icon */}
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-950/50">
            <svg className="w-6 h-4.5" viewBox="0 0 68 48">
              <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000"/>
              <path d="M 45,24 27,14 27,34" fill="#FFFFFF"/>
            </svg>
          </div>
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white flex items-center gap-1">
                <span>YOUTUBE</span>
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                VÍDEO AULA PASSO A PASSO
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
              Como Baixar, Acessar os Arquivos e Imprimir em 3D
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {!isPlaying && (
            <button
              type="button"
              onClick={handleStartWithSound}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-red-950/50 cursor-pointer active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Assistir com Som</span>
            </button>
          )}

          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#181818] hover:bg-[#222222] text-neutral-300 hover:text-white border border-[#303030] rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            title="Abrir no YouTube em nova aba"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Abrir no YouTube</span>
          </a>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-3 py-1.5 bg-[#181818] hover:bg-[#222222] text-neutral-300 hover:text-white border border-[#303030] rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Expandir</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Minimizar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Content & Side Section */}
      {!isCollapsed && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Player Column (16:9 responsive frame) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-2 flex flex-col justify-between">
              <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-[#2a2a2a] shadow-2xl group">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1`}
                    title="Vídeo Aula Passo a Passo - Impressão 3D e Arquivos STL"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0 bg-black"
                  />
                ) : (
                  /* Big YouTube Play Overlay over Video Thumbnail */
                  <div
                    onClick={handleStartWithSound}
                    className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer overflow-hidden group select-none"
                  >
                    {/* YouTube Video High-Res Thumbnail */}
                    <img
                      src={thumbSrc}
                      onError={handleThumbError}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      alt="Miniatura do Vídeo Passo a Passo"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85] group-hover:brightness-95"
                    />

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-300" />

                    {/* YouTube Iconic Play Button */}
                    <div className="relative transform group-hover:scale-110 active:scale-95 transition-all duration-300 drop-shadow-2xl z-10">
                      <div className="w-20 h-14 sm:w-24 sm:h-16 bg-[#FF0000] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-[0_0_35px_rgba(255,0,0,0.7)] group-hover:bg-[#CC0000] transition-colors">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 ml-1" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>

                    {/* Sound Notification Badge */}
                    <div className="relative z-10 mt-4 px-4 py-2 bg-black/85 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-xl group-hover:border-red-500 transition-colors">
                      <Volume2 className="w-4 h-4 text-red-500 stroke-[2.5]" />
                      <span>CLIQUE PARA INICIAR COM SOM</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 px-1 pt-1">
                <span>Vídeo Oficial YouTube • Guia Passo a Passo</span>
                <span className="text-red-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Áudio Ativo ao Clicar
                </span>
              </div>
            </div>

            {/* SESSÃO AO LADO DO VÍDEO (QUER EVITAR ERROS NAS SUAS IMPRESSÕES 3D?) */}
            <div className="lg:col-span-5 xl:col-span-5 text-left flex flex-col bg-[#13151a] border border-[#262933] hover:border-[#ff6600]/60 rounded-2xl overflow-hidden shadow-2xl transition-all">
              {/* Header Limpo da Sessão */}
              <div className="p-3.5 sm:p-4 bg-[#0d0e12] border-b border-[#262933] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#ff6600] text-white shadow-sm flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-white stroke-white" />
                    <span>FICHAS PRÁTICAS 3D</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#ff6600] animate-pulse" />
                </div>
              </div>

              {/* CONTEÚDO: CARD VIP SELECIONADO ("QUER EVITAR ERROS NAS SUAS IMPRESSÕES 3D?") */}
              <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between space-y-3.5 bg-[#13151a]">
                <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                  {/* Imagem do Card Selecionado com Cadeado Centralizado */}
                  <div 
                    onClick={handleOpenVipCheckout}
                    className="relative w-full sm:w-36 aspect-square shrink-0 rounded-xl overflow-hidden bg-white border border-neutral-300 shadow-lg cursor-pointer group/card select-none p-1"
                  >
                    <img
                      src={VIP_CHECKOUT_MODEL.imageUrl}
                      alt="Quer Evitar Erros nas Suas Impressões 3D?"
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-300"
                    />
                    {/* Cadeado Centralizado Translúcido */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/25 backdrop-blur-[2px]">
                      <span className="p-2.5 rounded-xl bg-black/60 border border-white/25 flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">
                        <Lock className="w-6 h-6 text-white stroke-[2.2]" />
                      </span>
                    </div>
                  </div>

                  {/* Textos explicativos em Montserrat */}
                  <div className="space-y-1.5 flex-1 text-left">
                    <div className="inline-block px-2 py-0.5 rounded bg-[#ff6600]/15 border border-[#ff6600]/30 text-[#ff6600] text-[10px] font-black uppercase tracking-wider">
                      GUIA PRÁTICO & AJUSTES
                    </div>
                    <h4 
                      onClick={handleOpenVipCheckout}
                      className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight hover:text-[#ff6600] transition-colors cursor-pointer"
                    >
                      QUER EVITAR ERROS NAS SUAS IMPRESSÕES 3D?
                    </h4>
                    <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed font-medium">
                      <strong className="text-white font-bold">Pare de desperdiçar filamento e perder horas com configurações erradas!</strong> Tenha acesso a fichas práticas com os principais ajustes para imprimir com mais precisão e reduzir falhas.
                    </p>
                  </div>
                </div>

                {/* Benefícios Rápidos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#262933] text-[11px] text-neutral-200 font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                    <span>Configurações Prontas para Consultar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                    <span>Menos Erros e Filamento Desperdiçado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                    <span>Ajustes de Temperatura, Velocidade e Qualidade</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                    <span>Mais Praticidade em Cada Impressão</span>
                  </div>
                </div>

                {/* Botão de Ação CTA de Alta Conversão */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleOpenVipCheckout}
                    className="w-full py-3 px-4 bg-[#ff6600] hover:bg-[#ea580c] active:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
                  >
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>GARANTIR ACESSO (R$ 37,90)</span>
                    <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#ff6600]" />
                      Compra 100% Segura
                    </span>
                    <span className="text-[#ff6600] font-black">R$ 37,90 • Pagamento Único</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

