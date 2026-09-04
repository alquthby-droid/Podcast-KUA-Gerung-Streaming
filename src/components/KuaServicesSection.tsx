import React from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  HeartHandshake,
  CheckCircle,
  Radio,
  Sparkles,
  Camera,
  Video
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface KuaServicesSectionProps {
  onOpenLiveStudio?: () => void;
}

export const KuaServicesSection: React.FC<KuaServicesSectionProps> = ({ onOpenLiveStudio }) => {
  const { toggleLiveStream, isLiveStream } = useAudioPlayer();

  const services = [
    {
      title: 'Pendaftaran & Pencatatan Nikah',
      desc: 'Pelayanan nikah di kantor (Rp 0 / Gratis) dan luar kantor berbasis SIMKAH digital.',
      category: 'Layanan Nikah',
    },
    {
      title: 'Bimbingan Perkawinan (Bimwin)',
      desc: 'Kursus calon pengantin mandiri untuk membangun ketahanan keluarga sakinah.',
      category: 'Keluarga',
    },
    {
      title: 'Konsultasi & Mediasi BP4',
      desc: 'Pendampingan mediasi permasalahan rumah tangga dan pencegahan perceraian.',
      category: 'Konseling',
    },
    {
      title: 'Akta Ikrar Wakaf (AIW) Gratis',
      desc: 'Penerbitan akta ikrar wakaf tanah, masjid, musholla dan pendampingan BPN.',
      category: 'Ziswaf',
    },
    {
      title: 'Pengukuran Arah Kiblat & Falak',
      desc: 'Layanan pengukuran arah kiblat presisi dengan theodolite untuk masjid/musholla.',
      category: 'Syariah',
    },
    {
      title: 'Bimbingan Kerukunan Umat',
      desc: 'Dialog lintas iman bersama Penyuluh Agama Islam & Hindu di Kec. Gerung.',
      category: 'Moderasi Beragama',
    },
  ];

  return (
    <section id="info-kua-section" className="py-16 bg-[#0F110C] border-b border-white/10 text-[#E0E0E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Layanan Revitalisasi KUA Gerung */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                Revitalisasi KUA Kemenag RI
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pusat Layanan Keagamaan KUA Kec. Gerung
              </h2>
              <p className="text-sm text-white/60 mt-1 font-normal">
                KUA Gerung hadir dengan wajah baru yang ramah, transparan, dan melayani segenap lapisan masyarakat di Kabupaten Lombok Barat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc, idx) => (
                <div
                  key={idx}
                  className="bg-[#161812] p-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all hover:shadow-lg"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                    {svc.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2.5 mb-1">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed font-normal">
                    {svc.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Jam Pelayanan Info */}
            <div className="p-5 bg-[#161812] border border-[#D4AF37]/30 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-[#D4AF37]/30 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/logo-kemenag.svg"
                    alt="Logo Kementerian Agama RI"
                    className="w-full h-full object-contain filter drop-shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo-kemenag.png';
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    Jam Pelayanan Kantor KUA Gerung
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5">
                    Senin - Kamis: 07.30 - 16.00 WITA | Jumat: 07.30 - 16.30 WITA
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/6281907123456?text=Halo%20Admin%20KUA%20Gerung,%20saya%20ingin%20berkonsultasi%20layanan"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e0be48] text-black text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-md"
              >
                Chat WhatsApp Pelayanan
              </a>
            </div>
          </div>

          {/* Right Column: Jadwal Siaran Podcast & Live Audio */}
          <div className="lg:col-span-5 bg-[#161812] rounded-3xl border border-white/10 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Jadwal Siaran & Live Audio</h3>
              </div>
              <span className="text-[11px] font-bold bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] px-2.5 py-0.5 rounded-full">
                WITA (Lombok)
              </span>
            </div>

            {/* Broadcast card */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#0F110C] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#D4AF37]">Setiap Rabu &bull; 09.30 WITA</span>
                  <span className="text-[10px] bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] font-bold uppercase px-2 py-0.2 rounded">
                    Rutin
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  Dialog Bimbingan Sakinah & Hukum Keluarga
                </h4>
                <p className="text-[11px] text-white/50">
                  Bersama Penghulu KUA Gerung & Konselor Rumah Tangga.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0F110C] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#D4AF37]">Setiap Jumat &bull; 14.00 WITA</span>
                  <span className="text-[10px] bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] font-bold uppercase px-2 py-0.2 rounded">
                    Lintas Agama
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  Pojok Harmoni Sasak: Dialog Islam & Hindu
                </h4>
                <p className="text-[11px] text-white/50">
                  Bersama Penyuluh Agama Islam & Penyuluh Agama Hindu Kemenag Lobar.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0F110C] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#D4AF37]">Minggu Ke-1 & 3 &bull; 10.00 WITA</span>
                  <span className="text-[10px] bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] font-bold uppercase px-2 py-0.2 rounded">
                    Khusus
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  Suara Kepala KUA: Kebijakan & Transparansi Layanan
                </h4>
                <p className="text-[11px] text-white/50">
                  Bersama Kepala KUA Kecamatan Gerung H. Marliadi, S. Ag, MA
                </p>
              </div>
            </div>

            {/* Live Streaming & Camera Studio Toggles */}
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <button
                id="btn-toggle-live-audio"
                onClick={toggleLiveStream}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLiveStream
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md ring-2 ring-rose-300'
                    : 'bg-[#D4AF37] hover:bg-[#e0be48] text-black font-bold shadow-md'
                }`}
              >
                <Radio className={`w-4 h-4 ${isLiveStream ? 'animate-ping' : ''}`} />
                <span>
                  {isLiveStream
                    ? 'Anda Sedang Mendengarkan Live Streaming KUA (Klik untuk Hentikan)'
                    : 'Mulai Streaming Siaran Langsung (Live Audio)'}
                </span>
              </button>

              {onOpenLiveStudio && (
                <button
                  id="btn-open-camera-studio-section"
                  onClick={onOpenLiveStudio}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 hover:border-red-400"
                >
                  <Camera className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>Buka Studio Kamera Recording & Live Streaming</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
