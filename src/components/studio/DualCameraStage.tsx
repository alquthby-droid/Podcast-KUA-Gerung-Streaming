import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  VideoOff,
  FlipHorizontal,
  RefreshCw,
  Radio,
  Calendar,
  Clock,
  User,
  UserCheck,
  Pause,
  Move,
  GripVertical
} from 'lucide-react';
import { StreamLayout, StudioParticipantProfile, PipPosition, CameraPanOffset, PrimaryCameraRole } from '../../types/studio';

interface DualCameraStageProps {
  layout: StreamLayout;
  videoHostRef: React.RefObject<HTMLVideoElement>;
  videoGuestRef: React.RefObject<HTMLVideoElement>;
  hostProfile: StudioParticipantProfile;
  guestProfile: StudioParticipantProfile;
  isHostVideoEnabled: boolean;
  isGuestVideoEnabled: boolean;
  isHostMirrored: boolean;
  isGuestMirrored: boolean;
  onToggleHostVideo: () => void;
  onToggleGuestVideo: () => void;
  onToggleHostMirror: () => void;
  onToggleGuestMirror: () => void;
  showLowerThird: boolean;
  showWatermark: boolean;
  showRunningText: boolean;
  includeDateInTicker: boolean;
  tickerSpeed: 'normal' | 'slow' | 'fast';
  podcastTopic: string;
  indonesianDate: {
    dayName: string;
    dateNum: number;
    monthName: string;
    year: number;
    timeString: string;
    fullDate: string;
  };
  recordingState: 'idle' | 'recording' | 'paused' | 'stopped';
  recordDuration: number;
  formatTimer: (seconds: number) => string;
  isBroadcastingLive: boolean;
  resolution: string;
  aspectRatio: string;
  isLoadingCamera: boolean;
  showGrid: boolean;
  audioLevel: number;
  // Position & Layout Adjustment Props
  splitRatio?: number;
  onSplitRatioChange?: (ratio: number) => void;
  pipPosition?: PipPosition;
  onPipPositionChange?: (pos: PipPosition) => void;
  guestPan?: CameraPanOffset;
  onGuestPanChange?: (pan: CameraPanOffset) => void;
  onSwapPositions?: () => void;
  primaryRole?: PrimaryCameraRole;
  onPrimaryRoleChange?: (role: PrimaryCameraRole) => void;
}

export const DualCameraStage: React.FC<DualCameraStageProps> = ({
  layout,
  videoHostRef,
  videoGuestRef,
  hostProfile,
  guestProfile,
  isHostVideoEnabled,
  isGuestVideoEnabled,
  isHostMirrored,
  isGuestMirrored,
  onToggleHostVideo,
  onToggleGuestVideo,
  onToggleHostMirror,
  onToggleGuestMirror,
  showLowerThird,
  showWatermark,
  showRunningText,
  includeDateInTicker,
  tickerSpeed,
  podcastTopic,
  indonesianDate,
  recordingState,
  recordDuration,
  formatTimer,
  isBroadcastingLive,
  resolution,
  aspectRatio,
  isLoadingCamera,
  showGrid,
  audioLevel,
  splitRatio = 50,
  onSplitRatioChange,
  pipPosition = { x: 68, y: 55, size: 'medium' },
  onPipPositionChange,
  guestPan = { panX: 0, panY: 0, zoom: 1 },
  onGuestPanChange,
  onSwapPositions,
  primaryRole = 'guest',
  onPrimaryRoleChange
}) => {
  const isGuestPrimary = primaryRole === 'guest';
  const containerRef = useRef<HTMLDivElement>(null);
  const pipBoxRef = useRef<HTMLDivElement>(null);

  // Dragging States
  const [isDraggingPip, setIsDraggingPip] = useState<boolean>(false);

  // Temporary Drag Storage Refs
  const pipDragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    containerWidth: number;
    containerHeight: number;
    boxWidth: number;
    boxHeight: number;
  }>({
    startX: 0,
    startY: 0,
    initialX: 68,
    initialY: 55,
    containerWidth: 1,
    containerHeight: 1,
    boxWidth: 1,
    boxHeight: 1
  });

  // Calculate PiP dimensions based on size preset
  const pipWidthPercent = pipPosition.size === 'small' ? 24 : pipPosition.size === 'large' ? 40 : 32;

  // Handler for PiP pointer down
  const handlePipPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Don't drag if clicking buttons inside PiP
      if ((e.target as HTMLElement).closest('button')) return;
      if (!containerRef.current || !onPipPositionChange) return;

      e.preventDefault();
      e.stopPropagation();

      const containerRect = containerRef.current.getBoundingClientRect();
      const boxRect = e.currentTarget.getBoundingClientRect();

      pipDragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: pipPosition.x,
        initialY: pipPosition.y,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
        boxWidth: boxRect.width,
        boxHeight: boxRect.height
      };

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
      setIsDraggingPip(true);
    },
    [pipPosition, onPipPositionChange]
  );

  // Handler for PiP pointer move
  const handlePipPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingPip || !onPipPositionChange) return;

      const { startX, startY, initialX, initialY, containerWidth, containerHeight, boxWidth, boxHeight } =
        pipDragRef.current;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const deltaXPercent = (deltaX / containerWidth) * 100;
      const deltaYPercent = (deltaY / containerHeight) * 100;

      const boxWPercent = (boxWidth / containerWidth) * 100;
      const boxHPercent = (boxHeight / containerHeight) * 100;

      const maxAllowedX = 100 - boxWPercent - 1.5;
      const maxAllowedY = 90 - boxHPercent; // avoid overlapping bottom ticker

      const nextX = Math.max(1.5, Math.min(maxAllowedX, initialX + deltaXPercent));
      const nextY = Math.max(1.5, Math.min(maxAllowedY, initialY + deltaYPercent));

      onPipPositionChange({
        ...pipPosition,
        x: Math.round(nextX * 10) / 10,
        y: Math.round(nextY * 10) / 10
      });
    },
    [isDraggingPip, pipPosition, onPipPositionChange]
  );

  // Handler for PiP pointer up
  const handlePipPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDraggingPip) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // Safe fallback
        }
        setIsDraggingPip(false);
      }
    },
    [isDraggingPip]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#080B07] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl min-h-[360px] sm:min-h-[480px] aspect-video flex flex-col justify-between select-none"
    >
      {/* 3x3 Rule-of-Thirds Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 border border-white/15">
          <div className="border-r border-b border-white/15"></div>
          <div className="border-r border-b border-white/15"></div>
          <div className="border-b border-white/15"></div>
          <div className="border-r border-b border-white/15"></div>
          <div className="border-r border-b border-white/15"></div>
          <div className="border-b border-white/15"></div>
          <div className="border-r border-b border-white/15"></div>
          <div className="border-r border-b border-white/15"></div>
          <div></div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoadingCamera && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-40">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <p className="text-xs text-white font-semibold">Menginisialisasi Kamera Studio...</p>
        </div>
      )}

      {/* TOP BROADCAST OVERLAYS (REC, Status, Watermark & Floating Position Action) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30">
        {/* Left: Recording & Status Badges */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {recordingState === 'recording' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-mono font-black shadow-lg border border-red-400 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
              <span>REC {formatTimer(recordDuration)}</span>
            </div>
          )}

          {recordingState === 'paused' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-mono font-bold shadow-lg border border-amber-400">
              <Pause className="w-3 h-3" />
              <span>PAUSED {formatTimer(recordDuration)}</span>
            </div>
          )}

          {isBroadcastingLive && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006837] text-white text-xs font-bold uppercase tracking-wider shadow-lg border border-emerald-400">
              <Radio className="w-3 h-3 text-emerald-300 animate-ping" />
              <span>ON-AIR LIVE</span>
            </div>
          )}

        </div>

        {/* Right: Kemenag Official Watermark */}
        {showWatermark && (
          <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 shadow-lg pointer-events-auto">
            <img
              src="/logo-kemenag.svg"
              alt="Kemenag"
              className="w-5 h-5 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo-kemenag.png';
              }}
            />
            <div className="text-right">
              <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider leading-none">
                KUA GERUNG
              </div>
              <div className="text-[8px] font-medium text-emerald-300/80 leading-tight">
                STUDIO DUAL CAM
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STAGE VIDEO LAYOUT VIEWS */}
      <div className="relative flex-1 w-full h-full min-h-[300px] overflow-hidden flex items-center justify-center">
        {/* ======================================================== */}
        {/* LAYOUT 1: SPLIT SCREEN (Slot 1 Utama & Slot 2 Kedua)     */}
        {/* ======================================================== */}
        {layout === 'split' && (
          <div className="flex w-full h-full bg-black/95 relative overflow-hidden select-none">
            {/* BOX 1: KAMERA UTAMA (Kiri - Default Narasumber jika isGuestPrimary) */}
            <div
              style={{ width: `${splitRatio}%` }}
              className="relative h-full bg-[#0E120A] overflow-hidden group flex items-center justify-center shrink-0"
            >
              <video
                ref={isGuestPrimary ? videoGuestRef : videoHostRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-transform ${
                  (isGuestPrimary ? isGuestMirrored : isHostMirrored) ? 'scale-x-[-1]' : ''
                } ${!(isGuestPrimary ? isGuestVideoEnabled : isHostVideoEnabled) ? 'hidden' : 'block'}`}
              />

              {!(isGuestPrimary ? isGuestVideoEnabled : isHostVideoEnabled) && (
                <div className="flex flex-col items-center justify-center p-4 text-center text-white/60 gap-2">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <VideoOff className="w-6 h-6 text-white/40" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {isGuestPrimary ? 'Kamera Narasumber Nonaktif' : 'Kamera Host Nonaktif'}
                  </span>
                </div>
              )}

              {/* Slot 1 Top Badge */}
              <div className="absolute top-12 sm:top-14 left-2 sm:left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 shadow-md">
                <span className={`w-2 h-2 rounded-full ${isGuestPrimary ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></span>
                {isGuestPrimary ? (
                  <User className="w-3 h-3 text-amber-300" />
                ) : (
                  <UserCheck className="w-3 h-3 text-[#D4AF37]" />
                )}
                <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">
                  {isGuestPrimary ? 'NARASUMBER &bull; UTAMA' : 'HOST &bull; KUA'}
                </span>
                {audioLevel > 15 && (
                  <span className={`text-[9px] font-mono ${isGuestPrimary ? 'text-amber-300' : 'text-emerald-400'} animate-pulse`}>🎙️ AKTIF</span>
                )}
              </div>

              {/* Quick Floating Controls for Slot 1 on Hover */}
              <div className="absolute top-12 sm:top-14 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-lg border border-white/15">
                <button
                  type="button"
                  onClick={isGuestPrimary ? onToggleGuestMirror : onToggleHostMirror}
                  className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                  title="Cermin Kamera"
                >
                  <FlipHorizontal className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={isGuestPrimary ? onToggleGuestVideo : onToggleHostVideo}
                  className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                  title="Nyalakan/Matikan Kamera"
                >
                  <VideoOff className="w-3 h-3" />
                </button>
              </div>

              {/* Slot 1 Lower-Third Banner */}
              {showLowerThird && (
                <div className="absolute bottom-12 sm:bottom-14 left-2 sm:left-3 right-2 sm:right-3 pointer-events-none z-20">
                  <div className={`inline-flex items-center bg-gradient-to-r from-black/95 via-[#0d160f]/95 to-black/85 backdrop-blur-md border-l-4 ${
                    isGuestPrimary ? 'border-[#D4AF37]' : 'border-emerald-500'
                  } px-3 py-1.5 rounded-r-xl border-y border-r border-white/15 shadow-2xl max-w-full`}>
                    <div>
                      <div className="text-[11px] sm:text-xs font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                        <span className="truncate">{isGuestPrimary ? guestProfile.name : hostProfile.name}</span>
                        {(isGuestPrimary ? guestProfile.asnNo : hostProfile.asnNo) && (
                          <span className={`text-[9px] ${
                            isGuestPrimary ? 'bg-amber-700 border-amber-400' : 'bg-[#006837] border-emerald-400'
                          } text-white px-1.5 py-0.2 rounded font-bold border shrink-0`}>
                            ASN #{isGuestPrimary ? guestProfile.asnNo : hostProfile.asnNo}
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[#D4AF37] font-semibold tracking-wide truncate">
                        {isGuestPrimary ? guestProfile.title : hostProfile.title}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Seamless Split boundary (clean join between Host and Narasumber without dividing lines or grip indicator) */}

            {/* BOX 2: KAMERA KEDUA (Kanan - Default Host jika isGuestPrimary) */}
            <div
              style={{ width: `${100 - splitRatio}%` }}
              className="relative h-full bg-[#120F0A] overflow-hidden group flex items-center justify-center shrink-0"
            >
              <video
                ref={isGuestPrimary ? videoHostRef : videoGuestRef}
                autoPlay
                playsInline
                muted
                style={{
                  transform: `${(isGuestPrimary ? isHostMirrored : isGuestMirrored) ? 'scaleX(-1)' : ''} translate(${guestPan.panX}%, ${guestPan.panY}%) scale(${guestPan.zoom})`,
                  transformOrigin: 'center center'
                }}
                className={`w-full h-full object-cover transition-transform ${
                  !(isGuestPrimary ? isHostVideoEnabled : isGuestVideoEnabled) ? 'hidden' : 'block'
                }`}
              />

              {!(isGuestPrimary ? isHostVideoEnabled : isGuestVideoEnabled) && (
                <div className="flex flex-col items-center justify-center p-4 text-center text-white/60 gap-2">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <VideoOff className="w-6 h-6 text-white/40" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {isGuestPrimary ? 'Kamera Host (Kamera 2) Nonaktif' : 'Kamera Narasumber Nonaktif'}
                  </span>
                </div>
              )}

              {/* Slot 2 Top Badge */}
              <div className="absolute top-12 sm:top-14 left-2 sm:left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-emerald-500/50 shadow-md">
                <span className={`w-2 h-2 rounded-full ${isGuestPrimary ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></span>
                {isGuestPrimary ? (
                  <UserCheck className="w-3 h-3 text-[#D4AF37]" />
                ) : (
                  <User className="w-3 h-3 text-amber-300" />
                )}
                <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">
                  {isGuestPrimary ? 'HOST &bull; KAMERA 2' : 'NARASUMBER'}
                </span>
                {audioLevel > 15 && (
                  <span className={`text-[9px] font-mono ${isGuestPrimary ? 'text-emerald-400' : 'text-amber-300'} animate-pulse`}>🎙️ AKTIF</span>
                )}
              </div>

              {/* Quick Floating Controls for Slot 2 on Hover */}
              <div className="absolute top-12 sm:top-14 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-lg border border-white/15">
                <button
                  type="button"
                  onClick={isGuestPrimary ? onToggleHostMirror : onToggleGuestMirror}
                  className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                  title="Cermin Kamera Kedua"
                >
                  <FlipHorizontal className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={isGuestPrimary ? onToggleHostVideo : onToggleGuestVideo}
                  className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                  title="Nyalakan/Matikan Kamera Kedua"
                >
                  <VideoOff className="w-3 h-3" />
                </button>
              </div>

              {/* Slot 2 Lower-Third Banner */}
              {showLowerThird && (
                <div className="absolute bottom-12 sm:bottom-14 left-2 sm:left-3 right-2 sm:right-3 pointer-events-none z-20">
                  <div className={`inline-flex items-center bg-gradient-to-r from-black/95 via-[#1a140d]/95 to-black/85 backdrop-blur-md border-l-4 ${
                    isGuestPrimary ? 'border-emerald-500' : 'border-[#D4AF37]'
                  } px-3 py-1.5 rounded-r-xl border-y border-r border-white/15 shadow-2xl max-w-full`}>
                    <div>
                      <div className="text-[11px] sm:text-xs font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                        <span className="truncate">{isGuestPrimary ? hostProfile.name : guestProfile.name}</span>
                        {(isGuestPrimary ? hostProfile.asnNo : guestProfile.asnNo) && (
                          <span className={`text-[9px] ${
                            isGuestPrimary ? 'bg-[#006837] border-emerald-400' : 'bg-amber-700 border-amber-400'
                          } text-white px-1.5 py-0.2 rounded font-bold border shrink-0`}>
                            ASN #{isGuestPrimary ? hostProfile.asnNo : guestProfile.asnNo}
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[#D4AF37] font-semibold tracking-wide truncate">
                        {isGuestPrimary ? hostProfile.title : guestProfile.title}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LAYOUT 2: PICTURE-IN-PICTURE (PiP DENGAN DRAG BEBAS)     */}
        {/* ======================================================== */}
        {layout === 'pip' && (
          <div className="relative w-full h-full bg-[#0A0D08] flex items-center justify-center overflow-hidden">
            {/* Main Full View (Default: Narasumber jika isGuestPrimary) */}
            <video
              ref={isGuestPrimary ? videoGuestRef : videoHostRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-transform ${
                (isGuestPrimary ? isGuestMirrored : isHostMirrored) ? 'scale-x-[-1]' : ''
              } ${!(isGuestPrimary ? isGuestVideoEnabled : isHostVideoEnabled) ? 'hidden' : 'block'}`}
            />

            {/* Main Camera Lower Third Banner */}
            {showLowerThird && (
              <div className="absolute bottom-12 sm:bottom-14 left-3 pointer-events-none z-20">
                <div className={`inline-flex items-center bg-black/90 backdrop-blur-md border-l-4 ${
                  isGuestPrimary ? 'border-[#D4AF37]' : 'border-emerald-500'
                } px-3.5 py-2 rounded-r-xl border-y border-r border-white/15 shadow-2xl`}>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-white uppercase">
                      {isGuestPrimary ? guestProfile.name : hostProfile.name}
                    </div>
                    <div className="text-[10px] text-[#D4AF37]">
                      {isGuestPrimary ? guestProfile.title : hostProfile.title}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inset PiP Box (Kamera Kedua: Host jika isGuestPrimary) - DRAGGABLE & REPOSITIONABLE */}
            <div
              ref={pipBoxRef}
              onPointerDown={handlePipPointerDown}
              onPointerMove={handlePipPointerMove}
              onPointerUp={handlePipPointerUp}
              style={{
                left: `${pipPosition.x}%`,
                top: `${pipPosition.y}%`,
                width: `${pipWidthPercent}%`,
                touchAction: 'none'
              }}
              className={`absolute aspect-video bg-black rounded-xl overflow-hidden border-2 z-30 group select-none transition-shadow ${
                isDraggingPip
                  ? 'border-amber-400 ring-4 ring-amber-500/40 shadow-2xl cursor-grabbing'
                  : isGuestPrimary
                  ? 'border-emerald-400 shadow-xl hover:border-amber-300 cursor-grab'
                  : 'border-[#D4AF37] shadow-xl hover:border-amber-300 cursor-grab'
              }`}
              title="Tahan & geser untuk memindahkan posisi kamera kedua ke mana saja"
            >
              {/* PiP Drag Handle Header Banner - Shows smoothly on hover */}
              <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/85 via-black/50 to-transparent px-2 py-1.5 flex items-center justify-between text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-300 truncate">
                  <Move className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {isGuestPrimary
                      ? `🎙️ ${hostProfile.name.slice(0, 14)}`
                      : `👤 ${guestProfile.name.slice(0, 14)}`}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-[8px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-[#D4AF37] border border-white/15 shrink-0">
                  <GripVertical className="w-2.5 h-2.5" />
                  <span>Geser Posisi</span>
                </div>
              </div>

              {/* Secondary Camera Video Feed inside PiP */}
              <video
                ref={isGuestPrimary ? videoHostRef : videoGuestRef}
                autoPlay
                playsInline
                muted
                style={{
                  transform: `${(isGuestPrimary ? isHostMirrored : isGuestMirrored) ? 'scaleX(-1)' : ''} translate(${guestPan.panX}%, ${guestPan.panY}%) scale(${guestPan.zoom})`,
                  transformOrigin: 'center center'
                }}
                className={`w-full h-full object-cover pointer-events-none ${
                  !(isGuestPrimary ? isHostVideoEnabled : isGuestVideoEnabled) ? 'hidden' : 'block'
                }`}
              />

              {!(isGuestPrimary ? isHostVideoEnabled : isGuestVideoEnabled) && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 text-white/50 text-[10px]">
                  <VideoOff className="w-4 h-4 mb-1" />
                  <span>Kamera 2 Nonaktif</span>
                </div>
              )}

              {/* Live Drag Coordinate Tooltip while dragging */}
              {isDraggingPip && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-2 z-40">
                  <Move className="w-5 h-5 text-amber-300 animate-bounce mb-1" />
                  <span className="text-[10px] font-mono font-bold text-amber-300">
                    X: {Math.round(pipPosition.x)}% &bull; Y: {Math.round(pipPosition.y)}%
                  </span>
                  <span className="text-[9px] text-white/80">Lepas mouse untuk meletakkan</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LAYOUT 3: SOLO HOST                                      */}
        {/* ======================================================== */}
        {layout === 'solo-host' && (
          <div className="relative w-full h-full bg-[#0A0D08] flex items-center justify-center">
            <video
              ref={videoHostRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-transform ${
                isHostMirrored ? 'scale-x-[-1]' : ''
              } ${!isHostVideoEnabled ? 'hidden' : 'block'}`}
            />
            {showLowerThird && (
              <div className="absolute bottom-12 sm:bottom-14 left-3 pointer-events-none z-20">
                <div className="inline-flex items-center bg-black/90 backdrop-blur-md border-l-4 border-emerald-500 px-3.5 py-2 rounded-r-xl border-y border-r border-white/15 shadow-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-black text-white uppercase">{hostProfile.name}</div>
                    <div className="text-[10px] text-[#D4AF37]">{hostProfile.title}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* LAYOUT 4: SOLO NARASUMBER                                */}
        {/* ======================================================== */}
        {layout === 'solo-guest' && (
          <div className="relative w-full h-full bg-[#0A0D08] flex items-center justify-center">
            <video
              ref={videoGuestRef}
              autoPlay
              playsInline
              muted
              style={{
                transform: `${isGuestMirrored ? 'scaleX(-1)' : ''} translate(${guestPan.panX}%, ${guestPan.panY}%) scale(${guestPan.zoom})`,
                transformOrigin: 'center center'
              }}
              className={`w-full h-full object-cover transition-transform ${
                !isGuestVideoEnabled ? 'hidden' : 'block'
              }`}
            />
            {showLowerThird && (
              <div className="absolute bottom-12 sm:bottom-14 left-3 pointer-events-none z-20">
                <div className="inline-flex items-center bg-black/90 backdrop-blur-md border-l-4 border-[#D4AF37] px-3.5 py-2 rounded-r-xl border-y border-r border-white/15 shadow-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-black text-white uppercase">{guestProfile.name}</div>
                    <div className="text-[10px] text-[#D4AF37]">{guestProfile.title}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM RUNNING TEXT MARQUEE (Spans Across Both Displays) */}
      {showRunningText && (
        <div className="relative z-30 bg-[#0A160D]/95 backdrop-blur-md border-t border-[#D4AF37]/50 shadow-2xl flex items-center shrink-0">
          {/* Fixed Left Badge: Topik Podcast */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-700 to-red-600 px-2.5 sm:px-3 py-1.5 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shrink-0 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0"></span>
            <Radio className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap">TOPIK PODCAST</span>
          </div>

          {/* Day, Date, Month, Year Badge */}
          {includeDateInTicker && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#006837] text-white font-semibold text-[10px] sm:text-[11px] shrink-0 border-r border-emerald-500/40">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="whitespace-nowrap">
                <span className="text-[#D4AF37] font-black uppercase">{indonesianDate.dayName}</span>, {indonesianDate.dateNum} {indonesianDate.monthName} {indonesianDate.year}
              </span>
              <span className="text-emerald-200/80 font-mono text-[9px] ml-1 pl-1.5 border-l border-emerald-400/40 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-[#D4AF37]" />
                {indonesianDate.timeString}
              </span>
            </div>
          )}

          {/* Continuous Smooth Scrolling Marquee Area */}
          <div className="relative flex-1 overflow-hidden py-1.5 px-2.5">
            <div
              className={`whitespace-nowrap flex items-center ${
                tickerSpeed === 'slow'
                  ? 'animate-marquee-slow'
                  : tickerSpeed === 'fast'
                  ? 'animate-marquee-fast'
                  : 'animate-marquee'
              }`}
            >
              {/* Track 1 */}
              <div className="flex items-center gap-5 pr-5 font-semibold text-[11px] sm:text-xs text-white">
                <span className="text-emerald-300 font-bold">
                  TOPIK: <strong className="text-white font-extrabold">{podcastTopic}</strong>
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-white/90">
                  🗓️ Hari & Tanggal: <strong className="text-[#D4AF37]">{indonesianDate.fullDate}</strong> ({indonesianDate.timeString})
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-emerald-200">
                  🎙️ Host: {hostProfile.name} ({hostProfile.title})
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-amber-200">
                  👤 Narasumber: {guestProfile.name} ({guestProfile.title})
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-white/80">
                  🏛️ KUA KECAMATAN GERUNG &bull; KEMENTERIAN AGAMA KABUPATEN LOMBOK BARAT
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
              </div>

              {/* Track 2 (Seamless Duplicate) */}
              <div className="flex items-center gap-5 pr-5 font-semibold text-[11px] sm:text-xs text-white" aria-hidden="true">
                <span className="text-emerald-300 font-bold">
                  TOPIK: <strong className="text-white font-extrabold">{podcastTopic}</strong>
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-white/90">
                  🗓️ Hari & Tanggal: <strong className="text-[#D4AF37]">{indonesianDate.fullDate}</strong> ({indonesianDate.timeString})
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-emerald-200">
                  🎙️ Host: {hostProfile.name} ({hostProfile.title})
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-amber-200">
                  👤 Narasumber: {guestProfile.name} ({guestProfile.title})
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-white/80">
                  🏛️ KUA KECAMATAN GERUNG &bull; KEMENTERIAN AGAMA KABUPATEN LOMBOK BARAT
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
