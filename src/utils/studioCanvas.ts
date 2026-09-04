import { StreamLayout, StudioParticipantProfile, PipPosition, CameraPanOffset, PrimaryCameraRole, LowerThirdPosition } from '../types/studio';

/**
 * Creates an animated virtual studio feed for Host
 */
export function createVirtualHostStudio(
  canvas: HTMLCanvasElement,
  hostProfile: StudioParticipantProfile
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let animId: number;
  let frame = 0;

  const render = () => {
    frame++;
    const w = canvas.width;
    const h = canvas.height;

    // Background gradient (KUA Green & Deep Charcoal)
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0a140d');
    bg.addColorStop(0.6, '#0f1c12');
    bg.addColorStop(1, '#060a07');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Studio Spotlight
    const spot = ctx.createRadialGradient(w / 2, h / 2.2, 30, w / 2, h / 2.2, 360);
    spot.addColorStop(0, 'rgba(0, 104, 55, 0.35)');
    spot.addColorStop(0.6, 'rgba(212, 175, 55, 0.15)');
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);

    // Islamic Geometric Ring Motif
    ctx.save();
    ctx.translate(w / 2, h / 2.2);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 120 + Math.sin(frame * 0.03) * 6, 0, Math.PI * 2);
    ctx.stroke();

    // Host Silhouette
    ctx.fillStyle = 'rgba(240, 240, 240, 0.85)';
    ctx.beginPath();
    ctx.arc(0, -35, 42, 0, Math.PI * 2); // Head / Peci
    ctx.fill();

    // Peci / Kopiah accent
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.roundRect(-30, -78, 60, 26, 4);
    ctx.fill();

    // Body
    ctx.fillStyle = 'rgba(240, 240, 240, 0.85)';
    ctx.beginPath();
    ctx.ellipse(0, 65, 82, 58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Audio Equalizer Bar
    const barCount = 18;
    const startX = w / 2 - (barCount * 14) / 2;
    const baseY = h - 60;
    for (let i = 0; i < barCount; i++) {
      const barH = 8 + Math.abs(Math.sin(frame * 0.08 + i * 0.4) * 32);
      ctx.fillStyle = '#006837';
      ctx.fillRect(startX + i * 14, baseY - barH, 8, barH);
    }

    // Host Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎙️ ${hostProfile.name.toUpperCase()}`, w / 2, h - 90);
    ctx.fillStyle = '#D4AF37';
    ctx.font = '13px sans-serif';
    ctx.fillText(hostProfile.title || 'HOST KUA GERUNG (STUDIO VIRTUAL)', w / 2, h - 70);

    animId = requestAnimationFrame(render);
  };

  animId = requestAnimationFrame(render);
  return () => cancelAnimationFrame(animId);
}

/**
 * Creates an animated virtual studio feed for Narasumber
 */
export function createVirtualGuestStudio(
  canvas: HTMLCanvasElement,
  guestProfile: StudioParticipantProfile
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let animId: number;
  let frame = 0;

  const render = () => {
    frame++;
    const w = canvas.width;
    const h = canvas.height;

    // Background gradient (Warm Sasak Amber & Slate)
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#19130a');
    bg.addColorStop(0.6, '#21180d');
    bg.addColorStop(1, '#0c0a06');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Studio Spotlight
    const spot = ctx.createRadialGradient(w / 2, h / 2.2, 30, w / 2, h / 2.2, 360);
    spot.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
    spot.addColorStop(0.6, 'rgba(180, 83, 9, 0.15)');
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);

    // Guest Ring Motif
    ctx.save();
    ctx.translate(w / 2, h / 2.2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 120 + Math.cos(frame * 0.03) * 6, 0, Math.PI * 2);
    ctx.stroke();

    // Guest Silhouette
    ctx.fillStyle = 'rgba(245, 235, 220, 0.85)';
    ctx.beginPath();
    ctx.arc(0, -35, 42, 0, Math.PI * 2); // Head
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 65, 82, 58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Audio Equalizer Bar
    const barCount = 18;
    const startX = w / 2 - (barCount * 14) / 2;
    const baseY = h - 60;
    for (let i = 0; i < barCount; i++) {
      const barH = 8 + Math.abs(Math.sin(frame * 0.08 + i * 0.4 + 1.2) * 32);
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(startX + i * 14, baseY - barH, 8, barH);
    }

    // Guest Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`👤 ${guestProfile.name.toUpperCase()}`, w / 2, h - 90);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '13px sans-serif';
    ctx.fillText(guestProfile.title || 'NARASUMBER PODCAST (STUDIO VIRTUAL)', w / 2, h - 70);

    animId = requestAnimationFrame(render);
  };

  animId = requestAnimationFrame(render);
  return () => cancelAnimationFrame(animId);
}

/**
 * Composite rendering of Dual Camera Studio for Recording & Snapshots
 */
export function drawCompositeFrame(
  targetCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layout: StreamLayout,
  videoHost: HTMLVideoElement | null,
  videoGuest: HTMLVideoElement | null,
  isHostMirrored: boolean,
  isGuestMirrored: boolean,
  hostProfile: StudioParticipantProfile,
  guestProfile: StudioParticipantProfile,
  podcastTopic: string,
  dateString: string,
  splitRatio: number = 50,
  pipPosition?: PipPosition,
  guestPan?: CameraPanOffset,
  primaryRole: PrimaryCameraRole = 'guest',
  hostBannerPos?: LowerThirdPosition,
  guestBannerPos?: LowerThirdPosition
) {
  // Clear & dark studio background
  targetCtx.fillStyle = '#0a0d09';
  targetCtx.fillRect(0, 0, width, height);

  const drawMirroredVideo = (
    video: HTMLVideoElement,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
    mirrored: boolean,
    pan?: CameraPanOffset
  ) => {
    targetCtx.save();
    targetCtx.beginPath();
    targetCtx.rect(dx, dy, dw, dh);
    targetCtx.clip();

    if (pan) {
      const zoom = pan.zoom || 1;
      const offsetX = (pan.panX / 100) * dw;
      const offsetY = (pan.panY / 100) * dh;
      const scaledW = dw * zoom;
      const scaledH = dh * zoom;
      const posX = dx + (dw - scaledW) / 2 + offsetX;
      const posY = dy + (dh - scaledH) / 2 + offsetY;

      if (mirrored) {
        targetCtx.translate(posX + scaledW, posY);
        targetCtx.scale(-1, 1);
        targetCtx.drawImage(video, 0, 0, scaledW, scaledH);
      } else {
        targetCtx.drawImage(video, posX, posY, scaledW, scaledH);
      }
    } else {
      if (mirrored) {
        targetCtx.translate(dx + dw, dy);
        targetCtx.scale(-1, 1);
        targetCtx.drawImage(video, 0, 0, dw, dh);
      } else {
        targetCtx.drawImage(video, dx, dy, dw, dh);
      }
    }
    targetCtx.restore();
  };

  const isGuestPrimary = primaryRole === 'guest';
  const mainVideo = isGuestPrimary ? videoGuest : videoHost;
  const mainMirrored = isGuestPrimary ? isGuestMirrored : isHostMirrored;
  const secondaryVideo = isGuestPrimary ? videoHost : videoGuest;
  const secondaryMirrored = isGuestPrimary ? isHostMirrored : isGuestMirrored;
  const mainProfile = isGuestPrimary ? guestProfile : hostProfile;
  const secondaryProfile = isGuestPrimary ? hostProfile : guestProfile;

  if (layout === 'split') {
    const ratio = Math.max(0.2, Math.min(0.8, (splitRatio || 50) / 100));
    const leftW = width * ratio;
    const rightW = width - leftW;

    if (mainVideo && mainVideo.readyState >= 2) {
      drawMirroredVideo(mainVideo, 0, 0, leftW, height, mainMirrored);
    }
    if (secondaryVideo && secondaryVideo.readyState >= 2) {
      drawMirroredVideo(secondaryVideo, leftW, 0, rightW, height, secondaryMirrored, guestPan);
    }

    // Seamless join between left and right without dividing line

    // Left Slot Badge (Kamera Utama)
    targetCtx.fillStyle = isGuestPrimary ? 'rgba(212, 175, 55, 0.92)' : 'rgba(0, 104, 55, 0.9)';
    targetCtx.fillRect(16, 20, 240, 34);
    targetCtx.fillStyle = isGuestPrimary ? '#000000' : '#FFFFFF';
    targetCtx.font = 'bold 12px sans-serif';
    targetCtx.fillText(
      isGuestPrimary
        ? `👤 UTAMA: ${guestProfile.name.slice(0, 18)}`
        : `🎙️ HOST: ${hostProfile.name.slice(0, 18)}`,
      26,
      42
    );

    // Right Slot Badge (Kamera Kedua)
    targetCtx.fillStyle = isGuestPrimary ? 'rgba(0, 104, 55, 0.9)' : 'rgba(212, 175, 55, 0.92)';
    targetCtx.fillRect(leftW + 16, 20, 240, 34);
    targetCtx.fillStyle = isGuestPrimary ? '#FFFFFF' : '#000000';
    targetCtx.font = 'bold 12px sans-serif';
    targetCtx.fillText(
      isGuestPrimary
        ? `🎙️ KAMERA 2: ${hostProfile.name.slice(0, 18)}`
        : `👤 NARASUMBER: ${guestProfile.name.slice(0, 18)}`,
      leftW + 26,
      42
    );
  } else if (layout === 'pip') {
    // 1. Kamera Utama (Full Screen background: Narasumber jika isGuestPrimary)
    if (mainVideo && mainVideo.readyState >= 2) {
      drawMirroredVideo(mainVideo, 0, 0, width, height, mainMirrored);
    }

    // 2. Kamera Kedua (Inset PiP: Host jika isGuestPrimary)
    if (secondaryVideo && secondaryVideo.readyState >= 2) {
      const pipScale = pipPosition?.size === 'small' ? 0.24 : pipPosition?.size === 'large' ? 0.40 : 0.32;
      const pipW = width * pipScale;
      const pipH = pipW * (9 / 16);
      
      const pipX = pipPosition
        ? Math.max(8, Math.min(width - pipW - 8, (pipPosition.x / 100) * width))
        : width - pipW - 24;
      const pipY = pipPosition
        ? Math.max(8, Math.min(height - pipH - 56, (pipPosition.y / 100) * height))
        : height - pipH - 70;

      targetCtx.save();
      targetCtx.strokeStyle = isGuestPrimary ? '#34D399' : '#D4AF37';
      targetCtx.lineWidth = 4;
      targetCtx.shadowColor = 'rgba(0,0,0,0.8)';
      targetCtx.shadowBlur = 12;
      targetCtx.strokeRect(pipX, pipY, pipW, pipH);
      targetCtx.restore();

      drawMirroredVideo(secondaryVideo, pipX, pipY, pipW, pipH, secondaryMirrored, guestPan);

      // Label on PiP Box (Kamera Kedua)
      targetCtx.fillStyle = 'rgba(0,0,0,0.85)';
      targetCtx.fillRect(pipX, pipY + pipH - 24, pipW, 24);
      targetCtx.fillStyle = isGuestPrimary ? '#34D399' : '#F59E0B';
      targetCtx.font = 'bold 11px sans-serif';
      targetCtx.fillText(
        isGuestPrimary
          ? `🎙️ KAMERA 2 (HOST): ${secondaryProfile.name.slice(0, 16)}`
          : `👤 KAMERA 2 (TAMU): ${secondaryProfile.name.slice(0, 16)}`,
        pipX + 8,
        pipY + pipH - 8
      );
    }
  } else if (layout === 'solo-host') {
    if (videoHost && videoHost.readyState >= 2) {
      drawMirroredVideo(videoHost, 0, 0, width, height, isHostMirrored);
    }
  } else if (layout === 'solo-guest') {
    if (videoGuest && videoGuest.readyState >= 2) {
      drawMirroredVideo(videoGuest, 0, 0, width, height, isGuestMirrored, guestPan);
    }
  }

  // Draw Lower Third Banners (above ticker)
  const tickerH = 46;
  const tickerY = height - tickerH;
  const ltY = tickerY - 78;

  const drawHostLowerThirdBox = (x: number, y: number, name: string, title: string) => {
    targetCtx.save();
    const boxW = 340;
    const boxH = 68;
    targetCtx.fillStyle = 'rgba(10, 15, 12, 0.94)';
    targetCtx.fillRect(x, y, boxW, boxH);

    // Left accent bar: Emerald
    targetCtx.fillStyle = '#10B981';
    targetCtx.fillRect(x, y, 5, boxH);

    // Top subtle highlight
    targetCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    targetCtx.fillRect(x + 5, y, boxW - 5, 1);

    // Line 1: Name
    targetCtx.fillStyle = '#FFFFFF';
    targetCtx.font = 'bold 12px sans-serif';
    targetCtx.textAlign = 'left';
    targetCtx.fillText(`🎙️ HOST: ${name.toUpperCase().slice(0, 24)}`, x + 14, y + 20);

    // Line 2: Title
    targetCtx.fillStyle = '#D4AF37';
    targetCtx.font = '10px sans-serif';
    targetCtx.fillText(title.slice(0, 38), x + 14, y + 36);

    // Divider
    targetCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    targetCtx.fillRect(x + 14, y + 43, boxW - 28, 1);

    // Line 3: Hari, Tanggal, Bulan, Tahun dan Waktu tepat di bawah Host
    targetCtx.fillStyle = '#F59E0B';
    targetCtx.font = 'bold 10px sans-serif';
    targetCtx.fillText(`🗓️ ${dateString.toUpperCase()}`, x + 14, y + 58);
    targetCtx.restore();
  };

  const drawGuestLowerThirdBox = (x: number, y: number, name: string, title: string) => {
    targetCtx.save();
    const boxW = 320;
    const boxH = 48;
    targetCtx.fillStyle = 'rgba(10, 15, 12, 0.94)';
    targetCtx.fillRect(x, y, boxW, boxH);

    // Left accent bar: Gold
    targetCtx.fillStyle = '#D4AF37';
    targetCtx.fillRect(x, y, 5, boxH);

    // Top subtle highlight
    targetCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    targetCtx.fillRect(x + 5, y, boxW - 5, 1);

    // Name
    targetCtx.fillStyle = '#FFFFFF';
    targetCtx.font = 'bold 12px sans-serif';
    targetCtx.textAlign = 'left';
    targetCtx.fillText(`👤 TAMU: ${name.toUpperCase().slice(0, 24)}`, x + 14, y + 20);

    // Title / Position
    targetCtx.fillStyle = '#D4AF37';
    targetCtx.font = '10px sans-serif';
    targetCtx.textAlign = 'left';
    targetCtx.fillText(title.slice(0, 38), x + 14, y + 38);
    targetCtx.restore();
  };

  const defaultHostX = 16;
  const defaultHostY = ltY;
  const defaultGuestX = Math.min(width - 336, width * 0.52);
  const defaultGuestY = tickerY - 58;

  const hX = hostBannerPos ? Math.max(8, Math.min(width - 348, (hostBannerPos.x / 100) * width)) : defaultHostX;
  const hY = hostBannerPos ? Math.max(8, Math.min(height - 126, (hostBannerPos.y / 100) * height)) : defaultHostY;
  const gX = guestBannerPos ? Math.max(8, Math.min(width - 336, (guestBannerPos.x / 100) * width)) : defaultGuestX;
  const gY = guestBannerPos ? Math.max(8, Math.min(height - 110, (guestBannerPos.y / 100) * height)) : defaultGuestY;

  if (layout === 'pip' || layout === 'split') {
    // Both Host and Narasumber displayed at their draggable positions
    drawGuestLowerThirdBox(gX, gY, guestProfile.name, guestProfile.title);
    drawHostLowerThirdBox(hX, hY, hostProfile.name, hostProfile.title);
  } else if (layout === 'solo-host') {
    drawHostLowerThirdBox(hX, hY, hostProfile.name, hostProfile.title);
  } else if (layout === 'solo-guest') {
    drawGuestLowerThirdBox(gX, gY, guestProfile.name, guestProfile.title);
  }

  // Bottom Running Teks Bar
  targetCtx.fillStyle = 'rgba(10, 22, 13, 0.95)';
  targetCtx.fillRect(0, tickerY, width, tickerH);

  targetCtx.fillStyle = '#D4AF37';
  targetCtx.fillRect(0, tickerY, width, 3);

  // Badge Red: TOPIK PODCAST
  const bW = 160;
  targetCtx.fillStyle = '#b91c1c';
  targetCtx.fillRect(0, tickerY, bW, tickerH);
  targetCtx.fillStyle = '#FFFFFF';
  targetCtx.font = 'bold 12px sans-serif';
  targetCtx.textAlign = 'center';
  targetCtx.fillText('🔴 TOPIK PODCAST', bW / 2, tickerY + 28);

  // Topic Text spans cleanly across bottom bar
  targetCtx.fillStyle = '#FFFFFF';
  targetCtx.font = 'bold 13px sans-serif';
  targetCtx.textAlign = 'left';
  targetCtx.fillText(
    `✦ ${podcastTopic.toUpperCase()} ✦ KUA KECAMATAN GERUNG - KEMENAG LOMBOK BARAT ✦`,
    bW + 18,
    tickerY + 28
  );
}
