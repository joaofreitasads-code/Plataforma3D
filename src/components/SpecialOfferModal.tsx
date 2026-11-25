import React, { useEffect } from 'react';
import { BONUSES, CHECKOUT_URLS, trackInitiateCheckout } from '../data/pageData';

interface SpecialOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecialOfferModal: React.FC<SpecialOfferModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="basicModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl animate-modal-card gpu-layer"
        style={{
          border: '2px solid #0066ff',
          boxShadow: '0 0 50px rgba(0, 102, 255, 0.5), 0 0 20px rgba(0, 102, 255, 0.3)',
          background: 'linear-gradient(180deg, #1a1c1f, rgba(0, 102, 255, 0.15))',
        }}
      >
        <button
          type="button"
          aria-label="Fechar"
          id="modalClose"
          onClick={onClose}
          className="absolute top-3 right-4 text-white/60 hover:text-white text-2xl transition cursor-pointer p-1"
        >
          ✕
        </button>

        <h3 className="text-2xl font-black uppercase text-center text-white">
          ESPERA!{' '}
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #0066ff, #00d4ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            OFERTA ESPECIAL
          </span>
        </h3>

        <p className="mt-4 text-center text-white/80 text-sm md:text-base">
          Antes de escolher o básico, leve o <b>plano completo</b> com todos os bônus por um preço único:
        </p>

        <div className="mt-6 text-center">
          <div className="text-sm line-through text-white/50">DE R$ 57,90</div>
          <div className="mt-1 text-5xl font-black">
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg, #0066ff, #00d4ff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              R$ 27,90
            </span>
          </div>
          <div className="text-xs text-white/70 mt-1">Pagamento único • Acesso vitalício</div>
        </div>

        <ul className="mt-6 space-y-1 text-sm text-white/80">
          <li className="flex items-center gap-2">
            <span style={{ color: '#0066ff' }} className="font-bold">✓</span> +150.000 modelos STL
          </li>
          <li className="flex items-center gap-2">
            <span style={{ color: '#0066ff' }} className="font-bold">✓</span> Todos os {BONUSES.length} bônus inclusos
          </li>
          <li className="flex items-center gap-2">
            <span style={{ color: '#0066ff' }} className="font-bold">✓</span> Garantia de 14 dias
          </li>
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={CHECKOUT_URLS.specialOfferDiscount}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackInitiateCheckout('Oferta Especial Completo R$ 27,90', 27.90)}
            className="block text-center w-full py-3.5 rounded-full font-black text-black uppercase text-sm tracking-wide shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            style={{
              backgroundImage: 'linear-gradient(135deg, #00ff66, #00e64d)',
              boxShadow: '0 0 28px rgba(0, 255, 102, 0.75)',
              color: '#000000',
            }}
          >
            SIM! QUERO O COMPLETO POR R$ 27,90
          </a>
          <a
            href={CHECKOUT_URLS.basicCheckout}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackInitiateCheckout('Plano Básico R$ 10,90', 10.90)}
            className="block text-center w-full py-3 rounded-full font-bold text-white uppercase text-xs tracking-wide hover:brightness-110 active:scale-95 transition"
            style={{ backgroundColor: '#0066ff', boxShadow: '0 8px 25px -5px rgba(0, 102, 255, 0.5)' }}
          >
            NÃO, PREFIRO O BÁSICO
          </a>
        </div>
      </div>
    </div>
  );
};
