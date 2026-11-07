import React, { useState } from 'react';
import { Settings, Check, HardDrive, Printer, Sliders } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [printerModel, setPrinterModel] = useState('Bambu Lab P1S / X1-Carbon');
  const [slicer, setSlicer] = useState('Bambu Studio / Orca Slicer');
  const [nozzle, setNozzle] = useState('0.4 mm');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#ff5500]" />
          <h2 className="text-xl sm:text-2xl font-black text-white">Configurações &amp; Preferências</h2>
        </div>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Personalize seu perfil de impressão para fatiamento automático e preferências da biblioteca.
        </p>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-[#141720] border border-[#202534] space-y-5">
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-2 mb-1.5">
              <Printer className="w-4 h-4 text-[#ff5500]" />
              <span>Sua Impressora 3D Principal</span>
            </label>
            <select
              value={printerModel}
              onChange={(e) => setPrinterModel(e.target.value)}
              className="w-full bg-[#0d0f15] text-white p-3 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
            >
              <option value="Bambu Lab P1S / X1-Carbon">Bambu Lab P1S / X1-Carbon (com AMS)</option>
              <option value="Bambu Lab A1 / A1 Mini">Bambu Lab A1 / A1 Mini</option>
              <option value="Creality K1 / K1 Max">Creality K1 / K1 Max / K1C</option>
              <option value="Creality Ender 3 / V3 SE / KE">Creality Ender 3 / V3 SE / KE</option>
              <option value="Prusa MK3S+ / MK4 / XL">Prusa MK3S+ / MK4 / XL</option>
              <option value="Anycubic Kobra 2 / 3">Anycubic Kobra 2 / 3 (Color Engine)</option>
              <option value="Outra Impressora FDM">Outra Impressora FDM</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-white flex items-center gap-2 mb-1.5">
              <Sliders className="w-4 h-4 text-[#ff5500]" />
              <span>Fatiador (Slicer) Preferido</span>
            </label>
            <select
              value={slicer}
              onChange={(e) => setSlicer(e.target.value)}
              className="w-full bg-[#0d0f15] text-white p-3 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
            >
              <option value="Bambu Studio / Orca Slicer">Bambu Studio / Orca Slicer (.3mf)</option>
              <option value="PrusaSlicer">PrusaSlicer (.3mf / .stl)</option>
              <option value="UltiMaker Cura">UltiMaker Cura (.stl)</option>
              <option value="Creality Print">Creality Print</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-white flex items-center gap-2 mb-1.5">
              <HardDrive className="w-4 h-4 text-[#ff5500]" />
              <span>Bocal (Nozzle) em Uso</span>
            </label>
            <select
              value={nozzle}
              onChange={(e) => setNozzle(e.target.value)}
              className="w-full bg-[#0d0f15] text-white p-3 rounded-xl border border-[#262c3e] outline-none focus:border-[#ff5500]"
            >
              <option value="0.4 mm">0.4 mm (Recomendado para Canecas e Figuras)</option>
              <option value="0.2 mm">0.2 mm (Ultra Detalhes)</option>
              <option value="0.6 mm">0.6 mm (Rápido para utilitários)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#ff5500]/25"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Preferências Salvas com Sucesso!</span>
              </>
            ) : (
              <span>Salvar Preferências</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
