import React from 'react';
import { Radio, Headphones, Volume2, Share2, MessageSquare, Users, BookOpen, Camera, Video } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSocialShare: () => void;
  onOpenLiveStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSocialShare,
  onOpenLiveStudio
}) => {
  const { isPlaying, togglePlay, currentEpisode } = useAudioPlayer();

  const scrollToSection = (id: string, tabName: string) => {
    setActiveTab(tabName);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#161812]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      {/* Top micro bar for official notice */}
      <div className="bg-[#0B0D09] text-white/70 text-xs py-1.5 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span className="font-medium tracking-wide text-white/80">
              Kementerian Agama RI &bull; Kantor Kemenag Kab. Lombok Barat &bull; KUA Kec. Gerung
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <span className="hidden sm:inline">Pusat Layanan Keagamaan & Moderasi Beragama</span>
            <button
              id="top-btn-share-portal"
              onClick={onOpenSocialShare}
              className="hover:text-[#D4AF37] flex items-center gap-1 transition-colors cursor-pointer text-white/80"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Bagikan Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <div
            id="brand-logo-button"
            onClick={() => scrollToSection('hero-section', 'beranda')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* Logo Resmi Kementerian Agama RI */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 p-1 rounded-xl bg-white/5 border border-[#D4AF37]/40 shadow-md group-hover:scale-105 group-hover:border-[#D4AF37] transition-all">
              <img
                src="/logo-kemenag.svg"
                alt="Logo Kementerian Agama Republik Indonesia"
                className="w-full h-full object-contain filter drop-shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-kemenag.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#D4AF37] group-hover:text-amber-300 transition-colors uppercase">
                  PODCAST KUA GERUNG
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#006837]/60 text-emerald-300 border border-[#D4AF37]/30">
                  Lombok Barat
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-medium">
                Kementerian Agama Kabupaten Lombok Barat
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-link-beranda"
              onClick={() => scrollToSection('hero-section', 'beranda')}
              className={`px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer ${
                activeTab === 'beranda'
                  ? 'text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 font-bold'
                  : 'text-white/70 hover:text-[#D4AF37] hover:bg-white/5'
              }`}
            >
              Beranda
            </button>
            <button
              id="nav-link-episode"
              onClick={() => scrollToSection('episodes-section', 'episode')}
              className={`px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'episode'
                  ? 'text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 font-bold'
                  : 'text-white/70 hover:text-[#D4AF37] hover:bg-white/5'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Arsip Episode</span>
            </button>
            <button
              id="nav-link-narasumber"
              onClick={() => scrollToSection('speakers-section', 'narasumber')}
              className={`px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'narasumber'
                  ? 'text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 font-bold'
                  : 'text-white/70 hover:text-[#D4AF37] hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Narasumber</span>
            </button>
            <button
              id="nav-link-komentar"
              onClick={() => scrollToSection('comments-section', 'komentar')}
              className={`px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'komentar'
                  ? 'text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 font-bold'
                  : 'text-white/70 hover:text-[#D4AF37] hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Kolom Komentar</span>
            </button>
            <button
              id="nav-link-layanan"
              onClick={() => scrollToSection('info-kua-section', 'layanan')}
              className={`px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'layanan'
                  ? 'text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 font-bold'
                  : 'text-white/70 hover:text-[#D4AF37] hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Layanan KUA</span>
            </button>
          </nav>

          {/* Audio Quick Status & Live button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onOpenLiveStudio && (
              <button
                id="btn-nav-camera-studio"
                onClick={onOpenLiveStudio}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer bg-red-600/90 hover:bg-red-600 text-white border border-red-500/50 hover:shadow-red-900/30"
                title="Buka Studio Dual Camera (Host & Narasumber)"
              >
                <Camera className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="hidden md:inline uppercase tracking-wider text-[11px]">Dual Cam Studio</span>
                <span className="md:hidden text-[11px]">Dual Cam</span>
              </button>
            )}

            <button
              id="btn-nav-listen-toggle"
              onClick={togglePlay}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
                isPlaying
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse ring-2 ring-red-400/40'
                  : 'bg-[#D4AF37] text-black hover:bg-[#e0be48]'
              }`}
              title={isPlaying ? 'Jeda Audio' : 'Putar Audio Streaming'}
            >
              {isPlaying ? (
                <>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <Volume2 className="w-4 h-4 text-white animate-bounce" />
                  <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Streaming Aktif</span>
                  <span className="sm:hidden">Live</span>
                </>
              ) : (
                <>
                  <Headphones className="w-4 h-4 text-black" />
                  <span className="uppercase tracking-wider text-[11px]">{currentEpisode ? 'Putar Audio' : 'Dengar'}</span>
                </>
              )}
            </button>

            <button
              id="btn-nav-share"
              onClick={onOpenSocialShare}
              className="p-2.5 rounded-xl border border-white/10 text-white/70 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:bg-white/5 transition-colors cursor-pointer"
              title="Bagikan Podcast ke Media Sosial"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
