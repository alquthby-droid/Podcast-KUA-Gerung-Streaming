import React from 'react';
import {
  X,
  Play,
  Pause,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  MessageSquare,
  Users,
  Headphones,
  Award,
} from 'lucide-react';
import { Episode } from '../types';
import { SPEAKERS_DATA } from '../data/speakersData';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface EpisodeDetailModalProps {
  episode: Episode | null;
  onClose: () => void;
  onOpenSocialShare: (episode: Episode) => void;
  onScrollToComments: (episodeId: string) => void;
}

export const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  onClose,
  onOpenSocialShare,
  onScrollToComments,
}) => {
  const { currentEpisode, isPlaying, playEpisode, togglePlay } = useAudioPlayer();

  if (!episode) return null;

  const isCurrent = currentEpisode?.id === episode.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const episodeSpeakers = SPEAKERS_DATA.filter((s) =>
    episode.speakerIds.includes(s.id)
  );

  const handlePlayToggle = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playEpisode(episode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#161812] text-[#E0E0E0] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header Cover */}
        <div className="relative h-48 sm:h-56 bg-black shrink-0 overflow-hidden">
          <img
            src={episode.coverImage}
            alt={episode.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161812] via-[#161812]/50 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlaid Title & Category */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37] text-black uppercase tracking-wider">
                Episode {episode.episodeNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 border border-white/10 backdrop-blur-xs text-white uppercase tracking-wider">
                {episode.categoryLabel}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold leading-tight line-clamp-2 text-white">
              {episode.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Audio Action Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F110C] border border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayToggle}
                className="w-12 h-12 rounded-full bg-[#D4AF37] hover:bg-[#e0be48] text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0 font-bold"
              >
                {isCurrentlyPlaying ? (
                  <Pause className="w-5 h-5 fill-black text-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                )}
              </button>
              <div>
                <p className="text-sm font-bold text-white">
                  {isCurrentlyPlaying ? 'Audio Sedang Berjalan' : 'Putar Episode Ini'}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/60 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {episode.duration}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {episode.releaseDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSocialShare(episode)}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 hover:border-[#D4AF37]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Bagikan</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onScrollToComments(episode.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-bold hover:bg-[#e0be48] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-black" />
                <span>Komentar & Tanya</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
              Ringkasan & Latar Belakang Dialog:
            </h3>
            <p className="text-sm text-white/80 leading-relaxed font-normal">
              {episode.description}
            </p>
          </div>

          {/* Key Points */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2.5">
              Poin Penting Pembahasan:
            </h3>
            <div className="space-y-2">
              {episode.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Speakers Spotlight */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              Narasumber dalam Episode Ini:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {episodeSpeakers.map((spk) => (
                <div
                  key={spk.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0F110C] border border-white/10"
                >
                  <img
                    src={spk.avatar}
                    alt={spk.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  />
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.2 rounded mb-0.5 uppercase tracking-wider bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30">
                      {spk.roleLabel}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {spk.name}
                    </h4>
                    <p className="text-[11px] text-white/50 truncate">
                      {spk.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0F110C] border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-2">
            <img
              src="/logo-kemenag.svg"
              alt="Logo Kemenag RI"
              className="w-5 h-5 object-contain filter drop-shadow-xs"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo-kemenag.png';
              }}
            />
            <span>KUA Kecamatan Gerung &bull; Kementerian Agama Kab. Lombok Barat</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer border border-white/10 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
