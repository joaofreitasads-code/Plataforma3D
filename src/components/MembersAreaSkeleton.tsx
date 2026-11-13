import React from 'react';
import { Box } from 'lucide-react';

export const MembersAreaSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans">
      {/* Sidebar Skeleton (hidden on mobile) */}
      <div className="hidden lg:block w-64 h-screen bg-[#0C0C0C] border-r border-[#242424] p-4 space-y-4 shrink-0">
        <div className="flex items-center gap-3 pb-3 border-b border-[#242424]">
          <div className="w-9 h-9 rounded-lg bg-neutral-800 animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 bg-neutral-800 rounded w-3/4 animate-pulse" />
            <div className="h-2.5 bg-neutral-900 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 bg-neutral-900/80 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A]">
        {/* Top Header Skeleton */}
        <div className="h-14 bg-[#0C0C0C] border-b border-[#242424] px-6 flex items-center justify-between">
          <div className="h-8 bg-neutral-900 rounded-lg w-72 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />
            <div className="w-24 h-4 bg-neutral-800 rounded hidden sm:block animate-pulse" />
          </div>
        </div>

        {/* Catalog Grid Skeleton */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="h-44 bg-neutral-950 border border-[#222222] rounded-2xl p-6 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-neutral-600">
              <Box className="w-8 h-8 text-neutral-600 animate-spin" />
              <span className="text-xs font-mono font-bold">Carregando Área de Membros...</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-[#141414] border border-[#242424] rounded-xl p-3 space-y-3">
                <div className="aspect-square bg-neutral-900 rounded-lg animate-pulse" />
                <div className="h-3 bg-neutral-800 rounded w-4/5 animate-pulse" />
                <div className="h-6 bg-neutral-900 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
