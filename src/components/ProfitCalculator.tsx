import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { LUCRATIVE_PRODUCTS, LucrativeProduct } from '../data/modelsData';

interface ProfitCalculatorProps {
  onSelectProduct?: (title: string) => void;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ onSelectProduct }) => {
  // Calculator state
  const [spoolPrice, setSpoolPrice] = useState<number>(90); // R$ per 1000g spool
  const [modelWeight, setModelWeight] = useState<number>(120); // grams
  const [printHours, setPrintHours] = useState<number>(5.5); // hours
  const [energyCostPerHour, setEnergyCostPerHour] = useState<number>(0.45); // R$/h
  const [salePrice, setSalePrice] = useState<number>(89); // R$
  const [failureMarginPercent, setFailureMarginPercent] = useState<number>(5); // 5%

  // Calculations
  const filamentCost = (spoolPrice / 1000) * modelWeight;
  const energyCost = printHours * energyCostPerHour;
  const subtotalCost = filamentCost + energyCost;
  const totalCost = subtotalCost * (1 + failureMarginPercent / 100);
  const netProfit = salePrice - totalCost;
  const profitMarginPercent = salePrice > 0 ? (netProfit / salePrice) * 100 : 0;

  const handleApplyPreset = (prod: LucrativeProduct) => {
    setModelWeight(prod.filamentGrams);
    setSalePrice(prod.salePrice);
    setPrintHours(prod.printHours);
    if (onSelectProduct) onSelectProduct(prod.title);
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Header (Black & White) */}
      <div className="border-b border-[#262626] pb-6 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-bold">
          PRECIFICAÇÃO & MARGEM
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
          CALCULADORA DE CUSTO & LUCRO 3D
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
          Calcule o custo exato em filamento, energia elétrica e margem de perda para precificar suas impressões com lucro saudável.
        </p>
      </div>

      {/* Interactive Calculator Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#282828] rounded-xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Calculator className="w-4 h-4 text-white" />
              Parâmetros da Peça
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">Cálculo Automático</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-bold block">
                Preço do Carretel (R$ / 1kg)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">R$</span>
                <input
                  type="number"
                  value={spoolPrice}
                  onChange={(e) => setSpoolPrice(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#303030] focus:border-white text-white text-sm pl-9 pr-3 py-2 rounded-lg outline-none font-mono transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-bold block">
                Peso do Modelo (gramas)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={modelWeight}
                  onChange={(e) => setModelWeight(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#303030] focus:border-white text-white text-sm px-3 py-2 rounded-lg outline-none font-mono transition"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-mono">g</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-bold block">
                Tempo de Impressão (horas)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={printHours}
                  onChange={(e) => setPrintHours(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#303030] focus:border-white text-white text-sm px-3 py-2 rounded-lg outline-none font-mono transition"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-mono">h</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-bold block">
                Preço de Venda Praticado (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">R$</span>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#303030] focus:border-white text-white text-sm pl-9 pr-3 py-2 rounded-lg outline-none font-mono transition font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Results Card */}
        <div className="lg:col-span-5 bg-[#13151a] border border-[#262933] rounded-2xl p-6 space-y-5 shadow-lg">
          <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-[#262933] pb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff6600]" />
            Margem & Lucro Líquido
          </h3>

          <div className="p-4 rounded-xl bg-[#0d0e12] border border-[#262933] space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 block font-bold">LUCRO LÍQUIDO ESTIMADO</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#ff6600]">
                R$ {netProfit.toFixed(2)}
              </span>
              <span className="text-xs font-mono font-extrabold text-white">
                ({profitMarginPercent.toFixed(1)}% de margem)
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>Custo do Filamento:</span>
              <span className="text-white font-bold">R$ {filamentCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Custo de Energia:</span>
              <span className="text-white font-bold">R$ {energyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Margem de Perda ({failureMarginPercent}%):</span>
              <span className="text-white font-bold">R$ {(totalCost - subtotalCost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white border-t border-[#262933] pt-2 font-bold">
              <span>Custo Total de Produção:</span>
              <span className="text-white font-black">R$ {totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Presets */}
      <div className="space-y-4 pt-4 border-t border-[#262933]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
            Modelos de Alta Margem (Predefinições)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LUCRATIVE_PRODUCTS.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className="p-3.5 rounded-2xl border border-[#262933] bg-[#13151a] hover:border-[#ff6600] hover:bg-[#181a20] transition-all cursor-pointer text-left space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
                <span className="text-neutral-400">{p.category}</span>
                <span className="text-[#ff6600] font-black">{p.marginPercent.toFixed(0)}% margem</span>
              </div>
              <h4 className="text-xs font-extrabold text-white truncate">{p.title}</h4>
              <div className="flex justify-between items-center text-xs font-mono text-neutral-400 pt-2 border-t border-[#262933]">
                <span>{p.filamentGrams}g</span>
                <span className="text-white font-black">R$ {p.salePrice.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
