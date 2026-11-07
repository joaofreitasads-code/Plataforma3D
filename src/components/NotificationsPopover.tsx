import React from 'react';
import { X, Sparkles, CheckCheck } from 'lucide-react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Canecas Térmicas 3D Atualizadas',
      desc: 'Todas as canecas dos times brasileiros agora com perfis 3MF prontos para AMS e fatiadores modernos.',
      time: 'Hoje, 14:30',
      unread: true,
    },
    {
      id: '2',
      title: 'Fichas de Custo Liberadas',
      desc: 'Calcule o filamento gasto, custo de energia e margem de lucro por modelo impresso.',
      time: 'Ontem',
      unread: false,
    },
    {
      id: '3',
      title: 'Novo Pack Canecas Gamer',
      desc: 'PlayStation, Mortal Kombat, COD, GTA e Minecraft adicionados com logos multipartes.',
      time: '2 dias atrás',
      unread: false,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mt-12 bg-[#13151f] border border-[#232838] rounded-2xl shadow-2xl p-4 text-left space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#202534] pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff5500]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Notificações VIP
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClear}
              className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 transition"
              title="Marcar como lidas"
            >
              <CheckCheck className="w-3 h-3 text-[#ff5500]" />
              <span>Marcar lidas</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-none">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border text-xs transition ${
                item.unread
                  ? 'bg-[#181c28] border-[#ff5500]/40'
                  : 'bg-[#0f1118] border-[#1d212d]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{item.title}</span>
                <span className="text-[10px] text-neutral-500">{item.time}</span>
              </div>
              <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
