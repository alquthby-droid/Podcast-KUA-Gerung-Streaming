import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Headphones,
  Award,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  FileText,
  BadgeCheck,
  Copy,
  Check,
  ExternalLink,
  TableProperties,
  LayoutGrid,
  X,
  ZoomIn
} from 'lucide-react';
import { SPEAKERS_DATA, ASN_KUA_GERUNG } from '../data/speakersData';
import { Speaker, SpeakerRole } from '../types';
import { EPISODES_DATA } from '../data/episodesData';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface SpeakerSectionProps {
  onSelectSpeakerForQuestion: (speakerRole: SpeakerRole) => void;
  onOpenEpisodeDetails: (id: string) => void;
}

export const SpeakerSection: React.FC<SpeakerSectionProps> = ({
  onSelectSpeakerForQuestion,
  onOpenEpisodeDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copiedNip, setCopiedNip] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{
    url: string;
    name: string;
    title: string;
    nip?: string;
    link?: string;
    noAsn?: number;
  } | null>(null);
  const { playEpisode } = useAudioPlayer();

  const handleCopyNip = (nip: string) => {
    navigator.clipboard.writeText(nip);
    setCopiedNip(nip);
    setTimeout(() => {
      setCopiedNip(null);
    }, 2000);
  };

  const filteredSpeakers = SPEAKERS_DATA.filter((spk) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'asn_only') return spk.noAsn !== undefined;
    return spk.role === activeFilter;
  });

  const getEpisodesForSpeaker = (speakerId: string) => {
    return EPISODES_DATA.filter(
      (ep) => ep.speakerIds.includes(speakerId) || ep.hostId === speakerId
    );
  };

  return (
    <section id="speakers-section" className="py-16 bg-[#0F110C] border-b border-white/10 text-[#E0E0E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            Host & Narasumber Resmi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Data ASN KUA Kecamatan Gerung
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/60 font-normal">
            Susunan resmi Aparatur Sipil Negara (ASN) KUA Kecamatan Gerung, Kementerian Agama Kabupaten Lombok Barat sebagai pemandu siaran (Host) dan narasumber dialog keagamaan, bimbingan keluarga, serta moderasi beragama.
          </p>

          {/* View Mode Switcher (Kartu vs Tabel Dokumen) */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="inline-flex items-center p-1 rounded-xl bg-[#161812] border border-white/10 shadow-inner">
              <button
                id="btn-view-cards"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kartu Profil Tokoh</span>
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Tabel Resmi ASN KUA</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Tabs (When in cards view) */}
          {viewMode === 'cards' && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button
                id="filter-spk-all"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-[#161812] text-white/70 hover:text-[#D4AF37] hover:bg-white/5 border border-white/10'
                }`}
              >
                Semua Tokoh ({SPEAKERS_DATA.length})
              </button>
              <button
                id="filter-spk-asn"
                onClick={() => setActiveFilter('asn_only')}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'asn_only'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-[#161812] text-white/70 hover:text-[#D4AF37] hover:bg-white/5 border border-white/10'
                }`}
              >
                Aparatur Sipil Negara ({ASN_KUA_GERUNG.length})
              </button>
              <button
                id="filter-spk-kepala"
                onClick={() => setActiveFilter('kepala_kua')}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'kepala_kua'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-[#161812] text-white/70 hover:text-[#D4AF37] hover:bg-white/5 border border-white/10'
                }`}
              >
                Kepala KUA
              </button>
              <button
                id="filter-spk-penghulu"
                onClick={() => setActiveFilter('penghulu')}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'penghulu'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-[#161812] text-white/70 hover:text-[#D4AF37] hover:bg-white/5 border border-white/10'
                }`}
              >
                Penghulu (3)
              </button>
              <button
                id="filter-spk-islam"
                onClick={() => setActiveFilter('penyuluh_islam')}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'penyuluh_islam'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-[#161812] text-white/70 hover:text-[#D4AF37] hover:bg-white/5 border border-white/10'
                }`}
              >
                Penyuluh Agama Islam (2)
              </button>
              <button
                id="filter-spk-host"
                onClick={() => setActiveFilter('host')}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'host'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-[#161812] text-white/70 hover:text-[#D4AF37] hover:bg-white/5 border border-white/10'
                }`}
              >
                Host Podcast
              </button>
              <button
                id="filter-spk-hindu"
                onClick={() => setActiveFilter('penyuluh_hindu')}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'penyuluh_hindu'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-[#161812] text-white/70 hover:text-[#D4AF37] hover:bg-white/5 border border-white/10'
                }`}
              >
                Penyuluh Agama Hindu (1)
              </button>
            </div>
          )}
        </div>

        {/* View Mode 1: TABEL DOKUMEN RESMI ASN KUA GERUNG */}
        {viewMode === 'table' ? (
          <div className="bg-[#161812] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Table Top Banner */}
            <div className="p-5 sm:p-6 bg-[#006837]/20 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-[#D4AF37]/30 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/logo-kemenag.svg"
                    alt="Kemenag RI"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo-kemenag.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                    Data Aparatur Sipil Negara (ASN) KUA &amp; Penyuluh Agama
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
                    Kantor Urusan Agama Kecamatan Gerung &bull; Kemenag Kabupaten Lombok Barat
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#006837] text-emerald-100 border border-emerald-500/40">
                {ASN_KUA_GERUNG.length} Pegawai ASN Aktif
              </span>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-white/90">
                <thead className="bg-[#0F110C] text-[11px] font-bold uppercase tracking-wider text-white/60 border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-center w-12 sm:w-16">No</th>
                    <th scope="col" className="px-4 py-3.5">Nama Pegawai / Gelar</th>
                    <th scope="col" className="px-4 py-3.5">NIP</th>
                    <th scope="col" className="px-4 py-3.5">Jabatan ASN</th>
                    <th scope="col" className="px-4 py-3.5">Peran di Podcast</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Aksi Interaktif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ASN_KUA_GERUNG.map((asn) => {
                    const speaker = SPEAKERS_DATA.find((s) => s.id === asn.speakerId);
                    const speakerEpisodes = speaker ? getEpisodesForSpeaker(speaker.id) : [];

                    return (
                      <tr key={asn.no} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-4 font-bold text-[#D4AF37] text-center">
                          {asn.no}
                        </td>
                        <td className="px-4 py-4 font-medium text-white">
                          <div className="flex items-center gap-3">
                            {speaker && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewPhoto({
                                    url: speaker.avatar,
                                    name: asn.name,
                                    title: asn.jabatan,
                                    nip: asn.nip,
                                    link: asn.photoUrl,
                                    noAsn: asn.no
                                  })
                                }
                                className="relative group/avatar cursor-pointer shrink-0"
                                title="Klik untuk perbesar foto profil ASN"
                              >
                                <img
                                  src={speaker.avatar}
                                  alt={asn.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover/avatar:ring-2 group-hover/avatar:ring-[#D4AF37] transition-all"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                                  <ZoomIn className="w-3.5 h-3.5 text-white" />
                                </div>
                              </button>
                            )}
                            <div>
                              <div className="font-bold text-white text-sm">
                                {asn.name}
                              </div>
                              <div className="text-[11px] text-white/50">
                                KUA Kec. Gerung
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono text-white/80">
                          <div className="flex items-center gap-2">
                            <span>{asn.nip}</span>
                            <button
                              onClick={() => handleCopyNip(asn.nip)}
                              className="text-white/40 hover:text-[#D4AF37] transition-colors p-1"
                              title="Salin NIP"
                            >
                              {copiedNip === asn.nip ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30">
                            {asn.jabatan}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-white/70">
                          {asn.role}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {speaker && (
                              <button
                                onClick={() => {
                                  if (speaker.role === 'host') {
                                    onSelectSpeakerForQuestion('semua');
                                  } else {
                                    onSelectSpeakerForQuestion(speaker.role);
                                  }
                                }}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 hover:text-[#D4AF37] text-white border border-white/10 transition-colors cursor-pointer"
                              >
                                Konsultasi
                              </button>
                            )}
                            {speakerEpisodes.length > 0 && (
                              <button
                                onClick={() => playEpisode(speakerEpisodes[0])}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37] hover:bg-[#e0be48] text-black transition-colors cursor-pointer"
                              >
                                Putar Siaran
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Note below table */}
            <div className="p-4 bg-[#0F110C] border-t border-white/10 text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>
                *Data ASN bersumber dari data kepegawaian resmi Kantor Urusan Agama (KUA) Kecamatan Gerung, Kemenag Lombok Barat.
              </span>
              <button
                onClick={() => setViewMode('cards')}
                className="text-[#D4AF37] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat dalam Tampilan Kartu Profil</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* View Mode 2: KARTU PROFIL NARASUMBER & HOST */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredSpeakers.map((speaker) => {
              const speakerEpisodes = getEpisodesForSpeaker(speaker.id);

              return (
                <div
                  key={speaker.id}
                  className="bg-[#161812] rounded-3xl border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#D4AF37]/50 hover:shadow-2xl transition-all duration-300 relative group"
                >
                  <div>
                    {/* Top Row: Avatar, Role Badges, Title */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewPhoto({
                              url: speaker.avatar,
                              name: speaker.name,
                              title: speaker.title,
                              nip: speaker.nip,
                              link: speaker.photoUrl,
                              noAsn: speaker.noAsn
                            })
                          }
                          className="relative group/avatar block cursor-pointer"
                          title="Klik untuk melihat foto resmi ASN ukuran penuh"
                        >
                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md border-2 border-white/10 ring-2 ring-[#D4AF37]/30 group-hover:ring-[#D4AF37] transition-all"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                            <ZoomIn className="w-5 h-5 text-white" />
                          </div>
                        </button>
                        {speaker.noAsn && (
                          <div className="absolute -bottom-2 -right-2 bg-[#006837] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400 shadow-md">
                            ASN #{speaker.noAsn}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30">
                            {speaker.roleLabel}
                          </span>
                          {speaker.isAsn && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#006837]/30 text-emerald-300 border border-emerald-500/30">
                              <BadgeCheck className="w-3 h-3 text-emerald-400" />
                              ASN Kemenag
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                          {speaker.name}
                        </h3>

                        <p className="text-xs font-semibold text-[#D4AF37] mt-1">
                          {speaker.title}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5">
                          {speaker.nip && (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-white/50 font-mono">
                                NIP. {speaker.nip}
                              </span>
                              <button
                                onClick={() => handleCopyNip(speaker.nip!)}
                                className="text-white/40 hover:text-[#D4AF37] transition-colors p-0.5"
                                title="Salin NIP"
                              >
                                {copiedNip === speaker.nip ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                              {copiedNip === speaker.nip && (
                                <span className="text-[10px] text-emerald-400 font-semibold">Tersalin!</span>
                              )}
                            </div>
                          )}

                          {speaker.photoUrl && (
                            <a
                              href={speaker.photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md border border-white/10"
                              title="Buka link foto profil ASN asli"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Link Foto</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Official Jabatan Highlight */}
                    {speaker.jabatan && (
                      <div className="mb-4 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                        <span className="text-white/50 font-medium">Jabatan Kedinasan:</span>
                        <span className="font-semibold text-white/90 text-right">{speaker.jabatan}</span>
                      </div>
                    )}

                    {/* Bio Description */}
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4 font-normal">
                      {speaker.bio}
                    </p>

                    {/* Quote / Pesan Utama */}
                    <div className="bg-[#0F110C] p-3.5 rounded-2xl border border-white/10 mb-5 italic text-xs text-white/90 relative">
                      <span className="text-[#D4AF37] font-serif font-bold text-base mr-1">“</span>
                      {speaker.quote}
                      <span className="text-[#D4AF37] font-serif font-bold text-base ml-1">”</span>
                    </div>

                    {/* Focus Areas & Topics */}
                    <div className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#D4AF37]" />
                        Bidang Kepakaran & Pelayanan:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {speaker.expertise.map((exp, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] bg-white/5 text-white/80 border border-white/5 px-2.5 py-1 rounded-lg font-medium"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#D4AF37]" />
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions: Featured episodes & Consult button */}
                  <div className="pt-4 border-t border-white/10 mt-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-white/50 flex items-center gap-1">
                        <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{speakerEpisodes.length} Episode Siaran</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {speaker.role !== 'host' ? (
                          <button
                            id={`btn-tanya-spk-${speaker.id}`}
                            onClick={() => onSelectSpeakerForQuestion(speaker.role)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-white/90 hover:bg-white/10 hover:text-[#D4AF37] border border-white/10 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Tanya {speaker.role === 'kepala_kua' ? 'Kepala KUA' : speaker.role === 'penghulu' ? 'Penghulu' : 'Penyuluh'}</span>
                          </button>
                        ) : (
                          <button
                            id={`btn-tanya-host-${speaker.id}`}
                            onClick={() => onSelectSpeakerForQuestion('semua')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-white/90 hover:bg-white/10 hover:text-[#D4AF37] border border-white/10 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Kirim Topik Siaran</span>
                          </button>
                        )}

                        {speakerEpisodes.length > 0 && (
                          <button
                            id={`btn-play-first-ep-${speaker.id}`}
                            onClick={() => playEpisode(speakerEpisodes[0])}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#e0be48] transition-colors cursor-pointer"
                            title="Putar episode terkait narasumber ini"
                          >
                            <span>Putar Siaran</span>
                            <ChevronRight className="w-3 h-3 text-black" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Preview Foto Profil Resmi ASN */}
        {previewPhoto && (
          <div
            id="modal-preview-photo"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
            onClick={() => setPreviewPhoto(null)}
          >
            <div
              className="relative bg-[#161812] border border-[#D4AF37]/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 sm:p-7 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                id="btn-close-photo-modal"
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo */}
              <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-xl mb-5 bg-black/40">
                <img
                  src={previewPhoto.url}
                  alt={previewPhoto.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {previewPhoto.noAsn && (
                  <div className="absolute bottom-2 right-2 bg-[#006837] text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400 shadow">
                    ASN #{previewPhoto.noAsn}
                  </div>
                )}
              </div>

              {/* Information */}
              <h3 className="text-xl font-bold text-white mb-1">
                {previewPhoto.name}
              </h3>
              <p className="text-xs text-[#D4AF37] font-semibold mb-2">
                {previewPhoto.title}
              </p>

              {previewPhoto.nip && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/80 mb-4">
                  <span>NIP. {previewPhoto.nip}</span>
                  <button
                    onClick={() => handleCopyNip(previewPhoto.nip!)}
                    className="text-white/40 hover:text-[#D4AF37] transition-colors p-0.5"
                    title="Salin NIP"
                  >
                    {copiedNip === previewPhoto.nip ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {copiedNip === previewPhoto.nip && (
                    <span className="text-[10px] text-emerald-400 font-semibold">Tersalin!</span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {previewPhoto.link && (
                  <a
                    href={previewPhoto.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be48] text-black font-bold text-xs transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-black" />
                    <span>Buka Tautan Foto Asli</span>
                  </a>
                )}
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
