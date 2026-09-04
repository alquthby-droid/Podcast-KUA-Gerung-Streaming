import React from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  MessageSquare,
  Clock,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { formatDuration } from '../utils/formatters';
import { SPEAKERS_DATA } from '../data/speakersData';

interface AudioExpandedModalProps {
  onOpenSocialShare: () => void;
  onScrollToComments: (episodeId: string) => void;
}

export const AudioExpandedModal: React.FC<AudioExpandedModalProps> = ({
  onOpenSocialShare,
  onScrollToComments,
}) => {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    isExpanded,
    setIsExpanded,
    togglePlay,
    seek,
    skipTime,
    setPlaybackRate,
    setVolume,
    toggleMute,
    playNext,
    playPrev,
  } = useAudioPlayer();

  if (!isExpanded || !currentEpisode) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const episodeSpeakers = SPEAKERS_DATA.filter((s) =>
    currentEpisode.speakerIds.includes(s.id)
  );

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    const newTime = (newPercent / 100) * duration;
    seek(newTime);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#161812] via-[#161812] to-[#0F110C] text-[#E0E0E0] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-[#D4AF37] uppercase">
              Siaran Audio KUA Gerung &bull; Lombok Barat
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover Art & Waveform */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10 group">
            <img
              src={currentEpisode.coverImage}
              alt={currentEpisode.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 text-center">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#D4AF37] text-black uppercase tracking-wider">
                Episode {currentEpisode.episodeNumber}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-wider">
              {currentEpisode.categoryLabel}
            </span>
            <h3 className="text-lg sm:text-xl font-bold leading-snug text-white">
              {currentEpisode.title}
            </h3>
            <p className="text-xs text-white/60 line-clamp-3 font-normal">
              {currentEpisode.subtitle}
            </p>

            {/* Narasumber in episode */}
            <div className="pt-2">
              <p className="text-[10px] uppercase font-bold text-white/40 mb-1">
                Narasumber:
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {episodeSpeakers.map((spk) => (
                  <span
                    key={spk.id}
                    className="text-[11px] bg-[#0F110C] text-[#D4AF37] px-2.5 py-0.5 rounded-md border border-white/10 font-medium"
                  >
                    {spk.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Simulated Waveform Bars */}
        <div className="h-10 bg-[#0F110C] rounded-xl p-2 mb-4 border border-white/10 flex items-center justify-between gap-1 overflow-hidden">
          {Array.from({ length: 36 }).map((_, i) => {
            const height = isPlaying
              ? Math.sin(i * 0.4 + (currentTime % 5)) * 14 + 16
              : 8;
            return (
              <div
                key={i}
                style={{ height: `${height}px` }}
                className="w-1.5 bg-[#D4AF37] rounded-full transition-all duration-150"
              ></div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-6">
          <div className="relative group w-full h-2 bg-white/10 rounded-full cursor-pointer">
            <div
              className="h-full bg-[#D4AF37] rounded-full relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md"></span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progressPercentage || 0}
              onChange={handleSeekChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Expanded seek bar"
            />
          </div>
          <div className="flex justify-between text-xs text-white/50 font-mono">
            <span className="text-[#D4AF37]">{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Main Center Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={playPrev}
            className="p-2 text-white/50 hover:text-[#D4AF37] transition-colors cursor-pointer"
            title="Episode Sebelumnya"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={() => skipTime(-10)}
            className="p-2 text-white/50 hover:text-[#D4AF37] transition-colors cursor-pointer"
            title="Mundur 10 Detik"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#D4AF37] hover:bg-[#e0be48] text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer font-bold"
            title={isPlaying ? 'Jeda' : 'Putar'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-black text-black" />
            ) : (
              <Play className="w-7 h-7 fill-black text-black ml-1" />
            )}
          </button>

          <button
            onClick={() => skipTime(10)}
            className="p-2 text-white/50 hover:text-[#D4AF37] transition-colors cursor-pointer"
            title="Maju 10 Detik"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            onClick={playNext}
            className="p-2 text-white/50 hover:text-[#D4AF37] transition-colors cursor-pointer"
            title="Episode Berikutnya"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Auxiliary Controls (Volume, Speed, Discussion, Share) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
          {/* Speed Buttons */}
          <div className="flex items-center gap-1">
            <span className="text-white/50 mr-1 uppercase text-[10px] tracking-wider">Kecepatan:</span>
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`px-2 py-1 rounded text-xs font-mono font-semibold cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'bg-[#0F110C] text-white/70 hover:text-[#D4AF37] border border-white/10'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-white/50 hover:text-[#D4AF37] cursor-pointer">
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
              className="w-20 accent-[#D4AF37] cursor-pointer h-1.5 bg-white/10 rounded-lg"
              aria-label="Volume controller"
            />
          </div>

          {/* Quick jump to comments & share */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsExpanded(false);
                onScrollToComments(currentEpisode.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#D4AF37]/40 flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Buka Komentar</span>
            </button>

            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenSocialShare();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be48] text-black flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Share2 className="w-3.5 h-3.5 text-black" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
