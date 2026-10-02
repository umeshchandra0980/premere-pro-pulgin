import React, { useEffect, useMemo, type CSSProperties } from 'react';

import { useCaptionContext } from '../../context/CaptionContext';
import { resolveFontStack } from '../../data/mockCaptions';
import type { Caption, StyleSettings } from '../../types/caption';
import styles from './VideoPreviewBar.module.scss';

function formatTimecode(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const m = Math.floor(clamped / 60);
  const s = Math.floor(clamped % 60);
  const f = Math.floor((clamped % 1) * 30);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
}

function activeCaptionAt(captions: Caption[], t: number): Caption | null {
  return captions.find((c) => t >= c.startTime && t <= c.endTime) ?? null;
}

function buildCaptionStyle(settings: StyleSettings): CSSProperties {
  const stroke =
    settings.strokeWidth > 0
      ? `${settings.strokeWidth}px ${settings.strokeColor}`
      : undefined;

  const glow = settings.glowEnabled
    ? `0 0 ${settings.glowBlur * 0.4}px ${settings.glowColor}, 0 0 ${settings.glowBlur * 0.15}px ${settings.glowColor}`
    : undefined;

  const chalkboard = settings.chalkboardMode
    ? {
        background: 'rgba(20, 24, 18, 0.72)',
        padding: '6px 14px',
        borderRadius: 4,
      }
    : {};

  return {
    fontFamily: resolveFontStack(settings.fontFamily),
    fontSize: `clamp(14px, ${settings.fontSize * 0.42}px, 36px)`,
    fontWeight: settings.fontWeight,
    color: settings.fillColor,
    WebkitTextStroke: stroke,
    textShadow: glow,
    backgroundImage: settings.gradientEnabled
      ? `linear-gradient(90deg, ${settings.fillColor}, ${settings.glowColor || settings.fillColor})`
      : undefined,
    WebkitBackgroundClip: settings.gradientEnabled ? 'text' : undefined,
    backgroundClip: settings.gradientEnabled ? 'text' : undefined,
    ...chalkboard,
  };
}

export interface VideoPreviewBarProps {
  onPlayToggle?: (playing: boolean) => void;
  onFullscreen?: () => void;
}

const THUMB_COUNT = 6;
const TICK_MS = 100;
const TICK_SEC = TICK_MS / 1000;

export function VideoPreviewBar({
  onPlayToggle,
  onFullscreen,
}: VideoPreviewBarProps) {
  const {
    currentPlaybackTime,
    setCurrentPlaybackTime,
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    duration,
    captions,
    styleSettings,
  } = useCaptionContext();

  useEffect(() => {
    if (!isPlaying) return;

    const id = window.setInterval(() => {
      setCurrentPlaybackTime((prev) => {
        const next = prev + TICK_SEC;
        if (next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [isPlaying, duration, setCurrentPlaybackTime, setIsPlaying]);

  const activeThumb = useMemo(() => {
    if (duration <= 0) return 0;
    return Math.min(
      THUMB_COUNT - 1,
      Math.floor((currentPlaybackTime / duration) * THUMB_COUNT),
    );
  }, [currentPlaybackTime, duration]);

  const caption = useMemo(
    () => activeCaptionAt(captions, currentPlaybackTime),
    [captions, currentPlaybackTime],
  );

  const captionCss = useMemo(
    () => buildCaptionStyle(styleSettings),
    [styleSettings],
  );

  const handlePlayToggle = () => {
    const next = !isPlaying;
    if (next && currentPlaybackTime >= duration) {
      setCurrentPlaybackTime(0);
    }
    setIsPlaying(next);
    onPlayToggle?.(next);
  };

  const seekToThumb = (index: number) => {
    if (duration <= 0) return;
    setCurrentPlaybackTime((index / THUMB_COUNT) * duration);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.stage} data-chalkboard={styleSettings.chalkboardMode}>
        <div className={styles.filmGrain} aria-hidden />
        <div className={styles.movieBg} aria-hidden>
          <div className={styles.sky} />
          <div className={styles.horizon} />
          <div className={styles.subject} />
        </div>

        <div className={styles.captionLayer} aria-live="polite">
          {caption ? (
            <p
              className={`${styles.captionLine} ${styles[`anim_${styleSettings.selectedAnimation.replace(/-/g, '_')}`] ?? ''}`}
              style={captionCss}
            >
              {caption.words.map((word, i) => {
                const isActive =
                  currentPlaybackTime >= word.start &&
                  currentPlaybackTime <= word.end;
                const isPast = currentPlaybackTime > word.end;
                return (
                  <span
                    key={`${caption.id}-${i}`}
                    className={`${styles.word} ${isActive ? styles.wordActive : ''} ${isPast ? styles.wordPast : ''}`}
                  >
                    {word.text}{' '}
                  </span>
                );
              })}
            </p>
          ) : (
            <p className={styles.idleHint}>Play to preview captions on movie</p>
          )}
        </div>

        <div className={styles.stageMeta}>
          <span>{styleSettings.fontFamily}</span>
          <span>{styleSettings.fontSize}px</span>
          <span>{styleSettings.selectedAnimation}</span>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={styles.thumbs} aria-label="Scrub filmstrip">
          {Array.from({ length: THUMB_COUNT }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.thumb} ${i === activeThumb ? styles.thumbActive : ''}`}
              style={{
                background: `linear-gradient(135deg, hsl(${210 + i * 12} 28% ${18 + i * 4}%) ${20 + i * 8}%, var(--c-border))`,
              }}
              aria-label={`Seek to segment ${i + 1}`}
              onClick={() => seekToThumb(i)}
            />
          ))}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={handlePlayToggle}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                <rect x="3" y="2" width="3" height="10" rx="0.5" />
                <rect x="8" y="2" width="3" height="10" rx="0.5" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                <path d="M4 2.5v9l8-4.5-8-4.5z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 5h2.5L8 2.5v9L4.5 9H2V5z" fill="currentColor" />
                <path
                  d="M10 5l3 4M13 5l-3 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 5h2.5L8 2.5v9L4.5 9H2V5z" fill="currentColor" />
                <path
                  d="M10 5.5c.8.6.8 2.4 0 3M11.5 4c1.4 1.2 1.4 4.8 0 6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <span className={styles.timecode}>
            {formatTimecode(currentPlaybackTime)} / {formatTimecode(duration)}
          </span>

          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Fullscreen"
            onClick={() => {
              onFullscreen?.();
              console.log('[VideoPreviewBar] fullscreen requested');
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 5V2h3M9 2h3v3M12 9v3H9M5 12H2V9"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
