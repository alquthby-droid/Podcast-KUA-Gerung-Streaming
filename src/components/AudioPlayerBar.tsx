import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Share2,
  Maximize2,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { formatDuration } from '../utils/formatters';

interface AudioPlayerBarProps {
  onOpenSocialShare: () => void;
  onOpenEpisodeDetails: (id: string) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  onOpenSocialShare,
  onOpenEpisodeDetails,
}) => {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    togglePlay,
    seek,
    skipTime,
    setPlaybackRate,
    setVolume,
    toggleMute,
    playNext,
    playPrev,
    setIsExpanded,
  } = useAudioPlayer();

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!currentEpisode) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    const newTime = (newPercent / 100) * duration;
    seek(newTime);
  };

  const speedOptions = [0.75, 1, 1.25, 1.5];

  return (
    <div
      id="persistent-audio-player"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F110C]/95 backdrop-blur-md border-t border-white/10 text-[#E0E0E0] shadow-2xl transition-all"
    >
      {/* Progress Track at top edge of player */}
      <div className="relative group w-full h-1.5 bg-white/10 cursor-pointer">
        <div
          className="h-full bg-[#D4AF37] relative"
          style={{ width: `${progressPercentage}%` }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"></span>
        </div>
        <input
          id="audio-progress-slider"
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progressPercentage || 0}
          onChange={handleSeekChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          aria-label="Audio progress slider"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Thumbnail & Episode Info */}
          <div className="flex items-center gap-3 min-w-0 max-w-[40%] sm:max-w-[32%]">
            <div
              onClick={() => onOpenEpisodeDetails(currentEpisode.id)}
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 bg-black/60 border border-white/10 cursor-pointer group"
            >
              <img
                src={currentEpisode.coverImage}
                alt={currentEpisode.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-4">
                    <span className="w-1 bg-[#D4AF37] rounded-full animate-bounce h-3"></span>
                    <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.2s] h-4"></span>
                    <span className="w-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.4s] h-2"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider truncate">
                  Ep {currentEpisode.episodeNumber} &bull; {currentEpisode.categoryLabel}
                </span>
              </div>
              <h4
                onClick={() => onOpenEpisodeDetails(currentEpisode.id)}
                className="text-xs sm:text-sm font-bold text-white truncate cursor-pointer hover:text-[#D4AF37] transition-colors"
                title={currentEpisode.title}
              >
                {currentEpisode.title}
              </h4>
              <p className="text-[10px] text-white/40 truncate hidden sm:block uppercase tracking-wider">
                KUA Kec. Gerung, Kemenag Lombok Barat
              </p>
            </div>
          </div>

          {/* Center: Main Playback Controls & Timers */}
          <div className="flex flex-col items-center justify-center flex-1 max-w-md">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                id="btn-player-prev"
                onClick={playPrev}
                className="text-white/50 hover:text-[#D4AF37] p-1 transition-colors cursor-pointer"
                title="Episode Sebelumnya"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                id="btn-player-rewind"
                onClick={() => skipTime(-10)}
                className="text-white/50 hover:text-[#D4AF37] p-1 transition-colors cursor-pointer hidden xs:block"
                title="Mundur 10 Detik"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Central Play/Pause button */}
              <button
                id="btn-player-toggle"
                onClick={togglePlay}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#D4AF37] hover:bg-[#e0be48] text-black flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all cursor-pointer font-bold"
                title={isPlaying ? 'Jeda Siaran' : 'Putar Audio'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black text-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                )}
              </button>

              <button
                id="btn-player-forward"
                onClick={() => skipTime(10)}
                className="text-white/50 hover:text-[#D4AF37] p-1 transition-colors cursor-pointer hidden xs:block"
                title="Maju 10 Detik"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                id="btn-player-next"
                onClick={playNext}
                className="text-white/50 hover:text-[#D4AF37] p-1 transition-colors cursor-pointer"
                title="Episode Selanjutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Timers & Streaming status */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/50 mt-1">
              <span className="font-mono text-[#D4AF37]">{formatDuration(currentTime)}</span>
              <span>/</span>
              <span className="font-mono text-white/40">{formatDuration(duration)}</span>
              <span className="hidden md:inline-block text-white/20">&bull;</span>
              <span className="hidden md:inline-flex items-center gap-1 text-[#D4AF37] font-medium uppercase tracking-wider text-[10px]">
                <Radio className="w-3 h-3" />
                Background Streaming
              </span>
            </div>
          </div>

          {/* Right: Volume, Speed & Share Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Playback Rate / Speed */}
            <div className="relative">
              <button
                id="btn-player-speed"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded text-xs font-mono font-bold bg-white/5 border border-white/10 text-white/80 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors cursor-pointer"
                title="Kecepatan Audio"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full mb-2 right-0 bg-[#161812] border border-white/10 rounded-xl p-1 shadow-2xl flex flex-col gap-1 min-w-[70px]">
                  {speedOptions.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-2 py-1 text-xs rounded text-left font-mono ${
                        playbackRate === rate
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'text-white/70 hover:bg-white/5 hover:text-[#D4AF37]'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume slider (desktop) */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="text-white/50 hover:text-[#D4AF37] p-1 cursor-pointer"
                title={isMuted ? 'Batal Senyap' : 'Senyap'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 accent-[#D4AF37] cursor-pointer h-1 bg-white/10 rounded-lg"
                aria-label="Volume slider"
              />
            </div>

            {/* Share to social media */}
            <button
              id="btn-player-share"
              onClick={onOpenSocialShare}
              className="p-1.5 text-white/50 hover:text-[#D4AF37] rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Bagikan Siaran Ini"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Expand / Details */}
            <button
              id="btn-player-expand"
              onClick={() => setIsExpanded(true)}
              className="p-1.5 text-white/50 hover:text-[#D4AF37] rounded-lg hover:bg-white/5 transition-colors cursor-pointer hidden sm:block"
              title="Perbesar Tampilan Player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
