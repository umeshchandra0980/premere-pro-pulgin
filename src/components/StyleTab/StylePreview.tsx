import React, { useEffect, useRef } from 'react';

import { CAPTION_FONTS } from '../../data/mockCaptions';
import type { StyleSettings } from '../../types/caption';
import styles from './StylePreview.module.scss';

export interface StylePreviewProps {
  settings: StyleSettings;
  /** Bump to re-run entrance animation (Apply / Update). */
  animKey: number;
}

function splitUnits(text: string, animateBy: StyleSettings['animateBy']): string[] {
  if (animateBy === 'letters') return [...text];
  if (animateBy === 'words') return text.split(/(\s+)/);
  return [text];
}

export function StylePreview({ settings, animKey }: StylePreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const font =
    CAPTION_FONTS.find((f) => f.id === settings.fontFamily)?.stack ??
    settings.fontFamily;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const units = root.querySelectorAll<HTMLElement>(`.${styles.unit}`);
    const n = Math.max(units.length, 1);
    const step =
      (settings.animDuration * (1 - settings.overlap / 100)) / n;
    const rad = (settings.direction * Math.PI) / 180;
    const dx = Math.sin(rad) * settings.distance;
    const dy = Math.cos(rad) * settings.distance;

    units.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.filter = 'blur(8px)';
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = `all ${settings.animDuration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * step * 1000}ms`;
          el.style.opacity = '1';
          el.style.filter = 'blur(0)';
          el.style.transform = 'translate(0, 0)';
        });
      });
    });
  }, [animKey, settings.animDuration, settings.overlap, settings.direction, settings.distance, settings.animateBy, settings.styleName]);

  const glow = settings.glowEnabled
    ? `0 0 ${settings.glowBlur}px ${settings.glowColor}, 0 0 ${settings.glowBlur * 2}px ${settings.glowColor}66`
    : 'none';

  const units = splitUnits(settings.styleName || 'TypeMotion', settings.animateBy);

  return (
    <div
      className={`${styles.preview} ${settings.chalkboardMode ? styles.checker : ''}`}
      onMouseEnter={(e) => {
        if (!settings.pauseOnHover) return;
        e.currentTarget.querySelectorAll<HTMLElement>(`.${styles.unit}`).forEach((u) => {
          (u.style as CSSStyleDeclaration & { transitionPlayState?: string }).transitionPlayState =
            'paused';
        });
      }}
      onMouseLeave={(e) => {
        e.currentTarget.querySelectorAll<HTMLElement>(`.${styles.unit}`).forEach((u) => {
          (u.style as CSSStyleDeclaration & { transitionPlayState?: string }).transitionPlayState =
            'running';
        });
      }}
    >
      <div
        ref={rootRef}
        className={styles.live}
        style={{
          fontFamily: font,
          fontWeight: settings.fontWeight,
          color: settings.gradientEnabled ? 'transparent' : settings.fillColor,
          background: settings.gradientEnabled
            ? 'linear-gradient(90deg, #60A5FA, #22D3AA)'
            : 'none',
          WebkitBackgroundClip: settings.gradientEnabled ? 'text' : undefined,
          backgroundClip: settings.gradientEnabled ? 'text' : undefined,
          textShadow: glow,
          WebkitTextStroke:
            settings.strokeWidth > 0
              ? `${settings.strokeWidth}px ${settings.strokeColor}`
              : undefined,
        }}
      >
        {units.map((u, i) => (
          <span key={`${animKey}-${i}`} className={styles.unit}>
            {u === ' ' ? '\u00A0' : u}
          </span>
        ))}
      </div>
    </div>
  );
}
