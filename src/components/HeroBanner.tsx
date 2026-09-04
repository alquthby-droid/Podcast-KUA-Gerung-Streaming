import React, { useState, useEffect } from 'react';
import { Play, Pause, Radio, Share2, MessageSquare, CheckCircle, Sparkles, Volume2, ShieldCheck, Camera, Calendar, Clock, Bell } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { EPISODES_DATA } from '../data/episodesData';
import { SPEAKERS_DATA } from '../data/speakersData';
import { getIndonesianDateDetails } from '../utils/formatters';

interface HeroBannerProps {
  onOpenSocialShare: () => void;
  onOpenEpisodeDetails: (id: string) => void;
  onScrollToComments: () => void;
  onOpenLiveStudio?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenSocialShare,
  onOpenEpisodeDetails,
  onScrollToComments,
  onOpenLiveStudio,
}) => {
  const { isPlaying, currentEpisode, playEpisode, togglePlay } = useAudioPlayer();
  const featuredEpisode = EPISODES_DATA[0];
  const isFeaturedPlaying = isPlaying && currentEpisode?.id === featuredEpisode.id;

  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateDetails = getIndonesianDateDetails(currentDateTime);

  const handlePlayFeatured = () => {
    if (isFeaturedPlaying) {
      togglePlay();
    } else {
      playEpisode(featuredEpisode);
    }
  };

  return (
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-br from-[#1A1D15] via-[#131610] to-[#0F110C] text-[#E0E0E0] pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-white/10">
      {/* Subtle geometric islamic / sasak background pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30 shadow-xs">
              <img
                src="/logo-kemenag.svg"
                alt="Logo Kemenag RI"
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-kemenag.png';
                }}
              />
              <span>Kementerian Agama RI</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 text-white/90 border border-white/10 shadow-xs">
              <Radio className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              Podcast Resmi KUA Gerung
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-[#006837]/40 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Revitalisasi KUA
            </span>
          </div>
          <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-sm animate-pulse tracking-wider">
            LIVE &bull; STREAMING AKTIF
          </span>
        </div>

        {/* RUNNING TEKS TOPIK PODCAST DENGAN HARI, TANGGAL, BULAN, TAHUN */}
        <div className="mb-7 rounded-2xl bg-gradient-to-r from-[#172015] via-[#1b2518] to-[#121810] border border-[#D4AF37]/45 shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch">
          {/* Label Badge 1: Topik Podcast On-Air */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-gradient-to-r from-red-700 to-red-600 text-white px-3.5 py-2 font-black text-xs uppercase tracking-wider shrink-0 shadow-md border-b md:border-b-0 md:border-r border-[#D4AF37]/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0"></span>
              <Radio className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>TOPIK PODCAST</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-black/40 text-[#D4AF37] text-[10px] font-mono border border-[#D4AF37]/30">
              LIVE
            </span>
          </div>

          {/* Label Badge 2: Hari, Tanggal, Bulan, Tahun & Jam Siaran */}
          <div className="flex items-center gap-2 bg-[#006837] px-3.5 py-2 text-white text-xs font-semibold shrink-0 border-b md:border-b-0 md:border-r border-emerald-500/40">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#D4AF37] font-black uppercase tracking-wide">
                {dateDetails.dayName},
              </span>
              <span className="text-white font-bold">
                {dateDetails.dateNum} {dateDetails.monthName} {dateDetails.year}
              </span>
              <span className="text-emerald-200/80 font-mono text-[11px] ml-1 pl-1.5 border-l border-emerald-400/40 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
                {dateDetails.timeString}
              </span>
            </div>
          </div>

          {/* Scrolling Infinite Running Text Marquee */}
          <div className="relative flex-1 overflow-hidden py-2 px-3 flex items-center bg-black/50 backdrop-blur-xs">
            <div className="animate-marquee flex items-center whitespace-nowrap">
              {/* Item Loop 1 */}
              <div className="flex items-center gap-6 pr-6 text-xs text-white">
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>TOPIK UTAMA EP. 01:</span>
                  <strong className="text-white font-extrabold">{EPISODES_DATA[0].title}</strong>
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-white/80">
                  Jadwal: <span className="text-[#D4AF37] font-semibold">{dateDetails.fullDate}</span> ({dateDetails.timeString})
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-amber-300 font-medium">
                  Narasumber: H. Lalu Muhammad Amin, S.Ag & I Made Astawa, S.Ag
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
                  <span>TOPIK EP. 02:</span>
                  <strong className="text-white font-extrabold">{EPISODES_DATA[1].title}</strong>
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
                  <span>TOPIK EP. 03:</span>
                  <strong className="text-white font-extrabold">{EPISODES_DATA[2].title}</strong>
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-white/70">
                  KUA KECAMATAN GERUNG &bull; KEMENTERIAN AGAMA KABUPATEN LOMBOK BARAT &bull; REVITALISASI LAYANAN UMAT
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
              </div>

              {/* Item Loop 2 (Duplicate for Seamless Scroll) */}
              <div className="flex items-center gap-6 pr-6 text-xs text-white" aria-hidden="true">
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>TOPIK UTAMA EP. 01:</span>
                  <strong className="text-white font-extrabold">{EPISODES_DATA[0].title}</strong>
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-white/80">
                  Jadwal: <span className="text-[#D4AF37] font-semibold">{dateDetails.fullDate}</span> ({dateDetails.timeString})
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-amber-300 font-medium">
                  Narasumber: H. Lalu Muhammad Amin, S.Ag & I Made Astawa, S.Ag
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
                  <span>TOPIK EP. 02:</span>
                  <strong className="text-white font-extrabold">{EPISODES_DATA[1].title}</strong>
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
                  <span>TOPIK EP. 03:</span>
                  <strong className="text-white font-extrabold">{EPISODES_DATA[2].title}</strong>
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
                <span className="text-white/70">
                  KUA KECAMATAN GERUNG &bull; KEMENTERIAN AGAMA KABUPATEN LOMBOK BARAT &bull; REVITALISASI LAYANAN UMAT
                </span>
                <span className="text-[#D4AF37] font-black">&bull;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Mission, Title & CTA */}
          <div className="lg:col-span-7 space-y-5">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest block">
              Episode Unggulan &bull; Dialog Harmoni Sasak
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-snug text-white">
              Harmoni Moderasi:
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-serif italic text-white/95 mt-2 font-normal">
                Dialog Lintas Agama di Jantung Lombok Barat
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl font-normal">
              Media komunikasi dan bimbingan keagamaan resmi Kantor Urusan Agama Kecamatan Gerung, Kementerian Agama Kabupaten Lombok Barat. Mengulas harmonisasi kehidupan lintas umat beragama, bekal perkawinan sakinah, dan konsultasi syariah bersama para narasumber berkompeten.
            </p>

            {/* Narasumber Badges Quick Bar */}
            <div className="pt-1">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">
                Host & Narasumber Utama:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-white/90 border border-white/10">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Kepala KUA Gerung
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-white/90 border border-white/10">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Penghulu Ahli
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-white/90 border border-white/10">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Penyuluh Agama Islam
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-white/90 border border-white/10">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                  Penyuluh Agama Hindu
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                id="btn-hero-play-featured"
                onClick={handlePlayFeatured}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm bg-[#D4AF37] hover:bg-[#e2c04d] text-black shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                {isFeaturedPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-black text-black" />
                    <span>Jeda Siaran</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black text-black" />
                    <span>Dengarkan Episode Terkini</span>
                  </>
                )}
              </button>

              <button
                id="btn-hero-tanya-narasumber"
                onClick={onScrollToComments}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span>Kirim Pertanyaan / Komentar</span>
              </button>

              {onOpenLiveStudio && (
                <button
                  id="btn-hero-camera-studio"
                  onClick={onOpenLiveStudio}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border border-red-400/40 shadow-lg shadow-red-950/40 transition-all cursor-pointer hover:scale-102"
                >
                  <Camera className="w-4 h-4 text-white animate-pulse" />
                  <span>Studio Dual Camera (Host & Narasumber)</span>
                </button>
              )}

              <button
                id="btn-hero-share"
                onClick={onOpenSocialShare}
                className="inline-flex items-center gap-2 px-3.5 py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-white/70 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer border border-white/10"
                title="Bagikan ke WhatsApp, Facebook, dll"
              >
                <Share2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden sm:inline">Bagikan</span>
              </button>
            </div>

            {/* Background Streaming Feature Notification */}
            <div className="flex items-center gap-3 pt-2 text-xs text-white/70 bg-black/40 p-3 rounded-xl border border-white/10 backdrop-blur-md">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping shrink-0"></div>
              <p>
                <span className="font-bold text-[#D4AF37]">Fitur Background Streaming:</span> Audio tetap mengalun secara otomatis meskipun Anda membaca show notes narasumber atau mengirim komentar dialog.
              </p>
            </div>
          </div>

          {/* Right Column: Featured Episode Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30">
                  Episode #{featuredEpisode.episodeNumber} Terpopuler
                </span>
                <span className="text-[11px] text-white/50 font-mono">
                  {featuredEpisode.duration} &bull; {featuredEpisode.releaseDate}
                </span>
              </div>

              {/* Cover Art with Speaker Mini Thumbnails */}
              <div className="relative rounded-xl overflow-hidden aspect-video mb-4 bg-black/60 border border-white/10 group">
                <img
                  src={featuredEpisode.coverImage}
                  alt={featuredEpisode.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F110C] via-[#0F110C]/40 to-transparent"></div>

                {/* Overlaid Play Button & Soundwaves */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-card-play-featured"
                      onClick={handlePlayFeatured}
                      className="w-12 h-12 rounded-full bg-[#D4AF37] hover:bg-[#e2c04d] text-black flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer shrink-0"
                    >
                      {isFeaturedPlaying ? (
                        <Pause className="w-5 h-5 fill-black text-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                      )}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isFeaturedPlaying ? 'Sedang Diputar' : 'Putar Audio'}
                      </p>
                      <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider">
                        {isFeaturedPlaying ? 'Background Streaming' : 'Klik untuk mendengarkan'}
                      </p>
                    </div>
                  </div>

                  {/* Animated Wave Indicator if playing */}
                  {isFeaturedPlaying && (
                    <div className="flex items-end gap-1 h-5">
                      <span className="w-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.3s] h-4"></span>
                      <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.1s] h-5"></span>
                      <span className="w-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.4s] h-3"></span>
                      <span className="w-1 bg-white/60 rounded-full animate-bounce [animation-delay:-0.2s] h-4"></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Preview */}
              <h3
                onClick={() => onOpenEpisodeDetails(featuredEpisode.id)}
                className="text-base sm:text-lg font-bold text-white leading-snug hover:text-[#D4AF37] transition-colors cursor-pointer mb-2 line-clamp-2"
              >
                {featuredEpisode.title}
              </h3>

              <p className="text-xs text-white/60 line-clamp-2 mb-4">
                {featuredEpisode.description}
              </p>

              {/* Speakers in this episode */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex -space-x-2 overflow-hidden">
                  {SPEAKERS_DATA.filter((s) => featuredEpisode.speakerIds.includes(s.id) || featuredEpisode.hostId === s.id).map((speaker) => (
                    <img
                      key={speaker.id}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-[#161812] object-cover"
                      src={speaker.avatar}
                      alt={speaker.name}
                      title={`${speaker.name} (${speaker.roleLabel})`}
                    />
                  ))}
                </div>

                <button
                  id="btn-view-notes-featured"
                  onClick={() => onOpenEpisodeDetails(featuredEpisode.id)}
                  className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lihat Catatan Dialog</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-[#161812] rounded-xl p-4 border border-white/5">
            <div className="text-2xl font-extrabold text-[#D4AF37]">6+</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Episode Tersedia</div>
          </div>
          <div className="bg-[#161812] rounded-xl p-4 border border-white/5">
            <div className="text-2xl font-extrabold text-[#D4AF37]">8 ASN</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Penghulu, Penyuluh & Host</div>
          </div>
          <div className="bg-[#161812] rounded-xl p-4 border border-white/5">
            <div className="text-2xl font-extrabold text-[#D4AF37]">100%</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Gratis & Terbuka untuk Umum</div>
          </div>
          <div className="bg-[#161812] rounded-xl p-4 border border-white/5">
            <div className="text-2xl font-extrabold text-[#D4AF37]">Lobar</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Kabupaten Lombok Barat</div>
          </div>
        </div>
      </div>
    </section>
  );
};
