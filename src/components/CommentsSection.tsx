import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ThumbsUp, CheckCircle, HelpCircle, Filter, CornerDownRight, User, MapPin } from 'lucide-react';
import { CommentItem, SpeakerRole } from '../types';
import { INITIAL_COMMENTS, EPISODES_DATA } from '../data/episodesData';
import { SPEAKERS_DATA } from '../data/speakersData';

interface CommentsSectionProps {
  initialTargetSpeaker?: SpeakerRole | 'semua';
}

const STORAGE_KEY = 'kua_gerung_podcast_comments_v1';

export const CommentsSection: React.FC<CommentsSectionProps> = ({ initialTargetSpeaker = 'semua' }) => {
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_COMMENTS as CommentItem[];
  });

  const [activeFilter, setActiveFilter] = useState<string>(initialTargetSpeaker);
  const [selectedEpisodeFilter, setSelectedEpisodeFilter] = useState<string>('all');

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [content, setContent] = useState('');
  const [targetSpeaker, setTargetSpeaker] = useState<SpeakerRole | 'semua'>(initialTargetSpeaker);
  const [relatedEpisodeId, setRelatedEpisodeId] = useState(EPISODES_DATA[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Reply states
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyName, setReplyName] = useState('');

  // Update target speaker if prop changes
  useEffect(() => {
    if (initialTargetSpeaker && initialTargetSpeaker !== 'semua') {
      setTargetSpeaker(initialTargetSpeaker);
      setActiveFilter(initialTargetSpeaker);
    }
  }, [initialTargetSpeaker]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // Storage full or unavailable
    }
  }, [comments]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newComment: CommentItem = {
      id: `user-comm-${Date.now()}`,
      episodeId: relatedEpisodeId,
      authorName: authorName.trim(),
      authorLocation: authorLocation.trim() || 'Warga Lombok Barat',
      content: content.trim(),
      targetSpeaker: targetSpeaker,
      timestamp: 'Baru saja',
      likes: 1,
      likedByMe: true,
      replies: [
        {
          id: `auto-reply-${Date.now()}`,
          authorName: getTargetSpeakerName(targetSpeaker),
          isOfficial: true,
          officialBadge: 'Petugas KUA Gerung',
          content: 'Terima kasih atas pertanyaannya. Pesan Anda telah masuk ke kanal konsultasi podcast KUA Gerung dan akan dibahas pada sesi siaran mendatang atau dihubungi via layanan resmi kami.',
          timestamp: 'Otomatis'
        }
      ]
    };

    setTimeout(() => {
      setComments([newComment, ...comments]);
      setContent('');
      setIsSubmitting(false);
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 5000);
    }, 400);
  };

  const getTargetSpeakerName = (role: SpeakerRole | 'semua') => {
    if (role === 'kepala_kua') return 'H. Marliadi, S. Ag, MA (Kepala KUA)';
    if (role === 'penghulu') return 'H. Mahput, S. HI / Tim Penghulu KUA Gerung';
    if (role === 'penyuluh_islam') return 'Hamdi Apandi / Fatmatuzzakrah (Penyuluh Islam)';
    if (role === 'penyuluh_hindu') return 'Ni Wayan Ayunita Padmiyani (Penyuluh Hindu)';
    return 'Tim Redaksi Podcast KUA Gerung';
  };

  const handleLike = (commentId: string) => {
    setComments(
      comments.map((comm) => {
        if (comm.id === commentId) {
          const isLiked = comm.likedByMe;
          return {
            ...comm,
            likes: isLiked ? comm.likes - 1 : comm.likes + 1,
            likedByMe: !isLiked
          };
        }
        return comm;
      })
    );
  };

  const handleAddReply = (commentId: string) => {
    if (!replyName.trim() || !replyContent.trim()) return;

    setComments(
      comments.map((comm) => {
        if (comm.id === commentId) {
          const newReply = {
            id: `reply-${Date.now()}`,
            authorName: replyName.trim(),
            isOfficial: false,
            content: replyContent.trim(),
            timestamp: 'Baru saja'
          };
          return {
            ...comm,
            replies: [...(comm.replies || []), newReply]
          };
        }
        return comm;
      })
    );

    setReplyingToId(null);
    setReplyContent('');
  };

  const filteredComments = comments.filter((c) => {
    const matchesSpeaker = activeFilter === 'semua' || c.targetSpeaker === activeFilter;
    const matchesEp = selectedEpisodeFilter === 'all' || c.episodeId === selectedEpisodeFilter;
    return matchesSpeaker && matchesEp;
  });

  return (
    <section id="comments-section" className="py-16 bg-[#0F110C] border-b border-white/10 text-[#E0E0E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
            Kolom Komentar & Tanya Narasumber
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ruang Dialog & Tanya Jawab Masyarakat
          </h2>
          <p className="text-sm text-white/60 mt-2 font-normal">
            Sampaikan tanggapan, pengalaman kerukunan di desa Anda, atau ajukan pertanyaan langsung kepada Kepala KUA, Penghulu, dan Penyuluh Agama Islam maupun Hindu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Submit Komentar / Tanya Jawab */}
          <div className="lg:col-span-5 bg-[#161812] border border-white/10 rounded-2xl p-6 shadow-xl sticky top-24">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Formulir Tanya & Komentar</h3>
                <p className="text-xs text-white/50">Pertanyaan dijawab langsung oleh narasumber resmi</p>
              </div>
            </div>

            {showSuccessNotification && (
              <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pertanyaan/komentar Anda berhasil dikirim dan tersimpan!</span>
              </div>
            )}

            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-comment-author-name"
                    type="text"
                    required
                    placeholder="Contoh: Baiq Nurul / I Wayan Wardana"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#0F110C] border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/40 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Asal Dusun / Kelurahan / Desa di Lombok Barat
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-comment-author-location"
                    type="text"
                    placeholder="Contoh: Gerung Selatan / Banyu Urip / Beleka / Dasan Tapen"
                    value={authorLocation}
                    onChange={(e) => setAuthorLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#0F110C] border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/40 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Ditujukan Kepada *
                  </label>
                  <select
                    id="select-target-speaker"
                    value={targetSpeaker}
                    onChange={(e) => setTargetSpeaker(e.target.value as SpeakerRole | 'semua')}
                    className="w-full px-3 py-2 text-xs bg-[#0F110C] border border-white/10 rounded-xl text-white focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/40 focus:outline-hidden font-medium"
                  >
                    <option value="semua">Semua / Diskusi Umum</option>
                    <option value="kepala_kua">Kepala KUA (H. Marliadi, S. Ag, MA)</option>
                    <option value="penghulu">Penghulu KUA (H. Mahput / Muhajirin / Rasyid)</option>
                    <option value="penyuluh_islam">Penyuluh Islam (Hamdi / Fatmatuzzakrah)</option>
                    <option value="penyuluh_hindu">Penyuluh Hindu (Ni Wayan Ayunita Padmiyani)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Terkait Episode
                  </label>
                  <select
                    id="select-related-episode"
                    value={relatedEpisodeId}
                    onChange={(e) => setRelatedEpisodeId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0F110C] border border-white/10 rounded-xl text-white focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/40 focus:outline-hidden font-medium truncate"
                  >
                    {EPISODES_DATA.map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        Ep {ep.episodeNumber}: {ep.title.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Isi Pertanyaan / Komentar *
                </label>
                <textarea
                  id="textarea-comment-content"
                  required
                  rows={4}
                  placeholder="Tuliskan pertanyaan seputar syarat nikah di SIMKAH, bimbingan keluarga sakinah, konsultasi zakat wakaf, atau pesan kerukunan..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-[#0F110C] border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/40 focus:outline-hidden resize-none"
                ></textarea>
              </div>

              <button
                id="btn-submit-comment"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e0be48] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-black" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Komentar / Pertanyaan'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: List of Comments & Official Answers */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161812] p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Filter Narasumber:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  id="btn-filter-comm-semua"
                  onClick={() => setActiveFilter('semua')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === 'semua'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#0F110C] text-white/70 hover:text-[#D4AF37] border border-white/10'
                  }`}
                >
                  Semua ({comments.length})
                </button>
                <button
                  id="btn-filter-comm-penghulu"
                  onClick={() => setActiveFilter('penghulu')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === 'penghulu'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#0F110C] text-white/70 hover:text-[#D4AF37] border border-white/10'
                  }`}
                >
                  Penghulu
                </button>
                <button
                  id="btn-filter-comm-hindu"
                  onClick={() => setActiveFilter('penyuluh_hindu')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === 'penyuluh_hindu'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#0F110C] text-white/70 hover:text-[#D4AF37] border border-white/10'
                  }`}
                >
                  Penyuluh Hindu
                </button>
                <button
                  id="btn-filter-comm-islam"
                  onClick={() => setActiveFilter('penyuluh_islam')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === 'penyuluh_islam'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#0F110C] text-white/70 hover:text-[#D4AF37] border border-white/10'
                  }`}
                >
                  Penyuluh Islam
                </button>
              </div>
            </div>

            {/* List */}
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => {
                const ep = EPISODES_DATA.find((e) => e.id === comment.episodeId);

                return (
                  <div
                    key={comment.id}
                    className="bg-[#161812] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">
                            {comment.authorName}
                          </span>
                          <span className="text-[11px] text-white/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                            {comment.authorLocation}
                          </span>
                          {comment.targetSpeaker && comment.targetSpeaker !== 'semua' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                              Untuk: {comment.targetSpeaker === 'penghulu' ? 'Penghulu KUA' : comment.targetSpeaker === 'penyuluh_hindu' ? 'Penyuluh Hindu' : comment.targetSpeaker === 'penyuluh_islam' ? 'Penyuluh Islam' : 'Kepala KUA'}
                            </span>
                          )}
                        </div>
                        {ep && (
                          <p className="text-[11px] text-[#D4AF37] font-medium mt-0.5">
                            Terkait Episode {ep.episodeNumber}: {ep.title.substring(0, 45)}...
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] text-white/40 whitespace-nowrap font-mono">
                        {comment.timestamp}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3 font-normal">
                      {comment.content}
                    </p>

                    {/* Comment Footer: Like & Reply button */}
                    <div className="flex items-center gap-4 text-xs pt-2 border-t border-white/10">
                      <button
                        id={`btn-like-comm-${comment.id}`}
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
                          comment.likedByMe
                            ? 'text-[#D4AF37] font-bold'
                            : 'text-white/50 hover:text-[#D4AF37]'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${comment.likedByMe ? 'fill-[#D4AF37]' : ''}`} />
                        <span>{comment.likes} Bermanfaat</span>
                      </button>

                      <button
                        id={`btn-toggle-reply-${comment.id}`}
                        onClick={() =>
                          setReplyingToId(replyingToId === comment.id ? null : comment.id)
                        }
                        className="text-white/50 hover:text-[#D4AF37] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Balas Komentar</span>
                      </button>
                    </div>

                    {/* Official replies & user replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pt-3 space-y-3 pl-4 border-l-2 border-[#D4AF37]/40">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`p-3 rounded-xl text-xs ${
                              reply.isOfficial
                                ? 'bg-white/5 border border-white/10 text-white'
                                : 'bg-[#0F110C] border border-white/10 text-white/80'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-[#D4AF37]">{reply.authorName}</span>
                                {reply.isOfficial && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#006837] text-white border border-[#D4AF37]/30">
                                    <CheckCircle className="w-2.5 h-2.5 text-emerald-300" />
                                    {reply.officialBadge || 'Resmi KUA'}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-white/40">
                                {reply.timestamp}
                              </span>
                            </div>
                            <p className="leading-relaxed text-white/70">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input box */}
                    {replyingToId === comment.id && (
                      <div className="mt-3 p-3 bg-[#0F110C] rounded-xl border border-white/10 space-y-2">
                        <input
                          type="text"
                          placeholder="Nama Anda..."
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-[#161812] border border-white/10 text-white rounded-lg focus:outline-hidden"
                        />
                        <textarea
                          rows={2}
                          placeholder="Tuliskan balasan Anda..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-[#161812] border border-white/10 text-white rounded-lg focus:outline-hidden resize-none"
                        ></textarea>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setReplyingToId(null)}
                            className="text-xs text-white/40 hover:text-white px-2 py-1"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            className="text-xs bg-[#D4AF37] text-black font-bold px-3 py-1 rounded-lg hover:bg-[#e0be48]"
                          >
                            Kirim Balasan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-[#161812] rounded-2xl border border-white/10 p-8 text-center">
                <p className="text-xs text-white/50">
                  Belum ada komentar untuk filter ini. Jadilah yang pertama bertanya!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
