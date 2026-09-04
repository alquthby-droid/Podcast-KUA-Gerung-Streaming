import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Send,
  Radio,
} from 'lucide-react';
import { Episode } from '../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode?: Episode | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  episode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://kua-gerung-podcast.web.app';
  const shareTitle = episode
    ? `Podcast KUA Gerung: "${episode.title}" - Dialog Moderasi & Bimbingan Sakinah Kemenag Lombok Barat`
    : `Podcast Resmi KUA Kecamatan Gerung, Kementerian Agama Kabupaten Lombok Barat`;

  const shareText = `${shareTitle} - Dengarkan siaran audio interaktif bersama Kepala KUA, Penghulu, Penyuluh Agama Islam & Hindu di:`;

  const shareLinks = [
    {
      name: 'WhatsApp',
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: MessageCircle,
      action: () => {
        const text = encodeURIComponent(`${shareText} ${currentUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      },
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: ExternalLink,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
      },
    },
    {
      name: 'Twitter / X',
      color: 'bg-slate-900 hover:bg-black text-white',
      icon: Send,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}&hashtags=KUAGerung,KemenagLobar,ModerasiBeragama`,
          '_blank'
        );
      },
    },
    {
      name: 'Telegram',
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      icon: Send,
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
          '_blank'
        );
      },
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#161812] text-[#E0E0E0] rounded-3xl p-6 shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center shadow-sm">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Bagikan ke Media Sosial</h3>
              <p className="text-xs text-white/50">Sebarkan pencerahan & kedamaian untuk umat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Item Preview */}
        {episode && (
          <div className="my-4 p-3 bg-[#0F110C] rounded-2xl border border-white/10 flex items-center gap-3">
            <img
              src={episode.coverImage}
              alt={episode.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                Episode {episode.episodeNumber} &bull; {episode.categoryLabel}
              </span>
              <p className="text-xs font-bold text-white truncate">
                {episode.title}
              </p>
              <p className="text-[11px] text-white/50 truncate">
                KUA Kec. Gerung, Lombok Barat
              </p>
            </div>
          </div>
        )}

        {/* Social Share Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          {shareLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={item.action}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-xs cursor-pointer ${item.color}`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Copy Link */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
            Salin Tautan Langsung:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 text-xs bg-[#0F110C] border border-white/10 rounded-xl text-white/80 truncate select-all focus:outline-hidden"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#D4AF37] text-black hover:bg-[#e0be48]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-black" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-[#D4AF37] mt-1.5 font-medium">
              Tautan berhasil disalin. Silakan tempel di status medsos Anda!
            </p>
          )}
        </div>

        {/* Institution Badge */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/50">
          <div className="flex items-center gap-1.5">
            <img
              src="/logo-kemenag.svg"
              alt="Kemenag RI"
              className="w-3.5 h-3.5 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo-kemenag.png';
              }}
            />
            <span>Kementerian Agama Kab. Lombok Barat</span>
          </div>
          <span>KUA Gerung Official</span>
        </div>
      </div>
    </div>
  );
};
