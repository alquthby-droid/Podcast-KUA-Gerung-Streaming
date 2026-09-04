import React from 'react';
import { Columns2, Layers, User, UserCheck, ArrowLeftRight, Move, SlidersHorizontal } from 'lucide-react';
import { StreamLayout, PipPosition, PrimaryCameraRole } from '../../types/studio';

interface StudioLayoutBarProps {
  layout: StreamLayout;
  onLayoutChange: (layout: StreamLayout) => void;
  onSwapPositions: () => void;
  hostName: string;
  guestName: string;
  splitRatio?: number;
  onSplitRatioChange?: (ratio: number) => void;
  pipPosition?: PipPosition;
  onPipPositionChange?: (pos: PipPosition) => void;
  primaryRole?: PrimaryCameraRole;
  onPrimaryRoleChange?: (role: PrimaryCameraRole) => void;
}

export const StudioLayoutBar: React.FC<StudioLayoutBarProps> = ({
  layout,
  onLayoutChange,
  onSwapPositions,
  hostName,
  guestName,
  splitRatio = 50,
  onSplitRatioChange,
  pipPosition = { x: 68, y: 60, size: 'medium' },
  onPipPositionChange,
  primaryRole = 'guest',
  onPrimaryRoleChange
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#0E100A] border-b border-white/10 shrink-0">
      {/* Left: Mode Title & Layout Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-extrabold uppercase text-[#D4AF37] tracking-wider flex items-center gap-1.5">
          <Columns2 className="w-3.5 h-3.5" />
          <span>Format:</span>
        </span>

        {/* Center: Layout Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => onLayoutChange('split')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              layout === 'split'
                ? 'bg-[#006837] text-white shadow-md border border-emerald-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Split: Host & Narasumber Berdampingan (Posisi pembatas bisa digeser)"
          >
            <Columns2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Split {splitRatio}:{100 - splitRatio}</span>
            <span className="sm:hidden">Split</span>
          </button>

          <button
            type="button"
            onClick={() => onLayoutChange('pip')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              layout === 'pip'
                ? 'bg-[#006837] text-white shadow-md border border-emerald-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Picture-in-Picture: Host Utama + Kotak Kamera 2 (Bisa digeser bebas)"
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>PiP</span>
          </button>

          <button
            type="button"
            onClick={() => onLayoutChange('solo-host')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              layout === 'solo-host'
                ? 'bg-[#006837] text-white shadow-md border border-emerald-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title={`Fokus Solo: Hanya Kamera Host (${hostName})`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden md:inline">Solo Host</span>
            <span className="md:hidden">Host</span>
          </button>

          <button
            type="button"
            onClick={() => onLayoutChange('solo-guest')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              layout === 'solo-guest'
                ? 'bg-[#006837] text-white shadow-md border border-emerald-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title={`Fokus Solo: Hanya Kamera Narasumber (${guestName})`}
          >
            <User className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden md:inline">Solo Narasumber</span>
            <span className="md:hidden">Narasumber</span>
          </button>
        </div>
      </div>

      {/* Middle/Contextual: Quick Repositioning Controls for Camera 2 */}
      {layout === 'split' && onSplitRatioChange && (
        <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-xl border border-[#D4AF37]/30 text-[11px]">
          <span className="text-white/60 hidden sm:inline flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-[#D4AF37]" />
            <span>Geser Proporsi:</span>
          </span>
          <button
            type="button"
            onClick={() => onSplitRatioChange(50)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
              splitRatio === 50 ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Bagi 50:50 Rata"
          >
            50:50
          </button>
          <button
            type="button"
            onClick={() => onSplitRatioChange(65)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
              splitRatio === 65 ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Host Lebih Lebar (65:35)"
          >
            65:35 (Host)
          </button>
          <button
            type="button"
            onClick={() => onSplitRatioChange(35)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
              splitRatio === 35 ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Narasumber Lebih Lebar (35:65)"
          >
            35:65 (Tamu)
          </button>
        </div>
      )}

      {layout === 'pip' && onPipPositionChange && (
        <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-xl border border-amber-500/30 text-[11px]">
          <span className="text-amber-300 font-bold hidden sm:inline flex items-center gap-1">
            <Move className="w-3 h-3 animate-pulse" />
            <span>Geser PiP:</span>
          </span>
          <button
            type="button"
            onClick={() => onPipPositionChange({ ...pipPosition, x: 2, y: 12 })}
            className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white hover:bg-amber-500 hover:text-black font-bold cursor-pointer"
            title="Geser ke Kiri Atas"
          >
            ↖ Kiri Atas
          </button>
          <button
            type="button"
            onClick={() => onPipPositionChange({ ...pipPosition, x: 66, y: 12 })}
            className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white hover:bg-amber-500 hover:text-black font-bold cursor-pointer"
            title="Geser ke Kanan Atas"
          >
            ↗ Kanan Atas
          </button>
          <button
            type="button"
            onClick={() => onPipPositionChange({ ...pipPosition, x: 2, y: 55 })}
            className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white hover:bg-amber-500 hover:text-black font-bold cursor-pointer"
            title="Geser ke Kiri Bawah"
          >
            ↙ Kiri Bawah
          </button>
          <button
            type="button"
            onClick={() => onPipPositionChange({ ...pipPosition, x: 66, y: 55 })}
            className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white hover:bg-amber-500 hover:text-black font-bold cursor-pointer"
            title="Geser ke Kanan Bawah"
          >
            ↘ Kanan Bawah
          </button>
          <button
            type="button"
            onClick={() => onPipPositionChange({ ...pipPosition, x: 34, y: 32 })}
            className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white hover:bg-amber-500 hover:text-black font-bold cursor-pointer"
            title="Geser ke Tengah"
          >
            ✛ Tengah
          </button>
        </div>
      )}

      {/* Right: Primary Role Status & Switcher */}
      <div className="flex items-center gap-1.5 ml-auto">
        <button
          type="button"
          onClick={() => {
            if (onPrimaryRoleChange) {
              onPrimaryRoleChange(primaryRole === 'guest' ? 'host' : 'guest');
            } else {
              onSwapPositions();
            }
          }}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            primaryRole === 'guest'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 hover:bg-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 hover:bg-emerald-500/30'
          }`}
          title="Klik untuk menukar posisi kamera: Narasumber di Kamera Utama vs Host di Kamera Utama"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          {primaryRole === 'guest' ? (
            <span>
              <span className="text-[#D4AF37] font-extrabold">Utama:</span> Narasumber &bull; <span className="text-white/80">Kam 2:</span> Host
            </span>
          ) : (
            <span>
              <span className="text-emerald-400 font-extrabold">Utama:</span> Host &bull; <span className="text-white/80">Kam 2:</span> Narasumber
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
