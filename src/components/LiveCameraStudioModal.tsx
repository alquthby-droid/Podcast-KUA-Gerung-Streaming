import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Camera,
  Video,
  VideoOff,
  Mic,
  Play,
  Square,
  Pause,
  Download,
  RefreshCw,
  Maximize,
  FlipHorizontal,
  Grid,
  Radio,
  Sparkles,
  Check,
  Tv,
  Volume2,
  HardDrive,
  Users,
  Settings,
  Calendar,
  Clock,
  Columns2,
  Layers,
  User,
  UserCheck,
  ArrowLeftRight,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  GripVertical
} from 'lucide-react';
import { ASN_KUA_GERUNG } from '../data/speakersData';
import { formatIndonesianFullDate, getIndonesianDateDetails } from '../utils/formatters';
import { StreamLayout, StudioParticipantProfile, PipPosition, CameraPanOffset, PrimaryCameraRole } from '../types/studio';
import { StudioLayoutBar } from './studio/StudioLayoutBar';
import { DualCameraStage } from './studio/DualCameraStage';
import { createVirtualHostStudio, createVirtualGuestStudio, drawCompositeFrame } from '../utils/studioCanvas';

interface LiveCameraStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MediaDeviceOption {
  deviceId: string;
  label: string;
  kind: 'videoinput' | 'audioinput';
  isExternal?: boolean;
}

export const LiveCameraStudioModal: React.FC<LiveCameraStudioModalProps> = ({ isOpen, onClose }) => {
  // Video and Stream References
  const videoHostRef = useRef<HTMLVideoElement | null>(null);
  const videoGuestRef = useRef<HTMLVideoElement | null>(null);
  const streamHostRef = useRef<MediaStream | null>(null);
  const streamGuestRef = useRef<MediaStream | null>(null);

  const playbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Simulation Canvases & Animation Cleanups
  const simHostCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const simGuestCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stopSimHostRef = useRef<(() => void) | null>(null);
  const stopSimGuestRef = useRef<(() => void) | null>(null);
  const compositeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const compositeAnimRef = useRef<number | null>(null);

  // Available Devices
  const [videoDevices, setVideoDevices] = useState<MediaDeviceOption[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceOption[]>([]);
  const [selectedVideoDeviceIdHost, setSelectedVideoDeviceIdHost] = useState<string>('');
  const [selectedVideoDeviceIdGuest, setSelectedVideoDeviceIdGuest] = useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');

  // Layout Mode & Camera 2 Repositioning States
  const [streamLayout, setStreamLayout] = useState<StreamLayout>('split');
  const [splitRatio, setSplitRatio] = useState<number>(50); // Split Screen divider ratio (20% - 80%)
  const [pipPosition, setPipPosition] = useState<PipPosition>({
    x: 66,
    y: 55,
    size: 'medium'
  }); // Picture-in-Picture coordinates (drag & drop)
  const [guestPan, setGuestPan] = useState<CameraPanOffset>({
    panX: 0,
    panY: 0,
    zoom: 1
  }); // Camera 2 framing & angle offset

  // Primary Camera Role: 'guest' (Narasumber di kamera utama) | 'host' (Host di kamera utama)
  const [primaryRole, setPrimaryRole] = useState<PrimaryCameraRole>('guest');

  // Synchronized refs for smooth composite canvas recording
  const streamLayoutRef = useRef<StreamLayout>(streamLayout);
  const splitRatioRef = useRef<number>(splitRatio);
  const pipPositionRef = useRef<PipPosition>(pipPosition);
  const guestPanRef = useRef<CameraPanOffset>(guestPan);
  const primaryRoleRef = useRef<PrimaryCameraRole>(primaryRole);

  useEffect(() => {
    streamLayoutRef.current = streamLayout;
  }, [streamLayout]);

  useEffect(() => {
    splitRatioRef.current = splitRatio;
  }, [splitRatio]);

  useEffect(() => {
    pipPositionRef.current = pipPosition;
  }, [pipPosition]);

  useEffect(() => {
    guestPanRef.current = guestPan;
  }, [guestPan]);

  useEffect(() => {
    primaryRoleRef.current = primaryRole;
  }, [primaryRole]);

  // Camera 1 (Host) Controls
  const [isHostVideoEnabled, setIsHostVideoEnabled] = useState<boolean>(true);
  const [isHostMirrored, setIsHostMirrored] = useState<boolean>(true);
  const [isHostVirtual, setIsHostVirtual] = useState<boolean>(false);

  // Camera 2 (Narasumber) Controls
  const [isGuestVideoEnabled, setIsGuestVideoEnabled] = useState<boolean>(true);
  const [isGuestMirrored, setIsGuestMirrored] = useState<boolean>(false);
  const [isGuestVirtual, setIsGuestVirtual] = useState<boolean>(false);

  // General Hardware controls
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '4:3'>('16:9');
  const [resolution, setResolution] = useState<'1080p' | '720p' | '480p'>('1080p');

  // Participants Profiles (Host & Narasumber)
  const [hostAsnIndex, setHostAsnIndex] = useState<number>(0); // Default: H. Marliadi (Kepala KUA)
  const [hostCustomName, setHostCustomName] = useState<string>('');
  const [hostCustomTitle, setHostCustomTitle] = useState<string>('');

  const [guestAsnIndex, setGuestAsnIndex] = useState<number>(2); // Default: Husni, S.Kom.I (Penyuluh / Host Utama)
  const [guestCustomName, setGuestCustomName] = useState<string>('');
  const [guestCustomTitle, setGuestCustomTitle] = useState<string>('');

  // Broadcast & Studio Overlays
  const [showLowerThird, setShowLowerThird] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [showRunningText, setShowRunningText] = useState<boolean>(true);
  const [podcastTopic, setPodcastTopic] = useState<string>('Dialog Bimbingan Keluarga Sakinah & Penguatan Moderasi Beragama');
  const [includeDateInTicker, setIncludeDateInTicker] = useState<boolean>(true);
  const [tickerSpeed, setTickerSpeed] = useState<'normal' | 'slow' | 'fast'>('normal');
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  // Date and Time Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const indonesianDate = getIndonesianDateDetails(currentDateTime);

  // Recording states
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'stopped'>('idle');
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordedBlobSize, setRecordedBlobSize] = useState<number>(0);
  const [snapshotSuccess, setSnapshotSuccess] = useState<boolean>(false);

  // Status & Audio meter
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isBroadcastingLive, setIsBroadcastingLive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'camera' | 'overlay' | 'guide'>('camera');

  // Format seconds to HH:MM:SS
  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to identify external camera based on label
  const isExternalDevice = (label: string): boolean => {
    const lower = label.toLowerCase();
    return (
      lower.includes('usb') ||
      lower.includes('external') ||
      lower.includes('obs') ||
      lower.includes('droidcam') ||
      lower.includes('c920') ||
      lower.includes('camlink') ||
      lower.includes('elgato') ||
      lower.includes('iriun') ||
      lower.includes('v4l2') ||
      lower.includes('wireless') ||
      lower.includes('plug')
    );
  };

  // Enumerate Connected Audio/Video Devices
  const getConnectedDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return;
      }
      const devices = await navigator.mediaDevices.enumerateDevices();

      const vInputs: MediaDeviceOption[] = [];
      const aInputs: MediaDeviceOption[] = [];

      let vidCount = 1;
      let audCount = 1;

      devices.forEach((device) => {
        if (device.kind === 'videoinput') {
          const isExt = isExternalDevice(device.label);
          vInputs.push({
            deviceId: device.deviceId,
            label: device.label || `Kamera ${vidCount++} ${isExt ? '(Eksternal/USB)' : '(Bawaan Laptop/PC)'}`,
            kind: 'videoinput',
            isExternal: isExt
          });
        } else if (device.kind === 'audioinput') {
          const isExt = isExternalDevice(device.label);
          aInputs.push({
            deviceId: device.deviceId,
            label: device.label || `Mikrofon ${audCount++} ${isExt ? '(Eksternal/USB)' : '(Bawaan Laptop/PC)'}`,
            kind: 'audioinput',
            isExternal: isExt
          });
        }
      });

      setVideoDevices(vInputs);
      setAudioDevices(aInputs);

      // Default selection if not set
      if (vInputs.length > 0) {
        if (!selectedVideoDeviceIdHost) {
          setSelectedVideoDeviceIdHost(vInputs[0].deviceId);
        }
        if (!selectedVideoDeviceIdGuest) {
          // If 2 cameras exist, assign camera 2 to guest; otherwise same camera or simulation
          setSelectedVideoDeviceIdGuest(vInputs.length > 1 ? vInputs[1].deviceId : 'same-as-host');
        }
      }
      if (aInputs.length > 0 && !selectedAudioDeviceId) {
        setSelectedAudioDeviceId(aInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Error enumerating devices:', err);
    }
  }, [selectedVideoDeviceIdHost, selectedVideoDeviceIdGuest, selectedAudioDeviceId]);

  // Setup Audio Level Meter
  const setupAudioMeter = (stream: MediaStream) => {
    try {
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) return;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);

        animFrameIdRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err) {
      console.warn('Audio meter initialization skipped:', err);
    }
  };

  // Stop All Active Streams & Cleanup
  const stopAllStreams = () => {
    if (stopSimHostRef.current) {
      stopSimHostRef.current();
      stopSimHostRef.current = null;
    }
    if (stopSimGuestRef.current) {
      stopSimGuestRef.current();
      stopSimGuestRef.current = null;
    }
    if (compositeAnimRef.current) {
      cancelAnimationFrame(compositeAnimRef.current);
      compositeAnimRef.current = null;
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamHostRef.current) {
      streamHostRef.current.getTracks().forEach((track) => track.stop());
      streamHostRef.current = null;
    }
    if (streamGuestRef.current) {
      streamGuestRef.current.getTracks().forEach((track) => track.stop());
      streamGuestRef.current = null;
    }
  };

  // Derived profiles
  const currentHostAsn = ASN_KUA_GERUNG[hostAsnIndex] || ASN_KUA_GERUNG[0];
  const hostProfile: StudioParticipantProfile = {
    name: hostCustomName.trim() || currentHostAsn.name,
    title: hostCustomTitle.trim() || currentHostAsn.jabatan,
    asnNo: !hostCustomName.trim() ? currentHostAsn.no : undefined,
    role: 'host'
  };

  const currentGuestAsn = ASN_KUA_GERUNG[guestAsnIndex] || ASN_KUA_GERUNG[2];
  const guestProfile: StudioParticipantProfile = {
    name: guestCustomName.trim() || currentGuestAsn.name,
    title: guestCustomTitle.trim() || currentGuestAsn.jabatan,
    asnNo: !guestCustomName.trim() ? currentGuestAsn.no : undefined,
    role: 'narasumber'
  };

  // Start Host Simulation Stream
  const startSimHostStream = useCallback(() => {
    if (stopSimHostRef.current) stopSimHostRef.current();

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    simHostCanvasRef.current = canvas;

    stopSimHostRef.current = createVirtualHostStudio(canvas, hostProfile);
    const canvasStream = canvas.captureStream(30);

    streamHostRef.current = canvasStream;
    setIsHostVirtual(true);

    if (videoHostRef.current) {
      videoHostRef.current.srcObject = canvasStream;
      videoHostRef.current.play().catch(() => {});
    }
  }, [hostProfile]);

  // Start Guest Simulation Stream
  const startSimGuestStream = useCallback(() => {
    if (stopSimGuestRef.current) stopSimGuestRef.current();

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    simGuestCanvasRef.current = canvas;

    stopSimGuestRef.current = createVirtualGuestStudio(canvas, guestProfile);
    const canvasStream = canvas.captureStream(30);

    streamGuestRef.current = canvasStream;
    setIsGuestVirtual(true);

    if (videoGuestRef.current) {
      videoGuestRef.current.srcObject = canvasStream;
      videoGuestRef.current.play().catch(() => {});
    }
  }, [guestProfile]);

  // Start Host Camera (Camera 1)
  const startHostCamera = useCallback(async (videoDevId?: string, audioDevId?: string) => {
    if (videoDevId === 'simulated') {
      startSimHostStream();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      startSimHostStream();
      return;
    }

    try {
      const targetRes = {
        '1080p': { width: 1920, height: 1080 },
        '720p': { width: 1280, height: 720 },
        '480p': { width: 854, height: 480 }
      }[resolution];

      const videoConstraints: MediaTrackConstraints = {
        width: { ideal: targetRes.width },
        height: { ideal: targetRes.height },
        frameRate: { ideal: 30 }
      };

      if (videoDevId && videoDevId !== 'same-as-host' && videoDevId !== 'simulated') {
        videoConstraints.deviceId = { exact: videoDevId };
      }

      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      };

      if (audioDevId && audioDevId !== 'simulated-mic') {
        audioConstraints.deviceId = { exact: audioDevId };
      }

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: audioConstraints
        });
      } catch {
        // Fallback to video only
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });
      }

      if (stream) {
        streamHostRef.current = stream;
        setIsHostVirtual(false);
        if (videoHostRef.current) {
          videoHostRef.current.srcObject = stream;
          videoHostRef.current.play().catch(() => {});
        }
        setupAudioMeter(stream);
      }
    } catch {
      startSimHostStream();
    }
  }, [resolution, startSimHostStream]);

  // Start Guest Camera (Camera 2)
  const startGuestCamera = useCallback(async (guestDevId?: string) => {
    if (guestDevId === 'simulated-guest') {
      startSimGuestStream();
      return;
    }

    // If "same-as-host" is selected or user has only 1 webcam
    if (guestDevId === 'same-as-host') {
      if (streamHostRef.current && !isHostVirtual) {
        // Clone stream video track for guest display
        const clonedStream = streamHostRef.current.clone();
        streamGuestRef.current = clonedStream;
        setIsGuestVirtual(false);
        if (videoGuestRef.current) {
          videoGuestRef.current.srcObject = clonedStream;
          videoGuestRef.current.play().catch(() => {});
        }
        return;
      } else {
        startSimGuestStream();
        return;
      }
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      startSimGuestStream();
      return;
    }

    try {
      const targetRes = {
        '1080p': { width: 1920, height: 1080 },
        '720p': { width: 1280, height: 720 },
        '480p': { width: 854, height: 480 }
      }[resolution];

      const videoConstraints: MediaTrackConstraints = {
        width: { ideal: targetRes.width },
        height: { ideal: targetRes.height },
        frameRate: { ideal: 30 }
      };

      if (guestDevId && guestDevId !== 'simulated-guest') {
        videoConstraints.deviceId = { exact: guestDevId };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false
      });

      if (stream) {
        streamGuestRef.current = stream;
        setIsGuestVirtual(false);
        if (videoGuestRef.current) {
          videoGuestRef.current.srcObject = stream;
          videoGuestRef.current.play().catch(() => {});
        }
      }
    } catch {
      startSimGuestStream();
    }
  }, [resolution, isHostVirtual, startSimGuestStream]);

  // Start Dual Cameras Setup
  const startDualCameras = useCallback(async () => {
    setIsLoadingCamera(true);
    setErrorMessage(null);

    await getConnectedDevices();
    await startHostCamera(selectedVideoDeviceIdHost, selectedAudioDeviceId);
    await startGuestCamera(selectedVideoDeviceIdGuest || 'same-as-host');

    setIsLoadingCamera(false);
  }, [getConnectedDevices, startHostCamera, startGuestCamera, selectedVideoDeviceIdHost, selectedVideoDeviceIdGuest, selectedAudioDeviceId]);

  // Modal open lifecycle
  useEffect(() => {
    if (isOpen) {
      startDualCameras();
    } else {
      stopAllStreams();
      if (recordingState === 'recording') {
        stopRecording();
      }
    }
    return () => {
      stopAllStreams();
    };
  }, [isOpen]);

  // Swap Host and Narasumber Positions & Profiles
  const swapPositions = () => {
    // Toggle primary role
    setPrimaryRole((prev) => (prev === 'guest' ? 'host' : 'guest'));

    // Swap profiles
    const prevHostAsn = hostAsnIndex;
    const prevHostCustomName = hostCustomName;
    const prevHostCustomTitle = hostCustomTitle;

    setHostAsnIndex(guestAsnIndex);
    setHostCustomName(guestCustomName);
    setHostCustomTitle(guestCustomTitle);

    setGuestAsnIndex(prevHostAsn);
    setGuestCustomName(prevHostCustomName);
    setGuestCustomTitle(prevHostCustomTitle);

    // Swap camera devices
    const prevHostDev = selectedVideoDeviceIdHost;
    setSelectedVideoDeviceIdHost(selectedVideoDeviceIdGuest);
    setSelectedVideoDeviceIdGuest(prevHostDev);

    // Re-swap video srcObjects
    if (videoHostRef.current && videoGuestRef.current) {
      const prevHostObj = videoHostRef.current.srcObject;
      videoHostRef.current.srcObject = videoGuestRef.current.srcObject;
      videoGuestRef.current.srcObject = prevHostObj;
    }
  };

  // Recording Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (recordingState === 'recording') {
      interval = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recordingState]);

  // Start Dual Camera Composite Recording
  const startRecording = () => {
    recordedChunksRef.current = [];
    setRecordedBlobUrl(null);
    setRecordDuration(0);

    // Setup Composite Canvas for multi-camera rendering
    const compCanvas = document.createElement('canvas');
    compCanvas.width = 1280;
    compCanvas.height = 720;
    compositeCanvasRef.current = compCanvas;
    const compCtx = compCanvas.getContext('2d');
    if (!compCtx) return;

    // Render loop
    const renderLoop = () => {
      drawCompositeFrame(
        compCtx,
        compCanvas.width,
        compCanvas.height,
        streamLayoutRef.current,
        videoHostRef.current,
        videoGuestRef.current,
        isHostMirrored,
        isGuestMirrored,
        hostProfile,
        guestProfile,
        podcastTopic,
        formatIndonesianFullDate(new Date()),
        splitRatioRef.current,
        pipPositionRef.current,
        guestPanRef.current,
        primaryRoleRef.current
      );
      compositeAnimRef.current = requestAnimationFrame(renderLoop);
    };
    compositeAnimRef.current = requestAnimationFrame(renderLoop);

    const compStream = compCanvas.captureStream(30);

    // Attach real audio track if available
    if (streamHostRef.current) {
      const audioTrack = streamHostRef.current.getAudioTracks()[0];
      if (audioTrack) {
        compStream.addTrack(audioTrack);
      }
    }

    const supportedMimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4'
    ];

    let chosenMime = '';
    for (const mime of supportedMimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        chosenMime = mime;
        break;
      }
    }

    try {
      const recorder = new MediaRecorder(compStream, chosenMime ? { mimeType: chosenMime } : undefined);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (compositeAnimRef.current) {
          cancelAnimationFrame(compositeAnimRef.current);
          compositeAnimRef.current = null;
        }
        const fullBlob = new Blob(recordedChunksRef.current, { type: chosenMime || 'video/webm' });
        const url = URL.createObjectURL(fullBlob);
        setRecordedBlobUrl(url);
        setRecordedBlobSize(fullBlob.size);
        setRecordingState('stopped');
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setRecordingState('recording');
    } catch (err) {
      console.error('Error starting MediaRecorder:', err);
      setErrorMessage('Browser tidak dapat memulai rekaman video multi-kamera.');
    }
  };

  // Pause Recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
    }
  };

  // Resume Recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && (recordingState === 'recording' || recordingState === 'paused')) {
      mediaRecorderRef.current.stop();
    }
  };

  // Download Recorded Video
  const downloadRecording = () => {
    if (!recordedBlobUrl) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 8).replace(/:/g, '-');
    const a = document.createElement('a');
    a.href = recordedBlobUrl;
    a.download = `PODCAST_DUAL_CAM_KUA_GERUNG_${dateStr}_${timeStr}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Take Snapshot / Thumbnail of Current Dual Camera Stage
  const takeSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawCompositeFrame(
      ctx,
      canvas.width,
      canvas.height,
      streamLayout,
      videoHostRef.current,
      videoGuestRef.current,
      isHostMirrored,
      isGuestMirrored,
      hostProfile,
      guestProfile,
      podcastTopic,
      formatIndonesianFullDate(new Date()),
      splitRatio,
      pipPosition,
      guestPan,
      primaryRole
    );

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `THUMBNAIL_DUAL_CAM_KUA_GERUNG_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-live-camera-studio"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div className="relative bg-[#141610] border border-[#D4AF37]/40 rounded-3xl w-full max-w-7xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[96vh]">
        {/* Studio Top Navigation Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0B0D09] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#D4AF37]/40 p-1 flex items-center justify-center">
              <img
                src="/logo-kemenag.svg"
                alt="Logo Kemenag"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-kemenag.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  STUDIO STREAMING DUAL CAMERA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#006837] text-[#D4AF37] font-bold text-[10px] border border-emerald-500/40">
                  HOST & NARASUMBER
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                KUA Kecamatan Gerung &bull; Kementerian Agama Kabupaten Lombok Barat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={takeSnapshot}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ambil Foto Cuplikan / Thumbnail Layar"
            >
              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Snapshot Thumbnail</span>
            </button>

            <button
              id="btn-close-camera-studio"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Layout Switcher Bar (Split 50:50, PiP, Solo Host, Solo Narasumber, Tukar) */}
        <StudioLayoutBar
          layout={streamLayout}
          onLayoutChange={setStreamLayout}
          onSwapPositions={swapPositions}
          hostName={hostProfile.name}
          guestName={guestProfile.name}
          splitRatio={splitRatio}
          onSplitRatioChange={setSplitRatio}
          pipPosition={pipPosition}
          onPipPositionChange={setPipPosition}
          primaryRole={primaryRole}
          onPrimaryRoleChange={setPrimaryRole}
        />

        {/* Studio Main Body: Stage (Left 8 Cols) & Controls (Right 4 Cols) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Main Stage & Dual Camera Monitor (8 Cols) */}
          <div className="lg:col-span-8 p-3 sm:p-4 bg-black flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            {/* Dual Camera Monitor Canvas Stage */}
            <DualCameraStage
              layout={streamLayout}
              videoHostRef={videoHostRef}
              videoGuestRef={videoGuestRef}
              hostProfile={hostProfile}
              guestProfile={guestProfile}
              isHostVideoEnabled={isHostVideoEnabled}
              isGuestVideoEnabled={isGuestVideoEnabled}
              isHostMirrored={isHostMirrored}
              isGuestMirrored={isGuestMirrored}
              onToggleHostVideo={() => setIsHostVideoEnabled(!isHostVideoEnabled)}
              onToggleGuestVideo={() => setIsGuestVideoEnabled(!isGuestVideoEnabled)}
              onToggleHostMirror={() => setIsHostMirrored(!isHostMirrored)}
              onToggleGuestMirror={() => setIsGuestMirrored(!isGuestMirrored)}
              showLowerThird={showLowerThird}
              showWatermark={showWatermark}
              showRunningText={showRunningText}
              includeDateInTicker={includeDateInTicker}
              tickerSpeed={tickerSpeed}
              podcastTopic={podcastTopic}
              indonesianDate={indonesianDate}
              recordingState={recordingState}
              recordDuration={recordDuration}
              formatTimer={formatTimer}
              isBroadcastingLive={isBroadcastingLive}
              resolution={resolution}
              aspectRatio={aspectRatio}
              isLoadingCamera={isLoadingCamera}
              showGrid={showGrid}
              audioLevel={audioLevel}
              splitRatio={splitRatio}
              onSplitRatioChange={setSplitRatio}
              pipPosition={pipPosition}
              onPipPositionChange={setPipPosition}
              guestPan={guestPan}
              onGuestPanChange={setGuestPan}
              onSwapPositions={swapPositions}
              primaryRole={primaryRole}
              onPrimaryRoleChange={setPrimaryRole}
            />

            {/* Error / Simulation Notice if needed */}
            {errorMessage && (
              <div className="mt-2 bg-[#141810]/95 border border-[#D4AF37]/60 p-3 rounded-xl text-white text-xs flex items-center justify-between">
                <span>{errorMessage}</span>
                <button onClick={() => setErrorMessage(null)} className="text-white/50 hover:text-white ml-2">✕</button>
              </div>
            )}

            {/* Bottom Hardware Controls Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 py-2 bg-[#0E100A] rounded-2xl border border-white/10">
              {/* Left: Mic & Audio Meter */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isAudioEnabled ? 'bg-white/10 text-white' : 'bg-red-600/80 text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isAudioEnabled ? 'Mic Aktif' : 'Mic Bisu'}</span>
                </button>

                {/* Live VU Meter */}
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <div className="w-24 sm:w-32 h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-75 ${
                        audioLevel > 80 ? 'bg-red-500' : audioLevel > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.max(4, audioLevel)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/60">{audioLevel}%</span>
                </div>
              </div>

              {/* Right: Record & Save Actions */}
              <div className="flex items-center gap-2">
                {recordingState === 'idle' && (
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                    <span>Mulai Rekam Dual Camera</span>
                  </button>
                )}

                {recordingState === 'recording' && (
                  <>
                    <button
                      onClick={pauseRecording}
                      className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda</span>
                    </button>
                    <button
                      onClick={stopRecording}
                      className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      <span>Selesai ({formatTimer(recordDuration)})</span>
                    </button>
                  </>
                )}

                {recordingState === 'paused' && (
                  <>
                    <button
                      onClick={resumeRecording}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Lanjutkan</span>
                    </button>
                    <button
                      onClick={stopRecording}
                      className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      <span>Selesai</span>
                    </button>
                  </>
                )}

                {recordingState === 'stopped' && recordedBlobUrl && (
                  <button
                    onClick={downloadRecording}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e0be48] text-black font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Rekaman Dual Cam ({(recordedBlobSize / (1024 * 1024)).toFixed(1)} MB)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Post-Recording Review Preview Card */}
            {recordedBlobUrl && recordingState === 'stopped' && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#1a1d15] border border-[#D4AF37]/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 bg-black rounded-lg overflow-hidden border border-white/20 shrink-0">
                    <video
                      ref={playbackVideoRef}
                      src={recordedBlobUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Video Rekaman Dual Camera Selesai!
                    </h4>
                    <p className="text-[11px] text-white/60">
                      Format: Split Screen 50:50 &bull; Durasi: <span className="font-mono font-bold text-[#D4AF37]">{formatTimer(recordDuration)}</span> &bull; Ukuran: {(recordedBlobSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadRecording}
                    className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be48] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Simpan Video</span>
                  </button>
                  <button
                    onClick={() => {
                      setRecordedBlobUrl(null);
                      setRecordingState('idle');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                  >
                    Rekam Ulang
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Controls & Settings Sidebar (4 Cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 bg-[#10130C] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Studio Tabs Navigation */}
              <div className="flex items-center p-1 bg-black/40 rounded-xl border border-white/10 text-xs font-bold">
                <button
                  onClick={() => setActiveStudioTab('camera')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeStudioTab === 'camera'
                      ? 'bg-[#D4AF37] text-black font-extrabold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Dual Kamera</span>
                </button>
                <button
                  onClick={() => setActiveStudioTab('overlay')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeStudioTab === 'overlay'
                      ? 'bg-[#D4AF37] text-black font-extrabold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Profil & Teks</span>
                </button>
                <button
                  onClick={() => setActiveStudioTab('guide')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeStudioTab === 'guide'
                      ? 'bg-[#D4AF37] text-black font-extrabold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Panduan</span>
                </button>
              </div>

              {/* TAB 1: DUAL CAMERA & AUDIO SETTINGS */}
              {activeStudioTab === 'camera' && (
                <div className="space-y-3.5">
                  {/* Penempatan Peran: Narasumber di Kamera Utama vs Host */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-[#171408] to-[#0d160f] border border-[#D4AF37]/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
                        <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Penempatan Peran Kamera:</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        primaryRole === 'guest'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                      }`}>
                        {primaryRole === 'guest' ? 'Narasumber Utama (Aktif)' : 'Host Utama (Aktif)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      {primaryRole === 'guest'
                        ? '👤 Narasumber di Kamera Utama (layar utama/kiri), 🎙️ Host di Kamera Kedua (kanan / PiP).'
                        : '🎙️ Host di Kamera Utama (layar utama/kiri), 👤 Narasumber di Kamera Kedua (kanan / PiP).'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPrimaryRole(primaryRole === 'guest' ? 'host' : 'guest')}
                      className="w-full py-1.5 px-3 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-bold text-xs flex items-center justify-center gap-2 border border-[#D4AF37]/50 transition-all cursor-pointer shadow-md"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>
                        {primaryRole === 'guest'
                          ? 'Tukar: Jadikan Host di Kamera Utama'
                          : 'Tukar: Jadikan Narasumber di Kamera Utama'}
                      </span>
                    </button>
                  </div>
                  {/* Kamera 1 (Host / Sisi Kiri) */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kamera 1 — Host (Kiri):</span>
                      </label>
                      <button
                        onClick={() => setIsHostMirrored(!isHostMirrored)}
                        className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Cermin Kamera Host"
                      >
                        <FlipHorizontal className="w-3 h-3" />
                        <span>{isHostMirrored ? 'Cermin On' : 'Cermin Off'}</span>
                      </button>
                    </div>

                    <select
                      value={isHostVirtual ? 'simulated' : selectedVideoDeviceIdHost}
                      onChange={(e) => {
                        setSelectedVideoDeviceIdHost(e.target.value);
                        startHostCamera(e.target.value, selectedAudioDeviceId);
                      }}
                      className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="simulated">✨ [Simulasi] Studio Virtual Host KUA</option>
                      {videoDevices.map((dev, idx) => (
                        <option key={dev.deviceId || idx} value={dev.deviceId}>
                          {dev.isExternal ? '📹 [Eksternal/USB] ' : '💻 [Bawaan PC] '}
                          {dev.label}
                        </option>
                      ))}
                      {videoDevices.length === 0 && !isHostVirtual && (
                        <option value="">Kamera Fisik 1</option>
                      )}
                    </select>
                  </div>

                  {/* Kamera 2 (Narasumber / Sisi Kanan) */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kamera 2 — Narasumber (Kanan):</span>
                      </label>
                      <button
                        onClick={() => setIsGuestMirrored(!isGuestMirrored)}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Cermin Kamera Narasumber"
                      >
                        <FlipHorizontal className="w-3 h-3" />
                        <span>{isGuestMirrored ? 'Cermin On' : 'Cermin Off'}</span>
                      </button>
                    </div>

                    <select
                      value={isGuestVirtual ? 'simulated-guest' : selectedVideoDeviceIdGuest}
                      onChange={(e) => {
                        setSelectedVideoDeviceIdGuest(e.target.value);
                        startGuestCamera(e.target.value);
                      }}
                      className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="same-as-host">🔁 Gunakan Kamera 1 (Sudut Alternatif / 1 Webcam)</option>
                      <option value="simulated-guest">✨ [Simulasi] Studio Virtual Tamu / Narasumber</option>
                      {videoDevices.map((dev, idx) => (
                        <option key={dev.deviceId || idx} value={dev.deviceId}>
                          {dev.isExternal ? '📹 [Eksternal/USB] ' : '💻 [Kamera 2] '}
                          {dev.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-white/50">
                      Mendukung 2 kamera fisik bersamaan (Webcam Laptop + USB Cam / CamLink / HP DroidCam).
                    </p>
                  </div>

                  {/* PENGATURAN GESER POSISI & SUDUT KAMERA 2 (NARASUMBER) */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-black/60 to-[#181308]/60 border border-[#D4AF37]/50 space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <label className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5 uppercase tracking-wider">
                        <Move className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Geser Posisi & Tata Letak Kamera 2</span>
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                        Mode {streamLayout.toUpperCase()}
                      </span>
                    </div>

                    {/* Opsi Khusus Mode PiP */}
                    {streamLayout === 'pip' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-white/80 font-bold">Preset Sudut Layar:</span>
                          <span className="text-[10px] font-mono text-[#D4AF37]">
                            X: {Math.round(pipPosition.x)}% &bull; Y: {Math.round(pipPosition.y)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => setPipPosition({ ...pipPosition, x: 2, y: 12 })}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors"
                          >
                            ↖ Kiri Atas
                          </button>
                          <button
                            type="button"
                            onClick={() => setPipPosition({ ...pipPosition, x: 34, y: 12 })}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors"
                          >
                            ↑ Tengah Atas
                          </button>
                          <button
                            type="button"
                            onClick={() => setPipPosition({ ...pipPosition, x: 66, y: 12 })}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors"
                          >
                            ↗ Kanan Atas
                          </button>
                          <button
                            type="button"
                            onClick={() => setPipPosition({ ...pipPosition, x: 2, y: 55 })}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors"
                          >
                            ↙ Kiri Bawah
                          </button>
                          <button
                            type="button"
                            onClick={() => setPipPosition({ ...pipPosition, x: 34, y: 32 })}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors"
                          >
                            ✛ Tengah
                          </button>
                          <button
                            type="button"
                            onClick={() => setPipPosition({ ...pipPosition, x: 66, y: 55 })}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors"
                          >
                            ↘ Kanan Bawah
                          </button>
                        </div>

                        <div>
                          <span className="text-[10px] text-white/70 block mb-1">Ukuran Kotak Kamera 2:</span>
                          <div className="flex items-center gap-1.5">
                            {(['small', 'medium', 'large'] as const).map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setPipPosition({ ...pipPosition, size: sz })}
                                className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                  pipPosition.size === sz
                                    ? 'bg-[#006837] text-white border border-emerald-400'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                                }`}
                              >
                                {sz === 'small' ? 'Kecil (24%)' : sz === 'medium' ? 'Sedang (32%)' : 'Besar (40%)'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-[10px] text-[#D4AF37]">
                          ✨ <strong>Geser Bebas Langsung:</strong> Kotak kamera kedua juga bisa diklik dan digeser (drag & drop) ke posisi mana saja di monitor siaran!
                        </div>
                      </div>
                    )}

                    {/* Opsi Khusus Mode Split */}
                    {streamLayout === 'split' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-emerald-400">Host (Kiri): {splitRatio}%</span>
                          <span className="text-amber-400">Narasumber (Kanan): {100 - splitRatio}%</span>
                        </div>
                        <input
                          type="range"
                          min={20}
                          max={80}
                          value={splitRatio}
                          onChange={(e) => setSplitRatio(Number(e.target.value))}
                          className="w-full accent-[#D4AF37] cursor-pointer"
                        />
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setSplitRatio(50)}
                            className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
                          >
                            50:50 (Rata)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSplitRatio(65)}
                            className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
                          >
                            65:35 (Host Luas)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSplitRatio(35)}
                            className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
                          >
                            35:65 (Tamu Luas)
                          </button>
                        </div>
                        <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-[10px] text-[#D4AF37]">
                          ✨ <strong>Geser Pembatas Layar:</strong> Anda juga bisa menahan dan menggeser langsung garis vertikal emas di tengah layar monitor!
                        </div>
                      </div>
                    )}

                    {/* Sudut & Framing Kamera 2 (Pan X, Pan Y, Zoom) */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white/90 flex items-center gap-1">
                          <Sliders className="w-3 h-3 text-[#D4AF37]" />
                          <span>Sudut & Framing Kamera 2:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuestPan({ panX: 0, panY: 0, zoom: 1 })}
                          className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-0.5"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Sudut</span>
                        </button>
                      </div>

                      {/* Pan Horizontal & Vertikal */}
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <label className="text-white/60 block mb-0.5">Geser Kiri/Kanan ({guestPan.panX}%):</label>
                          <input
                            type="range"
                            min={-40}
                            max={40}
                            value={guestPan.panX}
                            onChange={(e) => setGuestPan({ ...guestPan, panX: Number(e.target.value) })}
                            className="w-full accent-amber-400 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-white/60 block mb-0.5">Geser Atas/Bawah ({guestPan.panY}%):</label>
                          <input
                            type="range"
                            min={-40}
                            max={40}
                            value={guestPan.panY}
                            onChange={(e) => setGuestPan({ ...guestPan, panY: Number(e.target.value) })}
                            className="w-full accent-amber-400 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Zoom */}
                      <div className="flex items-center justify-between gap-3 text-[10px]">
                        <span className="text-white/60">Zoom ({guestPan.zoom.toFixed(1)}x):</span>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="range"
                            min={1.0}
                            max={2.5}
                            step={0.1}
                            value={guestPan.zoom}
                            onChange={(e) => setGuestPan({ ...guestPan, zoom: Number(e.target.value) })}
                            className="w-full accent-[#D4AF37] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tombol Tukar Posisi Cepat */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={swapPositions}
                        className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>Tukar Posisi Host ↔ Tamu</span>
                      </button>
                    </div>
                  </div>

                  {/* Tombol Deteksi Ulang Perangkat */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] text-white/60">
                      Status: <strong className="text-emerald-400">{videoDevices.length} Kamera Terdeteksi</strong>
                    </span>
                    <button
                      onClick={startDualCameras}
                      className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Pindai Ulang Kamera
                    </button>
                  </div>

                  {/* Mikrofon & Kualitas Video */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-white/70 block mb-1">
                        Pilihan Mikrofon
                      </label>
                      <select
                        value={selectedAudioDeviceId}
                        onChange={(e) => {
                          setSelectedAudioDeviceId(e.target.value);
                          startHostCamera(selectedVideoDeviceIdHost, e.target.value);
                        }}
                        className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white focus:border-[#D4AF37]"
                      >
                        {audioDevices.map((dev, idx) => (
                          <option key={dev.deviceId || idx} value={dev.deviceId}>
                            {dev.isExternal ? '🎙️ [USB] ' : '💻 '}
                            {dev.label.slice(0, 16)}...
                          </option>
                        ))}
                        {audioDevices.length === 0 && <option value="">Mic Sistem</option>}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white/70 block mb-1">
                        Resolusi Rekaman
                      </label>
                      <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value as '1080p' | '720p' | '480p')}
                        className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white focus:border-[#D4AF37]"
                      >
                        <option value="1080p">1080p Full HD</option>
                        <option value="720p">720p HD</option>
                        <option value="480p">480p SD</option>
                      </select>
                    </div>
                  </div>

                  {/* Grid 3x3 rule of thirds */}
                  <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded accent-[#D4AF37]"
                    />
                    <span>Tampilkan Garis Bantu Komposisi (Rule-of-Thirds)</span>
                  </label>
                </div>
              )}

              {/* TAB 2: PROFIL HOST, NARASUMBER, DAN RUNNING TEKS */}
              {activeStudioTab === 'overlay' && (
                <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
                  {/* PROFIL HOST */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2">
                    <label className="text-xs font-black text-white flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Profil Host (Tuan Rumah):
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Sisi Kiri</span>
                    </label>

                    <select
                      value={hostAsnIndex}
                      onChange={(e) => {
                        setHostAsnIndex(Number(e.target.value));
                        setHostCustomName('');
                        setHostCustomTitle('');
                      }}
                      className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-emerald-400 cursor-pointer"
                    >
                      {ASN_KUA_GERUNG.map((asn, idx) => (
                        <option key={asn.no} value={idx}>
                          #{asn.no} - {asn.name} ({asn.jabatan.slice(0, 24)}...)
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Kustom Host"
                        value={hostCustomName}
                        onChange={(e) => setHostCustomName(e.target.value)}
                        className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2.5 py-1 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Jabatan Kustom"
                        value={hostCustomTitle}
                        onChange={(e) => setHostCustomTitle(e.target.value)}
                        className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* PROFIL NARASUMBER */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
                    <label className="text-xs font-black text-white flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        Profil Narasumber (Tamu Undangan):
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">Sisi Kanan</span>
                    </label>

                    <select
                      value={guestAsnIndex}
                      onChange={(e) => {
                        setGuestAsnIndex(Number(e.target.value));
                        setGuestCustomName('');
                        setGuestCustomTitle('');
                      }}
                      className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-amber-400 cursor-pointer"
                    >
                      {ASN_KUA_GERUNG.map((asn, idx) => (
                        <option key={asn.no} value={idx}>
                          #{asn.no} - {asn.name} ({asn.jabatan.slice(0, 24)}...)
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Kustom Narasumber"
                        value={guestCustomName}
                        onChange={(e) => setGuestCustomName(e.target.value)}
                        className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2.5 py-1 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Jabatan / Instansi"
                        value={guestCustomTitle}
                        onChange={(e) => setGuestCustomTitle(e.target.value)}
                        className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* TOPIC & RUNNING TEXT SETTINGS */}
                  <div className="space-y-2 p-3 rounded-2xl bg-black/40 border border-white/10">
                    <label className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-[#D4AF37]" />
                      <span>Judul Topik Episode (Running Teks Bawah):</span>
                    </label>

                    <input
                      type="text"
                      value={podcastTopic}
                      onChange={(e) => setPodcastTopic(e.target.value)}
                      placeholder="Masukkan judul topik siaran..."
                      className="w-full bg-[#0E100A] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#D4AF37]"
                    />

                    {/* Quick Preset Topics */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {[
                        'Dialog Bimbingan Keluarga Sakinah & Moderasi Beragama',
                        'Fondasi Kokoh Keluarga Sakinah: Ikhtiar Mencegah Perceraian Dini di Gerung',
                        'Revitalisasi Layanan KUA Gerung: Layanan Nikah Digital & Ramah Disabilitas',
                        'Harmonisasi Lintas Agama: Praktik Baik Kerukunan Sasak Lombok Barat'
                      ].map((topic, tIdx) => (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => setPodcastTopic(topic)}
                          className="text-[9px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 cursor-pointer"
                        >
                          + {topic.slice(0, 26)}...
                        </button>
                      ))}
                    </div>

                    {/* Speed & Date Toggle */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-white/60 block mb-0.5">Kecepatan Teks</label>
                        <select
                          value={tickerSpeed}
                          onChange={(e) => setTickerSpeed(e.target.value as 'normal' | 'slow' | 'fast')}
                          className="w-full bg-[#0E100A] border border-white/15 rounded-lg px-2 py-1 text-xs text-white"
                        >
                          <option value="normal">Normal</option>
                          <option value="slow">Perlahan</option>
                          <option value="fast">Cepat</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-white/60 block mb-0.5">Penanggalan</label>
                        <label className="flex items-center gap-1.5 text-[11px] text-white/90 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeDateInTicker}
                            onChange={(e) => setIncludeDateInTicker(e.target.checked)}
                            className="rounded accent-[#D4AF37]"
                          />
                          <span>Hari & Tanggal Otomatis</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Overlays Visibility Toggles */}
                  <div className="pt-2 space-y-1.5 border-t border-white/10 text-xs text-white/80">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showLowerThird}
                        onChange={(e) => setShowLowerThird(e.target.checked)}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span>Tampilkan Nama & Jabatan (Lower Third)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showWatermark}
                        onChange={(e) => setShowWatermark(e.target.checked)}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span>Tampilkan Watermark Kemenag RI</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showRunningText}
                        onChange={(e) => setShowRunningText(e.target.checked)}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span>Tampilkan Running Teks Topik Podcast</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: PANDUAN LIVE STREAMING */}
              {activeStudioTab === 'guide' && (
                <div className="space-y-3 text-xs text-white/70 max-h-[50vh] overflow-y-auto">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                    <h4 className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      Panduan Dual Camera & Split Screen
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      Studio ini mendukung dua kamera aktif sekaligus. Anda dapat menghubungkan:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-white/80 pl-1">
                      <li><strong>Kamera 1</strong>: Webcam bawaan laptop untuk Host.</li>
                      <li><strong>Kamera 2</strong>: Webcam USB eksternal, CamLink, atau kamera HP (via DroidCam/Camo) untuk Narasumber.</li>
                      <li>Jika hanya memiliki 1 kamera, sistem otomatis mengaktifkan mode sudut alternatif atau simulasi studio tamu virtual.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <h5 className="font-bold text-emerald-400">Integrasi OBS Studio / vMix:</h5>
                    <p className="text-[11px] text-white/70">
                      Gunakan fitur <em>Window Capture</em> atau <em>Browser Source</em> di OBS untuk menyiarkan langsung tampilan Split 50:50 Host & Narasumber ke YouTube KUA Gerung atau Facebook Live.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Card */}
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-[11px] text-white/60 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#D4AF37]">Mode Aktif:</span>
                <span className="font-mono uppercase font-bold text-emerald-400">{streamLayout}</span>
              </div>
              <p>
                Rekaman video secara otomatis menggabungkan kamera Host dan Narasumber beserta running teks topik siaran.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
