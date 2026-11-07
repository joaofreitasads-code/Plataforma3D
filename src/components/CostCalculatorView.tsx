import React, { useState } from 'react';
import { SlidersVertical, Calculator, DollarSign, Zap, Weight, TrendingUp } from 'lucide-react';
import { Model3D } from '../types/model';

interface CostCalculatorViewProps {
  models: Model3D[];
  selectedModel?: Model3D | null;
}

export const CostCalculatorView: React.FC<CostCalculatorViewProps> = ({
  models,
  selectedModel,
}) => {
  const [modelId, setModelId] = useState<string>(selectedModel?.id || models[0]?.id || '');
  const [filamentPriceKg, setFilamentPriceKg] = useState<number>(95); // R$ 95 per kg PLA
  const [filamentGrams, setFilamentGrams] = useState<number>(selectedModel?.filamentGrams || 165);
  const [printHours, setPrintHours] = useState<number>(selectedModel?.printTimeHours || 6.5);
  const [kwhPrice, setKwhPrice] = useState<number>(0.92); // R$ 0.92 per kWh
  const [printerWattage, setPrinterWattage] = useState<number>(120); // 120W average
  const [failureRate, setFailureRate] = useState<number>(10); // 10%
  const [desiredProfitMargin, setDesiredProfitMargin] = useState<number>(200); // 200% margin

  // Update when model select changes
  const handleSelectModel = (id: string) => {
    setModelId(id);
    const found = models.find((m) => m.id === id);
    if (found) {
      if (found.filamentGrams) setFilamentGrams(found.filamentGrams);
      if (found.printTimeHours) setPrintHours(found.printTimeHours);
    }
  };

  // Calculations
  const filamentCost = (filamentGrams / 1000) * filamentPriceKg;
  const energyKwh = (printerWattage / 1000) * printHours;
  const energyCost = energyKwh * kwhPrice;
  const rawCost = filamentCost + energyCost;
  const costWithWaste = rawCost * (1 + failureRate / 100);
  const suggestedSalePrice = costWithWaste * (1 + desiredProfitMargin / 100);
  const netProfit = suggestedSalePrice - costWithWaste;

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#003822] border border-[#005a38] flex items-center justify-center text-[#00e575]">
          <SlidersVertical className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Calculadora de Custos &amp; Precificação 3D
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#003822] text-[#00e575] border border-[#005a38] uppercase tracking-wider">
              ACESSO VIP
            </span>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Calcule exatamente o custo de matéria-prima, consumo elétrico e margem de lucro real para cada peça impressa.
          </p>
        </div>
      </div>

      {/* Model Selector */}
      <div className="p-4 rounded-2xl bg-[#141720] border border-[#202534] space-y-2">
        <label className="text-xs font-bold text-neutral-300 block">
          Selecione um modelo da Central 3D para preencher automaticamente:
        </label>
        <select
          value={modelId}
          onChange={(e) => handleSelectModel(e.target.value)}
          className="w-full bg-[#0d0f15] text-white text-xs sm:text-sm p-3 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
        >
          {models.slice(0, 100).map((m) => (
            <option key={m.id} value={m.id}>
              {m.title} ({m.category})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Form Inputs */}
        <div className="p-5 rounded-2xl bg-[#141720] border border-[#202534] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#202534] pb-2">
            <Calculator className="w-4 h-4 text-[#ff5500]" />
            <span>Parâmetros de Produção</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Preço do Kg do Filamento (R$):</label>
              <input
                type="number"
                value={filamentPriceKg}
                onChange={(e) => setFilamentPriceKg(Number(e.target.value))}
                className="w-full bg-[#0d0f15] text-white p-2.5 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Peso do Filamento no Fatiador (Gramas):</label>
              <input
                type="number"
                value={filamentGrams}
                onChange={(e) => setFilamentGrams(Number(e.target.value))}
                className="w-full bg-[#0d0f15] text-white p-2.5 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Tempo Total de Impressão (Horas):</label>
              <input
                type="number"
                step="0.1"
                value={printHours}
                onChange={(e) => setPrintHours(Number(e.target.value))}
                className="w-full bg-[#0d0f15] text-white p-2.5 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-400 block mb-1">Tarifa Energia (R$/kWh):</label>
                <input
                  type="number"
                  step="0.01"
                  value={kwhPrice}
                  onChange={(e) => setKwhPrice(Number(e.target.value))}
                  className="w-full bg-[#0d0f15] text-white p-2.5 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Potência Máquina (Watts):</label>
                <input
                  type="number"
                  value={printerWattage}
                  onChange={(e) => setPrinterWattage(Number(e.target.value))}
                  className="w-full bg-[#0d0f15] text-white p-2.5 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Margem de Lucro Desejada (%):</label>
              <input
                type="number"
                value={desiredProfitMargin}
                onChange={(e) => setDesiredProfitMargin(Number(e.target.value))}
                className="w-full bg-[#0d0f15] text-white p-2.5 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141720] to-[#0e1118] border border-[#ff5500]/30 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#202534] pb-2">
            <DollarSign className="w-4 h-4 text-[#00e575]" />
            <span>Resultado da Ficha de Custo</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d0f15] border border-[#202534] text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-[#ff5500]" />
                Custo do Filamento:
              </span>
              <strong className="text-white text-sm">R$ {filamentCost.toFixed(2)}</strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d0f15] border border-[#202534] text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Custo de Energia Elétrica:
              </span>
              <strong className="text-white text-sm">R$ {energyCost.toFixed(2)}</strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d0f15] border border-[#202534] text-xs">
              <span className="text-neutral-400">Custo Total de Produção (com perda 10%):</span>
              <strong className="text-neutral-200 text-sm">R$ {costWithWaste.toFixed(2)}</strong>
            </div>

            {/* Suggested Sale Price Highlight */}
            <div className="p-4 rounded-2xl bg-[#003822]/40 border border-[#00e575]/40 text-center space-y-1">
              <span className="text-[11px] font-bold text-[#00e575] uppercase tracking-wider block">
                Preço Sugerido de Venda
              </span>
              <div className="text-3xl font-black text-white">
                R$ {suggestedSalePrice.toFixed(2)}
              </div>
              <span className="text-xs text-[#00e575] font-semibold flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Lucro Líquido: R$ {netProfit.toFixed(2)} por unidade
              </span>
            </div>

            <div className="text-[11px] text-neutral-400 p-3 rounded-xl bg-[#0d0f15] border border-[#202534] leading-relaxed">
              💡 <strong>Dica VIP:</strong> No Mercado Livre e Shopee, adicione 16% de taxa de comissão da plataforma para manter sua margem líquida intacta.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
