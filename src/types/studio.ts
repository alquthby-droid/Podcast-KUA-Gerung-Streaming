export type StreamLayout = 'split' | 'pip' | 'solo-host' | 'solo-guest';

export type PrimaryCameraRole = 'guest' | 'host';

export interface StudioParticipantProfile {
  name: string;
  title: string;
  asnNo?: number;
  role: 'host' | 'narasumber';
}

export type PipAspectRatio = '16:9' | '4:3' | '1:1' | '9:16';
export type PipSizePreset = 'small' | 'medium' | 'large' | 'xlarge';

export interface PipPosition {
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  size: PipSizePreset; // preset size
  scale?: number; // custom scale percentage (18 - 60)
  aspectRatio?: PipAspectRatio; // aspect ratio: '16:9' | '4:3' | '1:1' | '9:16'
}

export interface LowerThirdPosition {
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
}

export interface CameraPanOffset {
  panX: number; // percentage shift (-50 to 50)
  panY: number; // percentage shift (-50 to 50)
  zoom: number; // scale factor (1.0 to 2.5)
}

export interface DualCameraConfig {
  layout: StreamLayout;
  hostCameraId: string;
  guestCameraId: string;
  isHostMirrored: boolean;
  isGuestMirrored: boolean;
  isHostVideoEnabled: boolean;
  isGuestVideoEnabled: boolean;
  splitRatio: number; // percentage for host in split mode (20 - 80)
  pipPosition: PipPosition;
  guestPan: CameraPanOffset;
}

