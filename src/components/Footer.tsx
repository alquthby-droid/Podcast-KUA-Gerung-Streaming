import React from 'react';
import {
  Radio,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageCircle,
  Video,
  Instagram,
  Facebook,
  Share2,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { SOCIAL_LINKS } from '../data/episodesData';

interface FooterProps {
  onOpenSocialShare: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSocialShare }) => {
  return (
    <footer className="bg-[#0F110C] text-[#E0E0E0] pt-16 pb-28 sm:pb-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-[#D4AF37]/30 p-1 flex items-center justify-center shrink-0 shadow-md">
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
                <h3 className="text-base font-bold text-white leading-tight">
                  Podcast KUA Gerung
                </h3>
                <p className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-wider">
                  Kemenag Kab. Lombok Barat
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">
                  Kementerian Agama RI
                </p>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-normal">
              Kanal siaran resmi Kantor Urusan Agama Kecamatan Gerung. Menyajikan dialog moderasi beragama, bimbingan keluarga sakinah, dan konsultasi syariah bersama Kepala KUA, Penghulu, Penyuluh Agama Islam & Hindu.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Zona Integritas WBK / WBBM</span>
            </div>
          </div>

          {/* Social Media Integration Bar */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Integrasi Media Sosial Resmi
            </h4>
            <p className="text-xs text-white/60">
              Ikuti siaran kami di berbagai platform digital:
            </p>
            <div className="space-y-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#161812] hover:bg-[#1e2218] hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    {s.platform === 'whatsapp' && <MessageCircle className="w-4 h-4 text-[#D4AF37]" />}
                    {s.platform === 'youtube' && <Video className="w-4 h-4 text-red-400" />}
                    {s.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-400" />}
                    {s.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-400" />}
                    {s.platform === 'spotify' && <Radio className="w-4 h-4 text-[#D4AF37]" />}
                    <span className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{s.name}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D4AF37] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Kontak & Lokasi Kantor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kantor KUA Kecamatan Gerung
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  Jl. Ki Hajar Dewantara No. 12, Gerung Utara, Kec. Gerung, Kabupaten Lombok Barat, Nusa Tenggara Barat 83363
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>(0370) 618-xxxx / +62 819-0712-3456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>kuagerung.lobar@kemenag.go.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Senin - Jumat (07.30 - 16.00 WITA)</span>
              </li>
            </ul>
          </div>

          {/* Kemenag Lombar Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Tautan Layanan Kemenag
            </h4>
            <div className="flex flex-col space-y-2 text-xs text-white/70">
              <a
                href="https://simkah.kemenag.go.id"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
              >
                <span>SIMKAH Web (Pendaftaran Nikah Online)</span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </a>
              <a
                href="https://kemenag.go.id"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
              >
                <span>Portal Resmi Kementerian Agama RI</span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </a>
              <a
                href="https://ntb.kemenag.go.id"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
              >
                <span>Kanwil Kemenag Provinsi NTB</span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </a>
              <a
                href="https://lombokbaratkab.kemenag.go.id"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
              >
                <span>Kantor Kemenag Kab. Lombok Barat</span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </a>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenSocialShare}
                className="w-full py-2.5 px-3 rounded-xl bg-[#161812] hover:bg-[#1e2218] text-white hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Bagikan Tautan Portal Ini</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Kantor Urusan Agama (KUA) Kecamatan Gerung, Kementerian Agama Kabupaten Lombok Barat.
          </p>
          <div className="flex items-center gap-1 text-[#D4AF37]/80">
            <span>Harmonisasi Umat Beragama di Gumi Patut Patuh Patju</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
