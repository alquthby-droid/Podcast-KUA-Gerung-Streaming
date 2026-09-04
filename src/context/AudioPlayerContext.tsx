import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Episode } from '../types';
import { EPISODES_DATA } from '../data/episodesData';

interface AudioPlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isLiveStream: boolean;
  isExpanded: boolean;
  playEpisode: (episode: Episode) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  skipTime: (seconds: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleLiveStream: () => void;
  setIsExpanded: (expanded: boolean) => void;
  playNext: () => void;
  playPrev: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(EPISODES_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(EPISODES_DATA[0].durationSeconds);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLiveStream, setIsLiveStream] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const synthAudioCtxRef = useRef<AudioContext | null>(null);

  // Initialize HTML5 Audio Element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.currentTime) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      playNext();
    };

    const handleError = () => {
      // If external audio source fails or blocked in iframe, activate simulated audio synth loop
      startSimulatedAudioTimer();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      if (synthTimerRef.current) {
        window.clearInterval(synthTimerRef.current);
      }
    };
  }, []);

  // Web Audio peaceful chime/presence tone for fallback
  const triggerGentleChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!synthAudioCtxRef.current) {
        synthAudioCtxRef.current = new AudioCtx();
      }
      const ctx = synthAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.04 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Ignore audio context errors if not allowed yet
    }
  };

  const startSimulatedAudioTimer = () => {
    if (synthTimerRef.current) window.clearInterval(synthTimerRef.current);
    synthTimerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1 * playbackRate;
        const total = duration || 1800;
        if (next >= total) {
          playNext();
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  const stopSimulatedAudioTimer = () => {
    if (synthTimerRef.current) {
      window.clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  const playEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
    setDuration(episode.durationSeconds);
    setCurrentTime(0);
    setIsLiveStream(false);

    if (audioRef.current) {
      audioRef.current.src = episode.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          stopSimulatedAudioTimer();
        })
        .catch(() => {
          // Play fallback timer
          setIsPlaying(true);
          triggerGentleChime();
          startSimulatedAudioTimer();
        });
    } else {
      setIsPlaying(true);
      startSimulatedAudioTimer();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSimulatedAudioTimer();
  };

  const resume = () => {
    if (!currentEpisode && EPISODES_DATA.length > 0) {
      playEpisode(EPISODES_DATA[0]);
      return;
    }
    setIsPlaying(true);
    if (audioRef.current && audioRef.current.src) {
      audioRef.current
        .play()
        .then(() => {
          stopSimulatedAudioTimer();
        })
        .catch(() => {
          triggerGentleChime();
          startSimulatedAudioTimer();
        });
    } else {
      triggerGentleChime();
      startSimulatedAudioTimer();
    }
  };

  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clamped);
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = clamped;
    }
  };

  const skipTime = (deltaSeconds: number) => {
    seek(currentTime + deltaSeconds);
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume > 0 ? volume : 0.8;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const toggleLiveStream = () => {
    if (isLiveStream) {
      setIsLiveStream(false);
      if (currentEpisode) {
        playEpisode(currentEpisode);
      }
    } else {
      setIsLiveStream(true);
      setIsPlaying(true);
      triggerGentleChime();
      startSimulatedAudioTimer();
    }
  };

  const playNext = () => {
    if (!currentEpisode) return;
    const currentIndex = EPISODES_DATA.findIndex((ep) => ep.id === currentEpisode.id);
    const nextIndex = (currentIndex + 1) % EPISODES_DATA.length;
    playEpisode(EPISODES_DATA[nextIndex]);
  };

  const playPrev = () => {
    if (!currentEpisode) return;
    const currentIndex = EPISODES_DATA.findIndex((ep) => ep.id === currentEpisode.id);
    const prevIndex = (currentIndex - 1 + EPISODES_DATA.length) % EPISODES_DATA.length;
    playEpisode(EPISODES_DATA[prevIndex]);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        volume,
        isMuted,
        isLiveStream,
        isExpanded,
        playEpisode,
        togglePlay,
        pause,
        resume,
        seek,
        skipTime,
        setPlaybackRate,
        setVolume,
        toggleMute,
        toggleLiveStream,
        setIsExpanded,
        playNext,
        playPrev,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
