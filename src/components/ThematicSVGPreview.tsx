import React from 'react';

interface ThematicSVGPreviewProps {
  sectionId: string;
  title: string;
  colorTheme?: string;
  isHot?: boolean;
}

export const ThematicSVGPreview: React.FC<ThematicSVGPreviewProps> = ({
  sectionId,
  title,
  colorTheme = "#ff5500",
  isHot
}) => {
  const accentColor = colorTheme && colorTheme.startsWith('#') ? colorTheme : "#ff5500";
  // Generate distinct iconic motif based on session and title
  const renderIconGraphic = () => {
    switch (sectionId) {
      case 'sec-canecas':
      case 'sec-canecas-gamer':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]" fill="none">
            <rect x="24" y="20" width="44" height="62" rx="7" fill="#131620" stroke={accentColor} strokeWidth="3" />
            <ellipse cx="46" cy="20" rx="22" ry="6.5" fill="#1f2433" stroke={accentColor} strokeWidth="2.5" />
            <path d="M68 30 C86 30 86 70 68 70" stroke={accentColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M36 40 L56 40 L54 58 C52 64 46 68 46 68 C46 68 40 64 38 58 Z" fill={accentColor} opacity="0.9" />
            <circle cx="46" cy="51" r="4.5" fill="#0d0f14" />
          </svg>
        );

      case 'sec-dragonball':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(255,85,0,0.45)]" fill="none">
            <circle cx="50" cy="50" r="36" fill="#ff5500" stroke="#fdba74" strokeWidth="2.5" />
            <circle cx="40" cy="36" r="10" fill="#fed7aa" opacity="0.45" />
            <polygon points="50,35 53,43 61,43 55,48 57,56 50,51 43,56 45,48 39,43 47,43" fill="#dc2626" />
            <polygon points="34,54 36,59 41,59 37,62 38,67 34,64 30,67 31,62 27,59 32,59" fill="#dc2626" />
            <polygon points="66,54 68,59 73,59 69,62 70,67 66,64 62,67 63,62 59,59 64,59" fill="#dc2626" />
          </svg>
        );

      case 'sec-monster': {
        const upTitle = title.toUpperCase();
        const isOrganizer = upTitle.includes('ORGANIZADOR') || upTitle.includes('PNEU');
        const isCanHolder = upTitle.includes('CAN HOLDER') || upTitle.includes('STEIN');
        const isMangoLoco = upTitle.includes('MANGO LOCO');
        const isPipeline = upTitle.includes('PIPELINE');
        const isPacific = upTitle.includes('PACIFIC');
        const isUltraWhite = upTitle.includes('ULTRA WHITE') || upTitle.includes('ZERO');
        const isKhaotic = upTitle.includes('KHAOTIC');
        const isParadise = upTitle.includes('PARADISE');
        const isWatermelon = upTitle.includes('WATERMELON');
        const isFiesta = upTitle.includes('FIESTA');
        const isViolet = upTitle.includes('VIOLET');
        const isAssault = upTitle.includes('ASSAULT');
        const isVR46 = upTitle.includes('VR46') || upTitle.includes('DOCTOR');
        const isAussie = upTitle.includes('AUSSIE');
        const isRipper = upTitle.includes('RIPPER');

        if (isOrganizer) {
          return (
            <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]" fill="none">
              <ellipse cx="50" cy="74" rx="42" ry="18" fill="#0B0B0D" stroke="#272A33" strokeWidth="2.5" />
              <path d="M12 50 C12 72 88 72 88 50 L88 30 C88 52 12 52 12 30 Z" fill="#131418" stroke="#1F2127" strokeWidth="2" />
              <path d="M18 36 L18 48 M28 41 L28 53 M40 44 L40 56 M50 45 L50 57 M60 44 L60 56 M72 41 L72 53 M82 36 L82 48" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="50" cy="28" rx="38" ry="15" fill="#181A20" stroke="#22C55E" strokeWidth="3" />
              <ellipse cx="50" cy="25" rx="34" ry="13" fill="#EC4899" opacity="0.9" />
              <ellipse cx="50" cy="22" rx="30" ry="11" fill="#FB923C" opacity="0.9" />
              <ellipse cx="50" cy="19" rx="26" ry="9" fill="#0B0B0D" stroke="#22C55E" strokeWidth="2" />
              <path d="M44 20 L43 16 M49 21 L50 15 M56 20 L56 16" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
              <text x="50" y="86" fill="#22C55E" fontSize="5.5" fontWeight="900" textAnchor="middle" letterSpacing="1">MONSTER STAND</text>
            </svg>
          );
        }

        if (isCanHolder) {
          return (
            <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]" fill="none">
              <rect x="25" y="18" width="46" height="66" rx="8" fill="#131418" stroke={accentColor} strokeWidth="3" />
              <ellipse cx="48" cy="18" rx="23" ry="7" fill="#1F2127" stroke={accentColor} strokeWidth="2" />
              <ellipse cx="48" cy="18" rx="18" ry="5" fill="#334155" />
              <path d="M71 28 C90 28 90 72 71 72 L71 63 C80 63 80 37 71 37 Z" fill="#1C1F26" stroke={accentColor} strokeWidth="2.5" />
              <path d="M37 32 C35 45 38 58 37 68" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" />
              <path d="M48 27 C47 45 49 59 48 72" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M59 34 C58 45 61 56 60 66" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" />
              <rect x="25" y="78" width="46" height="6" rx="2" fill="#1C1F26" stroke={accentColor} strokeWidth="1.5" />
              <line x1="28" y1="72" x2="68" y2="72" stroke="#272A33" strokeWidth="2" />
            </svg>
          );
        }

        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]" fill="none">
            <circle cx="50" cy="50" r="45" fill="#0C0D12" stroke="#1F2127" strokeWidth="3" />
            <circle cx="50" cy="50" r="41" stroke={accentColor} strokeWidth="2" strokeDasharray={isMangoLoco || isPacific ? "4 2" : "3 1.5"} opacity="0.85" />
            <circle cx="50" cy="50" r="36" fill="#12131A" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="50" cy="50" r="33" fill="#0B0B0D" />
            {isMangoLoco && (
              <g opacity="0.35">
                <circle cx="36" cy="38" r="6" stroke="#2DD4BF" strokeWidth="1.5" />
                <circle cx="64" cy="38" r="6" stroke="#2DD4BF" strokeWidth="1.5" />
                <path d="M42 62 Q50 68 58 62" stroke="#FB923C" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="28" stroke="#FB923C" strokeWidth="1" strokeDasharray="3 3" />
              </g>
            )}
            {isPipeline && (
              <g opacity="0.35">
                <circle cx="50" cy="50" r="28" stroke="#EC4899" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M26 50 Q36 40 50 50 Q64 60 74 50" stroke="#F43F5E" strokeWidth="1.5" fill="none" />
              </g>
            )}
            {isPacific && (
              <g opacity="0.35">
                <circle cx="50" cy="50" r="27" stroke="#EF4444" strokeWidth="1.5" />
                <line x1="50" y1="20" x2="50" y2="80" stroke="#EF4444" strokeWidth="1" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="#EF4444" strokeWidth="1" />
              </g>
            )}
            {isUltraWhite && (
              <g opacity="0.3">
                <polygon points="50,22 68,34 68,66 50,78 32,66 32,34" stroke="#F8FAFC" strokeWidth="1.5" fill="none" />
              </g>
            )}
            {isKhaotic && (
              <g opacity="0.35">
                <path d="M30 35 C20 45 30 65 50 52 C70 65 80 45 70 35 C60 25 50 40 50 40 C50 40 40 25 30 35 Z" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
              </g>
            )}
            {isParadise && (
              <g opacity="0.35">
                <path d="M30 65 Q50 30 70 65 M50 35 L50 70" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
            {isWatermelon && (
              <g opacity="0.4">
                <circle cx="50" cy="50" r="31" stroke="#22C55E" strokeWidth="2.5" />
              </g>
            )}
            {isFiesta && (
              <g opacity="0.35">
                <circle cx="50" cy="50" r="26" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>
            )}
            {isViolet && (
              <g opacity="0.35">
                <circle cx="50" cy="50" r="28" stroke="#C084FC" strokeWidth="1" />
              </g>
            )}
            {isAssault && (
              <g opacity="0.3">
                <rect x="28" y="30" width="8" height="8" fill="#EA580C" />
                <rect x="64" y="34" width="8" height="8" fill="#EA580C" />
              </g>
            )}
            {isVR46 && (
              <g opacity="0.45">
                <text x="50" y="34" fill="#FACC15" fontSize="14" fontWeight="900" fontStyle="italic" textAnchor="middle">46</text>
              </g>
            )}
            {isAussie && (
              <g opacity="0.4">
                <path d="M26 44 C34 38 42 50 50 44 C58 38 66 50 74 44" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
              </g>
            )}
            {isRipper && (
              <g opacity="0.35">
                <line x1="50" y1="20" x2="50" y2="80" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="4 2" />
              </g>
            )}
            <path d="M34 26 C32 38 37 54 33 72 C35 62 38 46 36 30 Z" fill={accentColor} />
            <path d="M48 20 C46 38 52 56 48 78 C51 64 54 44 51 24 Z" fill={accentColor} />
            <path d="M62 28 C60 40 65 52 61 70 C63 60 66 46 64 32 Z" fill={accentColor} />
            <path d="M35 32 L34 66" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
            <path d="M49 26 L49 72" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            <path d="M63 34 L62 64" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
          </svg>
        );
      }

      case 'sec-lego':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <circle cx="50" cy="22" r="14" fill={accentColor} />
            <rect x="42" y="36" width="16" height="6" rx="2" fill={accentColor} opacity="0.9" />
            <path d="M30 44 L70 44 L66 74 L34 74 Z" fill={accentColor} />
            <rect x="34" y="74" width="14" height="20" rx="3" fill="#0B0B0D" stroke={accentColor} strokeWidth="3" />
            <rect x="52" y="74" width="14" height="20" rx="3" fill="#0B0B0D" stroke={accentColor} strokeWidth="3" />
            <rect x="45" y="5" width="10" height="5" rx="1.5" fill={accentColor} />
            <circle cx="45" cy="22" r="2.2" fill="#0B0B0D" />
            <circle cx="55" cy="22" r="2.2" fill="#0B0B0D" />
            <path d="M46 27 Q50 31 54 27" stroke="#0B0B0D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'sec-pokemon':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <circle cx="50" cy="50" r="38" stroke="#1F2127" strokeWidth="4" fill="#0E1015" />
            <path d="M12 50 A38 38 0 0 1 88 50 Z" fill="#EF4444" />
            <path d="M12 50 A38 38 0 0 0 88 50 Z" fill="#F8FAFC" />
            <line x1="12" y1="50" x2="88" y2="50" stroke="#0B0B0D" strokeWidth="7" />
            <circle cx="50" cy="50" r="14" fill="#0B0B0D" />
            <circle cx="50" cy="50" r="9" fill="#FFFFFF" stroke="#0B0B0D" strokeWidth="3" />
            <circle cx="50" cy="50" r="4" fill={accentColor} />
          </svg>
        );

      case 'sec-veiculos':
      case 'sec-carros':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <path d="M12 60 L24 44 Q36 34 52 34 L68 36 L86 52 L92 60 L88 68 L14 68 Z" fill="#141416" stroke={accentColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M30 46 L48 38 L65 40 L76 52 Z" fill="#1C1E24" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="28" cy="68" r="9" fill="#0C0D10" stroke={accentColor} strokeWidth="3" />
            <circle cx="28" cy="68" r="4" fill={accentColor} />
            <circle cx="76" cy="68" r="9" fill="#0C0D10" stroke={accentColor} strokeWidth="3" />
            <circle cx="76" cy="68" r="4" fill={accentColor} />
          </svg>
        );

      case 'sec-funkos':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <rect x="22" y="16" width="56" height="44" rx="14" fill={accentColor} />
            <rect x="36" y="58" width="28" height="26" rx="6" fill="#16171D" stroke={accentColor} strokeWidth="2" />
            <rect x="38" y="82" width="10" height="12" rx="3" fill={accentColor} />
            <rect x="52" y="82" width="10" height="12" rx="3" fill={accentColor} />
            <circle cx="38" cy="38" r="7.5" fill="#0B0B0D" />
            <circle cx="62" cy="38" r="7.5" fill="#0B0B0D" />
            <circle cx="36" cy="36" r="2.2" fill="#FFFFFF" />
            <circle cx="60" cy="36" r="2.2" fill="#FFFFFF" />
            <circle cx="50" cy="48" r="2" fill="#0B0B0D" />
          </svg>
        );

      case 'sec-dc':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <ellipse cx="50" cy="50" rx="42" ry="28" fill="#111216" stroke={accentColor} strokeWidth="2.5" />
            <path d="M50 35 L55 42 L65 37 L78 47 C72 58 60 62 50 67 C40 62 28 58 22 47 L35 37 L45 42 Z" fill={accentColor} />
          </svg>
        );

      case 'sec-marvel':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <circle cx="50" cy="50" r="38" stroke="#EF4444" strokeWidth="6" fill="#0E1015" />
            <circle cx="50" cy="50" r="28" stroke="#E2E8F0" strokeWidth="5" />
            <circle cx="50" cy="50" r="19" stroke="#EF4444" strokeWidth="5" />
            <circle cx="50" cy="50" r="11" fill="#3B82F6" />
            <path d="M50 41 L53 48 L60 48 L55 53 L57 60 L50 56 L43 60 L45 53 L40 48 L47 48 Z" fill="#FFFFFF" />
          </svg>
        );

      case 'sec-anime':
      case 'sec-animes-vip':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <circle cx="50" cy="50" r="34" stroke={accentColor} strokeWidth="2" strokeDasharray="4 2" fill="#121318" />
            <circle cx="50" cy="50" r="14" fill={accentColor} opacity="0.3" />
            <path d="M25 75 L75 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M72 22 L78 28" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M75 75 L25 25" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M22 22 L28 28" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 'sec-games':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <path d="M50 16 L84 34 L50 52 L16 34 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <path d="M16 34 L50 52 L50 86 L16 68 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <path d="M84 34 L50 52 L50 86 L84 68 Z" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          </svg>
        );

      case 'sec-chaveiros':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <circle cx="50" cy="28" r="16" stroke={accentColor} strokeWidth="4" />
            <rect x="47" y="44" width="6" height="8" rx="2" fill={accentColor} />
            <path d="M34 52 L66 52 L74 82 L50 90 L26 82 Z" fill="#1C1F26" stroke={accentColor} strokeWidth="2.5" />
            <polygon points="50,60 53,67 61,67 55,71 57,78 50,74 43,78 45,71 39,67 47,67" fill="#F8FAFC" />
          </svg>
        );

      case 'sec-mascotes':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <path d="M30 20 L70 20 L66 48 C64 62 50 72 50 72 C50 72 36 62 34 48 Z" fill="#1C1F26" stroke={accentColor} strokeWidth="2.5" />
            <path d="M30 24 C22 24 16 32 20 44 C23 52 32 54 34 54" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M70 24 C78 24 84 32 80 44 C77 52 68 54 66 54" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M44 72 L42 84 L58 84 L56 72" fill="#2A2E39" stroke={accentColor} strokeWidth="2" />
            <rect x="36" y="84" width="28" height="6" rx="2" fill="#F8FAFC" />
            <polygon points="50,30 53,38 61,38 55,43 57,51 50,46 43,51 45,43 39,38 47,38" fill={accentColor} />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            <polygon points="50,14 84,32 84,68 50,86 16,68 16,32" fill="#141720" stroke={accentColor} strokeWidth="3" />
            <path d="M50 14 L50 50 L84 32 M50 50 L16 32 M50 50 L50 86" stroke={accentColor} strokeWidth="2" opacity="0.85" />
            <circle cx="50" cy="50" r="6" fill={accentColor} />
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full relative z-10 flex items-center justify-center overflow-hidden bg-black/45 backdrop-blur-[2px]">
      {/* 3D Wireframe Grid Floor Effect in Members Area Orange */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 85, 0, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 85, 0, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)'
        }}
      />

      {/* Radial soft spotlight behind graphic */}
      <div
        className="absolute w-32 h-32 rounded-full blur-2xl opacity-25 pointer-events-none transition-transform duration-500 group-hover:scale-125"
        style={{ backgroundColor: accentColor }}
      />

      {/* Graphic representation */}
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
        {renderIconGraphic()}
      </div>

      {/* STL 3D badge watermark */}
      <div className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold uppercase text-[#ff5500] bg-black/75 px-2 py-0.5 rounded border border-[#ff5500]/30">
        {isHot ? 'VIP STL' : '3D PRONTO'}
      </div>
    </div>
  );
};
