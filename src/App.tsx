import React, { useState } from 'react';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { EpisodeGrid } from './components/EpisodeGrid';
import { SpeakerSection } from './components/SpeakerSection';
import { CommentsSection } from './components/CommentsSection';
import { KuaServicesSection } from './components/KuaServicesSection';
import { Footer } from './components/Footer';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AudioExpandedModal } from './components/AudioExpandedModal';
import { EpisodeDetailModal } from './components/EpisodeDetailModal';
import { SocialShareModal } from './components/SocialShareModal';
import { LiveCameraStudioModal } from './components/LiveCameraStudioModal';
import { EPISODES_DATA } from './data/episodesData';
import { Episode, SpeakerRole } from './types';

export function MainPodcastApp() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [isSocialShareOpen, setIsSocialShareOpen] = useState<boolean>(false);
  const [isLiveStudioOpen, setIsLiveStudioOpen] = useState<boolean>(false);
  const [episodeToShare, setEpisodeToShare] = useState<Episode | null>(null);
  const [targetSpeakerForQuestion, setTargetSpeakerForQuestion] = useState<SpeakerRole | 'semua'>('semua');

  const selectedEpisode = EPISODES_DATA.find((e) => e.id === selectedEpisodeId) || null;

  const handleOpenEpisodeDetails = (id: string) => {
    setSelectedEpisodeId(id);
  };

  const handleOpenSocialShare = (ep?: Episode | null) => {
    setEpisodeToShare(ep || null);
    setIsSocialShareOpen(true);
  };

  const handleScrollToComments = (episodeId?: string) => {
    setActiveTab('komentar');
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSpeakerForQuestion = (speakerRole: SpeakerRole) => {
    setTargetSpeakerForQuestion(speakerRole);
    setActiveTab('komentar');
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F110C] text-[#E0E0E0] font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSocialShare={() => handleOpenSocialShare(null)}
        onOpenLiveStudio={() => setIsLiveStudioOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-16">
        {/* 1. Hero Spotlight Section */}
        <HeroBanner
          onOpenSocialShare={() => handleOpenSocialShare(EPISODES_DATA[0])}
          onOpenEpisodeDetails={handleOpenEpisodeDetails}
          onScrollToComments={() => handleScrollToComments()}
          onOpenLiveStudio={() => setIsLiveStudioOpen(true)}
        />

        {/* 2. Episode Catalog with Filters & Search */}
        <EpisodeGrid
          onOpenEpisodeDetails={handleOpenEpisodeDetails}
          onShareEpisode={(ep) => handleOpenSocialShare(ep)}
          onScrollToComments={(epId) => handleScrollToComments(epId)}
        />

        {/* 3. Host & Narasumber Profiles (Kepala KUA, Penghulu, Penyuluh Islam, Penyuluh Hindu) */}
        <SpeakerSection
          onSelectSpeakerForQuestion={handleSelectSpeakerForQuestion}
          onOpenEpisodeDetails={handleOpenEpisodeDetails}
        />

        {/* 4. Layanan Revitalisasi KUA & Jadwal Live Streaming */}
        <KuaServicesSection onOpenLiveStudio={() => setIsLiveStudioOpen(true)} />

        {/* 5. Kolom Komentar & Tanya Narasumber Interaktif */}
        <CommentsSection initialTargetSpeaker={targetSpeakerForQuestion} />
      </main>

      {/* Footer with full social media channels & office contact */}
      <Footer onOpenSocialShare={() => handleOpenSocialShare(null)} />

      {/* Persistent Docked Background Streaming Audio Player Bar */}
      <AudioPlayerBar
        onOpenSocialShare={() => handleOpenSocialShare(null)}
        onOpenEpisodeDetails={handleOpenEpisodeDetails}
      />

      {/* Fullscreen Expanded Player View */}
      <AudioExpandedModal
        onOpenSocialShare={() => handleOpenSocialShare(null)}
        onScrollToComments={handleScrollToComments}
      />

      {/* Episode Show Notes & Details Modal */}
      <EpisodeDetailModal
        episode={selectedEpisode}
        onClose={() => setSelectedEpisodeId(null)}
        onOpenSocialShare={(ep) => handleOpenSocialShare(ep)}
        onScrollToComments={handleScrollToComments}
      />

      {/* Social Media Sharing Modal (WhatsApp, Facebook, X, Telegram, Copy Link) */}
      <SocialShareModal
        isOpen={isSocialShareOpen}
        onClose={() => setIsSocialShareOpen(false)}
        episode={episodeToShare}
      />

      {/* Studio Kamera Recording & Live Streaming Modal */}
      <LiveCameraStudioModal
        isOpen={isLiveStudioOpen}
        onClose={() => setIsLiveStudioOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AudioPlayerProvider>
      <MainPodcastApp />
    </AudioPlayerProvider>
  );
}
