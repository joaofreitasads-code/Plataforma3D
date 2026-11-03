import React, { useState, useEffect } from 'react';
import { formatBRL } from '../data/modelsData';
import { 
  Calculator, 
  TrendingUp, 
  Coins, 
  Zap, 
  AlertCircle, 
  Sparkles, 
  RotateCcw,
  ShoppingBag
} from 'lucide-react';

export interface CalcState {
  g: number;
  kg: number;
  h: number;
  hora: number;
  preco: number;
}

const DEFAULT_CALC: CalcState = {
  g: 250,
  kg: 110,
  h: 14,
  hora: 1.5,
  preco: 149
};

const PRESETS = [
  {
    nome: 'Boneco Colecionável (Padrão)',
    g: 250,
    kg: 110,
    h: 14,
    hora: 1.5,
    preco: 149
  },
  {
    nome: 'Chaveiro de Time / Geek',
    g: 18,
    kg: 110,
    h: 0.8,
    hora: 1.5,
    preco: 18
  },
  {
    nome: 'Caneca Gamer 3D',
    g: 190,
    kg: 110,
    h: 10,
    hora: 1.5,
    preco: 95
  },
  {
    nome: 'Pokébola Articulada',
    g: 130,
    kg: 110,
    h: 7.5,
    hora: 1.5,
    preco: 79
  },
  {
    nome: 'Luminária Decorativa',
    g: 320,
    kg: 110,
    h: 18,
    hora: 1.5,
    preco: 189
  }
];

export const ProfitCalculator: React.FC = () => {
  const [calc, setCalc] = useState<CalcState>(() => {
    try {
      const saved = localStorage.getItem('c3d_calc');
      return saved ? { ...DEFAULT_CALC, ...JSON.parse(saved) } : DEFAULT_CALC;
    } catch {
      return DEFAULT_CALC;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('c3d_calc', JSON.stringify(calc));
    } catch {
      // storage unavailable
    }
  }, [calc]);

  const handleChange = (key: keyof CalcState, value: number) => {
    setCalc((prev) => ({
      ...prev,
      [key]: Math.max(0, isNaN(value) ? 0 : value)
    }));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setCalc({
      g: preset.g,
      kg: preset.kg,
      h: preset.h,
      hora: preset.hora,
      preco: preset.preco
    });
  };

  // Calculations
  const custoMaterial = (calc.g * calc.kg) / 1000;
  const custoMaquina = calc.h * calc.hora;
  const custoTotal = custoMaterial + custoMaquina;
  const precoMinimoSugerido = custoTotal * 3;
  const lucroLiquido = calc.preco - custoTotal;
  const margem = calc.preco > 0 ? (lucroLiquido / calc.preco) * 100 : 0;
  const lucroPorHora = calc.h > 0 ? lucroLiquido / calc.h : 0;

  // Marketplace fee estimate (~18% avg Shopee/Mercado Livre)
  const taxaMarketplace = calc.preco * 0.18;
  const lucroMarketplace = lucroLiquido - taxaMarketplace;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff6a1f] mb-1">
          <Calculator className="w-4 h-4" />
          Ferramenta de Precificação
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
          Calculadora de Lucro para Impressão 3D
        </h1>
        <p className="text-sm text-[#9aa1ac] mt-1 max-w-2xl">
          Descubra com precisão o custo de filamento, energia e depreciação da impressora para precificar com segurança e lucrar de verdade.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#9aa1ac]">
          Modelos Predefinidos Rápidos:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1b1f25] hover:bg-[#222730] border border-[#262b33] text-[#f2f3f5] hover:border-[#ff6a1f]/50 transition-colors"
            >
              {p.nome}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCalc(DEFAULT_CALC)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#15181d] text-[#9aa1ac] hover:text-white border border-[#262b33] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Redefinir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-[#15181d] border border-[#262b33] rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-display font-bold text-base uppercase tracking-wider text-white flex items-center gap-2 border-b border-[#262b33] pb-3">
            <Coins className="w-4 h-4 text-[#ff6a1f]" />
            Parâmetros da Impressão
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-[#c9ced6] flex items-center justify-between">
                Filamento Usado (g)
                <span className="text-[11px] font-normal text-[#9aa1ac]">peso no fatiador</span>
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={calc.g}
                onChange={(e) => handleChange('g', parseFloat(e.target.value))}
                className="bg-[#0c0e11] border border-[#262b33] focus:border-[#ff6a1f] rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none transition-colors"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-[#c9ced6] flex items-center justify-between">
                Preço do Carretel (R$/kg)
                <span className="text-[11px] font-normal text-[#9aa1ac]">ex: PLA R$ 110</span>
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={calc.kg}
                onChange={(e) => handleChange('kg', parseFloat(e.target.value))}
                className="bg-[#0c0e11] border border-[#262b33] focus:border-[#ff6a1f] rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none transition-colors"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-[#c9ced6] flex items-center justify-between">
                Tempo de Impressão (horas)
                <span className="text-[11px] font-normal text-[#9aa1ac]">tempo fatiado</span>
              </span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={calc.h}
                onChange={(e) => handleChange('h', parseFloat(e.target.value))}
                className="bg-[#0c0e11] border border-[#262b33] focus:border-[#ff6a1f] rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none transition-colors"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-[#c9ced6] flex items-center justify-between">
                Custo de Máquina (R$/hora)
                <span className="text-[11px] font-normal text-[#9aa1ac]">energia + desgaste</span>
              </span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={calc.hora}
                onChange={(e) => handleChange('hora', parseFloat(e.target.value))}
                className="bg-[#0c0e11] border border-[#262b33] focus:border-[#ff6a1f] rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none transition-colors"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 pt-2 border-t border-[#262b33]">
            <span className="text-xs font-bold text-[#ff6a1f] uppercase tracking-wider flex items-center justify-between">
              Preço de Venda Praticado (R$)
              <span className="text-[11px] font-normal text-[#9aa1ac]">valor cobrado do cliente</span>
            </span>
            <input
              type="number"
              min="0"
              step="1"
              value={calc.preco}
              onChange={(e) => handleChange('preco', parseFloat(e.target.value))}
              className="bg-[#0c0e11] border border-[#ff6a1f]/60 focus:border-[#ff6a1f] rounded-xl px-4 py-3 text-white font-mono text-lg font-bold outline-none transition-colors"
            />
          </label>

          <div className="bg-[#1b1f25]/70 border border-[#262b33] rounded-xl p-3.5 text-xs text-[#9aa1ac] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#ff6a1f] flex-shrink-0 mt-0.5" />
            <p>
              Dica: O fatiador (Bambu Studio, OrcaSlicer, Cura) exibe o peso exato e o tempo estimado de impressão. O valor médio de custo/hora para impressoras residenciais fica entre R$ 1,20 e R$ 2,00/hora.
            </p>
          </div>
        </div>

        {/* Results Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#15181d] border border-[#262b33] rounded-2xl p-6 flex flex-col gap-5 sticky top-24">
          <h2 className="font-display font-bold text-base uppercase tracking-wider text-white flex items-center justify-between border-b border-[#262b33] pb-3">
            <span>Demonstrativo Financeiro</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#262b33] text-[#c9ced6]">
              Por Peça
            </span>
          </h2>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#262b33]/60">
              <span className="text-[#9aa1ac]">Custo do Filamento</span>
              <b className="font-mono text-white">{formatBRL(custoMaterial)}</b>
            </div>

            <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#262b33]/60">
              <span className="text-[#9aa1ac]">Energia & Desgaste</span>
              <b className="font-mono text-white">{formatBRL(custoMaquina)}</b>
            </div>

            <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#262b33]/60">
              <span className="font-bold text-[#c9ced6]">Custo Total de Produção</span>
              <b className="font-mono font-bold text-white">{formatBRL(custoTotal)}</b>
            </div>

            <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#262b33]/60">
              <span className="text-xs font-semibold text-[#ff6a1f] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Preço Mínimo Sugerido (3×)
              </span>
              <b className="font-mono font-bold text-[#ff6a1f]">{formatBRL(precoMinimoSugerido)}</b>
            </div>
          </div>

          {/* Lucro Destaque */}
          <div className="bg-[#0c0e11] border border-[#262b33] rounded-2xl p-4 flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9aa1ac]">
              Lucro Líquido Direto
            </span>
            <div
              className={`font-display text-3xl font-extrabold font-mono ${
                lucroLiquido >= 0 ? 'text-[#2fbf8f]' : 'text-[#e5132b]'
              }`}
            >
              {formatBRL(lucroLiquido)}
            </div>
            <div className="text-xs font-semibold text-[#9aa1ac] flex items-center gap-2 pt-1 border-t border-[#262b33]">
              <span>Margem: <b className="text-white">{margem.toFixed(1)}%</b></span>
              <span>·</span>
              <span><b className="text-white">{formatBRL(lucroPorHora)}</b>/hora</span>
            </div>
          </div>

          {/* Marketplace Simulation */}
          <div className="bg-[#1b1f25] border border-[#262b33] rounded-xl p-3.5 flex flex-col gap-2">
            <span className="text-xs font-bold text-[#c9ced6] flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#ff6a1f]" />
              Se vender no Mercado Livre / Shopee (~18% taxa):
            </span>
            <div className="flex justify-between text-xs text-[#9aa1ac]">
              <span>Taxa estimada:</span>
              <span className="font-mono text-white">{formatBRL(taxaMarketplace)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#c9ced6]">Lucro líquido nos marketplaces:</span>
              <span className={`font-mono ${lucroMarketplace >= 0 ? 'text-[#2fbf8f]' : 'text-[#e5132b]'}`}>
                {formatBRL(lucroMarketplace)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
