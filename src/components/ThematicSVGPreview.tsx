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
  colorTheme = "#FACC15",
  isHot
}) => {
  // Generate distinct iconic motif based on session and title
  const renderIconGraphic = () => {
    switch (sectionId) {
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
              {/* Monster Tire Coaster Stand / Organizer Base */}
              <ellipse cx="50" cy="74" rx="42" ry="18" fill="#0B0B0D" stroke="#272A33" strokeWidth="2.5" />
              <path d="M12 50 C12 72 88 72 88 50 L88 30 C88 52 12 52 12 30 Z" fill="#131418" stroke="#1F2127" strokeWidth="2" />
              {/* Deep tire tread blocks */}
              <path d="M18 36 L18 48 M28 41 L28 53 M40 44 L40 56 M50 45 L50 57 M60 44 L60 56 M72 41 L72 53 M82 36 L82 48" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" />
              {/* Slot with visible stacked coasters inside */}
              <ellipse cx="50" cy="28" rx="38" ry="15" fill="#181A20" stroke="#22C55E" strokeWidth="3" />
              <ellipse cx="50" cy="25" rx="34" ry="13" fill="#EC4899" opacity="0.9" />
              <ellipse cx="50" cy="22" rx="30" ry="11" fill="#FB923C" opacity="0.9" />
              <ellipse cx="50" cy="19" rx="26" ry="9" fill="#0B0B0D" stroke="#22C55E" strokeWidth="2" />
              {/* Monster Claw on top coaster */}
              <path d="M44 20 L43 16 M49 21 L50 15 M56 20 L56 16" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
              {/* Text label */}
              <text x="50" y="86" fill="#22C55E" fontSize="5.5" fontWeight="900" textAnchor="middle" letterSpacing="1">MONSTER STAND</text>
            </svg>
          );
        }

        if (isCanHolder) {
          return (
            <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]" fill="none">
              {/* Tactical Stein Mug for 473ml Cans */}
              <rect x="25" y="18" width="46" height="66" rx="8" fill="#131418" stroke={colorTheme} strokeWidth="3" />
              <ellipse cx="48" cy="18" rx="23" ry="7" fill="#1F2127" stroke={colorTheme} strokeWidth="2" />
              <ellipse cx="48" cy="18" rx="18" ry="5" fill="#334155" />
              {/* Heavy duty knurled handle */}
              <path d="M71 28 C90 28 90 72 71 72 L71 63 C80 63 80 37 71 37 Z" fill="#1C1F26" stroke={colorTheme} strokeWidth="2.5" />
              {/* Monster Claw Slash on Body */}
              <path d="M37 32 C35 45 38 58 37 68" stroke={colorTheme} strokeWidth="4.5" strokeLinecap="round" />
              <path d="M48 27 C47 45 49 59 48 72" stroke={colorTheme} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M59 34 C58 45 61 56 60 66" stroke={colorTheme} strokeWidth="4.5" strokeLinecap="round" />
              {/* Grip ribs and base */}
              <rect x="25" y="78" width="46" height="6" rx="2" fill="#1C1F26" stroke={colorTheme} strokeWidth="1.5" />
              <line x1="28" y1="72" x2="68" y2="72" stroke="#272A33" strokeWidth="2" />
            </svg>
          );
        }

        // Distinct custom flavor graphics
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]" fill="none">
            {/* Outer Coaster Bezel */}
            <circle cx="50" cy="50" r="45" fill="#0C0D12" stroke="#1F2127" strokeWidth="3" />
            <circle cx="50" cy="50" r="41" stroke={colorTheme} strokeWidth="2" strokeDasharray={isMangoLoco || isPacific ? "4 2" : "3 1.5"} opacity="0.85" />
            {/* Inner Recessed Drip Ring */}
            <circle cx="50" cy="50" r="36" fill="#12131A" stroke={colorTheme} strokeWidth="1.5" />
            <circle cx="50" cy="50" r="33" fill="#0B0B0D" />

            {/* Flavor-specific background motifs */}
            {isMangoLoco && (
              /* Day of the Dead Sugar Skull Filigree */
              <g opacity="0.35">
                <circle cx="36" cy="38" r="6" stroke="#2DD4BF" strokeWidth="1.5" />
                <circle cx="64" cy="38" r="6" stroke="#2DD4BF" strokeWidth="1.5" />
                <path d="M42 62 Q50 68 58 62" stroke="#FB923C" strokeWidth="2" fill="none" />
                <path d="M50 20 L50 25 M32 28 L36 31 M68 28 L64 31" stroke="#FB923C" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="28" stroke="#FB923C" strokeWidth="1" strokeDasharray="3 3" />
              </g>
            )}

            {isPipeline && (
              /* Hawaiian Hibiscus & Tropical Waves */
              <g opacity="0.35">
                <circle cx="50" cy="50" r="28" stroke="#EC4899" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M26 50 Q36 40 50 50 Q64 60 74 50" stroke="#F43F5E" strokeWidth="1.5" fill="none" />
                <path d="M26 56 Q36 46 50 56 Q64 66 74 56" stroke="#F43F5E" strokeWidth="1" fill="none" />
                <circle cx="28" cy="34" r="3" fill="#EC4899" />
                <circle cx="72" cy="66" r="3" fill="#EC4899" />
              </g>
            )}

            {isPacific && (
              /* Sailor Tattoo Nautical Compass & Anchor */
              <g opacity="0.35">
                <circle cx="50" cy="50" r="27" stroke="#EF4444" strokeWidth="1.5" />
                <line x1="50" y1="20" x2="50" y2="80" stroke="#EF4444" strokeWidth="1" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="#EF4444" strokeWidth="1" />
                <path d="M40 30 L50 22 L60 30" stroke="#EF4444" strokeWidth="1.5" fill="none" />
                <path d="M40 70 L50 78 L60 70" stroke="#EF4444" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {isUltraWhite && (
              /* Frosted Ice Crystalline Geometry */
              <g opacity="0.3">
                <polygon points="50,22 68,34 68,66 50,78 32,66 32,34" stroke="#F8FAFC" strokeWidth="1.5" fill="none" />
                <polygon points="50,28 62,38 62,62 50,72 38,62 38,38" stroke="#94A3B8" strokeWidth="1" fill="none" />
              </g>
            )}

            {isKhaotic && (
              /* Butterfly Wing Linework & Graffiti */
              <g opacity="0.35">
                <path d="M30 35 C20 45 30 65 50 52 C70 65 80 45 70 35 C60 25 50 40 50 40 C50 40 40 25 30 35 Z" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {isParadise && (
              /* Monstera Palm Foliage */
              <g opacity="0.35">
                <path d="M30 65 Q50 30 70 65 M50 35 L50 70" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M40 45 L32 48 M60 45 L68 48 M42 55 L34 60 M58 55 L66 60" stroke="#4ADE80" strokeWidth="1.5" />
              </g>
            )}

            {isWatermelon && (
              /* Watermelon Slice Rind */
              <g opacity="0.4">
                <circle cx="50" cy="50" r="31" stroke="#22C55E" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="27" stroke="#F8FAFC" strokeWidth="1.5" />
                <circle cx="34" cy="40" r="1.5" fill="#000000" />
                <circle cx="66" cy="40" r="1.5" fill="#000000" />
                <circle cx="50" cy="68" r="1.5" fill="#000000" />
              </g>
            )}

            {isFiesta && (
              /* Aztec Sunburst */
              <g opacity="0.35">
                <circle cx="50" cy="50" r="26" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M50 20 L50 24 M50 76 L50 80 M20 50 L24 50 M76 50 L80 50" stroke="#2DD4BF" strokeWidth="2" />
              </g>
            )}

            {isViolet && (
              /* Psychedelic Waves */
              <g opacity="0.35">
                <circle cx="50" cy="50" r="28" stroke="#C084FC" strokeWidth="1" />
                <circle cx="50" cy="50" r="23" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="4 2" />
                <circle cx="50" cy="50" r="18" stroke="#C084FC" strokeWidth="1" />
              </g>
            )}

            {isAssault && (
              /* Digital Camouflage Blocks */
              <g opacity="0.3">
                <rect x="28" y="30" width="8" height="8" fill="#EA580C" />
                <rect x="64" y="34" width="8" height="8" fill="#EA580C" />
                <rect x="36" y="58" width="8" height="8" fill="#EA580C" />
                <rect x="56" y="60" width="8" height="8" fill="#EA580C" />
              </g>
            )}

            {isVR46 && (
              /* The Doctor #46 Racing Number */
              <g opacity="0.45">
                <text x="50" y="34" fill="#FACC15" fontSize="14" fontWeight="900" fontStyle="italic" textAnchor="middle">46</text>
                <circle cx="50" cy="50" r="28" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="4 2" />
              </g>
            )}

            {isAussie && (
              /* Ocean Swell Waves */
              <g opacity="0.4">
                <path d="M26 44 C34 38 42 50 50 44 C58 38 66 50 74 44" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
                <path d="M26 58 C34 52 42 64 50 58 C58 52 66 64 74 58" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {isRipper && (
              /* Tropical Ripper Sun Rays */
              <g opacity="0.35">
                <line x1="50" y1="20" x2="50" y2="80" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="4 2" />
              </g>
            )}

            {/* Standard Carbon Texture if no specific overlay */}
            {!isMangoLoco && !isPipeline && !isPacific && !isUltraWhite && !isKhaotic && !isParadise && !isWatermelon && !isFiesta && !isViolet && !isAssault && !isVR46 && !isAussie && !isRipper && (
              <circle cx="50" cy="50" r="30" stroke="#1E212A" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
            )}

            {/* Core 3D Embossed Monster 3-Claw Mark M */}
            {/* Left Claw */}
            <path
              d="M34 26 C32 38 37 54 33 72 C35 62 38 46 36 30 Z"
              fill={colorTheme}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
            />
            {/* Center Main Claw */}
            <path
              d="M48 20 C46 38 52 56 48 78 C51 64 54 44 51 24 Z"
              fill={colorTheme}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
            />
            {/* Right Claw */}
            <path
              d="M62 28 C60 40 65 52 61 70 C63 60 66 46 64 32 Z"
              fill={colorTheme}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
            />

            {/* Core Neon Highlight Slash */}
            <path d="M35 32 L34 66" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
            <path d="M49 26 L49 72" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            <path d="M63 34 L62 64" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />

            {/* Micro Drip Notch Accents */}
            <circle cx="50" cy="11" r="1.5" fill={colorTheme} />
            <circle cx="50" cy="89" r="1.5" fill={colorTheme} />
            <circle cx="11" cy="50" r="1.5" fill={colorTheme} />
            <circle cx="89" cy="50" r="1.5" fill={colorTheme} />
          </svg>
        );
      }

      case 'sec-lego':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Lego Minifigure Silhouette */}
            <circle cx="50" cy="22" r="14" fill={colorTheme} />
            <rect x="42" y="36" width="16" height="6" rx="2" fill={colorTheme} opacity="0.9" />
            <path d="M30 44 L70 44 L66 74 L34 74 Z" fill={colorTheme} />
            <path d="M30 46 L20 62 L25 65 L33 52 Z" fill={colorTheme} opacity="0.85" />
            <path d="M70 46 L80 62 L75 65 L67 52 Z" fill={colorTheme} opacity="0.85" />
            <rect x="34" y="74" width="14" height="20" rx="3" fill="#0B0B0D" stroke={colorTheme} strokeWidth="3" />
            <rect x="52" y="74" width="14" height="20" rx="3" fill="#0B0B0D" stroke={colorTheme} strokeWidth="3" />
            {/* Stud on head */}
            <rect x="45" y="5" width="10" height="5" rx="1.5" fill={colorTheme} />
            {/* Eye dots */}
            <circle cx="45" cy="22" r="2.2" fill="#0B0B0D" />
            <circle cx="55" cy="22" r="2.2" fill="#0B0B0D" />
            <path d="M46 27 Q50 31 54 27" stroke="#0B0B0D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'sec-pokemon':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Pokéball 3D design */}
            <circle cx="50" cy="50" r="38" stroke="#1F2127" strokeWidth="4" fill="#0E1015" />
            <path d="M12 50 A38 38 0 0 1 88 50 Z" fill="#EF4444" />
            <path d="M12 50 A38 38 0 0 0 88 50 Z" fill="#F8FAFC" />
            <line x1="12" y1="50" x2="88" y2="50" stroke="#0B0B0D" strokeWidth="7" />
            <circle cx="50" cy="50" r="14" fill="#0B0B0D" />
            <circle cx="50" cy="50" r="9" fill="#FFFFFF" stroke="#0B0B0D" strokeWidth="3" />
            <circle cx="50" cy="50" r="4" fill={colorTheme} />
            {/* Glow arc */}
            <path d="M26 26 A32 32 0 0 1 70 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
          </svg>
        );

      case 'sec-veiculos':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Aerodynamic Sports Car Outline */}
            <path d="M12 60 L24 44 Q36 34 52 34 L68 36 L86 52 L92 60 L88 68 L14 68 Z" fill="#141416" stroke={colorTheme} strokeWidth="3" strokeLinejoin="round" />
            <path d="M30 46 L48 38 L65 40 L76 52 Z" fill="#1C1E24" stroke={colorTheme} strokeWidth="1.5" />
            <circle cx="28" cy="68" r="9" fill="#0C0D10" stroke={colorTheme} strokeWidth="3" />
            <circle cx="28" cy="68" r="4" fill={colorTheme} />
            <circle cx="76" cy="68" r="9" fill="#0C0D10" stroke={colorTheme} strokeWidth="3" />
            <circle cx="76" cy="68" r="4" fill={colorTheme} />
          </svg>
        );

      case 'sec-funkos':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Big Head Funko silhouette */}
            <rect x="22" y="16" width="56" height="44" rx="14" fill={colorTheme} />
            <rect x="36" y="58" width="28" height="26" rx="6" fill="#16171D" stroke={colorTheme} strokeWidth="2" />
            <rect x="38" y="82" width="10" height="12" rx="3" fill={colorTheme} />
            <rect x="52" y="82" width="10" height="12" rx="3" fill={colorTheme} />
            {/* Giant black circular eyes */}
            <circle cx="38" cy="38" r="7.5" fill="#0B0B0D" />
            <circle cx="62" cy="38" r="7.5" fill="#0B0B0D" />
            {/* Eye glint */}
            <circle cx="36" cy="36" r="2.2" fill="#FFFFFF" />
            <circle cx="60" cy="36" r="2.2" fill="#FFFFFF" />
            <circle cx="50" cy="48" r="2" fill="#0B0B0D" />
          </svg>
        );

      case 'sec-dc':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Batman / DC emblem */}
            <ellipse cx="50" cy="50" rx="42" ry="28" fill="#111216" stroke={colorTheme} strokeWidth="2.5" />
            <path
              d="M50 35 L55 42 L65 37 L78 47 C72 58 60 62 50 67 C40 62 28 58 22 47 L35 37 L45 42 Z"
              fill={colorTheme}
            />
          </svg>
        );

      case 'sec-marvel':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Marvel Shield / Arc */}
            <circle cx="50" cy="50" r="38" stroke="#EF4444" strokeWidth="6" fill="#0E1015" />
            <circle cx="50" cy="50" r="28" stroke="#E2E8F0" strokeWidth="5" />
            <circle cx="50" cy="50" r="19" stroke="#EF4444" strokeWidth="5" />
            <circle cx="50" cy="50" r="11" fill="#3B82F6" />
            <path d="M50 41 L53 48 L60 48 L55 53 L57 60 L50 56 L43 60 L45 53 L40 48 L47 48 Z" fill="#FFFFFF" />
          </svg>
        );

      case 'sec-anime':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Katana & Nichirin sun badge */}
            <circle cx="50" cy="50" r="34" stroke={colorTheme} strokeWidth="2" strokeDasharray="4 2" fill="#121318" />
            <circle cx="50" cy="50" r="14" fill={colorTheme} opacity="0.3" />
            {/* Crossed katanas */}
            <path d="M25 75 L75 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M72 22 L78 28" stroke={colorTheme} strokeWidth="5" strokeLinecap="round" />
            <path d="M75 75 L25 25" stroke={colorTheme} strokeWidth="3" strokeLinecap="round" />
            <path d="M22 22 L28 28" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 'sec-games':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Isometric 3D Voxel Minecraft / Game Cube */}
            <path d="M50 16 L84 34 L50 52 L16 34 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <path d="M16 34 L50 52 L50 86 L16 68 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <path d="M84 34 L50 52 L50 86 L84 68 Z" fill="#92400E" stroke="#451A03" strokeWidth="2" />
            {/* Pixel accents */}
            <rect x="42" y="26" width="6" height="4" fill="#86EFAC" />
            <rect x="58" y="32" width="6" height="4" fill="#166534" />
          </svg>
        );

      case 'sec-tmnt':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Turtle Shell with Ninja Bandana */}
            <ellipse cx="50" cy="52" rx="36" ry="32" fill="#15803D" stroke="#22C55E" strokeWidth="3" />
            <circle cx="50" cy="52" r="14" stroke="#86EFAC" strokeWidth="2" />
            <path d="M50 20 L50 38 M50 66 L50 84 M14 52 L36 52 M64 52 L86 52" stroke="#86EFAC" strokeWidth="2" />
            {/* Bandana ribbon */}
            <path d="M22 36 Q50 44 78 36 L76 42 Q50 50 24 42 Z" fill={colorTheme} />
          </svg>
        );

      case 'sec-star-trek':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Starfleet Insignia Delta */}
            <path
              d="M50 14 C50 14 74 60 76 84 C62 76 54 74 50 74 C46 74 38 76 24 84 C26 60 50 14 50 14 Z"
              fill={colorTheme}
              stroke="#F8FAFC"
              strokeWidth="2"
            />
            <path d="M46 36 L54 36 L54 60 L46 60 Z" fill="#0B0B0D" opacity="0.8" />
            <circle cx="50" cy="46" r="4" fill="#F8FAFC" />
          </svg>
        );

      case 'sec-chaveiros':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Keychain Metallic Ring */}
            <circle cx="50" cy="28" r="16" stroke={colorTheme} strokeWidth="4" />
            <circle cx="50" cy="28" r="10" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            {/* Keychain Link Connector */}
            <rect x="47" y="44" width="6" height="8" rx="2" fill={colorTheme} />
            {/* Keychain Charm Body (Geometric Tag) */}
            <path d="M34 52 L66 52 L74 82 L50 90 L26 82 Z" fill="#1C1F26" stroke={colorTheme} strokeWidth="2.5" />
            {/* Inner Star / Charm Design */}
            <polygon points="50,60 53,67 61,67 55,71 57,78 50,74 43,78 45,71 39,67 47,67" fill="#F8FAFC" />
          </svg>
        );

      case 'sec-mascotes':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* Mascot Trophy & Soccer Ball Shield */}
            <path d="M30 20 L70 20 L66 48 C64 62 50 72 50 72 C50 72 36 62 34 48 Z" fill="#1C1F26" stroke={colorTheme} strokeWidth="2.5" />
            <path d="M30 24 C22 24 16 32 20 44 C23 52 32 54 34 54" stroke={colorTheme} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M70 24 C78 24 84 32 80 44 C77 52 68 54 66 54" stroke={colorTheme} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M44 72 L42 84 L58 84 L56 72" fill="#2A2E39" stroke={colorTheme} strokeWidth="2" />
            <rect x="36" y="84" width="28" height="6" rx="2" fill="#F8FAFC" />
            {/* Star on Cup */}
            <polygon points="50,30 53,38 61,38 55,43 57,51 50,46 43,51 45,43 39,38 47,38" fill={colorTheme} />
          </svg>
        );

      case 'sec-luminarias':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" fill="none">
            {/* 3D Lamp / Spiral vase filament glow */}
            <path d="M38 18 C38 18 62 18 62 18 C70 18 76 24 74 32 C70 46 62 54 62 64 L38 64 C38 54 30 46 26 32 C24 24 30 18 38 18 Z" fill="#1C1F26" stroke={colorTheme} strokeWidth="3" />
            <path d="M38 64 L62 64 L58 76 L42 76 Z" fill="#334155" />
            <path d="M44 76 L56 76 L54 84 L46 84 Z" fill="#64748B" />
            {/* Filament rays */}
            <path d="M50 26 L50 48 M42 34 L58 34 M44 42 L56 42" stroke={colorTheme} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="38" r="6" fill={colorTheme} opacity="0.4" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#181A20] via-[#14151A] to-[#0E1015]">
      {/* 3D Wireframe Grid Floor Effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(250, 204, 21, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(250, 204, 21, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      {/* Layer Lines Print Visualization */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 4px)'
        }}
      />

      {/* Radial soft spotlight behind graphic */}
      <div 
        className="absolute w-36 h-36 rounded-full blur-2xl opacity-25 pointer-events-none transition-transform duration-500 group-hover:scale-125"
        style={{ backgroundColor: colorTheme }}
      />

      {/* Graphic representation */}
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
        {renderIconGraphic()}
      </div>

      {/* STL 3D Mesh badge watermark on bottom */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[8px] font-mono uppercase text-zinc-500/80 tracking-wider">
        <span>STL 3D • 0.2mm</span>
        <span className="text-yellow-400/80 font-bold">500% PRONTO</span>
      </div>
    </div>
  );
};
