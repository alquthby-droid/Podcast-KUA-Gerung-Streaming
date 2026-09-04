export type SpeakerRole = 'kepala_kua' | 'penghulu' | 'penyuluh_islam' | 'penyuluh_hindu' | 'host';

export interface Speaker {
  id: string;
  role: SpeakerRole;
  roleLabel: string;
  name: string;
  title: string;
  nip?: string;
  jabatan?: string;
  noAsn?: number;
  isAsn?: boolean;
  avatar: string;
  photoUrl?: string;
  bio: string;
  expertise: string[];
  quote: string;
  badgeColor: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  subtitle: string;
  category: 'moderasi' | 'bimwin' | 'fiqih' | 'hindu' | 'spesial';
  categoryLabel: string;
  duration: string; // e.g. "32:45"
  durationSeconds: number;
  releaseDate: string;
  audioUrl: string;
  coverImage: string;
  description: string;
  keyPoints: string[];
  hostId: string;
  speakerIds: string[];
  listensCount: number;
  likesCount: number;
  featured?: boolean;
}

export interface CommentReply {
  id: string;
  authorName: string;
  isOfficial: boolean;
  officialBadge?: string;
  content: string;
  timestamp: string;
}

export interface CommentItem {
  id: string;
  episodeId: string;
  authorName: string;
  authorLocation: string;
  content: string;
  targetSpeaker?: SpeakerRole | 'semua';
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
  replies: CommentReply[];
}

export interface SocialLink {
  name: string;
  platform: 'whatsapp' | 'youtube' | 'instagram' | 'facebook' | 'spotify' | 'telegram' | 'twitter';
  url: string;
  username: string;
  description: string;
}
