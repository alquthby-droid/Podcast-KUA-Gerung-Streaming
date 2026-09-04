import React from 'react';
import { Play, Pause, Clock, Calendar, Share2, Sparkles, MessageSquare, Headphones } from 'lucide-react';
import { Episode } from '../types';
import { SPEAKERS_DATA } from '../data/speakersData';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface EpisodeCardProps {
  episode: Episode;
  onOpenDetails: (id: string) => void;
  onShare: (episode: Episode) => void;
  onScrollToComments: (episodeId: string) => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onOpenDetails,
  onShare,
  onScrollToComments,
}) => {
  const { currentEpisode, isPlaying, playEpisode, togglePlay } = useAudioPlayer();
  const isCurrent = currentEpisode?.id === episode.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const episodeSpeakers = SPEAKERS_DATA.filter((s) =>
    episode.speakerIds.includes(s.id)
  );

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playEpisode(episode);
    }
  };

  return (
    <div
      className={`group rounded-2xl bg-[#161812] border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isCurrentlyPlaying
          ? 'border-[#D4AF37] shadow-xl ring-1 ring-[#D4AF37]/30'
          : 'border-white/5 hover:border-[#D4AF37]/40 hover:shadow-lg'
      }`}
    >
      <div>
        {/* Cover Image & Overlays */}
        <div className="relative aspect-video overflow-hidden bg-black/60">
          <img
            src={episode.coverImage}
            alt={episode.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161812] via-transparent to-black/40"></div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 text-[#D4AF37] backdrop-blur-xs border border-[#D4AF37]/30">
              Episode {episode.episodeNumber}
            </span>
            <div className="flex items-center gap-1.5">
              {episode.isRecordedStudio && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Siaran Studio</span>
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/90 backdrop-blur-xs border border-white/10">
                {episode.categoryLabel}
              </span>
            </div>
          </div>

          {/* Play/Pause Button overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <button
              id={`btn-play-ep-${episode.id}`}
              onClick={handlePlayClick}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isCurrentlyPlaying
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                  : 'bg-[#D4AF37] text-black hover:bg-[#e2c04d]'
              }`}
            >
              {isCurrentlyPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Jeda Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black text-black ml-0.5" />
                  <span>{isCurrent ? 'Lanjutkan' : 'Putar Audio'}</span>
                </>
              )}
            </button>

            {/* Duration Badge */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-white/80 bg-black/60 px-2 py-1 rounded-md backdrop-blur-xs border border-white/10">
              <Clock className="w-3 h-3 text-[#D4AF37]" />
              <span>{episode.duration}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-[11px] text-white/50 mb-2">
            <Calendar className="w-3 h-3 text-[#D4AF37]" />
            <span>{episode.releaseDate}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-[#D4AF37] font-medium">
              <Headphones className="w-3 h-3" />
              {episode.listensCount.toLocaleString('id-ID')} pendengar
            </span>
          </div>

          <h3
            onClick={() => onOpenDetails(episode.id)}
            className="text-base font-bold text-white leading-snug hover:text-[#D4AF37] transition-colors cursor-pointer mb-2 line-clamp-2"
          >
            {episode.title}
          </h3>

          <p className="text-xs text-white/60 line-clamp-2 mb-4 leading-relaxed font-normal">
            {episode.subtitle}
          </p>

          {/* Speakers badges */}
          <div className="pt-2 border-t border-white/10 mb-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
              Narasumber:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {episodeSpeakers.map((spk) => (
                <span
                  key={spk.id}
                  className="text-[10px] font-medium bg-white/5 text-white/80 border border-white/5 px-2 py-0.5 rounded"
                  title={spk.title}
                >
                  {spk.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/5 text-xs">
        <button
          id={`btn-open-notes-${episode.id}`}
          onClick={() => onOpenDetails(episode.id)}
          className="font-bold uppercase tracking-wider text-[11px] text-[#D4AF37] hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Lihat Ringkasan</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id={`btn-discuss-ep-${episode.id}`}
            onClick={() => onScrollToComments(episode.id)}
            className="p-1.5 text-white/50 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Komentar & Diskusi Umat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            id={`btn-share-ep-${episode.id}`}
            onClick={() => onShare(episode)}
            className="p-1.5 text-white/50 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Bagikan Episode ke Media Sosial"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
