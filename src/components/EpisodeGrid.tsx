import React, { useState, useEffect } from 'react';
import { Search, Filter, Headphones, Sparkles, BookOpen, Video } from 'lucide-react';
import { Episode } from '../types';
import { getAllEpisodes } from '../utils/broadcastArchive';
import { EpisodeCard } from './EpisodeCard';

interface EpisodeGridProps {
  episodes?: Episode[];
  onOpenEpisodeDetails: (id: string) => void;
  onShareEpisode: (episode: Episode) => void;
  onScrollToComments: (episodeId: string) => void;
}

export const EpisodeGrid: React.FC<EpisodeGridProps> = ({
  episodes: propEpisodes,
  onOpenEpisodeDetails,
  onShareEpisode,
  onScrollToComments,
}) => {
  const [localEpisodes, setLocalEpisodes] = useState<Episode[]>(propEpisodes || getAllEpisodes());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (propEpisodes) {
      setLocalEpisodes(propEpisodes);
    } else {
      setLocalEpisodes(getAllEpisodes());
    }
  }, [propEpisodes]);

  useEffect(() => {
    const handleSync = () => {
      setLocalEpisodes(getAllEpisodes());
    };
    window.addEventListener('kua_broadcast_saved', handleSync);
    return () => window.removeEventListener('kua_broadcast_saved', handleSync);
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Episode' },
    { id: 'spesial', label: '🎥 Siaran Studio KUA' },
    { id: 'moderasi', label: 'Moderasi Beragama' },
    { id: 'bimwin', label: 'Bimwin & Sakinah' },
    { id: 'fiqih', label: 'Ziswaf & Layanan KUA' },
    { id: 'hindu', label: 'Bimbingan Hindu' },
  ];

  const activeEpisodes = propEpisodes || localEpisodes;

  const filteredEpisodes = activeEpisodes.filter((ep) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      ep.category === selectedCategory ||
      (selectedCategory === 'spesial' && ep.isRecordedStudio);
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      ep.title.toLowerCase().includes(query) ||
      ep.subtitle.toLowerCase().includes(query) ||
      ep.description.toLowerCase().includes(query) ||
      ep.keyPoints.some((kp) => kp.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="episodes-section" className="py-16 bg-[#0F110C] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
              <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
              Koleksi Audio Podcast Kemenag Lobar
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Arsip Episode Siaran
            </h2>
            <p className="text-sm text-white/60 mt-1 max-w-xl font-normal">
              Dengarkan dialog eksklusif seputar moderasi beragama, bimbingan pranikah mandiri, zakat wakaf, dan keharmonisan masyarakat Kecamatan Gerung.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-episodes"
              type="text"
              placeholder="Cari topik, narasumber, bahasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#161812] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-hidden focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-[#D4AF37]"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-[#D4AF37] shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'bg-[#161812] text-white/70 hover:text-[#D4AF37] hover:bg-white/5 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        {filteredEpisodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                onOpenDetails={onOpenEpisodeDetails}
                onShare={onShareEpisode}
                onScrollToComments={onScrollToComments}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#161812] rounded-2xl border border-white/10 p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Tidak ada episode yang cocok</h4>
            <p className="text-xs text-white/50 mt-1">
              Coba gunakan kata kunci pencarian lain atau pilih kategori Semua Episode.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-1.5 bg-[#D4AF37] text-black rounded-lg text-xs font-bold hover:bg-[#e0be48] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
