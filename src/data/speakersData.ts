import { Speaker } from '../types';

export interface AsnKuaRecord {
  no: number;
  name: string;
  nip: string;
  jabatan: string;
  speakerId: string;
  role: string;
  avatar: string;
  photoUrl: string;
}

// Data Resmi ASN KUA Kecamatan Gerung sesuai lampiran dokumen Kemenag
export const ASN_KUA_GERUNG: AsnKuaRecord[] = [
  {
    no: 1,
    name: 'H. Marliadi, S. Ag, MA',
    nip: '197312312006041046',
    jabatan: 'Kepala KUA/Penghulu Ahli Madya',
    speakerId: 'spk-marliadi',
    role: 'Kepala KUA & Narasumber Utama',
    avatar: '/asn/asn_1.webp',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-e7705ebd-a568-4f04-84be-d47c0a91fddb.webp'
  },
  {
    no: 2,
    name: 'H. Mahput, S. HI',
    nip: '197602152005011003',
    jabatan: 'Penghulu Ahli Madya',
    speakerId: 'spk-mahput',
    role: 'Penghulu Ahli Madya / Konselor Bimwin',
    avatar: '/asn/asn_2.jpg',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-0575cca9-8782-4dd5-a06f-380983e6d45d.jpg'
  },
  {
    no: 3,
    name: 'Husni, S. Kom. I',
    nip: '197512312023211026',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    speakerId: 'spk-husni',
    role: 'Host Utama & Penyuluh Agama Islam',
    avatar: '/asn/asn_3.png',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-c43b3a36-bc68-4e63-b0d5-5a68e2316bd9.png'
  },
  {
    no: 4,
    name: 'Hamdi Apandi, S. HI',
    nip: '198001012023211017',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    speakerId: 'spk-hamdi',
    role: 'Penyuluh Agama Islam / Bidang Ziswaf & Kemasjidan',
    avatar: '/asn/asn_4.jpg',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-501e3252-cd0c-4032-aca4-6f600575fb72.jpg'
  },
  {
    no: 5,
    name: 'Abdul Rasyid, S.T. HI',
    nip: '198303112023211017',
    jabatan: 'Penghulu Ahli Pertama',
    speakerId: 'spk-rasyid',
    role: 'Penghulu Ahli Pertama / Bimbingan Hisab Rukyat & Nikah',
    avatar: '/asn/asn_5.jpg',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-fd6c35f1-1fd5-4c53-9e1d-a97b4219bf79.jpg'
  },
  {
    no: 6,
    name: 'Muhajirin, Lc.',
    nip: '198304012023211010',
    jabatan: 'Penghulu Ahli Pertama',
    speakerId: 'spk-muhajirin',
    role: 'Penghulu Ahli Pertama / Fiqih Munakahat & Keluarga',
    avatar: '/asn/asn_6.jpg',
    photoUrl: 'https://kommodo.ai/i/di1p9UdK7WiaLjufwSTG'
  },
  {
    no: 7,
    name: 'Fatmatuzzakrah, SH',
    nip: '199402102025212019',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    speakerId: 'spk-fatmatuzzakrah',
    role: 'Penyuluh Agama Islam / Perlindungan Perempuan & Anak',
    avatar: '/asn/asn_7.jpg',
    photoUrl: 'https://kommodo.ai/i/SRKk2st49ryP6peSGtSH'
  },
  {
    no: 8,
    name: 'Ni Wayan Ayunita Padmiyani',
    nip: '199711272025212014',
    jabatan: 'Penyuluh Agama Hindu Ahli Pertama',
    speakerId: 'spk-ayunita',
    role: 'Penyuluh Agama Hindu (Mitra Dialog Harmoni Kemenag)',
    avatar: '/asn/asn_8.jpg',
    photoUrl: 'https://kommodo.ai/i/U8D7XmblgwJ7Z38h8ruY'
  }
];

export const SPEAKERS_DATA: Speaker[] = [
  {
    id: 'spk-marliadi',
    role: 'kepala_kua',
    roleLabel: 'Kepala KUA Kecamatan Gerung',
    name: 'H. Marliadi, S. Ag, MA',
    title: 'Kepala KUA / Penghulu Ahli Madya',
    nip: '197312312006041046',
    jabatan: 'Kepala KUA/Penghulu Ahli Madya',
    noAsn: 1,
    isAsn: true,
    avatar: '/asn/asn_1.webp',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-e7705ebd-a568-4f04-84be-d47c0a91fddb.webp',
    bio: 'Kepala Kantor Urusan Agama Kecamatan Gerung, memimpin akselerasi program Revitalisasi KUA Kementerian Agama RI di Kabupaten Lombok Barat, mewujudkan pelayanan prima, transparan, dan inklusif untuk seluruh lapisan masyarakat.',
    expertise: ['Revitalisasi KUA Kemenag', 'Kebijakan Layanan Keagamaan', 'Penguatan Moderasi Beragama', 'Kepemimpinan & Tata Kelola KUA'],
    quote: 'KUA adalah etalase Kementerian Agama di tengah masyarakat. Melalui podcast ini, kami hadir menyapa warga dengan keterbukaan, pelayanan ramah, dan nilai kebajikan.',
    badgeColor: 'bg-emerald-700 text-white'
  },
  {
    id: 'spk-mahput',
    role: 'penghulu',
    roleLabel: 'Penghulu Ahli Madya',
    name: 'H. Mahput, S. HI',
    title: 'Penghulu Ahli Madya KUA Kec. Gerung',
    nip: '197602152005011003',
    jabatan: 'Penghulu Ahli Madya',
    noAsn: 2,
    isAsn: true,
    avatar: '/asn/asn_2.jpg',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-0575cca9-8782-4dd5-a06f-380983e6d45d.jpg',
    bio: 'Penghulu senior di KUA Kecamatan Gerung berpengalaman membina calon pengantin dalam Bimbingan Perkawinan (Bimwin), memfasilitasi akad nikah, serta konsultasi mediasi sengketa rumah tangga.',
    expertise: ['Bimbingan Perkawinan (Bimwin)', 'Hukum Munakahat & Sakinah', 'Pencegahan Perceraian', 'Mediasi Masalah Keluarga'],
    quote: 'Fondasi pernikahan yang kukuh dibangun dari kesiapan spiritual, kedewasaan emosional, dan komitmen bersama untuk saling menyempurnakan.',
    badgeColor: 'bg-amber-700 text-white'
  },
  {
    id: 'spk-husni',
    role: 'host',
    roleLabel: 'Host Utama Podcast & Penyuluh',
    name: 'Husni, S. Kom. I',
    title: 'Host Podcast / Penyuluh Agama Islam Ahli Pertama',
    nip: '197512312023211026',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    noAsn: 3,
    isAsn: true,
    avatar: '/asn/asn_3.png',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-c43b3a36-bc68-4e63-b0d5-5a68e2316bd9.png',
    bio: 'Penyuluh Agama Islam dengan latar belakang Sarjana Komunikasi Islam (S.Kom.I) yang memandu siaran Podcast KUA Gerung, menjembatani aspirasi dan pertanyaan umat dengan penjelasan para ahli.',
    expertise: ['Komunikasi Publik & Penyiaran', 'Penyuluhan Berbasis Media Digital', 'Bimbingan Keagamaan Masyarakat', 'Literasi Keagamaan Umat'],
    quote: 'Media podcast menjadi jembatan pencerahan yang menghubungkan suara hati masyarakat dengan bimbingan sejuk dari KUA Kecamatan Gerung.',
    badgeColor: 'bg-slate-700 text-white'
  },
  {
    id: 'spk-hamdi',
    role: 'penyuluh_islam',
    roleLabel: 'Penyuluh Agama Islam Ahli Pertama',
    name: 'Hamdi Apandi, S. HI',
    title: 'Penyuluh Agama Islam Ahli Pertama KUA Kec. Gerung',
    nip: '198001012023211017',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    noAsn: 4,
    isAsn: true,
    avatar: '/asn/asn_4.jpg',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-501e3252-cd0c-4032-aca4-6f600575fb72.jpg',
    bio: 'Aktif terjun mendampingi majelis taklim, pembinaan remaja masjid, optimalisasi pemberdayaan zakat, infaq, dan wakaf (Ziswaf) produktif serta bimbingan keagamaan di desa-desa Kecamatan Gerung.',
    expertise: ['Literasi Zakat & Wakaf Produktif', 'Pembinaan Majelis Taklim Desa', 'Ketahanan Sosial Keagamaan', 'Edukasi Syariat Islam'],
    quote: 'Zakat dan wakaf bukan hanya ibadah ritual, melainkan instrumen nyata pengentasan kemiskinan dan kemandirian umat di Lombok Barat.',
    badgeColor: 'bg-teal-700 text-white'
  },
  {
    id: 'spk-rasyid',
    role: 'penghulu',
    roleLabel: 'Penghulu Ahli Pertama',
    name: 'Abdul Rasyid, S.T. HI',
    title: 'Penghulu Ahli Pertama KUA Kec. Gerung',
    nip: '198303112023211017',
    jabatan: 'Penghulu Ahli Pertama',
    noAsn: 5,
    isAsn: true,
    avatar: '/asn/asn_5.jpg',
    photoUrl: 'https://cdn.phototourl.com/free/2026-09-04-fd6c35f1-1fd5-4c53-9e1d-a97b4219bf79.jpg',
    bio: 'Penghulu Ahli Pertama yang berfokus pada administrasi kepenghuluan digital SIMKAH Gen 4, kalibrasi akurasi arah kiblat tempat ibadah, serta pelayanan bimbingan pernikahan terstandar.',
    expertise: ['Kalibrasi Arah Kiblat Masjid', 'Pemeriksaan Berkas Nikah SIMKAH', 'Ilmu Falak & Hisab Rukyat', 'Layanan Prima Kepenghuluan'],
    quote: 'Ketertiban administrasi dan kepatuhan regulasi menghadirkan perlindungan hukum yang sah dan berkah bagi setiap ikatan pernikahan.',
    badgeColor: 'bg-amber-700 text-white'
  },
  {
    id: 'spk-muhajirin',
    role: 'penghulu',
    roleLabel: 'Penghulu Ahli Pertama',
    name: 'Muhajirin, Lc.',
    title: 'Penghulu Ahli Pertama KUA Kec. Gerung',
    nip: '198304012023211010',
    jabatan: 'Penghulu Ahli Pertama',
    noAsn: 6,
    isAsn: true,
    avatar: '/asn/asn_6.jpg',
    photoUrl: 'https://kommodo.ai/i/di1p9UdK7WiaLjufwSTG',
    bio: 'Alumnus Timur Tengah (Lc.) yang mendalami studi hukum Islam dan fiqih munakahat. Melayani bimbingan hukum keluarga, konsultasi syariah, serta pembekalan saksi dan wali nikah.',
    expertise: ['Fiqih Munakahat Kontemporer', 'Konsultasi Syariah Keluarga', 'Bimbingan Wali & Saksi Nikah', 'Hukum Waris & Muamalah'],
    quote: 'Memahami syariat perkawinan dengan ilmu yang mendalam akan menuntun setiap rumah tangga mengarungi samudra kehidupan dengan ridha Allah SWT.',
    badgeColor: 'bg-amber-700 text-white'
  },
  {
    id: 'spk-fatmatuzzakrah',
    role: 'penyuluh_islam',
    roleLabel: 'Penyuluh Agama Islam Ahli Pertama',
    name: 'Fatmatuzzakrah, SH',
    title: 'Penyuluh Agama Islam Ahli Pertama KUA Kec. Gerung',
    nip: '199402102025212019',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    noAsn: 7,
    isAsn: true,
    avatar: '/asn/asn_7.jpg',
    photoUrl: 'https://kommodo.ai/i/SRKk2st49ryP6peSGtSH',
    bio: 'Penyuluh Agama Islam berlatar belakang Sarjana Hukum (SH) yang aktif mengawal isu perlindungan hak perempuan dan anak, pencegahan pernikahan dini, penurunan stunting, serta edukasi pra-nikah remaja.',
    expertise: ['Pencegahan Perkawinan Usia Anak', 'Perlindungan Hak Perempuan & Anak', 'Konseling Edukasi Pra-Nikah Remaja', 'Penanggulangan Stunting dari Hulu'],
    quote: 'Melindungi masa depan anak perempuan dan mendidik generasi sejak dini adalah kunci lahirnya keluarga sakinah yang sehat dan bermartabat.',
    badgeColor: 'bg-teal-700 text-white'
  },
  {
    id: 'spk-ayunita',
    role: 'penyuluh_hindu',
    roleLabel: 'Penyuluh Agama Hindu Kemenag Lobar',
    name: 'Ni Wayan Ayunita Padmiyani',
    title: 'Penyuluh Agama Hindu Ahli Pertama Kantor Kemenag Kab. Lombok Barat',
    nip: '199711272025212014',
    jabatan: 'Penyuluh Agama Hindu Ahli Pertama',
    noAsn: 8,
    isAsn: true,
    avatar: '/asn/asn_8.jpg',
    photoUrl: 'https://kommodo.ai/i/U8D7XmblgwJ7Z38h8ruY',
    bio: 'Penyuluh Agama Hindu di Kantor Kementerian Agama Kabupaten Lombok Barat yang aktif membina kerukunan umat Hindu di wilayah Gerung dan sekitarnya. Berperan dalam penguatan moderasi beragama, bimbingan keluarga harmonis bernafaskan Tri Hita Karana, serta pendampingan generasi muda lintas iman.',
    expertise: ['Filosofi Tri Hita Karana', 'Moderasi Beragama & Dialog Harmoni', 'Bimbingan Kerohanian Umat Hindu', 'Edukasi Keluarga & Kepemudaan'],
    quote: 'Tat Twam Asi dan Tri Hita Karana menuntun kita untuk selalu memuliakan sesama ciptaan Tuhan dalam jalinan persaudaraan yang tulus dan harmonis.',
    badgeColor: 'bg-indigo-700 text-white'
  }
];
