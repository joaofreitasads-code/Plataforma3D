import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#141720] via-[#12151e] to-[#181b24] border border-[#222736] p-6 sm:p-8 overflow-hidden shadow-xl">
      {/* Background glow */}
      <div className="absolute left-1/3 -top-24 w-96 h-96 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Hero Text */}
        <div className="space-y-3 max-w-2xl text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/40 text-[#ff5500] text-xs font-bold uppercase tracking-wider">
            <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] font-black">
              ✓
            </span>
            <span>ACESSO VITALÍCIO ATIVO</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-sans">
            BEM-VINDO À <span className="text-[#ff5500]">CENTRAL 3D</span>
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm font-normal leading-relaxed">
            Acesse a biblioteca completa de modelos 3D selecionados e testados, organizados por categorias. Encontre seus arquivos favoritos, faça o download direto no Google Drive e descubra novas oportunidades para imprimir e faturar.
          </p>
        </div>

        {/* Right Floating Cards */}
        <div className="shrink-0 flex items-center justify-center lg:justify-end">
          <div className="relative w-72 sm:w-80 h-36 sm:h-40 flex items-center justify-center select-none pointer-events-none">
            {/* Card 1: Left */}
            <div className="absolute left-2 w-28 h-32 rounded-2xl overflow-hidden border border-[#2a2f40] shadow-2xl -rotate-6 transform scale-95 opacity-90 bg-[#0d0f15]">
              <img
                alt="Sonic Vermelho"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/d/1aPKlJEHTwKUyuzBqPi32OfxK6vjg9nPN"
              />
            </div>

            {/* Card 2: Center Highlight */}
            <div className="absolute z-10 w-32 h-36 rounded-2xl overflow-hidden border-2 border-[#ff5500]/60 shadow-[0_12px_32px_rgba(0,0,0,0.8)] transform scale-105 bg-[#0d0f15]">
              <img
                alt="Sonic Azul"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/d/1U2gs8uDv8s-Ue2BJ8AJa23XpLzT5ee7j"
              />
            </div>

            {/* Card 3: Right */}
            <div className="absolute right-2 w-28 h-32 rounded-2xl overflow-hidden border border-[#2a2f40] shadow-2xl rotate-6 transform scale-95 opacity-90 bg-[#0d0f15]">
              <img
                alt="Sub Zero"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/d/1iobUId4HNPpHQKDMtVTksE-VEWGh2ZHy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
