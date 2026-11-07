import React from 'react';
import { TrendingUp, DollarSign, Award, CheckCircle, ExternalLink } from 'lucide-react';
import { Model3D } from '../types/model';

interface ProfitableProductsViewProps {
  onOpenModelDetails: (model: Model3D) => void;
  canecas: Model3D[];
}

export const ProfitableProductsView: React.FC<ProfitableProductsViewProps> = ({
  onOpenModelDetails,
  canecas,
}) => {
  const products = [
    {
      category: 'Canecas Térmicas de Times (Futebol)',
      margin: '280% - 350%',
      avgCost: 'R$ 18,50',
      salePrice: 'R$ 75,00 - R$ 90,00',
      demand: 'Altíssima (Ano todo + Dias de Jogos)',
      reason: 'Itens com apelo emocional de torcedor. Em dias de finais de campeonato as vendas triplicam no Mercado Livre e Shopee.',
      models: canecas.slice(0, 4),
    },
    {
      category: 'Canecas Gamer Multipartes (PlayStation, COD, MK)',
      margin: '250% - 300%',
      avgCost: 'R$ 19,00',
      salePrice: 'R$ 79,90 - R$ 95,00',
      demand: 'Alta contínua',
      reason: 'Público gamer tem alta taxa de recompra e valoriza acabamento estético em alta resolução para setup e streaming.',
      models: canecas.filter((c) => c.sectionId === 'sec-canecas-gamer').slice(0, 4),
    },
    {
      category: 'Porta Latas & Copos Temáticos (Monster, Alien)',
      margin: '300% - 400%',
      avgCost: 'R$ 14,00',
      salePrice: 'R$ 55,00 - R$ 70,00',
      demand: 'Viral no TikTok & Instagram Reels',
      reason: 'Vídeos curtos de unboxing e teste térmico viralizam facilmente gerando vendas orgânicas sem gastar com tráfego pago.',
      models: canecas.filter((c) => c.sectionId === 'sec-portacopos').slice(0, 4),
    },
  ];

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#ff5500]" />
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Produtos Lucrativos na Impressão 3D
          </h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#e60026] text-white uppercase tracking-wider">
            GUIA COMERCIAL
          </span>
        </div>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Ranking dos modelos mais vendidos no Brasil com maiores margens líquidas e retorno sobre investimento (ROI).
        </p>
      </div>

      <div className="space-y-6">
        {products.map((item, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-2xl bg-[#141720] border border-[#202534] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202534] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] flex items-center justify-center font-black text-xs">
                  #{idx + 1}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">{item.category}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#00e575] bg-[#003822] px-2.5 py-1 rounded-lg border border-[#005a38]">
                  Margem: {item.margin}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0e1017] border border-[#1e2330]">
                <span className="text-neutral-400 block text-[11px]">Custo Médio de Impressão:</span>
                <span className="text-sm font-bold text-white">{item.avgCost}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0e1017] border border-[#1e2330]">
                <span className="text-neutral-400 block text-[11px]">Preço de Venda Praticado:</span>
                <span className="text-sm font-bold text-[#00e575]">{item.salePrice}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0e1017] border border-[#1e2330]">
                <span className="text-neutral-400 block text-[11px]">Demanda de Mercado:</span>
                <span className="text-sm font-bold text-white">{item.demand}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed bg-[#0d0f15] p-3 rounded-xl border border-[#1d212d]">
              {item.reason}
            </p>

            {item.models.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-400 block">
                  Modelos Prontos para Imprimir na Central 3D:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {item.models.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onOpenModelDetails(m)}
                      className="p-2.5 rounded-xl bg-[#0e1017] hover:bg-[#1a1e2b] border border-[#202534] hover:border-[#ff5500]/50 text-left transition text-xs group flex items-center justify-between"
                    >
                      <span className="truncate text-white font-medium pr-1">{m.title}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-[#ff5500] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
